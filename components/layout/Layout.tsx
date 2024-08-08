'use client';

import { motion } from 'framer-motion';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 0.5 } }}
    exit={{ opacity: 0, transition: { duration: 0.5 } }}
  >
    {children}
  </motion.div>
);

export default Layout;
