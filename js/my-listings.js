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

  const editForm = document.getElementById('edit-listing-form');
  const editCondition = document.getElementById('edit-condition');
  const editPriceKwd = document.getElementById('edit-price-kwd');
  const editNotes = document.getElementById('edit-notes');
  const editCancelBtn = document.getElementById('edit-cancel-btn');
  const editSaveBtn = document.getElementById('edit-save-btn');
  let editingListingId = null;

  if (editCancelBtn) {
    editCancelBtn.addEventListener('click', () => {
      if (editForm) {
        editForm.hidden = true;
        editForm.reset();
      }
      editingListingId = null;
      clearMessage();
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage();

      if (!editingListingId) return;

      const condition = editCondition ? editCondition.value : '';
      const priceRaw = editPriceKwd ? editPriceKwd.value.trim() : '';
      const notesRaw = editNotes ? editNotes.value.trim() : '';

      let priceKwd = null;
      if (priceRaw !== '') {
        const parsedPrice = parseFloat(priceRaw);
        if (isNaN(parsedPrice)) {
          showMessage('Please enter a valid price.', 'error');
          return;
        }
        priceKwd = parsedPrice;
      }

      const notes = notesRaw || null;

      const updatePayload = {
        condition: condition,
        price_kwd: priceKwd,
        notes: notes
      };

      if (editSaveBtn) {
        editSaveBtn.disabled = true;
        editSaveBtn.textContent = 'Saving...';
      }

      try {
        const { data, error } = await client
          .from('listings')
          .update(updatePayload)
          .eq('listing_id', editingListingId)
          .eq('seller_id', profile.id)
          .select();

        if (error) {
          const code = error.code ? String(error.code) : '';
          if (code === '23514' || (error.message && error.message.includes('23514'))) {
            showMessage('A price is required unless the book is offered as a swap.', 'error');
          } else {
            showMessage(error.message || 'Failed to update listing.', 'error');
          }
          return;
        }

        if (!data || data.length === 0) {
          showMessage('This listing could not be updated.', 'error');
          return;
        }

        showMessage('Listing updated.', 'success');
        if (editForm) {
          editForm.hidden = true;
          editForm.reset();
        }
        editingListingId = null;
        await loadListings();
      } catch (err) {
        const code = (err && err.code) ? String(err.code) : '';
        if (code === '23514' || (err && err.message && err.message.includes('23514'))) {
          showMessage('A price is required unless the book is offered as a swap.', 'error');
        } else {
          showMessage((err && err.message) || 'An unexpected error occurred while updating the listing.', 'error');
        }
      } finally {
        if (editSaveBtn) {
          editSaveBtn.disabled = false;
          editSaveBtn.textContent = 'Save';
        }
      }
    });
  }

  async function loadListings() {
    try {
      // Explicit filter by seller_id to ensure only the user's listings appear
      const { data: listings, error } = await client
        .from('listings')
        .select('listing_id, course_code, isbn, condition, trade_type, price_kwd, notes, status, edition_verified, created_at')
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
      ['Course', 'ISBN', 'Condition', 'Trade Type', 'Price (KWD)', 'Status', 'Published', 'Actions'].forEach((headingText) => {
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

        const tdActions = document.createElement('td');
        if (listing.status === 'available') {
          const editBtn = document.createElement('button');
          editBtn.type = 'button';
          editBtn.className = 'btn-action btn-edit';
          editBtn.textContent = 'Edit';
          editBtn.addEventListener('click', () => {
            clearMessage();
            editingListingId = listing.listing_id;
            if (editCondition) editCondition.value = listing.condition || 'like_new';
            if (editPriceKwd) {
              editPriceKwd.value = (listing.price_kwd !== null && listing.price_kwd !== undefined) ? listing.price_kwd : '';
            }
            if (editNotes) editNotes.value = listing.notes || '';
            if (editForm) {
              editForm.hidden = false;
              editForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });

          const withdrawBtn = document.createElement('button');
          withdrawBtn.type = 'button';
          withdrawBtn.className = 'btn-action btn-withdraw';
          withdrawBtn.textContent = 'Withdraw';
          withdrawBtn.addEventListener('click', async () => {
            const confirmed = window.confirm('Withdraw this listing? It will no longer appear in the catalog.');
            if (!confirmed) {
              return;
            }

            clearMessage();
            withdrawBtn.disabled = true;
            withdrawBtn.textContent = 'Withdrawing...';

            try {
              const { data, error } = await client
                .from('listings')
                .update({ status: 'removed' })
                .eq('listing_id', listing.listing_id)
                .eq('seller_id', profile.id)
                .select();

              if (error) {
                const code = error.code ? String(error.code) : '';
                if (code === '23514' || (error.message && error.message.includes('23514'))) {
                  showMessage('A price is required unless the book is offered as a swap.', 'error');
                } else {
                  showMessage(error.message || 'Failed to withdraw listing.', 'error');
                }
                return;
              }

              if (!data || data.length === 0) {
                showMessage('This listing could not be updated.', 'error');
                return;
              }

              showMessage('Listing withdrawn.', 'success');
              if (editForm && editingListingId === listing.listing_id) {
                editForm.hidden = true;
                editForm.reset();
                editingListingId = null;
              }
              await loadListings();
            } catch (err) {
              const code = (err && err.code) ? String(err.code) : '';
              if (code === '23514' || (err && err.message && err.message.includes('23514'))) {
                showMessage('A price is required unless the book is offered as a swap.', 'error');
              } else {
                showMessage((err && err.message) || 'An unexpected error occurred while withdrawing the listing.', 'error');
              }
            } finally {
              withdrawBtn.disabled = false;
              withdrawBtn.textContent = 'Withdraw';
            }
          });

          tdActions.appendChild(editBtn);
          tdActions.appendChild(document.createTextNode(' '));
          tdActions.appendChild(withdrawBtn);
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
      showMessage(err.message || 'An unexpected error occurred while loading listings.', 'error');
    }
  }

  await loadListings();
});
