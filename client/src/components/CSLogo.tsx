export function CSLogo({ size = 48, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Navy Blue Background */}
      <rect width="200" height="280" rx="24" fill="#1E2B42" />
      
      {/* Mint Green Background */}
      <rect x="24" y="20" width="152" height="240" rx="16" fill="#A8E6D5" />
      
      {/* Letter C */}
      <path
        d="M 70 60 Q 50 60 50 100 Q 50 140 70 140 L 95 140 Q 105 140 105 130 L 105 110"
        stroke="#1E2B42"
        strokeWidth="22"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Letter S */}
      <path
        d="M 130 160 L 90 160 Q 60 160 60 190 Q 60 210 80 215 Q 100 220 120 215 Q 140 210 140 195 L 140 175 Q 140 165 130 165"
        stroke="#1E2B42"
        strokeWidth="22"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
