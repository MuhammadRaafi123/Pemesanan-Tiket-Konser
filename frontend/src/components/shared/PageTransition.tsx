"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Soft cross-page entrance. The keyed wrapper remounts on every navigation so
 * the animation replays, giving the app an app-like feel without a router lib.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}

export default PageTransition;
