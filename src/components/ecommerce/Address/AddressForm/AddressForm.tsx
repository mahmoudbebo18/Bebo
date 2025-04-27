import { Form, Button, Spinner } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { addressFields } from "../../../../util/fields";

interface AddressFormProps {
    isLoading: boolean;
    savedAddressesLength: number;
    onCancel: () => void;
}

const AddressForm = ({ isLoading, savedAddressesLength, onCancel }: AddressFormProps) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <>
            <h5 className="mt-4">Shipping Address</h5>

            {addressFields.map((field) => (
                <Form.Group className="mb-3" key={field.name}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                        {...register(field.name as any)}
                        isInvalid={!!errors[field.name as any]}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors[field.name as any]?.message?.toString()}
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
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span className="ms-2">Proceeding...</span>
                        </>
                    ) : (
                        "Submit Checkout"
                    )}
                </Button>

                {savedAddressesLength > 0 && (
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        className="ms-2"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </>
    );
};

export default AddressForm;
