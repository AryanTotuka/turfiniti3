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
                <div className="footer-inner">
                    {/* Left Side: Copyright */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <span>&copy; 2026 Turfiniti</span>
                        <span style={{ opacity: 0.5 }}>•</span>
                        <span>All Rights Reserved</span>
                    </div>

                    {/* Right Side: Links */}
                    <div className="footer-links-group">
                        <div className="footer-links-row">
                            <Link to="/refund-policy" className="footer-link">Return &amp; Refunds Policy</Link>
                            <Link to="/terms" className="footer-link">Terms &amp; Conditions</Link>
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
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
                    white-space: nowrap;
                }
                .footer-link:hover {
                    color: #fff;
                }
                .footer-inner {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1.25rem;
                    border-top: 1px solid #333;
                    padding-top: 2rem;
                }
                .footer-links-group {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.5rem;
                }
                .footer-links-row {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }
                @media (max-width: 768px) {
                    footer {
                        padding-bottom: calc(5rem + env(safe-area-inset-bottom)) !important;
                    }
                    .footer-inner {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        gap: 1.25rem;
                    }
                    .footer-links-group {
                        align-items: center;
                    }
                    .footer-links-row {
                        justify-content: center;
                        gap: 1rem;
                    }
                }
                @media (max-width: 480px) {
                    .footer-links-row {
                        flex-direction: column;
                        align-items: center;
                        gap: 0.75rem;
                    }
                }
            `}</style>
        </footer>
    );
}
