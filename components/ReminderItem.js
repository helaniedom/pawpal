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

    const showDashboardCheckboxOnly = onToggleComplete && !onEdit && !onDelete;

    function renderCheckbox() {
        return (
            <label
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "44px",
                    height: "44px",
                    cursor: "pointer",
                    position: "relative"
                }}
            >
                <input
                    type="checkbox"
                    checked={!!reminder.completed}
                    onChange={handleToggleComplete}
                    style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        width: "26px",
                        height: "26px",
                        border: "2px solid #f472b6",
                        borderRadius: "8px",
                        backgroundColor: reminder.completed ? "#ec4899" : "#fff7fb",
                        boxShadow: reminder.completed ? "0 0 0 3px rgba(244, 114, 182, 0.15)" : "none",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                />
                <span
                    style={{
                        position: "absolute",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "white",
                        pointerEvents: "none",
                        opacity: reminder.completed ? 1 : 0,
                        transform: reminder.completed ? "scale(1)" : "scale(0.8)",
                        transition: "all 0.2s ease",
                        lineHeight: 1
                    }}
                >
                    ✓
                </span>
            </label>
        );
    }

    return (
        <div className="card interactive-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <h3 className="card-title" style={{ marginBottom: 0 }}>{reminder.type}</h3>
                <span className={statusClass}>{statusText}</span>
            </div>

            {showDashboardCheckboxOnly ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "16px",
                        marginTop: "10px"
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <p><strong>Pet:</strong> {reminder.petName}</p>
                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(reminder.date).toLocaleDateString("en-US")}
                        </p>
                        <p><strong>Time:</strong> {reminder.time}</p>
                        <p><strong>Details:</strong> {reminder.description}</p>
                    </div>

                    <div
                        style={{
                            width: "70px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingTop: "48px"
                        }}
                    >
                        {renderCheckbox()}
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "16px",
                        marginTop: "10px"
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <p><strong>Pet:</strong> {reminder.petName}</p>
                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(reminder.date).toLocaleDateString("en-US")}
                        </p>
                        <p><strong>Time:</strong> {reminder.time}</p>
                        <p><strong>Details:</strong> {reminder.description}</p>
                    </div>

                    <div
                        style={{
                            width: "170px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "12px",
                            paddingTop: "48px"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            {onToggleComplete && renderCheckbox()}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                                justifyContent: "flex-end",
                                width: "100%"
                            }}
                        >
                            {onEdit && (
                                <button onClick={() => onEdit(reminder)} className="edit-button">
                                    Edit
                                </button>
                            )}

                            {onDelete && (
                                <button onClick={handleDelete} className="danger-button">
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}