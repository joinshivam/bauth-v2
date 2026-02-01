import { useEffect, useState } from "react";
import { FanIcon } from "lucide-react";
const Toggler = ({ Toggle = false, c }) => {
    const [toggle, setToggle] = useState(Toggle);
    const [spin, setSpin] = useState(true);
    useEffect(() => {
        handleToggle(Toggle);
    }, [Toggle])

    const handleToggle = (t) => {
        setSpin(true);
        setToggle(t ? t : prev => !prev);
        setTimeout(() => setSpin(false), 150);
    };
    return (
        <div className={`${c} cursor-pointer`} onClick={handleToggle}>
            <div className="bg-[var(--theme)] border rounded-full p-2 shadow">
                <div className={`transition-transform duration-300 ${spin ? (toggle ? "-rotate-180" : "rotate-180") : ""}`}>
                    <FanIcon />
                </div>
            </div>
        </div>
    )
}

export default Toggler;