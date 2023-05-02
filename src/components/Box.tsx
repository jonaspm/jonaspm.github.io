import type Props from "./types/Props";

function Box({ children, className, style }: Props): JSX.Element {
  return (
    <div
      style={style}
      className={`backdrop-blur-sm p-2 bg-secondary/30 rounded-xl drop-shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default Box;
