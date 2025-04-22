import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.css";

type HeaderCounterProps = {
    totalQuantity: number;
    svgIcon: React.ReactNode;
    title: string;
    to: string;
};

const { container, totalNum, pumpAnimate, iconWrapper, iconDev  } = styles;

const HeaderCounter = ({
    totalQuantity,
    svgIcon,
    to,
}: HeaderCounterProps) => {
    const navigate = useNavigate();
    const [isAnimate, setIsAnimate] = useState(false);
    const quantityStyle = `${totalNum} ${isAnimate ? pumpAnimate : ""}`;

    useEffect(() => {
        if (!totalQuantity) {
            return;
        }
        setIsAnimate(true);

        const debounce = setTimeout(() => {
            setIsAnimate(false);
        }, 300);

        return () => clearTimeout(debounce);
    }, [totalQuantity]);

    return (
        <div className={container} onClick={() => navigate(to)}>
            <div className={iconWrapper}>
                <div className={iconDev}>{svgIcon}</div>
                {totalQuantity > 0 && (
                    <div className={quantityStyle}>{totalQuantity}</div>
                )}
            </div>
        </div>
    );
};

export default HeaderCounter;