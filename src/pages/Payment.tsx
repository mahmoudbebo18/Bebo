import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LottieHandler from '../components/feedback/LottieHandler/LottieHandler';

const PaymentFeedback = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success") === "true"; 
    const pending = queryParams.get("pending") === "true"; 
    const orderId = queryParams.get("id");

    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [lottieType, setLottieType] = useState<"loading" | "success" | "error" | "pending" | "failed">("loading");

    useEffect(() => {
        if (pending) {
            setPaymentStatus("Pending payment...");
            setLottieType("pending");
        } else if (success) {
            setPaymentStatus("Payment successful!");
            setLottieType("success");
        } else {
            setPaymentStatus("Payment failed!");
            setLottieType("failed");
        }
    }, [success, pending]);

    return (
        <div className="payment-feedback-container">
            <LottieHandler
                type={lottieType}
                message={paymentStatus}
            />
            <p className='text-center'> Order Number: {orderId}</p>
        </div>
    );
};

export default PaymentFeedback;
