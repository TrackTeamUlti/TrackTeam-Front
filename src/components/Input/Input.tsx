'use client'

import React from 'react'
import styles from './input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string
  label?: string
  error?: string
  fullWidth?: boolean
}

const Input: React.FC<InputProps> = ({
    id,
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  
  const inputClasses = [
    styles.input,
    error && styles.error,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input