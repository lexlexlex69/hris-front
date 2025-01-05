import { useRef, useState } from "react";

export const useHover = () => {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef < HTMLDivElement > (null);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return {
        isHovered,
        ref,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
    };
};

