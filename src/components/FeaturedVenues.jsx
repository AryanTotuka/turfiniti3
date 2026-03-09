import { MapPin, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { venues } from '../data/venues';

export default function FeaturedVenues() {
    // Show only high-rated venues, including the multi-sport one
    const featuredVenues = venues.filter(v => v.rating >= 4.7).slice(0, 3);

    return (
        <section id="venues" className="section container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Featured Venues</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Top rated locations for your next match.</p>
                </div>
                <Link to="/venues" className="btn btn-outline">View All</Link>
            </div>

            <div className="grid-3">
                {featuredVenues.map((venue) => (
                    <div key={venue.id} style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        background: 'white',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                    >
                        {/* Image Box */}
                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                            <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}>
                                <Star size={14} fill="orange" color="orange" />
                                {venue.rating}
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                    {venue.sports.map((sport, idx) => (
                                        <span key={idx} style={{
                                            fontSize: '0.70rem',
                                            textTransform: 'uppercase',
                                            color: 'var(--primary)',
                                            fontWeight: 700,
                                            letterSpacing: '0.05em',
                                            background: 'rgba(46, 125, 50, 0.1)',
                                            padding: '2px 6px',
                                            borderRadius: '4px'
                                        }}>
                                            {sport.type}
                                        </span>
                                    ))}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', margin: '0.25rem 0' }}>{venue.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <MapPin size={14} />
                                    {venue.location}
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                        ₹{Math.min(...venue.sports.map(s => s.price))}
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>/hr</span>
                                </div>
                                <Link to={`/venues/${venue.id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
