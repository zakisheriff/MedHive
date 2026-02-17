import { useState } from 'react'
import { Download, Mail, FileText } from 'lucide-react'
import InsightCard from '../../components/cards/InsightCard'

const Reports = () => {
  const [reportConfig, setReportConfig] = useState({
    diseases: [],
    districts: [],
    weeks: 4,
    format: 'pdf'
  })

  const handleGenerate = () => {
    console.log('Generating report with config:', reportConfig)
    // In production, this would call the API
    alert('Report generation would be triggered here. Check console for config.')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Reports / Downloads</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Generate custom reports and export data
        </p>
      </div>

      {/* Report Generator */}
      <InsightCard title="Weekly Report Generator">
        <div className="space-y-6">
          {/* Disease Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Select Disease(s)
            </label>
            <select
              multiple
              className="w-full px-4 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-1"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--border-radius-sm)'
              }}
              size={5}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value)
                setReportConfig({ ...reportConfig, diseases: selected })
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            >
              <option value="dengue">Dengue</option>
              <option value="leptospirosis">Leptospirosis</option>
              <option value="food-poisoning">Food Poisoning</option>
              <option value="malaria">Malaria</option>
              <option value="typhoid">Typhoid</option>
              <option value="chickenpox">Chickenpox</option>
            </select>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-dimmed)' }}>Hold Ctrl/Cmd to select multiple diseases</p>
          </div>

          {/* District/Province Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Select Districts or Provinces
            </label>
            <select
              multiple
              className="w-full px-4 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-1"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--border-radius-sm)'
              }}
              size={5}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value)
                setReportConfig({ ...reportConfig, districts: selected })
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            >
              <option value="colombo">Colombo</option>
              <option value="gampaha">Gampaha</option>
              <option value="kalutara">Kalutara</option>
              <option value="kandy">Kandy</option>
              <option value="galle">Galle</option>
              <option value="matara">Matara</option>
              <option value="jaffna">Jaffna</option>
              <option value="batticaloa">Batticaloa</option>
            </select>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-dimmed)' }}>Hold Ctrl/Cmd to select multiple districts</p>
          </div>

          {/* Time Period */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Time Period (weeks)
            </label>
            <select
              value={reportConfig.weeks}
              onChange={(e) => setReportConfig({ ...reportConfig, weeks: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-1 cursor-pointer transition-all"
              style={{ 
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--border-radius-sm)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-border-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
            >
              <option value="2">Last 2 weeks</option>
              <option value="4">Last 4 weeks</option>
              <option value="8">Last 8 weeks</option>
              <option value="12">Last 12 weeks</option>
            </select>
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              Output Format
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={reportConfig.format === 'pdf'}
                  onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>PDF Summary</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={reportConfig.format === 'csv'}
                  onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>CSV Export</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="email"
                  checked={reportConfig.format === 'email'}
                  onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}
                  className="w-4 h-4"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Email-ready Insights</span>
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--border-radius-sm)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
            >
              {reportConfig.format === 'pdf' && <FileText className="w-5 h-5" />}
              {reportConfig.format === 'csv' && <Download className="w-5 h-5" />}
              {reportConfig.format === 'email' && <Mail className="w-5 h-5" />}
              Generate Report
            </button>
          </div>
        </div>
      </InsightCard>

      {/* Quick Downloads */}
      <InsightCard title="Quick Downloads">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-between p-4 border rounded-md transition-colors text-left" style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--border-radius-sm)' }}>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Latest Weekly Summary</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Last updated 2 hours ago</p>
            </div>
            <Download className="w-5 h-5" style={{ color: 'var(--color-text-dimmed)' }} />
          </button>

          <button className="flex items-center justify-between p-4 border rounded-md transition-colors text-left" style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--border-radius-sm)' }}>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Medicine Demand Forecast</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Next 4 weeks</p>
            </div>
            <Download className="w-5 h-5" style={{ color: 'var(--color-text-dimmed)' }} />
          </button>

          <button className="flex items-center justify-between p-4 border rounded-md transition-colors text-left" style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--border-radius-sm)' }}>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>District Risk Scores</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Current week</p>
            </div>
            <Download className="w-5 h-5" style={{ color: 'var(--color-text-dimmed)' }} />
          </button>

          <button className="flex items-center justify-between p-4 border rounded-md transition-colors text-left" style={{ borderColor: 'var(--color-border)', borderRadius: 'var(--border-radius-sm)' }}>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Historical Disease Trends</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Last 12 weeks</p>
            </div>
            <Download className="w-5 h-5" style={{ color: 'var(--color-text-dimmed)' }} />
          </button>
        </div>
      </InsightCard>
    </div>
  )
}

export default Reports
