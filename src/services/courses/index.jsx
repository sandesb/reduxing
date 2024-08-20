import axios from 'axios';

const BASE_URL = 'http://localhost:3001/courses';

export const getCourses = async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  };

// export const addCourse = async (course) => {
//   try {
//     const response = await axios.post(BASE_URL, course);
//     return response.data;
//   } catch (error) {
//     console.error('Error adding course:', error);
//     throw error;
//   }
// };




//   export const updateCourse = async (id, updatedCourse) => {
//     try {
//       const response = await axios.put(`${BASE_URL}/${id}`, updatedCourse);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating course:', error);
//       throw error;
//     }
//   };
  
//   export const deleteCourse = async (id) => {
//     try {
//       console.log(`Sending DELETE request to: ${BASE_URL}/${id}`);
//       await axios.delete(`${BASE_URL}/${id}`);
//       console.log('Course deleted successfully');
//     } catch (error) {
//       console.error('Error deleting course:', error.response ? error.response.data : error.message);
//       throw error;
//     }
//   };
  
// // You can also add other CRUD operations here later (getCourses, updateCourse, deleteCourse)
