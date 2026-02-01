import {Link } from "react-router-dom";
const ERROR500 = () => {
    return (
        <div className="fixed top-0 z-999 opacity-75 flex w-screen h-screen px-12 flex-col items-center justify-center min-h-[60vh] text-center bg-gray-100">
            <h1 className="text-6xl font-bold text-pinkOrangeBrand mb-4">Server Crash, 500 Internal Error</h1>
            <p className="text-2xl mb-6 text-pinkOrangeBrand">There is a Server Error</p>
            <Link
                to="/serverError"
                className="px-6 py-3 bg-pinkOrangeBrand text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
            >
                Refresh
            </Link>
        </div>
    );
};

export default ERROR500;
