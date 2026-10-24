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

  const client = window.supabaseClient || window.supabase;
  if (!client) {
    showMessage('Supabase client is not configured.', 'error');
    return;
  }

  const courseSelect = document.getElementById('course_code');

  try {
    const { data: courses, error: coursesError } = await client
      .from('courses')
      .select('course_code, course_title')
      .order('course_code', { ascending: true });

    if (coursesError) {
      showMessage(coursesError.message || 'Failed to load courses.', 'error');
    } else if (courseSelect && courses) {
      courseSelect.innerHTML = '<option value="">Select a course</option>';
      courses.forEach((course) => {
        const option = document.createElement('option');
        option.value = course.course_code;
        option.textContent = `${course.course_code} - ${course.course_title}`;
        courseSelect.appendChild(option);
      });
    }
  } catch (err) {
    showMessage(err.message || 'Failed to load courses.', 'error');
  }

  const form = document.getElementById('sell-form');
  const saveBtn = document.getElementById('save-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const courseCode = courseSelect ? courseSelect.value.trim() : '';
    const isbnInput = document.getElementById('isbn');
    const conditionSelect = document.getElementById('condition');
    const tradeTypeSelect = document.getElementById('trade_type');
    const priceInput = document.getElementById('price_kwd');
    const notesInput = document.getElementById('notes');

    const rawIsbn = isbnInput ? isbnInput.value : '';
    const cleanedIsbn = rawIsbn.replace(/[\s-]+/g, '');
    const condition = conditionSelect ? conditionSelect.value : '';
    const tradeType = tradeTypeSelect ? tradeTypeSelect.value : '';
    const priceRaw = priceInput ? priceInput.value.trim() : '';
    const notes = notesInput ? notesInput.value.trim() : '';

    if ((tradeType === 'sell' || tradeType === 'either') && priceRaw === '') {
      showMessage('A price is required unless the book is offered as a swap.', 'error');
      return;
    }

    if (!courseCode || !cleanedIsbn) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    let priceKwd = null;
    if (priceRaw !== '') {
      const parsedPrice = parseFloat(priceRaw);
      if (isNaN(parsedPrice)) {
        showMessage('Please enter a valid price.', 'error');
        return;
      }
      priceKwd = parsedPrice;
    }

    // status, edition_verified, and syllabus_book_id are omitted so defaults and triggers apply
    const payload = {
      seller_id: profile.id,
      course_code: courseCode,
      isbn: cleanedIsbn,
      condition: condition,
      trade_type: tradeType,
      price_kwd: priceKwd,
      notes: notes || null
    };

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }

    try {
      const { error } = await client
        .from('listings')
        .insert(payload);

      if (error) {
        if (error.message && error.message.includes('EDITION_MISMATCH')) {
          const { data: approvedBooks } = await client
            .from('syllabus_books')
            .select('title, approved_edition, isbn')
            .eq('course_code', courseCode)
            .eq('is_active', true)
            .order('syllabus_book_id', { ascending: false });

          if (approvedBooks && approvedBooks.length > 0) {
            const book = approvedBooks[0];
            showMessage(`Not published: this ISBN is not the approved edition for ${courseCode}. The approved textbook is ${book.title}, ${book.approved_edition} (ISBN ${book.isbn}).`, 'error');
          } else {
            showMessage(`Not published: no approved textbook is registered for ${courseCode} yet.`, 'error');
          }
          return;
        }

        const code = error.code ? String(error.code) : '';
        if (code === '23514' || (error.message && error.message.includes('23514'))) {
          showMessage('This listing breaks a rule: check the condition and the price.', 'error');
        } else {
          showMessage(error.message || 'An error occurred while listing the textbook.', 'error');
        }
        return;
      }

      showMessage('Your textbook is listed.', 'success');
      form.reset();
      if (courseSelect) courseSelect.value = '';
      if (isbnInput) isbnInput.value = '';
      if (conditionSelect) conditionSelect.value = 'like_new';
      if (tradeTypeSelect) tradeTypeSelect.value = 'sell';
      if (priceInput) priceInput.value = '';
      if (notesInput) notesInput.value = '';
    } catch (err) {
      if (err && err.message && err.message.includes('EDITION_MISMATCH')) {
        const { data: approvedBooks } = await client
          .from('syllabus_books')
          .select('title, approved_edition, isbn')
          .eq('course_code', courseCode)
          .eq('is_active', true)
          .order('syllabus_book_id', { ascending: false });

        if (approvedBooks && approvedBooks.length > 0) {
          const book = approvedBooks[0];
          showMessage(`Not published: this ISBN is not the approved edition for ${courseCode}. The approved textbook is ${book.title}, ${book.approved_edition} (ISBN ${book.isbn}).`, 'error');
        } else {
          showMessage(`Not published: no approved textbook is registered for ${courseCode} yet.`, 'error');
        }
        return;
      }

      const code = (err && err.code) ? String(err.code) : '';
      if (code === '23514' || (err.message && err.message.includes('23514'))) {
        showMessage('This listing breaks a rule: check the condition and the price.', 'error');
      } else {
        showMessage(err.message || 'An unexpected error occurred. Please try again.', 'error');
      }
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      }
    }
  });
});
