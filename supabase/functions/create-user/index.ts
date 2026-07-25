import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authorization = request.headers.get("Authorization");

    if (!authorization) {
      return json({ error: "Sessao nao encontrada." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json({ error: "Configuracao do servidor incompleta." }, 500);
    }

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: userData, error: userError } = await callerClient.auth.getUser();

    if (userError || !userData.user) {
      return json({ error: "Sessao invalida ou expirada." }, 401);
    }

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return json({ error: "Somente administradores podem criar usuarios." }, 403);
    }

    const { fullName, email, password } = await request.json();
    const normalizedName = typeof fullName === "string" ? fullName.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedName || !normalizedEmail || typeof password !== "string") {
      return json({ error: "Preencha nome, e-mail e senha." }, 400);
    }

    if (password.length < 6) {
      return json({ error: "A senha precisa ter pelo menos 6 caracteres." }, 400);
    }

    const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: normalizedName,
      },
    });

    if (createError) {
      return json({ error: createError.message }, 400);
    }

    const userId = createdUser.user?.id;

    if (!userId) {
      return json({ error: "Usuario criado sem identificador." }, 500);
    }

    const { error: profileUpsertError } = await adminClient
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: normalizedName,
          email: normalizedEmail,
          role: "student",
        },
        { onConflict: "id" }
      );

    if (profileUpsertError) {
      await adminClient.auth.admin.deleteUser(userId);
      return json({ error: profileUpsertError.message }, 400);
    }

    return json({
      success: true,
      user: {
        id: userId,
        email: normalizedEmail,
        fullName: normalizedName,
        role: "student",
      },
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Erro inesperado." }, 500);
  }
});

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
