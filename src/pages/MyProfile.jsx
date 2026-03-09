
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Mail, Phone, Save, X, Edit2 } from 'lucide-react';

export default function MyProfile() {
    const { user, loading: authLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const userRef = doc(db, "users", user.uid || user.id);

            // Update Firestore
            await updateDoc(userRef, {
                name: formData.name,
                phone: formData.phone
            });

            // In a real app, you might also want to update the local AuthContext state here manually
            // or trigger a reload if the context doesn't listen to realtime updates deeply enough for this.
            // For now, we assume simple update success.

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return <div className="section container" style={{ paddingTop: '8rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return (
            <div className="section container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>Please login to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="section container" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem' }}>My Profile</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                        >
                            <Edit2 size={16} /> Edit Profile
                        </button>
                    )}
                </div>

                {message.text && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: message.type === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '50%',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <User size={48} color="var(--primary)" />
                    </div>
                    <span style={{
                        background: user.role === 'owner' ? '#dbeafe' : 'var(--bg-secondary)',
                        color: user.role === 'owner' ? '#1e40af' : 'var(--text-secondary)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}>
                        {user.role ? user.role.toUpperCase() : 'USER'}
                    </span>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter specific number"
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                            <div style={{ position: 'relative', opacity: 0.7 }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#f8fafc', cursor: 'not-allowed' }}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Email cannot be changed.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => { setIsEditing(false); setMessage({ type: '', text: '' }); }}
                                className="btn btn-outline"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <X size={18} /> Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn btn-primary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                            <User size={20} color="var(--text-secondary)" />
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Full Name</p>
                                <p style={{ fontWeight: 500 }}>{user.name}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                            <Mail size={20} color="var(--text-secondary)" />
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email</p>
                                <p style={{ fontWeight: 500 }}>{user.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                            <Phone size={20} color="var(--text-secondary)" />
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone</p>
                                <p style={{ fontWeight: 500 }}>{user.phone || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
