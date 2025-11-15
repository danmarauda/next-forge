import type { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🏢 ARA Group Platform
          </h1>
          <p className="text-gray-600 mb-6">Here for you. Here for good.</p>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Platform Status
              </h2>
              <p className="text-green-700">
                ✅ Production Ready Infrastructure
              </p>
              <p className="text-green-700">
                ✅ WorkOS Authentication Configured
              </p>
              <p className="text-green-700">✅ 11 ARA Organizations Ready</p>
              <p className="text-green-700">✅ Multi-tenant Architecture</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Visual Testing Mode
              </h2>
              <p className="text-blue-700">
                This is a simplified version for visual testing.
              </p>
              <p className="text-blue-700">
                Full Convex integration temporarily disabled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
