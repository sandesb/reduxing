import axios from 'axios';

const BASE_URL = 'http://localhost:3001/courses';

const addCourse = async (course) => {
  try {
    const response = await axios.post(BASE_URL, course);
    return response.data;
  } catch (error) {
    console.error('Error adding course:', error);
    throw error;
  }
};

const getCourses = async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  };

// You can also add other CRUD operations here later (getCourses, updateCourse, deleteCourse)

export { addCourse, getCourses };
