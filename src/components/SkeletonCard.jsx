export function SkeletonProjectCard() {
  return (
    <div className="skeleton-card">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div className="skeleton" style={{ width:40, height:40, borderRadius:'var(--radius-md)' }} />
        <div className="skeleton skeleton-line" style={{ width:'25%' }} />
      </div>
      <div className="skeleton skeleton-line title" />
      <div className="skeleton skeleton-line desc" />
      <div className="skeleton skeleton-line short" />
      <div className="skeleton skeleton-progress" />
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <div className="skeleton skeleton-line" style={{ width:'30%', height:10 }} />
        <div className="skeleton skeleton-line" style={{ width:'15%', height:10 }} />
      </div>
    </div>
  );
}

export function SkeletonTaskItem() {
  return (
    <div style={{
      display:'flex', gap:'1rem', alignItems:'flex-start',
      background:'var(--surface-container-lowest)',
      borderRadius:'var(--radius-lg)', padding:'1.25rem',
      boxShadow:'var(--shadow-card)',
    }}>
      <div className="skeleton" style={{ width:22, height:22, borderRadius:6, flexShrink:0 }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'0.5rem' }}>
        <div className="skeleton skeleton-line title" />
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <div className="skeleton skeleton-line" style={{ width:'20%', height:10, borderRadius:99 }} />
          <div className="skeleton skeleton-line" style={{ width:'25%', height:10, borderRadius:99 }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ width:60, height:32, borderRadius:'var(--radius-sm)', marginBottom:8 }} />
      <div className="skeleton skeleton-line" style={{ width:'60%', height:10 }} />
    </div>
  );
}
