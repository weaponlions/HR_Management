import API from "../api";

export const getAttendance = async (search, status) => {
  const { data } = await API.get(`/attendance/today?search=${search}&status=${status}`);
  return data;
};

export const markAttendance = async (_id, status) => {
  const { data } = await API.post(`/attendance`, {employeeId: _id, status});
  return data;
};
