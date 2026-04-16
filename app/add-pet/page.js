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
        imageUrl: "/paw.png",
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
            await addDoc(collection(db, "pets"), {
                name: trimmedName,
                type: trimmedType,
                breed: trimmedBreed,
                age: formData.age === "" ? 0 : Number(formData.age),
                notes: trimmedNotes,
                imageUrl: formData.imageUrl,
                createdAt: Timestamp.now(),
            });

            setMessage("Pet added successfully.");

            setFormData({
                name: "",
                type: "",
                breed: "",
                age: "",
                notes: "",
                imageUrl: "/paw.png",
            });

            router.push("/pets");
            router.refresh();
        } catch (error) {
            console.error("Error adding pet:", error);
            setMessage("Failed to add pet.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="form-container">
            <h1 className="page-title">Add a New Pet</h1>

            <form onSubmit={handleSubmit} className="form-layout">
                <label
                    htmlFor="name"
                    style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "-8px"
                    }}
                >
                    Pet Name
                </label>

                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label
                    htmlFor="type"
                    style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "-8px"
                    }}
                >
                    Pet Type
                </label>

                <input
                    id="type"
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                />

                <label
                    htmlFor="breed"
                    style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "-8px"
                    }}
                >
                    Breed
                </label>

                <input
                    id="breed"
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                />

                <label
                    htmlFor="age"
                    style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "-8px"
                    }}
                >
                    Age
                </label>

                <input
                    id="age"
                    type="number"
                    name="age"
                    min="0"
                    value={formData.age}
                    onChange={handleChange}
                />

                <label
                    htmlFor="notes"
                    style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "-8px"
                    }}
                >
                    Notes
                </label>

                <textarea
                    id="notes"
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

                <label
                    htmlFor="imageUrl"
                    style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "-8px"
                    }}
                >
                    Profile Picture
                </label>

                <select
                    id="imageUrl"
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

                <button type="submit" className="primary-button" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Pet"}
                </button>
            </form>

            {message && <p className="status-message">{message}</p>}
        </div>
    );
}