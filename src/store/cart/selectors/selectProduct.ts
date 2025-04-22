import { createSelector } from "@reduxjs/toolkit";
import { ICartState } from "../cartSlice";

// Selector to compute products array
export const selectProducts = createSelector(
    (state: { cart: ICartState }) => state.cart.productsFullData,
    (state: { cart: ICartState }) => state.cart.items,
    (productsFullData, items) =>
        productsFullData.map((product) => ({
            ...product,
            quantity: items[product.id] || 0,
        }))
);