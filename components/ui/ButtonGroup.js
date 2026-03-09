'use client'
import React from 'react'
import { cn } from '../../lib/utils/helpers'

const ButtonGroup = ({ children, className, orientation = 'horizontal', ...props }) => {
  return (
    <div
      className={cn(
        'flex',
        orientation === 'horizontal' 
          ? 'flex-row space-x-0 rounded-xl overflow-hidden' 
          : 'flex-col space-y-0 rounded-xl overflow-hidden',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            className: cn(
              child.props.className,
              orientation === 'horizontal'
                ? 'rounded-none first:rounded-l-xl last:rounded-r-xl border-r-0 last:border-r'
                : 'rounded-none first:rounded-t-xl last:rounded-b-xl border-b-0 last:border-b'
            ),
          })
        }
        return child
      })}
    </div>
  )
}

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup