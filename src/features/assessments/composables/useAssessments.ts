import { api } from '@/shared/lib/api'

export interface Option {
  id: number
  text: string
}

export interface Question {
  id: number
  text: string
  image: string | null
  options: Option[]
}

export interface GeneratedQuestions {
  job_id: number
  status: GenerationJobStatus
  count: number
  created_count: number
  skipped_count: number
  failed_count: number
  questions: Question[]
}

export interface GenerationJob {
  id: number
  topic: string
  count: number
  target_score: number | null
  status: GenerationJobStatus
  created_at: string
  started_at: string | null
  finished_at: string | null
  error: string | null
  created_count: number
  skipped_count: number
  failed_count: number
  celery_task_id: string | null
  steps: GenerationStep[]
  stream_url: string
}

export interface GenerationStep {
  id: number
  question_index: number
  kind: GenerationStepKind
  status: GenerationStepStatus
  message: string
  data: string | null
  question: number | null
  created_at: string
}

export type GenerationJobStatus = 'pending' | 'running' | 'succeeded' | 'partial' | 'failed' | 'cancelled'

export type GenerationStepKind = 'architect' | 'storyteller' | 'critic' | 'publisher' | 'error'

export type GenerationStepStatus = 'started' | 'succeeded' | 'failed'


export async function getQuestions(jobId: number):Promise<GeneratedQuestions> {
  const {data} = await api.get<GeneratedQuestions>(`/generation/jobs/${jobId}/questions/`)
  return data

}

export interface GenerateQuestionsPayload {
  topic: string
  target_score: number | null
  count: number
}

export async function generateQuestions(payload: GenerateQuestionsPayload): Promise<GenerationJob> {

  const { data } = await api.post<GenerationJob>(`/generation/jobs/`, payload)
  return data
}