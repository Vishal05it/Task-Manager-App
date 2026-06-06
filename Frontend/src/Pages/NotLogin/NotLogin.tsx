import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

export default function NotLogin() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md border p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <Lock size={48} className="text-gray-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Restricted
        </h1>

        <p className="text-gray-600 mb-6">
          You need to login to view this page and manage your tasks.
        </p>

        <Link
          to="/login"
          className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
