
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { loginSchema } from "../../validations/authValidation";
import { useLogin } from "../../hooks/useAuth";

// Assets
import bgPattern from "../../assets/login/Minimal City Skyline with Yellow Waves.png";
import heroIllustration from "../../assets/login/470f0f85-1a7a-474a-b78c-25f1cd3b7f4c 1.svg";
import sloganLogo from "../../assets/login/slogan.png";
import adminUserBadge from "../../assets/login/8196793a-4338-44d7-b695-646b4c46e286 1.svg";
import adminMonitorIcon from "../../assets/login/5fb1c8f4-0795-4d75-9a5f-3e5a3004fe38 1.svg";
import roundedLoginArrowIcon from "../../assets/login/Rounded Login Arrow Icon.png";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // TanStack Query Login Mutation
  const {
    mutate: loginMutation,
    isPending: isLoading,
  } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      emailOrUsername: "admin@example.com",
      password: "Admin@12345",
      rememberMe: true,
    },
  });

  // Login Submit
  const onSubmit = (data) => {
    loginMutation(
      {
        email: data.emailOrUsername,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          toast.success(
            response.message || "Login successful!"
          );

          navigate("/", { replace: true });
        },

        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
            error.message ||
            "Something went wrong"
          );
        },
      }
    );
  };

  // Forgot Password
  const handleForgotPassword = () => {
    toast.info(
      "Please contact the system administrator to reset credentials."
    );
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-10 bg-white overflow-hidden font-sans select-none">

      {/* Background */}
      <img
        src={bgPattern}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0"
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center">

        {/* Left Column */}
        <div className="hidden lg:flex flex-col justify-center px-4 sm:px-6 lg:px-4">

          {/* Brand Header */}
          <div className="w-fit flex flex-col items-center">
            <img
              src={sloganLogo}
              alt="Share Chalo - Ride Together • Go Further"
              className="w-72 sm:w-80 lg:w-[450px] xl:w-[530px] h-auto object-contain select-none"
            />

            {/* Admin Panel Badge */}
            <div className="mt-1 inline-flex items-center gap-2.5 bg-[#fed011] text-black px-7 py-1.5 rounded-full shadow-xs">
              <img
                src={adminMonitorIcon}
                alt=""
                className="w-8 h-8 object-contain select-none"
              />

              <span className="text-[20px] font-bold tracking-wide">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mt-4 lg:mt-6">
            <h1 className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-bold text-slate-950 tracking-tight leading-[1.12]">
              Manage Rides,
              <br />
              <span className="whitespace-nowrap">
                Drivers, Users &amp; Earnings
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-[20px] mt-1.5 max-w-xl xl:max-w-2xl leading-snug">
              Control your Share Chalo platform operations from a single dashboard.
            </p>
          </div>

          {/* Hero Illustration */}
          <div className="relative mt-3 lg:mt-4 w-full max-w-[620px] xl:max-w-[700px]">

            {/* Yellow Shadow */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-[90%] h-9 bg-amber-300/40 blur-[15px] rounded-full z-0 pointer-events-none"></div>

            <img
              src={heroIllustration}
              alt="Share Chalo Operations Overview"
              className="relative z-10 w-full h-auto object-contain drop-shadow-sm select-none max-h-[235px] xl:max-h-[255px]"
            />
          </div>
        </div>

        {/* Right Column - Login Card */}
        <div className="flex justify-center lg:justify-end px-4 sm:px-6 lg:px-1 w-full lg:ml-8">

          <div className="w-full max-w-[460px] lg:max-w-[510px] xl:max-w-[540px] bg-white rounded-3xl shadow-xl border border-slate-100/90 p-5 sm:p-7 lg:p-8">

            {/* Admin Badge */}
            <div className="flex flex-col items-center text-center">
              <img
                src={adminUserBadge}
                alt="Admin Login"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
              />

              <h2 className="text-[28px] sm:text-[45px] font-bold text-slate-950">
                Admin Login
              </h2>

              <p className="text-sm sm:text-[20px] mt-1 font-medium">
                Sign in to access Share Chalo Admin Panel
              </p>
            </div>

            {/* Login Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 lg:mt-5 space-y-4"
            >

              {/* Email / Username */}
              <div>
                <label className="block text-base sm:text-[18px] font-bold mb-1.5">
                  Email / Username
                </label>

                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-800 pointer-events-none flex items-center">
                    <Mail
                      className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800"
                      strokeWidth={2}
                    />
                  </span>

                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your email or username"
                    {...register("emailOrUsername")}
                    className={`input-field input-with-icon-left !text-[16px] font-medium py-3 ${
                      errors.emailOrUsername
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : ""
                    }`}
                  />
                </div>

                {errors.emailOrUsername && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.emailOrUsername.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-base sm:text-[18px] font-bold mb-1.5">
                  Password
                </label>

                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-800 pointer-events-none flex items-center">
                    <Lock
                      className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800"
                      strokeWidth={2}
                    />
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`input-field input-with-icon-left input-with-icon-right !text-[16px] font-medium py-3 ${
                      errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : ""
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-600 hover:text-slate-950 transition-colors p-1 cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        className="w-4.5 h-4.5"
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        className="w-4.5 h-4.5"
                        strokeWidth={1.8}
                      />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register("rememberMe")}
                    className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400 accent-amber-500 cursor-pointer"
                  />

                  <span className="text-sm sm:text-[16px] font-medium text-slate-700">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm sm:text-[17px] font-bold text-slate-950 hover:text-amber-600 transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#fed011] hover:bg-amber-400 text-black font-bold text-base sm:text-[19px] py-3 lg:py-2 px-6 rounded-xl shadow-md shadow-amber-400/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />

                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src={roundedLoginArrowIcon}
                        alt=""
                        className="w-7 h-7 sm:w-11 sm:h-11 object-contain select-none"
                      />

                      <span>Login to Admin Panel</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
