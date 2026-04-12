export default function ReminderItem({ reminder }) {
    return (
        <div className="card">
        <h3 className="card-title">{reminder.type}</h3>
        <p><strong>Pet:</strong> {reminder.petName}</p>
        <p><strong>Date:</strong> {reminder.date}</p>
        <p><strong>Time:</strong> {reminder.time}</p>
        <p><strong>Details:</strong> {reminder.description}</p>
        <p>
            <strong>Status:</strong> {reminder.completed ? "Completed" : "Pending"}
        </p>
        </div>
    );
}