"use client";

import { useState } from "react";

export default function AddPetPage() {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        breed: "",
        age: "",
        notes: "",
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
        console.log("Pet submitted:", formData);
    }

    return (
        <div className="form-container">
        <h1 className="page-title">Add a New Pet</h1>

        <form onSubmit={handleSubmit} className="form-layout">
            <input
            type="text"
            name="name"
            placeholder="Pet Name"
            value={formData.name}
            onChange={handleChange}
            required
            />

            <input
            type="text"
            name="type"
            placeholder="Pet Type"
            value={formData.type}
            onChange={handleChange}
            required
            />

            <input
            type="text"
            name="breed"
            placeholder="Breed"
            value={formData.breed}
            onChange={handleChange}
            />

            <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            />

            <textarea
            name="notes"
            placeholder="Notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            />

            <button type="submit" className="primary-button">
            Save Pet
            </button>
        </form>
        </div>
    );
}