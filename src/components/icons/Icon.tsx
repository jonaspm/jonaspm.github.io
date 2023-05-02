import type Props from "../types/Props";

function Icon({ children, className }: Props) {
  return <i className={className}>{children}</i>;
}

export default Icon;
