import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateELDLogs } from "../services/api";

const TripForm = ({ setTripData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    current_location: "",
    pickup_location: "",
    dropoff_location: "",
    current_cycle_hours: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "current_cycle_hours" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await generateELDLogs(formData);
      setTripData(data);
      console.log("data", data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred while generating logs"
      );
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Trip Details</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="current_location"
          >
            Current Location
          </label>
          <input
            id="current_location"
            name="current_location"
            type="text"
            placeholder="e.g. Chicago, IL"
            value={formData.current_location}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="pickup_location"
          >
            Pickup Location
          </label>
          <input
            id="pickup_location"
            name="pickup_location"
            type="text"
            placeholder="e.g. Indianapolis, IN"
            value={formData.pickup_location}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dropoff_location"
          >
            Dropoff Location
          </label>
          <input
            id="dropoff_location"
            name="dropoff_location"
            type="text"
            placeholder="e.g. Columbus, OH"
            value={formData.dropoff_location}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="current_cycle_hours"
          >
            Current Cycle Hours Used (0-70)
          </label>
          <input
            id="current_cycle_hours"
            name="current_cycle_hours"
            type="number"
            min="0"
            max="70"
            step="0.5"
            value={formData.current_cycle_hours}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Generate Route & Logs"
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/logs")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            View Logs
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
