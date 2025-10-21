import axios from "axios";
// import axiosSecure from "../utils/axiosSecure";
import type {Ramo} from "../Types";

const baseUrl = '/api/courses';

const getAll = () => {
    const request = axios.get<Ramo[]>(baseUrl)
    return request.then(response => response.data)
}

const getCourse = (id: string) => {
  const request = axios.get<Ramo>(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default {
  getAll,
  getCourse
};
