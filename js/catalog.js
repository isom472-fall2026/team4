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

function renderCatalog(rows, emptyText, showClearLink) {
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
      emptyMsg.textContent = emptyText || 'No books listed yet.';
      container.appendChild(emptyMsg);

      if (showClearLink) {
        const clearLink = document.createElement('a');
        clearLink.href = 'catalog.html';
        clearLink.textContent = 'Clear filters';
        clearLink.style.display = 'block';
        clearLink.style.textAlign = 'center';
        clearLink.style.marginTop = '0.5rem';
        container.appendChild(clearLink);
      }
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

      if (listing.edition_verified !== false && book && book.semester && String(book.semester).trim()) {
        const badge = document.createElement('span');
        badge.className = 'verified-badge';
        badge.textContent = 'Verified for ' + book.semester;
        card.appendChild(badge);
      }

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
      priceVal.textContent = hasPrice ? String(listing.price_kwd) : 'Swap';
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

function readFilters() {
  const courseCodeInput = document.getElementById('course-code-input');
  const titleIsbnInput = document.getElementById('title-isbn-input');
  const departmentSelect = document.getElementById('department-select');
  const tradeTypeSelect = document.getElementById('trade-type-select');
  const conditionChecked = document.querySelectorAll('input[name="condition"]:checked');
  const sortSelect = document.getElementById('sort-select');

  const course_code = courseCodeInput ? courseCodeInput.value.trim().toUpperCase() : '';
  const titleIsbnValue = titleIsbnInput ? titleIsbnInput.value.trim() : '';
  const department = departmentSelect ? departmentSelect.value : '';
  const trade_type = tradeTypeSelect ? tradeTypeSelect.value : '';
  const conditions = Array.from(conditionChecked).map((box) => box.value);
  const sort = sortSelect ? sortSelect.value : 'newest';

  let title = '';
  let isbn = '';

  const cleaned = titleIsbnValue.replace(/[\s-]/g, '');
  if (cleaned.length > 0 && /^\d+$/.test(cleaned)) {
    if (cleaned.length === 10 || cleaned.length === 13) {
      isbn = cleaned;
    } else {
      return { error: 'The ISBN must be 10 or 13 digits.' };
    }
  } else {
    title = titleIsbnValue;
  }

  return { course_code, title, isbn, department, trade_type, conditions, sort };
}

async function loadDepartments() {
  const deptSelect = document.getElementById('department-select');
  if (!deptSelect) return;

  const client = window.supabaseClient || window.supabase;
  if (!client) return;

  const { data: courses, error } = await client
    .from('courses')
    .select('department');

  if (error || !courses) return;

  const departments = Array.from(
    new Set(courses.map((c) => c.department).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  departments.forEach((dept) => {
    const opt = document.createElement('option');
    opt.value = dept;
    opt.textContent = dept;
    deptSelect.appendChild(opt);
  });
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
    let selectClause = (filters && filters.title)
      ? 'listing_id, course_code, isbn, condition, trade_type, price_kwd, created_at, syllabus_books!inner(title, semester)'
      : 'listing_id, course_code, isbn, condition, trade_type, price_kwd, created_at, syllabus_books(title, semester)';

    if (filters && filters.department) {
      selectClause += ', courses!inner(department)';
    }

    let query = client
      .from('listings')
      .select(selectClause)
      .eq('status', 'available')
      .eq('edition_verified', true);

    if (filters && filters.department) {
      query = query.eq('courses.department', filters.department);
    }

    if (filters && filters.course_code) {
      query = query.eq('course_code', filters.course_code);
    }

    if (filters && filters.title) {
      query = query.ilike('syllabus_books.title', '%' + filters.title + '%');
    }

    if (filters && filters.isbn) {
      query = query.eq('isbn', filters.isbn);
    }

    if (filters && filters.trade_type) {
      query = query.eq('trade_type', filters.trade_type);
    }

    if (filters && filters.conditions && filters.conditions.length > 0) {
      query = query.in('condition', filters.conditions);
    }

    if (filters && filters.sort === 'price') {
      query = query
        .order('price_kwd', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: listings, error } = await query;

    if (error) {
      if (container) container.textContent = '';
      showMessage(error.message || 'Failed to load catalog.', 'error');
      return;
    }

    let emptyText;
    let showClearLink = false;

    if (filters && (filters.trade_type || (filters.conditions && filters.conditions.length > 0))) {
      emptyText = 'No books match these filters.';
      showClearLink = true;
    } else if (filters && filters.department) {
      emptyText = 'No books listed yet for this department.';
    }

    renderCatalog(listings || [], emptyText, showClearLink);
  } catch (err) {
    if (container) container.textContent = '';
    showMessage((err && err.message) || 'An unexpected error occurred while loading the catalog.', 'error');
  }
}

window.loadCatalog = loadCatalog;
window.loadDepartments = loadDepartments;
window.renderCatalog = renderCatalog;
window.readFilters = readFilters;

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

  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const filters = readFilters();
      if (filters.error) {
        showMessage(filters.error, 'error');
        return;
      }
      history.replaceState(null, '', '?sort=' + encodeURIComponent(filters.sort));
      loadCatalog(filters);
    });
  }

  const sortParam = new URLSearchParams(location.search).get('sort');
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.value = sortParam === 'price' ? 'price' : 'newest';
  }

  await loadDepartments();
  await loadCatalog(readFilters());
});

