import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    className?: string;
    innerClass?: string;
    fill?: string;
    style?: React.CSSProperties;
}

export default Props