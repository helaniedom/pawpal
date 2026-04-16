"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import ReminderList from "@/components/ReminderList";
import EditReminderForm from "@/components/EditReminderForm";

export default function SchedulePage() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReminder, setSelectedReminder] = useState(null);

    useEffect(() => {
        async function fetchReminders() {
            try {
                const remindersQuery = query(
                    collection(db, "reminders")
                );

                const querySnapshot = await getDocs(remindersQuery);

                const reminderData = querySnapshot.docs
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    .sort((a, b) => {
                        const aDateTime = new Date(`${a.date}T${a.time}`);
                        const bDateTime = new Date(`${b.date}T${b.time}`);
                        return aDateTime - bDateTime;
                    });

                setReminders(reminderData);
            } catch (error) {
                console.error("Error fetching reminders:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchReminders();
    }, []);

    function sortRemindersByDate(reminderList) {
        return [...reminderList].sort((a, b) => {
            const aDateTime = new Date(`${a.date}T${a.time}`);
            const bDateTime = new Date(`${b.date}T${b.time}`);
            return aDateTime - bDateTime;
        });
    }

    function handleDeleteReminder(deletedId) {
        setReminders((prev) =>
            sortRemindersByDate(prev.filter((reminder) => reminder.id !== deletedId))
        );
    }

    function handleToggleComplete(id, newStatus) {
        setReminders((prev) =>
            sortRemindersByDate(
                prev.map((reminder) =>
                    reminder.id === id ? { ...reminder, completed: newStatus } : reminder
                )
            )
        );
    }

    function handleEditReminder(reminder) {
        setSelectedReminder(reminder);
    }

    function handleReminderUpdated(updatedReminder) {
        setReminders((prev) =>
            sortRemindersByDate(
                prev.map((reminder) =>
                    reminder.id === updatedReminder.id ? updatedReminder : reminder
                )
            )
        );
        setSelectedReminder(null);
    }

    function handleCancelEdit() {
        setSelectedReminder(null);
    }

    return (
        <div>
            <h1 className="page-title">Schedule</h1>
            <p className="page-text">Track all upcoming pet care reminders.</p>

            {selectedReminder && (
                <EditReminderForm
                    reminder={selectedReminder}
                    onUpdated={handleReminderUpdated}
                    onCancel={handleCancelEdit}
                />
            )}

            {loading ? (
                <p>Loading reminders...</p>
            ) : reminders.length === 0 ? (
                <p>No reminders added yet.</p>
            ) : (
                <ReminderList
                    reminders={reminders}
                    onDelete={handleDeleteReminder}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditReminder}
                />
            )}
        </div>
    );
}