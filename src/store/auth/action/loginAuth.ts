import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
type TFormData = {
    email: string;
    password: string;
}

type TResponse = {
    accessToken: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    }
}
const loginAuth = createAsyncThunk("auth/loginAuth", async (formData: TFormData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error("User data not found in Firestore.");
        }

        const userData = userDoc.data();
        console.log(userData);

        const response: TResponse = {
            accessToken: await user.getIdToken(),
            user: {
                id: user.uid,
                firstName: user.displayName || "",
                lastName: "",
                email: user.email || "",
            },
        };
        console.log('user: ' + JSON.stringify(response));

        return response;
    } catch (error: unknown) {
        console.log('the error is :', error);
        if (error instanceof Error) {
            const errorCode = error.message;
            if (errorCode.includes("Firebase: Error (auth/invalid-credential).")) {
                return rejectWithValue("Invalid credentials");
            } else {
                return rejectWithValue("An unknown error occurred during login.");
            }
        } else {
            return rejectWithValue("An unknown error occurred.");
        }
    }

})

export default loginAuth