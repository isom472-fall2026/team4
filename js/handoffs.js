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

  const container = document.getElementById('handoffs-container');
  const client = window.supabaseClient || window.supabase;

  if (!client) {
    if (container) container.innerHTML = '';
    showMessage('Supabase client is not configured.', 'error');
    return;
  }

  async function loadHandoffs() {
    clearMessage();

    try {
      const { data: requests, error } = await client
        .from('exchange_requests')
        .select('request_id, buyer_id, proposed_time, status, campus_locations(name, building), listings(listing_id, seller_id, course_code, syllabus_books(title))')
        .eq('status', 'accepted')
        .gt('proposed_time', new Date().toISOString())
        .order('proposed_time', { ascending: true });

      if (error) {
        if (container) container.innerHTML = '';
        showMessage(error.message || 'Failed to load upcoming handoffs.', 'error');
        return;
      }

      if (!container) return;
      container.innerHTML = '';

      const userHandoffs = (requests || []).filter((req) => {
        const listing = Array.isArray(req.listings) ? req.listings[0] : req.listings;
        const sellerId = listing ? listing.seller_id : null;
        return req.buyer_id === profile.id || sellerId === profile.id;
      });

      if (userHandoffs.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'card-desc';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.marginTop = '1rem';
        emptyMsg.textContent = 'No upcoming handoffs.';
        container.appendChild(emptyMsg);
        return;
      }

      const tableWrapper = document.createElement('div');
      tableWrapper.style.overflowX = 'auto';

      const table = document.createElement('table');
      table.className = 'handoffs-table';

      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['When', 'Book', 'Place', 'Building', 'You are'].forEach((headingText) => {
        const th = document.createElement('th');
        th.textContent = headingText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');

      userHandoffs.forEach((req) => {
        const tr = document.createElement('tr');

        const tdWhen = document.createElement('td');
        if (req.proposed_time) {
          const d = new Date(req.proposed_time);
          tdWhen.textContent = isNaN(d.getTime()) ? '—' : d.toLocaleString();
        } else {
          tdWhen.textContent = '—';
        }
        tr.appendChild(tdWhen);

        const listing = Array.isArray(req.listings) ? req.listings[0] : req.listings;
        const syllabusBook = listing && listing.syllabus_books
          ? (Array.isArray(listing.syllabus_books) ? listing.syllabus_books[0] : listing.syllabus_books)
          : null;
        const title = syllabusBook && syllabusBook.title ? syllabusBook.title : '';
        const courseCode = listing && listing.course_code ? listing.course_code : '';

        let bookDisplay = '—';
        if (title && courseCode) {
          bookDisplay = `${title} (${courseCode})`;
        } else if (title) {
          bookDisplay = title;
        } else if (courseCode) {
          bookDisplay = courseCode;
        }

        const tdBook = document.createElement('td');
        tdBook.textContent = bookDisplay;
        tr.appendChild(tdBook);

        const loc = Array.isArray(req.campus_locations) ? req.campus_locations[0] : req.campus_locations;
        const tdPlace = document.createElement('td');
        tdPlace.textContent = (loc && loc.name) ? loc.name : '—';
        tr.appendChild(tdPlace);

        const tdBuilding = document.createElement('td');
        tdBuilding.textContent = (loc && loc.building) ? loc.building : '—';
        tr.appendChild(tdBuilding);

        const tdRole = document.createElement('td');
        tdRole.textContent = req.buyer_id === profile.id ? 'Buyer' : 'Seller';
        tr.appendChild(tdRole);

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      tableWrapper.appendChild(table);
      container.appendChild(tableWrapper);
    } catch (err) {
      if (container) container.innerHTML = '';
      showMessage(err.message || 'An unexpected error occurred while loading upcoming handoffs.', 'error');
    }
  }

  await loadHandoffs();
});
