import { Link } from "react-router-dom";
import { assetPath } from "../lib/assets";

export default function Brand({ onClick, compact = false }) {
  return (
    <Link className={`brand ${compact ? "brand-compact" : ""}`} to="/" onClick={onClick}>
      <img
        src={assetPath("/images/logo-auto-escola-strada.jpg")}
        alt="Logo da Auto Escola Strada"
        width="64"
        height="64"
      />
      {!compact && (
        <span>
          <strong>Auto Escola Strada</strong>
          <small>Qualidade, segurança e confiança</small>
        </span>
      )}
    </Link>
  );
}
