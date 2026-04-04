import axios from 'axios'
import type {
  SubmissionInput,
  Submission,
  PaginatedSubmissions,
  PortfolioSummary,
} from '../types'

const api = axios.create({ baseURL: '/api' })

export async function createSubmission(data: SubmissionInput): Promise<Submission> {
  const res = await api.post('/submissions', data)
  return res.data
}

export async function getSubmission(id: string): Promise<Submission> {
  const res = await api.get(`/submissions/${id}`)
  return res.data
}

export async function listSubmissions(page = 1, perPage = 20): Promise<PaginatedSubmissions> {
  const res = await api.get('/submissions', { params: { page, per_page: perPage } })
  return res.data
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const res = await api.get('/portfolio/summary')
  return res.data
}
