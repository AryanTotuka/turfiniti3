import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const JAIPUR_EMAIL = "jaipur.owner@turfiniti.com";
const JAIPUR_PASSWORD = "password123";

/**
 * Ensures the Jaipur Owner account exists.
 */
export const seedJaipurOwner = async () => {
    try {
        // 1. Try to sign in to check existence
        try {
            await signInWithEmailAndPassword(auth, JAIPUR_EMAIL, JAIPUR_PASSWORD);
            console.log("Jaipur owner exists.");
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                console.log("Jaipur owner not found. Creating...");
                // 2. Create if not exists
                const userCredential = await createUserWithEmailAndPassword(auth, JAIPUR_EMAIL, JAIPUR_PASSWORD);
                const user = userCredential.user;

                // 3. Set Firestore Data
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: "Jaipur Partner",
                    email: JAIPUR_EMAIL,
                    phone: "+91 99887 76655",
                    role: "owner",
                    createdAt: new Date().toISOString()
                });
                console.log("Jaipur owner created.");
            }
        }
    } catch (error) {
        console.error("Seed Jaipur Owner failed:", error);
    }
};
