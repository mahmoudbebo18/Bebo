import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, setDoc, updateDoc, collection, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { TProduct } from "../../../types/product";
import { clearCart } from "../cartSlice";
interface IOrderData {
    address: any;
    phoneNumber: string;
    products: TProduct[];
    totalAmount: number;
    userId: string;
    status: string;
    createdAt: Date;
}

export const handleSuccessfulPayment = createAsyncThunk(
    "cart/handleSuccessfulPayment",
    async (orderData: IOrderData, thunkAPI) => {
        const { rejectWithValue, dispatch } = thunkAPI;

        try {
            const userId = orderData.userId;

            // 1. Create the order document
            const orderRef = doc(collection(db, "users", userId, "orders"));
            await setDoc(orderRef, {
                ...orderData,
                id: orderRef.id,
            });

            // 2. Update product quantities in inventory
            const batchUpdates = orderData.products.map(async (product) => {
                const productRef = doc(db, "products", product.id.toString());
                const productSnap = await getDoc(productRef);

                if (productSnap.exists()) {
                    const currentStock = productSnap.data().stock || 0;
                    const quantity = product.quantity || 0;
                    const newStock = currentStock - quantity;
                    await updateDoc(productRef, {
                        stock: newStock >= 0 ? newStock : 0,
                    });
                }
            });

            await Promise.all(batchUpdates);

            // 3. Clear the cart (dispatch the clearCart action)
            dispatch(clearCart());

            return orderRef.id;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to process payment");
        }
    }
);