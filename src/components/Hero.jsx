import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Trophy } from 'lucide-react';

export default function Hero() {
    const [location, setLocation] = useState('');
    const [sport, setSport] = useState('All Sports');
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/venues', { state: { location, sport } });
    };

    return (
        <header className="hero section" style={{
            position: 'relative',
            padding: '8rem 1rem 6rem',
            backgroundColor: 'var(--bg-secondary)',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1470&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'left' }}>
                <h1 style={{
                    fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: '0.5rem',
                    color: '#4ade80',
                    maxWidth: '800px',
                    fontFamily: '"Playfair Display", serif'
                }}>
                    PLAY INFINITE
                </h1>

                <p style={{
                    fontSize: '1.5rem',
                    color: '#ffffff',
                    marginBottom: '3rem',
                    maxWidth: '600px',
                    margin: '0 0 3rem 0',
                    whiteSpace: 'pre-line'
                }}>
                    Book cricket, football & pickleball grounds instantly.
                    Available across Jaipur, anytime you want to play.
                </p>

                <div className="search-bar" style={{
                    background: 'white',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'inline-flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '1rem',
                    maxWidth: '800px',
                    width: '100%',
                    border: '1px solid var(--border-color)',
                    marginLeft: '0'
                }}>
                    <div className="search-input-group" style={{
                        flex: '1 1 200px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem',
                        borderRight: '1px solid var(--border-color)'
                    }}>
                        <MapPin size={20} color="var(--primary)" />
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', width: '100%' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>LOCATION</label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--text-main)', background: 'transparent' }}
                            >
                                <option value="">Select Location</option>
                                <option value="Jaipur">Jaipur</option>
                            </select>
                        </div>
                    </div>

                    <div className="search-input-group" style={{
                        flex: '1 1 200px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem'
                    }}>
                        <Trophy size={20} color="var(--primary)" />
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', width: '100%' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>SPORT</label>
                            <select
                                value={sport}
                                onChange={(e) => setSport(e.target.value)}
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--text-main)', background: 'transparent' }}
                            >
                                <option>All Sports</option>
                                <option>Cricket</option>
                                <option>Football</option>
                                <option>Pickleball</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleSearch} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)', height: '100%' }}>
                        <Search size={20} style={{ marginRight: '0.5rem' }} />
                        Search
                    </button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '4px solid var(--primary-light)',
                opacity: 0.5
            }} />
            <div style={{
                position: 'absolute',
                bottom: '15%',
                right: '5%',
                width: '100px',
                height: '100px',
                background: 'var(--primary-light)',
                borderRadius: '50%',
                opacity: 0.3,
                filter: 'blur(20px)'
            }} />

            <style>{`
        @media (max-width: 768px) {
          .search-input-group {
             border-right: none !important;
             border-bottom: 1px solid var(--border-color);
             padding-bottom: 1rem !important;
          }
          .search-bar {
             flex-direction: column;
             align-items: stretch;
             gap: 0.5rem;
             padding: 1rem;
          }
          .search-bar button {
             width: 100%;
             margin-top: 0.5rem;
          }
          .hero.section {
            padding-top: 6rem !important;
            padding-bottom: 3rem !important;
          }
        }
      `}</style>
        </header>
    );
}
