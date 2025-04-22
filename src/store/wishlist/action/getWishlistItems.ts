import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig"; // Adjust the path to your Firebase config
import { RootState } from "../../../store/index";
import { TProduct } from "../../../types/product";

type TDataType = "productFullInfo" | "productIds";

const getWishlistItems = createAsyncThunk(
    "wishlist/getWishlistItems",
    async (dataType: TDataType, thunkAPI) => {
        const { rejectWithValue, getState } = thunkAPI;
        const { auth } = getState() as RootState;
        try {
            if (!auth.user?.id) {
                throw new Error("User not authenticated");
            }
            const userId = auth.user.id;
            // Query the wishlist subcollection for the current user
            const wishlistQuery = query(collection(db, "users", userId, "wishlist"));

            const wishlistSnapshot = await getDocs(wishlistQuery);

            if (wishlistSnapshot.empty) {
                return { data: [], dataType: "empty" };
            }

            const productIds = wishlistSnapshot.docs.map((doc) => doc.data().productId);

            if (dataType === "productIds") {
                return { data: productIds, dataType: "productsIds" };
            } else {
                // Fetch full product details for each product ID
                const productsQuery = query(
                    collection(db, "products"),
                    where("id", "in", productIds)
                );

                const productsSnapshot = await getDocs(productsQuery);
                const products = productsSnapshot.docs.map((doc) => ({
                    ...doc.data(),
                })) as TProduct[];

                return { data: products, dataType: "productsFullInfo" };
            }
        } catch (error: any) {
            return rejectWithValue(error.message || "An unexpected error occurred");
        }
    }
);

export default getWishlistItems;