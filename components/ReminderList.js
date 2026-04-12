import ReminderItem from "./ReminderItem";

export default function ReminderList({ reminders }) {
    return (
        <div className="grid-list">
        {reminders.map((reminder) => (
            <ReminderItem key={reminder.id} reminder={reminder} />
        ))}
        </div>
    );
}