import api from '../api';

export const sendBookingConfirmation = async (bookingDetails) => {
    try {
        const response = await api.post('/email/send-booking-confirmation', bookingDetails);
        return response.data;
    } catch (error) {
        console.error('Failed to send email confirmation:', error);
        const errMsg = error.response?.data?.message || error.response?.data?.msg || error.message;
        return { success: false, message: 'Failed to send email confirmation', error: errMsg };
    }
};
