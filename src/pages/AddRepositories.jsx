import React, { useState, useEffect } from 'react';
import InputRepo from '../components/InputRepo';
import { useAddRepoMutation } from '../redux/repoApi';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary'; // For image and PDF upload

const AddRepositories = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',  // Replaced description with abstract
    source_name: '',
    image_file: null,
    github_link: '',
    project_report_file: null,  // New state for project report (PDF)
    project_source_code_url: '',  // URL for source code
    matric: '',  // State to store matricNo
  });

  const [addRepo, { isLoading, isSuccess, isError }] = useAddRepoMutation(); // Hook for mutation

  // Load matricNo from localStorage when the component mounts
  useEffect(() => {
    const storedMatricNo = localStorage.getItem('matricNo');
    if (storedMatricNo) {
      setFormData((prevData) => ({ ...prevData, matric: storedMatricNo }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload the image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(formData.image_file);

      if (!imageUrl) {
        console.error("Image upload failed");
        return;
      }

      // Upload the project report PDF to Cloudinary
      const projectReportUrl = await uploadImageToCloudinary(formData.project_report_file);

      if (!projectReportUrl) {
        console.error("Project report upload failed");
        return;
      }

      // Prepare data to send to Supabase
      const repoData = {
        title: formData.title,
        abstract: formData.abstract,  // Abstract instead of description
        source_name: formData.source_name,
        image_url: imageUrl,  // Image URL
        github_link: formData.github_link,
        matric: formData.matric,  // MatricNo from localStorage
        project_report_url: projectReportUrl,  // Uploaded PDF URL
        project_source_code_url: formData.project_source_code_url,  // Plain URL
      };

      // Call the mutation to insert repo data
      await addRepo(repoData);

      // Clear the form after successful submission
      setFormData({
        title: '',
        abstract: '',
        source_name: '',
        image_file: null,
        github_link: '',
        project_report_file: null,
        project_source_code_url: '',
        matric: formData.matric,  // Keep matric value
      });

    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  const formFields = [
    { label: 'Title', type: 'text', name: 'title', value: formData.title },
    { label: 'Abstract', type: 'textarea', name: 'abstract', value: formData.abstract },  // Abstract field
    { label: 'Source Name', type: 'text', name: 'source_name', value: formData.source_name },
    { label: 'Image Upload', type: 'file', name: 'image_file', accept: 'image/*', onChange: handleFileChange },
    { label: 'GitHub Link', type: 'url', name: 'github_link', value: formData.github_link },
    { label: 'Project Report (PDF)', type: 'file', name: 'project_report_file', accept: 'application/pdf', onChange: handleFileChange },  // PDF file upload
    { label: 'Project Source Code URL', type: 'url', name: 'project_source_code_url', value: formData.project_source_code_url },  // Source code URL
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6 text-gray-700 text-center">AddRepositories</h1>

      <div className="min-h-screen flex flex-col justify-center items-center p-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          {formFields.map((field) => (
            <InputRepo
              key={field.name}
              label={field.label}
              type={field.type}
              name={field.name}
              value={field.value}
              onChange={field.onChange || handleChange}
              required={true}
              accept={field.accept}
            />
          ))}

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          {isSuccess && <p className="text-green-500 mt-4">Repository added successfully!</p>}
          {isError && <p className="text-red-500 mt-4">Error occurred while adding repository.</p>}
        </form>
      </div>
    </div>
  );
};

export default AddRepositories;
