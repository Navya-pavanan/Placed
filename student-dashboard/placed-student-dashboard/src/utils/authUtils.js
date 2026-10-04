import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';

/**
 * Universal logout handler for the Student Dashboard.
 * Signs out from Supabase, cleans up persistent caches, and redirects to home.
 */
export const handleAppLogout = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    persistentStorage.clearMockCache();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('placed_user_db_') || key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
    window.location.href = '/';
  }
};
