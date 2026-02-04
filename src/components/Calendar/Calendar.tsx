"use client"

import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import EventModal from "../Modals/EventCreation/EventModal";
import EventDetailsModal from "../Modals/EventDetails/EventDetailsModal";
import { createEvent } from "@/actions/event";

type Props = {
    events?: []
};

const Calendar = ({events}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState<DateSelectArg | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [clickedEvent, setClickedEvent] = useState<EventClickArg | null>(null);
    const calendarRef = useRef<FullCalendar>(null);

    // Fonction pour convertir une date en format YYYY-MM-DD
    const formatDateForInput = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    };

    // Fonction pour extraire l'heure d'une date ISO
    const formatTimeForInput = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toTimeString().slice(0, 5); // Format HH:mm
    };

    // Fonction pour combiner date et heure en format ISO pour FullCalendar
    const combineDateAndTime = (date: string, time: string): string => {
        if (!time) return date;
        return `${date}T${time}:00`;
    };

    const handleSelect = (info: DateSelectArg) => {
        setSelectedInfo(info);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInfo(null);
    };

    const handleEventClick = (info: EventClickArg) => {
        setClickedEvent(info);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setClickedEvent(null);
    };

    const handleParticipantChange = (event: any, participants: any[]) => {
        // L'événement est déjà mis à jour par EventDetailsModal
        // Cette fonction peut être utilisée pour synchroniser avec le backend si nécessaire
        console.log('Participants mis à jour:', participants);
    };

    const handleSubmitEvent = async (data: {
        title: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
    }) => {
        if (!calendarRef.current) return;

        const calendarApi = calendarRef.current.getApi();

        // Combiner date et heure pour le début
        let startDateTime = combineDateAndTime(data.startDate, data.startTime);
        
        // Combiner date et heure pour la fin
        let endDateTime = combineDateAndTime(data.endDate, data.endTime);

        // Si pas d'heure spécifiée, utiliser la date seule (événement toute la journée)
        const isAllDay = !data.startTime && !data.endTime;
        if (!data.startTime) {
            startDateTime = data.startDate;
        }
        if (!data.endTime) {
            endDateTime = data.endDate;
        }

        try {
            // Préparer les dates au format ISO pour l'API
            const startDateISO = new Date(startDateTime).toISOString();
            const endDateISO = new Date(endDateTime).toISOString();

            // Appel à la server action pour créer l'événement
            const result = await createEvent({
                title: data.title,
                start: startDateISO,
                end: endDateISO,
                all_day: isAllDay,
            });

            if (!result.success) {
                console.error('Erreur API:', result.error);
                alert(result.error || 'Erreur lors de la création de l\'événement');
                return;
            }

            console.log('Événement créé avec succès:', result.data);

            // Ajouter l'événement au calendrier avec participants initialisés
            calendarApi.addEvent({
                id: result.data?.id?.toString(), // Utiliser l'ID retourné par l'API
                title: data.title,
                start: startDateTime,
                end: endDateTime,
                allDay: isAllDay,
                extendedProps: {
                    participants: [], // Initialiser avec un tableau vide de participants
                },
            });

            // Fermer la modal
            handleCloseModal();
        } catch (error) {
            console.error('Erreur lors de la création de l\'événement:', error);
            alert('Une erreur est survenue lors de la création de l\'événement.');
        }
    };

    // Préparer les valeurs initiales pour la modal
    const getInitialValues = () => {
        if (!selectedInfo) return undefined;

        return {
            startDate: formatDateForInput(selectedInfo.startStr),
            endDate: formatDateForInput(selectedInfo.endStr),
            startTime: selectedInfo.allDay ? "" : formatTimeForInput(selectedInfo.startStr),
            endTime: selectedInfo.allDay ? "" : formatTimeForInput(selectedInfo.endStr),
        };
    };

    return (
        <div style={{ padding: "20px" }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            select={handleSelect}
            eventClick={handleEventClick}
          />
          
          <EventModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitEvent}
            initialValues={getInitialValues()}
          />

          <EventDetailsModal
            isOpen={isDetailsOpen}
            onClose={handleCloseDetails}
            event={clickedEvent?.event}
            onParticipantChange={handleParticipantChange}
          />
        </div>
      );
//   return (
//     <>
//       <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
//     </>
//   );
};

export default Calendar;
