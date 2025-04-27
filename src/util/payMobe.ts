import { Address } from "../validations/checkoutSchema";

import { TProduct } from "../types/product";
export const handlePaymobCheckout = async (address: Address, phone_number: string, products: any, user: any ) => {
    if (!user) return;
    const { city, district, street, buildingNumber, notes } = address;

    try {
        await fetch("https://bebo-backend.vercel.app/paymob/auth", {
            method: "POST",
        });

        let prodData = {
            items: products.map(({ cat_prefix, isLiked, isAuthorized, ...rest }: TProduct) => ({
                ...rest,
                currency: "EGP",
            })),
            userId: user.id,
        };

        const orderRes = await fetch("https://bebo-backend.vercel.app/paymob/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prodData),
        });

        const orderData = await orderRes.json();

        let paymentKeyData = {
            amountCents: products.reduce((acc: number, p:TProduct) => acc + (p.price ?? 0) * (p.quantity ?? 0), 0) * 100,
            orderId: orderData.order_id,
            email: user?.email || "N/A",
            firstName: user?.firstName || "Mahmoud",
            city,
            district,
            buildingNumber,
            street,
            phone_number,
            notes: notes || "",
        };

        const paymentKeyRes = await fetch("https://bebo-backend.vercel.app/paymob/payment-key", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentKeyData),
        });

        const paymentKey = await paymentKeyRes.json();

        window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${import.meta.env.VITE_PAYMOB_IFRAME_ID}?payment_token=${paymentKey.token}`;
    } catch (error) {
        console.error("Paymob error:", error);
    }
};