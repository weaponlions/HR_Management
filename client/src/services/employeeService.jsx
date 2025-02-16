import API from "../api";

export const getEmployees = async (search = "", position = "") => {
  const { data } = await API.get(`/employees?search=${search}&position=${position}`);
  return data;
};

export const getEmployeePosition = async () => {
  const { data } = await API.get("/employees/positions");
  return data;
};

export const addEmployee = async (employeeData) => {
  const { data } = await API.post("/employees", employeeData);
  return data;
};

export const updateEmployee = async (id, employeeData) => {
  const { data } = await API.put(`/employees/${id}`, employeeData);
  return data;
};

export const deleteEmployee = async (id) => {
  await API.delete(`/employees/${id}`);
};
