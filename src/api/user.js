import apiClient from './client.js'

export const userApi = {
  getProfile: () => apiClient.get('/user/profile'),
  getHistory: (page = 0, size = 20) =>
    apiClient.get('/user/history?page=' + page + '&size=' + size),
}
