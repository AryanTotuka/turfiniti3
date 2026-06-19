import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Coffee, Shield } from 'lucide-react';
import BookingWidget from '../components/BookingWidget';
import { useVenue } from '../context/VenueContext';

export default function VenueDetails() {
    const { id } = useParams();
    const { venues, loadingVenues } = useVenue();
    const venue = venues.find(v => String(v.id) === String(id));
    const [selectedSport, setSelectedSport] = useState(venue?.sports?.[0] || null);

    useEffect(() => {
        if (venue && venue.sports && venue.sports.length > 0) {
            setSelectedSport(venue.sports[0]);
        }
    }, [venue]);

    if (loadingVenues) {
        return <div className="section container" style={{ paddingTop: '8rem', textAlign: 'center' }}>Loading venue details...</div>;
    }

    if (!venue) {
        return <div className="section container" style={{ paddingTop: '8rem', textAlign: 'center' }}>Venue not found.</div>;
    }

    return (
        <div className="section container venue-details-page" style={{ paddingTop: '7rem' }}>

            {/* Title Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 className="venue-details-title" style={{ marginBottom: '0.5rem' }}>{venue.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={18} /> {venue.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Star size={18} fill="orange" color="orange" /> {venue.rating} ({venue.reviews} reviews)
                    </span>
                </div>
            </div>

            <div className="venue-details-layout">

                {/* Main Content */}
                <div>
                    {/* Image Gallery */}
                    <div className="venue-gallery" style={{ marginBottom: '2rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#f0f0f0' }}>
                        <img
                            src={venue.images?.[0] || venue.image || "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80"}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            alt="Main view"
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>About this Venue</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1rem' }}>{venue.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <MapPin size={18} />
                            <span>{venue.address}</span>
                        </div>
                    </div>

                    {/* Sport Selection */}
                    {venue.sports && venue.sports.length > 1 && selectedSport && (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Select Sport</h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {venue.sports.map(sport => (
                                    <button
                                        key={sport.type}
                                        onClick={() => setSelectedSport(sport)}
                                        style={{
                                            padding: '0.75rem 1.25rem',
                                            border: selectedSport.type === sport.type ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius-md)',
                                            background: 'white',
                                            color: selectedSport.type === sport.type ? 'var(--primary)' : 'var(--text-main)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            boxShadow: selectedSport.type === sport.type ? '0 0 0 4px rgba(46, 125, 50, 0.1)' : 'none',
                                            transition: 'all 0.2s',
                                            minHeight: '44px'
                                        }}
                                    >
                                        <div style={{ fontSize: '1rem' }}>{sport.type}</div>
                                        <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>₹{sport.price}/hr</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Amenities</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                            {[
                                { icon: <Wifi size={20} color="var(--primary)" />, label: 'Free Wifi' },
                                { icon: <Car size={20} color="var(--primary)" />, label: 'Parking' },
                                { icon: <Coffee size={20} color="var(--primary)" />, label: 'Cafe' },
                                { icon: <Shield size={20} color="var(--primary)" />, label: 'Lockers' },
                            ].map(({ icon, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                    {icon} {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar */}
                <aside className="venue-booking-aside">
                    {selectedSport && (
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <BookingWidget pricePerHour={selectedSport.price} venueId={venue.id} venue={venue} sportType={selectedSport.type} />
                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                <p style={{ marginBottom: '0.5rem' }}><strong>Sport:</strong> {selectedSport.type}</p>
                                <p>Price calculated based on selected sport.</p>
                            </div>
                        </div>
                    )}
                </aside>

            </div>

            <style>{`
                .venue-details-title {
                    font-size: 2.5rem;
                }
                .venue-details-layout {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                }
                .venue-gallery {
                    height: 380px;
                }
                @media (max-width: 900px) {
                    .venue-details-layout {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 768px) {
                    .venue-details-page {
                        padding-top: 5.5rem !important;
                    }
                    .venue-details-title {
                        font-size: 1.75rem;
                    }
                    .venue-gallery {
                        height: 240px;
                    }
                }
                @media (max-width: 480px) {
                    .venue-details-title {
                        font-size: 1.4rem;
                    }
                    .venue-gallery {
                        height: 190px;
                    }
                }
            `}</style>
        </div>
    );
}
