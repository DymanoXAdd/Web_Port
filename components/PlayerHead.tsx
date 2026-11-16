import Image from "next/image";

// A skin is a 64x64 (or old 64x32) texture: face at (8,8), hat layer at (40,8), each 8x8.
// Drawn at 4x (256px wide) inside a 32px box, shifted so only that 8x8 square shows.
const layer = "absolute top-[-32px] h-auto w-64 max-w-none [image-rendering:pixelated]";

export default function PlayerHead({ skin }: { skin: string | null }) {
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-sm bg-line-2" aria-hidden="true">
      {skin && (
        <>
          <Image src={skin} alt="" width={64} height={64} quality={100} className={`${layer} left-[-32px]`} />
          <Image src={skin} alt="" width={64} height={64} quality={100} className={`${layer} left-[-160px]`} />
        </>
      )}
    </div>
  );
}
