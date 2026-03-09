import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="section container" style={{ paddingTop: '8rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 800 }}>Privacy Policy</h1>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>1. Information We Collect</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>We may collect the following information:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <li>Personal details such as name, phone number, email address</li>
                        <li>Account and booking-related information</li>
                        <li>Payment-related details (processed securely via third-party payment gateways)</li>
                        <li>Device, browser, and usage data for improving platform performance</li>
                    </ul>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>2. How We Use Your Information</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Your information is used to:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <li>Create and manage user accounts</li>
                        <li>Process bookings and payments</li>
                        <li>Communicate booking confirmations, updates, and support</li>
                        <li>Improve our services, features, and user experience</li>
                        <li>Prevent fraud and ensure platform security</li>
                    </ul>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>3. Data Sharing and Disclosure</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>We do not sell or rent your personal data. Information may be shared only:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <li>With venue owners for booking fulfillment</li>
                        <li>With trusted third-party service providers (payment gateways, analytics tools)</li>
                        <li>When required by law or legal authorities</li>
                    </ul>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>4. Data Security</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        We use reasonable technical and organizational measures to protect your data from unauthorized access, loss, or misuse. However, no online system is 100% secure.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>5. Cookies and Tracking</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Turfiniti may use cookies or similar technologies to:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <li>Enhance user experience</li>
                        <li>Analyze traffic and usage patterns</li>
                    </ul>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>You can manage cookie preferences through your browser settings.</p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>6. User Rights</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>You have the right to:</p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <li>Access, update, or correct your personal information</li>
                        <li>Request deletion of your account (subject to legal and transactional obligations)</li>
                        <li>Opt out of promotional communications</li>
                    </ul>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>7. Third-Party Links</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Our platform may contain links to third-party websites. Turfiniti is not responsible for the privacy practices or content of such websites.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>9. Policy Updates</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        We may update this Privacy Policy from time to time. Any changes will be effective immediately upon posting on the platform.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>10. Contact Us</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        If you have any questions or concerns regarding this Privacy Policy, you may contact us through the official communication channels available on the Turfiniti platform.
                    </p>
                </section>
            </div>
        </div>
    );
}
