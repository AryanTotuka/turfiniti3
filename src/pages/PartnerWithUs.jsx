import { useState } from 'react';
import { Send, CheckCircle, Handshake, TrendingUp, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function PartnerWithUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        venueName: '',
        location: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await api.post('/partners', formData);
            setIsSubmitted(true);
        } catch (err) {
            console.error("Error submitting partner request:", err);
            const errMsg = err.response?.data?.msg || err.response?.data?.message || err.message;
            setError(`Error: ${errMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="section container partner-page" style={{ paddingTop: '7rem', minHeight: '90vh' }}>
            <div className="partner-grid">

                {/* Left Content */}
                <div>
                    <h1 className="partner-heading" style={{ lineHeight: 1.1, marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--primary), #1e40af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Let’s Grow Together
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                        Join the fastest growing sports venue network. Streamline bookings, increase visibility, and maximize your revenue.
                    </p>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px', height: 'fit-content' }}>
                                <TrendingUp size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Increase Revenue</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Fill empty slots and reduce downtime with our advanced booking system.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px', height: 'fit-content' }}>
                                <Users size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Reach More Players</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Connect with thousands of sports enthusiasts looking for venues like yours.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '12px', height: 'fit-content' }}>
                                <Handshake size={24} color="var(--primary)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Seamless Management</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Manage slots, pricing, and bookings from a single intuitive dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <div className="partner-form-card" style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-color)'
                }}>
                    {!isSubmitted ? (
                        <>
                            <h2 style={{ marginBottom: '0.5rem' }}>Request a Call</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Fill in your details and our partnership team will get back to you shortly.</p>

                            {error && (
                                <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        required
                                        style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Venue Name</label>
                                    <input
                                        type="text"
                                        name="venueName"
                                        value={formData.venueName}
                                        onChange={handleChange}
                                        placeholder="e.g. Dream Turf Arena"
                                        required
                                        style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem' }}>Venue Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Sector 62, Noida"
                                        required
                                        style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none' }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary"
                                    style={{ marginTop: '1rem', width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', opacity: isLoading ? 0.7 : 1 }}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    {isLoading ? 'Sending...' : 'Request Call Back'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '50%' }}>
                                    <CheckCircle size={48} color="var(--primary)" />
                                </div>
                            </div>
                            <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Request Received!</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                Thank you for your interest, {formData.name}.<br />
                                Our team will reach out to you within 24 hours at {formData.phone}.
                            </p>
                            <Link to="/" className="btn btn-outline">Return to Home</Link>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .partner-page {
                    padding-top: 7rem;
                }
                .partner-grid {
                    display: flex;
                    gap: 4rem;
                    align-items: center;
                }
                .partner-grid > div {
                    flex: 1;
                    width: 100%;
                }
                .partner-heading {
                    font-size: 3.5rem;
                }
                .partner-form-card {
                    padding: 3rem;
                }
                @media (max-width: 992px) {
                    .partner-grid {
                        flex-direction: column;
                        gap: 2.5rem;
                    }
                    .partner-heading {
                        font-size: 2.5rem;
                    }
                }
                @media (max-width: 768px) {
                    .partner-page {
                        padding-top: 5.5rem !important;
                    }
                    .partner-heading {
                        font-size: 2rem;
                    }
                    .partner-form-card {
                        padding: 1.75rem;
                    }
                }
                @media (max-width: 480px) {
                    .partner-heading {
                        font-size: 1.75rem;
                    }
                    .partner-form-card {
                        padding: 1.25rem;
                    }
                }
            `}</style>
        </div>
    );
}
