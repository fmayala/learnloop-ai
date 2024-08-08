'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MdQuiz } from 'react-icons/md'
import { IconType } from 'react-icons/lib'

interface ToolButtonProps {
  title: string
  description: string
  href: string
  iconName: keyof typeof presetIcons // Use the keys of the presetIcons object as the type for iconName
  className?: string
}

// Define an object with icon components, making sure they are IconType
const presetIcons: { [key: string]: IconType } = {
  MdQuiz: MdQuiz
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  title,
  description,
  href,
  iconName,
  className = ''
}) => {
  const iconVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.25 } } // Simplify the hover animation for a subtler effect
  }

  // Safely access the icon component
  const IconComponent = presetIcons[iconName]

  return (
    <Link href={href} passHref>
      <motion.a
        className={`inline-flex my-2 items-center w-full cursor-pointer border rounded-lg p-3 hover:bg-muted dark:hover:bg-secondary transition-colors duration-200 ease-in-out${className}`}
        whileHover="hover"
        initial="rest"
        variants={iconVariants}
      >
        {IconComponent && <IconComponent className="text-gray-800 dark:text-white" size={24} />} {/* Adjust icon size and color for consistency */}
        <div className="flex flex-col ml-4 justify-center"> {/* Adjust margin for better spacing */}
          <span className="text-md font-semibold text-gray-900 dark:text-white">{title}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">{description}</span>
        </div>
      </motion.a>
    </Link>
  )
}
