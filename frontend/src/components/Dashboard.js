import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    // Merkt sich ob aktuell ein HO läuft
    const [hasOpen, setHasOpen] = useState(false);

    // Startzeit merken, falls HO läuft
    const [startTime, setStartTime] = useState(null);

    // Zeitstring im Format hh:mm oder hh:mm:ss
    const [timeString, setTimeString] = useState('');

    const nav = useNavigate();
    const token = localStorage.getItem('token');

    const logout = () => {
        localStorage.removeItem('token');
        nav('/login');
    };

    // Lädt bei Mount einmal die Daten (bzw. prüft ob ein offenes HO existiert)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `/checkin?date=${new Date().toISOString().slice(0, 10)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const openEntry = data.find(c => !c.endTime);
                if (openEntry) {
                    setHasOpen(true);
                    setStartTime(new Date(openEntry.startTime));
                } else {
                    setHasOpen(false);
                    setStartTime(null);
                }
            } catch {
                logout(); // Token wahrscheinlich ungültig -> rauswerfen
            }
        };

        fetchData();
    }, [token]);

    // Wenn ein HO läuft -> Timer starten
    useEffect(() => {
        if (!startTime) return;

        const updateTimer = () => {
            const now = new Date();
            const diffMs = now - startTime;

            const hours = Math.floor(diffMs / 3600000);
            const minutes = Math.floor((diffMs % 3600000) / 60000);
            const seconds = Math.floor((diffMs % 60000) / 1000);

            const pad = (n) => String(n).padStart(2, '0');
            setTimeString(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
        };

        updateTimer(); // direkt anzeigen, nicht erst nach 1 Sekunde
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval); // aufräumen beim Unmount
    }, [startTime]);

    // Start/Stop Logik für HO
    const action = async () => {
        const url = hasOpen ? '/checkin/stop' : '/checkin/start';
        const { data } = await axios.post(url, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!hasOpen) {
            // HO wurde gestartet -> Timer starten
            const start = new Date(data.startTime);
            setStartTime(start);
            setHasOpen(true);
        } else {
            // HO gestoppt -> Timer beenden
            setStartTime(null);
            setHasOpen(false);
            setTimeString('');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Dashboard</h2>

            <div style={styles.buttonGroup}>
                <button onClick={action} style={styles.button}>
                    {hasOpen ? 'HomeOffice beenden' : 'HomeOffice starten'}
                </button>
                <button onClick={logout} style={styles.button}>
                    Logout
                </button>
                <button onClick={() => nav('/overview')} style={styles.button}>
                    Übersicht
                </button>
            </div>

            {/* Datum + Uhrzeit + Timer nur wenn HO läuft */}
            {hasOpen && startTime && (
                <div style={styles.infoBox}>
                    <p style={styles.infoText}>
                        <strong>Startdatum:</strong>{' '}
                        {startTime.toLocaleDateString('de-DE')}
                    </p>
                    <p style={styles.infoText}>
                        <strong>Startzeit:</strong>{' '}
                        {startTime.toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                    <p style={styles.timer}>
                        🕒 {timeString}
                    </p>
                </div>
            )}
        </div>
    );
}

// Inline CSS – schnell, einfach, reicht für MVP
const styles = {
    container: {
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
    },
    heading: {
        fontSize: '1.5rem',
        marginBottom: '2rem',
        color: '#111',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '2rem',
    },
    button: {
        padding: '0.6rem 1rem',
        fontSize: '1rem',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    infoBox: {
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        display: 'inline-block',
        textAlign: 'left',
    },
    infoText: {
        margin: '0.3rem 0',
        fontSize: '1rem',
    },
    timer: {
        marginTop: '1rem',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
    },
};
