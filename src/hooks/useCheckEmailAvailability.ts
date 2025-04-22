import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // Adjust the path to your Firebase config

type TStatus = "idle" | "checking" | "available" | "notAvailable" | "failed";

const useCheckEmailAvailability = () => {
    const [emailAvailabilityStatus, setEmailAvailabilityStatus] = useState<TStatus>("idle");

    const [enteredEmail, setEnteredEmail] = useState<null | string>(null);

    const checkEmailAvailability = async (email: string) => {
        console.log('test email availability');
        setEnteredEmail(email);
        setEmailAvailabilityStatus("checking");
        console.log('checking', email);
        try {
            // users collection to check if the email exists
            const usersQuery = query(
                collection(db, "users"),
                where("email", "==", email)
            );

            const querySnapshot = await getDocs(usersQuery);
            console.log(querySnapshot);

            if (querySnapshot.empty) {
                setEmailAvailabilityStatus("available");
            } else {
                setEmailAvailabilityStatus("notAvailable");
            }
        } catch (error) {
            setEmailAvailabilityStatus("failed");
        }
    };

    const resetCheckEmailAvailability = () => {
        setEmailAvailabilityStatus("idle");
        setEnteredEmail(null);
    };

    return {
        emailAvailabilityStatus,
        enteredEmail,
        checkEmailAvailability,
        resetCheckEmailAvailability,
    };
};

export default useCheckEmailAvailability;