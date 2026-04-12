export default function PetCard({ pet }) {
    return (
        <div className="card">
        <h2 className="card-title">{pet.name}</h2>
        <p><strong>Type:</strong> {pet.type}</p>
        <p><strong>Breed:</strong> {pet.breed}</p>
        <p><strong>Age:</strong> {pet.age}</p>
        <p><strong>Notes:</strong> {pet.notes}</p>
        </div>
    );
}