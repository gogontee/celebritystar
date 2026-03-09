'use client'
import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils/helpers'

const Button = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    variant = 'primary',
    size = 'default',
    isLoading = false,
    disabled = false,
    fullWidth = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    iconOnly = false,
    ...rest
  } = props

  // Base classes for all buttons
  const baseClasses = cn(
    'inline-flex items-center justify-center font-semibold transition-all duration-200',
    'rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95',
    fullWidth && 'w-full',
    iconOnly && '!p-2 aspect-square',
    className
  )

  // Size variations
  const sizeClasses = {
    xs: cn('text-xs px-3 py-1.5', iconOnly && 'p-1.5'),
    sm: cn('text-sm px-4 py-2', iconOnly && 'p-2'),
    default: cn('text-base px-6 py-3', iconOnly && 'p-3'),
    lg: cn('text-lg px-8 py-4', iconOnly && 'p-4'),
    xl: cn('text-xl px-10 py-5', iconOnly && 'p-5'),
  }

  // Variant styles with your color scheme
  const variantClasses = {
    // Primary gradient (burnt orange to lemon)
    primary: cn(
      'bg-gradient-to-r from-burnt-orange-500 to-lemon-400 hover:from-burnt-orange-600 hover:to-lemon-500',
      'text-white focus:ring-burnt-orange-300',
      'shadow-lg hover:shadow-xl shadow-orange-200/50'
    ),
    
    // Secondary (outline)
    secondary: cn(
      'bg-transparent border-2 border-burnt-orange-500',
      'text-burnt-orange-600 hover:bg-burnt-orange-50',
      'focus:ring-burnt-orange-300'
    ),
    
    // Success (for vote confirmations)
    success: cn(
      'bg-gradient-to-r from-green-500 to-emerald-400',
      'text-white focus:ring-green-300',
      'shadow-lg hover:shadow-xl shadow-green-200/50'
    ),
    
    // Danger (for deletions)
    danger: cn(
      'bg-gradient-to-r from-red-500 to-pink-400',
      'text-white focus:ring-red-300',
      'shadow-lg hover:shadow-xl shadow-red-200/50'
    ),
    
    // Ghost (minimal)
    ghost: cn(
      'bg-transparent hover:bg-gray-100',
      'text-gray-700 focus:ring-gray-300',
      'border border-gray-200'
    ),
    
    // Text (link-like)
    text: cn(
      'bg-transparent hover:bg-orange-50',
      'text-burnt-orange-600 focus:ring-burnt-orange-300',
      'underline-offset-4 hover:underline'
    ),
    
    // Vote-specific (special style for voting buttons)
    vote: cn(
      'bg-gradient-to-r from-purple-600 to-pink-500',
      'text-white focus:ring-purple-300',
      'shadow-2xl hover:shadow-3xl shadow-purple-300/50 hover:shadow-purple-400/50',
      'animate-pulse-subtle'
    ),
  }

  // Animation keyframes for subtle pulse (for voting buttons)
  const animationStyles = `
    @keyframes subtle-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.9; }
    }
    .animate-pulse-subtle {
      animation: subtle-pulse 2s infinite;
    }
  `

  return (
    <>
      <style jsx global>{animationStyles}</style>
      <button
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          iconOnly && '!p-2'
        )}
        disabled={disabled || isLoading}
        {...rest}
      >
        {isLoading && (
          <Loader2 className={cn(
            'animate-spin',
            children ? 'mr-2' : '',
            size === 'xs' && 'h-3 w-3',
            size === 'sm' && 'h-4 w-4',
            size === 'default' && 'h-5 w-5',
            size === 'lg' && 'h-6 w-6',
            size === 'xl' && 'h-7 w-7'
          )} />
        )}
        
        {!isLoading && LeftIcon && (
          <LeftIcon className={cn(
            children ? 'mr-2' : '',
            size === 'xs' && 'h-3 w-3',
            size === 'sm' && 'h-4 w-4',
            size === 'default' && 'h-5 w-5',
            size === 'lg' && 'h-6 w-6',
            size === 'xl' && 'h-7 w-7'
          )} />
        )}
        
        {!iconOnly && children}
        
        {!isLoading && RightIcon && (
          <RightIcon className={cn(
            children ? 'ml-2' : '',
            size === 'xs' && 'h-3 w-3',
            size === 'sm' && 'h-4 w-4',
            size === 'default' && 'h-5 w-5',
            size === 'lg' && 'h-6 w-6',
            size === 'xl' && 'h-7 w-7'
          )} />
        )}
        
        {iconOnly && !isLoading && !LeftIcon && !RightIcon && children}
      </button>
    </>
  )
})

Button.displayName = 'Button'

export default Button