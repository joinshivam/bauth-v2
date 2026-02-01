import { useNotify } from "../../context/notifyContext"
import Notify from "./Notify";

const NotifyContainer = () => {
    const { notifications, remove } = useNotify();
    if (!notifications.length) return null;
    return (
        <div className="notify-container">
            {notifications.map(n => (
                <Notify
                    key={n.id}
                    {...n}
                    onClose={() => remove(n.id)}
                />
            ))}
        </div>
    )
}


export default NotifyContainer;