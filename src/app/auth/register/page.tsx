import RegisterForm from "@/components/forms/RegisterForm/RegisterForm";
import styles from "./page.module.css";

export default function page() {
  return (
    <div className={styles.page}>
      <RegisterForm></RegisterForm>
    </div>
  );
}
