import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserRound, Mail, LockKeyhole, Eye, EyeOff, UserPlus, ShoppingBag, ArrowRight } from "lucide-react";
import { registerAdmin } from "../services/authService";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }



    try {
      const res = await registerAdmin(formData);
      const { message, success, user, } = res;

      if (success) {
        toast.success(message);
        setSuccess(message);

        setTimeout(() => {
          navigate("/login")
        }, 1400);


      }

    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data)
    }


    // Backend connect hone ke baad yahan API call karenge.
    // Abhi real account create nahi hota.
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 mb-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <ShoppingBag size={23} />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Apex Commerce
          </span>
        </Link>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl sm:p-8">
          <div className="mb-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-[var(--primary)]">
              <UserPlus size={25} />
            </div>

            <h1 className="text-2xl font-bold">Create an account</h1>

            <p className="mt-2 text-sm text-[var(--muted)]">
              Register to get started with Apex Commerce.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600"
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Full name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[var(--primary)]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[var(--primary)]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Create account
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} Apex Commerce. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;