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
