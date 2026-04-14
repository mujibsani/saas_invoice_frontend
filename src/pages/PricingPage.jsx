import React from "react";

const PricingPage = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 text-white min-h-screen">
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold mb-8">Choose the Best Plan for Your Business</h1>
        <p className="text-xl max-w-3xl mx-auto mb-12">
          Whether you're a small business or an enterprise, we have a plan that fits your needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
          <div className="bg-teal-400 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">Basic Plan</h3>
            <p className="text-lg mb-4">$19/month</p>
            <ul className="text-lg text-left mb-6">
              <li>Manage up to 50 invoices</li>
              <li>Expense tracking</li>
              <li>1 User Account</li>
            </ul>
            <a
              href="/register"
              className="bg-transparent border-2 border-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-900 transition"
            >
              Sign Up
            </a>
          </div>
          <div className="bg-blue-400 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl  font-semibold mb-4">Standard Plan</h3>
            <p className="text-lg mb-4">$49/month</p>
            <ul className="text-lg text-left mb-6">
              <li>Manage up to 200 invoices</li>
              <li>Expense tracking</li>
              <li>2 User Accounts</li>
              <li>Advanced Analytics</li>
            </ul>
            <a
              href="/register"
              className="bg-transparent border-2 border-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-900 transition"
            >
              Sign Up
            </a>
          </div>
          <div className="bg-indigo-400 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">Premium Plan</h3>
            <p className="text-lg mb-4">$99/month</p>
            <ul className="text-lg text-left mb-6">
              <li>Unlimited invoices</li>
              <li>Expense tracking</li>
              <li>Unlimited User Accounts</li>
              <li>Advanced Analytics & Reporting</li>
            </ul>
            <a
              href="/register"
              className="bg-transparent border-2 border-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-900 transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
