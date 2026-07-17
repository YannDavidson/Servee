import type { HTMLAttributes } from "react";

export function ServeeWordmark(props: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} aria-label="Servee">
      Serv<span style={{ color: "#ff6f61" }}>ee</span>
    </span>
  );
}
