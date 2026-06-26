const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function makeHeaders(accessToken, extra = {}) {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${accessToken || supabaseAnonKey}`,
    ...extra,
  };
}

function makeUrl(table, params = {}) {
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function requestJson(url, options = {}, timeoutMs = 12000) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: null, error: new Error("Supabase nao configurado.") };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      return {
        data: null,
        error: new Error(data?.message || data?.error_description || response.statusText),
      };
    }

    return { data, error: null };
  } catch (error) {
    if (error.name === "AbortError") {
      return { data: null, error: new Error("A consulta demorou demais para responder.") };
    }

    return { data: null, error };
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function selectRows(table, { select = "*", filters = {}, order, limit } = {}, accessToken, timeoutMs) {
  const params = { select };

  Object.entries(filters).forEach(([key, value]) => {
    params[key] = value;
  });

  if (order) params.order = order;
  if (limit) params.limit = String(limit);

  return requestJson(
    makeUrl(table, params),
    { headers: makeHeaders(accessToken) },
    timeoutMs
  );
}

export async function insertRow(table, body, accessToken, timeoutMs) {
  return requestJson(
    makeUrl(table),
    {
      method: "POST",
      headers: makeHeaders(accessToken, {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      }),
      body: JSON.stringify(body),
    },
    timeoutMs
  );
}
