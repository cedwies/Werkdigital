import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    // Username und Passwort im State halten
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate(); // Für Redirects nach Login

    const login = async e => {
        e.preventDefault();
        try {
            // Login-Request an Backend
            const { data } = await axios.post('/auth/login', { username, password });

            // Token speichern → bleibt auch nach Refresh im localStorage
            localStorage.setItem('token', data.token);

            // Nach erfolgreichem Login weiter zum Dashboard
            nav('/');
        } catch (err) {
            alert('Login fehlgeschlagen'); // einfache Fehlerbehandlung
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={login} style={styles.form}>
                <h1 style={styles.heading}>Login</h1>

                {/* Username-Feld */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={styles.input}
                />

                {/* Passwort-Feld */}
                <input
                    type="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={styles.input}
                />

                {/* Login-Button */}
                <button type="submit" style={styles.button}>
                    Anmelden
                </button>
            </form>
        </div>
    );
}

// Einfaches Inline-Styling → sieht modern aus, reicht fürs Projekt
const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f7fa', // hellgrau-blau Hintergrund
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '2rem',
        borderRadius: '10px',
        background: '#ffffff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        minWidth: '280px',
    },
    heading: {
        marginBottom: '1rem',
        fontSize: '1.5rem',
        textAlign: 'center',
        color: '#333',
    },
    input: {
        padding: '10px',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        padding: '10px',
        fontSize: '1rem',
        background: '#2a7ae2', // Werkdigital-Blau :)
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};
