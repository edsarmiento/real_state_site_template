import { fillTemplate } from "@/lib/site-i18n";
import { BeigeHeroFrameImage } from "@/themes/beige/beige-hero-frame-image";

type Props = {
  urls: string[];
  title: string;
  photoAltTemplate: string;
};

const PLACEHOLDER = "absolute inset-0 bg-[#E5D9C5]";
const MAIN_SIZES = "(max-width: 1023px) 92vw, 40vw";
const SIDE_SIZES = "(max-width: 1023px) 45vw, 20vw";

function frameAlt(
  url: string | undefined,
  title: string,
  index: number,
  count: number,
  photoAltTemplate: string,
): string {
  if (!url || !title) return "";
  return fillTemplate(photoAltTemplate, { title, index, count });
}

export function BeigeHeroCollage({ urls, title, photoAltTemplate }: Props) {
  const frames = [urls[0], urls[1], urls[2]];
  const count = urls.length;

  return (
    <div className="beige-hero-collage grid w-full grid-cols-2 gap-4 lg:w-1/2">
      <div className="beige-hero-frame beige-hero-frame--1 beige-hero-hover group relative col-span-2 h-52 overflow-hidden rounded-3xl border-2 border-white shadow-2xl md:h-64">
        {frames[0] ? (
          <BeigeHeroFrameImage
            src={frames[0]}
            alt={frameAlt(frames[0], title, 1, count, photoAltTemplate)}
            sizes={MAIN_SIZES}
            preload
            className="beige-img-zoom object-cover"
            placeholderClassName={PLACEHOLDER}
          />
        ) : (
          <div className={PLACEHOLDER} aria-hidden />
        )}
      </div>
      <div className="beige-hero-frame beige-hero-frame--2 beige-hero-hover group relative h-36 overflow-hidden rounded-2xl border-2 border-white shadow-xl">
        {frames[1] ? (
          <BeigeHeroFrameImage
            src={frames[1]}
            alt={frameAlt(frames[1], title, 2, count, photoAltTemplate)}
            sizes={SIDE_SIZES}
            className="beige-img-zoom object-cover"
            placeholderClassName={PLACEHOLDER}
          />
        ) : (
          <div className={PLACEHOLDER} aria-hidden />
        )}
      </div>
      <div className="beige-hero-frame beige-hero-frame--3 beige-hero-hover group relative h-36 overflow-hidden rounded-2xl border-2 border-white shadow-xl">
        {frames[2] ? (
          <BeigeHeroFrameImage
            src={frames[2]}
            alt={frameAlt(frames[2], title, 3, count, photoAltTemplate)}
            sizes={SIDE_SIZES}
            className="beige-img-zoom object-cover"
            placeholderClassName={PLACEHOLDER}
          />
        ) : (
          <div className={PLACEHOLDER} aria-hidden />
        )}
      </div>
    </div>
  );
}
