function showMessage(text, type) {
  const messageEl = document.getElementById('message');
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.className = 'message ' + type;
  messageEl.hidden = false;
}

function clearMessage() {
  const messageEl = document.getElementById('message');
  if (!messageEl) return;
  messageEl.textContent = '';
  messageEl.className = 'message';
  messageEl.hidden = true;
}

function renderCatalog(rows) {
  const container = document.getElementById('catalog-container');
  if (!container) return;

  try {
    container.textContent = '';

    const validRows = (rows || []).filter((row) => {
      if (row.status !== undefined && row.status !== 'available') return false;
      if (row.edition_verified !== undefined && row.edition_verified !== true) return false;
      return true;
    });

    if (validRows.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'card-desc';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.marginTop = '1rem';
      emptyMsg.textContent = 'No books listed yet.';
      container.appendChild(emptyMsg);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'catalog-grid';

    validRows.forEach((listing) => {
      const card = document.createElement('a');
      card.className = 'listing-card';
      card.href = 'listing.html?id=' + encodeURIComponent(listing.listing_id);

      const book = Array.isArray(listing.syllabus_books)
        ? (listing.syllabus_books[0] || {})
        : (listing.syllabus_books || {});
      const title = book.title || '—';

      const titleEl = document.createElement('h2');
      titleEl.className = 'listing-card-title book-title';
      titleEl.textContent = title;
      card.appendChild(titleEl);

      const detailsEl = document.createElement('div');
      detailsEl.className = 'listing-card-details';

      const courseRow = document.createElement('div');
      courseRow.className = 'listing-field listing-course';
      const courseLabel = document.createElement('span');
      courseLabel.className = 'listing-card-label';
      courseLabel.textContent = 'Course: ';
      const courseVal = document.createElement('span');
      courseVal.className = 'listing-card-value';
      courseVal.textContent = listing.course_code || '—';
      courseRow.appendChild(courseLabel);
      courseRow.appendChild(courseVal);
      detailsEl.appendChild(courseRow);

      const conditionRow = document.createElement('div');
      conditionRow.className = 'listing-field listing-condition';
      const conditionLabel = document.createElement('span');
      conditionLabel.className = 'listing-card-label';
      conditionLabel.textContent = 'Condition: ';
      const conditionVal = document.createElement('span');
      conditionVal.className = 'listing-card-value';
      conditionVal.textContent = listing.condition || '—';
      conditionRow.appendChild(conditionLabel);
      conditionRow.appendChild(conditionVal);
      detailsEl.appendChild(conditionRow);

      const tradeRow = document.createElement('div');
      tradeRow.className = 'listing-field listing-trade-type';
      const tradeLabel = document.createElement('span');
      tradeLabel.className = 'listing-card-label';
      tradeLabel.textContent = 'Trade Type: ';
      const tradeVal = document.createElement('span');
      tradeVal.className = 'listing-card-value';
      tradeVal.textContent = listing.trade_type || '—';
      tradeRow.appendChild(tradeLabel);
      tradeRow.appendChild(tradeVal);
      detailsEl.appendChild(tradeRow);

      const priceRow = document.createElement('div');
      priceRow.className = 'listing-field listing-price';
      const priceLabel = document.createElement('span');
      priceLabel.className = 'listing-card-label';
      priceLabel.textContent = 'Price (KWD): ';
      const priceVal = document.createElement('span');
      priceVal.className = 'listing-card-value';
      const hasPrice = listing.price_kwd !== null && listing.price_kwd !== undefined && listing.price_kwd !== '';
      priceVal.textContent = hasPrice ? String(listing.price_kwd) : '—';
      priceRow.appendChild(priceLabel);
      priceRow.appendChild(priceVal);
      detailsEl.appendChild(priceRow);

      card.appendChild(detailsEl);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  } catch (err) {
    showMessage((err && err.message) || 'An unexpected error occurred while rendering the catalog.', 'error');
  }
}

async function loadCatalog(filters = {}) {
  const container = document.getElementById('catalog-container');
  const client = window.supabaseClient || window.supabase;

  if (!client) {
    if (container) container.textContent = '';
    showMessage('Supabase client is not configured.', 'error');
    return;
  }

  clearMessage();

  try {
    const { data: listings, error } = await client
      .from('listings')
      .select('listing_id, course_code, isbn, condition, trade_type, price_kwd, created_at, syllabus_books(title, semester)')
      .eq('status', 'available')
      .eq('edition_verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      if (container) container.textContent = '';
      showMessage(error.message || 'Failed to load catalog.', 'error');
      return;
    }

    renderCatalog(listings || []);
  } catch (err) {
    if (container) container.textContent = '';
    showMessage((err && err.message) || 'An unexpected error occurred while loading the catalog.', 'error');
  }
}

window.loadCatalog = loadCatalog;
window.renderCatalog = renderCatalog;

document.addEventListener('DOMContentLoaded', async () => {
  const profile = await requireAuth();
  if (!profile) return;

  async function handleLogout() {
    const client = window.supabaseClient || window.supabase;
    if (client && client.auth) {
      await client.auth.signOut();
    }
    window.location.href = 'login.html';
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  await loadCatalog({});
});

