import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
    return (<nav className="navbar w-screen bg-background fixed top-0 z-50 px-4 py-2 shadow-md flex items-center justify-between">
    {/* Navbar content goes here */}
        <div className="logo">
            <span className="text-2xl font-bold text-foreground text-orbitron ml-5">Name</span>
        </div>
            <ThemeToggle className="mr-4" />
    </nav>)};