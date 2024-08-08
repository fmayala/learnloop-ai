'use client'

import * as React from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { IconGoogle, IconSpinner } from '@/components/ui/icons'
import { AnimationProps, motion } from 'framer-motion'

interface GetStartedButtonProps extends ButtonProps {
  showGithubIcon?: boolean
  text?: string
}

const variants: AnimationProps['variants'] = {
  rest: {
    backgroundSize: '200% 200%'
  },
  hover: {
    backgroundSize: '200% 200%',
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop' // Make sure to use one of "loop", "reverse", or "mirror"
    }
  }
}

export function GetStartedButton({
  text = 'Get Started with Google',
  showGithubIcon = true,
  className,
  ...props
}: GetStartedButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  return (
    <motion.div
      className={`inline-flex w-full cursor-pointer rounded-sm text-center justify-center ${className}`}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={variants}
      style={{
        background: 'linear-gradient(20deg, #0432AA, #AB00FF)'
      }}
      onClick={() => {
        setIsLoading(true)
        // next-auth signIn() function doesn't work yet at Edge Runtime due to usage of BroadcastChannel
        signIn('google', { callbackUrl: `/` })
      }}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin self-center" />
      ) : showGithubIcon ? (
        <IconGoogle className="mr-2 self-center" />
      ) : null}
      {text}
    </motion.div>
  )
}
