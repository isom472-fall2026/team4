// js/client.js
// Creates one Supabase client that every later page will reuse.

const _supabaseLib = window.supabase;

const client = (_supabaseLib && typeof _supabaseLib.createClient === 'function')
  ? _supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (client && _supabaseLib) {
  client.createClient = _supabaseLib.createClient;
}

window.supabaseLib = _supabaseLib;
window.supabase = client;
window.supabaseClient = client;
