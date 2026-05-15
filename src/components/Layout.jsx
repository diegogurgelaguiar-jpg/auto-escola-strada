import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { BookOpenCheck, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../state/AuthContext";
import { siteConfig } from "../config/site";

export default function Layout() {
  const { session, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const navItems = [
    ["/", "Início"],
    ["/servicos", "Serviços"],
    ["/como-funciona", "Como funciona"],
    ["/simulado", "Simulado"],
    ["/contato", "Contato"],
  ];

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  }

  return (
    <>
      <header className="site-header">
        <Link className="logo" to="/" onClick={() => setOpen(false)}>
          <span className="logo-mark">
            <BookOpenCheck size={22} />
          </span>

          <span>
            <strong>{siteConfig.name}</strong>
            <small>{siteConfig.slogan}</small>
          </span>
        </Link>

        <button
          type="button"
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav className={`nav ${open ? "is-open" : ""}`}>
          {navItems.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}

          {session ? (
            <>
              <NavLink to="/aluno" onClick={() => setOpen(false)}>
                Área do aluno
              </NavLink>

              {isAdmin && (
                <NavLink to="/admin" onClick={() => setOpen(false)}>
                  Admin
                </NavLink>
              )}

              <button
                type="button"
                className="link-button logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Sair
              </button>
            </>
          ) : (
            <NavLink
              className="nav-cta"
              to="/login"
              onClick={() => setOpen(false)}
            >
              Login do aluno
            </NavLink>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <a
        className="whatsapp-float"
        href={`https://wa.me/${siteConfig.whatsapp}`}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>

      <footer className="footer">
        <div>
          <strong>{siteConfig.name}</strong>
          <p>{siteConfig.description}</p>
        </div>

        <div className="footer-links">
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/termos">Termos</Link>
        </div>
      </footer>
    </>
  );
}