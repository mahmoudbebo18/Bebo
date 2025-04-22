import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig"; // Adjust the path to your Firebase config
import { RootState } from "../../../store/index";

const productIds = createAsyncThunk(
    "cart/addToCart",
    async (productId: number, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI;
        const { auth } = getState() as RootState;
        try {
            if (!auth.user?.id) {
                throw new Error("User not authenticated");
            }
            const userId = auth.user.id;
            const cartItemRef = doc(db, "users", userId, "cart", `${productId}`);
            const cartItemSnapshot = await getDoc(cartItemRef);
            if (cartItemSnapshot.exists()) {
                const currentQuantity = cartItemSnapshot.data().quantity || 0;
                await setDoc(cartItemRef, { productId, quantity: currentQuantity + 1 });
            } else {
                await setDoc(cartItemRef, { productId, quantity: 1 });
            }

            return productId; // Return the product ID for Redux state updates
        } catch (error: any) {
            return rejectWithValue(error.message || "An unexpected error occurred");
        }
    }
);

export default productIds;