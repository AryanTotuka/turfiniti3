import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, Store } from 'lucide-react';
import { checkRateLimit, getRateLimitResetTime } from '../utils/rateLimit';

export default function Signup() {
    const [role, setRole] = useState('player');
    const { login } = useAuth();
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
        // Rate Limit Check
        if (!checkRateLimit('signup_attempt', 3, 3600000)) { // 3 signups per hour (prevent mass account creation)
            const remaining = Math.ceil(getRateLimitResetTime('signup_attempt', 3600000) / 60000); // Show in minutes
            setError(`Too many account creation attempts. Please wait ${remaining} minutes.`);
            return;
        }
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Create User in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Prepare User Data
            const userData = {
                uid: user.uid,
                name: role === 'player' ? name : businessName,
                email: email,
                phone: phone,
                role: role,
                createdAt: serverTimestamp()
            };

            // 3. Save to Firestore
            await setDoc(doc(db, "users", user.uid), userData);

            // 4. Update Local Auth Context (Optional: AuthContext should ideally listen to onAuthStateChanged)
            login(userData);

            // 5. Redirect
            if (location.state?.from && location.state?.bookingData) {
                navigate(location.state.from, { state: location.state.bookingData });
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error("Signup Error:", err);
            setError(err.message);
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

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
