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

  const container = document.getElementById('incoming-requests-container');
  const client = window.supabaseClient || window.supabase;

  if (!client) {
    if (container) container.innerHTML = '';
    showMessage('Supabase client is not configured.', 'error');
    return;
  }

  async function loadRequests(preserveMessage = false) {
    if (!preserveMessage) {
      clearMessage();
    }

    try {
      const { data: requests, error } = await client
        .from('exchange_requests')
        .select('request_id, status, proposed_time, message, buyer_id, created_at, campus_locations(name), listings!inner(listing_id, seller_id, course_code, syllabus_books(title))')
        .eq('listings.seller_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (container) container.innerHTML = '';
        showMessage(error.message || 'Failed to load requests.', 'error');
        return;
      }

      if (!container) return;
      container.innerHTML = '';

      if (!requests || requests.length === 0) {
        if (!preserveMessage) clearMessage();
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'card-desc';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.marginTop = '1rem';
        emptyMsg.textContent = 'No requests yet.';
        container.appendChild(emptyMsg);
        return;
      }

      if (!preserveMessage) clearMessage();

      const buyerIds = [...new Set(requests.map((r) => r.buyer_id).filter(Boolean))];
      const buyerNames = {};

      if (buyerIds.length > 0) {
        const { data: buyers, error: buyersError } = await client
          .from('profile_names')
          .select('id, full_name')
          .in('id', buyerIds);

        if (!buyersError && buyers) {
          buyers.forEach((b) => {
            buyerNames[b.id] = b.full_name;
          });
        }
      }

      const tableWrapper = document.createElement('div');
      tableWrapper.style.overflowX = 'auto';

      const table = document.createElement('table');
      table.className = 'requests-table';

      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['Book', 'Buyer', 'Proposed time', 'Place', 'Message', 'Status', 'Actions'].forEach((headingText) => {
        const th = document.createElement('th');
        th.textContent = headingText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      tbody.id = 'incoming-requests-body';

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

        const tdBuyer = document.createElement('td');
        tdBuyer.textContent = (req.buyer_id && buyerNames[req.buyer_id]) ? buyerNames[req.buyer_id] : '—';
        tr.appendChild(tdBuyer);

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

        const tdMessage = document.createElement('td');
        tdMessage.textContent = (req.message && req.message.trim() !== '') ? req.message : '—';
        tr.appendChild(tdMessage);

        const tdStatus = document.createElement('td');
        tdStatus.textContent = req.status || '—';
        tr.appendChild(tdStatus);

        const tdActions = document.createElement('td');
        if (req.status === 'requested') {
          const acceptBtn = document.createElement('button');
          acceptBtn.type = 'button';
          acceptBtn.className = 'btn-accept';
          acceptBtn.textContent = 'Accept';
          acceptBtn.addEventListener('click', async () => {
            acceptBtn.disabled = true;
            try {
              const { data, error } = await client
                .from('exchange_requests')
                .update({ status: 'accepted' })
                .eq('request_id', req.request_id)
                .eq('status', 'requested')
                .select('request_id');

              if (error || !data || data.length === 0) {
                showMessage('This request can no longer be accepted.', 'error');
              } else {
                showMessage('Request accepted.', 'success');
              }
              await loadRequests(true);
            } catch (err) {
              showMessage('This request can no longer be accepted.', 'error');
              await loadRequests(true);
            }
          });
          tdActions.appendChild(acceptBtn);

          const declineBtn = document.createElement('button');
          declineBtn.type = 'button';
          declineBtn.className = 'btn-decline';
          declineBtn.textContent = 'Decline';
          declineBtn.addEventListener('click', async () => {
            declineBtn.disabled = true;
            try {
              const { data, error } = await client
                .from('exchange_requests')
                .update({ status: 'declined' })
                .eq('request_id', req.request_id)
                .eq('status', 'requested')
                .select('request_id');

              if (error || !data || data.length === 0) {
                showMessage('This request can no longer be declined.', 'error');
              } else {
                showMessage('Request declined.', 'success');
              }
              await loadRequests(true);
            } catch (err) {
              showMessage('This request can no longer be declined.', 'error');
              await loadRequests(true);
            }
          });
          tdActions.appendChild(document.createTextNode(' '));
          tdActions.appendChild(declineBtn);
        } else {
          tdActions.textContent = '';
        }
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
  }

  await loadRequests();
});
