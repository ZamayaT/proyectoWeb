import axios from "axios";
// import axiosSecure from "../utils/axiosSecure";
import type {Ramo} from "../Types/Types";
import axiosSecure from "../utils/axiosSecure"

const baseUrl = '/api/courses';

const getAll = () => {
  const request = axios.get<Ramo[]>(baseUrl)
  return request.then(response => response.data)
}

const getCourse = (id: string) => {
  const request = axios.get<Ramo>(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const deleteCourse = (id: string) => {
  return axiosSecure.delete(`${baseUrl}/${id}`).then(res => res.data);
};

const createCourse = (newCourse: Ramo) => {
  return axiosSecure.post<Ramo>(baseUrl, newCourse).then(res => res.data);
};

const getOnlyElectives = () => {
  const request = axios.get<Ramo[]>(`${baseUrl}/electives`)
  return request.then(response => response.data? response.data : []);
}

const getOnlyRequired = () => {
  const request = axios.get<Ramo[]>(`${baseUrl}/required`)
  return request.then(response => response.data);
}

export default {
  getAll,
  getCourse,
  deleteCourse,
  createCourse,
  getOnlyElectives,
  getOnlyRequired
};
