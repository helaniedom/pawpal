"use client";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PetCard({ pet, onDelete, onEdit }) {
    async function handleDelete() {
        const confirmed = window.confirm(`Delete ${pet.name}'s profile?`);
        if (!confirmed) return;

        try {
            await deleteDoc(doc(db, "pets", pet.id));
            if (onDelete) onDelete(pet.id);
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    }

    return (
        <div className="card">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                <img
                    src={pet.imageUrl || "/paw.png"}
                    alt="pet"
                    style={{
                        width: "180px",
                        height: "180px",
                        borderRadius: "20%",
                        objectFit: "contain",
                        border: "2px solid #fbcfe8"
                    }}
                />
            </div>

            <h2 className="card-title" style={{ textAlign: "center" }}>
                {pet.name}
            </h2>

            <p><strong>Type:</strong> {pet.type}</p>
            <p><strong>Breed:</strong> {pet.breed}</p>
            <p><strong>Age:</strong> {pet.age}</p>
            <p><strong>Notes:</strong> {pet.notes}</p>

            <div className="card-actions">
                {onEdit && (
                    <button onClick={() => onEdit(pet)} className="edit-button">
                        Edit
                    </button>
                )}

                <button onClick={handleDelete} className="danger-button">
                    Delete
                </button>
            </div>
        </div>
    );
}