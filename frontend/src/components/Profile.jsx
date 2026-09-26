import React, { useState } from 'react';

export default function Profile({ onBack }) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    location: '',
    bio: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage('Profile created successfully!');
  };

  return (
    <div className="min-h-screen bg-herb-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Page heading */}
        <div className="mb-8 text-center">
            <button
                type="button"
                onClick={onBack}    
                className="mb-4 text-sm font-semibold text-herb-700 hover:underline"
            >
                ← Back to HerbSense
            </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Profile
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Create your HerbSense profile to personalize your experience.
          </p>
        </div>

        {/* Profile card */}
        <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-herb-600 focus:ring-2 focus:ring-herb-100"
              />
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-herb-600 focus:ring-2 focus:ring-herb-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-herb-600 focus:ring-2 focus:ring-herb-100"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Sri Lanka"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-herb-600 focus:ring-2 focus:ring-herb-100"
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                About You
              </label>

              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself..."
                rows="4"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-herb-600 focus:ring-2 focus:ring-herb-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl bg-herb-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-herb-800 active:scale-[0.99]"
            >
              Create Profile
            </button>

            {/* Temporary success message */}
            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center text-sm font-semibold text-green-800">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
