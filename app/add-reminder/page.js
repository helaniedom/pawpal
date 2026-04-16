"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
    addDoc,
    collection,
    Timestamp,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";

export default function AddReminderPage() {
    const router = useRouter();

    const [pets, setPets] = useState([]);
    const [loadingPets, setLoadingPets] = useState(true);

    const [formData, setFormData] = useState({
        petId: "",
        type: "",
        date: "",
        time: "",
        description: "",
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
            } catch (error) {
                console.error("Error fetching pets:", error);
            } finally {
                setLoadingPets(false);
            }
        }

        fetchPets();
    }, []);

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
            await addDoc(collection(db, "reminders"), {
                petId: selectedPet.id,
                petName: selectedPet.name,
                type: formData.type,
                date: formData.date,
                time: formData.time,
                description: trimmedDescription,
                completed: false,
                createdAt: Timestamp.now(),
            });

            setMessage("Reminder added successfully.");

            setFormData({
                petId: "",
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
                    <option value="Bath">Bath</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Training Session">Training Session</option>
                    <option value="Other">Other</option>
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

                <button type="submit" className="primary-button" disabled={isSubmitting || loadingPets || pets.length === 0}>
                    {isSubmitting ? "Saving..." : "Save Reminder"}
                </button>
            </form>

            {message && <p className="status-message">{message}</p>}
        </div>
    );
}