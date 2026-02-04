import Calendar from "@/components/Calendar/Calendar"
import styles from "./page.module.css"

export default function page() {
  return (
    <div className={styles.page}>
        <Calendar></Calendar>
    </div>
  )
}
