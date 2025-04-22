import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig"; // Adjust the path to your Firebase config
import { RootState } from "../../../store/index";

const likeToggle = createAsyncThunk(
    "wishlist/actLikeToggle",
    async (productId: number, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI;
        const { auth } = getState() as RootState;

        try {
            if (!auth.user?.id) {
                throw new Error("User not authenticated");
            }

            const userId = auth.user.id;
            const wishlistItemRef = doc(db, "users", userId, "wishlist", `${productId}`);

            // Check if the product is already in the wishlist
            const wishlistItemSnapshot = await getDoc(wishlistItemRef);

            if (wishlistItemSnapshot.exists()) {
                // Remove the product from the wishlist
                await deleteDoc(wishlistItemRef);
                return { type: "remove", id: productId };
            } else {
                // Add the product to the wishlist
                await setDoc(wishlistItemRef, { productId });
                return { type: "add", id: productId };
            }
        } catch (error: any) {
            return rejectWithValue(error.message || "An unexpected error occurred");
        }
    }
);

export default likeToggle;