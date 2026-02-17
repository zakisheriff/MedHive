const InsightCard = ({ title, children, className = '' }) => {
  return (
    <div className={`card p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
      )}
      {children}
    </div>
  )
}

export default InsightCard
