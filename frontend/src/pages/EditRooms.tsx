import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditRoomPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialRoomData = location.state?.roomData;

  const [roomData, setRoomData] = useState(
    initialRoomData || {
      name: "",
      category: "MATHEMATICS",
      description: "",
      isPrivate: false,
      password: "",
      timerSettings: {
        name: "Custom Timer",
        focusTime: 25,
        breakTime: 5,
        remainingTime: 5,
        isPaused: true,
      },
      participants: [],
    }
  );

  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participantEmail, setParticipantEmail] = useState("");
  const [activeSection, setActiveSection] = useState("basic");

  useEffect(() => {
    if (!initialRoomData && roomId) {
      const fetchRoomData = async () => {
        try {
          const response = await axios.get(`/api/rooms/${roomId}`);
          setRoomData(response.data);
        } catch (error) {
          console.error("Error fetching room data:", error);
        }
      };
      fetchRoomData();
    }
  }, [roomId, initialRoomData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTimerChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({
      ...prev,
      timerSettings: {
        ...prev.timerSettings,
        [name]: parseInt(value, 10),
      },
    }));
  };

  const handleAddParticipant = async () => {
    if (!participantEmail) return;

    try {
      const response = await axios.get(`/api/users?email=${participantEmail}`);
      const newParticipant = response.data;

      if (!roomData.participants.some((p) => p.id === newParticipant.id)) {
        setRoomData((prev) => ({
          ...prev,
          participants: [...prev.participants, newParticipant],
        }));
        setParticipantEmail("");
      } else {
        setErrors((prev) => ({ ...prev, participants: "User already added" }));
        setTimeout(
          () => setErrors((prev) => ({ ...prev, participants: undefined })),
          3000
        );
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, participants: "User not found" }));
      setTimeout(
        () => setErrors((prev) => ({ ...prev, participants: undefined })),
        3000
      );
    }
  };

  const handleRemoveParticipant = (participantId) => {
    setRoomData((prev) => ({
      ...prev,
      participants: prev.participants.filter((p) => p.id !== participantId),
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string | undefined } = {};

    if (!roomData.name.trim()) {
      newErrors.name = "Room name is required";
    }

    if (roomData.isPrivate && !roomData.password) {
      newErrors.password = "Password is required for private rooms";
    }

    if (roomData.timerSettings.focusTime <= 0) {
      newErrors.focusTime = "Focus time must be positive";
    }

    if (roomData.timerSettings.breakTime <= 0) {
      newErrors.breakTime = "Break time must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `/api/rooms/${roomId || roomData.id}`,
        roomData
      );
      console.log("Room updated successfully:", response.data);
      navigate(`/rooms/${roomId || roomData.id}`, {
        state: { updatedRoom: response.data },
      });
    } catch (error) {
      console.error("Error updating room:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Failed to update room. Please try again.",
      }));
      setTimeout(
        () => setErrors((prev) => ({ ...prev, form: undefined })),
        3000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!roomData && !roomId) {
    return <p>No room information provided.</p>;
  }

  const categories = [
    { value: "MATHEMATICS", label: "Mathematics", icon: "📐" },
    { value: "SCIENCE", label: "Science", icon: "🔬" },
    { value: "LITERATURE", label: "Literature", icon: "📚" },
    { value: "HISTORY", label: "History", icon: "🏛️" },
    { value: "PROGRAMMING", label: "Programming", icon: "💻" },
    { value: "OTHER", label: "Other", icon: "🔍" },
  ];

  const TabButton = ({ section, label, icon }) => (
    <button
      type="button"
      className={`flex items-center px-4 py-3 border-b-2 text-sm font-medium ${
        activeSection === section
          ? "border-indigo-500 text-indigo-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
      onClick={() => setActiveSection(section)}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-16 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-6">
        <h1 className="text-3xl font-bold text-white">
          {roomData
            ? `Edit Room: ${roomData.name}`
            : `Editing Room ID: ${roomId}`}
        </h1>
        <p className="text-indigo-100 mt-2">
          Customize your study space settings
        </p>
      </div>

      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto hide-scrollbar">
          <TabButton section="basic" label="Basic Info" icon="📋" />
          <TabButton section="privacy" label="Privacy" icon="🔒" />
          <TabButton section="timer" label="Timer" icon="⏱️" />
          <TabButton section="participants" label="Participants" icon="👥" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Basic Information Section */}
        {activeSection === "basic" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
              <span className="mr-2">📋</span>
              Basic Information
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Room Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={roomData.name}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter a distinctive name for your room"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={roomData.category}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={roomData.description}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Describe the purpose and focus of this study room"
                />
              </div>
            </div>
          </div>
        )}

        {/* Privacy Settings Section */}
        {activeSection === "privacy" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
              <span className="mr-2">🔒</span>
              Privacy Settings
            </h2>

            <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="isPrivate"
                    name="isPrivate"
                    type="checkbox"
                    checked={roomData.isPrivate}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="isPrivate"
                    className="font-medium text-gray-800"
                  >
                    Private Room
                  </label>
                  <p className="text-gray-600 text-sm mt-1">
                    When enabled, only users with the password can join this
                    room
                  </p>
                </div>
              </div>

              {roomData.isPrivate && (
                <div className="mt-6 transition-all duration-300">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Room Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={roomData.password}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pr-10 ${
                        errors.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Create a secure password"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500">🔑</span>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span> {errors.password}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Choose a strong password that you can share with invited
                    participants
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timer Settings Section */}
        {activeSection === "timer" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
              <span className="mr-2">⏱️</span>
              Timer Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100 shadow-sm">
                <label
                  htmlFor="focusTime"
                  className=" text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <span className="mr-2">🧠</span>
                  Focus Time (minutes)
                </label>
                <input
                  type="number"
                  name="focusTime"
                  id="focusTime"
                  min="1"
                  value={roomData.timerSettings.focusTime}
                  onChange={handleTimerChange}
                  className={`block w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.focusTime
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.focusTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.focusTime}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-600">
                  Recommended: 25-50 minutes of focused work
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-5 border border-blue-100 shadow-sm">
                <label
                  htmlFor="breakTime"
                  className=" text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <span className="mr-2">☕</span>
                  Break Time (minutes)
                </label>
                <input
                  type="number"
                  name="breakTime"
                  id="breakTime"
                  min="1"
                  value={roomData.timerSettings.breakTime}
                  onChange={handleTimerChange}
                  className={`block w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.breakTime
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.breakTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.breakTime}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-600">
                  Recommended: 5-15 minutes to rest
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-5 border border-amber-100 shadow-sm">
                <label
                  htmlFor="remainingTime"
                  className="block text-sm font-medium text-gray-700 mb-2  items-center"
                >
                  <span className="mr-2">⌛</span>
                  Remaining Time (minutes)
                </label>
                <input
                  type="number"
                  name="remainingTime"
                  id="remainingTime"
                  min="1"
                  value={roomData.timerSettings.remainingTime}
                  onChange={handleTimerChange}
                  className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                />
                <p className="mt-2 text-xs text-gray-600">
                  Current time left in the active session
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Participants Section */}
        {activeSection === "participants" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
              <span className="mr-2">👥</span>
              Participants
            </h2>

            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <label
                htmlFor="participantEmail"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Add Participant by Email
              </label>
              <div className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">📧</span>
                  </div>
                  <input
                    type="email"
                    id="participantEmail"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-l-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="participant@example.com"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddParticipant}
                  className="px-6 py-3 border border-transparent rounded-r-lg font-medium shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              {errors.participants && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span> {errors.participants}
                </p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Current Participants ({roomData.participants.length})
              </h3>

              {roomData.participants.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">No participants added yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add participants using their email address
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {roomData.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {participant.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {participant.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(participant.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                      >
                        <span className="sr-only">Remove participant</span>✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 transform hover:scale-105"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {errors.form && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 border border-red-100 animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {errors.form}
                </h3>
              </div>
            </div>
          </div>
        )}
      </form>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
