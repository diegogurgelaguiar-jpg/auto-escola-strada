import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LogOut, MapPin, Menu, Phone, X } from "lucide-react";
import { useAuth } from "../state/AuthContext";
import { siteConfig } from "../config/site";
import Brand from "./Brand";

function WhatsAppIcon() {
  return (
    <svg
      className="whatsapp-icon"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.02 3.5c-6.64 0-12.04 5.22-12.04 11.64 0 2.27.68 4.42 1.96 6.29L4.55 28.5l7.35-1.79a12.46 12.46 0 0 0 4.12.7c6.64 0 12.04-5.22 12.04-11.64S22.66 3.5 16.02 3.5Z" />
      <path
        className="whatsapp-icon-phone"
        d="M12.53 9.62c-.26-.59-.53-.6-.78-.61h-.66c-.23 0-.6.09-.92.43-.32.35-1.21 1.19-1.21 2.9s1.24 3.36 1.42 3.59c.17.23 2.4 3.85 5.94 5.24 2.94 1.16 3.54.93 4.18.87.64-.06 2.07-.84 2.36-1.66.29-.81.29-1.51.2-1.66-.09-.14-.32-.23-.67-.4-.35-.17-2.07-1.02-2.39-1.13-.32-.12-.55-.17-.78.17-.23.35-.9 1.13-1.1 1.36-.2.23-.41.26-.75.09-.35-.17-1.47-.54-2.8-1.72-1.03-.92-1.73-2.05-1.93-2.4-.2-.35-.02-.54.15-.71.16-.16.35-.41.52-.61.17-.2.23-.35.35-.58.12-.23.06-.43-.03-.61-.09-.17-.77-1.89-1.08-2.56Z"
      />
    </svg>
  );
}

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
        <Brand onClick={() => setOpen(false)} />

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
                <NavLink className="admin-nav-link" to="/admin" onClick={() => setOpen(false)}>
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
        aria-label="Falar com a Auto Escola Strada pelo WhatsApp"
      >
        <WhatsAppIcon />
        <span>WhatsApp</span>
      </a>

      <footer className="footer">
        <div className="footer-brand">
          <Brand />
          <p>{siteConfig.description}</p>
        </div>
        <div className="footer-contact">
          <strong>Fale com a Strada</strong>
          <a href={`tel:+${siteConfig.whatsapp}`}><Phone size={17} /> {siteConfig.phone}</a>
          <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={17} /> {siteConfig.address}</a>
        </div>
        <div className="footer-links">
          <strong>Atalhos</strong>
          <Link to="/servicos">Serviços</Link>
          <Link to="/simulado">Simulado</Link>
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/termos">Termos</Link>
        </div>
      </footer>
      <div className="footer-bottom">© {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.</div>
    </>
  );
}
