// components/icons/HutIcon.jsx
export function HutIcon({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
    >
      <path d="M12 2L2 10h2v10h6V14h4v6h6V10h2L12 2z" />
    </svg>
  );
}
