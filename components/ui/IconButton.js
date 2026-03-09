'use client'
import React from 'react'
import Button from './Button'

const IconButton = React.forwardRef((props, ref) => {
  const { icon: Icon, label, ...rest } = props
  
  return (
    <Button
      ref={ref}
      iconOnly
      aria-label={label}
      {...rest}
    >
      <Icon className="h-5 w-5" />
    </Button>
  )
})

IconButton.displayName = 'IconButton'

export default IconButton