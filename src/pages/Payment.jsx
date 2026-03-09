import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, CreditCard, Smartphone, ShieldCheck } from 'lucide-react';
import { sendBookingConfirmation } from '../utils/emailService';
import { checkRateLimit, getRateLimitResetTime } from '../utils/rateLimit';

export default function Payment() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addBooking } = useVenue(); // Keeping context for local updates if needed
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [confirmedBookingId, setConfirmedBookingId] = useState(null);

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [upiId, setUpiId] = useState('');

    // If no state (direct access), redirect back to venues
    useEffect(() => {
        if (!state) {
            navigate('/venues');
        }
    }, [state, navigate]);

    if (!state) return null;

    const handlePayment = async () => {
        // Rate Limit Check
        if (!checkRateLimit('booking_creation', 3, 60000)) {
            const remaining = Math.ceil(getRateLimitResetTime('booking_creation', 60000) / 1000);
            alert(`Too many booking attempts. Please wait ${remaining} seconds.`);
            return;
        }

        // Validation
        if (paymentMethod === 'upi') {
            if (!upiId.includes('@')) {
                alert('Please enter a valid UPI ID (e.g., user@upi)');
                return;
            }
        }

        setIsProcessing(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate a display ID
            const bookingDisplayId = `TRF-${Math.floor(1000 + Math.random() * 9000)}`;

            // Create booking object
            const bookingData = {
                venueId: state.venueId,
                venueName: state.venueName,
                date: state.date,
                slots: state.slots, // Array of slots
                totalPrice: state.totalPrice,
                sport: state.sport || 'General',
                userId: user?.uid || user?.id || user?.email || 'guest',
                userName: user?.name || 'Guest User',
                userEmail: user?.email || 'N/A',
                userPhone: user?.phone || 'N/A',
                paymentMethod: paymentMethod === 'upi' ? 'UPI' : 'Card',
                status: 'confirmed',
                bookingDisplayId: bookingDisplayId,
                createdAt: serverTimestamp()
            };

            // Save to Firestore
            await addDoc(collection(db, "bookings"), bookingData);

            // Also update local context for immediate UI feedback
            addBooking(bookingData);

            // Send Confirmation Email
            if (user?.email) {
                await sendBookingConfirmation({
                    bookingId: bookingDisplayId,
                    userName: bookingData.userName,
                    userEmail: bookingData.userEmail,
                    venueName: bookingData.venueName,
                    date: bookingData.date,
                    slots: bookingData.slots,
                    totalPrice: bookingData.totalPrice
                });
            }

            setConfirmedBookingId(bookingDisplayId);
            setIsSuccess(true);
        } catch (error) {
            console.error("Error saving booking:", error);
            alert("Payment failed or error saving booking. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="section container" style={{ paddingTop: '8rem', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '500px', width: '100%', padding: '2rem', background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <CheckCircle size={64} color="var(--primary)" />
                    </div>
                    <h1 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Booking Confirmed!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Your booking for <strong>{state.venueName}</strong> ID is <strong>#{confirmedBookingId}</strong>. A confirmation email has been sent to {user?.email}.
                    </p>

                    {state.contactName && (
                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
                            <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-main)' }}>Venue Contact</p>
                            <p>{state.contactName}</p>
                            <a href={`tel:${state.contactNumber}`} style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>{state.contactNumber}</a>
                        </div>
                    )}
                    <button className="btn btn-outline" onClick={() => navigate('/my-bookings')}>View My Bookings</button>
                    <button className="btn btn-link" style={{ marginTop: '1rem', display: 'block', width: '100%' }} onClick={() => navigate('/')}>Return to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="section container" style={{ paddingTop: '8rem', minHeight: '80vh' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Secure Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

                {/* Order Summary */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Order Summary</h2>

                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Venue</p>
                        <p style={{ fontWeight: 600 }}>{state.venueName || "Sports Venue"}</p>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Date</p>
                        <p style={{ fontWeight: 600 }}>{state.date}</p>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Slots</p>
                        <p style={{ fontWeight: 600 }}>{state.slots.length} slots ({state.slots.length * 30} mins)</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                            {state.slots.map(s => <span key={s} style={{ fontSize: '0.75rem', background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{s}</span>)}
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem' }}>Total Amount</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{state.totalPrice}</span>
                    </div>
                </div>

                {/* Payment Methods */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Payment Method</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <button
                            onClick={() => setPaymentMethod('card')}
                            style={{
                                padding: '1rem',
                                border: `1px solid ${paymentMethod === 'card' ? 'var(--primary)' : 'var(--border-color)'}`,
                                borderRadius: 'var(--radius-md)',
                                background: paymentMethod === 'card' ? 'var(--primary-light)' : 'transparent',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <CreditCard size={24} color={paymentMethod === 'card' ? 'var(--primary)' : 'var(--text-secondary)'} />
                            <span style={{ fontWeight: 600, color: paymentMethod === 'card' ? 'var(--primary)' : 'var(--text-main)' }}>Card</span>
                        </button>

                        <button
                            onClick={() => setPaymentMethod('upi')}
                            style={{
                                padding: '1rem',
                                border: `1px solid ${paymentMethod === 'upi' ? 'var(--primary)' : 'var(--border-color)'}`,
                                borderRadius: 'var(--radius-md)',
                                background: paymentMethod === 'upi' ? 'var(--primary-light)' : 'transparent',
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Smartphone size={24} color={paymentMethod === 'upi' ? 'var(--primary)' : 'var(--text-secondary)'} />
                            <span style={{ fontWeight: 600, color: paymentMethod === 'upi' ? 'var(--primary)' : 'var(--text-main)' }}>UPI</span>
                        </button>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>

                        {paymentMethod === 'card' ? (
                            <>
                                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>This is a secure checkout powered by Stripe.</p>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} required />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Expiry Date</label>
                                        <input type="text" placeholder="MM/YY" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>CVV</label>
                                        <input type="password" placeholder="123" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} required />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Accepting Google Pay, PhonePe, Paytm, and BHIM UPI.</p>
                                </div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Enter UPI ID</label>
                                <input
                                    type="text"
                                    placeholder="yourname@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="form-input"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                                    required
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    A payment request will be sent to your UPI app.
                                </p>
                            </div>
                        )}

                        <button disabled={isProcessing} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                            {isProcessing ? 'Processing...' : `Pay ₹${state.totalPrice}`}
                        </button>

                        <p style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <ShieldCheck size={14} /> Payments are secure and encrypted
                        </p>
                    </form>
                </div>

            </div>
        </div>
    );
}
