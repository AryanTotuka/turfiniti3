import emailjs from '@emailjs/browser';

// Replace these with your actual EmailJS credentials
// You can get these from https://dashboard.emailjs.com/admin
const SERVICE_ID = 'service_7vivfb5';
const TEMPLATE_ID = 'template_jdp1391';
const PUBLIC_KEY = 'Nr2uSwYkC1nf_cfQw';

export const sendBookingConfirmation = async (bookingDetails) => {
    try {
        const templateParams = {
            to_name: bookingDetails.userName,
            to_email: bookingDetails.userEmail,
            venue_name: bookingDetails.venueName,
            date: bookingDetails.date,
            slots: bookingDetails.slots.join(', '),
            total_price: bookingDetails.totalPrice,
            booking_id: bookingDetails.bookingId,
            reply_to: 'turfinity25@gmail.com'
        };

        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );

        console.log('Email sent successfully!', response.status, response.text);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Failed to send email:', error);
        // Alert the user with the specific error text from EmailJS if available
        // Suppress alert for now to avoid interrupting user flow if credentials are invalid
        console.error('EmailJS Error Text:', error.text || 'Unknown error');
        // alert(`Email Error: ${error.text}`);
        return { success: false, message: 'Failed to send email', error };
    }
};
