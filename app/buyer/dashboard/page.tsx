// app/buyer/dashboard/page.tsx
"use client";

import { useState } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: string;
}

export default function BuyerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject: Project = {
      id: Date.now(), // temporary unique id
      title: formData.title,
      description: formData.description,
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      deadline: formData.deadline,
      status: "PENDING",
    };

    setProjects([...projects, newProject]);

    // Reset form
    setFormData({
      title: "",
      description: "",
      budgetMin: "",
      budgetMax: "",
      deadline: "",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>

      {/* Create Project Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Project Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Budget Min ($)</label>
            <input
              type="number"
              name="budgetMin"
              value={formData.budgetMin}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Budget Max ($)</label>
            <input
              type="number"
              name="budgetMax"
              value={formData.budgetMax}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Create Project
        </button>
      </form>

      {/* Projects List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-medium">{project.title}</h3>
              <p className="text-gray-600">{project.description}</p>
              <p className="mt-2">Budget: ${project.budgetMin} - ${project.budgetMax}</p>
              <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
              <p>Status: <span className="font-semibold">{project.status}</span></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
