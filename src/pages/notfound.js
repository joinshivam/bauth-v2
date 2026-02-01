import { Link, useLocation } from "react-router-dom";

const NotFoundPage = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center min-h-screen text-center bg-gray-100">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404 Invalid Page</h1>
      <p className="text-2xl mb-6">Oops! <b className="text-pinkOrangeBrand">{location.pathname}</b> Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
