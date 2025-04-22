import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { RootState } from "../../../store/index";

const updateQuantityInCart = createAsyncThunk(
    "cart/updateQuantityInCart",
    async ({ productId, quantity }: { productId: number; quantity: number }, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI;
        const { auth } = getState() as RootState;
        try {
            if (!auth.user?.id) {
                throw new Error("User not authenticated");
            }
            const userId = auth.user.id;
            const cartItemRef = doc(db, "users", userId, "cart", `${productId}`);
            await setDoc(cartItemRef, { productId, quantity }, { merge: true });
            return { productId, quantity };
        } catch (error: any) {
            return rejectWithValue(error.message || "An unexpected error occurred");
        }
    }
);

export default updateQuantityInCart;