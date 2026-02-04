import { useState, useEffect } from "react";
import styles from "./eventDetails.module.css";
import type { EventApi } from "@fullcalendar/core";
import { getCurrentUser, type CurrentUser } from "@/utils/user";

type Participant = {
  userId: string | number;
  username: string;
  email: string;
};

type EventDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  event?: EventApi | null;
  onParticipantChange?: (event: EventApi, participants: Participant[]) => void;
};

const EventDetailsModal = ({ isOpen, onClose, event, onParticipantChange }: EventDetailsModalProps) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const user = getCurrentUser();
      setCurrentUser(user);
      
      // Récupérer les participants depuis extendedProps
      const eventParticipants = (event?.extendedProps?.participants as Participant[]) || [];
      setParticipants(eventParticipants);
      
      // Vérifier si l'utilisateur actuel participe
      if (user) {
        const participating = eventParticipants.some(p => p.userId === user.id || p.email === user.email);
        setIsParticipating(participating);
      }
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleParticipation = () => {
    if (!currentUser || !event) return;

    let newParticipants: Participant[];
    
    if (isParticipating) {
      // Retirer l'utilisateur de la liste
      newParticipants = participants.filter(
        p => p.userId !== currentUser.id && p.email !== currentUser.email
      );
    } else {
      // Ajouter l'utilisateur à la liste
      const userParticipant: Participant = {
        userId: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
      };
      newParticipants = [...participants, userParticipant];
    }

    setParticipants(newParticipants);
    setIsParticipating(!isParticipating);

    // Mettre à jour l'événement
    event.setExtendedProp('participants', newParticipants);

    // Notifier le parent si nécessaire
    if (onParticipantChange) {
      onParticipantChange(event, newParticipants);
    }
  };

  const isAllDay = event.allDay;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.header}>
          <h2>Détails de l&apos;événement</h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.details}>
          <div className={styles.field}>
            <label>Titre</label>
            <div className={styles.detailValue}>{event.title || "-"}</div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Date début</label>
              <div className={styles.detailValue}>{formatDate(event.start)}</div>
            </div>
            <div className={styles.field}>
              <label>Date fin</label>
              <div className={styles.detailValue}>
                {formatDate(event.end ?? event.start)}
              </div>
            </div>
          </div>

          {!isAllDay && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Heure début</label>
                <div className={styles.detailValue}>{formatTime(event.start)}</div>
              </div>
              <div className={styles.field}>
                <label>Heure fin</label>
                <div className={styles.detailValue}>
                  {formatTime(event.end ?? event.start)}
                </div>
              </div>
            </div>
          )}

          {/* Section Participation */}
          {currentUser && (
            <div className={styles.participationSection}>
              <div className={styles.participationHeader}>
                <label>Participation</label>
                <button
                  type="button"
                  className={`${styles.participationButton} ${
                    isParticipating ? styles.participating : styles.notParticipating
                  }`}
                  onClick={handleToggleParticipation}
                >
                  {isParticipating ? "✓ Je participe" : "Je ne participe pas"}
                </button>
              </div>

              {participants.length > 0 && (
                <div className={styles.participantsList}>
                  <label className={styles.participantsLabel}>
                    Participants ({participants.length})
                  </label>
                  <div className={styles.participantsContainer}>
                    {participants.map((participant, index) => (
                      <div key={index} className={styles.participantItem}>
                        <span className={styles.participantName}>
                          {participant.username || participant.email}
                        </span>
                        {participant.userId === currentUser.id && (
                          <span className={styles.youBadge}>Vous</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;

