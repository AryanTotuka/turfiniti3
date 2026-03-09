import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const DEMO_PLAYER_EMAIL = "demo.player@turfiniti.com";
const DEMO_PASSWORD = "password123";

/**
 * Ensures the Demo Player account exists.
 */
export const seedDemoPlayer = async () => {
    try {
        // 1. Try to sign in to check existence
        try {
            await signInWithEmailAndPassword(auth, DEMO_PLAYER_EMAIL, DEMO_PASSWORD);
            console.log("Demo player exists.");
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                console.log("Demo player not found. Creating...");
                // 2. Create if not exists
                const userCredential = await createUserWithEmailAndPassword(auth, DEMO_PLAYER_EMAIL, DEMO_PASSWORD);
                const user = userCredential.user;

                // 3. Set Firestore Data
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: "Demo Player",
                    email: DEMO_PLAYER_EMAIL,
                    phone: "+91 98765 43210",
                    role: "player",
                    createdAt: new Date().toISOString()
                });
                console.log("Demo player created.");
            }
        }
    } catch (error) {
        console.error("Seed Demo Player failed:", error);
    }
};
