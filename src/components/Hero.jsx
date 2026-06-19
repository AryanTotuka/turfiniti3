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
            backgroundColor: 'var(--bg-secondary)',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1470&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
        }}>
            <div className="container hero-content" style={{ position: 'relative', zIndex: 1, textAlign: 'left' }}>
                <h1 className="hero-title" style={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: '0.75rem',
                    color: '#4ade80',
                    fontFamily: '"Playfair Display", serif'
                }}>
                    PLAY INFINITE
                </h1>

                <p className="hero-subtitle" style={{
                    color: '#ffffff',
                    margin: '0 0 2rem 0',
                }}>
                    Book cricket, football &amp; pickleball grounds instantly.
                    Available across Jaipur, anytime you want to play.
                </p>

                <div className="search-bar" style={{
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    maxWidth: '800px',
                    width: '100%',
                    border: '1px solid var(--border-color)',
                }}>
                    <div className="search-input-group" style={{
                        flex: '1 1 180px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                    }}>
                        <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', width: '100%' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2px' }}>LOCATION</label>
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', color: 'var(--text-main)', background: 'transparent', padding: 0 }}
                            >
                                <option value="">Select Location</option>
                                <option value="Jaipur">Jaipur</option>
                            </select>
                        </div>
                    </div>

                    <div className="search-divider" />

                    <div className="search-input-group" style={{
                        flex: '1 1 180px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                    }}>
                        <Trophy size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', width: '100%' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2px' }}>SPORT</label>
                            <select
                                value={sport}
                                onChange={(e) => setSport(e.target.value)}
                                style={{ border: 'none', width: '100%', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', color: 'var(--text-main)', background: 'transparent', padding: 0 }}
                            >
                                <option>All Sports</option>
                                <option>Cricket</option>
                                <option>Football</option>
                                <option>Pickleball</option>
                            </select>
                        </div>
                    </div>

                    <div className="search-btn-wrap">
                        <button onClick={handleSearch} className="btn btn-primary search-btn">
                            <Search size={18} style={{ marginRight: '0.4rem' }} />
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative Elements – hidden on small screens */}
            <div className="hero-deco-1" style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '4px solid var(--primary-light)',
                opacity: 0.5
            }} />
            <div className="hero-deco-2" style={{
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
        /* Desktop hero sizing */
        .hero.section {
          padding: 8rem 0 6rem;
        }
        .hero-content {
          padding-top: 0;
        }
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          max-width: 800px;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.4rem);
          max-width: 600px;
        }
        .search-divider {
          width: 1px;
          height: 40px;
          background: var(--border-color);
          flex-shrink: 0;
        }
        .search-btn-wrap {
          padding: 0.5rem;
          flex-shrink: 0;
        }
        .search-btn {
          white-space: nowrap;
          border-radius: var(--radius-md);
        }
        .nav-link:hover {
          color: var(--primary) !important;
        }

        /* Tablet */
        @media (max-width: 768px) {
          .hero.section {
            padding: 5.5rem 0 3rem;
          }
          .search-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .search-divider {
            width: 100%;
            height: 1px;
          }
          .search-input-group {
            border-right: none !important;
          }
          .search-btn-wrap {
            padding: 0.5rem 0.75rem 0.75rem;
          }
          .search-btn {
            width: 100%;
          }
          .hero-deco-1, .hero-deco-2 {
            display: none;
          }
        }

        /* Mobile */
        @media (max-width: 480px) {
          .hero.section {
            padding: 5rem 0 2.5rem;
          }
          .hero-title {
            font-size: 2.25rem;
          }
          .hero-subtitle {
            font-size: 0.95rem;
          }
        }
      `}</style>
        </header>
    );
}
