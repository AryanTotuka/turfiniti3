import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Coffee, Shield } from 'lucide-react';
import BookingWidget from '../components/BookingWidget';
import { venues } from '../data/venues';

export default function VenueDetails() {
    const { id } = useParams();
    const venue = venues.find(v => v.id === parseInt(id)) || venues[0];

    const [selectedSport, setSelectedSport] = useState(venue.sports[0]);

    // Update selected sport if venue changes (e.g. navigation)
    useEffect(() => {
        setSelectedSport(venue.sports[0]);
    }, [venue]);

    return (
        <div className="section container" style={{ paddingTop: '8rem' }}>

            {/* Title Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{venue.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={18} /> {venue.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Star size={18} fill="orange" color="orange" /> {venue.rating} ({venue.reviews} reviews)
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Main Content */}
                <div>
                    {/* Image Gallery */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', height: '400px', marginBottom: '2rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        <div style={{ background: '#f0f0f0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={venue.images[0]} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Main view" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: '#f0f0f0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={venue.images[1] || venue.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Side view 1" />
                            </div>
                            <div style={{ background: '#f0f0f0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <img src={venue.images[2] || venue.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Side view 2" />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem' }}>About this Venue</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>{venue.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                            <MapPin size={18} />
                            <span>{venue.address}</span>
                        </div>
                    </div>

                    {/* Sport Selection if multiple */}
                    {venue.sports.length > 1 && (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Select Sport</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {venue.sports.map(sport => (
                                    <button
                                        key={sport.type}
                                        onClick={() => setSelectedSport(sport)}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            border: selectedSport.type === sport.type ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius-md)',
                                            background: selectedSport.type === sport.type ? 'white' : 'white',
                                            color: selectedSport.type === sport.type ? 'var(--primary)' : 'var(--text-main)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            boxShadow: selectedSport.type === sport.type ? '0 0 0 4px rgba(46, 125, 50, 0.1)' : 'none',
                                            transition: 'all 0.2s'
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                <Wifi size={20} color="var(--primary)" /> Free Wifi
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                <Car size={20} color="var(--primary)" /> Parking
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                <Coffee size={20} color="var(--primary)" /> Cafe
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                <Shield size={20} color="var(--primary)" /> Lockers
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Booking */}
                <aside>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <BookingWidget pricePerHour={selectedSport.price} venueId={venue.id} venue={venue} sportType={selectedSport.type} />
                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <p style={{ marginBottom: '0.5rem' }}><strong>Sport:</strong> {selectedSport.type}</p>
                            <p>Price calculated based on selected sport.</p>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
