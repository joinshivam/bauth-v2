
import { X } from "lucide-react";
import { useState } from "react";
import Input from "./input";
export default function EditModal({ name = "text",parentClose = ()=>{}, value = "", label = "Enter Input Here", options = {}, error, fixer, Title, onClose, onSave }) {
    const [input, setInput] = useState(value);
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-[var(--theme)] rounded-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-[var(--gray-500)] hover:text-[var(--gray-800)]"
                >
                    <X size={18} />
                </button>

                <h3 className="text-lg font-semibold text-[var(--gray-800)] mb-4">
                    {Title}
                </h3>

                <Input
                    field={
                        {
                            name: name,
                            value: input,
                            ...options
                        }
                    }
                    label={label}
                    handleChange={(value) => {
                        setInput(value);
                    }}
                    error={error}
                    fixer={fixer}
                    setBlur={(e)=>{
                      if(e.relatedTarget) return;
                       parentClose();
                    }}
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            if (typeof onClose !== "function") return;
                            onClose()
                            setInput("");
                        }}
                        className="px-4 py-2 text-sm rounded-lg border border-[var(--theme)]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 text-sm rounded-lg bg-[var(--blue-600)] text-[var(--theme)]"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>

    )
}