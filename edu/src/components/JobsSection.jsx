// src/components/JobsSection.jsx
import React, { useState, useEffect } from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Star,
  Search,
  Plus,
  X,
} from "lucide-react";

function JobsSection() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    minMatch: 50,
    location: "",
    remoteOnly: false,
  });

  // State for user skills input
  const [skillsInput, setSkillsInput] = useState("");
  const [userSkills, setUserSkills] = useState([
    "Python",
    "SQL",
    "Machine Learning",
  ]);
  const [userProfile, setUserProfile] = useState({
    skills: ["Python", "SQL", "Machine Learning"],
    desiredRoles: [],
    location: "",
    yearsExperience: 0,
    top_k: 20,
  });

  // Add a skill to the list
  const addSkill = () => {
    const skill = skillsInput.trim();
    if (skill && !userSkills.includes(skill)) {
      const newSkills = [...userSkills, skill];
      setUserSkills(newSkills);
      setSkillsInput("");
    }
  };

  // Remove a skill from the list
  const removeSkill = (skillToRemove) => {
    const newSkills = userSkills.filter((skill) => skill !== skillToRemove);
    setUserSkills(newSkills);
  };

  // Handle Enter key press in skills input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addSkill();
    }
  };

  // Update user profile when skills change
  useEffect(() => {
    setUserProfile((prev) => ({
      ...prev,
      skills: userSkills,
    }));
  }, [userSkills]);

  const fetchMatches = async () => {
    if (userSkills.length === 0) {
      alert("Please add at least one skill to search for jobs");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.results) {
        const mapped = data.results.map((r) => ({
          id: r.job.id,
          title: r.job.title,
          company: r.job.company || "Company not specified",
          location: r.job.location || "Location not specified",
          type: r.job.type || "Full-time",
          salary: r.job.salary || "Salary not specified",
          matchPercentage: Math.round(r.matchPercent),
          requiredSkills: r.job.requiredSkills || [],
          postedDate: r.job.postedDate || "",
          remote: r.job.remote || false,
          url: r.job.url || "#",
          breakdown: r.breakdown || {},
        }));
        setJobs(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch matches:", err);
      // Fallback to sample data if backend is not available
      setJobs(getSampleJobs());
    } finally {
      setLoading(false);
    }
  };

  // Sample data fallback
  const getSampleJobs = () => [
    {
      id: "1",
      title: "Data Scientist",
      company: "Tech Corp",
      location: "Johannesburg",
      type: "Full-time",
      salary: "R60,000 - R80,000",
      matchPercentage: 85,
      requiredSkills: ["Python", "Machine Learning", "SQL", "Data Analysis"],
      remote: true,
      url: "#",
      breakdown: { skill: 90, experience: 100, location: 50, recency: 80 },
    },
    {
      id: "2",
      title: "Python Developer",
      company: "Startup XYZ",
      location: "Cape Town",
      type: "Full-time",
      salary: "R50,000 - R70,000",
      matchPercentage: 78,
      requiredSkills: ["Python", "Django", "JavaScript", "REST APIs"],
      remote: false,
      url: "#",
      breakdown: { skill: 85, experience: 90, location: 40, recency: 75 },
    },
    {
      id: "3",
      title: "Machine Learning Engineer",
      company: "AI Innovations",
      location: "Remote",
      type: "Full-time",
      salary: "R70,000 - R90,000",
      matchPercentage: 92,
      requiredSkills: ["Python", "TensorFlow", "PyTorch", "Deep Learning"],
      remote: true,
      url: "#",
      breakdown: { skill: 95, experience: 100, location: 100, recency: 85 },
    },
  ];

  const filteredJobs = jobs.filter(
    (job) =>
      job.matchPercentage >= filters.minMatch &&
      (filters.location === "" ||
        job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.remoteOnly || job.remote)
  );

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Find Jobs Matching Your Skills
          </h2>
          <p className="text-gray-600">
            Enter your skills and discover relevant job opportunities
          </p>
        </div>
        <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
          {filteredJobs.length} Matches
        </span>
      </div>

      {/* Skills Input Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Skills
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a skill and press Enter or click Add"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add skills like: Python, JavaScript, React, SQL, Machine Learning,
              etc.
            </p>
          </div>

          {/* Skills Tags */}
          {userSkills.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Skills ({userSkills.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Preference
              </label>
              <input
                type="text"
                placeholder="e.g., Johannesburg, Remote"
                value={userProfile.location}
                onChange={(e) =>
                  setUserProfile((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={userProfile.yearsExperience}
                onChange={(e) =>
                  setUserProfile((prev) => ({
                    ...prev,
                    yearsExperience: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchMatches}
                disabled={userSkills.length === 0 || loading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Find Matching Jobs"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {jobs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">
                Found {filteredJobs.length} jobs matching your{" "}
                {userSkills.length} skills
              </h3>
              <p className="text-blue-700 text-sm">
                Skills: {userSkills.join(", ")}
                {userProfile.location && ` • Location: ${userProfile.location}`}
                {userProfile.yearsExperience > 0 &&
                  ` • Experience: ${userProfile.yearsExperience} years`}
              </p>
            </div>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
            >
              <Search className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      {jobs.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-medium text-gray-900 mb-4">Filter Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Match % ({filters.minMatch}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minMatch}
                onChange={(e) =>
                  setFilters({ ...filters, minMatch: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Location
              </label>
              <input
                type="text"
                placeholder="Any location"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.remoteOnly}
                  onChange={(e) =>
                    setFilters({ ...filters, remoteOnly: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Remote only</span>
              </label>
            </div>
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({ minMatch: 50, location: "", remoteOnly: false })
                }
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Searching for jobs matching your skills...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs searched yet
            </h3>
            <p className="text-gray-600">
              Add your skills above and click "Find Matching Jobs" to discover
              relevant opportunities
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border">
            <p className="text-gray-600">
              No jobs match your current filters. Try adjusting your criteria.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} userSkills={userSkills} />
          ))
        )}
      </div>
    </div>
  );
}

function JobCard({ job, userSkills }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-blue-100 text-blue-800";
    if (percentage >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Find matching skills between user skills and job required skills
  const matchingSkills = userSkills.filter((skill) =>
    job.requiredSkills.some(
      (jobSkill) =>
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );

  return (
    <div
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow border-l-4"
      style={{ borderLeftColor: `hsl(${job.matchPercentage * 1.2}, 70%, 50%)` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {job.title}
                </h3>
                <p className="text-gray-600">{job.company}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full ${getMatchColor(
                    job.matchPercentage
                  )}`}
                >
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {job.matchPercentage}% match
                  </span>
                </div>
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  {showBreakdown ? "Hide" : "Details"}
                </button>
                <button
                  onClick={() => window.open(job.url, "_blank")}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply
                </button>
              </div>
            </div>

            {showBreakdown && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  Match Breakdown:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {Object.entries(job.breakdown).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="font-medium capitalize text-gray-700">
                        {key}
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(value)}%
                      </div>
                    </div>
                  ))}
                </div>

                {/* Matching Skills */}
                {matchingSkills.length > 0 && (
                  <div className="mt-3">
                    <div className="font-medium text-gray-900 mb-1">
                      Your Matching Skills:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {matchingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
                {job.remote && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Remote
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Required Skills:</span>
                {job.requiredSkills.slice(0, 8).map((skill) => {
                  const isMatch = userSkills.some(
                    (userSkill) =>
                      skill.toLowerCase().includes(userSkill.toLowerCase()) ||
                      userSkill.toLowerCase().includes(skill.toLowerCase())
                  );
                  return (
                    <span
                      key={skill}
                      className={`text-xs px-2 py-1 rounded ${
                        isMatch
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
                {job.requiredSkills.length > 8 && (
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
                    +{job.requiredSkills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobsSection;
