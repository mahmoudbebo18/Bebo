import { useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    getProductsByItems,
    changeQuantity,
    removeFromCart,
    updateQuantityInCart,
} from "../store/cart/cartSlice";
import { selectProducts } from "../store/cart/selectors/selectProduct";
import { useNavigate } from "react-router-dom";

const useCart = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const products = useAppSelector(selectProducts);
    const { loading, error } = useAppSelector((state) => state.cart);
    const { user } = useAppSelector((state) => state.auth);
    console.log("products", products);
    console.log("user", user);


    // Add isLoading state
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(getProductsByItems());
    }, [dispatch]);

    const changeQuantityHandler = useCallback(
        (id: number, quantity: number) => {
            dispatch(changeQuantity({ id, quantity }));
        },
        [dispatch]
    );

    const removeProductHandler = useCallback(
        async (id: number) => {
            try {
                await dispatch(removeFromCart(id)).unwrap();
            } catch (err) {
                throw new Error("Failed to remove item");
            }
        },
        [dispatch]
    );

    const handleProceedToCheckout = useCallback(async () => {
        setIsLoading(true);

        try {
            // 1. Update quantities in Firebase
            await Promise.all(
                products.map((product) =>
                    dispatch(
                        updateQuantityInCart({
                            productId: product.id,
                            quantity: product.quantity,
                        })
                    ).unwrap()
                    
                )
            );
            navigate("/checkout")
        } catch (error) {
            console.error("Checkout failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, products, navigate]);

    return {
        loading,
        error,
        products,
        changeQuantityHandler,
        removeProductHandler,
        handleProceedToCheckout,
        isLoading, // Return isLoading state
    };
};

export default useCart;