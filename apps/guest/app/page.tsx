const categories = ["Popular", "Starters", "Mains", "Drinks", "Desserts"];

const items = [
  { name: "Island Citrus Salmon", description: "Roasted salmon, citrus glaze, coconut rice and seasonal greens.", price: "$28", emoji: "🐟" },
  { name: "Golden Plantain Bowl", description: "Sweet plantain, black beans, avocado, pickled onions and herb sauce.", price: "$18", emoji: "🥑" },
  { name: "Coconut Tres Leches", description: "Soft coconut sponge, vanilla cream and toasted coconut.", price: "$10", emoji: "🍰" }
];

export default function GuestMenuPage() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="wordmark">Serv<span>ee</span></div>
        <button className="table-pill" type="button">Table 14</button>
      </header>

      <section className="hero">
        <p className="eyebrow">Welcome to</p>
        <h1>Casa Palma</h1>
        <p>Fresh Caribbean cooking, served with warmth.</p>
      </section>

      <nav className="categories" aria-label="Menu categories">
        {categories.map((category, index) => (
          <button className={index === 0 ? "category active" : "category"} key={category} type="button">
            {category}
          </button>
        ))}
      </nav>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Chef favorites</p>
          <h2>Popular right now</h2>
        </div>
        <button className="quiet-button" type="button">View all</button>
      </section>

      <section className="menu-grid">
        {items.map((item) => (
          <article className="menu-card" key={item.name}>
            <div className="dish-art" aria-hidden="true">{item.emoji}</div>
            <div className="menu-card-body">
              <div className="item-row">
                <h3>{item.name}</h3>
                <strong>{item.price}</strong>
              </div>
              <p>{item.description}</p>
              <button className="add-button" type="button" aria-label={`Add ${item.name}`}>+</button>
            </div>
          </article>
        ))}
      </section>

      <button className="cart-bar" type="button">
        <span>View order</span>
        <span>0 items</span>
      </button>
    </main>
  );
}
