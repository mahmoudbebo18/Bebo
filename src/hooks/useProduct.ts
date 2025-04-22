import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { actGetProductsByCatPrefix, productsCleanUp } from "../store/products/productsSlice";

export const useProduct = () => {
    const params = useParams();
    const productPrefix = params.prefix
    const dispatch = useAppDispatch();
    const { loading, error, records } = useAppSelector((state) => state.products);
    const cartItems = useAppSelector((state) => state.cart.items);
    const wishlistItemsIds = useAppSelector((state) => state.wishlist.itemsId);
    const userAccessToken = useAppSelector((state) => state.auth.accessToken);

    useEffect(() => {
        const promise = dispatch(actGetProductsByCatPrefix(params.prefix as string));

        return () => {
            dispatch(productsCleanUp());
            promise.abort()
        };
    }, [dispatch, productPrefix]);

    const productData = records.map(el => ({
        ...el,
        quantity: cartItems[el.id], // this will return the quantity of the current product id
        isLiked: wishlistItemsIds.includes(el.id), //returns true and false 
        isAuthorized: userAccessToken ? true : false
    }))
    return { loading, error, productData, productPrefix }
}
