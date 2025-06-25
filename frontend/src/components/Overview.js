import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
    // Aktuelles Datum (im Format YYYY-MM-DD)
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    // CheckIn-Liste für ausgewähltes Datum
    const [list, setList] = useState([]);

    // Token aus dem localStorage holen (zum Authentifizieren)
    const token = localStorage.getItem('token');
    const nav = useNavigate();

    // Wenn sich das Datum ändert → neue Daten holen
    useEffect(() => {
        axios
            .get(`/checkin?date=${date}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(({ data }) => setList(data))
            .catch(() => {
                // Wenn das Token nicht mehr gültig ist, zurück zum Login
                localStorage.removeItem('token');
                nav('/login');
            });
    }, [date, token, nav]);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Übersicht</h2>

            <div style={styles.controls}>
                {/* Zurück-Button zum Dashboard */}
                <button onClick={() => nav('/')} style={styles.button}>
                    ← Zurück zum Dashboard
                </button>

                {/* Datumsauswahl */}
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={styles.dateInput}
                />
            </div>

            {/* Liste der CheckIns anzeigen */}
            <ul style={styles.list}>
                {list.map(c => {
                    // Startzeit lokal anzeigen
                    const startLocal = new Date(c.startTime).toLocaleTimeString('de-DE', {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    // Endzeit oder – falls noch offen
                    const endLocal = c.endTime
                        ? new Date(c.endTime).toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : '–';

                    return (
                        <li key={c._id} style={styles.listItem}>
                            <span>{startLocal} – {endLocal}</span>{' '}
                            <span>({c.duration ?? 0} Min.)</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// Ganz schlichtes Styling, aber sauber formatiert
const styles = {
    container: {
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
    },
    heading: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    controls: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '2rem',
    },
    button: {
        padding: '0.6rem 1rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        background: '#fff',
        cursor: 'pointer',
    },
    dateInput: {
        padding: '0.6rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    list: {
        listStyle: 'none',
        paddingLeft: 0,
        lineHeight: '1.8',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.4rem 0',
        borderBottom: '1px solid #eee',
    },
};
