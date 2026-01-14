"use client";

import React, { useActionState, useState, useEffect } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import { registerUser } from "@/actions/auth";
import styles from "./registerForm.module.css";

interface RegisterFormProps {
  onSubmit?: (
    username: string,
    email: string,
    password: string
  ) => void | Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  // Utilisation de useActionState pour gérer l'état de la Server Action
  const [state, formAction, isPending] = useActionState(registerUser, null);

  // États pour préserver les valeurs du formulaire en cas d'erreur
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Réinitialiser le formulaire uniquement en cas de succès
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }, 0);
    }
  }, [state?.success]);

  return (
    <form className={styles.form} action={formAction} noValidate>
      <div className={styles.header}>
        <h1 className={styles.title}>Inscription</h1>
        <p className={styles.subtitle}>Créez votre compte</p>
      </div>

      <div className={styles.fields}>
        <Input
          id="username"
          name="username"
          label="Nom d'utilisateur"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          disabled={isPending}
          required
        />

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          disabled={isPending}
          required
        />

        <Input
          id="password"
          name="password"
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          disabled={isPending}
          required
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          disabled={isPending}
          required
        />
      </div>

      {state?.error && <div className={styles.errorMessage}>{state.error}</div>}

      {state?.success && (
        <div className={styles.successMessage}>
          {state.message || "Inscription réussie !"}
        </div>
      )}

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isPending}
          className={styles.submitButton}
        >
          {isPending ? "Inscription..." : "S'inscrire"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
