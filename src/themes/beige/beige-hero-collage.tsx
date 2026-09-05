import { fillTemplate } from "@/lib/site-i18n";
import { BeigeHeroFrameImage } from "@/themes/beige/beige-hero-frame-image";

type Props = {
  urls: string[];
  title: string;
  photoAltTemplate: string;
};

const PLACEHOLDER = "beige-hero-frame__placeholder";
const MAIN_SIZES = "(max-width: 767px) 92vw, (max-width: 1023px) 90vw, 62vw";
const SIDE_SIZES = "(max-width: 767px) 46vw, (max-width: 1023px) 44vw, 28vw";

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
    <div className="beige-hero-collage">
      <div className="beige-hero-frame beige-hero-frame--1 beige-hero-frame--main beige-hero-hover group">
        {frames[0] ? (
          <BeigeHeroFrameImage
            src={frames[0]}
            alt={frameAlt(frames[0], title, 1, count, photoAltTemplate)}
            sizes={MAIN_SIZES}
            preload
            className="beige-hero-photo beige-img-zoom"
            placeholderClassName={PLACEHOLDER}
          />
        ) : (
          <div className={PLACEHOLDER} aria-hidden />
        )}
      </div>
      <div className="beige-hero-frame beige-hero-frame--2 beige-hero-frame--side beige-hero-hover group">
        {frames[1] ? (
          <BeigeHeroFrameImage
            src={frames[1]}
            alt={frameAlt(frames[1], title, 2, count, photoAltTemplate)}
            sizes={SIDE_SIZES}
            className="beige-hero-photo beige-img-zoom"
            placeholderClassName={PLACEHOLDER}
          />
        ) : (
          <div className={PLACEHOLDER} aria-hidden />
        )}
      </div>
      <div className="beige-hero-frame beige-hero-frame--3 beige-hero-frame--side beige-hero-hover group">
        {frames[2] ? (
          <BeigeHeroFrameImage
            src={frames[2]}
            alt={frameAlt(frames[2], title, 3, count, photoAltTemplate)}
            sizes={SIDE_SIZES}
            className="beige-hero-photo beige-img-zoom"
            placeholderClassName={PLACEHOLDER}
          />
        ) : (
          <div className={PLACEHOLDER} aria-hidden />
        )}
      </div>
    </div>
  );
}
