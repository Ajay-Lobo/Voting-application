const InputField = ({ label, type, register, name, errors, placeholder }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          {...register(name)} // ✅ Make sure register is applied here
          placeholder={placeholder}
          className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none transition-all duration-200"
        />
        {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>}
      </div>
    );
  };
  
  export default InputField;
  