import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

function LoginPage() {
  const { user, authenticate } = useAuthStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authenticate(mode, { email, password });
      toast.success(isLogin ? "Welcome back" : "Account created");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="card bg-base-100 shadow-lg">
        <form onSubmit={handleSubmit} className="card-body space-y-4">
          <h2 className="card-title text-2xl">
            {isLogin ? "Log in" : "Create account"}
          </h2>

          <label className="form-control">
            <span className="label-text text-base font-medium mb-1">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="form-control">
            <span className="label-text text-base font-medium mb-1">
              Password
            </span>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : isLogin ? (
              "Log in"
            ) : (
              "Sign up"
            )}
          </button>

          <button
            type="button"
            className="btn btn-link"
            onClick={() => setMode(isLogin ? "signup" : "login")}
          >
            {isLogin ? "No account? Sign up" : "Have an account? Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
export default LoginPage;
