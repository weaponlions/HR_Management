import API from "../api";


export const addNewLeave = async (leaveData) => {
  const { data } = await API.post("/leaves", leaveData);
  return data;
};

export const getLeave = async (search, status) => {
  const { data } = await API.get(`/leaves?employeeId=${search}&status=${status}`);
  return data;
};

export const updateLeaveStatus = async (_id, status) => {
  const { data } = await API.put(`/leaves/${_id}/status`, {status});
  return data;
};

export const downloadLeaveDocument = async (id) => {  
  const response = await API.get(`/leaves/${id}/download`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `document-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
};
