import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LogOut, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useAuth } from "../state/AuthContext";
import { siteConfig } from "../config/site";
import Brand from "./Brand";

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
        <MessageCircle size={20} />
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
