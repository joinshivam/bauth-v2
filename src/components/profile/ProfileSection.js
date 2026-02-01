import { useScreenMode } from "../../utils/Functions/resizer";
export default function Section({ title, description, children }) {
  const mode = useScreenMode();
  const isMobile = mode === "mobile";
  return (
    <section className={`bg-[var(--theme)] rounded-xl border border-[var(--border)] shadow-sm shadow-[var(--border)] ${isMobile ? "p-3" : "p-6"}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--gray-800)]">{title}</h3>
        <p className="text-sm text-[var(--gray-500)]">{description}</p>
      </div>

      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}
