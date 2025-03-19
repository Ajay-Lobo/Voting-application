import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  age: yup.number().min(18, "You must be at least 18 years old").required("Age is required"),
  mobile: yup.string().matches(/^\d{10}$/, "Mobile number must be exactly 10 digits").required("Mobile number is required"),
  address: yup.string().required("Address is required"),
  aadhar: yup.string().matches(/^\d{12}$/, "Aadhar number must be exactly 12 digits").required("Aadhar is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError(""); // Reset error before submitting
    console.log("Submitting data:", data);
    
    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", data);
      console.log("Registration successful:", res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      console.error("Registration failed:", errorMessage);
      setServerError(errorMessage); // Set the error message from the backend
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register</h2>
        
        {/* Display Server Error */}
        {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <InputField label="Full Name" type="text" name="name" register={register} errors={errors} placeholder="Enter your name" />
          <InputField label="Email" type="email" name="email" register={register} errors={errors} placeholder="Enter your email" />
          <InputField label="Age" type="number" name="age" register={register} errors={errors} placeholder="Enter your age" />
          <InputField label="Mobile" type="text" name="mobile" register={register} errors={errors} placeholder="Enter your mobile number" />
          <InputField label="Address" type="text" name="address" register={register} errors={errors} placeholder="Enter your address" />
          <InputField label="Aadhar Number" type="text" name="aadhar" register={register} errors={errors} placeholder="Enter your Aadhar number" />
          <InputField label="Password" type="password" name="password" register={register} errors={errors} placeholder="Enter your password" />

          <p className="text-sm text-gray-600 mt-4 text-center">
            Already have an account? <a href="/login" className="text-blue-500">Login</a>
          </p>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-200">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
