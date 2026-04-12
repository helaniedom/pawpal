import { mockPets, mockReminders } from "@/lib/data";
import PetCard from "@/components/PetCard";
import ReminderList from "@/components/ReminderList";

export default function HomePage() {
    return (
        <div>
        <h1 className="page-title">PawPal Dashboard</h1>
        <p className="page-text">
            Manage your pets and stay on top of important reminders.
        </p>

        <section style={{ marginBottom: "32px" }}>
            <h2>Pet Overview</h2>
            <div className="two-column-grid">
            {mockPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
            ))}
            </div>
        </section>

        <section>
            <h2>Upcoming Reminders</h2>
            <ReminderList reminders={mockReminders} />
        </section>
        </div>
    );
}