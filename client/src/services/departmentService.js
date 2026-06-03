import api from './api'

export const getDepartments = () =>
  api.get('/departments').then(r => r.data)

export const getDepartment = (id) =>
  api.get(`/departments/${id}`).then(r => r.data)

export const createDepartment = (data) =>
  api.post('/departments', data).then(r => r.data)

export const updateDepartment = (id, data) =>
  api.put(`/departments/${id}`, data).then(r => r.data)

export const deleteDepartment = (id) =>
  api.delete(`/departments/${id}`).then(r => r.data)
