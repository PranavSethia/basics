import api from './api'

export const getEmployees = (params = {}) =>
  api.get('/employees', { params }).then(r => r.data)

export const getEmployee = (id) =>
  api.get(`/employees/${id}`).then(r => r.data)

export const createEmployee = (data) =>
  api.post('/employees', data).then(r => r.data)

export const updateEmployee = (id, data) =>
  api.put(`/employees/${id}`, data).then(r => r.data)

export const deleteEmployee = (id) =>
  api.delete(`/employees/${id}`).then(r => r.data)

export const getDashboardStats = () =>
  api.get('/employees/stats').then(r => r.data)
