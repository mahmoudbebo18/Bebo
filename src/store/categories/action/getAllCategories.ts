import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { TCategory } from "../../../types/Category";
import { db } from "../../../firebase/firebaseConfig";

type TResponse = TCategory[];

const actGetCategories = createAsyncThunk(
    "categories/actGetCategories",
    async (signal: AbortSignal, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const categoriesData = await getDocs(collection(db, "categories"));
            if (signal.aborted) throw new Error("Request aborted");
            const categories: TResponse = categoriesData.docs.flatMap((doc) => {
                const data = doc.data();
                if (data.categories) {
                    return data.categories.map((categoryData: TCategory) => {
                        const category: TCategory = {
                            id: categoryData.id,
                            title: categoryData.title ?? "",
                            prefix: categoryData.prefix ?? "",
                            img: categoryData.img ?? "",
                        };
                        return category;
                    });
                }
                return []; // return an empty array if no categories field
            });

            return categories;
        } catch (error) {
            return rejectWithValue("Failed to fetch categories from Firestore");
        }
    }
);

export default actGetCategories;
