import React, { createContext, useContext, useEffect, useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId) {
    if (!supabase || !userId) {
      setProfile(null);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar perfil:", error);
        setProfile(null);
        return null;
      }

      setProfile(data || null);
      return data || null;
    } catch (error) {
      console.error("Erro inesperado ao carregar perfil:", error);
      setProfile(null);
      return null;
    }
  }

  useEffect(() => {
    let active = true;

    async function startAuth() {
      try {
        if (!hasSupabaseConfig || !supabase) {
          setSession(null);
          setProfile(null);
          return;
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Erro ao buscar sessão:", error);
        }

        if (!active) return;

        const currentSession = data?.session || null;
        setSession(currentSession);

        if (currentSession?.user?.id) {
          await loadProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Erro no sistema de login:", error);
        setSession(null);
        setProfile(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    startAuth();

    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession || null);
        setLoading(false);

        if (nextSession?.user?.id) {
          window.setTimeout(() => {
            loadProfile(nextSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      active = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  async function signIn(email, password) {
    if (!supabase) {
      throw new Error("Configure o Supabase no arquivo .env.");
    }

    return supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async function signUp(fullName, email, password) {
    if (!supabase) {
      throw new Error("Configure o Supabase no arquivo .env.");
    }

    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  }

  async function signOut() {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error("Erro ao sair:", error);
    }

    setSession(null);
    setProfile(null);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  }

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
        loadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
