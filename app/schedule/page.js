"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import ReminderList from "@/components/ReminderList";

export default function SchedulePage() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReminders() {
        try {
            const remindersQuery = query(
            collection(db, "reminders"),
            orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(remindersQuery);

            const reminderData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));

            setReminders(reminderData);
        } catch (error) {
            console.error("Error fetching reminders:", error);
        } finally {
            setLoading(false);
        }
        }

        fetchReminders();
    }, []);

    function handleDeleteReminder(deletedId) {
        setReminders((prev) => prev.filter((reminder) => reminder.id !== deletedId));
    }

    function handleToggleComplete(id, newStatus) {
        setReminders((prev) =>
        prev.map((reminder) =>
            reminder.id === id ? { ...reminder, completed: newStatus } : reminder
        )
        );
    }

    return (
        <div>
        <h1 className="page-title">Schedule</h1>
        <p className="page-text">Track all upcoming pet care reminders.</p>

        {loading ? (
            <p>Loading reminders...</p>
        ) : reminders.length === 0 ? (
            <p>No reminders added yet.</p>
        ) : (
            <ReminderList
            reminders={reminders}
            onDelete={handleDeleteReminder}
            onToggleComplete={handleToggleComplete}
            />
        )}
        </div>
    );
}