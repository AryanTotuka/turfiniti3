import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, Store } from 'lucide-react';
import { checkRateLimit, getRateLimitResetTime } from '../utils/rateLimit';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [role, setRole] = useState('player');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        // Rate Limit Check
        if (!checkRateLimit('login_attempt', 5, 60000)) { // 5 attempts per minute
            const remaining = Math.ceil(getRateLimitResetTime('login_attempt', 60000) / 1000);
            setError(`Too many login attempts. Please wait ${remaining} seconds.`);
            return;
        }
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user has a profile doc
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("Logged in user role:", userData.role);
            }

            if (location.state?.from && location.state?.bookingData) {
                navigate(location.state.from, { state: location.state.bookingData });
            } else {
                navigate(role === 'owner' ? '/owner-dashboard' : '/');
            }

        } catch (err) {
            console.error("Login Error:", err);
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section container login-page" style={{ paddingTop: '8rem', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <style>{`
                @media (max-width: 768px) {
                    .login-page {
                        padding-top: 6rem !important;
                        padding-left: 1rem !important;
                        padding-right: 1rem !important;
                    }
                }
            `}</style>
            <div style={{ maxWidth: '400px', width: '100%', background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
                <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Welcome Back</h1>

                {/* Role Toggle */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', padding: '0.25rem', background: '#f1f5f9', borderRadius: 'var(--radius-md)' }}>
                    <button
                        className={`btn ${role === 'player' ? 'btn-primary' : 'btn-text'}`}
                        style={{ flex: 1, borderRadius: 'var(--radius-sm)' }}
                        onClick={() => setRole('player')}
                    >
                        <User size={18} style={{ marginRight: '0.5rem' }} /> Player
                    </button>
                    <button
                        className={`btn ${role === 'owner' ? 'btn-primary' : 'btn-text'}`}
                        style={{ flex: 1, borderRadius: 'var(--radius-sm)' }}
                        onClick={() => setRole('owner')}
                    >
                        <Store size={18} style={{ marginRight: '0.5rem' }} /> Partner
                    </button>
                </div>

                {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</p>}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            required
                        />
                    </div>

                    <button disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
