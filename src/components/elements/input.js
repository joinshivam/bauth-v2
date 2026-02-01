import DotBounce from "../loader/dotBounce"
const InputElement = ({ field = { type: "text", name: "inputfield", value: "", options: {} }, focus = true, label = "Input Field", handleChange, error, success, fixer, setFocus, setBlur, loader = false }) => {
    if (!field?.value || field?.value === "") loader = false;
    return (
        <>
            <div>
                <div className="floating-field">
                    <input
                        type={field?.type}
                        name={field?.name}
                        autoFocus={focus}
                        value={field.value}
                        onChange={(e) => handleChange?.(e.target.value)}
                        placeholder=" "
                        onFocus={(e) => { setFocus?.(e) }}
                        onBlur={(e) => { setBlur?.(e) }}
                        className="floating-input border-[var(--gray-400)] outline-[var(--blue-600)] text-[var(--gray-700)]"
                        {...field.options}
                        disabled={loader}
                    />
                    <label className="floating-label text-[var(--theme)]">{label}</label>
                    {loader && (<div className="bg-[var[--theme]] absolute min-w-fit -translate-y-1/2 top-1/2 right-5"><DotBounce size={6} bounce={8} /></div>)}
                </div>
                {error && !success && <div className="text-red-400">{error}</div>}
                {success && !error && <div className="text-green-400">{success}</div>}
                {fixer}
            </div>
        </>
    )
}

export default InputElement;