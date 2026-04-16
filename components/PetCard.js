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
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "16px",
                    backgroundColor: "#fff7fb",
                    border: "1px solid #fbcfe8",
                    borderRadius: "18px",
                    padding: "18px"
                }}
            >
                <img
                    src={pet.imageUrl || "/paw.png"}
                    alt={pet.name || "pet"}
                    style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "contain"
                    }}
                />
            </div>

            <h2 className="card-title" style={{ textAlign: "center" }}>
                {pet.name}
            </h2>

            <p><strong>Type:</strong> {pet.type || "Not provided"}</p>
            <p><strong>Breed:</strong> {pet.breed || "Not provided"}</p>
            <p><strong>Age:</strong> {pet.age ?? "Not provided"}</p>
            <p><strong>Notes:</strong> {pet.notes || "No notes yet"}</p>

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