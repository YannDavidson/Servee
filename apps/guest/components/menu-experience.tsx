"use client";

import { useMemo, useState } from "react";
import type { MenuItem, RestaurantMenu } from "../lib/menu-fixtures";

type CartLine = {
  key: string;
  itemId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  modifierIds: string[];
  modifierNames: string[];
  notes: string;
};

type ItemDraft = {
  item: MenuItem;
  quantity: number;
  modifierIds: string[];
  notes: string;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function lineKey(itemId: string, modifierIds: string[], notes: string) {
  return `${itemId}:${[...modifierIds].sort().join(",")}:${notes.trim().toLowerCase()}`;
}

export function MenuExperience({ menu, tableNumber }: { menu: RestaurantMenu; tableNumber: string }) {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<ItemDraft | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menu.items.filter((item) => {
      const matchesCategory = activeCategory === "Popular" ? item.featured : item.category === activeCategory;
      const matchesSearch = !query || `${item.name} ${item.description}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, menu.items, search]);

  const itemCount = cart.reduce((total, line) => total + line.quantity, 0);
  const subtotalCents = cart.reduce((total, line) => total + line.quantity * line.unitPriceCents, 0);

  function openItem(item: MenuItem) {
    if (!item.available) return;
    setDraft({ item, quantity: 1, modifierIds: [], notes: "" });
  }

  function toggleModifier(modifierId: string) {
    setDraft((current) => {
      if (!current) return current;
      const modifierIds = current.modifierIds.includes(modifierId)
        ? current.modifierIds.filter((id) => id !== modifierId)
        : [...current.modifierIds, modifierId];
      return { ...current, modifierIds };
    });
  }

  function addDraftToCart() {
    if (!draft) return;
    const selectedModifiers = (draft.item.modifiers ?? []).filter((modifier) => draft.modifierIds.includes(modifier.id));
    const unitPriceCents = draft.item.priceCents + selectedModifiers.reduce((sum, modifier) => sum + modifier.priceCents, 0);
    const key = lineKey(draft.item.id, draft.modifierIds, draft.notes);

    setCart((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) {
        return current.map((line) => line.key === key ? { ...line, quantity: line.quantity + draft.quantity } : line);
      }
      return [
        ...current,
        {
          key,
          itemId: draft.item.id,
          name: draft.item.name,
          quantity: draft.quantity,
          unitPriceCents,
          modifierIds: draft.modifierIds,
          modifierNames: selectedModifiers.map((modifier) => modifier.name),
          notes: draft.notes.trim()
        }
      ];
    });
    setDraft(null);
  }

  function changeLineQuantity(key: string, delta: number) {
    setCart((current) => current
      .map((line) => line.key === key ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0));
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="wordmark">Serv<span>ee</span></div>
        <div className="table-pill" aria-label={`Current table ${tableNumber}`}>Table {tableNumber}</div>
      </header>

      <section className="hero">
        <p className="eyebrow">Welcome to</p>
        <h1>{menu.restaurantName}</h1>
        <p>{menu.tagline}</p>
      </section>

      <label className="search-box">
        <span className="sr-only">Search menu</span>
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search dishes, drinks and ingredients"
        />
      </label>

      <nav className="categories" aria-label="Menu categories">
        {menu.categories.map((category) => (
          <button
            className={activeCategory === category ? "category active" : "category"}
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      <section className="section-heading">
        <div>
          <p className="eyebrow">{activeCategory === "Popular" ? "Chef favorites" : "Explore"}</p>
          <h2>{activeCategory}</h2>
        </div>
        <span className="result-count">{visibleItems.length} items</span>
      </section>

      {visibleItems.length ? (
        <section className="menu-grid" aria-live="polite">
          {visibleItems.map((item) => (
            <article className={item.available ? "menu-card" : "menu-card unavailable"} key={item.id}>
              <button className="menu-card-trigger" type="button" onClick={() => openItem(item)} disabled={!item.available}>
                <div className="dish-art" aria-hidden="true">{item.emoji}</div>
                <div className="menu-card-body">
                  <div className="item-row">
                    <h3>{item.name}</h3>
                    <strong>{money.format(item.priceCents / 100)}</strong>
                  </div>
                  <p>{item.description}</p>
                  <span className="availability">{item.available ? "Customize and add" : "Currently unavailable"}</span>
                </div>
              </button>
              {item.available && <button className="add-button" type="button" onClick={() => openItem(item)} aria-label={`Customize ${item.name}`}>+</button>}
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state" aria-live="polite">
          <div aria-hidden="true">🍽️</div>
          <h2>No menu items found</h2>
          <p>Try another category or clear your search.</p>
          <button type="button" onClick={() => { setSearch(""); setActiveCategory("Popular"); }}>Show popular items</button>
        </section>
      )}

      <button className="cart-bar" type="button" onClick={() => setCartOpen(true)} disabled={!itemCount}>
        <span>View order · {itemCount} {itemCount === 1 ? "item" : "items"}</span>
        <span>{money.format(subtotalCents / 100)}</span>
      </button>

      {draft && (
        <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDraft(null); }}>
          <section className="sheet" role="dialog" aria-modal="true" aria-labelledby="item-title">
            <button className="close-button" type="button" onClick={() => setDraft(null)} aria-label="Close item details">×</button>
            <div className="sheet-art" aria-hidden="true">{draft.item.emoji}</div>
            <h2 id="item-title">{draft.item.name}</h2>
            <p className="sheet-description">{draft.item.description}</p>

            {!!draft.item.modifiers?.length && (
              <fieldset className="modifier-list">
                <legend>Make it yours</legend>
                {draft.item.modifiers.map((modifier) => (
                  <label key={modifier.id}>
                    <input type="checkbox" checked={draft.modifierIds.includes(modifier.id)} onChange={() => toggleModifier(modifier.id)} />
                    <span>{modifier.name}</span>
                    <strong>+{money.format(modifier.priceCents / 100)}</strong>
                  </label>
                ))}
              </fieldset>
            )}

            <label className="notes-field">
              <span>Special instructions</span>
              <textarea
                value={draft.notes}
                maxLength={180}
                onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                placeholder="Allergies or preparation requests"
              />
            </label>

            <div className="sheet-actions">
              <div className="quantity-control" aria-label="Quantity">
                <button type="button" onClick={() => setDraft({ ...draft, quantity: Math.max(1, draft.quantity - 1) })} aria-label="Decrease quantity">−</button>
                <span aria-live="polite">{draft.quantity}</span>
                <button type="button" onClick={() => setDraft({ ...draft, quantity: draft.quantity + 1 })} aria-label="Increase quantity">+</button>
              </div>
              <button className="primary-button" type="button" onClick={addDraftToCart}>
                Add · {money.format((draft.quantity * (draft.item.priceCents + (draft.item.modifiers ?? []).filter((modifier) => draft.modifierIds.includes(modifier.id)).reduce((sum, modifier) => sum + modifier.priceCents, 0))) / 100)}
              </button>
            </div>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <section className="sheet cart-sheet" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <button className="close-button" type="button" onClick={() => setCartOpen(false)} aria-label="Close order">×</button>
            <p className="eyebrow">Table {tableNumber}</p>
            <h2 id="cart-title">Your order</h2>

            {cart.length ? (
              <div className="cart-lines">
                {cart.map((line) => (
                  <article className="cart-line" key={line.key}>
                    <div>
                      <h3>{line.name}</h3>
                      {!!line.modifierNames.length && <p>{line.modifierNames.join(" · ")}</p>}
                      {line.notes && <p>“{line.notes}”</p>}
                      <strong>{money.format((line.quantity * line.unitPriceCents) / 100)}</strong>
                    </div>
                    <div className="quantity-control compact" aria-label={`Quantity for ${line.name}`}>
                      <button type="button" onClick={() => changeLineQuantity(line.key, -1)} aria-label={`Remove one ${line.name}`}>−</button>
                      <span>{line.quantity}</span>
                      <button type="button" onClick={() => changeLineQuantity(line.key, 1)} aria-label={`Add one ${line.name}`}>+</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-cart"><p>Your order is empty.</p></div>
            )}

            <div className="cart-summary">
              <span>Subtotal</span>
              <strong>{money.format(subtotalCents / 100)}</strong>
            </div>
            <button className="primary-button full" type="button" disabled={!cart.length}>Continue to review</button>
            <p className="fine-print">Taxes and service charges are calculated when the restaurant confirms your order.</p>
          </section>
        </div>
      )}
    </main>
  );
}
