import './loader.css'
const DotBounce = ({
    size = 8,
    color = "#3b82f6",
    speed = 0.6,
    gap = 6,
    bounce = 25
}) => {
    return (
        <div className="checking-loader" style={{
            gap: `${gap}px`,
            ["--loader-size"]: `${size}px`,
            ["--loader-color"]: color,
            ["--loader-speed"]: `${speed}s`,
            ["--loader-bounce"]: `${bounce}px`,
        }}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}

export default DotBounce;