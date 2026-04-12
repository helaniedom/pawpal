"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function EditPetForm({ pet, onUpdated, onCancel }) {
    const [formData, setFormData] = useState({
        name: pet.name || "",
        type: pet.type || "",
        breed: pet.breed || "",
        age: pet.age || "",
        notes: pet.notes || "",
    });

    const [message, setMessage] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        try {
        await updateDoc(doc(db, "pets", pet.id), {
            name: formData.name,
            type: formData.type,
            breed: formData.breed,
            age: Number(formData.age) || 0,
            notes: formData.notes,
        });

        onUpdated({
            ...pet,
            ...formData,
            age: Number(formData.age) || 0,
        });
        } catch (error) {
        console.error("Error updating pet:", error);
        setMessage("Failed to update pet.");
        }
    }

    return (
        <div className="form-container" style={{ marginBottom: "24px" }}>
        <h2 className="page-title" style={{ fontSize: "24px" }}>Edit Pet</h2>

        <form onSubmit={handleSubmit} className="form-layout">
            <input name="name" value={formData.name} onChange={handleChange} required />
            <input name="type" value={formData.type} onChange={handleChange} required />
            <input name="breed" value={formData.breed} onChange={handleChange} />
            <input name="age" type="number" value={formData.age} onChange={handleChange} />
            <textarea name="notes" rows="4" value={formData.notes} onChange={handleChange} />

            <div className="card-actions">
            <button type="submit" className="primary-button">Save Changes</button>
            <button type="button" onClick={onCancel} className="secondary-button">Cancel</button>
            </div>
        </form>

        {message && <p className="status-message">{message}</p>}
        </div>
    );
}