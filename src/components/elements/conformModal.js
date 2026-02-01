
import { X } from "lucide-react";
import { useState } from "react";
import { useScreenMode } from "../../utils/Functions/resizer";
import DotBounce from "../loader/dotBounce";
export default function ConformModal({ error = null, fixer = null, Title, onClose, onConform }) {
    const [loader, setLoader] = useState(false);
    return (
        <div className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 ${useScreenMode() === "mobile" ? "px-6" : ""}`}>
            <div className="bg-[var(--theme)] shadow-inner shadow-[var(--gray-500)] rounded-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-[var(--gray-500)] hover:text-[var(--gray-800)]"
                >
                    <X size={18} />
                </button>

                <h3 className="text-lg font-semibold text-[var(--gray-800)] mb-4">
                    {Title}
                </h3>

                {error && (
                    <div className="text-red-400">{error}</div>
                )}
                {fixer && (
                    <div className="text-blue-400">{fixer}</div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            if (typeof onClose !== "function") return;
                            setLoader(false)
                            onClose();
                        }}
                        className="px-4 py-2 text-green-500 text-sm rounded-lg border border-[var(--theme)]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setLoader(true);
                            onConform()
                            setLoader(false)
                        }}
                        className="px-4 py-2 text-sm rounded-lg bg-[var(--gray-100)] text-red-600"                    >
                        {loader ? <DotBounce /> : "Conform"}
                    </button>
                </div>
            </div>
        </div>

    )
}