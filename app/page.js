"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import PetCard from "@/components/PetCard";
import ReminderList from "@/components/ReminderList";

export default function HomePage() {
    const [pets, setPets] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const petsQuery = query(
                    collection(db, "pets"),
                    orderBy("createdAt", "desc"),
                    limit(4)
                );

                const remindersQuery = query(
                    collection(db, "reminders"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );

                const [petsSnapshot, remindersSnapshot] = await Promise.all([
                    getDocs(petsQuery),
                    getDocs(remindersQuery),
                ]);

                const petData = petsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const reminderData = remindersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setPets(petData);
                setReminders(reminderData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    return (
        <div>
            <h1 className="page-title">PawPal Dashboard</h1>
            <p className="page-text">
                Manage your pets and stay on top of important reminders.
            </p>

            {loading ? (
                <p>Loading dashboard...</p>
            ) : (
                <>
                    <section style={{ marginBottom: "32px" }}>
                        <h2>Pet Overview</h2>
                        {pets.length === 0 ? (
                            <p>No pets added yet.</p>
                        ) : (
                            <div className="two-column-grid">
                                {pets.map((pet) => (
                                    <PetCard key={pet.id} pet={pet} />
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2>Upcoming Reminders</h2>
                        {reminders.length === 0 ? (
                            <p>No reminders added yet.</p>
                        ) : (
                            <ReminderList reminders={reminders} />
                        )}
                    </section>
                </>
            )}
        </div>
    );
}