async function requireAuth() {
  const client = window.supabaseClient || window.supabase;
  if (!client || !client.auth) {
    window.location.href = 'login.html';
    return null;
  }

  try {
    const { data: { session }, error: sessionError } = await client.auth.getSession();
    if (sessionError || !session || !session.user) {
      window.location.href = 'login.html';
      return null;
    }

    const { data: profile, error: profileError } = await client
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      await client.auth.signOut();
      window.location.href = 'login.html';
      return null;
    }

    window.currentUser = profile;
    window.userProfile = profile;
    return profile;
  } catch (err) {
    window.location.href = 'login.html';
    return null;
  }
}

window.requireAuth = requireAuth;

async function requireAdmin() {
  const profile = await requireAuth();
  if (!profile) {
    return null;
  }

  if (profile.role !== 'admin') {
    const messageHtml = `
      <section class="card" aria-labelledby="denied-heading">
        <header class="card-header">
          <h1 id="denied-heading" class="card-title">Access Denied</h1>
          <p class="card-desc">This page is for library staff only.</p>
        </header>
        <div style="text-align: center; margin-top: 1.5rem;">
          <a href="home.html" style="color: var(--accent); text-decoration: none; font-weight: 600;">Return to Home</a>
        </div>
      </section>
    `;

    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = messageHtml;
    } else if (document.body) {
      document.body.innerHTML = `<main class="main-content">${messageHtml}</main>`;
    }

    return null;
  }

  return profile;
}

window.requireAdmin = requireAdmin;

