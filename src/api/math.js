import apiClient from './client.js'

export const mathApi = {
  linearAlgebra: (payload) => apiClient.post('/math/linear-algebra', payload),
  calculus: (payload) => apiClient.post('/math/calculus', payload),
  statistics: (payload) => apiClient.post('/math/statistics', payload),
  parseImage: (formData) =>
    apiClient.post('/math/parse-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  saveGraph: (payload) => apiClient.post('/math/graphs', payload),
  getGraphs: () => apiClient.get('/math/graphs'),
  deleteGraph: (id) => apiClient.delete('/math/graphs/' + id),
}
