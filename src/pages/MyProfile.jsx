import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Camera,
  Pencil,
  Save,
  X,
  CalendarDays,
  BriefcaseBusiness,
} from "lucide-react";
import PageHeader from "../components/PageHeader";

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 234 567 8900",
    role: "Administrator",
    location: "New York, USA",
    joined: "January 15, 2025",
    bio: "Administrator managing products, orders, customers, and daily store operations.",
  });

  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleEdit = () => {
    setFormData(profile);
    setMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setMessage("");
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage("Name and email are required.");
      return;
    }

    setProfile(formData);
    setIsEditing(false);
    setMessage("Profile updated successfully. Changes are currently demo-only.");
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)]";

  const detailItems = [
    {
      label: "Email address",
      value: profile.email,
      icon: Mail,
    },
    {
      label: "Phone number",
      value: profile.phone || "Not provided",
      icon: Phone,
    },
    {
      label: "Location",
      value: profile.location || "Not provided",
      icon: MapPin,
    },
    {
      label: "Member since",
      value: profile.joined,
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and account details."
      />

      {message && (
        <div
          role="status"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)]"
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="h-28 bg-[var(--primary)]/15" />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end justify-between">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-[var(--surface)] bg-[var(--primary)] text-3xl font-bold text-white">
                {profile.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}

                <button
                  type="button"
                  title="Profile photo upload coming soon"
                  onClick={() =>
                    setMessage("Profile photo upload will be added later.")
                  }
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                >
                  <Camera size={15} />
                </button>
              </div>

              <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
                <ShieldCheck size={14} />
                {profile.role}
              </span>
            </div>

            <h2 className="mt-5 text-xl font-bold">{profile.name}</h2>

            <p className="mt-1 break-all text-sm text-[var(--muted)]">
              {profile.email}
            </p>

            <div className="my-6 border-t border-[var(--border)]" />

            <h3 className="mb-3 text-sm font-semibold">About</h3>

            <p className="text-sm leading-6 text-[var(--muted)]">
              {profile.bio || "No bio added yet."}
            </p>

            <button
              type="button"
              onClick={handleEdit}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Details */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Personal Information</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Your personal and contact details.
            </p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                    />

                    <input
                      id="profile-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
                    />

                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="profile-phone"
                    className="mb-2 block text-sm font-medium"
                  >
                    Phone Number
                  </label>

                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-location"
                    className="mb-2 block text-sm font-medium"
                  >
                    Location
                  </label>

                  <input
                    id="profile-location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-bio"
                  className="mb-2 block text-sm font-medium"
                >
                  Bio
                </label>

                <textarea
                  id="profile-bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className={`${inputClass} resize-y`}
                  placeholder="Write something about yourself"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-[var(--border)] pt-5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:opacity-80"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {detailItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-[var(--border)] p-4"
                    >
                      <div className="mb-3 flex items-center gap-2 text-[var(--muted)]">
                        <Icon size={17} />
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </div>

                      <p className="break-words text-sm font-semibold">
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-[var(--border)] p-4">
                <div className="mb-3 flex items-center gap-2 text-[var(--muted)]">
                  <BriefcaseBusiness size={17} />
                  <span className="text-xs font-medium">Account Role</span>
                </div>

                <p className="text-sm font-semibold">{profile.role}</p>
              </div>

              <div className="mt-6 flex justify-end border-t border-[var(--border)] pt-5">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--bg)]"
                >
                  <Pencil size={16} />
                  Edit Information
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;