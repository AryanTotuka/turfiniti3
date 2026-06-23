import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Calendar, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './MobileBottomBar.css';

export default function MobileBottomBar() {
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="mobile-bottom-bar">
            <Link to="/" className={`bottom-bar-item ${isActive('/') ? 'active' : ''}`}>
                <Home size={24} />
                <span>Home</span>
            </Link>
            <Link to="/venues" className={`bottom-bar-item ${isActive('/venues') ? 'active' : ''}`}>
                <MapPin size={24} />
                <span>Venues</span>
            </Link>
            {user ? (
                <>
                    {user.role === 'owner' ? (
                        <Link to="/owner-dashboard" className={`bottom-bar-item ${isActive('/owner-dashboard') ? 'active' : ''}`}>
                            <Calendar size={24} />
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <Link to="/my-bookings" className={`bottom-bar-item ${isActive('/my-bookings') ? 'active' : ''}`}>
                            <Calendar size={24} />
                            <span>Bookings</span>
                        </Link>
                    )}
                    <Link to="/my-profile" className={`bottom-bar-item ${isActive('/my-profile') ? 'active' : ''}`}>
                        <User size={24} />
                        <span>Profile</span>
                    </Link>
                </>
            ) : (
                <Link to="/login" className={`bottom-bar-item ${isActive('/login') ? 'active' : ''}`}>
                    <User size={24} />
                    <span>Login</span>
                </Link>
            )}
        </div>
    );
}
