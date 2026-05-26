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
  <path d="M768.72,692.48c0,42.08-34,76.24-76.24,76.24s-76.24-34.16-76.24-76.24-34-76.24-76.24-76.24-76.24,34.16-76.24,76.24-34,76.24-76.24,76.24-76.24-34.16-76.24-76.24,34.16-76.24,76.24-76.24,76.24-34.16,76.24-76.24-34-76.24-76.24-76.24-76.24-34.16-76.24-76.24,34.16-76.24,76.24-76.24,76.24,34.16,76.24,76.24,34.16,76.24,76.24,76.24,76.24-34.16,76.24-76.24,34.16-76.24,76.24-76.24,76.24,34.16,76.24,76.24-34,76.24-76.24,76.24-76.24,34.16-76.24,76.24,34.16,76.24,76.24,76.24,76.24,34.16,76.24,76.24Z" fill="currentColor" />
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
