import { Routes, Route } from 'react-router-dom'
import { PageLayout } from './components/layout/PageLayout'
import { NewSubmission } from './pages/NewSubmission'
import { SubmissionResult } from './pages/SubmissionResult'
import { Submissions } from './pages/Submissions'
import { Portfolio } from './pages/Portfolio'

export default function App() {
  return (
    <PageLayout>
      <Routes>
        <Route path="/" element={<NewSubmission />} />
        <Route path="/result/:id" element={<SubmissionResult />} />
        <Route path="/history" element={<Submissions />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </PageLayout>
  )
}
