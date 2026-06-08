import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Store } from 'lucide-react';
import { checkRateLimit, getRateLimitResetTime } from '../utils/rateLimit';

export default function Signup() {
    const [role, setRole] = useState('player');
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        // Rate Limit Check (Disabled for testing)
        // if (!checkRateLimit('signup_attempt', 3, 3600000)) { 
        //     const remaining = Math.ceil(getRateLimitResetTime('signup_attempt', 3600000) / 60000);
        //     setError(`Too many account creation attempts. Please wait ${remaining} minutes.`);
        //     return;
        // }
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = {
                name: role === 'player' ? name : businessName,
                email: email,
                password: password,
                phone: phone,
                role: role
            };

            await register(userData);

            if (location.state?.from && location.state?.bookingData) {
                navigate(location.state.from, { state: location.state.bookingData });
            } else {
                navigate(role === 'owner' ? '/owner-dashboard' : '/');
            }

        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.response?.data?.msg || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section container signup-page" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            paddingTop: '8rem'
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .signup-page {
                        padding-top: 6rem !important;
                        padding-left: 1rem !important;
                        padding-right: 1rem !important;
                    }
                }
            `}</style>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'white',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.75rem' }}>Create Account</h2>

                {error && (
                    <div style={{ padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    background: 'var(--bg-secondary)',
                    padding: '0.25rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => setRole('player')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            background: role === 'player' ? 'white' : 'transparent',
                            color: role === 'player' ? 'var(--primary)' : 'var(--text-secondary)',
                            fontWeight: 600,
                            boxShadow: role === 'player' ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <User size={16} /> Player
                    </button>
                    <button
                        onClick={() => setRole('owner')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            background: role === 'owner' ? 'white' : 'transparent',
                            color: role === 'owner' ? 'var(--primary)' : 'var(--text-secondary)',
                            fontWeight: 600,
                            boxShadow: role === 'owner' ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <Store size={16} /> Partner
                    </button>
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {role === 'player' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                    )}

                    {role === 'owner' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Business Name</label>
                            <input
                                type="text"
                                placeholder="Turf Kings Arena"
                                required
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone Number</label>
                        <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', opacity: loading ? 0.7 : 1 }} disabled={loading}>
                        {loading ? 'Creating Account...' : `Sign Up as ${role === 'player' ? 'Player' : 'Partner'}`}
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
                            id="google-signup-btn"
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
                            Sign up with Google
                        </button>
                    </>
                )}

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
