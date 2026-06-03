import axios from 'axios';


const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const BASE_URL = 'http://localhost:5000/api';

export const createTimetable = (data) =>
  axios.post(`${BASE_URL}/timetable`, data);

export const getAllTimetables = () =>
  axios.get(`${BASE_URL}/timetable`);

export const getTimetable = (id) =>
  axios.get(`${BASE_URL}/timetable/${id}`);

export const deleteTimetable = (id) =>
  axios.delete(`${BASE_URL}/timetable/${id}`);