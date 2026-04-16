"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import PetCard from "@/components/PetCard";
import ReminderList from "@/components/ReminderList";

export default function HomePage() {
    const [pets, setPets] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [randomGreeting, setRandomGreeting] = useState("");

    const greetings = [
        "Welcome back, human. We demand snacks.",
        "Welcome, trusted food provider.",
        "Hello human. You may pet us now.",
        "Welcome back. We’ve been judging you.",
        "Greetings, caretaker. The pets are watching.",
        "Welcome back, servant of the pets.",
        "Hello human. Your shift has started.",
        "You’re late. We noticed.",
        "Welcome back. Food first, questions later.",
        "The council of pets has convened."
    ];

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    function sortRemindersByDate(reminderList) {
        return [...reminderList].sort((a, b) => {
            const aDateTime = new Date(`${a.date}T${a.time}`);
            const bDateTime = new Date(`${b.date}T${b.time}`);
            return aDateTime - bDateTime;
        });
    }

    useEffect(() => {
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        setRandomGreeting(greeting);

        const petsQuery = query(
            collection(db, "pets"),
            orderBy("createdAt", "desc"),
            limit(4)
        );

        const remindersQuery = query(collection(db, "reminders"));

        let petsLoaded = false;
        let remindersLoaded = false;

        const unsubscribePets = onSnapshot(
            petsQuery,
            (petsSnapshot) => {
                const petData = petsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setPets(petData);
                petsLoaded = true;

                if (petsLoaded && remindersLoaded) {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Error fetching pets:", error);
                petsLoaded = true;

                if (petsLoaded && remindersLoaded) {
                    setLoading(false);
                }
            }
        );

        const unsubscribeReminders = onSnapshot(
            remindersQuery,
            (remindersSnapshot) => {
                const reminderData = remindersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    petName: doc.data().petName || "Unknown Pet",
                }));

                const sortedReminders = sortRemindersByDate(reminderData).slice(0, 5);

                setReminders(sortedReminders);
                remindersLoaded = true;

                if (petsLoaded && remindersLoaded) {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Error fetching reminders:", error);
                remindersLoaded = true;

                if (petsLoaded && remindersLoaded) {
                    setLoading(false);
                }
            }
        );

        return () => {
            unsubscribePets();
            unsubscribeReminders();
        };
    }, []);

    function handleToggleComplete(id, newStatus) {
        setReminders((prev) =>
            sortRemindersByDate(
                prev.map((reminder) =>
                    reminder.id === id ? { ...reminder, completed: newStatus } : reminder
                )
            )
        );
    }

    return (
        <div>
            <div className="section-block">
                <h1 className="page-title">{randomGreeting || "Welcome back, human."}</h1>
                <p className="page-text">{today}</p>
                <p className="page-text">
                    Manage your pets and stay on top of important reminders.
                </p>
            </div>

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
                            <ReminderList
                                reminders={reminders}
                                onToggleComplete={handleToggleComplete}
                            />
                        )}
                    </section>
                </>
            )}
        </div>
    );
}