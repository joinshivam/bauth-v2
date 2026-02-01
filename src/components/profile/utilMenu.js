import { NavLink } from "react-router-dom";

function SidebarUtility({ collapsed }) {
    return (
        <div className="relative mt-4">
            <div className={`absolute bottom-full border-t-2 border-b-2 border-[var(--border)] flex z-50 w-fit ${collapsed ? "gap-5 py-2 -right-[13.3rem]" : "text-[9px] gap-[2px] -right-[4rem] py-0"} `}
            >
                <NavLink to="/privacy" className="text-[var(--gray-600)]">
                    Privacy
                </NavLink>
                <NavLink to="/terms" className="text-[var(--gray-600)]">
                    Terms
                </NavLink>
                <NavLink to="/about" className="text-[var(--gray-600)]">
                    About
                </NavLink>
            </div>
        </div>
    );
}
export default SidebarUtility;
