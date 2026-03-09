import { Search, Calendar, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            icon: <Search size={48} color="var(--primary)" />,
            title: "1. Find Your Turf",
            description: "Browse through our network of top-rated sports venues. Filter by sport, location, or price to find your perfect match."
        },
        {
            icon: <Calendar size={48} color="var(--primary)" />,
            title: "2. Select Slot",
            description: "Check real-time availability and choose a date and time that works for you. No more phone calls or waiting."
        },
        {
            icon: <CheckCircle size={48} color="var(--primary)" />,
            title: "3. Book & Play",
            description: "Pay securely online to confirm your booking instantly. Get your confirmation and show up to play!"
        }
    ];

    return (
        <section className="section container" style={{ paddingBottom: '2rem' }}>
            <div className="text-center" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>How It Works</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Booking your favorite sports venue has never been easier. Get started in three simple steps.
                </p>
            </div>

            <div className="grid-3" style={{ textAlign: 'center' }}>
                {steps.map((step, index) => (
                    <div key={index} style={{
                        padding: '2rem',
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            background: 'var(--primary-light)',
                            padding: '1.5rem',
                            borderRadius: '50%',
                            marginBottom: '0.5rem'
                        }}>
                            {step.icon}
                        </div>
                        <h3 style={{ fontSize: '1.25rem' }}>{step.title}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
