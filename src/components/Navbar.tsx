import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-1 rounded-xl transition
        ${pathname === to ? "bg-white/20" : "hover:bg-white/10"}`}
    >
      {label}
    </Link>
  );
  return (
    <nav className="flex justify-between items-center p-4 bg-pink-500 text-white shadow-lg sticky top-0 z-50">
      <h1 className="text-xl font-bold">🎂 Birthday Surprise</h1>
      <div className="space-x-2">
        {link("/", "Home")}
        {link("/surprise", "Surprise")}
        {link("/closing", "Closing")}
      </div>
    </nav>
  );
}
