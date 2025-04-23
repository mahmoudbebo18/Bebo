import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppSelector } from "../store/hooks";
import useCart from "../hooks/useCart";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { addressSchema, checkoutSchema } from "../validations/checkoutSchema";

type Address = z.infer<typeof addressSchema>;
type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
    const { products } = useCart();
    const { user } = useAppSelector((state) => state.auth);
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            phone_number: "",
            city: "",
            district: "",
            street: "",
            buildingNumber: "",
            notes: "",
            saveAddress: false,
            selectedAddressIndex: null,
        }
    });

    const selectedAddressIndex = watch("selectedAddressIndex");

    // Fetch saved addresses
    useEffect(() => {
        if (!user) return;
        const fetchAddresses = async () => {
            const userRef = doc(db, "users", user.id);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                setSavedAddresses(data.addresses || []);
            }
        };
        fetchAddresses();
    }, [user]);

    // Populate form when a saved address is selected
    useEffect(() => {
        if (selectedAddressIndex !== null && selectedAddressIndex !== undefined && savedAddresses[selectedAddressIndex]) {
            const addr = savedAddresses[selectedAddressIndex];
            setValue("city", addr.city);
            setValue("district", addr.district);
            setValue("street", addr.street);
            setValue("buildingNumber", addr.buildingNumber);
            setValue("notes", addr.notes || "");
        }
    }, [selectedAddressIndex, savedAddresses, setValue]);

    const handlePaymobCheckout = async (address: Address, phone_number: string) => {
        if (!user) return;
        const { city, district, street, buildingNumber, notes } = address;
        console.log("Address:", address);
        console.log("Phone Number:", phone_number);
        console.log('notes:', notes);
        
        
        try {
            await fetch("http://localhost:5000/paymob/auth", {
                method: "POST",
            });

            let prodData = {
                items: products.map(({ cat_prefix, isLiked, isAuthorized, ...rest }) => ({
                    ...rest,
                    currency: "EGP",
                })),
                userId: user.id,
            };

            const orderRes = await fetch("http://localhost:5000/paymob/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(prodData),
            });

            const orderData = await orderRes.json();

            let paymentKeyData = {
                amountCents: products.reduce((acc, p) => acc + p.price * p.quantity, 0) * 100,
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

            const paymentKeyRes = await fetch("http://localhost:5000/paymob/payment-key", {
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

    const onSubmit = async (data: CheckoutFormData) => {
        if (!user) return;
        setIsLoading(true);

        try {
            let selectedAddress: Address;

            if (data.selectedAddressIndex !== null && data.selectedAddressIndex !== undefined) {
                // Use saved address
                selectedAddress = savedAddresses[data.selectedAddressIndex];
            } else {
                // Validate new address fields
                if (!data.city || !data.district || !data.street || !data.buildingNumber) {
                    throw new Error("Address fields are required when not using saved address");
                }

                // Use new address
                selectedAddress = {
                    city: data.city!,
                    district: data.district!,
                    street: data.street!,
                    buildingNumber: data.buildingNumber!,
                    notes: data.notes!,
                };

                if (data.saveAddress) {
                    await updateDoc(doc(db, "users", user.id), {
                        addresses: arrayUnion(selectedAddress),
                    });
                    setSavedAddresses((prev) => [...prev, selectedAddress]);
                }
            }

            await handlePaymobCheckout(selectedAddress, data.phone_number);
            reset();
            setShowNewAddress(false);
            setValue("selectedAddressIndex", null);
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Row className="mt-4">
            <Col md={{ span: 8, offset: 2 }}>
                <h2>Checkout</h2>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register("selectedAddressIndex")} />

                    {/* User Info */}
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={`${user?.firstName} ${user?.lastName}`} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control value={user?.email || ""} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            {...register("phone_number")}
                            isInvalid={!!errors.phone_number}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone_number?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Saved Addresses */}
                    {savedAddresses.length > 0 && !showNewAddress && (
                        <>
                            <h5>Choose a saved address:</h5>
                            {savedAddresses.map((addr, index) => (
                                <Card key={index} className="mb-2">
                                    <Card.Body>
                                        <Form.Check
                                            type="radio"
                                            id={`address-${index}`}
                                            value={index}
                                            checked={selectedAddressIndex === index}
                                            onChange={() => {
                                                setValue("selectedAddressIndex", index);
                                            }}
                                            label={`${addr.city}, ${addr.district}, ${addr.street}, Building ${addr.buildingNumber}`}
                                        />
                                        {addr.notes && <p className="mb-0"><em>{addr.notes}</em></p>}
                                    </Card.Body>
                                </Card>
                            ))}

                            <Button
                                type="submit"
                                variant="success"
                                className="mt-2"
                                disabled={selectedAddressIndex === null || selectedAddressIndex === undefined}
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span className="ms-2">Proceeding...</span>
                                    </>
                                ) : (
                                    "Submit Checkout"
                                )}
                            </Button>

                            <Button
                                variant="link"
                                onClick={() => {
                                    setShowNewAddress(true);
                                    setValue("selectedAddressIndex", null);
                                }}
                                className="ms-2"
                            >
                                + Add New Address
                            </Button>
                        </>
                    )}

                    {(savedAddresses.length === 0 || showNewAddress) && (
                        <>
                            <h5 className="mt-4">Shipping Address</h5>
                            {["city", "district", "street", "buildingNumber"].map((field) => (
                                <Form.Group className="mb-3" key={field}>
                                    <Form.Label>
                                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </Form.Label>
                                    <Form.Control
                                        {...register(field as keyof Address)}
                                        isInvalid={!!errors[field as keyof Address]}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors[field as keyof Address]?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            ))}

                            <Form.Group className="mb-3">
                                <Form.Label>Additional Notes</Form.Label>
                                <Form.Control {...register("notes")} as="textarea" rows={2} />
                            </Form.Group>

                            <Form.Check
                                type="checkbox"
                                id="saveAddress"
                                label="Save this address"
                                {...register("saveAddress")}
                                className="mb-3"
                            />

                            <div className="d-flex">
                                <Button type="submit" variant="success" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <span className="ms-2">Proceeding...</span>
                                        </>
                                    ) : (
                                        "Submit Checkout"
                                    )}
                                </Button>

                                {savedAddresses.length > 0 && showNewAddress && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setShowNewAddress(false);
                                            setValue("selectedAddressIndex", null);
                                        }}
                                        className="ms-2"
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </Form>
            </Col>
        </Row>
    );
};

export default Checkout;