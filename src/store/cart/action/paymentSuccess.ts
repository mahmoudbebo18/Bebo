import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, deleteDoc, doc, updateDoc, increment, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { RootState } from "../../../store";
import { clearCart } from "../cartSlice";

const handleSuccessfulPayment = createAsyncThunk(
    "cart/handleSuccessfulPayment",
    async (_, thunkAPI) => {
        const { rejectWithValue, dispatch, getState } = thunkAPI;
        const { auth, cart } = getState() as RootState;

        try {
            if (!auth.user?.id) {
                throw new Error("User not authenticated");
            }

            const userId = auth.user.id;
            const cartCollectionRef = collection(db, "users", userId, "cart");
            const cartSnapshot = await getDocs(cartCollectionRef);

            if (cartSnapshot.empty) {
                throw new Error("Cart is empty");
            }

            // Build the order data
            const orderItems = Object.entries(cart.items).map(([productId, quantity]) => ({
                productId,
                quantity,
            }));

            const totalAmount = cart.productsFullData.reduce((sum, product) => {
                const quantity = cart.items[product.id] || 0;
                return sum + product.price * quantity;
            }, 0);

            const orderData = {
                items: orderItems,
                totalAmount,
                status: "Paid",
                createdAt: serverTimestamp(),
            };

            // 1. Create a new order under the user
            const userOrdersRef = collection(db, "users", userId, "orders");
            await addDoc(userOrdersRef, orderData);

            // 2. Empty the cart from Firestore
            const deletePromises = cartSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
            await Promise.all(deletePromises);

            // 3. Update products quantities
            const updatePromises = Object.entries(cart.items).map(async ([productId, quantityBought]) => {
                const productRef = doc(db, "products", productId);
                await updateDoc(productRef, {
                    quantity: increment(-quantityBought),
                });
            });
            await Promise.all(updatePromises);

            // 4. Clear Redux cart state
            dispatch(clearCart());

            return true;
        } catch (error: any) {
            return rejectWithValue(error.message || "An unexpected error occurred during payment handling.");
        }
    }
);

export default handleSuccessfulPayment;
