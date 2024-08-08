"use client";

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import { IconCube, IconPlus } from './ui/icons'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'
import { FunctionComponent } from 'react';

const iconMap: Record<string, FunctionComponent<any>> = {
    'plus': IconPlus,
    'cube': IconCube,
    'squares2x2': HiOutlineSquares2X2
}

export function SidebarMainAction({
  text,
  href,
  icon,
  className = ''
}: {
  text: string
  href: string
  icon: string
  className?: string
}) {
  // Turn icon parameter into a component
  const Icon = iconMap[icon] as any

  return (
    <motion.div className={cn(className, 'px-2 mt-4')}>
      <Link
        href={href}
        prefetch={true}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-10 w-full justify-start bg-zinc-300/10 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
        )}
      >
        <Icon className="-translate-x-2 stroke-2" />
        {text}
      </Link>
    </motion.div>
  )
}
