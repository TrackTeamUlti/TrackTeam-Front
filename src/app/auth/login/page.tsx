import LoginForm from "@/components/forms/LoginForm/LoginForm"
import styles from "./page.module.css"

export default function page() {
  return (
    <div className={styles.page}>
      <LoginForm></LoginForm>
    </div>
  )
}
