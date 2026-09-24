import { fillTemplate } from "@/lib/site-i18n";
import { OrangeHeroImage } from "@/themes/orange/orange-hero-image";

type Props = {
  urls: string[];
  title: string;
  photoAltTemplate: string;
};

const PLACEHOLDER = "orange-hero-frame__placeholder";
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

export function OrangeHeroCollage({ urls, title, photoAltTemplate }: Props) {
  const frames = [urls[0], urls[1], urls[2]];
  const count = urls.length;

  return (
    <div className="orange-hero-collage">
      <div className="orange-hero-frame orange-hero-frame--1 orange-hero-frame--main orange-hero-hover group">
        {frames[0] ? (
          <OrangeHeroImage
            src={frames[0]}
            alt={frameAlt(frames[0], title, 1, count, photoAltTemplate)}
            sizes={MAIN_SIZES}
            preload
            className="orange-hero-photo orange-img-zoom"
            placeholderClassName={PLACEHOLDER}
          />
        ) : (
          <div className={PLACEHOLDER} aria-hidden />
        )}
      </div>
      <div className="orange-hero-frame orange-hero-frame--2 orange-hero-frame--side orange-hero-hover group">
        {frames[1] ? (
          <OrangeHeroImage
            src={frames[1]}
            alt={frameAlt(frames[1], title, 2, count, photoAltTemplate)}
            sizes={SIDE_SIZES}
            className="orange-hero-photo orange-img-zoom"
            placeholderClassName={PLACEHOLDER}
          />
        ) : (
          <div className={PLACEHOLDER} aria-hidden />
        )}
      </div>
      <div className="orange-hero-frame orange-hero-frame--3 orange-hero-frame--side orange-hero-hover group">
        {frames[2] ? (
          <OrangeHeroImage
            src={frames[2]}
            alt={frameAlt(frames[2], title, 3, count, photoAltTemplate)}
            sizes={SIDE_SIZES}
            className="orange-hero-photo orange-img-zoom"
            placeholderClassName={PLACEHOLDER}
          />
        ) : (
          <div className={PLACEHOLDER} aria-hidden />
        )}
      </div>
    </div>
  );
}
