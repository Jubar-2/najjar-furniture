import Image from "next/image";

export interface MarqueeLogo {
  id: string;
  src: string;
  alt: string;
}

interface LogoMarqueeProps {
  logos: MarqueeLogo[];
  durationSeconds?: number; // full loop duration — lower = faster
  className?: string;
}

export default function LogoMarquee({
  logos,
  durationSeconds = 30,
  className = "",
}: LogoMarqueeProps) {
  // Duplicate the list so the CSS translateX(-50%) loop is seamless —
  // once the first copy scrolls fully out of view, the second copy is
  // in the exact same position it started in.
  const track = [...logos, ...logos];

  return (
    <section className="w-full flex justify-center items-center">
       {track.map((logo, index) => (
          <div key={`${logo.id}-${index}`} className="">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              className="object-contain"
            />
          </div>
        ))}      
    </section>

  


  );
}