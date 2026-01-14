'use client'

import React, { useState } from 'react'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import styles from './loginForm.module.css'

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void | Promise<void>
  isLoading?: boolean
}

interface FormErrors {
  email?: string
  username?: string
  password?: string
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'L\'email est requis'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Veuillez entrer un email valide'
    }
    return undefined
  }

  const validateUsername = (username: string): string | undefined => {
    if (!username) {
      return 'Le nom d\'utilisateur est requis'
    }
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Le mot de passe est requis'
    }
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères'
    }
    return undefined
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    const usernameError = validateUsername(username)
    const passwordError = validatePassword(password)

    setErrors({
      email: emailError,
      username: usernameError,
      password: passwordError,  
    })

    if (emailError || passwordError) {
      return
    }

    setIsSubmitting(true)
    
    try {
      if (onSubmit) {
        await onSubmit(email, password)
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: undefined }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }))
    }
  }

  const isFormDisabled = isLoading || isSubmitting

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <h1 className={styles.title}>Connexion</h1>
        <p className={styles.subtitle}>Connectez-vous à votre compte</p>
      </div>

      <div className={styles.fields}>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
          fullWidth
          disabled={isFormDisabled}
          required
        />

        <Input
          id="username"
          label="Nom d'utilisateur"
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={handleUsernameChange}
          error={errors.username}
          fullWidth
          disabled={isFormDisabled}
          required
        />

        <Input
          id="password"
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
          fullWidth
          disabled={isFormDisabled}
          required
        />
      </div>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isFormDisabled}
          className={styles.submitButton}
        >
          {isFormDisabled ? 'Connexion...' : 'Se connecter'}
        </Button>
      </div>
    </form>
  )
}

export default LoginForm
