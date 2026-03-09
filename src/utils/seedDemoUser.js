import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const DEMO_EMAIL = "demo.owner@turfiniti.com";
const DEMO_PASSWORD = "password123";

/**
 * Ensures the Demo Owner account exists in Firebase Auth and Firestore.
 */
export const seedDemoUser = async () => {
    try {
        // 1. Try to sign in to check existence
        try {
            await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
            console.log("Demo user exists and logged in successfully.");
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                console.log("Demo user not found. Creating...");
                // 2. Create if not exists
                const userCredential = await createUserWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
                const user = userCredential.user;

                // 3. Set Firestore Data
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: "Demo Partner",
                    email: DEMO_EMAIL,
                    phone: "+91 99999 88888",
                    role: "owner",
                    createdAt: new Date().toISOString()
                });
                console.log("Demo user created and seeded to Firestore.");
            } else {
                console.error("Error checking demo user:", error);
            }
        }

        // 4. Double check Firestore role just in case (e.g. if Auth existed but Firestore didn't)
        // Since we might be logged in now (either from initial sign-in or creation)
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.email === DEMO_EMAIL) {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    uid: currentUser.uid,
                    name: "Demo Partner",
                    email: DEMO_EMAIL,
                    phone: "+91 99999 88888",
                    role: "owner",
                    createdAt: new Date().toISOString()
                });
                console.log("Restored missing Firestore profile for Demo User.");
            }
        }

    } catch (error) {
        console.error("Seed Demo User failed:", error);
    }

    // Seed Pickleball Owner
    try {
        const PB_EMAIL = "pickleball@turfiniti.com";
        const PB_PASS = "password123";

        try {
            await signInWithEmailAndPassword(auth, PB_EMAIL, PB_PASS);
            console.log("Pickleball owner exists.");
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                const uc = await createUserWithEmailAndPassword(auth, PB_EMAIL, PB_PASS);
                const u = uc.user;
                await setDoc(doc(db, "users", u.uid), {
                    uid: u.uid,
                    name: "Pickleball Manager",
                    email: PB_EMAIL,
                    phone: "+91 98765 00000",
                    role: "owner",
                    createdAt: new Date().toISOString()
                });
                console.log("Pickleball owner created.");
            }
        }
    } catch (e) {
        console.error("Seed Pickleball Owner failed", e);
    }
};
