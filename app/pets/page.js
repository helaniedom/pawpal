"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import PetCard from "@/components/PetCard";
import EditPetForm from "@/components/EditPetForm";
import Link from "next/link";

export default function PetsPage() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState(null);

    useEffect(() => {
        const petsQuery = query(
            collection(db, "pets"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(
            petsQuery,
            (querySnapshot) => {
                const petData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setPets(petData);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching pets:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    function handleDeletePet(id) {
        setPets((prev) => prev.filter((pet) => pet.id !== id));
    }

    function handleEditPet(pet) {
        setSelectedPet(pet);
    }

    function handlePetUpdated(updatedPet) {
        setPets((prev) =>
            prev.map((pet) =>
                pet.id === updatedPet.id ? updatedPet : pet
            )
        );
        setSelectedPet(null);
    }

    function handleCancelEdit() {
        setSelectedPet(null);
    }

    return (
        <div>
            <div className="section-block">
                <h1 className="page-title">My Pets</h1>
                <p className="page-text">View, edit, and manage all pet profiles in one place.</p>
            </div>

            {selectedPet && (
                <EditPetForm
                    pet={selectedPet}
                    onUpdated={handlePetUpdated}
                    onCancel={handleCancelEdit}
                />
            )}

            {loading ? (
                <p>Loading pets...</p>
            ) : pets.length === 0 ? (
                <div className="empty-state">
                    <h3>No pets added yet 🐾</h3>
                    <p>Create your first pet profile to start using PawPal.</p>
                    <Link href="/add-pet" className="primary-button">Add Pet</Link>
                </div>
            ) : (
                <div className="two-column-grid">
                    {pets.map((pet) => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            onDelete={handleDeletePet}
                            onEdit={handleEditPet}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}