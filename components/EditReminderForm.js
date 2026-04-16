"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function EditReminderForm({ reminder, onUpdated, onCancel }) {
    const [formData, setFormData] = useState({
        petName: reminder.petName || "",
        type: reminder.type || "",
        date: reminder.date || "",
        time: reminder.time || "",
        description: reminder.description || "",
    });

    const [message, setMessage] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        try {
            await updateDoc(doc(db, "reminders", reminder.id), {
                petName: formData.petName,
                type: formData.type,
                date: formData.date,
                time: formData.time,
                description: formData.description,
            });

            onUpdated({
                ...reminder,
                ...formData,
            });
        } catch (error) {
            console.error("Error updating reminder:", error);
            setMessage("Failed to update reminder.");
        }
    }

    return (
        <div className="form-container" style={{ marginBottom: "24px" }}>
            <h2 className="page-title" style={{ fontSize: "24px" }}>Edit Reminder</h2>

            <form onSubmit={handleSubmit} className="form-layout">
                <div>
                    <label htmlFor="edit-petName">Pet Name</label>
                    <input
                        id="edit-petName"
                        type="text"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-type">Reminder Type</label>
                    <select
                        id="edit-type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Reminder Type</option>
                        <option value="Feeding">Feeding</option>
                        <option value="Medication">Medication</option>
                        <option value="Vet Appointment">Vet Appointment</option>
                        <option value="Grooming Appointment">Grooming Appointment</option>
                        <option value="Walk">Walk</option>
                        <option value="Bath">Bath</option>
                        <option value="Vaccination">Vaccination</option>
                        <option value="Training Session">Training Session</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="edit-date">Date</label>
                    <input
                        id="edit-date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-time">Time</label>
                    <input
                        id="edit-time"
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-description">Reminder Details</label>
                    <textarea
                        id="edit-description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="card-actions">
                    <button type="submit" className="primary-button">
                        Save Changes
                    </button>
                    <button type="button" onClick={onCancel} className="secondary-button">
                        Cancel
                    </button>
                </div>
            </form>

            {message && <p className="status-message">{message}</p>}
        </div>
    );
}