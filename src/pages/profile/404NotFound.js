import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-[var(--gray-100)]">
            <h1 className="text-6xl font-bold text-[var(--indigo-600)] mb-4">Unknown Route</h1>
            <p className="text-2xl mb-6">Oops! Page not found</p>
            <Link
                to="/profile"
                className="px-6 py-3 bg-[var(--indigo-600)] text-[var(--theme)] rounded-lg shadow-lg hover:bg-[var(--indigo-700)] transition"
            >
                Navigate to Dashboard
            </Link>
        </div>
    );
};

export default NotFoundPage;
