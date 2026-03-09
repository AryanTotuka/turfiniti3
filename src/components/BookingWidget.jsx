import { useState } from 'react';
import { Calendar, Clock, CheckCircle, ArrowRightLeft, X, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';
import { venues } from '../data/venues';

export default function BookingWidget({ pricePerHour, venueId, venue, sportType }) {
    const [date, setDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isSlotBlocked, isSlotBooked } = useVenue();

    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    const getSimilarVenues = () => {
        if (!sportType) return [];
        // Filter venues that offer the same sport, exclude current venue
        return venues.filter(v =>
            v.id !== venueId &&
            v.sports.some(s => s.type === sportType)
        ).slice(0, 2); // Limit to top 2 for comparison
    };

    // Generate time slots from 06:00 AM to 12:00 AM (00:00)
    const timeSlots = [];
    for (let i = 6; i <= 24; i++) {
        const hour = i % 12 || 12;
        const ampm = i < 12 || i === 24 ? 'AM' : 'PM';

        const formattedHour = hour < 10 ? `0${hour}` : hour;

        timeSlots.push(`${formattedHour}:00 ${ampm}`);

        if (i !== 24) {
            timeSlots.push(`${formattedHour}:30 ${ampm}`);
        }
    }

    const toggleSlot = (slot) => {
        if (selectedSlots.includes(slot)) {
            setSelectedSlots(selectedSlots.filter(s => s !== slot));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    const totalPrice = selectedSlots.length * (pricePerHour / 2); // 30 mins = half hourly price

    const handleBookingConfirm = () => {
        const bookingData = {
            venueId,
            date,
            slots: selectedSlots,
            totalPrice,
            sport: sportType,
            venueName: venue?.name || "Venue Booking",
            contactName: venue?.contactName,
            contactNumber: venue?.contactNumber
        };

        if (!user) {
            // Redirect to login with intent to return together with data
            navigate('/login', { state: { from: '/payment', bookingData } });
        } else {
            navigate('/payment', { state: bookingData });
        }
    };

    return (
        <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)'
        }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                Book This Venue
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} /> Select Date
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} /> Available Slots (30 min)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {timeSlots.map(slot => {
                        const isBlocked = date ? (isSlotBlocked(venueId, date, slot, sportType) || isSlotBooked(venueId, date, slot, sportType)) : false;

                        return (
                            <button
                                key={slot}
                                onClick={() => !isBlocked && toggleSlot(slot)}
                                disabled={isBlocked || !date}
                                style={{
                                    padding: '0.5rem',
                                    fontSize: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: `1px solid ${selectedSlots.includes(slot) ? 'var(--primary)' : (isBlocked ? '#dc2626' : 'var(--border-color)')}`,
                                    background: isBlocked ? '#ef4444' : (selectedSlots.includes(slot) ? 'var(--primary-light)' : 'white'),
                                    color: isBlocked ? 'white' : (selectedSlots.includes(slot) ? 'var(--primary)' : 'inherit'),
                                    cursor: isBlocked || !date ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    textDecoration: isBlocked ? 'line-through' : 'none',
                                    opacity: !date ? 0.5 : 1
                                }}
                            >
                                {slot}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.5rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Rate per hour:</span>
                    <strong>₹{pricePerHour}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Selected Duration:</span>
                    <span>{selectedSlots.length * 30} mins</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                    <span>Total:</span>
                    <span style={{ color: 'var(--primary)' }}>₹{totalPrice}</span>
                </div>
            </div>

            <button onClick={handleBookingConfirm} className="btn btn-primary" style={{ width: '100%' }} disabled={!date || selectedSlots.length === 0}>
                Confirm Booking
            </button>

            {date && selectedSlots.length > 0 && (
                <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'green', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <CheckCircle size={16} /> {selectedSlots.length} slots selected
                </p>
            )}

            {/* Automatic Comparison Feature */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                    onClick={() => setIsCompareModalOpen(true)}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        width: '100%',
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <ArrowRightLeft size={18} /> Compare with Similar Venues
                </button>
            </div>

            {/* Comparison Modal */}
            {isCompareModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '2rem'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        maxWidth: '1000px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsCompareModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center' }}>Compare Venues for {sportType}</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Automatic comparison with similar venues near you.</p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${getSimilarVenues().length + 1}, 1fr)`,
                            gap: '1rem',
                            overflowX: 'auto'
                        }}>
                            {/* Current Venue */}
                            <div style={{ border: '2px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '1rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>CURRENT Selection</div>
                                <div style={{ height: '120px', marginBottom: '1rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                    <img src={venue?.image} alt={venue?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{venue?.name}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{venue?.location}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontStyle: 'italic' }}>{venue?.address}</p>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
                                    ₹{pricePerHour}/hr
                                </div>
                                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', listStyle: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: '0.25rem' }}>★ {venue?.rating} Rating</li>
                                </ul>
                            </div>

                            {/* Similar Venues */}
                            {getSimilarVenues().map(v => {
                                const sData = v.sports.find(s => s.type === sportType);
                                return (
                                    <div key={v.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                                        <div style={{ height: '120px', marginBottom: '1rem', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                            <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{v.name}</h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{v.location}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontStyle: 'italic' }}>{v.address}</p>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
                                            ₹{sData ? sData.price : 'N/A'}/hr
                                        </div>
                                        <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
                                            <li style={{ marginBottom: '0.25rem' }}>★ {v.rating} Rating</li>
                                        </ul>
                                        <Link
                                            to={`/venues/${v.id}`}
                                            onClick={() => setIsCompareModalOpen(false)}
                                            className="btn btn-outline"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
                                        >
                                            View Venue <ExternalLink size={14} />
                                        </Link>
                                    </div>
                                );
                            })}

                            {getSimilarVenues().length === 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '2rem' }}>
                                    No other venues found for {sportType}.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
