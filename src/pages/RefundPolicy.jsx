import React from 'react';

export default function RefundPolicy() {
    return (
        <div className="section container" style={{ paddingTop: '8rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 800 }}>Return & Refund Policy</h1>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>Cancellation Window</h2>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>

                        <li>20% cancellation fee will be charged and 80% of the money will be refunded within 72 hours.</li>
                    </ul>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>No-Show Policy</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        If the user fails to show up at the venue at the scheduled time without prior cancellation, no refund will be issued.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>Late Cancellations by Venue</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        If a booking is cancelled by the venue due to unforeseen circumstances, the user will receive a full refund or an option to reschedule, as preferred.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>Refund Processing Time</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Approved refunds will be processed within 5–7 working days and credited back to the original payment method.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>Non-Refundable Charges</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Any applicable convenience fees, payment gateway charges, or promotional discounts may be non-refundable unless required by law.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>Force Majeure</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Refunds due to events beyond control (such as natural disasters, government restrictions, or emergencies) will be handled on a case-by-case basis.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'black' }}>Policy Updates</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        Turfiniti reserves the right to modify this policy at any time. Updated policies will be effective immediately upon publication on the platform.
                    </p>
                </section>
            </div>
        </div>
    );
}
