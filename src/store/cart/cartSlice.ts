import { createSlice } from "@reduxjs/toolkit";
import { TProduct } from "../../types/product";
import getProductsByItems from "./action/getProductsByItems";
import removeFromCart from "./action/removeFromCart";
import updateQuantityInCart from "./action/updateQuantityInCart";
import productIds from "./action/productIds";
import fetchCartItems from "./action/fetchCartItems";
import handleSuccessfulPayment from "./action/paymentSuccess";
import { TLoading } from "../../types/shared";

export interface ICartState {
    items: { [key: string]: number };
    productsFullData: TProduct[];
    totalQuantity: number;
    loading: TLoading;
    error: null | string;
}

const initialState: ICartState = {
    items: {},
    productsFullData: [],
    totalQuantity: 0,
    loading: "idle",
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        changeQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const currentQuantity = state.items[id] || 0;
            state.items[id] = quantity;
            state.totalQuantity += quantity - currentQuantity;
        },
        removeItem: (state, action) => {
            const id = action.payload;
            const itemQuantity = state.items[id] || 0;
            delete state.items[id];
            state.productsFullData = state.productsFullData.filter(
                (item) => item.id !== id
            );
            state.totalQuantity -= itemQuantity;
        },
        clearCart: (state) => {
            state.items = {};
            state.productsFullData = [];
            state.totalQuantity = 0; // Reset total quantity
        },
    },
    extraReducers: (builder) => {
        builder
            // store the products ids
            .addCase(productIds.fulfilled, (state, action) => {
                const productId = action.payload;
                if (state.items[productId]) {
                    state.items[productId]++;
                } else {
                    state.items[productId] = 1;
                }
                state.totalQuantity++;
                state.loading = "succeeded";
            })
            .addCase(productIds.rejected, (state, action) => {
                state.loading = "failed";
                if (action.payload && typeof action.payload == "string") {
                    state.error = action.payload;
                }
            })

            // get the stored products from its ids
            .addCase(getProductsByItems.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(getProductsByItems.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.productsFullData = action.payload;
            })
            .addCase(getProductsByItems.rejected, (state, action) => {
                state.loading = "failed";
                if (action.payload && typeof action.payload == "string") {
                    state.error = action.payload;
                }
            })

            // remove item from the cart in database
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const productId = action.payload;
                const itemQuantity = state.items[productId] || 0;
                delete state.items[productId];
                state.productsFullData = state.productsFullData.filter(
                    (item) => item.id !== productId
                );
                state.totalQuantity -= itemQuantity;
                state.loading = "succeeded";
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = "failed";
                if (action.payload && typeof action.payload == "string") {
                    state.error = action.payload;
                }
            })

            // update quantity in cart and database thunk 
            .addCase(updateQuantityInCart.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload;
                const currentQuantity = state.items[productId] || 0;
                state.items[productId] = quantity;
                state.totalQuantity += quantity - currentQuantity;
                state.loading = "succeeded";
            })
            .addCase(updateQuantityInCart.rejected, (state, action) => {
                state.loading = "failed";
                if (action.payload && typeof action.payload == "string") {
                    state.error = action.payload;
                }
            })

            // fetch cart items when user logs in
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                const { items, totalQuantity } = action.payload;
                state.items = items;
                state.totalQuantity = totalQuantity;
                state.loading = "succeeded";
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.loading = "failed";
                if (action.payload && typeof action.payload == "string") {
                    state.error = action.payload;
                }
            })
            // handle successful payment
            .addCase(handleSuccessfulPayment.pending, (state) => {
                state.loading = "pending";
                state.error = null;
            })
            .addCase(handleSuccessfulPayment.fulfilled, (state) => {
                state.loading = "succeeded";
            })
            .addCase(handleSuccessfulPayment.rejected, (state, action) => {
                state.loading = "failed";
                if (action.payload && typeof action.payload == "string") {
                    state.error = action.payload;
                }
            });
    },
});

export { getProductsByItems, productIds, removeFromCart, updateQuantityInCart, fetchCartItems, handleSuccessfulPayment };
export const { changeQuantity, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;