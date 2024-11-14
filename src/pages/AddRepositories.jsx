import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InputRepo from "../components/InputRepo";
import Filter from "../components/Filter"; // Import the updated Filter component
import {
  useAddRepoMutation,
  useUpdateRepoMutation,
  useGetRepoByIdQuery,
} from "../redux/repoApi";
import { uploadImageToCloudinary } from "../utils/uploadImageToCloudinary";

const AddRepositories = () => {
  const { id } = useParams();
  const { data: repoData, isLoading: isRepoLoading } = useGetRepoByIdQuery(id);

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    source_name: "",
    image_file: null,
    image_url: "",
    project_report_file: null,
    project_report_url: "",
    project_source_code_url: "",
    matric: "",
    frontend_tech: [], // Tech Stack fields
    backend_tech: [],
    database_tech: [],
  });

  const [imageFileName, setImageFileName] = useState("");
  const [projectReportFileName, setProjectReportFileName] = useState("");

  const [
    addRepo,
    { isLoading: isAdding, isSuccess: isAddSuccess, isError: isAddError },
  ] = useAddRepoMutation();
  const [
    updateRepo,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
    },
  ] = useUpdateRepoMutation();

  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    const storedMatricNo = localStorage.getItem("matricNo");
    if (storedMatricNo) {
      setFormData((prevData) => ({ ...prevData, matric: storedMatricNo }));
    }
  }, []);

  useEffect(() => {
    if (id && repoData) {
      setFormData({
        title: repoData.title || "",
        abstract: repoData.abstract || "",
        source_name: repoData.source_name || "",
        image_file: null,
        image_url: repoData.image_url || "",
        project_report_file: null,
        project_report_url: repoData.project_report_url || "",
        project_source_code_url: repoData.project_source_code_url || "",
        matric: repoData.matric || "",
        frontend_tech: repoData.tech_stack?.frontend?.split(", ") || [], // Converting string to array
        backend_tech: repoData.tech_stack?.backend?.split(", ") || [], // Converting string to array
        database_tech: repoData.tech_stack?.database?.split(", ") || [], // Converting string to array
      });
    }
  }, [id, repoData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "image_file") {
      setImageFileName(files[0]?.name || "");
    }
    if (name === "project_report_file") {
      setProjectReportFileName(files[0]?.name || "");
    }
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleTechStackChange = (key, selectedOptions) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: selectedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);
  
    try {
      const imageUrl = formData.image_file
        ? await uploadImageToCloudinary(formData.image_file)
        : formData.image_url;
      const projectReportUrl = formData.project_report_file
        ? await uploadImageToCloudinary(formData.project_report_file)
        : formData.project_report_url;
  
      // Flatten the tech stack into individual fields
      const repoPayload = {
        title: formData.title,
        abstract: formData.abstract,
        source_name: formData.source_name,
        image_url: imageUrl,
        matric: formData.matric,
        project_report_url: projectReportUrl,
        project_source_code_url: formData.project_source_code_url,
        frontend: formData.frontend_tech.join(", ") || null,
        backend: formData.backend_tech.join(", ") || null,
        database: formData.database_tech.join(", ") || null,
      };
  
      console.log("Payload being sent:", repoPayload); // Check payload structure
  
      if (id) {
        await updateRepo({ id, repo: repoPayload });
      } else {
        await addRepo(repoPayload);
      }
  
      setFormData({
        title: "",
        abstract: "",
        source_name: "",
        image_file: null,
        image_url: "",
        project_report_file: null,
        project_report_url: "",
        project_source_code_url: "",
        matric: formData.matric,
        frontend_tech: [],
        backend_tech: [],
        database_tech: [],
      });
      setImageFileName("");
      setProjectReportFileName("");
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };
  
  

  const inputFields = [
    {
      label: "Title",
      type: "text",
      name: "title",
      value: formData.title,
      required: true,
    },
    {
      label: "Abstract",
      type: "textarea",
      name: "abstract",
      value: formData.abstract,
      required: true,
    },
    {
      label: "Source Name",
      type: "text",
      name: "source_name",
      value: formData.source_name,
      required: true,
    },
    {
      label: "Project Source Code URL",
      type: "url",
      name: "project_source_code_url",
      value: formData.project_source_code_url,
      required: true,
    },
  ];

  const isSuccess = id ? isUpdateSuccess : isAddSuccess;
  const isError = id ? isUpdateError : isAddError;

  const frontendOptions = [
    "React",
    "Angular",
    "Vue.js",
    "Svelte",
    "Tailwind CSS",
    "Bootstrap",
  ];
  const backendOptions = [
    "Node.js",
    "Django",
    "Flask",
    "Express",
    "Ruby on Rails",
    "Spring Boot",
  ];
  const databaseOptions = [
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Firebase",
    "SQLite",
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6 text-gray-700 text-center">
        {id ? "Edit Repository" : "Add Repository"}
      </h1>

      <div className="min-h-screen flex flex-col items-center p-6">
        {isRepoLoading ? (
          <p>Loading repository data...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl"
          >
            {/* Title and Source Name fields, side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputRepo
                label="Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <InputRepo
                label="Source Name"
                type="text"
                name="source_name"
                value={formData.source_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Abstract */}
            <div className="mb-4">
              <InputRepo
                label="Abstract"
                type="textarea"
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tech Stack Filters */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Filter
                title="Frontend"
                options={frontendOptions}
                selectedOptions={formData.frontend_tech}
                onSelect={(selectedOptions) =>
                  handleTechStackChange("frontend_tech", selectedOptions)
                }
              />

              <Filter
                title="Backend"
                options={backendOptions}
                selectedOptions={formData.backend_tech}
                onSelect={(selectedOptions) =>
                  handleTechStackChange("backend_tech", selectedOptions)
                }
              />

              <Filter
                title="Database"
                options={databaseOptions}
                selectedOptions={formData.database_tech}
                onSelect={(selectedOptions) =>
                  handleTechStackChange("database_tech", selectedOptions)
                }
              />
            </div>

            {/* Project Source Code URL */}
            <div className="mb-4">
              <InputRepo
                label="Project Source Code URL"
                type="url"
                name="project_source_code_url"
                value={formData.project_source_code_url}
                onChange={handleChange}
                required
              />
            </div>

            {/* Profile Photo Upload */}
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Current Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200"></div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Profile Photo
                </label>
                <label className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600">
                  Choose Photo
                  <input
                    type="file"
                    name="image_file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden" // Hide default file input
                  />
                </label>

                {imageFileName && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selected File: {imageFileName}
                  </p>
                )}
              </div>
            </div>

            {/* Project Report Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Project Report
              </label>
              {formData.project_report_url && (
                <a
                  href={formData.project_report_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  View Current Project Report
                </a>
              )}
              <div className="flex items-center mt-2">
                {/* Custom styled file input */}
                <label className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600">
                  Choose File
                  <input
                    type="file"
                    name="project_report_file"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="hidden" // Hide default file input
                  />
                </label>
                {projectReportFileName ? (
                  <p className="ml-4 text-sm text-gray-500">
                    {projectReportFileName}
                  </p>
                ) : (
                  <p className="ml-4 text-sm text-gray-400">No file chosen</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isLoadingAction}
              >
                {isLoadingAction ? "Submitting..." : id ? "Update" : "Submit"}
              </button>
            </div>

            {isSuccess && (
              <p className="text-green-500 mt-4">
                Repository {id ? "updated" : "added"} successfully!
              </p>
            )}
            {isError && (
              <p className="text-red-500 mt-4">
                Error occurred while {id ? "updating" : "adding"} repository.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AddRepositories;
