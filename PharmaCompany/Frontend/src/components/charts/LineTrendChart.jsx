import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts'

const LineTrendChart = ({ data, showForecast = false }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.08)" />
        <XAxis 
          dataKey="week" 
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
          stroke="rgba(0, 0, 0, 0.15)"
        />
        <YAxis 
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
          stroke="rgba(0, 0, 0, 0.15)"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        />
        <Legend />
        
        {/* Historical data */}
        <Line 
          type="monotone" 
          dataKey="actual" 
          stroke="#dca349" 
          strokeWidth={2}
          name="Actual Cases"
          dot={{ fill: '#dca349', r: 4 }}
        />
        
        {/* Forecast data */}
        {showForecast && (
          <>
            <Area
              type="monotone"
              dataKey="forecastUpper"
              fill="rgba(220, 163, 73, 0.15)"
              stroke="none"
              fillOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="forecastLower"
              fill="rgba(220, 163, 73, 0.15)"
              stroke="none"
              fillOpacity={0.5}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="#b8873d" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Forecast"
              dot={{ fill: '#b8873d', r: 4 }}
            />
          </>
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default LineTrendChart
