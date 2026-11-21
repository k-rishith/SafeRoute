// SafeRoute configuration
window.SAFEROUTE_CONFIG = {
  supabaseUrl: window.SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey: window.SUPABASE_ANON_KEY || 'YOUR_ANON_KEY',
  useMockData: true, // Set false only after Supabase URL, key, RLS policies and schema are configured.
  // Hyderabad, Telangana — default map centre
  mapCenter: [17.3850, 78.4867],
  mapZoom: 11,
  mapRefreshMs: 60000
};
