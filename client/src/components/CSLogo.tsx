export function CSLogo({ size = 48, className = "" }) {
  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Navy blue rounded square background */}
        <rect width="120" height="120" rx="16" fill="#1E2B42" />
        
        {/* Mint green rounded square */}
        <rect x="12" y="12" width="96" height="96" rx="12" fill="#A8E6D5" />
        
        {/* Letter C - Large bold serif-style C */}
        <text
          x="32"
          y="50"
          fontSize="42"
          fontWeight="700"
          fontFamily="Georgia, serif"
          fill="#1E2B42"
          textAnchor="start"
        >
          C
        </text>
        
        {/* Letter S - Large bold serif-style S */}
        <text
          x="32"
          y="92"
          fontSize="42"
          fontWeight="700"
          fontFamily="Georgia, serif"
          fill="#1E2B42"
          textAnchor="start"
        >
          S
        </text>
      </svg>
    </div>
  );
}
