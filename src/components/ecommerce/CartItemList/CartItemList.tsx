
import { TProduct } from "../../../types/product"
import CartItem from "../CartItem/CartItem"

type cartItemListProps = {
    products: TProduct[];
    changeQuantityHandler: (id: number, quantity: number) => void;
    removeProductHandler: (id: number) => void;
}
const CartItemList = ({ products, changeQuantityHandler, removeProductHandler }: cartItemListProps) => {
    const renderList = products.map(el =>
        <CartItem
            key={el.id}
            {...el}
            changeQuantityHandler={changeQuantityHandler}
            removeProductHandler = {removeProductHandler}
        />)
    return (
        <div> {renderList} </div>
    )
}

export default CartItemList
