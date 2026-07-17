export default function RestaurantNotFound() {
  return (
    <main className="shell centered-state">
      <div className="wordmark">Serv<span>ee</span></div>
      <div className="state-emoji" aria-hidden="true">🍽️</div>
      <h1>This menu is unavailable</h1>
      <p>The restaurant or table link may be inactive. Please ask a team member for a new QR code.</p>
      <a className="primary-link" href="/r/casa-palma/t/14">Open the demo menu</a>
    </main>
  );
}
