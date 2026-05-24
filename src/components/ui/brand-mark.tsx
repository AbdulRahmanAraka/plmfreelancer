type BrandMarkProps = {
  size?: number;
  withWordmark?: boolean;
  className?: string;
};

export function BrandMark({ size = 36, withWordmark = true, className }: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <CubeLogo size={size} />
      {withWordmark ? (
        <span className="flex flex-col leading-[1.05] text-indigo-950">
          <span className="text-[15px] font-extrabold lowercase tracking-tight">plm</span>
          <span className="text-[12px] font-semibold lowercase tracking-tight text-indigo-900/80">
            freelancer
          </span>
        </span>
      ) : null}
    </span>
  );
}

function CubeLogo({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cubeTop" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#9cc5ff" />
          <stop offset="100%" stopColor="#6aa8f7" />
        </linearGradient>
        <linearGradient id="cubeRight" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3470cf" />
          <stop offset="100%" stopColor="#1f4ea3" />
        </linearGradient>
        <linearGradient id="cubeFront" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1a4ba8" />
          <stop offset="100%" stopColor="#0e3380" />
        </linearGradient>
      </defs>
      <polygon points="32,4 60,18 32,32 4,18" fill="url(#cubeTop)" />
      <polygon points="60,18 60,46 32,60 32,32" fill="url(#cubeRight)" />
      <polygon points="4,18 4,46 32,60 32,32" fill="url(#cubeFront)" />
      <text
        x="18"
        y="46"
        fontSize="9"
        fontWeight="800"
        fill="#ffffff"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto"
      >
        plm
      </text>
    </svg>
  );
}
