"use client";

import React, { useActionState, useEffect, useState } from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Link from "next/link";
import styles from "./loginForm.module.css";
import { loginUser } from "@/actions/auth";

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = ({}) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Réinitialiser le formulaire uniquement en cas de succès
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        setEmail("");
        setPassword("");
      }, 0);
    }
  }, [state?.success]);

  return (
    <form className={styles.form} action={formAction} noValidate>
      <div className={styles.header}>
        <h1 className={styles.title}>Connexion</h1>
        <p className={styles.subtitle}>Connectez-vous à votre compte</p>
      </div>

      <div className={styles.fields}>
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

        {/* <Input
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
        /> */}

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
          {isPending ? "Connexion..." : "Se connecter"}
        </Button>
        <Link href="/auth/register" className={styles.registerLink}>
          Pas encore de compte ? S'inscrire
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
