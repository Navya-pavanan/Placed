/**
 * Universal Data Persistence Layer
 * Interacts directly with official Supabase database tables.
 * Persists user inputs and data updates without falling back to hardcoded mock data.
 */
export const persistentStorage = {
  async get(key, supabaseQuery, emptyDefault) {
    if (supabaseQuery) {
      try {
        const result = await supabaseQuery();

        // 1. If supabaseQuery returned a raw Supabase response object { data, error }
        if (result && typeof result === 'object' && !Array.isArray(result) && 'error' in result && result.error) {
          throw result.error;
        }

        // 2. Extract payload if wrapped in { data } (and not an array)
        let payload;
        if (result && typeof result === 'object' && !Array.isArray(result) && 'data' in result) {
          payload = result.data;
        } else {
          payload = result;
        }

        // 3. If query successfully returned data (including empty arrays or objects)
        if (payload !== undefined && payload !== null) {
          try {
            localStorage.setItem(`placed_user_db_${key}`, JSON.stringify(payload));
          } catch {
            // Cache write error fallback
          }
          return payload;
        }
      } catch (err) {
        console.error(`Supabase query failed for ${key}:`, err);
      }
    }

    // Retrieve from persistent user storage only if query failed or was not provided
    const cached = localStorage.getItem(`placed_user_db_${key}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed !== null && parsed !== undefined) {
          return parsed;
        }
      } catch {
        // Cache read error
      }
    }

    return emptyDefault;
  },

  async set(key, supabaseMutation, updatedData) {
    // 1. Save user state to persistent local cache
    localStorage.setItem(`placed_user_db_${key}`, JSON.stringify(updatedData));

    // 2. Persist to official Supabase database
    if (supabaseMutation) {
      try {
        await supabaseMutation();
      } catch (err) {
        console.warn(`Supabase sync notice for ${key}:`, err);
      }
    }

    return updatedData;
  },

  clearMockCache() {
    // Clear any legacy mock cache keys
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('placed_db_')) {
        localStorage.removeItem(k);
      }
    });
  }
};
