// Story #37: Sign up with a university email

function isUniversityEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Allows student/faculty emails directly under @ku.edu.kw or college subdomains (@cba.ku.edu.kw)
  const kuEmailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*ku\.edu\.kw$/i;
  return kuEmailRegex.test(email.trim());
}

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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const fullName = document.getElementById('full-name').value.trim();
    const studentId = document.getElementById('student-id').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!fullName || !studentId || !email || !password) {
      showMessage('Please fill in all fields.', 'error');
      return;
    }

    if (!isUniversityEmail(email)) {
      showMessage('Registration is restricted to university email addresses (@ku.edu.kw or subdomains such as @cba.ku.edu.kw).', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters.', 'error');
      return;
    }

    if (!window.supabase || !window.supabase.auth) {
      showMessage('Supabase client is not configured. Please check js/config.js.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';
    }

    try {
      const { data, error } = await window.supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            student_id: studentId
          }
        }
      });

      if (error) {
        const errorMsg = (error.message || '').toLowerCase();
        if (errorMsg.includes('student_id') || errorMsg.includes('student id') || errorMsg.includes('profiles_student_id_key')) {
          showMessage('This student ID is already registered.', 'error');
        } else if (
          errorMsg.includes('already registered') ||
          errorMsg.includes('user already exists') ||
          errorMsg.includes('profiles_email_key') ||
          error.code === 'user_already_exists'
        ) {
          showMessage('This email is already registered. Please log in or use a different email.', 'error');
        } else if (errorMsg.includes('university email') || errorMsg.includes('ku.edu.kw')) {
          showMessage('Registration is restricted to university email addresses (@ku.edu.kw).', 'error');
        } else {
          showMessage(error.message || 'Sign up failed.', 'error');
        }
        return;
      }

      // Supabase returns an empty identities list when email confirmation is active and the email is taken
      if (data && data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        showMessage('This email is already registered. Please log in or use a different email.', 'error');
        return;
      }

      showMessage('Account created successfully! Please check your university email for confirmation.', 'success');
      form.reset();
    } catch (err) {
      showMessage(err.message || 'An unexpected error occurred. Please try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    }
  });
});
