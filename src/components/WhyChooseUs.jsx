import { Zap, ShieldCheck, CreditCard, Award } from 'lucide-react';

export default function WhyChooseUs() {
    const features = [
        {
            icon: <Zap size={32} color="var(--primary)" />,
            title: "Instant Confirmation",
            description: "Say goodbye to phone calls. Get your booking confirmed instantly via email and SMS."
        },
        {
            icon: <Award size={32} color="var(--primary)" />,
            title: "Verified Venues",
            description: "We verify the venue first and then partner with them."
        },
        {
            icon: <CreditCard size={32} color="var(--primary)" />,
            title: "Secure Payments",
            description: "100% safe transactions with support for UPI, Cards, and Net Banking."
        },
        {
            icon: <ShieldCheck size={32} color="var(--primary)" />,
            title: "Best Price Guarantee",
            description: "Get the best rates for your favorite turfs with no hidden booking fees."
        }
    ];

    return (
        <section className="section container" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '4rem 2rem', marginTop: '2rem' }}>
            <div className="text-center" style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Why Choose Turfiniti?</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    We make sports booking simple, reliable, and rewarding for everyone.
                </p>
            </div>

            <div className="why-choose-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                        <div style={{
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '50%',
                            boxShadow: 'var(--shadow-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '64px',
                            height: '64px',
                            flexShrink: 0
                        }}>
                            {feature.icon}
                        </div>
                        <div className="feature-text">
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <style>{`
                .why-choose-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                }
                .feature-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 1rem;
                }
                @media (max-width: 768px) {
                    .why-choose-grid {
                        grid-template-columns: 1fr;
                    }
                    .feature-item {
                        flex-direction: row;
                        text-align: left;
                        align-items: flex-start;
                    }
                    .feature-text h3 {
                        margin-bottom: 0.25rem !important;
                    }
                }
            `}</style>
        </section>
    );
}
