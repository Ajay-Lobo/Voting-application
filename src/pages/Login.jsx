import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../components/InputField";
import AuthCard from "../components/AuthCard";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await axios.post("http://your-backend-url.com/api/login", data);
      console.log(res.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthCard title="Login to Vote" onSubmit={handleSubmit(handleLogin)} buttonText="Login">
      <InputField label="Email" type="email" register={register} name="email" errors={errors} placeholder="Enter your email" />
      <InputField label="Password" type="password" register={register} name="password" errors={errors} placeholder="Enter your password" />
      <p className="text-sm text-gray-600 mt-4 text-center">
        Don't have an account? <a href="/register" className="text-blue-500">Register</a>
      </p>
    </AuthCard>
  );
};

export default Login;
