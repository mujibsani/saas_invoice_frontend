import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const InvoiceStatusChart = ({ paidInvoices, pendingInvoices, overdueInvoices }) => {
  // ✅ UseMemo prevents unnecessary re-renders
  const chartData = useMemo(() => ({
    labels: ["Paid", "Pending", "Overdue"],
    datasets: [
      {
        data: [paidInvoices, pendingInvoices, overdueInvoices],
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
      },
    ],
  }), [paidInvoices, pendingInvoices, overdueInvoices]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false, // ✅ Allows resizing
    layout: {
      padding: 5, // ✅ Reduced padding inside the chart
    },
  }), []);

  return (
    <div className="w-full max-w-[700px] md:max-w-[800px] lg:max-w-[900px] h-[450px] md:h-[500px] lg:h-[550px] bg-white p-6 md:p-8 rounded-lg shadow flex flex-col justify-center items-center">
      <h3 className="text-lg font-bold mb-6">Invoice Status Breakdown</h3>
      {paidInvoices + pendingInvoices + overdueInvoices === 0 ? (
        <p className="text-center text-gray-500">No data available.</p>
      ) : (
        <div className="w-[95%] h-[95%] flex justify-center items-center">
          <div className="w-full h-[400px] md:h-[450px] lg:h-[500px]">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceStatusChart;
