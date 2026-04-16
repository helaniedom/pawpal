"use client";

import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PetCard({ pet, onDelete, onEdit }) {
    const [feedingChecklist, setFeedingChecklist] = useState({
        am: false,
        pm: false,
    });

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

    function toggleChecklist(period) {
        setFeedingChecklist((prev) => ({
            ...prev,
            [period]: !prev[period],
        }));
    }

    function renderCheckbox(checked, onChange) {
        return (
            <label
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                    position: "relative"
                }}
            >
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    style={{
                        appearance: "none",
                        WebkitAppearance: "none",
                        width: "24px",
                        height: "24px",
                        border: "2px solid #f472b6",
                        borderRadius: "8px",
                        backgroundColor: checked ? "#ec4899" : "#fff7fb",
                        boxShadow: checked ? "0 0 0 3px rgba(244, 114, 182, 0.15)" : "none",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                />
                <span
                    style={{
                        position: "absolute",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "white",
                        pointerEvents: "none",
                        opacity: checked ? 1 : 0,
                        transform: checked ? "scale(1)" : "scale(0.8)",
                        transition: "all 0.2s ease",
                        lineHeight: 1
                    }}
                >
                    ✓
                </span>
            </label>
        );
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

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "24px",
                    flexWrap: "wrap"
                }}
            >
                <div style={{ flex: 1, minWidth: "220px" }}>
                    <p><strong>Type:</strong> {pet.type || "Not provided"}</p>
                    <p><strong>Breed:</strong> {pet.breed || "Not provided"}</p>
                    <p><strong>Age:</strong> {pet.age ?? "Not provided"}</p>
                    <p><strong>Notes:</strong> {pet.notes || "No notes yet"}</p>
                </div>

                <div
                    style={{
                        minWidth: "120px",
                        backgroundColor: "#fff7fb",
                        border: "1px solid #fbcfe8",
                        borderRadius: "16px",
                        padding: "14px 16px"
                    }}
                >
                    <h3
                        style={{
                            margin: "0 0 12px",
                            fontSize: "18px",
                            color: "#db2777"
                        }}
                    >
                        Today’s Feeding
                    </h3>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "12px",
                            marginBottom: "10px"
                        }}
                    >
                        <span style={{ fontWeight: "600", color: "#374151" }}>AM</span>
                        {renderCheckbox(feedingChecklist.am, () => toggleChecklist("am"))}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "12px"
                        }}
                    >
                        <span style={{ fontWeight: "600", color: "#374151" }}>PM</span>
                        {renderCheckbox(feedingChecklist.pm, () => toggleChecklist("pm"))}
                    </div>
                </div>
            </div>

            <div className="card-actions">
                {onEdit && (
                    <button onClick={() => onEdit(pet)} className="edit-button">
                        Edit
                    </button>
                )}

                {onDelete && (
                    <button onClick={handleDelete} className="danger-button">
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}