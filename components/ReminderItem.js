"use client";

import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ReminderItem({ reminder, onDelete, onToggleComplete, onEdit }) {
    async function handleDelete() {
        const confirmed = window.confirm("Delete this reminder?");
        if (!confirmed) return;

        try {
        await deleteDoc(doc(db, "reminders", reminder.id));
        if (onDelete) onDelete(reminder.id);
        } catch (error) {
        console.error("Error deleting reminder:", error);
        }
    }

    async function handleToggleComplete() {
        try {
        await updateDoc(doc(db, "reminders", reminder.id), {
            completed: !reminder.completed,
        });

        if (onToggleComplete) {
            onToggleComplete(reminder.id, !reminder.completed);
        }
        } catch (error) {
        console.error("Error updating reminder:", error);
        }
    }

    return (
        <div className="card">
        <h3 className="card-title">{reminder.type}</h3>
        <p><strong>Pet:</strong> {reminder.petName}</p>
        <p><strong>Date:</strong> {reminder.date}</p>
        <p><strong>Time:</strong> {reminder.time}</p>
        <p><strong>Details:</strong> {reminder.description}</p>
        <p>
            <strong>Status:</strong> {reminder.completed ? "Completed" : "Pending"}
        </p>

        <div className="card-actions">
            <button onClick={handleToggleComplete} className="secondary-button">
            {reminder.completed ? "Mark Pending" : "Mark Complete"}
            </button>

            <button onClick={() => onEdit && onEdit(reminder)} className="edit-button">
            Edit
            </button>

            <button onClick={handleDelete} className="danger-button">
            Delete
            </button>
        </div>
        </div>
    );
}