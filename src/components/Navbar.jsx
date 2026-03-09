import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/turfiniti_image-removebg-preview.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="navbar" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'black',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #333'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '80px'
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <img src={logo} alt="Turfiniti" style={{ height: '40px', objectFit: 'contain' }} />
                </Link>

                {/* Desktop Links */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-menu">
                    <Link to="/" style={{ fontWeight: 500, color: 'white' }} className="nav-link">Home</Link>
                    <Link to="/venues" style={{ fontWeight: 500, color: 'white' }} className="nav-link">Venues</Link>
                    <Link to="/partner" style={{ fontWeight: 500, color: 'white' }} className="nav-link">Partner with Us</Link>
                    {user && <Link to="/my-profile" style={{ fontWeight: 500, color: 'white' }} className="nav-link">Profile</Link>}

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <UserIcon size={18} /> {user.name}
                            </span>
                            {user.role === 'owner' && (
                                <Link to="/owner-dashboard" className="nav-link" style={{ fontWeight: 500, color: 'white', border: '1px solid white', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Dashboard</Link>
                            )}
                            {user.role !== 'owner' && (
                                <Link to="/my-bookings" className="nav-link" style={{ fontWeight: 500, color: 'white' }}>My Bookings</Link>
                            )}

                            <button onClick={logout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', borderColor: 'white' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', color: 'white', borderColor: 'white' }}>Login</Link>
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Sign Up</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="mobile-toggle" style={{ display: 'none' }}>
                    <button onClick={() => setIsOpen(!isOpen)} style={{ color: 'white', background: 'none', border: 'none' }}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    left: 0,
                    right: 0,
                    background: 'black',
                    padding: '1rem',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <Link to="/" onClick={() => setIsOpen(false)} style={{ color: 'white' }}>Home</Link>
                    <Link to="/venues" onClick={() => setIsOpen(false)} style={{ color: 'white' }}>Venues</Link>
                    <Link to="/partner" onClick={() => setIsOpen(false)} style={{ color: 'white' }}>Partner with Us</Link>
                    {user && <Link to="/my-profile" onClick={() => setIsOpen(false)} style={{ color: 'white' }}>My Profile</Link>}

                    {user ? (
                        <>
                            <span style={{ fontWeight: 600, color: 'white' }}>Hi, {user.name}</span>
                            {user.role === 'owner' && (
                                <Link to="/owner-dashboard" onClick={() => setIsOpen(false)} style={{ color: 'white', fontWeight: 500 }}>Dashboard</Link>
                            )}
                            {user.role !== 'owner' && (
                                <Link to="/my-bookings" onClick={() => setIsOpen(false)} style={{ color: 'white', fontWeight: 500 }}>My Bookings</Link>
                            )}

                            <button onClick={() => { logout(); setIsOpen(false); }} className="btn btn-outline" style={{ width: '100%', color: 'white', borderColor: 'white' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-outline" style={{ textAlign: 'center', color: 'white', borderColor: 'white' }}>Login</Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ textAlign: 'center' }}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        .nav-link:hover {
          color: var(--primary) !important;
        }
      `}</style>
        </nav>
    );
}
