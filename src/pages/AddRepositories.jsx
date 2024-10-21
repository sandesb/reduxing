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
    if (id && repoData && repoData.length > 0) {
      const repoDetails = repoData[0];
      setFormData({
        title: repoDetails.title || "",
        abstract: repoDetails.abstract || "",
        source_name: repoDetails.source_name || "",
        image_file: null,
        image_url: repoDetails.image_url || "",
        project_report_file: null,
        project_report_url: repoDetails.project_report_url || "",
        project_source_code_url: repoDetails.project_source_code_url || "",
        matric: repoDetails.matric || "",
        frontend_tech: repoDetails.frontend_tech || [],
        backend_tech: repoDetails.backend_tech || [],
        database_tech: repoDetails.database_tech || [],
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

      // Combine the tech stack fields into a JSON object
      const techStack = {
        frontend: formData.frontend_tech.join(", ") || null,
        backend: formData.backend_tech.join(", ") || null,
        database: formData.database_tech.join(", ") || null,
      };

      const repoPayload = {
        title: formData.title,
        abstract: formData.abstract,
        source_name: formData.source_name,
        image_url: imageUrl,
        matric: formData.matric,
        project_report_url: projectReportUrl,
        project_source_code_url: formData.project_source_code_url,
        tech_stack: techStack, // Send tech_stack in JSON format
      };

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

      <div className="min-h-screen flex flex-col justify-center items-center p-6">
        {isRepoLoading ? (
          <p>Loading repository data...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md"
          >
            {inputFields.map((field) => (
              <InputRepo
                key={field.name}
                label={field.label}
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={handleChange}
                required={field.required}
              />
            ))}

            {/* Tech Stack Filters */}
            <Filter
              title="Frontend Tech Stack"
              options={frontendOptions}
              selectedOptions={formData.frontend_tech}
              onSelect={(selectedOptions) =>
                handleTechStackChange("frontend_tech", selectedOptions)
              }
            />

            <Filter
              title="Backend Tech Stack"
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

            {/* Show current image and option to upload new one */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Image:
              </label>
              {formData.image_url && (
                <a
                  href={formData.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  View Current Image
                </a>
              )}
              <input
                type="file"
                name="image_file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {imageFileName && <p>Selected File: {imageFileName}</p>}
            </div>

            {/* Show current project report and option to upload new one */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Current Project Report:
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
              <input
                type="file"
                name="project_report_file"
                onChange={handleFileChange}
                accept="application/pdf"
              />
              {projectReportFileName && (
                <p>Selected File: {projectReportFileName}</p>
              )}
            </div>

            <div className="flex justify-center">
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
