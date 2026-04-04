import { Card } from '../components/ui/Card'
import { SubmissionForm } from '../components/forms/SubmissionForm'
import { Shield, Clock, Zap } from 'lucide-react'

export function NewSubmission() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">New Underwriting Submission</h1>
        <p className="text-gray-500 text-sm">
          Enter the business details below to generate an automated risk assessment, coverage recommendation, and premium estimate.
        </p>
        <div className="flex items-center gap-6 mt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-teal" /> Instant scoring
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-teal" /> 6-factor risk model
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal" /> Results in seconds
          </span>
        </div>
      </div>
      <Card>
        <SubmissionForm />
      </Card>
    </div>
  )
}
