import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LottieHandler from '../components/feedback/LottieHandler/LottieHandler';
const PaymentFeedback = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const orderId = queryParams.get("order_id");

    const [paymentStatus, setPaymentStatus] = useState<string>('');
    const [lottieType, setLottieType] = useState<"loading" | "success" | "error" | "pending" | "failed">("loading");

    useEffect(() => {
        if (status) {
            switch (status) {
                case "pending":
                    setPaymentStatus("Pending payment...");
                    setLottieType("pending");
                    break;
                case "success":
                    setPaymentStatus("Payment successful!");
                    setLottieType("success");
                    break;
                case "failed":
                    setPaymentStatus("Payment failed!");
                    setLottieType("failed");
                    break;
                default:
                    setPaymentStatus("We couldn't find your payment status.");
                    setLottieType("error");
                    break;
            }
        }
    }, [status]);

    return (
        <div className="payment-feedback-container">
            <LottieHandler
                type={lottieType}
                message={paymentStatus}
            />
            <p>رقم الطلب: {orderId}</p>
        </div>
    );
};

export default PaymentFeedback;
