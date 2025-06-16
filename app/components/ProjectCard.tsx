import Link from "next/link";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  status: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description, budgetMin, budgetMax, deadline, status }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <p className="mt-2">Budget: ${budgetMin} - ${budgetMax}</p>
      <p>Deadline: {new Date(deadline).toLocaleDateString()}</p>
      <p>Status: <span className="font-semibold">{status}</span></p>
      <Link href={`/seller/project/${id}`}>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default ProjectCard;
