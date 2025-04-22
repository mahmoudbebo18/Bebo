import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosErrorHandler from "../../../util/axiosErrorHandler";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

type TFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
const registrationAuth = createAsyncThunk("auth/registrationAuth", async (formData: TFormData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: `${formData.firstName} ${formData.lastName}`,
        });

        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            createdAt: new Date().toISOString(),
        });
        
        const response = {
            accessToken: await user.getIdToken(),
            user: {
                id: user.uid,
                firstName: user.displayName || "",
                lastName: "",
                password: formData.password,
            },
        }
        return response;

    } catch (error) {
        return rejectWithValue(axiosErrorHandler(error))
    }
})

export default registrationAuth;