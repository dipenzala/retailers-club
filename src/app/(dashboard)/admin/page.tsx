export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-8 bg-[var(--bg)]">
      <h1 className="text-3xl font-extrabold capitalize text-[var(--text)]">admin Dashboard</h1>
      <p className="text-[var(--muted)] mt-2">Skeleton ready — DB + API wiring next phase.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="glass rounded-2xl p-6 h-32 bg-white" />
        ))}
      </div>
    </div>
  );
}
