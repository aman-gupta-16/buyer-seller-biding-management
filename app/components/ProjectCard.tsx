import React from 'react';

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    budgetMin: string;
    budgetMax: string;
    deadline: string;
  };
  onViewDetails: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  return (
    <div className="border rounded-2xl p-4 shadow hover:shadow-lg transition duration-300">
      <h2 className="text-xl font-bold mb-2">{project.title}</h2>
      <p className="mb-2">{project.description}</p>
      <p className="mb-1"><span className="font-semibold">Budget Min:</span> {project.budgetMin}</p>
            <p className="mb-1"><span className="font-semibold">Budget Max:</span> {project.budgetMax}</p>
      <p className="mb-3"><span className="font-semibold">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</p>
      <button 
        onClick={onViewDetails} 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Details
      </button>
    </div>
  );
};

export default ProjectCard;
