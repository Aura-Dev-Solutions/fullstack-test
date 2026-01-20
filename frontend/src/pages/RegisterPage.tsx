import { useState, type FormEvent } from "react";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService, ApiError } from "../services";
import { getFormErrors } from "../utils/validation";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const validationErrors = getFormErrors(registerSchema, formData);
    if (Object.keys(validationErrors).length > 0) {
      setTouched({ name: true, email: true, password: true });
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      login(response.token.accessToken, response.user);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Create account
            </h1>
            <p className="text-slate-500 mt-2">Get started with your CRM</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const nextFormData = { ...formData, name: e.target.value };
                  setFormData(nextFormData);
                  if (touched.name) {
                    setErrors(getFormErrors(registerSchema, nextFormData));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, name: true }));
                  setErrors(getFormErrors(registerSchema, formData));
                }}
                required
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={
                  touched.name && errors.name
                    ? "register-name-error"
                    : undefined
                }
                className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                  touched.name && errors.name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
                placeholder="Your name"
              />
              {touched.name && errors.name && (
                <p
                  id="register-name-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  const nextFormData = { ...formData, email: e.target.value };
                  setFormData(nextFormData);
                  if (touched.email) {
                    setErrors(getFormErrors(registerSchema, nextFormData));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  setErrors(getFormErrors(registerSchema, formData));
                }}
                required
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={
                  touched.email && errors.email
                    ? "register-email-error"
                    : undefined
                }
                className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                  touched.email && errors.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
                placeholder="you@example.com"
              />
              {touched.email && errors.email && (
                <p
                  id="register-email-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  const nextFormData = {
                    ...formData,
                    password: e.target.value,
                  };
                  setFormData(nextFormData);
                  if (touched.password) {
                    setErrors(getFormErrors(registerSchema, nextFormData));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, password: true }));
                  setErrors(getFormErrors(registerSchema, formData));
                }}
                required
                minLength={6}
                aria-invalid={touched.password && !!errors.password}
                aria-describedby={
                  touched.password && errors.password
                    ? "register-password-error"
                    : undefined
                }
                className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                  touched.password && errors.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
                placeholder="At least 6 characters"
              />
              {touched.password && errors.password && (
                <p
                  id="register-password-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 rounded-lg bg-slate-900 text-white font-medium cursor-pointer transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
