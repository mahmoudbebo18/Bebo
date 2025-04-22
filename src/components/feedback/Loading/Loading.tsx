import { TLoading } from "../../../types/shared";
import CategorySkeleton from "../skeletons/CategorySkeleton/CategorySkeleton";
import ProductSkeleton from "../skeletons/ProductSkeleton/ProductSkeleton";
import CartSkeleton from "../skeletons/CartSkeleton/CartSkeleton";
import LottieHandler from "../LottieHandler/LottieHandler";
const skeletonsTypes = {
    category: CategorySkeleton,
    product: ProductSkeleton,
    cart: CartSkeleton,
};

type LoadingProps = {
    status: TLoading;
    error: null | string;
    children: React.ReactNode;
    type?: keyof typeof skeletonsTypes;
};

const Loading = ({
    status,
    error,
    children,
    type = "category",
}: LoadingProps) => {
    const Component = skeletonsTypes[type];

    if (status === "pending") {
        return <Component />;
    }
    if (status === "failed") {
        return <LottieHandler type="error" message={error as string} />;
    }
    return <div>{children}</div>;
};

export default Loading;