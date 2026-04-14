import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Select, MenuItem } from "@mui/material";

const IncomeExpenseChart = () => {
  const [data, setData] = useState([]);
  const [yearlySummary, setYearlySummary] = useState({});
  const [selectedYear, setSelectedYear] = useState("all"); // ✅ Default: "All Years"
  const [selectedMonth, setSelectedMonth] = useState(""); // Default: All Months
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found.");

        const response = await axios.get(import.meta.env.VITE_API_URL +"/api/users/monthly-income-expense/", {
          params: { year: selectedYear === "all" ? undefined : selectedYear, month: selectedMonth || undefined },
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(response.data.monthly_report.map((item) => ({
          ...item,
          month: `Month ${item.month}`,
        })));

        setYearlySummary(response.data.yearly_summary);
      } catch (error) {
        console.error("🚨 Error fetching income/expense data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  return (
    <div className="w-full max-w-[700px] md:max-w-[900px] lg:max-w-[1100px] bg-white p-6 rounded-lg shadow flex flex-col">
      {/* ✅ Year & Month Dropdowns */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Monthly Income, Expense & Profit</h3>

        <div className="flex gap-4">
          {/* ✅ Year Dropdown with "All Years" Option */}
          <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} size="small">
            <MenuItem value="all">All Years</MenuItem>
            {[2023, 2024, 2025].map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>

          {/* Month Dropdown */}
          <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} size="small">
            <MenuItem value="">All Months</MenuItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <MenuItem key={month} value={month}>Month {month}</MenuItem>
            ))}
          </Select>
        </div>
      </div>

      {/* ✅ Line Chart with Net Profit */}
      <div className="h-[300px] md:h-[350px] lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#82ca9d" />
            <Line type="monotone" dataKey="expense" stroke="#ff4d4d" />
            <Line type="monotone" dataKey="net_profit" stroke="#007bff" />  {/* ✅ Profit Line */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
