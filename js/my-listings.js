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

  const container = document.getElementById('my-listings-container');
  const client = window.supabaseClient || window.supabase;

  if (!client) {
    if (container) container.innerHTML = '';
    showMessage('Supabase client is not configured.', 'error');
    return;
  }

  try {
    // Explicit filter by seller_id to ensure only the user's listings appear
    const { data: listings, error } = await client
      .from('listings')
      .select('course_code, isbn, condition, trade_type, price_kwd, status, edition_verified, created_at')
      .eq('seller_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      if (container) container.innerHTML = '';
      showMessage(error.message || 'Failed to load listings.', 'error');
      return;
    }

    if (!container) return;
    container.innerHTML = '';

    if (!listings || listings.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'card-desc';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.marginTop = '1rem';

      const textNode = document.createTextNode('You have no listings yet. ');
      emptyMsg.appendChild(textNode);

      const sellLink = document.createElement('a');
      sellLink.href = 'sell.html';
      sellLink.textContent = 'Sell a textbook';
      sellLink.style.color = 'var(--accent)';
      sellLink.style.fontWeight = '600';
      sellLink.style.textDecoration = 'none';
      emptyMsg.appendChild(sellLink);

      container.appendChild(emptyMsg);
      return;
    }

    const tableWrapper = document.createElement('div');
    tableWrapper.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.className = 'listings-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Course', 'ISBN', 'Condition', 'Trade Type', 'Price (KWD)', 'Status', 'Published'].forEach((headingText) => {
      const th = document.createElement('th');
      th.textContent = headingText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.id = 'my-listings-body';

    listings.forEach((listing) => {
      const tr = document.createElement('tr');

      const tdCourse = document.createElement('td');
      tdCourse.textContent = listing.course_code || '';
      tr.appendChild(tdCourse);

      const tdIsbn = document.createElement('td');
      tdIsbn.textContent = listing.isbn || '';
      tr.appendChild(tdIsbn);

      const tdCondition = document.createElement('td');
      tdCondition.textContent = listing.condition || '';
      tr.appendChild(tdCondition);

      const tdTradeType = document.createElement('td');
      tdTradeType.textContent = listing.trade_type || '';
      tr.appendChild(tdTradeType);

      const tdPrice = document.createElement('td');
      const hasPrice = listing.price_kwd !== null && listing.price_kwd !== undefined && listing.price_kwd !== '';
      tdPrice.textContent = hasPrice ? String(listing.price_kwd) : '—';
      tr.appendChild(tdPrice);

      const tdStatus = document.createElement('td');
      tdStatus.textContent = listing.status || '';
      tr.appendChild(tdStatus);

      const tdPublished = document.createElement('td');
      tdPublished.textContent = listing.edition_verified ? 'Published' : 'Not published';
      tr.appendChild(tdPublished);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);
  } catch (err) {
    if (container) container.innerHTML = '';
    showMessage(err.message || 'An unexpected error occurred while loading listings.', 'error');
  }
});
