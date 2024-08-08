"use client";

import { AnimatePresence } from "framer-motion";
import Layout from "./Layout";

export function OtherLayout({ children }: { children: React.ReactNode}) {
  return (
    <AnimatePresence
      mode="wait"
      initial={true}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Layout>{children}</Layout>
    </AnimatePresence>
  )
}
