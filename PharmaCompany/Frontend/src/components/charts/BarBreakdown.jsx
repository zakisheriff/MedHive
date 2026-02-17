import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const BarBreakdown = ({ data, colors }) => {
  const defaultColors = ['#dca349', '#b8873d', '#956d31', '#7a592d', '#674b27']
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.08)" />
        <XAxis 
          type="number" 
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} 
          stroke="rgba(0, 0, 0, 0.15)" 
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
          stroke="rgba(0, 0, 0, 0.15)"
          width={120}
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
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors?.[index] || defaultColors[index % defaultColors.length]} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarBreakdown
