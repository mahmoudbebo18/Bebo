import { createSlice } from "@reduxjs/toolkit";
import actGetCategories from "./action/getAllCategories";
import { TCategory } from "../../types/Category";
import { TLoading } from "../../types/shared";
interface categoriesState {
  records: TCategory[],
  loading: TLoading,
  error: string | null
}

const initialState: categoriesState = {
  records: [],
  loading: "idle",
  error: null,
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    cleanCategoriesRecords: (state) => {
      state.records = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(actGetCategories.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetCategories.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.records = action.payload;
    });
    builder.addCase(actGetCategories.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });
  },
});


export { actGetCategories };

export const { cleanCategoriesRecords } = categoriesSlice.actions;
export default categoriesSlice.reducer;
