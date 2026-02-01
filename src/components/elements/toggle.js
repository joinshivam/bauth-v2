export default function Toggle({ enabled, onToggle }) {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={enabled}
                onChange={onToggle}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--gray-400)] peer-checked:bg-[var(--blue-600)] rounded-full transition" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-[var(--theme)] rounded-full shadow peer-checked:translate-x-5 transition-transform" />
        </label>
    );
}

