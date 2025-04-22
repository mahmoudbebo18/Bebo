import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getWishlistItems, productsCleanUp } from "../store/wishlist/wishlistSlice";
export const useWishlist = () => {
    const { loading, error, productFullInfo } = useAppSelector((state) => state.wishlist);
    const cartItems = useAppSelector((state) => state.cart.items);

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getWishlistItems("productFullInfo"))
        return () => { dispatch(productsCleanUp()) } // Fix: Clean up the store properly when unmounted
    }, [dispatch])

    const productData = productFullInfo.map(el => ({
        ...el,
        quantity: cartItems[el.id],
        isLiked: true,
        isAuthorized: true

    }))
    return { loading, error, productData }
}
