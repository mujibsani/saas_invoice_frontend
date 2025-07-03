import React from "react";

const FeaturesPage = () => {
  return (
    <div className="bg-lightBlue-50 text-lightBlue-900 min-h-screen">
      <section className="py-16 text-center">
        <h1 className="text-5xl font-bold mb-8">Our Key Features</h1>
        <p className="text-xl max-w-3xl mx-auto mb-12">
          Explore the features that make our platform the best solution for managing your invoices and expenses.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Effortless Invoicing</h3>
            <p className="text-lg">
              Easily create and manage invoices, track payments, and send reminders to clients with just a few clicks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Expense Management</h3>
            <p className="text-lg">
              Stay on top of your business expenses with a simple and intuitive tracking system.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Advanced Analytics</h3>
            <p className="text-lg">
              Make data-driven decisions with detailed reports and analytics on your financial health.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Multi-Currency Support</h3>
            <p className="text-lg">
              Manage invoices and expenses in different currencies to suit your global business needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Cloud Storage</h3>
            <p className="text-lg">
              All your data is securely stored in the cloud, giving you access from anywhere at any time.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Customizable Templates</h3>
            <p className="text-lg">
              Choose from a range of templates to customize your invoices and expenses according to your brand.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
