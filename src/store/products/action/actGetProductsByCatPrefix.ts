import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig"; // Adjust the path to your firebase config
import { TProduct } from "../../../types/product";

type TResponse = TProduct[];

const actGetProductsByCatPrefix = createAsyncThunk(
  "products/actGetProductsByCatPrefix",
  async (prefix: string, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      // Reference to the products collection
      const productsRef = collection(db, "products");

      // filter products by cat_prefix
      const q = query(productsRef, where("cat_prefix", "==", prefix));

      const querySnapshot = await getDocs(q);

      // Map the documents to an array of products
      const products: TResponse = [];
      querySnapshot.forEach((doc) => {
        products.push({ ...doc.data() } as TProduct);
      });

      return products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export default actGetProductsByCatPrefix;