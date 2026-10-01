import React from "react";

export function LogoSymbol({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="24 12 208 232"
      className={className}
      {...props}
    >
      <path
        d="M 128,24 L 218,76 L 218,180 L 128,232 L 38,180 L 38,76 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="24"
        strokeLinejoin="round"
      />
      <path
        d="M 90,106 L 38,76 M 166,106 L 218,76 M 128,172 L 128,232"
        fill="none"
        stroke="currentColor"
        strokeWidth="24"
        strokeLinecap="round"
      />
      <circle
        cx="128"
        cy="128"
        r="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="24"
      />
    </svg>
  );
}

export function LogoHorizontal({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 256"
      className={className}
      {...props}
    >
      <g transform="translate(0, 0)">
        <path
          d="M 128,24 L 218,76 L 218,180 L 128,232 L 38,180 L 38,76 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="24"
          strokeLinejoin="round"
        />
        <path
          d="M 90,106 L 38,76 M 166,106 L 218,76 M 128,172 L 128,232"
          fill="none"
          stroke="currentColor"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <circle
          cx="128"
          cy="128"
          r="32"
          fill="none"
          stroke="currentColor"
          strokeWidth="24"
        />
      </g>
      <text
        x="280"
        y="168"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="144"
        fontWeight="700"
        letterSpacing="-0.02em"
        fill="currentColor"
      >
        PRism
      </text>
    </svg>
  );
}
