import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Users, ImageIcon, FileText, Download, Calendar, TrendingUp
} from 'lucide-react';
import axios from 'axios';

// ✅ PDF IMPORTS
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminDashboard() {

  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [dashboard, setDashboard] = useState(null);

  // ===============================
  // 📌 DATE HANDLER
  // ===============================
  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  // ===============================
  // 📌 API CALL
  // ===============================
  useEffect(() => {

    const fetchData = async () => {
      try {

        const url = dateFilter
          ? `http://localhost:8080/admin/dashboard?date=${dateFilter}`
          : `http://localhost:8080/admin/dashboard`;

        const res = await axios.get(url);

        setDashboard(res.data);

        console.log(res.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

  }, [dateFilter]);

  // ===============================
  // 📌 DATE FORMAT
  // ===============================
  const formatIndianDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // ===============================
  // 📌 PDF DOWNLOAD (ADDED ONLY)
  // ===============================
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Background
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, 210, 297, "F");

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Admin Dashboard Report", 14, 16);

    // Date
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString("en-IN")}`,
      14,
      35
    );

    // Summary
    doc.setFontSize(12);
    doc.text(`Total Users: ${dashboard?.stats?.totalUsers || 0}`, 14, 50);
    doc.text(`Image Requests: ${dashboard?.stats?.totalImageRequests || 0}`, 14, 58);
    doc.text(`Resume Analysis: ${dashboard?.stats?.totalResumeAnalysis || 0}`, 14, 66);
    doc.text(`Text Chats: ${dashboard?.stats?.totalTextChats || 0}`, 14, 74);

    // Table data
    const rows =
      dashboard?.users?.map((user) => [
        user.userId,
        user.fullName,
        user.email,
        formatIndianDate(user.createdAt),
      ]) || [];

    autoTable(doc, {
      startY: 85,
      head: [["User ID", "Name", "Email", "Joining Date"]],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [37, 99, 235],
      },
    });

    doc.save("admin-report.pdf");
  };

  // ===============================
  // 📌 CARDS
  // ===============================
  const cardsData = [
    {
      title: 'Total Users',
      value: dashboard?.stats?.totalUsers || 0,
      icon: Users,
      bgColor: 'bg-[#a6ade3]',
      iconBg: 'bg-[#4536cd]'
    },
    {
      title: 'Image Requests',
      value: dashboard?.stats?.totalImageRequests || 0,
      icon: ImageIcon,
      bgColor: 'bg-[#95c5f7]',
      iconBg: 'bg-[#0b65d8]'
    },
    {
      title: 'Resume Analysis',
      value: dashboard?.stats?.totalResumeAnalysis || 0,
      icon: FileText,
      bgColor: 'bg-[#f0aab5]',
      iconBg: 'bg-[#cd1741]'
    },
    {
      title: 'Text Chats',
      value: dashboard?.stats?.totalTextChats || 0,
      icon: TrendingUp,
      bgColor: 'bg-[#e6a877]',
      iconBg: 'bg-[#8b4d13]'
    }
  ];

  // ===============================
  // 📌 GRAPH
  // ===============================
  const chartData = [
    {
      name: 'Image Gen',
      value: dashboard?.forGraph?.imageRequests || 0,
      fill: '#fbe2e2'
    },
    {
      name: 'Resume Analyzer',
      value: dashboard?.forGraph?.resumeAnalysis || 0,
      fill: '#c2cbf5'
    },
    {
      name: 'Text Gen',
      value: dashboard?.forGraph?.textChats || 0,
      fill: '#dbe888'
    }
  ];

  return (
    <div className="space-y-6">

      <h1 className='text-xl font-semibold mb-8 bg-blue-600 text-white inline-block px-2 py-1 rounded-md'>
        Main Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardsData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`${card.bgColor} rounded-md p-6 shadow-sm flex items-center justify-between`}>
              <div className="flex flex-col">
                <div className="text-lg font-medium text-white mb-2">{card.title}</div>
                <div className="text-3xl font-normal text-white">{card.value}</div>
              </div>
              <div className={`${card.iconBg} rounded-md p-2 shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* GRAPH */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Feature Usage</h3>

          <div className="flex gap-4">

            <div className="relative">
              <input
                type="date"
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                value={dateFilter}
                onChange={handleDateChange}
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>

          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={70}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[15, 15, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="text-lg font-semibold text-gray-800">User Data</h3>

          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-[#f0f9ff] text-gray-600 text-sm border-b border-blue-100">
                <th className="py-4 px-6 font-medium">User ID</th>
                <th className="py-4 px-6 font-medium">Name</th>
                <th className="py-4 px-6 font-medium">Email ID</th>
                <th className="py-4 px-6 font-medium">Joining Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">

              {dashboard?.users?.map((user) => (
                <tr key={user.userId} className="hover:bg-blue-50/30 transition">

                  <td className="py-4 px-6 text-gray-500">{user.userId}</td>
                  <td className="py-4 px-6 font-medium text-gray-800">{user.fullName}</td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {formatIndianDate(user.createdAt)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}
