import React from 'react'
import { IconProps } from './IconProps'
import { THEME } from '@/styles/theme'

export default function NotificationIcon({
  size, color, className
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size ?? 20}
      height={size ?? 20}
      fill={color ?? THEME.ROYAL_GRAY_COLOR}
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.6688 7.71472C19.1469 7.89946 18.5852 8 18 8C15.2386 8 13 5.76142 13 3C13 2.68328 13.0294 2.37343 13.0858 2.07306C12.7307 2.02488 12.3683 2 12 2C7.58172 2 4 5.58172 4 10V15.2676C3.4022 15.6134 3 16.2597 3 17V18H21V17C21 16.2597 20.5978 15.6134 20 15.2676V10C20 9.2059 19.8843 8.43883 19.6688 7.71472ZM14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20H14Z"
        fill="white"
      />
      <path
        d="M21 3C21 4.65685 19.6569 6 18 6C16.3431 6 15 4.65685 15 3C15 1.34315 16.3431 0 18 0C19.6569 0 21 1.34315 21 3Z"
        fill="#3DFFB9"
      />
    </svg>
  )
}
