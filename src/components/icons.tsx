import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (paths: React.ReactNode) =>
  function Icon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 1080 1080"
        width={size}
        height={size}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {paths}
      </svg>
    );
  };

export const IconLogo = base(
  <>
    <path
      d="M540,60 L636,320 L740,128 L820,320 L920,128 L1000,320 L1000,760 Q1000,860 900,860 L180,860 Q80,860 80,760 L80,320 L180,128 L260,320 L364,128 L460,320 Z"
      fill="currentColor"
    />
    <circle cx="540" cy="60" r="60" fill="currentColor" />
    <circle cx="180" cy="128" r="48" fill="currentColor" />
    <circle cx="900" cy="128" r="48" fill="currentColor" />
  </>
);

export const IconSparkle = base(
  <>
    <path d="M540,543.14c0-69.61-34.79-104.4-104.4-104.4,69.61,0,104.4-34.79,104.4-104.4,0,69.61,34.79,104.4,104.4,104.4-69.61,0-104.4,34.79-104.4,104.4Z" fill="currentColor" />
    <polygon points="542 543.14 540 818.43 538 543.14 542 543.14" fill="currentColor" />
  </>
);

export const IconArrow = base(
  <>
    <polyline points="755.37 500.32 794.97 539.91 755.2 579.68" fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={4} />
    <line x1={794.97} y1={539.91} x2={285.03} y2={539.91} stroke="currentColor" strokeMiterlimit={10} strokeWidth={4} />
  </>
);

export const IconClose = base(
  <>
    <ellipse cx={540} cy={540} rx={185.69} ry={184.14} fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={3} />
    <line x1={354.31} y1={354.31} x2={725.69} y2={725.69} stroke="currentColor" strokeMiterlimit={10} strokeWidth={3} />
    <line x1={725.69} y1={354.31} x2={354.31} y2={725.69} stroke="currentColor" strokeMiterlimit={10} strokeWidth={3} />
  </>
);
