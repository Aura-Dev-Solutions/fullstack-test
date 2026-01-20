import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService, ApiError } from "../services";
import { z } from "zod";
import { getFormErrors } from "../utils";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().trim().min(1, "Password is required"),
});

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const emailError = touched.email ? errors.email : undefined;
  const passwordError = touched.password ? errors.password : undefined;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const validationErrors = getFormErrors(loginSchema, formData);
    if (Object.keys(validationErrors).length > 0) {
      setTouched({ email: true, password: true });
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      login(response.token.accessToken, response.user);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("An unexpected error occurred");
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
            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}
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
                  const nextValue = e.target.value;
                  const nextFormData = {
                    ...formData,
                    email: nextValue,
                  };
                  setFormData(nextFormData);
                  if (touched.email) {
                    setErrors(getFormErrors(loginSchema, nextFormData));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  setErrors(getFormErrors(loginSchema, formData));
                }}
                required
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "login-email-error" : undefined}
                className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                  emailError
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
                placeholder="you@example.com"
              />
              {emailError && (
                <p id="login-email-error" className="mt-2 text-sm text-red-600">
                  {emailError}
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
                  const nextValue = e.target.value;
                  const nextFormData = {
                    ...formData,
                    password: nextValue,
                  };
                  setFormData(nextFormData);
                  if (touched.password) {
                    setErrors(getFormErrors(loginSchema, nextFormData));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, password: true }));
                  setErrors(getFormErrors(loginSchema, formData));
                }}
                required
                aria-invalid={!!passwordError}
                aria-describedby={
                  passwordError ? "login-password-error" : undefined
                }
                className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                  passwordError
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
                placeholder="Enter your password"
              />
              {passwordError && (
                <p
                  id="login-password-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 rounded-lg bg-slate-900 text-white font-medium cursor-pointer transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
