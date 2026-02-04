import styles from "./eventModal.module.css";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
  }) => void;
  initialValues?: {
    title?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
  };
};

const EventModal = ({ isOpen, onClose, onSubmit, initialValues }: EventModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onSubmit({
      title: (formData.get("title") as string) || "",
      startDate: (formData.get("startDate") as string) || "",
      endDate: (formData.get("endDate") as string) || "",
      startTime: (formData.get("startTime") as string) || "",
      endTime: (formData.get("endTime") as string) || "",
    });
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.header}>
          <h2>Créer un événement</h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="title">Titre</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Titre de l'événement"
              defaultValue={initialValues?.title || ""}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="startDate">Date début</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={initialValues?.startDate || ""}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="endDate">Date fin</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={initialValues?.endDate || ""}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="startTime">Heure début</label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                defaultValue={initialValues?.startTime || ""}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="endTime">Heure fin</label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                defaultValue={initialValues?.endTime || ""}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.primaryButton}>
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;