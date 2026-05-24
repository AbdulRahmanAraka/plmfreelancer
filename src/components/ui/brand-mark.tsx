import Image from "next/image";

type BrandMarkProps = {
  height?: number;
  className?: string;
};

const LOGO_WIDTH = 758;
const LOGO_HEIGHT = 251;

export function BrandMark({ height = 40, className }: BrandMarkProps) {
  const width = Math.round((height * LOGO_WIDTH) / LOGO_HEIGHT);

  return (
    <Image
      src="/plm_logo.png"
      alt="PLM Freelancer"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
