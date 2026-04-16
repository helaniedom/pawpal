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

        const trimmedName = formData.name.trim();
        const trimmedType = formData.type.trim();
        const trimmedBreed = formData.breed.trim();
        const trimmedNotes = formData.notes.trim();

        if (!trimmedName) {
            setMessage("Pet name is required.");
            return;
        }

        if (!trimmedType) {
            setMessage("Pet type is required.");
            return;
        }

        if (formData.age !== "" && Number(formData.age) < 0) {
            setMessage("Age cannot be negative.");
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedPet = {
                ...pet,
                name: trimmedName,
                type: trimmedType,
                breed: trimmedBreed,
                age: formData.age === "" ? 0 : Number(formData.age),
                notes: trimmedNotes,
                imageUrl: formData.imageUrl,
            };

            await updateDoc(doc(db, "pets", pet.id), {
                name: updatedPet.name,
                type: updatedPet.type,
                breed: updatedPet.breed,
                age: updatedPet.age,
                notes: updatedPet.notes,
                imageUrl: updatedPet.imageUrl,
            });

            setMessage("Pet updated successfully.");

            setTimeout(() => {
                onUpdated(updatedPet);
            }, 1000);
        } catch (error) {
            console.error("Error updating pet:", error);
            setMessage("Failed to update pet.");
            setIsSubmitting(false);
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
                    min="0"
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