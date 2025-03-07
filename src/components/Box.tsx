import type Props from "./types/Props";

function Box({ children, className, style }: Props): JSX.Element {
  return (
    <div
      style={style}
      className={`backdrop-blur-xs p-2 bg-secondary/30 rounded-xl drop-shadow-xs ${className}`}
    >
      {children}
    </div>
  );
}

export default Box;
