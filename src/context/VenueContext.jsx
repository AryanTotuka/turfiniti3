import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const VenueContext = createContext(null);

export const VenueProvider = ({ children }) => {
    // structure: { [venueId]: { "YYYY-MM-DD": ["09:00 AM", "10:00 AM"] } }
    const [blockedSlots, setBlockedSlots] = useState({
        1: { "2025-05-20": ["09:00 AM", "09:30 AM"] }, // Example mock data for venue 1
    });

    // structure: { [venueId]: { [sport]: { [date]: ["09:00 AM"] } } }
    const [bookings, setBookings] = useState({});
    const [bookingsList, setBookingsList] = useState([]);
    
    // Venues state
    const [venues, setVenues] = useState([]);
    const [loadingVenues, setLoadingVenues] = useState(true);

    const fetchVenues = async () => {
        try {
            setLoadingVenues(true);
            const res = await api.get('/venues');
            // If API fails or is empty, we would set an empty array.
            // For transition, we could fallback to static venues if needed, but let's stick to API only since we are building dynamic mgmt.
            // The API response will contain _id as string. Let's map it to id for frontend compatibility.
            const fetchedVenues = res.data.map(v => ({ ...v, id: v._id || v.id }));
            setVenues(fetchedVenues);
        } catch (error) {
            console.error("Error fetching venues:", error);
        } finally {
            setLoadingVenues(false);
        }
    };

    useEffect(() => {
        fetchVenues();
    }, []);

    // Fetch Bookings from API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/public');
                const newBookingsMap = {};
                const newBookingsList = [];

                res.data.forEach((data) => {
                    const booking = { id: data._id, ...data };
                    newBookingsList.push(booking);

                    // Populate lookup map for O(1) access
                    if (data.venueId && data.date && data.slots && data.status !== 'cancelled') {
                        const vId = String(data.venueId);
                        // Default to "General" or first available if legacy
                        const sport = data.sport || "General";

                        if (!newBookingsMap[vId]) newBookingsMap[vId] = {};
                        if (!newBookingsMap[vId][sport]) newBookingsMap[vId][sport] = {};
                        if (!newBookingsMap[vId][sport][data.date]) newBookingsMap[vId][sport][data.date] = [];

                        newBookingsMap[vId][sport][data.date].push(...data.slots);
                    }
                });

                console.log("Bookings Map Updated from API:", newBookingsMap);
                setBookings(newBookingsMap);
                setBookingsList(newBookingsList);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
        // Poll every 30 seconds for live-like updates
        const interval = setInterval(fetchBookings, 30000);
        return () => clearInterval(interval);
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
            venues,
            loadingVenues,
            refreshVenues: fetchVenues,
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
