import type { Props } from "./interfaces";

function Box({ children, className } : Props): JSX.Element {
    return (
        <div className={`backdrop-blur-sm p-2 bg-white/30 rounded-xl drop-shadow-sm ${className}`}>
            {children}
        </div>
    )
}

export default Box;