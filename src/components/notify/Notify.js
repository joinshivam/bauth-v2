const Notify = ({
    title,
    message,
    type = "info",
    duration,
    progressBar = true,
    onClose,
    closing
}) => {
    if (typeof onClose !== "function") return null;

    const style = NOTIFY_TYPES[type] || NOTIFY_TYPES.info;
    return (
        <div className={`notify ${closing ? "closing" : ""}`}
            style={{
                background: style.bg,
                color: style.color
            }}
        >
            <div className="notify-body">
                {title && <div className="title" style={{
                    color: style.color,
                }}>{title}</div>}
                <div className="message" style={{
                    color: style.color,
                }}>{message}</div>
                <div className="close" onClick={onClose} style={{
                    color: style.color,
                }}>&times;</div>
            </div>

            {(progressBar === true || duration > 0) && (
                <div className="progress">
                    <div
                        className="progress-style"
                        style={{
                            background: style.progress,
                            animationDuration: `${duration ?? ""}ms`
                        }}
                    />
                </div>
            )}
        </div>
    );
};

const NOTIFY_TYPES = {
    info: {
        bg: "#c0ecffff",
        color: "#0f4e68ff",
        progress: "#0f4e68ff"
    },
    success: {
        bg: "#d1fae5",
        color: "#065f46",
        progress: "#059669"
    },
    danger: {
        bg: "#fee2e2",
        color: "#7f1d1d",
        progress: "#dc2626"
    },
    warn: {
        bg: "#fef3c7",
        color: "#92400e",
        progress: "#f59e0b"
    },
    off: {
        bg: "#e5e7eb",
        color: "#374151",
        progress: "#6b7280"
    },
    blackWhite: {
        bg: "#111",
        color: "#fff",
        progress: "#fff"
    }
};



export default Notify;