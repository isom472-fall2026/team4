document.addEventListener('DOMContentLoaded', async () => {
  const profile = await requireAuth();
  if (!profile) return;

  const userInfoEl = document.getElementById('user-info');
  if (userInfoEl) {
    userInfoEl.textContent = `Signed in as ${profile.full_name} (${profile.role})`;
  }

  document.body.dataset.userId = profile.id;
  document.body.dataset.userRole = profile.role;

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

  const logoutBtnCard = document.getElementById('logout-btn-card');
  if (logoutBtnCard) {
    logoutBtnCard.addEventListener('click', handleLogout);
  }
});
