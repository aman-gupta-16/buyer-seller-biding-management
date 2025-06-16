// app/seller/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: string;
}

interface Bid {
  projectId: number;
  sellerName: string;
  bidAmount: number;
  estimatedTime: string;
  message: string;
}

export default function SellerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [formData, setFormData] = useState<{ [key: number]: Bid }>({});

  // Mock projects (replace with API later)
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: 1,
        title: "Build E-commerce Website",
        description: "Buyer needs a fully functional e-commerce platform.",
        budgetMin: 500,
        budgetMax: 1500,
        deadline: "2025-07-01",
        status: "PENDING",
      },
      {
        id: 2,
        title: "Mobile App for Food Delivery",
        description: "A buyer is looking for a cross-platform mobile app.",
        budgetMin: 1000,
        budgetMax: 3000,
        deadline: "2025-07-10",
        status: "PENDING",
      },
    ];

    setProjects(mockProjects);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, projectId: number) => {
    setFormData({
      ...formData,
      [projectId]: {
        ...formData[projectId],
        [e.target.name]: e.target.value,
        projectId: projectId,
      } as Bid,
    });
  };

  const handleSubmit = (e: React.FormEvent, projectId: number) => {
    e.preventDefault();

    if (!formData[projectId]?.sellerName || !formData[projectId]?.bidAmount || !formData[projectId]?.estimatedTime) {
      alert("Please fill all fields before submitting.");
      return;
    }

    setBids([...bids, formData[projectId]]);

    // Optionally clear form data for this project
    setFormData({ ...formData, [projectId]: { projectId, sellerName: '', bidAmount: 0, estimatedTime: '', message: '' } });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {projects.length === 0 ? (
        <p>No open projects right now.</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
            <p className="mb-2">{project.description}</p>
            <p className="mb-2">Budget: ${project.budgetMin} - ${project.budgetMax}</p>
            <p className="mb-2">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>

            <form onSubmit={(e) => handleSubmit(e, project.id)} className="mt-4 space-y-4">
              <div>
                <label className="block mb-1 font-medium">Your Name</label>
                <input
                  type="text"
                  name="sellerName"
                  value={formData[project.id]?.sellerName || ""}
                  onChange={(e) => handleChange(e, project.id)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Bid Amount ($)</label>
                <input
                  type="number"
                  name="bidAmount"
                  value={formData[project.id]?.bidAmount || ""}
                  onChange={(e) => handleChange(e, project.id)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Estimated Completion Time (days)</label>
                <input
                  type="text"
                  name="estimatedTime"
                  value={formData[project.id]?.estimatedTime || ""}
                  onChange={(e) => handleChange(e, project.id)}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Message</label>
                <textarea
                  name="message"
                  value={formData[project.id]?.message || ""}
                  onChange={(e) => handleChange(e, project.id)}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Place Bid
              </button>
            </form>
          </div>
        ))
      )}

      {/* Show Submitted Bids */}
      {bids.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Submitted Bids</h2>
          {bids.map((bid, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded mb-4">
              <p><strong>Project ID:</strong> {bid.projectId}</p>
              <p><strong>Seller:</strong> {bid.sellerName}</p>
              <p><strong>Bid Amount:</strong> ${bid.bidAmount}</p>
              <p><strong>Estimated Time:</strong> {bid.estimatedTime} days</p>
              <p><strong>Message:</strong> {bid.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
