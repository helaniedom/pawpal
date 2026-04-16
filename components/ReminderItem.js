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

    const now = new Date();
    const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
    const isOverdue = !reminder.completed && reminderDateTime < now;

    let statusClass = "status-badge pending";
    let statusText = "Pending";

    if (reminder.completed) {
        statusClass = "status-badge completed";
        statusText = "Completed";
    } else if (isOverdue) {
        statusClass = "status-badge overdue";
        statusText = "Overdue";
    }

    return (
        <div className="card interactive-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <h3 className="card-title" style={{ marginBottom: 0 }}>{reminder.type}</h3>
                <span className={statusClass}>{statusText}</span>
            </div>

            <p><strong>Pet:</strong> {reminder.petName}</p>
            <p>
                <strong>Date:</strong>{" "}
                {new Date(reminder.date).toLocaleDateString("en-US")}
            </p>
            <p><strong>Time:</strong> {reminder.time}</p>
            <p><strong>Details:</strong> {reminder.description}</p>

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