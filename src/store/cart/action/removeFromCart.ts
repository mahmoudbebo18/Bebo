import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { RootState } from "../../../store/index";

const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (productId: number, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI;
        const { auth } = getState() as RootState;

        try {
            if (!auth.user?.id) {
                throw new Error("User not authenticated");
            }

            const userId = auth.user.id;
            const cartItemRef = doc(db, "users", userId, "cart", `${productId}`);

            // Remove the product from the cart
            await deleteDoc(cartItemRef);

            return productId; // Return the product ID for Redux state updates
        } catch (error: any) {
            return rejectWithValue(error.message || "An unexpected error occurred");
        }
    }
);

export default removeFromCart;