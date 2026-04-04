import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { createSubmission } from '../../api/client'
import type { SubmissionInput } from '../../types'
import { ArrowRight, Building2, Users, AlertTriangle } from 'lucide-react'

const industryOptions = [
  { value: 'construction', label: 'Construction' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'technology', label: 'Technology' },
]

const locationOptions = [
  { value: 'low', label: 'Low — Rural / low-crime area' },
  { value: 'medium', label: 'Medium — Suburban / standard area' },
  { value: 'high', label: 'High — Urban / flood-prone area' },
  { value: 'very_high', label: 'Very High — High-crime / coastal area' },
]

function SectionHeader({ step, icon: Icon, title, subtitle }: {
  step: number
  icon: React.ElementType
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-teal" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">
          <span className="text-teal mr-1.5">Step {step}.</span>{title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}

// Format a number with commas: 3200000.50 => "3,200,000.50"
function formatWithCommas(value: string): string {
  if (!value) return ''
  // Split on decimal point
  const parts = value.split('.')
  // Add commas to integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

// Strip commas to get raw number string: "3,200,000.50" => "3200000.50"
function stripCommas(value: string): string {
  return value.replace(/,/g, '')
}

export function SubmissionForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<SubmissionInput>({
    business_name: '',
    industry_sector: '' as any,
    num_employees: 0,
    annual_revenue: 0,
    claims_last_3_years: 0,
    location_risk: '' as any,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Display values for formatted fields (text inputs with commas)
  const [revenueDisplay, setRevenueDisplay] = useState('')
  const [employeesDisplay, setEmployeesDisplay] = useState('')
  const [claimsDisplay, setClaimsDisplay] = useState('')

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.business_name.trim()) e.business_name = 'Business name is required'
    if (!form.industry_sector) e.industry_sector = 'Please select an industry'
    if (!form.num_employees || form.num_employees < 1) e.num_employees = 'Must be at least 1'
    if (form.annual_revenue < 0) e.annual_revenue = 'Must be 0 or greater'
    if (form.claims_last_3_years < 0) e.claims_last_3_years = 'Must be 0 or greater'
    if (!form.location_risk) e.location_risk = 'Please select a risk level'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      const result = await createSubmission(form)
      navigate(`/result/${result.id}`)
    } catch {
      setError('Failed to submit. Please check the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  function update<K extends keyof SubmissionInput>(key: K, value: SubmissionInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function handleRevenueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = stripCommas(e.target.value)
    // Allow digits, one decimal point, and decimal digits
    if (raw !== '' && !/^\d*\.?\d*$/.test(raw)) return
    setRevenueDisplay(formatWithCommas(raw))
    update('annual_revenue', raw === '' ? 0 : parseFloat(raw))
  }

  function handleEmployeesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = stripCommas(e.target.value)
    if (raw !== '' && !/^\d+$/.test(raw)) return
    setEmployeesDisplay(formatWithCommas(raw))
    update('num_employees', raw === '' ? 0 : parseInt(raw, 10))
  }

  function handleClaimsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw !== '' && !/^\d+$/.test(raw)) return
    setClaimsDisplay(raw)
    update('claims_last_3_years', raw === '' ? 0 : parseInt(raw, 10))
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {/* Step 1: Business Information */}
      <div className="mb-8">
        <SectionHeader
          step={1}
          icon={Building2}
          title="Business Information"
          subtitle="Tell us about the company applying for coverage"
        />
        <div className="space-y-4 pl-11">
          <Input
            label="Business Name"
            placeholder="e.g. Acme Builders Ltd"
            value={form.business_name}
            onChange={(e) => update('business_name', e.target.value)}
            error={errors.business_name}
            hint="Legal trading name of the business"
          />
          <Select
            label="Industry Sector"
            options={industryOptions}
            value={form.industry_sector}
            onChange={(e) => update('industry_sector', e.target.value as any)}
            error={errors.industry_sector}
            hint="Primary business activity — affects risk weighting"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 mb-8" />

      {/* Step 2: Company Profile */}
      <div className="mb-8">
        <SectionHeader
          step={2}
          icon={Users}
          title="Company Profile"
          subtitle="Size and revenue indicators"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
          <Input
            label="Number of Employees"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 45"
            value={employeesDisplay}
            onChange={handleEmployeesChange}
            error={errors.num_employees}
            hint="Total headcount including part-time"
          />
          <Input
            label="Annual Revenue"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 3,200,000"
            prefix="£"
            value={revenueDisplay}
            onChange={handleRevenueChange}
            error={errors.annual_revenue}
            hint="Last financial year turnover in GBP"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 mb-8" />

      {/* Step 3: Risk Factors */}
      <div className="mb-8">
        <SectionHeader
          step={3}
          icon={AlertTriangle}
          title="Risk Factors"
          subtitle="Claims history and geographic risk profile"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
          <Input
            label="Claims (Last 3 Years)"
            type="text"
            inputMode="numeric"
            placeholder="e.g. 0"
            value={claimsDisplay}
            onChange={handleClaimsChange}
            error={errors.claims_last_3_years}
            hint="Include all notified claims regardless of outcome"
          />
          <Select
            label="Location Risk"
            options={locationOptions}
            value={form.location_risk}
            onChange={(e) => update('location_risk', e.target.value as any)}
            error={errors.location_risk}
            hint="Based on primary business premises"
          />
        </div>
      </div>

      <div className="border-t border-gray-100 mb-6" />

      {/* Submit */}
      <div className="flex items-center justify-between pl-11">
        <p className="text-xs text-gray-400 hidden md:block">
          All fields are used to calculate a risk score between 0–100
        </p>
        <Button type="submit" variant="teal" loading={loading} className="w-full md:w-auto text-base px-8 py-3 shadow-md shadow-teal/20">
          Calculate Risk Score
          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </form>
  )
}
