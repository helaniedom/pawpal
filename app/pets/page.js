"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import PetCard from "@/components/PetCard";

export default function PetsPage() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
        }
        }

        fetchPets();
    }, []);

    return (
        <div>
        <h1 className="page-title">My Pets</h1>
        <p className="page-text">View all pet profiles in one place.</p>

        {loading ? (
            <p>Loading pets...</p>
        ) : pets.length === 0 ? (
            <p>No pets added yet.</p>
        ) : (
            <div className="two-column-grid">
            {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
            ))}
            </div>
        )}
        </div>
    );
}