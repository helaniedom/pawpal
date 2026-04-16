import Link from "next/link";

export default function Navbar() {
    return (
        <nav>
            <div className="nav-container">
                <Link href="/" className="brand-wrap">
                    <img src="/pawpal.png" alt="PawPal logo" className="brand-icon" />
                    <span className="logo">PawPal</span>
                </Link>

                <div className="nav-links">
                    <Link href="/">Dashboard</Link>
                    <Link href="/pets">Pets</Link>
                    <Link href="/schedule">Schedule</Link>
                    <Link href="/add-pet">Add Pet</Link>
                    <Link href="/add-reminder">Add Reminder</Link>
                </div>
            </div>
        </nav>
    );
}