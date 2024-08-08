'use client';

import { motion } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import Link from 'next/link';

export const LinkButton = ({ href, className, children, ...props }: {href: string, className: string, children: string}) => {
  const variants: AnimationProps['variants'] = {
    rest: {
      backgroundSize: '200% 200%',
    },
    hover: {
      backgroundSize: '200% 200%',
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop', // Make sure to use one of "loop", "reverse", or "mirror"
      },
    },
  };

  return (
    <motion.div
      className={`inline-flex w-full cursor-pointer rounded-sm ${className}`}
      variants={variants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{
        background: 'linear-gradient(20deg, #0432AA, #AB00FF)',
      }}
      {...props}
    >
      <Link href={href} className='py-3 w-full text-center'>
        {children}
      </Link>
    </motion.div>
  );
};
