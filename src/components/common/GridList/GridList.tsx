import React from "react";
import { Row, Col } from "react-bootstrap";
import LottieHandler from "../../feedback/LottieHandler/LottieHandler";

type GridListProps<T> = {
    records: T[];
    renderItem: (record: T) => React.ReactNode;
    emptyMessage: string;
};

const GridList = <T extends { id?: number }>({
    records,
    renderItem,
    emptyMessage
}: GridListProps<T>) => {
    const renderList =
        records.length > 0
            ? records.map((record) => (
                <Col
                    xs={3}
                    key={record.id}
                    className="d-flex justify-content-center mb-5 mt-2"
                >
                    {renderItem(record)}
                </Col>
            ))
            : <Col> <LottieHandler type="empty" message={emptyMessage} /> </Col>
    return <Row>{renderList}</Row>;
};

export default GridList;