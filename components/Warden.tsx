"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

interface HostelSubmission {
  id: number;
  submit: boolean;
  returned: boolean;
  comeoutTime: string | null;
  comeinTime: string | null;
  photo: string;
  hostel: {
    name: string;
    email: string;
  };
}

export default function WatchmanPage() {
  const [submissions, setSubmissions] = useState<HostelSubmission[]>([]);
  const [scannedStudent, setScannedStudent] = useState<HostelSubmission | null>(null);

  // filters
  const [emailFilter, setEmailFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get("/api/hostel/create");
      const filtered = response.data.filter(
        (s: HostelSubmission) => s.submit && !s.returned
      );
      setSubmissions(filtered);
    } catch (error) {
      toast.error("Failed to fetch hostel submissions.");
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleOut = async (id: number) => {
    try {
      await axios.patch(`/api/hostel/${id}`, { comeoutTime: new Date() });
      toast.success("Come Out Time marked");
      fetchSubmissions();
    } catch {
      toast.error("Failed to mark Come Out Time");
    }
  };

  const handleReturn = async (id: number) => {
    try {
      await axios.patch(`/api/hostel/${id}`, {
        comeinTime: new Date(),
        returned: true,
      });
      toast.success("Student Returned");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (scannedStudent?.id === id) setScannedStudent(null);
    } catch {
      toast.error("Failed to mark return");
    }
  };

  // ---- Apply filters locally ----
  const filteredSubmissions = submissions.filter((s) => {
    // Email filter
    if (emailFilter && !s.hostel.email.toLowerCase().includes(emailFilter.toLowerCase())) {
      return false;
    }

    // Date filter
    if (fromDate) {
      const from = new Date(fromDate);
      const outTime = s.comeoutTime ? new Date(s.comeoutTime) : null;
      if (!outTime || outTime < from) return false;
    }
    if (toDate) {
      const to = new Date(toDate);
      const outTime = s.comeoutTime ? new Date(s.comeoutTime) : null;
      if (!outTime || outTime > to) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-100 py-6 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#9a3310]">
        Watchman Panel - Submitted Only
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 justify-center mb-6">
        <input
          type="email"
          placeholder="Search by email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* QR Scanner */}
      <div className="max-w-md mx-auto mb-6">
        <QrReader
          delay={300}
          onError={() => toast.error("QR Scan failed")}
          onScan={(data) => {
            if (data) {
              const found = submissions.find((s) => s.hostel.email === data);
              if (found) {
                setScannedStudent(found);
              } else {
                toast.error("No student found for scanned QR");
              }
            }
          }}
          style={{ width: "100%" }}
        />
      </div>

      {/* Scanned student */}
      {scannedStudent && (
        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4 max-w-md mx-auto mb-6">
          <img
            src={scannedStudent.photo || "/default-profile.png"}
            alt={scannedStudent.hostel.name}
            className="w-20 h-20 rounded-full object-cover border border-gray-300"
          />
          <div className="flex flex-col flex-1">
            <p className="text-lg font-semibold text-[#872e0e]">
              {scannedStudent.hostel.name}
            </p>
            <p className="text-gray-600 text-sm">{scannedStudent.hostel.email}</p>
            <button
              onClick={() => handleReturn(scannedStudent.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm mt-2"
            >
              Return
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-4 max-w-md mx-auto">
        {filteredSubmissions.length === 0 && (
          <p className="text-center text-gray-600">
            No submitted students to display
          </p>
        )}

        {filteredSubmissions.map((s) => (
          <div
            key={s.id}
            className="bg-white shadow-md rounded-2xl p-4 flex items-center gap-4"
          >
            <img
              src={s.photo || "/default-profile.png"}
              alt={s.hostel.name}
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />
            <div className="flex flex-col flex-1">
              <p className="text-lg font-semibold text-[#872e0e]">{s.hostel.name}</p>
              <p className="text-gray-600 text-sm">{s.hostel.email}</p>
              <div className="flex gap-3 flex-wrap">
                {s.comeoutTime ? (
                  <button
                    onClick={() => handleReturn(s.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                  >
                    Return
                  </button>
                ) : (
                  <button
                    onClick={() => handleOut(s.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
                  >
                    Out
                  </button>
                )}
                <span
                  className={`px-4 py-1 rounded text-sm font-semibold ${
                    s.returned
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  {s.returned ? "Returned" : "Pending Return"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
