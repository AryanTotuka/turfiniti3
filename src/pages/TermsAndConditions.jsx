import React from 'react';

export default function TermsAndConditions() {
    return (
        <div className="section container" style={{ paddingTop: '8rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 800 }}>Terms & Conditions</h1>

            <div style={{ display: 'grid', gap: '3rem' }}>

                {/* FOR USERS */}
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>FOR USERS</h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>1. Acceptance of Terms</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>By using Turfiniti (“we,” “us”), you (“User”) agree to these Terms and our Privacy Policy.</p>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>2. User Accounts</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Users must register to book venues, providing accurate information.</li>
                                <li>You’re responsible for your account and any activity under it.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>3. Booking Process & Payments</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Users search, request, and confirm bookings using our online system (“Booking Journey”) turfiniti.com.</li>
                                <li>Payment terms are specified at booking—may include full payment or deposit via online payment gateway.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>4. Cancellation & Refund Policy</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Users may cancel within 2hr of booking for a full refund. After 2hr there will be no refund from turfiniti.com.</li>
                                <li>Venue may charge cancellation fees or hold deposits based on policy or local norms.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>5. Venue Provider Duties</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Venues must keep availability accurate, respond to booking requests timely at that time and confirm or reject bookings accordingly.</p>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>6. User Responsibilities</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Must use the venue as intended, comply with rules, and ensure all information provided is accurate.</li>
                                <li>Keep communications respectful; violations may lead to account suspension.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>7. Liability & Indemnity</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Turfiniti is not responsible for venue-related issues (e.g., damage, accidents). Users and venues agree to resolve disputes directly.</li>
                                <li>Users indemnify Turfiniti from claims arising from misuse of the platform or damages.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>8. Changes to Terms</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Turfiniti may update terms; changes are effective upon posting. Continued use implies acceptance.</p>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>9. Privacy</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Your personal data is handled according to our Privacy Policy.</p>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>10. Support</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>Contact us via e-mail or drop a message for any concerns or assistance.</p>
                        </section>
                    </div>
                </div>

                {/* FOR OWNERS */}
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>FOR OWNERS</h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>1. Acceptance of Terms</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                By registering and listing your venue (“Venue”) on Turfiniti (“Platform”, “we”, “us”), you (“Owner”) agree to abide by these Terms & Conditions, our Privacy Policy, and any additional guidelines communicated in writing.
                            </p>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>2. Owner Registration</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>You must provide accurate legal and contact details for your business.</li>
                                <li>You are responsible for maintaining the confidentiality of your account login credentials.</li>
                                <li>Any false or misleading information may result in account suspension or termination.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>3. Venue Listing Requirements</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>You must provide accurate descriptions, pricing, photos, and availability schedules.</li>
                                <li>All images must be owned by you or used with permission.</li>
                                <li>You must keep your venue’s availability always updated to prevent booking conflicts or crossbookings.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>4. Booking Process</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Bookings are confirmed through Turfiniti’s online system.</li>
                                <li>You agree to respond to booking requests within immediate effect.</li>
                                <li>If no response is given in the specified time, the request may be automatically declined.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>5. Pricing & Payments</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>You set your venue price, but Turfiniti may add its service fee to the displayed price.</li>
                                <li>Turfiniti will collect payments from customers on your behalf and remit them to you after deducting our commission.</li>
                                <li>Payouts will be made to your registered bank account within [5-6 working days] after the event date or as per agreed schedule.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>6. Cancellations & Refunds</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>You must clearly define your cancellation and refund policy when listing your venue.</li>
                                <li>If you cancel a confirmed booking, you may be charged a cancellation fee or have future payouts withheld.</li>
                                <li>Refunds to customers will be processed according to your stated policy and applicable laws.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>7. Owner Responsibilities</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Ensure the venue is safe, clean, and ready at the agreed booking time.</li>
                                <li>Comply with all local laws, permits, and licenses for operating your venue.</li>
                                <li>Notify Turfiniti immediately of any changes in availability, pricing, or facilities.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>8. Prohibited Activities</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>You must not misrepresent your venue’s facilities or capacity.</li>
                                <li>You must not engage in discriminatory or unlawful conduct towards customers.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>9. Commission & Fees</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>This rate may change with written notice.</p>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>10. Liability</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Turfiniti acts only as a booking intermediary and is not responsible for damages, accidents, or disputes between you and the customer.</li>
                                <li>You are solely responsible for any damage claims, insurance coverage, or disputes related to your venue.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>11. Termination of Partnership</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Either party may terminate this agreement with [7 days] notice.</li>
                                <li>Turfiniti may suspend or terminate your account for violations of these terms, fraudulent activity, or customer complaints.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>12. Modifications to Terms</h3>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <li>Turfiniti reserves the right to modify these Terms at any time. Changes will be posted on our website and emailed to registered owners.</li>
                                <li>Continued use of the platform after changes means you accept the updated terms.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
