import FaIcon from "../icons/FaIcon";

export function SectionBadge({ icon, children }) {
  return (
    <span className="section-badge mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black">
      {icon && <FaIcon name={icon} className="h-4 w-4" />}
      {children}
    </span>
  );
}

export function IconCircle({ icon, className = "" }) {
  return (
    <span className={`inline-grid place-items-center rounded-2xl bg-gradient-to-br from-danger to-gold text-white shadow-lg shadow-red-950/30 ${className}`}>
      <FaIcon name={icon} className="h-[1em] w-[1em]" />
    </span>
  );
}

export function ButtonLink({ href, children, variant = "primary", download = false }) {
  const classes = variant === "primary" ? "btn-red" : "btn-muted";
  return (
    <a href={href || "#"} download={download} className={classes}>
      {children}
    </a>
  );
}
