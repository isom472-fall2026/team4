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
  const profile = await requireAdmin();
  if (!profile) return;

  const textbooksCard = document.getElementById('textbooks-card');
  if (textbooksCard) {
    textbooksCard.hidden = false;
  }

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

  const form = document.getElementById('textbook-form');
  const saveBtn = document.getElementById('save-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const courseCode = courseSelect ? courseSelect.value.trim() : '';
    const isbnInput = document.getElementById('isbn');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const approvedEditionInput = document.getElementById('approved_edition');
    const listPriceInput = document.getElementById('list_price_kwd');
    const semesterInput = document.getElementById('semester');

    const rawIsbn = isbnInput ? isbnInput.value.trim() : '';
    const title = titleInput ? titleInput.value.trim() : '';
    const author = authorInput ? authorInput.value.trim() : '';
    const approvedEdition = approvedEditionInput ? approvedEditionInput.value.trim() : '';
    const listPriceRaw = listPriceInput ? listPriceInput.value.trim() : '';
    const semester = semesterInput ? semesterInput.value.trim() : '';

    if (!courseCode || !title || !approvedEdition || !semester) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    const cleanedIsbn = rawIsbn.replace(/[\s-]+/g, '').toUpperCase();
    const isbnRegex = /^([0-9]{9}[0-9X]|[0-9]{13})$/;
    if (!isbnRegex.test(cleanedIsbn)) {
      showMessage('The ISBN must be 10 or 13 digits.', 'error');
      return;
    }

    let listPrice = null;
    if (listPriceRaw !== '') {
      const parsedPrice = parseFloat(listPriceRaw);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        showMessage('List price must be a valid non-negative number.', 'error');
        return;
      }
      listPrice = parsedPrice;
    }

    // is_active is omitted so the database default (true) is used
    const payload = {
      course_code: courseCode,
      isbn: cleanedIsbn,
      title: title,
      author: author || null,
      approved_edition: approvedEdition,
      list_price_kwd: listPrice,
      semester: semester
    };

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }

    try {
      const { error } = await client
        .from('syllabus_books')
        .insert(payload);

      if (error) {
        const code = error.code ? String(error.code) : '';
        if (code === '23505') {
          showMessage('This ISBN is already listed for this course in this semester.', 'error');
        } else if (code === '23514') {
          showMessage('The ISBN must be 10 or 13 digits.', 'error');
        } else {
          showMessage(error.message || 'An error occurred while saving the textbook.', 'error');
        }
        return;
      }

      showMessage('Textbook saved.', 'success');

      // Preserve selected course for rapid entry of multiple books under one course
      const currentCourse = courseSelect ? courseSelect.value : '';
      form.reset();
      if (courseSelect) {
        courseSelect.value = currentCourse;
      }
      if (isbnInput) isbnInput.value = '';
      if (titleInput) titleInput.value = '';
      if (authorInput) authorInput.value = '';
      if (approvedEditionInput) approvedEditionInput.value = '';
      if (listPriceInput) listPriceInput.value = '';
      if (semesterInput) semesterInput.value = '';
    } catch (err) {
      showMessage(err.message || 'An unexpected error occurred. Please try again.', 'error');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      }
    }
  });
});
