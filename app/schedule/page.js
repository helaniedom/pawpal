"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import ReminderList from "@/components/ReminderList";
import EditReminderForm from "@/components/EditReminderForm";
import Link from "next/link";

export default function SchedulePage() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReminder, setSelectedReminder] = useState(null);

    function sortRemindersByDate(reminderList) {
        return [...reminderList].sort((a, b) => {
            const aDateTime = new Date(`${a.date}T${a.time}`);
            const bDateTime = new Date(`${b.date}T${b.time}`);
            return aDateTime - bDateTime;
        });
    }

    useEffect(() => {
        const remindersQuery = query(collection(db, "reminders"));

        const unsubscribe = onSnapshot(
            remindersQuery,
            (querySnapshot) => {
                const reminderData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setReminders(sortRemindersByDate(reminderData));
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching reminders:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

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
            <div className="section-block">
                <h1 className="page-title">Schedule</h1>
                <p className="page-text">Track all upcoming pet care reminders.</p>
            </div>

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
                <div className="empty-state">
                    <h3>No reminders added yet 📅</h3>
                    <p>Add reminders to stay organized with feeding, medicine, and appointments.</p>
                    <Link href="/add-reminder" className="primary-button">Add Reminder</Link>
                </div>
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