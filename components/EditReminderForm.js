"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    doc,
    updateDoc,
    collection,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";

export default function EditReminderForm({ reminder, onUpdated, onCancel }) {
    const [pets, setPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(true);

    const [formData, setFormData] = useState({
        petId: reminder.petId || "",
        type: reminder.type || "",
        date: reminder.date || "",
        time: reminder.time || "",
        description: reminder.description || "",
    });

    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchPets() {
            try {
                const petsQuery = query(
                    collection(db, "pets"),
                    orderBy("createdAt", "desc")
                );

                const querySnapshot = await getDocs(petsQuery);

                const petData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setPets(petData);

                if (!reminder.petId && reminder.petName) {
                    const matchedPet = petData.find(
                        (pet) =>
                            pet.name &&
                            pet.name.toLowerCase().trim() === reminder.petName.toLowerCase().trim()
                    );

                    if (matchedPet) {
                        setFormData((prev) => ({
                            ...prev,
                            petId: matchedPet.id,
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching pets:", error);
            } finally {
                setLoadingPets(false);
            }
        }

        fetchPets();
    }, [reminder.petId, reminder.petName]);

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

        const trimmedDescription = formData.description.trim();

        if (!formData.petId) {
            setMessage("Please select a pet.");
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

        const selectedPet = pets.find((pet) => pet.id === formData.petId);

        if (!selectedPet) {
            setMessage("Selected pet could not be found.");
            return;
        }

        setIsSubmitting(true);

        try {
            const updatedReminder = {
                ...reminder,
                petId: selectedPet.id,
                petName: selectedPet.name,
                type: formData.type,
                date: formData.date,
                time: formData.time,
                description: trimmedDescription,
            };

            await updateDoc(doc(db, "reminders", reminder.id), {
                petId: updatedReminder.petId,
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
        <div
            className="form-container"
            style={{
                marginBottom: "24px",
                maxWidth: "100%",
                width: "100%",
            }}
        >
            <h2 className="page-title" style={{ fontSize: "24px" }}>Edit Reminder</h2>

            <form onSubmit={handleSubmit} className="form-layout">
                <label
                    htmlFor="petId"
                    style={{
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "-8px"
                    }}
                >
                    Pet
                </label>

                <select
                    id="petId"
                    name="petId"
                    value={formData.petId}
                    onChange={handleChange}
                    required
                    disabled={loadingPets || pets.length === 0}
                >
                    <option value="">
                        {loadingPets ? "Loading pets..." : pets.length === 0 ? "No pets available" : "Select a pet"}
                    </option>
                    {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                            {pet.name}
                        </option>
                    ))}
                </select>

                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Reminder Type</option>
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
                    <button type="submit" className="primary-button" disabled={isSubmitting || loadingPets || pets.length === 0}>
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