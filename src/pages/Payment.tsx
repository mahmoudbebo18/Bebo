import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useLocation } from 'react-router-dom';
import LottieHandler from '../components/feedback/LottieHandler/LottieHandler';
import { handleSuccessfulPayment } from '../store/cart/cartSlice';
const PaymentFeedback = () => {
    const location = useLocation();
    const dispatch = useAppDispatch()
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success") === "true";
    const pending = queryParams.get("pending") === "true";
    const orderId = queryParams.get("id");
    const loop = false;
    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [lottieType, setLottieType] = useState<"loading" | "success" | "error" | "pending" | "failed">("loading");
    const { items } = useAppSelector((state) => state.cart)
    useEffect(() => {
        if (pending) {
            setPaymentStatus("Pending payment...");
            setLottieType("pending");
        } else if (success) {
            setPaymentStatus("Payment successful!");
            setLottieType("success");
            const cartItemsExist = !!Object.keys(items || {}).length;
            if (cartItemsExist) {
                dispatch(handleSuccessfulPayment());
            } else {
                console.warn("Cart is empty, not dispatching handleSuccessfulPayment");
            }
            dispatch(handleSuccessfulPayment())
        } else {
            setPaymentStatus("Payment failed!");
            setLottieType("failed");
        }
    }, [success, pending, dispatch]);

    return (
        <div className="payment-feedback-container">
            <LottieHandler
                type={lottieType}
                message={paymentStatus}
                loop={loop}
                className="payment-feedback-lottie"
            />
            <p className='text-center'> Order Number: {orderId}</p>
        </div>
    );
};

export default PaymentFeedback;
