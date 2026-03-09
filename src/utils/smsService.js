/**
 * Mock SMS Service
 * Simulates sending SMS messages to players and owners.
 */

const logSMS = (to, message) => {
    console.log(`%c[SMS MOCK] To: ${to}\nMessage: ${message}`, "color: #10b981; font-weight: bold; background: #ecfdf5; padding: 4px; border-radius: 4px;");
};

export const sendPlayerBookingSMS = async ({ phone, userName, venueName, date, slots, bookingId }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const message = `Hi ${userName}, your booking at ${venueName} is CONFIRMED! 
Date: ${date}
Slots: ${slots.join(', ')}
Booking ID: ${bookingId}
Happy Playing! - Turfiniti`;

    logSMS(phone, message);
    return { success: true };
};

export const sendOwnerBookingSMS = async ({ ownerPhone, venueName, userName, userPhone, date, slots, sport }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const message = `New Booking Alert for ${venueName}!
Sport: ${sport}
Player: ${userName} (${userPhone})
Date: ${date}
Slots: ${slots.join(', ')}
Please ensure the turf is ready.`;

    logSMS(ownerPhone, message);
    return { success: true };
};
