const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-transparent border-purple-600 border-solid rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
