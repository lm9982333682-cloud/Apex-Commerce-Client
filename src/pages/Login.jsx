import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ShoppingBag,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";
import { loginAdmin } from "../services/authService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAccessToken, setUser } from "../store/features/auth/authSlice";





const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }


    try {
      const res = await loginAdmin({ email, password });
      if (res.success) {
        const { accessToken, message, user } = res;
        toast.success(message);
        dispatch(setUser(user));
        dispatch(setAccessToken(accessToken));

        setTimeout(() => {
          navigate('/')
        }, 1400);


      }

    } catch (err) {
      setError(err.response.data.message);
      toast.error(err.response.data.message)

    }



    // Demo only. Real authentication will be added with the backend.
    // navigate("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
            <ShoppingBag size={25} />
          </div>

          <span className="text-2xl font-bold text-[var(--text)]">
            Apex Commerce
          </span>
        </Link>

        {/* Login Card */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[var(--text)]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Sign in to access your admin dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[var(--text)]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-4 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[var(--text)]"
                >
                  Password
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setError("Password recovery will be available later.")
                  }
                  className="text-xs font-medium text-[var(--primary)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-12 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Remember me
            </label>

            {/* Error Message */}
            {error && (
              <p
                role="alert"
                className="rounded-lg text-red-500 border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)]"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Sign In
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)]">
              NEW TO APEX COMMERCE?
            </span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <p className="text-center text-sm text-[var(--muted)]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Create account
            </Link>
          </p>
        </section>

        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Apex Commerce. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default Login;