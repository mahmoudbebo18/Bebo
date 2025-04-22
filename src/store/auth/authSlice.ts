import { createSlice } from "@reduxjs/toolkit";
import { TLoading } from "../../types/shared";
import registrationAuth from "./action/registrationAuth";
import loginAuth from "./action/loginAuth";

interface IAuthState {
    loading: TLoading,
    error: null | string,
    accessToken: string | null,
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email?: string;
    } | null
}

const initialState: IAuthState = {
    loading: "idle",
    error: null,
    accessToken: null,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetUI: (state) => {
            state.loading = "idle";
            state.error = null;
        },
        authLogout: (state) => {
            state.user = null;
            state.accessToken = null;
        },
    },

    // registration
    extraReducers: (builder) => {

        // register cases
        builder.addCase(registrationAuth.pending, (state) => {
            state.loading = "pending";
        })
            .addCase(registrationAuth.fulfilled, (state) => {
                state.loading = "succeeded";
                state.error = null;
            })
            .addCase(registrationAuth.rejected, (state, action) => {
                state.loading = "failed";
                if (action.payload && typeof action.payload === "string") {
                    state.error = action.payload;
                }
            })

            // login cases
            .addCase(loginAuth.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(loginAuth.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(loginAuth.rejected, (state, action) => {
                state.loading = "failed";
                if (action.payload && typeof action.payload === "string") {
                    state.error = action.payload;
                }
            })
    }
})
export { registrationAuth, loginAuth }
export const { resetUI, authLogout } = authSlice.actions;
export default authSlice.reducer;