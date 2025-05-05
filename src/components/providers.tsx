"use client"; // 👈 this is IMPORTANT!

import { Provider } from "react-redux";
import { store } from "@/lib/store"; // adjust path if needed

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
