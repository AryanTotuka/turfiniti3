import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            background: '#1a1a1a',
            color: '#94a3b8',
            padding: '2rem 1rem',
            marginTop: 'auto',
            fontSize: '0.875rem',
            borderTop: '1px solid #333'
        }}>
            <div className="container">
                {/* Horizontal Layout matching the reference image */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    borderTop: '1px solid #333',
                    paddingTop: '2rem'
                }}>

                    {/* Left Side: Copyright */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>&copy; 2026 Turfiniti</span>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span>All Rights Reserved</span>
                    </div>

                    {/* Right Side: Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <Link to="/refund-policy" className="footer-link">Return & Refunds Policy</Link>
                            <Link to="/terms" className="footer-link">Terms & Conditions</Link>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            Contact Us: <a href="mailto:turfinity25@gmail.com" className="footer-link">turfinity25@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-link {
                    color: #94a3b8;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-link:hover {
                    color: #fff;
                }
                @media (max-width: 768px) {
                    .container > div {
                        flex-direction: column;
                        text-align: center;
                        gap: 1.5rem;
                    }
                    div[style*="justify-content: space-between"] {
                        flex-direction: column !important;
                    }
                }
            `}</style>
        </footer>
    );
}
