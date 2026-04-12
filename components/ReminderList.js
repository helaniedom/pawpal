import ReminderItem from "./ReminderItem";

export default function ReminderList({ reminders, onDelete, onToggleComplete, onEdit }) {
    return (
        <div className="grid-list">
        {reminders.map((reminder) => (
            <ReminderItem
            key={reminder.id}
            reminder={reminder}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            />
        ))}
        </div>
    );
    }