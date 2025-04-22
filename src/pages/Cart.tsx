import useCart from "../hooks/useCart";
import { Button, Spinner } from "react-bootstrap";
import CartSubtotal from "../components/ecommerce/CartSubtotal/CartSubtotal"
import Loading from "../components/feedback/Loading/Loading";
import CartItemList from "../components/ecommerce/CartItemList/CartItemList";
import LottieHandler from "../components/feedback/LottieHandler/LottieHandler";

const Cart = () => {
    const { loading, error, products, changeQuantityHandler, removeProductHandler, handleProceedToCheckout, isLoading } = useCart();
    return (
        <Loading status={loading} error={error} type="cart">
            {products.length ?
                <>
                    <CartItemList
                        products={products}
                        changeQuantityHandler={changeQuantityHandler}
                        removeProductHandler={removeProductHandler}
                    />
                    <CartSubtotal products={products} />
                    <Button
                        variant="primary"
                        onClick={handleProceedToCheckout}
                        disabled={products.length === 0 || isLoading} // Disable if loading
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
                            "Proceed to Checkout"
                        )}
                    </Button>

                </> :
                <LottieHandler type="empty" message="Your Cart Is Empty" />

            }
        </Loading>

    )
}

export default Cart