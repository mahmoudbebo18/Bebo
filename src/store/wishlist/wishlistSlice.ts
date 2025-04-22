import { createSlice } from "@reduxjs/toolkit";
import likeToggle from "./action/likeToggle";
import getWishlistItems from "./action/getWishlistItems";
import { TLoading } from "../../types/shared";
import { TProduct } from "../../types/product";
import { authLogout } from "../auth/authSlice";
interface IWishlistState {
    itemsId: number[],
    productFullInfo: TProduct[]
    error: null | string,
    loading: TLoading,
}

const initialState: IWishlistState = {
    itemsId: [],
    productFullInfo: [],
    error: null,
    loading: "idle",
};

const wishListSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        productsCleanUp: (state) => {
            state.productFullInfo = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(likeToggle.pending, (state) => {
            state.error = null;
        });
        builder.addCase(likeToggle.fulfilled, (state, action) => {
            if (action.payload.type === "add") {
                state.itemsId.push(action.payload.id);
            } else {
                state.itemsId = state.itemsId.filter(item => item !== action.payload.id)
                state.productFullInfo = state.productFullInfo.filter(item => item.id !== action.payload.id)
            }
        });
        builder.addCase(likeToggle.rejected, (state, action) => {
            if (action.payload && typeof action.payload === "string") {
                state.error = action.payload;
            }
        })

        //get wishlist items

        builder.addCase(getWishlistItems.pending, (state) => {
            state.loading = "pending";
            state.error = null;
        });
        builder.addCase(getWishlistItems.fulfilled, (state, action) => {
            state.loading = "succeeded";
            if(action.payload.dataType === "productsFullInfo"){
                state.productFullInfo = action.payload.data as TProduct []
            }else{
                state.itemsId = action.payload.data as number []
            }
        });
        builder.addCase(getWishlistItems.rejected, (state, action) => {
            state.loading = "failed";
            if (action.payload && typeof action.payload === "string") {
                state.error = action.payload;
            }
        })
        // when logout reset the wihlist counter 
        builder.addCase(authLogout, (state) => {
            state.itemsId = [],
            state.productFullInfo = []
        })
    }
})

export { likeToggle, getWishlistItems }
export const { productsCleanUp } = wishListSlice.actions
export default wishListSlice.reducer