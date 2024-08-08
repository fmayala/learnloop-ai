'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function IconNextChat({
  className,
  inverted,
  ...props
}: React.ComponentProps<'svg'> & { inverted?: boolean }) {
  const id = React.useId()

  return (
    <svg
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <defs>
        <linearGradient
          id={`gradient-${id}-1`}
          x1="10.6889"
          y1="10.3556"
          x2="13.8445"
          y2="14.2667"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={inverted ? 'white' : 'black'} />
          <stop
            offset={1}
            stopColor={inverted ? 'white' : 'black'}
            stopOpacity={0}
          />
        </linearGradient>
        <linearGradient
          id={`gradient-${id}-2`}
          x1="11.7555"
          y1="4.8"
          x2="11.7376"
          y2="9.50002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={inverted ? 'white' : 'black'} />
          <stop
            offset={1}
            stopColor={inverted ? 'white' : 'black'}
            stopOpacity={0}
          />
        </linearGradient>
      </defs>
      <path
        d="M1 16L2.58314 11.2506C1.83084 9.74642 1.63835 8.02363 2.04013 6.39052C2.4419 4.75741 3.41171 3.32057 4.776 2.33712C6.1403 1.35367 7.81003 0.887808 9.4864 1.02289C11.1628 1.15798 12.7364 1.8852 13.9256 3.07442C15.1148 4.26363 15.842 5.83723 15.9771 7.5136C16.1122 9.18997 15.6463 10.8597 14.6629 12.224C13.6794 13.5883 12.2426 14.5581 10.6095 14.9599C8.97637 15.3616 7.25358 15.1692 5.74942 14.4169L1 16Z"
        fill={inverted ? 'black' : 'white'}
        stroke={inverted ? 'black' : 'white'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <mask
        id="mask0_91_2047"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x={1}
        y={0}
        width={16}
        height={16}
      >
        <circle cx={9} cy={8} r={8} fill={inverted ? 'black' : 'white'} />
      </mask>
      <g mask="url(#mask0_91_2047)">
        <circle cx={9} cy={8} r={8} fill={inverted ? 'black' : 'white'} />
        <path
          d="M14.2896 14.0018L7.146 4.8H5.80005V11.1973H6.87681V6.16743L13.4444 14.6529C13.7407 14.4545 14.0231 14.2369 14.2896 14.0018Z"
          fill={`url(#gradient-${id}-1)`}
        />
        <rect
          x="11.2222"
          y="4.8"
          width="1.06667"
          height="6.4"
          fill={`url(#gradient-${id}-2)`}
        />
      </g>
    </svg>
  )
}

function IconOpenAI({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <title>OpenAI icon</title>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  )
}

function IconVercel({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-label="Vercel logomark"
      role="img"
      viewBox="0 0 74 64"
      className={cn('size-4', className)}
      {...props}
    >
      <path
        d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

function IconGitHub({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function IconGoogle({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      className={cn('size-4', className)}
      {...props}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
      <path d="M1 1h22v22H1z" fill="none" />
    </svg>
  )
}

function IconSeparator({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M16.88 3.549L7.12 20.451"></path>
    </svg>
  )
}

function IconArrowDown({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="m205.66 149.66-72 72a8 8 0 0 1-11.32 0l-72-72a8 8 0 0 1 11.32-11.32L120 196.69V40a8 8 0 0 1 16 0v156.69l58.34-58.35a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

function IconArrowRight({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="m221.66 133.66-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32Z" />
    </svg>
  )
}

function IconUser({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z" />
    </svg>
  )
}

function IconPlus({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8Z" />
    </svg>
  )
}

function IconCube({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="1251"
      height="1257"
      viewBox="0 0 1251 1257"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <rect
        x="2"
        y="2"
        width="570"
        height="584"
        rx="38"
        stroke="black"
        stroke-width="4"
      />
      <rect
        x="679"
        y="2"
        width="570"
        height="584"
        rx="38"
        stroke="black"
        stroke-width="4"
      />
      <rect
        x="679"
        y="671"
        width="570"
        height="584"
        rx="38"
        stroke="black"
        stroke-width="4"
      />
      <rect
        x="2"
        y="671"
        width="570"
        height="584"
        rx="38"
        stroke="black"
        stroke-width="4"
      />
    </svg>
  )
}

function IconArrowElbow({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z" />
    </svg>
  )
}

function IconSpinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4 animate-spin', className)}
      {...props}
    >
      <path d="M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.59 40 93.27 40 128a88 88 0 0 0 176 0c0-34.73-20.15-66.41-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128Z" />
    </svg>
  )
}

function IconMessage({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M216 48H40a16 16 0 0 0-16 16v160a15.84 15.84 0 0 0 9.25 14.5A16.05 16.05 0 0 0 40 240a15.89 15.89 0 0 0 10.25-3.78.69.69 0 0 0 .13-.11L82.5 208H216a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16ZM40 224Zm176-32H82.5a16 16 0 0 0-10.3 3.75l-.12.11L40 224V64h176Z" />
    </svg>
  )
}

function IconTrash({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z" />
    </svg>
  )
}

function IconRefresh({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M197.67 186.37a8 8 0 0 1 0 11.29C196.58 198.73 170.82 224 128 224c-37.39 0-64.53-22.4-80-39.85V208a8 8 0 0 1-16 0v-48a8 8 0 0 1 8-8h48a8 8 0 0 1 0 16H55.44C67.76 183.35 93 208 128 208c36 0 58.14-21.46 58.36-21.68a8 8 0 0 1 11.31.05ZM216 40a8 8 0 0 0-8 8v23.85C192.53 54.4 165.39 32 128 32c-42.82 0-68.58 25.27-69.66 26.34a8 8 0 0 0 11.3 11.34C69.86 69.46 92 48 128 48c35 0 60.24 24.65 72.56 40H168a8 8 0 0 0 0 16h48a8 8 0 0 0 8-8V48a8 8 0 0 0-8-8Z" />
    </svg>
  )
}

function IconStop({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm24-120h-48a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8Zm-8 48h-32v-32h32Z" />
    </svg>
  )
}

function IconSidebar({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16ZM40 56h40v144H40Zm176 144H96V56h120v144Z" />
    </svg>
  )
}

function IconMoon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M233.54 142.23a8 8 0 0 0-8-2 88.08 88.08 0 0 1-109.8-109.8 8 8 0 0 0-10-10 104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88 104.84 104.84 0 0 0 37-52.91 8 8 0 0 0-1.98-7.98Zm-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104 106 106 0 0 0 14.92-1.06 89 89 0 0 1-26.02 31.4Z" />
    </svg>
  )
}

function IconSun({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M120 40V16a8 8 0 0 1 16 0v24a8 8 0 0 1-16 0Zm72 88a64 64 0 1 1-64-64 64.07 64.07 0 0 1 64 64Zm-16 0a48 48 0 1 0-48 48 48.05 48.05 0 0 0 48-48ZM58.34 69.66a8 8 0 0 0 11.32-11.32l-16-16a8 8 0 0 0-11.32 11.32Zm0 116.68-16 16a8 8 0 0 0 11.32 11.32l16-16a8 8 0 0 0-11.32-11.32ZM192 72a8 8 0 0 0 5.66-2.34l16-16a8 8 0 0 0-11.32-11.32l-16 16A8 8 0 0 0 192 72Zm5.66 114.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32-11.32ZM48 128a8 8 0 0 0-8-8H16a8 8 0 0 0 0 16h24a8 8 0 0 0 8-8Zm80 80a8 8 0 0 0-8 8v24a8 8 0 0 0 16 0v-24a8 8 0 0 0-8-8Zm112-88h-24a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16Z" />
    </svg>
  )
}

function IconCopy({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8Zm-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z" />
    </svg>
  )
}

function IconCheck({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

function IconDownload({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M224 152v56a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-56a8 8 0 0 1 16 0v56h160v-56a8 8 0 0 1 16 0Zm-101.66 5.66a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 132.69V40a8 8 0 0 0-16 0v92.69l-26.34-26.35a8 8 0 0 0-11.32 11.32Z" />
    </svg>
  )
}

function IconClose({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
    </svg>
  )
}

function IconEdit({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn('size-4', className)}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  )
}

function IconShare({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('size-4', className)}
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="m237.66 106.35-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z" />
    </svg>
  )
}

function IconUsers({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('size-4', className)}
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M117.25 157.92a60 60 0 1 0-66.5 0 95.83 95.83 0 0 0-47.22 37.71 8 8 0 1 0 13.4 8.74 80 80 0 0 1 134.14 0 8 8 0 0 0 13.4-8.74 95.83 95.83 0 0 0-47.22-37.71ZM40 108a44 44 0 1 1 44 44 44.05 44.05 0 0 1-44-44Zm210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16 44 44 0 1 0-16.34-84.87 8 8 0 1 1-5.94-14.85 60 60 0 0 1 55.53 105.64 95.83 95.83 0 0 1 47.22 37.71 8 8 0 0 1-2.33 11.07Z" />
    </svg>
  )
}

function IconExternalLink({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('size-4', className)}
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M224 104a8 8 0 0 1-16 0V59.32l-66.33 66.34a8 8 0 0 1-11.32-11.32L196.68 48H152a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8Zm-40 24a8 8 0 0 0-8 8v72H48V80h72a8 8 0 0 0 0-16H48a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-72a8 8 0 0 0-8-8Z" />
    </svg>
  )
}

function IconChevronUpDown({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('size-4', className)}
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M181.66 170.34a8 8 0 0 1 0 11.32l-48 48a8 8 0 0 1-11.32 0l-48-48a8 8 0 0 1 11.32-11.32L128 212.69l42.34-42.35a8 8 0 0 1 11.32 0Zm-96-84.68L128 43.31l42.34 42.35a8 8 0 0 0 11.32-11.32l-48-48a8 8 0 0 0-11.32 0l-48 48a8 8 0 0 0 11.32 11.32Z" />
    </svg>
  )
}

function IconLearnloop({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="262"
      height="50"
      viewBox="0 0 262 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <rect width="25" height="25" rx="2" fill="white" />
      <rect x="25" y="25" width="25" height="25" rx="2" fill="#1289CC" />
      <rect
        x="8.50049"
        y="21.7939"
        width="20"
        height="1.5"
        transform="rotate(-70 8.50049 21.7939)"
        fill="#1289CC"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.5 31.875L30.625 35.625L33.125 36.9875V40.7375L37.5 43.125L41.875 40.7375V36.9875L43.125 36.3063V40.625H44.375V35.625L37.5 31.875ZM41.7625 35.625L37.5 37.95L33.2375 35.625L37.5 33.3L41.7625 35.625ZM37.5 41.7L40.625 39.9938V37.6688L37.5 39.375L34.375 37.6688V39.9938L37.5 41.7Z"
        fill="white"
      />
      <path
        d="M92.24 37.64C92.56 37.64 92.84 37.76 93.08 38C93.32 38.2133 93.44 38.48 93.44 38.8C93.44 39.1467 93.32 39.44 93.08 39.68C92.84 39.8933 92.56 40 92.24 40H77.96C77.6133 40 77.32 39.88 77.08 39.64C76.8667 39.4 76.76 39.12 76.76 38.8V13.2C76.76 12.88 76.88 12.6 77.12 12.36C77.36 12.12 77.6667 12 78.04 12C78.36 12 78.64 12.12 78.88 12.36C79.1467 12.6 79.28 12.88 79.28 13.2V38.32L78.52 37.64H92.24ZM106.689 40.4C104.636 40.4 102.822 39.96 101.249 39.08C99.6757 38.2 98.4491 36.9733 97.5691 35.4C96.6891 33.8267 96.2491 31.9867 96.2491 29.88C96.2491 27.6133 96.6891 25.68 97.5691 24.08C98.4757 22.48 99.6357 21.2533 101.049 20.4C102.489 19.52 104.009 19.08 105.609 19.08C106.782 19.08 107.916 19.2933 109.009 19.72C110.129 20.12 111.116 20.7333 111.969 21.56C112.849 22.36 113.542 23.3467 114.049 24.52C114.582 25.6933 114.876 27.0533 114.929 28.6C114.902 28.92 114.769 29.2 114.529 29.44C114.289 29.6533 114.009 29.76 113.689 29.76H97.6491L97.1691 27.6H112.929L112.409 28.08V27.28C112.302 26.0267 111.902 24.96 111.209 24.08C110.516 23.2 109.676 22.5333 108.689 22.08C107.702 21.6267 106.676 21.4 105.609 21.4C104.809 21.4 103.982 21.56 103.129 21.88C102.302 22.2 101.542 22.7067 100.849 23.4C100.182 24.0667 99.6357 24.9333 99.2091 26C98.7824 27.04 98.5691 28.28 98.5691 29.72C98.5691 31.2933 98.8891 32.72 99.5291 34C100.169 35.28 101.089 36.2933 102.289 37.04C103.516 37.7867 104.969 38.16 106.649 38.16C107.582 38.16 108.422 38.0267 109.169 37.76C109.916 37.4933 110.569 37.1467 111.129 36.72C111.689 36.2667 112.156 35.8 112.529 35.32C112.822 35.08 113.116 34.96 113.409 34.96C113.676 34.96 113.902 35.0667 114.089 35.28C114.302 35.4933 114.409 35.7333 114.409 36C114.409 36.32 114.276 36.6 114.009 36.84C113.209 37.8 112.169 38.64 110.889 39.36C109.609 40.0533 108.209 40.4 106.689 40.4ZM136.983 19.56C137.329 19.56 137.609 19.68 137.823 19.92C138.063 20.16 138.182 20.4533 138.182 20.8V38.8C138.182 39.12 138.063 39.4 137.823 39.64C137.583 39.88 137.303 40 136.983 40C136.636 40 136.343 39.88 136.103 39.64C135.889 39.4 135.783 39.12 135.783 38.8V34.04L136.463 33.72C136.463 34.4667 136.249 35.2267 135.823 36C135.423 36.7733 134.863 37.4933 134.143 38.16C133.423 38.8267 132.569 39.3733 131.583 39.8C130.623 40.2 129.583 40.4 128.463 40.4C126.649 40.4 125.023 39.9333 123.583 39C122.169 38.0667 121.049 36.7867 120.223 35.16C119.423 33.5333 119.023 31.7067 119.023 29.68C119.023 27.6 119.436 25.7733 120.263 24.2C121.089 22.6 122.209 21.3467 123.623 20.44C125.036 19.5333 126.636 19.08 128.423 19.08C129.569 19.08 130.636 19.28 131.623 19.68C132.636 20.08 133.516 20.6267 134.263 21.32C135.009 22.0133 135.583 22.8133 135.983 23.72C136.409 24.6 136.623 25.52 136.623 26.48L135.783 25.88V20.8C135.783 20.4533 135.889 20.16 136.103 19.92C136.343 19.68 136.636 19.56 136.983 19.56ZM128.663 38.16C130.076 38.16 131.329 37.8 132.423 37.08C133.516 36.3333 134.369 35.32 134.983 34.04C135.623 32.7333 135.943 31.28 135.943 29.68C135.943 28.1067 135.623 26.6933 134.983 25.44C134.369 24.1867 133.516 23.1867 132.423 22.44C131.329 21.6933 130.076 21.32 128.663 21.32C127.276 21.32 126.023 21.68 124.903 22.4C123.809 23.12 122.943 24.1067 122.303 25.36C121.689 26.6133 121.383 28.0533 121.383 29.68C121.383 31.28 121.689 32.7333 122.303 34.04C122.943 35.32 123.809 36.3333 124.903 37.08C125.996 37.8 127.249 38.16 128.663 38.16ZM145.68 40C145.307 40 145.014 39.88 144.8 39.64C144.587 39.4 144.48 39.12 144.48 38.8V20.88C144.48 20.56 144.587 20.28 144.8 20.04C145.04 19.8 145.334 19.68 145.68 19.68C146.027 19.68 146.307 19.8 146.52 20.04C146.76 20.28 146.88 20.56 146.88 20.88V26.88L146.28 27C146.36 26.0667 146.587 25.1467 146.96 24.24C147.36 23.3067 147.894 22.4533 148.56 21.68C149.227 20.9067 150.014 20.28 150.92 19.8C151.854 19.32 152.894 19.08 154.04 19.08C154.52 19.08 154.987 19.1867 155.44 19.4C155.894 19.5867 156.12 19.9067 156.12 20.36C156.12 20.76 156.014 21.0667 155.8 21.28C155.587 21.4933 155.334 21.6 155.04 21.6C154.8 21.6 154.534 21.5333 154.24 21.4C153.974 21.2667 153.614 21.2 153.16 21.2C152.414 21.2 151.667 21.4267 150.92 21.88C150.174 22.3067 149.494 22.8933 148.88 23.64C148.267 24.3867 147.774 25.2267 147.4 26.16C147.054 27.0667 146.88 27.9867 146.88 28.92V38.8C146.88 39.12 146.76 39.4 146.52 39.64C146.28 39.88 146 40 145.68 40ZM169.511 19.08C171.271 19.08 172.671 19.44 173.711 20.16C174.778 20.8533 175.538 21.8133 175.991 23.04C176.471 24.24 176.711 25.5733 176.711 27.04V38.8C176.711 39.12 176.591 39.4 176.351 39.64C176.111 39.88 175.831 40 175.511 40C175.138 40 174.844 39.88 174.631 39.64C174.418 39.4 174.311 39.12 174.311 38.8V27.16C174.311 26.0933 174.138 25.12 173.791 24.24C173.444 23.36 172.871 22.6533 172.071 22.12C171.298 21.5867 170.271 21.32 168.991 21.32C167.844 21.32 166.751 21.5867 165.711 22.12C164.698 22.6533 163.871 23.36 163.231 24.24C162.591 25.12 162.271 26.0933 162.271 27.16V38.8C162.271 39.12 162.151 39.4 161.911 39.64C161.671 39.88 161.391 40 161.071 40C160.698 40 160.404 39.88 160.191 39.64C159.978 39.4 159.871 39.12 159.871 38.8V20.88C159.871 20.56 159.978 20.28 160.191 20.04C160.431 19.8 160.724 19.68 161.071 19.68C161.418 19.68 161.698 19.8 161.911 20.04C162.151 20.28 162.271 20.56 162.271 20.88V24.24L161.351 25.68C161.404 24.8267 161.671 24.0133 162.151 23.24C162.658 22.44 163.298 21.7333 164.071 21.12C164.844 20.48 165.698 19.9867 166.631 19.64C167.591 19.2667 168.551 19.08 169.511 19.08Z"
        fill="white"
      />
      <path
        d="M185.636 38.8C185.636 39.12 185.516 39.4 185.276 39.64C185.036 39.88 184.756 40 184.436 40C184.089 40 183.796 39.88 183.556 39.64C183.343 39.4 183.236 39.12 183.236 38.8V11.6C183.236 11.28 183.356 11 183.596 10.76C183.836 10.52 184.116 10.4 184.436 10.4C184.783 10.4 185.063 10.52 185.276 10.76C185.516 11 185.636 11.28 185.636 11.6V38.8ZM210.864 29.76C210.864 31.7867 210.424 33.6133 209.544 35.24C208.664 36.84 207.464 38.1067 205.944 39.04C204.424 39.9467 202.691 40.4 200.744 40.4C198.851 40.4 197.131 39.9467 195.584 39.04C194.064 38.1067 192.851 36.84 191.944 35.24C191.064 33.6133 190.624 31.7867 190.624 29.76C190.624 27.7067 191.064 25.88 191.944 24.28C192.851 22.68 194.064 21.4133 195.584 20.48C197.131 19.5467 198.851 19.08 200.744 19.08C202.691 19.08 204.424 19.5467 205.944 20.48C207.464 21.4133 208.664 22.68 209.544 24.28C210.424 25.88 210.864 27.7067 210.864 29.76ZM208.464 29.76C208.464 28.1333 208.131 26.6933 207.464 25.44C206.797 24.16 205.877 23.16 204.704 22.44C203.557 21.6933 202.237 21.32 200.744 21.32C199.304 21.32 197.997 21.6933 196.824 22.44C195.651 23.16 194.717 24.16 194.024 25.44C193.357 26.6933 193.024 28.1333 193.024 29.76C193.024 31.3867 193.357 32.8267 194.024 34.08C194.717 35.3333 195.651 36.3333 196.824 37.08C197.997 37.8 199.304 38.16 200.744 38.16C202.237 38.16 203.557 37.8 204.704 37.08C205.877 36.3333 206.797 35.3333 207.464 34.08C208.131 32.8267 208.464 31.3867 208.464 29.76ZM235.005 29.76C235.005 31.7867 234.565 33.6133 233.685 35.24C232.805 36.84 231.605 38.1067 230.085 39.04C228.565 39.9467 226.831 40.4 224.885 40.4C222.991 40.4 221.271 39.9467 219.725 39.04C218.205 38.1067 216.991 36.84 216.085 35.24C215.205 33.6133 214.765 31.7867 214.765 29.76C214.765 27.7067 215.205 25.88 216.085 24.28C216.991 22.68 218.205 21.4133 219.725 20.48C221.271 19.5467 222.991 19.08 224.885 19.08C226.831 19.08 228.565 19.5467 230.085 20.48C231.605 21.4133 232.805 22.68 233.685 24.28C234.565 25.88 235.005 27.7067 235.005 29.76ZM232.605 29.76C232.605 28.1333 232.271 26.6933 231.605 25.44C230.938 24.16 230.018 23.16 228.845 22.44C227.698 21.6933 226.378 21.32 224.885 21.32C223.445 21.32 222.138 21.6933 220.965 22.44C219.791 23.16 218.858 24.16 218.165 25.44C217.498 26.6933 217.165 28.1333 217.165 29.76C217.165 31.3867 217.498 32.8267 218.165 34.08C218.858 35.3333 219.791 36.3333 220.965 37.08C222.138 37.8 223.445 38.16 224.885 38.16C226.378 38.16 227.698 37.8 228.845 37.08C230.018 36.3333 230.938 35.3333 231.605 34.08C232.271 32.8267 232.605 31.3867 232.605 29.76ZM249.825 19.4C251.639 19.4 253.239 19.8533 254.625 20.76C256.039 21.64 257.159 22.8667 257.985 24.44C258.812 25.9867 259.225 27.7733 259.225 29.8C259.225 31.8267 258.812 33.6267 257.985 35.2C257.159 36.7733 256.039 38.0133 254.625 38.92C253.212 39.8267 251.625 40.28 249.865 40.28C248.932 40.28 248.039 40.1467 247.185 39.88C246.359 39.5867 245.599 39.2 244.905 38.72C244.212 38.24 243.599 37.68 243.065 37.04C242.532 36.3733 242.105 35.6533 241.785 34.88L242.505 34.36V46.8C242.505 47.12 242.385 47.4 242.145 47.64C241.932 47.88 241.652 48 241.305 48C240.959 48 240.665 47.88 240.425 47.64C240.212 47.4 240.105 47.12 240.105 46.8V20.72C240.105 20.3733 240.212 20.08 240.425 19.84C240.639 19.6 240.932 19.48 241.305 19.48C241.652 19.48 241.932 19.6 242.145 19.84C242.385 20.08 242.505 20.3733 242.505 20.72V25.04L241.945 24.72C242.212 23.8933 242.599 23.16 243.105 22.52C243.639 21.8533 244.252 21.2933 244.945 20.84C245.639 20.36 246.399 20 247.225 19.76C248.052 19.52 248.919 19.4 249.825 19.4ZM249.625 21.64C248.185 21.64 246.919 22 245.825 22.72C244.732 23.4133 243.865 24.3733 243.225 25.6C242.612 26.8 242.305 28.2 242.305 29.8C242.305 31.3733 242.612 32.7867 243.225 34.04C243.865 35.2933 244.732 36.28 245.825 37C246.919 37.6933 248.185 38.04 249.625 38.04C251.039 38.04 252.279 37.6933 253.345 37C254.439 36.28 255.305 35.2933 255.945 34.04C256.585 32.7867 256.905 31.3733 256.905 29.8C256.905 28.2267 256.585 26.8267 255.945 25.6C255.305 24.3733 254.439 23.4133 253.345 22.72C252.279 22 251.039 21.64 249.625 21.64Z"
        fill="#1289CC"
      />
    </svg>
  )
}

function SmallLearnloopIcon({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-4', className)}
      {...props}
    >
      <g clipPath="url(#clip0_426_136)">
        <path
          d="M11.04 0H0.96C0.429807 0 0 0.429807 0 0.96V11.04C0 11.5702 0.429807 12 0.96 12H11.04C11.5702 12 12 11.5702 12 11.04V0.96C12 0.429807 11.5702 0 11.04 0Z"
          fill="#081537"
        />
        <path
          d="M23.04 12H12.96C12.4298 12 12 12.4298 12 12.96V23.04C12 23.5702 12.4298 24 12.96 24H23.04C23.5702 24 24 23.5702 24 23.04V12.96C24 12.4298 23.5702 12 23.04 12Z"
          fill="#AB00FF"
        />
        <path
          d="M7.36347 1.43989L4.08008 10.4609L4.75666 10.7072L8.04005 1.68614L7.36347 1.43989Z"
          fill="#1D4DCA"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.0002 15.2998L14.7002 17.0998L15.9002 17.7538V19.5538L18.0002 20.6998L20.1002 19.5538V17.7538L20.7002 17.4268V19.4998H21.3002V17.0998L18.0002 15.2998ZM20.0462 17.0998L18.0002 18.2158L15.9542 17.0998L18.0002 15.9838L20.0462 17.0998ZM18.0002 20.0158L19.5002 19.1968V18.0808L18.0002 18.8998L16.5002 18.0808V19.1968L18.0002 20.0158Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_426_136">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export {
  IconEdit,
  IconNextChat,
  IconOpenAI,
  IconVercel,
  IconGitHub,
  IconGoogle,
  IconLearnloop,
  IconCube,
  SmallLearnloopIcon,
  IconSeparator,
  IconArrowDown,
  IconArrowRight,
  IconUser,
  IconPlus,
  IconArrowElbow,
  IconSpinner,
  IconMessage,
  IconTrash,
  IconRefresh,
  IconStop,
  IconSidebar,
  IconMoon,
  IconSun,
  IconCopy,
  IconCheck,
  IconDownload,
  IconClose,
  IconShare,
  IconUsers,
  IconExternalLink,
  IconChevronUpDown
}
