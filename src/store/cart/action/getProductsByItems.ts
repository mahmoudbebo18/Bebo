import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { RootState } from "../../../store/index";
import { TProduct } from "../../../types/product";

const getProductsByItems = createAsyncThunk(
    "cart/getProductsByItems",
    async (_, thunkAPI) => {
        const { rejectWithValue, fulfillWithValue, getState } = thunkAPI;
        const { cart, auth } = getState() as RootState;
        try {
            if (!auth.user?.id) {
                throw new Error("User not authenticated");
            }
            const userId = auth.user.id;
            //cart subcollection for the current user
            const cartQuery = query(collection(db, "users", userId, "cart"));
            const cartSnapshot = await getDocs(cartQuery);
            if (cartSnapshot.empty) {
                return fulfillWithValue([]); // Return empty array if the cart is empty
            }

            // Extract product IDs and quantities from the cart items
            const productIds = cartSnapshot.docs.map((doc) => doc.data().productId);

            // Fetch full product details for each product ID
            const productsQuery = query(
                collection(db, "products"),
                where("id", "in", productIds)
            );

            const productsSnapshot = await getDocs(productsQuery);
            const products = productsSnapshot.docs.map((doc) => ({
                ...doc.data(),
                quantity: cart.items[doc.data().id], // Add quantity from the cart state
            })) as TProduct[];

            return products;
        } catch (error: any) {
            return rejectWithValue(error.message || "An unexpected error occurred");
        }
    }
);

export default getProductsByItems;