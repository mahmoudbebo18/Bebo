import { AppDispatch } from "../store/index";
import { handleSuccessfulPayment } from "../store/cart/action/paymentSuccess";

export const verifyPaymentAndCompleteOrder = async (dispatch: AppDispatch) => {
    try {
        const pendingOrder = sessionStorage.getItem('pendingOrder');
        if (!pendingOrder) return;

        const { orderData, orderId } = JSON.parse(pendingOrder);

        // Verify payment with your backend
        const verificationRes = await fetch(`https://bebo-backend.vercel.app/paymob/verify?orderId=${orderId}`);
        const verificationData = await verificationRes.json();

        if (verificationData.success) {
            // Update order status to completed
            const completedOrder = {
                ...orderData,
                status: "completed",
                paymobOrderId: orderId,
                transactionId: verificationData.transactionId
            };

            // Dispatch the successful payment action
            await dispatch(handleSuccessfulPayment(completedOrder)).unwrap();

            // Clear the pending order
            sessionStorage.removeItem('pendingOrder');

            return true;
        }
        return false;
    } catch (error) {
        console.error("Payment verification error:", error);
        return false;
    }
};