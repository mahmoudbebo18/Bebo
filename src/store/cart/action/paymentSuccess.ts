import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, deleteDoc, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { RootState } from "../../../store";
import { clearCart } from "../cartSlice";

// تعديل الأكشن الموجود
const handleSuccessfulPayment = createAsyncThunk(
    "cart/handleSuccessfulPayment",
    async (orderId: string, thunkAPI) => {  // نمرر orderId هنا
        const { rejectWithValue, dispatch, getState } = thunkAPI;
        const { auth, cart } = getState() as RootState;

        try {
            if (!auth.user?.id) {
                throw new Error("User not authenticated");
            }

            const userId = auth.user.id;

            // أول حاجة: قبل ما يحصل أي حاجة في الدفع، نسجل الأوردر كـ pending
            const orderRef = doc(db, "users", userId, "orders", orderId);
            await updateDoc(orderRef, {
                status: "pending",  // نسجل الأوردر كـ pending
                createdAt: serverTimestamp(),
            });

            // نفذ باقي العملية بعد الدفع الناجح
            const cartCollectionRef = collection(db, "users", userId, "cart");
            const cartSnapshot = await getDocs(cartCollectionRef);

            if (cartSnapshot.empty) {
                throw new Error("Cart is empty");
            }

            // بناء بيانات الأوردر
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
                status: "paid",  // هنحدثه بعد الدفع الناجح
                createdAt: serverTimestamp(),
            };

            // 1. تحديث الأوردر للحالة "paid" بعد الدفع الناجح
            await updateDoc(orderRef, orderData);

            // 2. Empty cart from Firestore
            const deletePromises = cartSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
            await Promise.all(deletePromises);

            // 3. تحديث الكميات في قاعدة البيانات
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
