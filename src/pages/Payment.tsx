import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("success");
    const orderId = queryParams.get("id");

    const [paymentStatus, setPaymentStatus] = useState("");

    useEffect(() => {
        if (status) {
            if (status === "true") {
                setPaymentStatus("Payment successful!");
            } else {
                setPaymentStatus("Failed to process payment. Please try again.");
            }
        }
    }, [status]);

    return (
        <div>
            <h2>{paymentStatus}</h2>
            <p>رقم الطلب: {orderId}</p>
        </div>
    );
};

export default Payment;
