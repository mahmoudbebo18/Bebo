import { TProduct } from '../../../types/product'
import classes from './styles.module.css'

const { container } = classes


type TSubtototalProps = { products: TProduct[] }
const CartSubtotal = ({ products }: TSubtototalProps) => {
    const totalPrice = products.reduce((acc, el) => {
        const price = el.price;
        const quantity = el.quantity
        if (quantity && typeof quantity === "number") {
            return acc + price * quantity
        } else {
            return acc;
        }
    }, 0)
    return (
        <div className={container}>
            <span> Subtotal:  </span>
            <span> {totalPrice} </span>
        </div>
    )
}

export default CartSubtotal
