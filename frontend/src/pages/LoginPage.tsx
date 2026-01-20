import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService, ApiError } from "../services";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEmailError(value: string) {
  if (!value.trim()) {
    return "Email is required";
  }
  if (!emailPattern.test(value)) {
    return "Enter a valid email address";
  }
  return undefined;
}

function getPasswordError(value: string) {
  if (!value.trim()) {
    return "Password is required";
  }
  return undefined;
}

function validateForm(email: string, password: string) {
  const formErrors: { email?: string; password?: string } = {};
  const emailError = getEmailError(email);
  const passwordError = getPasswordError(password);

  if (emailError) formErrors.email = emailError;
  if (passwordError) formErrors.password = passwordError;

  return formErrors;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);

  const emailError = touched.email ? getEmailError(email) : undefined;
  const passwordError = touched.password
    ? getPasswordError(password)
    : undefined;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const validationErrors = validateForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setTouched({ email: true, password: true });
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login({ email, password });
      login(response.token.accessToken, response.user);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ form: err.message });
      } else {
        setErrors({ form: "An unexpected error occurred" });
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
                value={email}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setEmail(nextValue);
                  if (touched.email) {
                    setErrors((prev) => ({
                      ...prev,
                      email: getEmailError(nextValue),
                    }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, email: true }));
                  setErrors((prev) => ({
                    ...prev,
                    email: getEmailError(email),
                  }));
                }}
                required
                aria-invalid={!!(errors.email || emailError)}
                aria-describedby={
                  errors.email || emailError ? "login-email-error" : undefined
                }
                className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                  errors.email || emailError
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
                placeholder="you@example.com"
              />
              {(errors.email || emailError) && (
                <p id="login-email-error" className="mt-2 text-sm text-red-600">
                  {errors.email || emailError}
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
                value={password}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setPassword(nextValue);
                  if (touched.password) {
                    setErrors((prev) => ({
                      ...prev,
                      password: getPasswordError(nextValue),
                    }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, password: true }));
                  setErrors((prev) => ({
                    ...prev,
                    password: getPasswordError(password),
                  }));
                }}
                required
                aria-invalid={!!(errors.password || passwordError)}
                aria-describedby={
                  errors.password || passwordError
                    ? "login-password-error"
                    : undefined
                }
                className={`w-full px-4 py-3 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow ${
                  errors.password || passwordError
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300"
                }`}
                placeholder="Enter your password"
              />
              {(errors.password || passwordError) && (
                <p
                  id="login-password-error"
                  className="mt-2 text-sm text-red-600"
                >
                  {errors.password || passwordError}
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
