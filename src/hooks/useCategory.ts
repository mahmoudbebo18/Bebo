import { useEffect } from "react";
import { actGetCategories, cleanCategoriesRecords } from "../store/categories/categoriesSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
export const useCategory = () => {
    const dispatch = useAppDispatch();
    const { error, loading, records } = useAppSelector((state) => state.categories);

    useEffect(() => {
        const controller = new AbortController(); // Create an AbortController
        dispatch(actGetCategories(controller.signal)); // Pass signal to thunk
        return () => {
            dispatch(cleanCategoriesRecords()); // Fix: Clean up the records when component unmounts
            controller.abort();
        }
    }, [dispatch]);
    return { loading, records, error }
}
