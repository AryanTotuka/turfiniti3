import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Store } from 'lucide-react';
import { checkRateLimit, getRateLimitResetTime } from '../utils/rateLimit';

export default function Login() {
    const { login, loginWithGoogle } = useAuth();
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
            const loggedInUser = await login(email, password);
            console.log("Logged in user role:", loggedInUser.role);

            if (location.state?.from && location.state?.bookingData) {
                navigate(location.state.from, { state: location.state.bookingData });
            } else {
                navigate(loggedInUser.role === 'owner' ? '/owner-dashboard' : '/');
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

                {role === 'player' && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                        </div>
                        <button
                            onClick={loginWithGoogle}
                            type="button"
                            id="google-login-btn"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)',
                                background: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: '#374151',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                            </svg>
                            Continue with Google
                        </button>
                    </>
                )}

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
