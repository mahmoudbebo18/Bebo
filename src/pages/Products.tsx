import { Container } from "react-bootstrap";
import Product from "../components/ecommerce/Product/Product";
import Loading from "../components/feedback/Loading/Loading";
import GridList from "../components/common/GridList/GridList";
import { useProduct } from "../hooks/useProduct";
const Products = () => {
    const { productData, loading, error, productPrefix } = useProduct();
    return (
        <Container>
            <h3 className="mb-4 text-uppercase"> {productPrefix} Products </h3>
            <Loading status={loading} error={error} type="product" >
                <GridList emptyMessage ="There is nothing to show here" records={productData}
                    renderItem={(record) => <Product {...record} />} />
            </Loading>
        </Container>
    );
};

export default Products;