"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type HostelSubmission = {
  id: number;
  reason: string;
  village: string;
  photo: string;
  submit: boolean;
  returned: boolean;
  createdAt: string;
  hostel: {
    name: string;
    email: string;
  };
};

export default function WardenHostelPage() {
  const [submissions, setSubmissions] = useState<HostelSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("/api/hostel/create");
      setSubmissions(res.data);
    } catch {
      toast.error("Failed to fetch hostel submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmit = async (id: number) => {
    try {
      await axios.put(`/api/hostel/${id}`, { submit: true });
      toast.success("Submission marked as true");
      fetchSubmissions();
    } catch {
      toast.error("Failed to submit");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">
        Hostel Submissions
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto border border-orange-300 rounded-lg">
          <table className="w-full text-left text-gray-700">
            <thead className="bg-orange-100 text-orange-600 text-sm uppercase">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Village</th>
                <th className="px-4 py-2">Photo</th>
                <th className="px-4 py-2">Submit</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr
                  key={s.id}
                  className="border-t bg-white hover:bg-orange-50 transition"
                >
                  <td className="px-4 py-2">{s.hostel.name}</td>
                  <td className="px-4 py-2">{s.hostel.email}</td>
                  <td className="px-4 py-2">{s.reason}</td>
                  <td className="px-4 py-2">{s.village}</td>
                  <td className="px-4 py-2">
                    <img
                      src={s.photo}
                      alt="photo"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-2">
                    {s.submit ? (
                      <span className="text-green-600 font-semibold">Submitted</span>
                    ) : (
                      <button
                        onClick={() => handleSubmit(s.id)}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                      >
                        Submit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
