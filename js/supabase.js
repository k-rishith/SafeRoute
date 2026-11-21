// Supabase client wrapper (falls back to mock when not configured)
let supabaseClient = null;
try {
  if (window.supabase && window.SAFEROUTE_CONFIG.supabaseUrl && !window.SAFEROUTE_CONFIG.supabaseUrl.includes('YOUR_PROJECT')) {
    supabaseClient = window.supabase.createClient(window.SAFEROUTE_CONFIG.supabaseUrl, window.SAFEROUTE_CONFIG.supabaseAnonKey);
  }
} catch (e) { console.warn('Supabase not available, using mock data'); }

window.SR = window.SR || {};
window.SR.supabase = supabaseClient;
window.SR.useMock = !supabaseClient || window.SAFEROUTE_CONFIG.useMockData;
