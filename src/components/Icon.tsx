import type { Props } from "./interfaces";

function Icon({ children, className }: Props) {
  return <i className={className}>
    {children}
  </i>;
}

export default Icon;