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

  const coursesCard = document.getElementById('courses-card');
  if (coursesCard) {
    coursesCard.hidden = false;
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

  const form = document.getElementById('course-form');
  const saveBtn = document.getElementById('save-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const courseCodeInput = document.getElementById('course_code');
    const courseTitleInput = document.getElementById('course_title');
    const departmentInput = document.getElementById('department');

    const courseCode = courseCodeInput ? courseCodeInput.value.trim() : '';
    const courseTitle = courseTitleInput ? courseTitleInput.value.trim() : '';
    const department = departmentInput ? departmentInput.value.trim() : '';

    if (!courseCode || !courseTitle || !department) {
      showMessage('Please fill in all fields.', 'error');
      return;
    }

    const client = window.supabaseClient || window.supabase;
    if (!client) {
      showMessage('Supabase client is not configured.', 'error');
      return;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }

    try {
      const { error } = await client
        .from('courses')
        .insert({
          course_code: courseCode,
          course_title: courseTitle,
          department: department
        });

      if (error) {
        if (error.code === '23505' || String(error.code) === '23505') {
          showMessage('A course with this code already exists.', 'error');
        } else {
          showMessage(error.message || 'An error occurred while saving the course.', 'error');
        }
        return;
      }

      showMessage('Course saved.', 'success');
      form.reset();
      if (courseCodeInput) courseCodeInput.value = '';
      if (courseTitleInput) courseTitleInput.value = '';
      if (departmentInput) departmentInput.value = '';
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
