import { memo, useState } from "react";
import { Button, Spinner, Modal } from "react-bootstrap";
import { productIds } from "../../../store/cart/cartSlice";
import { useAppDispatch } from "../../../store/hooks";
import Like from "../../../assets/svg/like.svg?react";
import LikeFilled from "../../../assets/svg/like-fill.svg?react";
import { TProduct } from "../../../types/product";
import styles from "./style.module.css";
import { likeToggle } from "../../../store/wishlist/wishlistSlice";

const { product, productImg, max_limit, wishlist__btn } = styles;

const Product = memo(({ id, title, img, price, max, quantity, isLiked, isAuthorized }: TProduct) => {
    const dispatch = useAppDispatch();

    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const remainingQuantity = max - (quantity ?? 0);
    const isLimitReached = remainingQuantity <= 0;


    const addToCartHandler = () => {
        if (!isAuthorized) {
            setShowModal(true);
            return;
        }
        setIsBtnDisabled(true);
        dispatch(productIds(id))
            .unwrap()
            .catch(() => {
            })
            .finally(() => {
                setIsBtnDisabled(false);
            });
    };

    const likeToggleHandler = () => {
        if (!isAuthorized) {
            setShowModal(true);
            return;
        }

        if (!isLoading) {
            setIsLoading(true);
            dispatch(likeToggle(id))
                .unwrap()
                .then(() => setIsLoading(false))
                .catch(() => setIsLoading(false));
        }
    };

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Login Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You need to login first to add this item to your cart or wishlist.
                </Modal.Body>
            </Modal>

            <div className={product}>
                <div className={wishlist__btn} onClick={likeToggleHandler}>
                    {isLoading ? (
                        <Spinner variant="primary" animation="border" size="sm" />
                    ) : isLiked ? (
                        <LikeFilled />
                    ) : (
                        <Like />
                    )}
                </div>
                <div className={productImg}>
                    <img src={img} alt={title} />
                </div>
                <h2>{title}</h2>
                <h3>{price}</h3>
                <p className={max_limit}>
                    {isLimitReached
                        ? "You Reached the limit"
                        : `You can add ${remainingQuantity} item(s)`}
                </p>
                <Button
                    variant="info"
                    style={{ color: "white" }}
                    onClick={addToCartHandler}
                    disabled={isBtnDisabled || isLimitReached}
                >
                    {isBtnDisabled ? (
                        <>
                            <Spinner animation="border" size="sm" />
                            <span className="ms-2">Adding...</span>
                        </>
                    ) : (
                        "Add to Cart"
                    )}
                </Button>
            </div>
        </>
    );
});

export default Product;