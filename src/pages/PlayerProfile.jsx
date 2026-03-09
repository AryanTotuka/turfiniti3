
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Phone, Mail, Calendar } from 'lucide-react';

export default function PlayerProfile() {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayer = async () => {
            setLoading(true);
            try {
                // Handle guest users or special IDs
                if (!id || id === 'guest' || id.startsWith('guest')) {
                    setPlayer({
                        name: 'Guest User',
                        email: 'N/A',
                        phone: 'N/A',
                        role: 'guest'
                    });
                    setLoading(false);
                    return;
                }

                const docRef = doc(db, "users", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPlayer({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.error("No such user document!");
                    setPlayer(null);
                }
            } catch (error) {
                console.error("Error fetching player:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayer();
    }, [id]);

    if (loading) {
        return (
            <div className="section container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <p>Loading player profile...</p>
            </div>
        );
    }

    if (!player) {
        return (
            <div className="section container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <h2>Player Not Found</h2>
                <p>The requested player profile could not be found.</p>
                <Link to="/owner-dashboard" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="section container" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
            <Link to="/owner-dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                &larr; Back to Dashboard
            </Link>

            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
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
                    <h1 style={{ marginBottom: '0.5rem' }}>{player.name || 'Unknown Player'}</h1>
                    <span style={{
                        background: player.role === 'owner' ? '#dbeafe' : 'var(--bg-secondary)',
                        color: player.role === 'owner' ? '#1e40af' : 'var(--text-secondary)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem'
                    }}>
                        {player.role ? player.role.charAt(0).toUpperCase() + player.role.slice(1) : 'Player'}
                    </span>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                        <Mail size={20} color="var(--text-secondary)" />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email</p>
                            <p style={{ fontWeight: 500 }}>{player.email}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                        <Phone size={20} color="var(--text-secondary)" />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone</p>
                            <p style={{ fontWeight: 500 }}>{player.phone || 'Not provided'}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                        <Calendar size={20} color="var(--text-secondary)" />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Member Since</p>
                            <p style={{ fontWeight: 500 }}>
                                {player.createdAt
                                    ? new Date(player.createdAt.seconds * 1000).toLocaleDateString()
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
