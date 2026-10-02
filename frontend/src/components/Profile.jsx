import React, { useState, useEffect } from 'react';
import {
  saveUserProfile,
  getUserProfile,
  getSavedPlants,
  removeSavedPlant,
} from '../lib/api';

export default function Profile({ onBack }) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    location: '',
    bio: '',
  });

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [savedPlants, setSavedPlants] = useState([]);
  const [isLoadingSavedPlants, setIsLoadingSavedPlants] = useState(false);
  const [savedPlantsError, setSavedPlantsError] = useState('');

  // Load existing profile and saved plants on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('herbsense_profile_username');

    if (!savedUsername) return;

    let isMounted = true;

    const loadProfileAndSavedPlants = async () => {
      try {
        // Load profile
        const user = await getUserProfile(savedUsername);

        if (isMounted && user) {
          setFormData({
            fullName: user.fullName || '',
            username: user.username || '',
            email: user.email || '',
            location: user.location || '',
            bio: user.bio || '',
          });
        }

        // Load saved plants
        if (user?.id) {
          // Keep the user ID available for Remove functionality
          localStorage.setItem('herbsense_user_id', user.id);

          setIsLoadingSavedPlants(true);
          setSavedPlantsError('');

          const plants = await getSavedPlants(user.id);

          if (isMounted) {
            setSavedPlants(plants);
          }
        }
      } catch (error) {
        if (isMounted) {
          setSavedPlantsError(
            error.message || 'Could not load your saved plants.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingSavedPlants(false);
        }
      }
    };

    loadProfileAndSavedPlants();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setErrorMessage('');

    if (!formData.username.trim() || !formData.email.trim()) {
      setErrorMessage('Username and Email Address are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await saveUserProfile(formData);

      setMessage(response.message || 'Profile saved successfully!');

      if (formData.username.trim()) {
        localStorage.setItem(
          'herbsense_profile_username',
          formData.username.trim()
        );
      }

      if (response.user?.id) {
        localStorage.setItem('herbsense_user_id', response.user.id);

        // Refresh saved plants after saving profile
        setIsLoadingSavedPlants(true);
        setSavedPlantsError('');

        try {
          const plants = await getSavedPlants(response.user.id);
          setSavedPlants(plants);
        } catch {
          setSavedPlantsError('Could not refresh saved plants.');
        } finally {
          setIsLoadingSavedPlants(false);
        }
      }
    } catch (err) {
      setErrorMessage(
        err.message ||
          'Could not connect to database. Please verify your backend server.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove a plant from the user's saved collection
  const handleRemoveSavedPlant = async (plantId) => {
    if (!plantId) return;

    const savedUserId = localStorage.getItem('herbsense_user_id');

    if (!savedUserId) {
      setSavedPlantsError('Could not identify your profile.');
      return;
    }

    try {
      setSavedPlantsError('');

      await removeSavedPlant(savedUserId, plantId);

      // Remove it immediately from the page
      setSavedPlants((previous) =>
        previous.filter((savedPlant) => savedPlant.plantId !== plantId)
      );
    } catch (error) {
      setSavedPlantsError(
        error.message || 'Could not remove the saved plant.'
      );
    }
  };

  const formatSavedDate = (dateValue) => {
    if (!dateValue) {
      return 'Date unavailable';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return 'Date unavailable';
    }

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
              disabled={isSubmitting}
              className="w-full rounded-xl bg-herb-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-herb-800 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              {isSubmitting ? 'Saving Profile...' : 'Save Profile'}
            </button>

            {/* Error feedback */}
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm font-semibold text-red-800">
                {errorMessage}
              </div>
            )}

            {/* Success feedback */}
            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center text-sm font-semibold text-green-800">
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Saved Plants */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              🌿 Saved Plants
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Plants you have saved from your HerbSense identifications.
            </p>
          </div>

          {/* Loading */}
          {isLoadingSavedPlants && (
            <div className="rounded-2xl border border-herb-100 bg-herb-50 p-6 text-center">
              <p className="text-sm font-medium text-herb-700">
                Loading your saved plants...
              </p>
            </div>
          )}

          {/* Error */}
          {!isLoadingSavedPlants && savedPlantsError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-sm font-medium text-red-700">
                {savedPlantsError}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoadingSavedPlants &&
            !savedPlantsError &&
            savedPlants.length === 0 && (
              <div className="rounded-2xl border border-dashed border-herb-200 bg-herb-50 p-8 text-center">
                <div className="mb-3 text-4xl">🌱</div>

                <h3 className="font-bold text-gray-800">
                  No Saved Plants Yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                  Identify a medicinal plant and click "Save Plant" to add it
                  to your collection.
                </p>
              </div>
            )}

          {/* Saved plant list */}
          {!isLoadingSavedPlants &&
            !savedPlantsError &&
            savedPlants.length > 0 && (
              <div className="space-y-3">
                {savedPlants.map((savedPlant) => (
                  <div
                    key={savedPlant.id}
                    className="rounded-2xl border border-herb-100 bg-herb-50/60 p-4 transition hover:border-herb-200"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      {/* Plant information */}
                      <div>
                        <h3 className="font-bold text-herb-900">
                          {savedPlant.plant?.commonName || 'Unknown Plant'}
                        </h3>

                        {savedPlant.plant?.scientificName && (
                          <p className="mt-0.5 text-sm italic text-gray-500">
                            {savedPlant.plant.scientificName}
                          </p>
                        )}

                        {savedPlant.userNotes && (
                          <p className="mt-2 text-sm text-gray-700">
                            <span className="font-semibold">Note:</span>{' '}
                            {savedPlant.userNotes}
                          </p>
                        )}
                      </div>

                      {/* Saved date and remove button */}
                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-xs font-semibold text-gray-400">
                          SAVED
                        </p>

                        <p className="mt-0.5 text-sm font-medium text-herb-700">
                          {formatSavedDate(savedPlant.createdAt)}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSavedPlant(savedPlant.plantId)
                          }
                          className="mt-2 text-xs font-semibold text-red-600 hover:text-red-800 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
