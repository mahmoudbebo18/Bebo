import { Form, Button, Spinner } from "react-bootstrap";
import styles from "./styles.module.css";
import { TProduct } from "../../../types/product";
import { memo, useState } from "react"; // Import useState

const { cartItem, product, productImg, productInfo, cartItemSelection } = styles;

type TCartItemProps = TProduct & {
    changeQuantityHandler: (id: number, quantity: number) => void;
    removeProductHandler: (id: number) => void; // No need to change the type
};

const CartItem = memo(
    ({
        id,
        title,
        img,
        price,
        max,
        quantity,
        changeQuantityHandler,
        removeProductHandler,
    }: TCartItemProps) => {
        const [isRemoving, setIsRemoving] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const selectOption = Array(max)
            .fill(0)
            .map((_, index) => {
                return (
                    <option key={index + 1} value={index + 1}>
                        {index + 1}
                    </option>
                );
            });

        const changeQuantity = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const newQuantity = parseInt(event.target.value);
            changeQuantityHandler(id, newQuantity);
        };

        const handleRemove = async () => {
            setIsRemoving(true); // Start removal
            setError(null); // Clear any previous errors

            try {
                await removeProductHandler(id); // Call the removal handler
            } catch (err) {
                setError("Failed to remove item. Please try again."); // Handle errors
            } finally {
                setIsRemoving(false); // Reset removal state
            }
        };

        return (
            <div className={cartItem}>
                <div className={product}>
                    <div className={productImg}>
                        <img src={img} alt={title} />
                    </div>
                    <div className={productInfo}>
                        <h2>{title}</h2>
                        <h3>{price.toFixed(2)} EGP</h3>
                        <Button
                            variant="danger"
                            style={{ color: "white", minWidth: "100px" }}
                            className="mt-auto"
                            onClick={handleRemove}
                            disabled={isRemoving}
                        >
                            {isRemoving ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <span className="ms-1"> Removing... </span>
                                </>
                            ) : (
                                "Remove"
                            )}
                        </Button>
                        {error && <p className="text-danger mt-2">{error}</p>}
                    </div>
                </div>

                <div className={cartItemSelection}>
                    <span className="d-block mb-1">Quantity</span>
                    <Form.Select
                        value={quantity}
                        onChange={changeQuantity}
                        aria-label="Default select example"
                    >
                        {selectOption}
                    </Form.Select>
                </div>
            </div>
        );
    }
);

export default CartItem;