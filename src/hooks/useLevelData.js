import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'

const API = axios.create({ baseURL: 'http://localhost:4000' })

export const useLevel1 = () => {
  return useQuery({
    queryKey: ['level1FromDB'],
    queryFn: () => API.get('/level1').then((res) => res.data),
  })
}

export const useLevel2 = (level1Id) => {
  return useQuery({
    queryKey: ['level2', level1Id],
    queryFn: () =>
      API.get(`/level2?level1Id=${level1Id}`).then((res) => res.data),
    enabled: !!level1Id,
  })
}

export const useLevel3 = (level2Id) => {
  return useQuery({
    queryKey: ['level3', level2Id],
    queryFn: () =>
      API.get(`/level3?level2Id=${level2Id}`).then((res) => res.data),
    enabled: !!level2Id,
  })
}

export const useLevel4 = (level3Id) => {
  return useQuery({
    queryKey: ['level4', level3Id],
    queryFn: () =>
      API.get(`/level4?level3Id=${level3Id}`).then((res) => res.data),
    enabled: !!level3Id,
  })
}
