import { createContext, useState, useContext, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';

const VenueContext = createContext(null);

export const VenueProvider = ({ children }) => {
    // structure: { [venueId]: { "YYYY-MM-DD": ["09:00 AM", "10:00 AM"] } }
    const [blockedSlots, setBlockedSlots] = useState({
        1: { "2025-05-20": ["09:00 AM", "09:30 AM"] }, // Example mock data for venue 1
    });

    // structure: { [venueId]: { [sport]: { [date]: ["09:00 AM"] } } }
    const [bookings, setBookings] = useState({});
    const [bookingsList, setBookingsList] = useState([]);

    // Fetch Bookings Realtime
    useEffect(() => {
        const q = query(collection(db, "bookings"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newBookingsMap = {};
            const newBookingsList = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                const booking = { id: doc.id, ...data };
                newBookingsList.push(booking);

                // Populate lookup map for O(1) access
                if (data.venueId && data.date && data.slots && data.status !== 'cancelled') {
                    const vId = Number(data.venueId) || data.venueId;
                    // Default to "General" or first available if legacy
                    const sport = data.sport || "General";

                    if (!newBookingsMap[vId]) newBookingsMap[vId] = {};
                    if (!newBookingsMap[vId][sport]) newBookingsMap[vId][sport] = {};
                    if (!newBookingsMap[vId][sport][data.date]) newBookingsMap[vId][sport][data.date] = [];

                    newBookingsMap[vId][sport][data.date].push(...data.slots);
                }
            });

            console.log("Bookings Map Updated:", newBookingsMap);
            setBookings(newBookingsMap);
            setBookingsList(newBookingsList);
        }, (error) => {
            console.error("Error fetching bookings:", error);
        });

        return () => unsubscribe();
    }, []);

    const blockSlot = (venueId, date, slot) => {
        setBlockedSlots(prev => {
            const venueBlocks = prev[venueId] || {};
            const slotsForDate = venueBlocks[date] || [];
            if (slotsForDate.includes(slot)) return prev;
            return {
                ...prev,
                [venueId]: {
                    ...venueBlocks,
                    [date]: [...slotsForDate, slot]
                }
            };
        });
    };

    const unblockSlot = (venueId, date, slot) => {
        setBlockedSlots(prev => {
            const venueBlocks = prev[venueId] || {};
            const slotsForDate = venueBlocks[date] || [];
            return {
                ...prev,
                [venueId]: {
                    ...venueBlocks,
                    [date]: slotsForDate.filter(s => s !== slot)
                }
            };
        });
    };

    const isSlotBlocked = (venueId, date, slot) => {
        return blockedSlots[venueId]?.[date]?.includes(slot) || false;
    };

    const addBooking = (bookingDetails) => {
        const { venueId, date, slots, sport } = bookingDetails;
        const vId = Number(venueId) || venueId;
        const s = sport || "General";

        setBookings(prev => {
            const venueBookings = prev[vId] || {};
            const sportBookings = venueBookings[s] || {};
            const currentSlots = sportBookings[date] || [];

            return {
                ...prev,
                [vId]: {
                    ...venueBookings,
                    [s]: {
                        ...sportBookings,
                        [date]: [...currentSlots, ...slots]
                    }
                }
            };
        });

        // Also add to list for completeness (optional for visual, good for consistency)
        setBookingsList(prev => [{ id: "temp-" + Date.now(), ...bookingDetails }, ...prev]);
    };

    // Deprecated: Logic now handled by Firestore listener
    const cancelBooking = (bookingId) => {
        console.log("cancelBooking called - handled by Firestore sync");
    };

    const isSlotBooked = (venueId, date, slot, sportType) => {
        // If sportType is provided, check specifically.
        const sport = sportType || "General";

        // Check specific sport
        const isSportBooked = bookings[venueId]?.[sport]?.[date]?.includes(slot) || false;

        // ALSO Check "General" bookings (legacy or blocked for all)
        // If the current request IS General, we don't need to check it twice, but it doesn't hurt.
        const isGeneralBooked = bookings[venueId]?.["General"]?.[date]?.includes(slot) || false;

        return isSportBooked || isGeneralBooked;
    };

    return (
        <VenueContext.Provider value={{
            blockedSlots,
            bookings,
            bookingsList,
            blockSlot,
            unblockSlot,
            isSlotBlocked,
            addBooking,
            cancelBooking,
            isSlotBooked
        }}>
            {children}
        </VenueContext.Provider>
    );
};

export const useVenue = () => useContext(VenueContext);
