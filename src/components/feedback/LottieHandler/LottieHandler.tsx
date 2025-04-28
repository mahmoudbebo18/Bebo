import Lottie from "lottie-react";
import notFound from "../../../assets/lottieFiles/notFound.json";
import empty from "../../../assets/lottieFiles/empty.json";
import loading from "../../../assets/lottieFiles/loading.json";
import error from "../../../assets/lottieFiles/error.json";
import success from "../../../assets/lottieFiles/payment_success.json";
import pending from "../../../assets/lottieFiles/payment_pending.json";
import failed from "../../../assets/lottieFiles/payment_failed.json";

const lottieFilesMap = {
    notFound,
    empty,
    loading,
    error,
    success,
    pending,
    failed,
};

type LottieHandlerProps = {
    type: keyof typeof lottieFilesMap;
    message?: string;
    className?: string;
    loop?: boolean;
};

const LottieHandler = ({ type, message, className, loop }: LottieHandlerProps) => {
    const lottie = lottieFilesMap[type];
    const messageStyle =
        type === "error"
            ? { fontSize: "19px", color: "red" }
            : { fontSize: "19px", marginTop: "30px" };
    const imgStyle =
        type === "error"
            ? { width: "300" }
            : { width: "400px" };
    return (
        <div className={`d-flex flex-column align-items-center ${className}`}>
            <Lottie loop={loop} animationData={lottie} style={imgStyle} />
            {message && <h3 style={messageStyle}>{message}</h3>}
        </div>
    );
};

export default LottieHandler;