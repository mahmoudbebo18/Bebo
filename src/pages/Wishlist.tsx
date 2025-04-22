
import Product from "../components/ecommerce/Product/Product";
import Loading from "../components/feedback/Loading/Loading";
import GridList from "../components/common/GridList/GridList";
import { useWishlist } from "../hooks/useWishlist";

const Wishlist = () => {
    const { loading, error, productData } = useWishlist()
    return (
        <>
            <h1> Wishlist </h1>
            <Loading status={loading} error={error} type="product">
                <GridList emptyMessage="Your wishlist is empty" records={productData}
                    renderItem={(record) => <Product {...record} />} />
            </Loading>
        </>
    )
}


export default Wishlist