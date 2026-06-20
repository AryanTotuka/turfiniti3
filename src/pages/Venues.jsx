import { useState, useEffect } from 'react';
import { MapPin, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useVenue } from '../context/VenueContext';

export default function Venues() {
    const location = useLocation();
    const { venues, loadingVenues } = useVenue();
    const [selectedSport, setSelectedSport] = useState(location.state?.sport || "All Sports");
    const [searchQuery] = useState(location.state?.location || "");
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [title, setTitle] = useState("All Venues");
    const [filtersOpen, setFiltersOpen] = useState(false);

    useEffect(() => {
        handleApplyFilters();
    }, [venues]);

    const handleApplyFilters = () => {
        let filtered = venues;

        if (selectedSport !== "All Sports") {
            filtered = filtered.filter(venue =>
                venue.sports.some(s => s.type.toLowerCase().includes(selectedSport.toLowerCase()))
            );
        }

        if (searchQuery.trim()) {
            filtered = filtered.filter(venue =>
                venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredVenues(filtered);

        if (selectedSport !== "All Sports") {
            setTitle(`${selectedSport} Venues${searchQuery ? ` in "${searchQuery}"` : ''}`);
        } else if (searchQuery) {
            setTitle(`Venues in "${searchQuery}"`);
        } else {
            setTitle("All Venues");
        }
    };

    return (
        <div className="section container venues-page" style={{ paddingTop: '7rem' }}>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                {/* Filters Sidebar */}
                <aside className="venues-sidebar">
                    {/* Mobile filter toggle */}
                    <button
                        className="filters-toggle"
                        onClick={() => setFiltersOpen(o => !o)}
                        style={{
                            display: 'none',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.875rem 1rem',
                            background: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            marginBottom: '0.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Filter size={18} color="var(--primary)" /> Filters
                        </span>
                        {filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    <div className={`filters-body${filtersOpen ? ' open' : ''}`} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        height: 'fit-content'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>Filters</h3>
                            <Filter size={20} color="var(--primary)" />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Sport</label>
                            <select
                                value={selectedSport}
                                onChange={(e) => setSelectedSport(e.target.value)}
                                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '1rem' }}
                            >
                                <option>All Sports</option>
                                <option>Cricket</option>
                                <option>Football</option>
                                <option>Pickleball</option>
                            </select>
                        </div>

                        <button
                            onClick={() => { handleApplyFilters(); setFiltersOpen(false); }}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* Venues Grid */}
                <div style={{ flex: '3 1 280px', minWidth: 0 }}>
                    <h1 style={{ marginBottom: '1.25rem', fontSize: '1.75rem' }}>{title}</h1>

                    {loadingVenues ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Loading venues...
                        </div>
                    ) : filteredVenues.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No venues found for the selected filter.
                        </div>
                    ) : (
                        <div className="grid-3">
                            {filteredVenues.map((venue) => (
                                <div key={venue.id} style={{
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    background: 'white',
                                    boxShadow: 'var(--shadow-sm)'
                                }}>
                                    <div style={{ height: '180px', overflow: 'hidden' }}>
                                        <img
                                            src={venue.images?.[0] || venue.image || "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800"}
                                            alt={venue.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ padding: '1.25rem' }}>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                                                {venue.sports.map((sport, idx) => (
                                                    <span key={idx} style={{
                                                        fontSize: '0.65rem',
                                                        textTransform: 'uppercase',
                                                        color: 'var(--primary)',
                                                        fontWeight: 700,
                                                        letterSpacing: '0.05em',
                                                        background: 'rgba(46, 125, 50, 0.1)',
                                                        padding: '1px 4px',
                                                        borderRadius: '3px'
                                                    }}>
                                                        {sport.type}
                                                    </span>
                                                ))}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{venue.name}</h3>
                                                <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                                                    ₹{Math.min(...venue.sports.map(s => s.price))}/hr
                                                </span>
                                            </div>
                                        </div>
                                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                            <MapPin size={14} /> {venue.location}
                                        </p>
                                        <Link to={`/venues/${venue.id}`} className="btn btn-outline" style={{ display: 'block', width: '100%', padding: '0.5rem', textAlign: 'center' }}>Book Now</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .venues-page {
                    padding-top: 7rem;
                }
                .venues-sidebar {
                    flex: 1 1 220px;
                    max-width: 260px;
                }
                .filters-body {
                    display: block;
                }
                @media (max-width: 768px) {
                    .venues-page {
                        padding-top: 5.5rem !important;
                    }
                    .venues-sidebar {
                        max-width: 100%;
                        width: 100%;
                        flex: 1 1 100%;
                    }
                    .filters-toggle {
                        display: flex !important;
                    }
                    .filters-body {
                        display: none;
                    }
                    .filters-body.open {
                        display: block;
                        margin-top: 0.25rem;
                    }
                }
            `}</style>
        </div>
    );
}
