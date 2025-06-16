"use client";

import { useEffect, useState } from "react";
import ProjectCard from "./components/ProjectCard";
import Loader from "./components/Loader.";

interface Project {
  id: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data
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

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <Loader/>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Projects</h1>
      {projects.length === 0 ? (
        <p>No open projects at the moment.</p>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            budgetMin={project.budgetMin}
            budgetMax={project.budgetMax}
            deadline={project.deadline}
            status={project.status}
          />
        ))
      )}
    </div>
  );
}
