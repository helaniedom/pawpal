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
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;

        setMessage("");

        const trimmedPetName = formData.petName.trim();
        const trimmedDescription = formData.description.trim();

        if (!trimmedPetName) {
            setMessage("Pet name is required.");
            return;
        }

        if (!formData.type) {
            setMessage("Reminder type is required.");
            return;
        }

        if (!formData.date) {
            setMessage("Date is required.");
            return;
        }

        if (!formData.time) {
            setMessage("Time is required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedReminder = {
                ...reminder,
                petName: trimmedPetName,
                type: formData.type,
                date: formData.date,
                time: formData.time,
                description: trimmedDescription,
            };

            await updateDoc(doc(db, "reminders", reminder.id), {
                petName: updatedReminder.petName,
                type: updatedReminder.type,
                date: updatedReminder.date,
                time: updatedReminder.time,
                description: updatedReminder.description,
            });

            setMessage("Reminder updated successfully.");

            setTimeout(() => {
                onUpdated(updatedReminder);
            }, 1000);
        } catch (error) {
            console.error("Error updating reminder:", error);
            setMessage("Failed to update reminder.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="form-container" style={{ marginBottom: "24px" }}>
            <h2 className="page-title" style={{ fontSize: "24px" }}>Edit Reminder</h2>

            <form onSubmit={handleSubmit} className="form-layout">
                <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    required
                />

                <select
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

                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                />

                <div className="card-actions">
                    <button type="submit" className="primary-button" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={onCancel} className="secondary-button" disabled={isSubmitting}>
                        Cancel
                    </button>
                </div>
            </form>

            {message && <p className="status-message">{message}</p>}
        </div>
    );
}