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

  const container = document.getElementById('course-container');
  const heading = document.getElementById('course-heading');
  const desc = document.getElementById('course-desc');
  const client = window.supabaseClient || window.supabase;

  if (!client) {
    if (container) container.textContent = '';
    showMessage('Supabase client is not configured.', 'error');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const codeParam = urlParams.get('code');
  const code = codeParam ? codeParam.trim() : '';

  if (!code) {
    if (heading) heading.textContent = 'Courses';
    if (desc) desc.textContent = 'All available courses and their required textbooks.';
    document.title = 'Courses | Campus Textbook Exchange';

    try {
      const { data: courses, error } = await client
        .from('courses')
        .select('course_code, course_title')
        .order('course_code', { ascending: true });

      if (error) {
        if (container) container.textContent = '';
        showMessage(error.message || 'Failed to load courses.', 'error');
        return;
      }

      if (!container) return;
      container.textContent = '';

      if (!courses || courses.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'card-desc';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.marginTop = '1rem';
        emptyMsg.textContent = 'No courses found.';
        container.appendChild(emptyMsg);
        return;
      }

      const list = document.createElement('ul');
      list.className = 'courses-list';

      courses.forEach((c) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = 'course.html?code=' + encodeURIComponent(c.course_code);

        const codeSpan = document.createElement('span');
        codeSpan.className = 'course-code';
        codeSpan.textContent = c.course_code;

        const sep = document.createTextNode(' — ');

        const titleSpan = document.createElement('span');
        titleSpan.className = 'course-title';
        titleSpan.textContent = c.course_title;

        link.appendChild(codeSpan);
        link.appendChild(sep);
        link.appendChild(titleSpan);
        item.appendChild(link);
        list.appendChild(item);
      });

      container.appendChild(list);
    } catch (err) {
      if (container) container.textContent = '';
      showMessage((err && err.message) || 'An unexpected error occurred while loading courses.', 'error');
    }
    return;
  }

  try {
    const { data: course, error: courseError } = await client
      .from('courses')
      .select('course_code, course_title, department')
      .eq('course_code', code)
      .maybeSingle();

    if (courseError) {
      if (container) container.textContent = '';
      showMessage(courseError.message || 'Failed to load course.', 'error');
      return;
    }

    if (!course) {
      if (container) container.textContent = '';
      showMessage('Course not found.', 'error');
      const notFoundMsg = document.createElement('p');
      notFoundMsg.className = 'card-desc';
      notFoundMsg.style.textAlign = 'center';
      notFoundMsg.style.marginTop = '1rem';
      notFoundMsg.id = 'course-not-found';
      notFoundMsg.textContent = 'Course not found.';
      if (container) {
        container.appendChild(notFoundMsg);

        const backContainer = document.createElement('div');
        backContainer.style.textAlign = 'center';
        backContainer.style.marginTop = '1.5rem';
        const backLink = document.createElement('a');
        backLink.href = 'course.html';
        backLink.textContent = 'View all courses';
        backLink.style.color = 'var(--accent)';
        backLink.style.fontWeight = '600';
        backLink.style.textDecoration = 'none';
        backContainer.appendChild(backLink);
        container.appendChild(backContainer);
      }
      return;
    }

    document.title = course.course_code + ' | Campus Textbook Exchange';
    if (heading) heading.textContent = course.course_code;
    if (desc) desc.textContent = course.course_title + ' · ' + course.department;

    if (container) container.textContent = '';

    const courseInfo = document.createElement('div');
    courseInfo.className = 'course-info';

    const infoRow = document.createElement('div');
    infoRow.className = 'course-info-row';

    const codeItem = document.createElement('div');
    codeItem.className = 'course-info-item';
    const codeLabel = document.createElement('span');
    codeLabel.className = 'course-info-label';
    codeLabel.textContent = 'Course Code';
    const codeVal = document.createElement('span');
    codeVal.className = 'course-info-value';
    codeVal.id = 'course-code';
    codeVal.textContent = course.course_code;
    codeItem.appendChild(codeLabel);
    codeItem.appendChild(codeVal);

    const titleItem = document.createElement('div');
    titleItem.className = 'course-info-item';
    const titleLabel = document.createElement('span');
    titleLabel.className = 'course-info-label';
    titleLabel.textContent = 'Course Title';
    const titleVal = document.createElement('span');
    titleVal.className = 'course-info-value';
    titleVal.id = 'course-title';
    titleVal.textContent = course.course_title;
    titleItem.appendChild(titleLabel);
    titleItem.appendChild(titleVal);

    const deptItem = document.createElement('div');
    deptItem.className = 'course-info-item';
    const deptLabel = document.createElement('span');
    deptLabel.className = 'course-info-label';
    deptLabel.textContent = 'Department';
    const deptVal = document.createElement('span');
    deptVal.className = 'course-info-value';
    deptVal.id = 'course-department';
    deptVal.textContent = course.department;
    deptItem.appendChild(deptLabel);
    deptItem.appendChild(deptVal);

    infoRow.appendChild(codeItem);
    infoRow.appendChild(titleItem);
    infoRow.appendChild(deptItem);
    courseInfo.appendChild(infoRow);
    container.appendChild(courseInfo);

    const { data: books, error: booksError } = await client
      .from('syllabus_books')
      .select('syllabus_book_id, course_code, isbn, title, author, approved_edition, list_price_kwd, semester, is_active')
      .eq('course_code', course.course_code)
      .eq('is_active', true)
      .order('syllabus_book_id', { ascending: true });

    if (booksError) {
      showMessage(booksError.message || 'Failed to load course textbooks.', 'error');
      return;
    }

    if (!books || books.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.className = 'card-desc';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.marginTop = '1.5rem';
      emptyMsg.id = 'no-books-message';
      emptyMsg.textContent = 'No approved textbook for this course yet.';
      container.appendChild(emptyMsg);

      const backContainer = document.createElement('div');
      backContainer.style.textAlign = 'center';
      backContainer.style.marginTop = '2rem';
      const backLink = document.createElement('a');
      backLink.href = 'course.html';
      backLink.textContent = '← All courses';
      backLink.style.color = 'var(--accent)';
      backLink.style.fontWeight = '600';
      backLink.style.textDecoration = 'none';
      backContainer.appendChild(backLink);
      container.appendChild(backContainer);
      return;
    }

    const booksWithCounts = await Promise.all(
      books.map(async (book) => {
        try {
          const { count, error: countError } = await client
            .from('listings')
            .select('listing_id', { count: 'exact', head: true })
            .eq('syllabus_book_id', book.syllabus_book_id)
            .eq('status', 'available');

          if (countError) {
            return { book, count: 0 };
          }
          return { book, count: (typeof count === 'number') ? count : 0 };
        } catch {
          return { book, count: 0 };
        }
      })
    );

    const tableWrapper = document.createElement('div');
    tableWrapper.style.overflowX = 'auto';

    const table = document.createElement('table');
    table.className = 'books-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Title', 'Author', 'Approved Edition', 'Semester', 'List Price (KWD)', 'Copies Available'].forEach((headingText) => {
      const th = document.createElement('th');
      th.textContent = headingText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.id = 'course-books-body';

    booksWithCounts.forEach(({ book, count }) => {
      const tr = document.createElement('tr');
      tr.className = 'book-row';
      tr.setAttribute('data-syllabus-book-id', String(book.syllabus_book_id));

      const tdTitle = document.createElement('td');
      tdTitle.className = 'book-title';
      tdTitle.textContent = book.title || '—';
      tr.appendChild(tdTitle);

      const tdAuthor = document.createElement('td');
      tdAuthor.className = 'book-author';
      tdAuthor.textContent = book.author || '—';
      tr.appendChild(tdAuthor);

      const tdEdition = document.createElement('td');
      tdEdition.className = 'book-edition';
      tdEdition.textContent = book.approved_edition || '—';
      tr.appendChild(tdEdition);

      const tdSemester = document.createElement('td');
      tdSemester.className = 'book-semester';
      tdSemester.textContent = book.semester || '—';
      tr.appendChild(tdSemester);

      const tdListPrice = document.createElement('td');
      tdListPrice.className = 'book-list-price';
      const hasListPrice = book.list_price_kwd !== null && book.list_price_kwd !== undefined && book.list_price_kwd !== '';
      tdListPrice.textContent = hasListPrice ? String(book.list_price_kwd) : '—';
      tr.appendChild(tdListPrice);

      const tdCount = document.createElement('td');
      tdCount.className = 'book-copies-available';
      const countText = count === 1 ? '1 copy available' : `${count} copies available`;
      tdCount.textContent = countText;
      tr.appendChild(tdCount);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);

    const backContainer = document.createElement('div');
    backContainer.style.textAlign = 'center';
    backContainer.style.marginTop = '2rem';
    const backLink = document.createElement('a');
    backLink.href = 'course.html';
    backLink.textContent = '← All courses';
    backLink.style.color = 'var(--accent)';
    backLink.style.fontWeight = '600';
    backLink.style.textDecoration = 'none';
    backContainer.appendChild(backLink);
    container.appendChild(backContainer);
  } catch (err) {
    if (container) container.textContent = '';
    showMessage((err && err.message) || 'An unexpected error occurred while loading course details.', 'error');
  }
});
