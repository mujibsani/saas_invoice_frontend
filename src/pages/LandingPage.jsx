import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 text-white">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center space-y-6 p-4 md:p-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          Streamline Your Invoicing & Expenses
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
          Manage your invoices and expenses with ease using our SaaS solution. Simplify your business operations today.
        </p>
        <div className="space-x-4 mt-6">
          <a
            href="/register"
            className="bg-transparent border-2 border-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition"
          >
            Register Now
          </a>
          <a
            href="/dashboard"
            className="bg-transparent border-2 border-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition"
          >
            Login
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-indigo-50 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Easy Invoicing</h3>
              <p className="text-lg">
                Create, manage, and track invoices effortlessly with our intuitive interface.
              </p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Expense Tracking</h3>
              <p className="text-lg">
                Keep a close eye on your business expenses and manage your finances like a pro.
              </p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Analytics Dashboard</h3>
              <p className="text-lg">
                Get insights into your finances with powerful, customizable charts and reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-teal-500">
            Pricing Plans
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-indigo-600 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Basic</h3>
              <p className="text-xl mb-4">$19/month</p>
              <ul className="text-lg mb-4">
                <li>Unlimited invoices</li>
                <li>Basic analytics</li>
                <li>Customer support</li>
              </ul>
              <button className="bg-white text-indigo-900 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-indigo-100 transition">
                Choose Plan
              </button>
            </div>
            <div className="bg-teal-600 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Pro</h3>
              <p className="text-xl mb-4">$49/month</p>
              <ul className="text-lg mb-4">
                <li>Everything in Basic</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
              </ul>
              <button className="bg-white text-teal-900 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-teal-100 transition">
                Choose Plan
              </button>
            </div>
            <div className="bg-indigo-700 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
              <p className="text-xl mb-4">$99/month</p>
              <ul className="text-lg mb-4">
                <li>Everything in Pro</li>
                <li>Custom integrations</li>
                <li>Dedicated account manager</li>
              </ul>
              <button className="bg-white text-indigo-900 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-indigo-100 transition">
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8">
            Join thousands of businesses already using our platform to simplify their invoicing and expense management.
          </p>
          <a
            href="/register"
            className="bg-white text-gray-900 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Create Your Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
