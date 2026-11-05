// js/listing.js
// Buyer opens a listing's detail page (Story #63)

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

function formatReadableDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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

  const container = document.getElementById('listing-container');
  const client = window.supabaseClient || window.supabase;

  function showErrorState(text) {
    showMessage(text, 'error');
    if (container) {
      container.textContent = '';

      const p = document.createElement('p');
      p.textContent = text;
      p.className = 'card-desc';
      p.style.textAlign = 'center';
      p.style.marginTop = '1rem';
      container.appendChild(p);

      const linkContainer = document.createElement('div');
      linkContainer.className = 'catalog-link-container';
      linkContainer.style.textAlign = 'center';
      linkContainer.style.marginTop = '1.25rem';

      const link = document.createElement('a');
      link.href = 'catalog.html';
      link.textContent = 'Back to catalog';
      link.className = 'catalog-link';
      link.style.color = 'var(--accent)';
      link.style.fontWeight = '600';
      link.style.textDecoration = 'none';

      linkContainer.appendChild(link);
      container.appendChild(linkContainer);
    }
  }

  if (!client) {
    showErrorState('Supabase client is not configured.');
    return;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id') || urlParams.get('listing_id');

    if (!idParam || !idParam.trim()) {
      showErrorState('No listing was chosen.');
      return;
    }

    if (!/^\d+$/.test(idParam.trim())) {
      showErrorState('This listing is not available.');
      return;
    }

    const listingId = parseInt(idParam.trim(), 10);

    const { data: listing, error } = await client
      .from('listings')
      .select('listing_id, seller_id, course_code, condition, trade_type, price_kwd, notes, status, edition_verified, created_at, syllabus_books(title, author, approved_edition, semester)')
      .eq('listing_id', listingId)
      .maybeSingle();

    if (error) {
      showErrorState('This listing is not available.');
      return;
    }

    if (!listing || listing.status !== 'available' || !listing.edition_verified) {
      showErrorState('This listing is not available.');
      return;
    }

    // Read the seller's name ONLY from the profile_names view
    let sellerName = '—';
    if (listing.seller_id) {
      const { data: seller, error: sellerError } = await client
        .from('profile_names')
        .select('full_name')
        .eq('id', listing.seller_id)
        .maybeSingle();

      if (!sellerError && seller && seller.full_name) {
        sellerName = seller.full_name;
      }
    }

    const book = Array.isArray(listing.syllabus_books)
      ? (listing.syllabus_books[0] || {})
      : (listing.syllabus_books || {});

    const title = book.title || '—';
    const author = book.author || '—';
    const approvedEdition = book.approved_edition || '—';
    const condition = listing.condition || '—';
    const tradeType = listing.trade_type || '—';

    const hasPrice = listing.price_kwd !== null && listing.price_kwd !== undefined && listing.price_kwd !== '';
    const priceKwd = hasPrice ? String(listing.price_kwd) : 'Swap';

    const notes = (listing.notes && listing.notes.trim() !== '') ? listing.notes : '—';
    const createdAt = formatReadableDate(listing.created_at);

    clearMessage();

    if (container) {
      container.textContent = '';

      const detailsWrapper = document.createElement('div');
      detailsWrapper.className = 'listing-details';

      const titleEl = document.createElement('h2');
      titleEl.id = 'listing-title';
      titleEl.className = 'book-title';
      titleEl.textContent = title;
      detailsWrapper.appendChild(titleEl);

      const authorEl = document.createElement('p');
      authorEl.id = 'listing-author';
      authorEl.className = 'book-author';
      authorEl.textContent = author;
      detailsWrapper.appendChild(authorEl);

      if (listing.edition_verified === true && book && book.semester && String(book.semester).trim()) {
        const badge = document.createElement('span');
        badge.id = 'listing-verified-badge';
        badge.className = 'verified-badge';
        badge.textContent = 'Verified for ' + book.semester;
        detailsWrapper.appendChild(badge);
      }

      const dl = document.createElement('dl');
      dl.className = 'detail-list';

      const fields = [
        { label: 'Course', value: listing.course_code || '—', id: 'listing-course' },
        { label: 'Approved Edition', value: approvedEdition, id: 'listing-edition' },
        { label: 'Condition', value: condition, id: 'listing-condition' },
        { label: 'Trade Type', value: tradeType, id: 'listing-trade-type' },
        { label: 'Price (KWD)', value: priceKwd, id: 'listing-price' },
        { label: 'Seller', value: sellerName, id: 'listing-seller' },
        { label: 'Date Listed', value: createdAt, id: 'listing-created-at' },
        { label: 'Notes', value: notes, id: 'listing-notes' }
      ];

      fields.forEach((field) => {
        const dt = document.createElement('dt');
        dt.className = 'detail-label';
        dt.textContent = field.label;
        dl.appendChild(dt);

        const dd = document.createElement('dd');
        dd.id = field.id;
        dd.className = 'detail-value';
        dd.textContent = field.value;
        dl.appendChild(dd);
      });

      detailsWrapper.appendChild(dl);

      const linkContainer = document.createElement('div');
      linkContainer.className = 'catalog-link-container';

      const link = document.createElement('a');
      link.href = 'catalog.html';
      link.textContent = 'Back to catalog';
      link.className = 'catalog-link';

      linkContainer.appendChild(link);
      detailsWrapper.appendChild(linkContainer);

      container.appendChild(detailsWrapper);
    }
  } catch (err) {
    showErrorState(err && err.message ? err.message : 'An error occurred loading the listing.');
  }
});
