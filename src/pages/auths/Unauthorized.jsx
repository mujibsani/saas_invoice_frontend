const Unauthorized = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-3xl font-bold text-red-500 mb-4">🚫 Access Denied</h2>
                <p className="text-gray-600">You do not have permission to access this page.</p>
                <a href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Go Home
                </a>
            </div>
        </div>
    );
};

export default Unauthorized;
