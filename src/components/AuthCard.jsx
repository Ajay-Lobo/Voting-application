const AuthCard = ({ title, children, onSubmit, buttonText }) => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96 animate-fade-in">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">{title}</h2>
          <form onSubmit={onSubmit}>
            {children}
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-200">
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default AuthCard;
  