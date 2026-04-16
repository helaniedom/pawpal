"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function AddReminderPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        petName: "",
        type: "",
        date: "",
        time: "",
        description: "",
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
            await addDoc(collection(db, "reminders"), {
                petName: trimmedPetName,
                type: formData.type,
                date: formData.date,
                time: formData.time,
                description: trimmedDescription,
                completed: false,
                createdAt: Timestamp.now(),
            });

            setMessage("Reminder added successfully.");

            setFormData({
                petName: "",
                type: "",
                date: "",
                time: "",
                description: "",
            });

            router.push("/schedule");
            router.refresh();
        } catch (error) {
            console.error("Error adding reminder:", error);
            setMessage("Failed to add reminder.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="form-container">
            <h1 className="page-title">Add Reminder</h1>

            <form onSubmit={handleSubmit} className="form-layout">
                <input
                    type="text"
                    name="petName"
                    placeholder="Pet Name"
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
                    placeholder="Reminder Details"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                />

                <button type="submit" className="primary-button" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Reminder"}
                </button>
            </form>

            {message && <p className="status-message">{message}</p>}
        </div>
    );
}