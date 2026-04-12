import { mockReminders } from "@/lib/data";
import ReminderList from "@/components/ReminderList";

export default function SchedulePage() {
    return (
        <div>
        <h1 className="page-title">Schedule</h1>
        <p className="page-text">Track all upcoming pet care reminders.</p>

        <ReminderList reminders={mockReminders} />
        </div>
    );
}