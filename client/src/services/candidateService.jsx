import API from "../api";

export const getCandidates = async (search = "", position = "", status = "") => {
  const { data } = await API.get(`/candidates?search=${search}&position=${position}&status=${status}`);
  return data;
};

export const addCandidate = async (candidateData) => {
  const { data } = await API.post("/candidates", candidateData);
  return data;
};

export const getCandidatePosition = async () => {
  const { data } = await API.get("/candidates/positions");
  return data;
};

export const updateCandidate = async (id, candidateData) => {
  const { data } = await API.put(`/candidates/${id}`, candidateData);
  return data;
};

export const updateCandidateStatus = async (id, candidateStatus) => {
  const { data } = await API.put(`/candidates/${id}/status`, {status: candidateStatus});
  return data;
};


export const deleteCandidate = async (id) => {
  await API.delete(`/candidates/${id}`);
};

export const downloadResume = async (id) => {
  const response = await API.get(`/candidates/${id}/download`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `resume-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
};
