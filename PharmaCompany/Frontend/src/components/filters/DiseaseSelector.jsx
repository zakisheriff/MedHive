import { Activity } from 'lucide-react'

const DiseaseSelector = ({ value, onChange }) => {
  const diseases = [
    'Dengue',
    'Leptospirosis',
    'Food Poisoning',
    'Malaria',
    'Typhoid',
    'Chickenpox'
  ]

  return (
    <div className="relative">
      <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: 'var(--color-text-dimmed)' }} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-6 py-3 bg-white border rounded-md text-base focus:outline-none focus:ring-2 appearance-none cursor-pointer transition-all"
        style={{ 
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-secondary)',
          borderRadius: 'var(--border-radius-sm)',
          minWidth: '180px'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'var(--color-primary)'
          e.target.style.backgroundColor = 'rgba(220, 163, 73, 0.05)'
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'var(--color-border)'
          e.target.style.backgroundColor = 'white'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)'
          e.target.style.ringColor = 'var(--color-primary)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border)'
        }}
      >
        {diseases.map(disease => (
          <option key={disease.toLowerCase()} value={disease.toLowerCase()}>
            {disease}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DiseaseSelector
