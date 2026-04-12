"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function AddPetPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        type: "",
        breed: "",
        age: "",
        notes: "",
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
        await addDoc(collection(db, "pets"), {
            name: formData.name,
            type: formData.type,
            breed: formData.breed,
            age: Number(formData.age) || 0,
            notes: formData.notes,
            createdAt: Timestamp.now(),
        });

        setMessage("Pet added successfully.");

        setFormData({
            name: "",
            type: "",
            breed: "",
            age: "",
            notes: "",
        });

        router.push("/pets");
        router.refresh();
        } catch (error) {
        console.error("Error adding pet:", error);
        setMessage("Failed to add pet.");
        }
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

        {message && <p className="status-message">{message}</p>}
        </div>
    );
}