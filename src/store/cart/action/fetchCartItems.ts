import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { RootState } from "../../../store/index";

const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (_, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI;
        const { auth } = getState() as RootState;

        try {
            if (!auth.user?.id) {
                throw new Error("User not authenticated");
            }

            const userId = auth.user.id;
            const cartQuery = collection(db, "users", userId, "cart");
            const cartSnapshot = await getDocs(cartQuery);

            const items: { [key: string]: number } = {};
            let totalQuantity = 0;

            cartSnapshot.forEach((doc) => {
                const { productId, quantity } = doc.data();
                items[productId] = quantity;
                totalQuantity += quantity;
            });
            return { items, totalQuantity };
        } catch (error: any) {
            return rejectWithValue(error.message || "An unexpected error occurred");
        }
    }
);

export default fetchCartItems;