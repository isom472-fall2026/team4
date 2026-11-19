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

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const client = window.supabaseClient || window.supabase;
      if (client && client.auth) {
        await client.auth.signOut();
      }
      window.location.href = 'login.html';
    });
  }

  const container = document.getElementById('my-requests-container');
  const client = window.supabaseClient || window.supabase;

  if (!client) {
    if (container) container.innerHTML = '';
    showMessage('Supabase client is not configured.', 'error');
    return;
  }

  try {
    const { data: requests, error } = await client
      .from('exchange_requests')
      .select('request_id, status, proposed_time, created_at, campus_locations(name), listings(listing_id, status, course_code, syllabus_books(title))')
      .eq('buyer_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      if (container) container.innerHTML = '';
      showMessage(error.message || 'Failed to load requests.', 'error');
      return;
    }

    if (!container) return;
    container.innerHTML = '';

    if (!requests || requests.length === 0) {
      clearMessage();
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'card-desc';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.marginTop = '1rem';

      const textNode = document.createTextNode('You have not requested any books yet. ');
      emptyMsg.appendChild(textNode);

      const catalogLink = document.createElement('a');
      catalogLink.href = 'catalog.html';
      catalogLink.textContent = 'Browse textbooks';
      catalogLink.style.color = 'var(--accent)';
      catalogLink.style.fontWeight = '600';
      catalogLink.style.textDecoration = 'none';
      emptyMsg.appendChild(catalogLink);

      container.appendChild(emptyMsg);
      return;
    }

    clearMessage();

    const tableWrapper = document.createElement('div');
    tableWrapper.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.className = 'requests-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Book', 'Proposed time', 'Place', 'Status', 'Actions'].forEach((headingText) => {
      const th = document.createElement('th');
      th.textContent = headingText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.id = 'my-requests-body';

    requests.forEach((req) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-request-id', req.request_id);

      const listing = Array.isArray(req.listings) ? req.listings[0] : req.listings;
      const syllabusBook = listing && listing.syllabus_books
        ? (Array.isArray(listing.syllabus_books) ? listing.syllabus_books[0] : listing.syllabus_books)
        : null;
      const title = syllabusBook && syllabusBook.title ? syllabusBook.title : '';
      const courseCode = listing && listing.course_code ? listing.course_code : '';

      let bookDisplay = '—';
      if (!listing || listing.status === 'removed') {
        bookDisplay = 'Listing removed';
      } else if (title && courseCode) {
        bookDisplay = `${title} (${courseCode})`;
      } else if (title) {
        bookDisplay = title;
      } else if (courseCode) {
        bookDisplay = courseCode;
      }

      const tdBook = document.createElement('td');
      tdBook.textContent = bookDisplay;
      tr.appendChild(tdBook);

      const tdTime = document.createElement('td');
      if (req.proposed_time) {
        const d = new Date(req.proposed_time);
        tdTime.textContent = isNaN(d.getTime()) ? '—' : d.toLocaleString();
      } else {
        tdTime.textContent = '—';
      }
      tr.appendChild(tdTime);

      const tdPlace = document.createElement('td');
      const loc = Array.isArray(req.campus_locations) ? req.campus_locations[0] : req.campus_locations;
      tdPlace.textContent = (loc && loc.name) ? loc.name : '—';
      tr.appendChild(tdPlace);

      const tdStatus = document.createElement('td');
      tdStatus.textContent = req.status || '—';
      tr.appendChild(tdStatus);

      const tdActions = document.createElement('td');
      tdActions.textContent = '';
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);
  } catch (err) {
    if (container) container.innerHTML = '';
    showMessage(err.message || 'An unexpected error occurred while loading requests.', 'error');
  }
});

