'use client'

import styles from "./page.module.css";
import { redirect } from "next/navigation";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import LoginForm from "@/components/forms/LoginForm/LoginForm";
import RegisterForm from "@/components/forms/RegisterForm/RegisterForm";

export default function Home() {
  redirect("/auth/register")
  return (
    <div className={styles.page}>
      {/* <main className={styles.main}> */}
        {/* <LoginForm /> */}
        {/* <RegisterForm /> */}
      {/* </main> */}
    </div>
  );
}
