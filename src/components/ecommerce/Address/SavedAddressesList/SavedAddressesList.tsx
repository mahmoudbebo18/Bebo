import { Card, Button, Form, Spinner } from "react-bootstrap";
import { Address } from "../../../../validations/checkoutSchema";

interface SavedAddressesListProps {
    savedAddresses: Address[];
    selectedAddressIndex: number | null;
    onSelectAddress: (index: number) => void;
    onAddNewAddress: () => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const SavedAddressesList = ({
    savedAddresses,
    selectedAddressIndex,
    onSelectAddress,
    onAddNewAddress,
    onSubmit,
    isLoading
}: SavedAddressesListProps) => {
    return (
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
                            onChange={() => onSelectAddress(index)}
                            label={`${addr.city}, ${addr.district}, ${addr.street}, Building ${addr.buildingNumber}`}
                        />
                        {addr.notes && <p className="mb-0"><em>{addr.notes}</em></p>}
                    </Card.Body>
                </Card>
            ))}

            <Button
                type="button"
                variant="success"
                className="mt-2"
                disabled={selectedAddressIndex === null}
                onClick={onSubmit}
            >
                {isLoading ? (
                    <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Proceeding...</span>
                    </>
                ) : (
                    "Submit Checkout"
                )}
            </Button>

            <Button
                variant="link"
                onClick={onAddNewAddress}
                className="ms-2"
            >
                + Add New Address
            </Button>
        </>
    );
};

export default SavedAddressesList;
