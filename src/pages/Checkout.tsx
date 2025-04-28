import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row, Col, Form } from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { checkoutSchema } from "../validations/checkoutSchema";
import { Address, CheckoutFormData } from "../validations/checkoutSchema";
import useCart from "../hooks/useCart";
import SavedAddressesList from "../components/ecommerce/Address/SavedAddressesList/SavedAddressesList";
import AddressForm from "../components/ecommerce/Address/AddressForm/AddressForm";
import { handlePaymobCheckout } from "../util/payMobe";
const Checkout = () => {
    const { products } = useCart();
    const { user } = useAppSelector((state) => state.auth);
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const methods = useForm<CheckoutFormData>({
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
        },
    });

    const { setValue, watch, reset, handleSubmit } = methods;
    const selectedAddressIndex = watch("selectedAddressIndex");

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

    const handleSelectAddress = (index: number) => {
        setValue("selectedAddressIndex", index);
    };

    const handleAddNewAddress = () => {
        setShowNewAddress(true);
        reset({
            phone_number: "",
            city: "",
            district: "",
            street: "",
            buildingNumber: "",
            notes: "",
            saveAddress: false,
            selectedAddressIndex: null,
        });
    };

    const handleCancelNewAddress = () => {
        setShowNewAddress(false);
        setValue("selectedAddressIndex", null);
    };

    const handleCheckout = async (data: CheckoutFormData) => {
        if (!user) return;
        setIsLoading(true);
        try {
            let selectedAddress: Address;

            if (data.selectedAddressIndex !== undefined && data.selectedAddressIndex !== null) {
                selectedAddress = savedAddresses[data.selectedAddressIndex];
            } else {
                selectedAddress = {
                    city: data.city!,
                    district: data.district!,
                    street: data.street!,
                    buildingNumber: data.buildingNumber!,
                    notes: data.notes || "",
                };

                if (data.saveAddress) {
                    await updateDoc(doc(db, "users", user.id), {
                        addresses: arrayUnion(selectedAddress),
                    });
                    setSavedAddresses((prev) => [...prev, selectedAddress]);
                }
            }
            await handlePaymobCheckout(
                selectedAddress,
                data.phone_number,
                products,
                user,
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Row className="mt-4">
            <Col md={{ span: 8, offset: 2 }}>
                <div className="d-flex align-items-center justify-content-between">
                    <h2>Checkout</h2>
                    <span>{products.reduce((acc, p) => acc + p.price * p.quantity, 0)} EGP</span>
                </div>

                <FormProvider {...methods}>
                    <Form onSubmit={handleSubmit(handleCheckout)}>
                        {/* User Info */}
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control value={`${user?.firstName} ${user?.lastName}`} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control value={user?.email || ""} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control {...methods.register("phone_number")} />
                        </Form.Group>

                        {/* Addresses */}
                        {savedAddresses.length > 0 && !showNewAddress ? (
                            <SavedAddressesList
                                savedAddresses={savedAddresses}
                                selectedAddressIndex={selectedAddressIndex ?? null}
                                onSelectAddress={handleSelectAddress}
                                onAddNewAddress={handleAddNewAddress}
                                onSubmit={methods.handleSubmit(handleCheckout)}
                                isLoading={isLoading}
                            />
                        ) : (
                            <AddressForm
                                isLoading={isLoading}
                                savedAddressesLength={savedAddresses.length}
                                onCancel={handleCancelNewAddress}
                            />
                        )}
                    </Form>
                </FormProvider>
            </Col>
        </Row>
    );
};

export default Checkout;
