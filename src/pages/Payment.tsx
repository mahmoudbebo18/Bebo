import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LottieHandler from '../components/feedback/LottieHandler/LottieHandler';
import { useAppDispatch } from '../store/hooks';
import { verifyPaymentAndCompleteOrder } from '../util/verifyPayment';

const PaymentFeedback = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get("success") === "true";
    const pending = queryParams.get("pending") === "true";
    const orderId = queryParams.get("id");
    const [verificationComplete, setVerificationComplete] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            if (success || pending) {
                const isVerified = await verifyPaymentAndCompleteOrder(dispatch);
                setVerificationComplete(isVerified ? true : false);
            }
        };
        verifyPayment();
    }, [dispatch, success, pending]);

    // Determine what to show based on verification status
    const paymentStatus = verificationComplete ? "success" :
        (success || pending) ? "pending" : "failed";

    return (
        <div className="payment-feedback-container">
            <LottieHandler
                type={paymentStatus}
                message={
                    paymentStatus === "success" ? "Payment successful!" :
                        paymentStatus === "pending" ? "Processing payment..." :
                            "Payment failed"
                }
                loop={paymentStatus === "pending"}
            />
            {orderId && <p className='text-center'>Order Number: {orderId}</p>}
        </div>
    );
};

export default PaymentFeedback;