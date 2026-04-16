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
            await addDoc(collection(db, "reminders"), {
                petName: formData.petName,
                type: formData.type,
                date: formData.date,
                time: formData.time,
                description: formData.description,
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
        }
    }

    return (
        <div className="form-container">
            <h1 className="page-title">Add Reminder</h1>

            <form onSubmit={handleSubmit} className="form-layout">
                <div>
                    <label htmlFor="petName">Pet Name</label>
                    <input
                        id="petName"
                        type="text"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="type">Reminder Type</label>
                    <select
                        id="type"
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
                    <label htmlFor="date">Date</label>
                    <input
                        id="date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="time">Time</label>
                    <input
                        id="time"
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description">Reminder Details</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Reminder Details"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="primary-button">
                    Save Reminder
                </button>
            </form>

            {message && <p className="status-message">{message}</p>}
        </div>
    );
}