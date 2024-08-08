'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@/lib/utils'

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  text?: string; // Optional text to display in the middle of the separator
}

const Separator: React.FC<SeparatorProps> = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    { className, orientation = 'horizontal', decorative = true, text, ...props },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex items-center",
          orientation === 'horizontal' ? "flex-row" : "flex-col",
          className
        )}
      >
        {/* Left/Top separator */}
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(
            'shrink-0 bg-border',
            orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
            text ? "flex-1" : ""
          )}
          {...props}
        />
        {text && (
          <span
            className={cn(
              "px-2 text-sm text-muted dark:text-gray-500 select-none",
              orientation === 'horizontal' ? "whitespace-nowrap" : ""
            )}
            style={{
              background: 'inherit', // To cover the separator line if it's under the text
            }}
          >
            {text}
          </span>
        )}
        {/* Right/Bottom separator */}
        {text && (
          <SeparatorPrimitive.Root
            decorative={decorative}
            orientation={orientation}
            className={cn(
              'shrink-0 bg-border',
              orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
              "flex-1" // Make the second line fill the remaining space
            )}
          />
        )}
      </div>
    );
  }
);

Separator.displayName = 'SeparatorWithText';

export { Separator };
