import { useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    getProductsByItems,
    changeQuantity,
    removeFromCart,
    updateQuantityInCart,
} from "../store/cart/cartSlice";
import { selectProducts } from "../store/cart/selectors/selectProduct";

const useCart = () => {
    const dispatch = useAppDispatch();

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

            // 3. Step 1: Auth with Paymob
            const payToken = await fetch("https://bebo-backend.vercel.app/api/paymob/auth", {
                method: "POST",
            });
            const payTokenData = await payToken.json();
            console.log("payTokenData", payTokenData.token);
            // 4. Step 2: Create Order
            let data = {
                items: products.map(({ cat_prefix, isLiked, isAuthorized, ...rest }) => ({
                    ...rest,
                    currency: "EGP",
                })),
                userId: user?.id,
            };
            const orderRes = await fetch("https://bebo-backend.vercel.app/api/paymob/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const orderData = await orderRes.json();


            // 5. Step 3: Get payment key

            let paymentKeyData = {
                amountCents: products.reduce((acc, p) => acc + p.price * p.quantity, 0) * 100,
                orderId: orderData.order_id,
                email: user?.email || "bebobest2014@gmail.com",
                firstName: user?.firstName || "Mahmoud",
                lastName: user?.lastName || "Elkhateb",
            }
            console.log("paymentKeyData", paymentKeyData);
            
            const paymentKeyRes = await fetch("https://bebo-backend.vercel.app/api/paymob/payment-key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentKeyData),
            });

            const paymentKey = await paymentKeyRes.json();
            console.log("paymentKey", paymentKey);

            // 6. Redirect to Paymob iframe
            window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${import.meta.env.VITE_PAYMOB_IFRAME_ID}?payment_token=${paymentKey.token}`;
        } catch (error) {
            console.error("Checkout failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, products]);

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