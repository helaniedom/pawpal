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
        imageUrl: pet.imageUrl || "/paw.png",
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
            await updateDoc(doc(db, "pets", pet.id), {
                name: formData.name,
                type: formData.type,
                breed: formData.breed,
                age: Number(formData.age) || 0,
                notes: formData.notes,
                imageUrl: formData.imageUrl,
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
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                />

                <textarea
                    name="notes"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                />

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                    <img
                        src={formData.imageUrl}
                        alt="Selected pet icon"
                        style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "contain",
                            borderRadius: "20%",
                            border: "2px solid #fbcfe8",
                            padding: "10px",
                            backgroundColor: "#fff7fb"
                        }}
                    />
                </div>

                <select
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                >
                    <option value="/paw.png">Paw</option>
                    <option value="/dog.png">Dog</option>
                    <option value="/cat.png">Cat</option>
                    <option value="/bird.png">Bird</option>
                    <option value="/hamster.png">Hamster</option>
                    <option value="/rabbit.png">Rabbit</option>
                </select>

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