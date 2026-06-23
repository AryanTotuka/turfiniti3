import { useState, useEffect } from 'react';
import { useVenue } from '../context/VenueContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, IndianRupee, XCircle, AlertCircle } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

export default function MyBookings() {
    const { user } = useAuth();
    const { cancelBooking } = useVenue(); // Keeping context cancel for local sync
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            // ... existing fetch logic ...
            // Repetitive code, but ensuring we have the full component logic right
            setLoading(true);
            try {
                const res = await api.get('/bookings');
                setBookings(res.data.map(b => ({ ...b, id: b._id || b.id })));
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    if (!user) {
        return (
            <div className="section container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <h2>Please Log In</h2>
                <p>You need to be logged in to view your bookings.</p>
            </div>
        );
    }

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                // Update status in Backend instead of Firebase
                await api.put(`/bookings/${id}/cancel`);

                // Update local list to reflect change immediately
                setBookings(bookings.map(b =>
                    (b._id === id || b.id === id) ? { ...b, status: 'cancelled' } : b
                ));

                // Sync context if needed (optional since we rely on firestore now)
                cancelBooking(id);
                toast.success('Booking Cancelled Successfully!');
            } catch (error) {
                console.error("Error cancelling booking:", error);
                toast.error("Failed to cancel booking.");
            }
        }
    };

    return (
        <div className="section container my-bookings-page" style={{ paddingTop: '7rem', minHeight: '80vh' }}>
            <h1 className="my-bookings-title" style={{ marginBottom: '2rem' }}>My Bookings</h1>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading bookings...</p>
            ) : bookings.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)'
                }}>
                    <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5, display: 'inline-block' }} />
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Bookings Found</h3>
                    <p>You haven't made any bookings yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {bookings.map(booking => (
                        <div key={booking.id} className="booking-card" style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1.5rem',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ flex: '1 1 300px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                    <span style={{
                                        background: booking.status === 'cancelled' ? '#fee2e2' : '#dcfce7',
                                        color: booking.status === 'cancelled' ? '#b91c1c' : '#166534',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {booking.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                                    </span>
                                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{booking.venueName}</h3>
                                </div>

                                <div className="booking-meta" style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Calendar size={16} /> {booking.date}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={16} /> {booking.slots.length} Slots ({booking.slots.join(', ')})
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontWeight: 600 }}>
                                        <IndianRupee size={16} /> {booking.totalPrice}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleCancel(booking.id)}
                                disabled={booking.status === 'cancelled'}
                                className="btn btn-outline cancel-btn"
                                style={{
                                    borderColor: booking.status === 'cancelled' ? '#ccc' : '#ef4444',
                                    color: booking.status === 'cancelled' ? '#999' : '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.875rem',
                                    cursor: booking.status === 'cancelled' ? 'not-allowed' : 'pointer',
                                }}
                                onMouseOver={(e) => {
                                    if (booking.status !== 'cancelled') e.currentTarget.style.background = '#fef2f2';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <XCircle size={16} /> {booking.status === 'cancelled' ? 'Cancelled' : 'Cancel Booking'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .my-bookings-title {
                    font-size: 2rem;
                }
                @media (max-width: 768px) {
                    .my-bookings-page {
                        padding-top: 5.5rem !important;
                    }
                    .my-bookings-title {
                        font-size: 1.75rem;
                    }
                    .booking-meta {
                        gap: 0.75rem !important;
                        flex-direction: column;
                    }
                    .cancel-btn {
                        width: 100%;
                    }
                }
                @media (max-width: 480px) {
                    .booking-card {
                        padding: 1.25rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
