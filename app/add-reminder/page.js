"use client";

import { useState } from "react";

export default function AddReminderPage() {
    const [formData, setFormData] = useState({
        petName: "",
        type: "",
        date: "",
        time: "",
        description: "",
    });

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Reminder submitted:", formData);
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

            <button type="submit" className="primary-button">
            Save Reminder
            </button>
        </form>
        </div>
    );
}