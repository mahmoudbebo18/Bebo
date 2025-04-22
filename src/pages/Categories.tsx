import { Container } from "react-bootstrap";
import Category from "../components/ecommerce/Category/Category";

import Loading from "../components/feedback/Loading/Loading";
import GridList from "../components/common/GridList/GridList";
import { useCategory } from "../hooks/useCategory";

const Categories = () => {
    const { loading, error, records } = useCategory();
    return (
        <Container>
            <Loading status={loading} error={error} type="category">
                <GridList emptyMessage="There are no categories to show" records={records}
                    renderItem={(record) => <Category {...record} />} />
            </Loading>
        </Container>
    );
};

export default Categories;
