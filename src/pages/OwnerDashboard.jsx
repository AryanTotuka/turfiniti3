import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, IndianRupee, Users, Clock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { venues } from '../data/venues';

export default function OwnerDashboard() {
    const { user } = useAuth();
    const { isSlotBlocked, blockSlot, unblockSlot, isSlotBooked, cancelBooking: localCancelBooking } = useVenue(); // Keep slot management in context for now as it handles blocking logic differently
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // For this example, we assume the owner manages "Jaipur Sports Arena" which has ID 1
    // If user is demo owner, they manage ID 2
    // If user is jaipur owner (or default), they manage ID 1
    // If user is test owner, they manage ID 3
    // If user is pickleball owner, they manage ID 4
    // If user is test owner, they manage ID 3
    // If user is pickleball owner, they manage ID 4
    let managedVenueId = 1;
    if (user?.email === 'demo.owner@turfiniti.com') managedVenueId = 1;
    if (user?.email === 'test.owner@turfiniti.com') managedVenueId = 3;
    if (user?.email === 'pickleball@turfiniti.com') managedVenueId = 4;

    const managedVenue = venues.find(v => v.id === managedVenueId);
    // Determine default sport (first available or 'General')
    const defaultSport = managedVenue && managedVenue.sports && managedVenue.sports.length > 0 ? managedVenue.sports[0].type : "General";

    // State for Slot Management Filter
    const [selectedSport, setSelectedSport] = useState(defaultSport);

    // Update selected sport if venue changes
    useEffect(() => {
        if (managedVenue && managedVenue.sports && managedVenue.sports.length > 0) {
            setSelectedSport(managedVenue.sports[0].type);
        } else {
            setSelectedSport("General");
        }
    }, [managedVenueId]);

    // Fetch Bookings from Firestore
    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                // Query bookings for this venue
                // We remove orderBy for now to avoid specific index requirements on a demo project
                // and verify if "where" clause works. We can sort client-side.
                // Reverting to specific query as "fetch all" is blocked by permissions
                const q = query(
                    collection(db, "bookings"),
                    where("venueId", "==", managedVenueId)
                );

                const querySnapshot = await getDocs(q);
                const fetchedBookings = [];
                querySnapshot.forEach((doc) => {
                    fetchedBookings.push({ id: doc.id, ...doc.data() });
                });

                // Client-side sort
                fetchedBookings.sort((a, b) => {
                    // sort by createdAt desc if available, else date
                    const tA = a.createdAt?.seconds || 0;
                    const tB = b.createdAt?.seconds || 0;
                    return tB - tA;
                });

                setBookings(fetchedBookings);
            } catch (error) {
                console.error("Error fetching dashboard bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'owner') {
            fetchBookings();
        }
    }, [user, managedVenueId]);

    // Mock Stats
    const stats = {
        dailyBookings: bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length, // Real mock calculation
        dailyRevenue: bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).reduce((sum, b) => sum + (b.totalPrice || 0), 0),
        weeklyRevenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0) // Just total for now
    };

    // Generate time slots (same logic as widget)
    const timeSlots = [];
    for (let i = 6; i <= 24; i++) {
        const hour = i % 12 || 12;
        const ampm = i < 12 || i === 24 ? 'AM' : 'PM';
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        timeSlots.push(`${formattedHour}:00 ${ampm}`);
        if (i !== 24) timeSlots.push(`${formattedHour}:30 ${ampm}`);
    }

    const handleSlotClick = async (slot) => {
        // Check if booked (using selected sport for visibility)
        // Pass selectedSport to isSlotBooked
        if (isSlotBooked(managedVenueId, selectedDate, slot, selectedSport)) {
            if (window.confirm(`This slot is currently booked for ${selectedSport}. Do you want to cancel (disable) this booking?`)) {
                // Find booking from Firestore list
                const booking = bookings.find(b =>
                    Number(b.venueId) === managedVenueId &&
                    b.date === selectedDate &&
                    b.slots.includes(slot) &&
                    (b.sport === selectedSport || (!b.sport && selectedSport === 'General'))
                );

                if (booking) {
                    handleCancelBooking(booking.id);
                } else {
                    alert("Could not find booking document to delete.");
                }
            }
        }
        else if (isSlotBlocked(managedVenueId, selectedDate, slot)) {
            unblockSlot(managedVenueId, selectedDate, slot);
        }
        else {
            blockSlot(managedVenueId, selectedDate, slot);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, "bookings", bookingId));
            // Update local state is handled by re-fetch or manual filter
            setBookings(prev => prev.filter(b => b.id !== bookingId));
            localCancelBooking(bookingId);
            alert("Booking cancelled successfully.");
        } catch (err) {
            console.error("Error deleting booking:", err);
            alert("Failed to cancel booking");
        }
    };


    const handleSaveBlocks = () => {
        alert(`Changes saved for ${selectedDate}`);
    };

    if (!user || user.role !== 'owner') {
        return (
            <div className="section container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>You must be a Venue Partner to view this page.</p>
            </div>
        );
    }

    const venueName = managedVenueId === 3 ? "Gurgaon Turf Arena" : (managedVenueId === 2 ? "Demo Turf Arena" : "Jaipur Sports Park");

    return (
        <div className="section container" style={{ paddingTop: '8rem', minHeight: '100vh' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Partner Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name} ({venueName})</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Daily Bookings</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{stats.dailyBookings}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '50%' }}>
                            <Users size={24} color="var(--primary)" />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'green' }}>+2 from yesterday</p>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Daily Revenue</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>₹{stats.dailyRevenue}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '50%' }}>
                            <IndianRupee size={24} color="var(--primary)" />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'green' }}>+15% from yesterday</p>
                </div>

                <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Weekly Revenue</p>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>₹{stats.weeklyRevenue}</h3>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '50%' }}>
                            <IndianRupee size={24} color="var(--primary)" />
                        </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'green' }}>On track for target</p>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Recent Bookings</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Sport</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Sport</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Player</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Contact</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Slots</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Amount</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* We use fetched bookings */}
                            {loading ? (
                                <tr><td colSpan="8" style={{ padding: '2rem', textAlign: 'center' }}>Loading bookings from database...</td></tr>
                            ) : bookings && bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-color)', background: booking.status === 'cancelled' ? '#fafafa' : 'white', opacity: booking.status === 'cancelled' ? 0.7 : 1 }}>
                                        <td style={{ padding: '1rem' }}>{booking.date}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary)' }}>{booking.sport || 'General'}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary)' }}>{booking.sport || 'General'}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>
                                            <Link to={`/player/${booking.userId}`} style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dashed var(--text-secondary)' }}>
                                                {booking.userName}
                                            </Link>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div>{booking.userPhone}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{booking.userEmail}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                {booking.slots && booking.slots.map(s => (
                                                    <span key={s} style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{s}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                background: booking.status === 'cancelled' ? '#fee2e2' : '#dcfce7',
                                                color: booking.status === 'cancelled' ? '#b91c1c' : '#166534',
                                                padding: '0.1rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>
                                                {booking.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', color: booking.status === 'cancelled' ? 'var(--text-secondary)' : 'var(--primary)' }}>
                                            {booking.status === 'cancelled' ? <span style={{ textDecoration: 'line-through' }}>₹{booking.totalPrice}</span> : `₹${booking.totalPrice}`}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.75rem',
                                                        background: '#fee2e2',
                                                        color: '#b91c1c',
                                                        border: '1px solid #b91c1c',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No bookings yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slot Management */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Clock size={24} /> Slot Management
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Select a date and click on slots to block/unblock them. Blocked slots will not be visible to users.
                </p>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={18} /> Select Date to Manage
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ maxWidth: '300px', width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    />
                </div>

                {/* Sport Selector for Grid */}
                {managedVenue && managedVenue.sports && managedVenue.sports.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                            Select Sport/Court to Manage
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {managedVenue.sports.map(s => (
                                <button
                                    key={s.type}
                                    onClick={() => setSelectedSport(s.type)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: selectedSport === s.type ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                                        background: selectedSport === s.type ? 'var(--bg-secondary)' : 'white',
                                        color: selectedSport === s.type ? 'var(--primary)' : 'var(--text-main)',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {s.type}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {timeSlots.map(slot => (
                        <button
                            key={slot}
                            onClick={() => handleSlotClick(slot)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-sm)',
                                border: `1px solid ${isSlotBooked(managedVenueId, selectedDate, slot, selectedSport) ? '#ef4444' : (isSlotBlocked(managedVenueId, selectedDate, slot) ? '#fca5a5' : 'var(--border-color)')}`,
                                background: isSlotBooked(managedVenueId, selectedDate, slot, selectedSport) ? '#ef4444' : (isSlotBlocked(managedVenueId, selectedDate, slot) ? '#fef2f2' : 'white'),
                                color: isSlotBooked(managedVenueId, selectedDate, slot, selectedSport) ? 'white' : (isSlotBlocked(managedVenueId, selectedDate, slot) ? '#ef4444' : 'var(--text-main)'),
                                fontWeight: (isSlotBooked(managedVenueId, selectedDate, slot, selectedSport) || isSlotBlocked(managedVenueId, selectedDate, slot)) ? 600 : 400,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {isSlotBooked(managedVenueId, selectedDate, slot, selectedSport) && <span style={{ fontSize: '0.75rem' }}>Booked</span>}
                            {!isSlotBooked(managedVenueId, selectedDate, slot, selectedSport) && isSlotBlocked(managedVenueId, selectedDate, slot) && <ShieldAlert size={14} />}
                            {slot}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleSaveBlocks} className="btn btn-primary">
                        Save Changes
                    </button>
                </div>
            </div>

        </div>
    );
}
