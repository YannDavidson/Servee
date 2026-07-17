export default function LoadingMenu() {
  return (
    <main className="shell" aria-busy="true" aria-label="Loading restaurant menu">
      <header className="topbar">
        <div className="wordmark">Serv<span>ee</span></div>
        <div className="skeleton skeleton-pill" />
      </header>
      <section className="hero">
        <div className="skeleton skeleton-short" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-copy" />
      </section>
      <div className="skeleton skeleton-search" />
      <section className="menu-grid">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
      </section>
    </main>
  );
}
