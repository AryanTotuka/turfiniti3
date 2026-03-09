import { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Fetch user role and details from Firestore
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setUser({
                            ...userDoc.data(),
                            id: currentUser.uid, // Ensure id is always set
                            uid: currentUser.uid, // Alias for consistency
                            email: currentUser.email
                        });
                    } else {
                        // Profile doesn't exist? (Shouldn't happen with correct signup)
                        setUser({
                            uid: currentUser.uid,
                            email: currentUser.email,
                            name: currentUser.displayName || 'User',
                            role: 'player' // default fallback
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Still set user basic info even if profile fetch fails
                    setUser({
                        uid: currentUser.uid,
                        email: currentUser.email
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (userData) => {
        // This is now legacy/mock. 
        // Real login happens via firebase/auth and the listener will pick it up.
        // We can keep it for now as a fallback or remove it.
        // For compatibility with existing calls, we just log.
        console.log("Legacy login called (handled by listener)", userData);
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
