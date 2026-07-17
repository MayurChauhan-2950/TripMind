import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Card from "@/components/ui/Card";

type Stamp = { type: "score"; value: number } | { type: "icon"; icon: LucideIcon };
type StampImage = { src: string; alt: string };

export default function StampedCard({
  children,
  stamp,
  image,
  className = "",
}: {
  children: ReactNode;
  stamp: Stamp;
  image?: StampImage;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Card className="overflow-hidden">
        {image && (
          <div className="relative h-44 w-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}
        {children}
      </Card>
      <div className="absolute -top-3 -right-3 flex size-12 items-center justify-center rounded-full border border-dashed border-gold bg-paper font-mono text-body-sm text-gold shadow-[0_1px_3px_rgba(20,33,61,0.12)]">
        {stamp.type === "score" ? (
          stamp.value
        ) : (
          <stamp.icon className="size-5" strokeWidth={1.75} />
        )}
      </div>
    </div>
  );
}
