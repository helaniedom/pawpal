import { mockPets } from "@/lib/data";
import PetCard from "@/components/PetCard";

export default function PetsPage() {
    return (
        <div>
        <h1 className="page-title">My Pets</h1>
        <p className="page-text">View all pet profiles in one place.</p>

        <div className="two-column-grid">
            {mockPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
            ))}
        </div>
        </div>
    );
}