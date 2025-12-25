import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Navbar({user}) {
    const [isScrolled, setIsScrolled] = useState(false)
    
    const firstName = user?.name ? user.name.split(" ")[0] : "User"

    useEffect(() => {
        function handleScroll() {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`bg-fuchsia-50 fixed right-0 rounded-b-2xl left-0 z-10 ${isScrolled ? 'shadow-lg' : ''}`}>
            <div className="max-w-7xl w-[90%] mx-auto">
                <div className="flex justify-between h-16 items-center">
                    <div className="shrink-0 flex items-center">
                        <h1 className="text-2xl font-semibold text-fuchsia-400 tracking-tighter">MyNotes</h1>
                    </div>

                    <div className="flex items-center">
                        <span className="text-gray-700 text-sm font-medium mr-4">Hi, <span className="text-gray-900 font-semibold">{firstName}</span></span>
                        <Link to="/profile" className="hover:cursor-pointer text-fuchsia-400 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-fuchsia-100 transition">
                            Profile
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}