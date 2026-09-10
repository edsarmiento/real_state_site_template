import { fillTemplate } from "@/lib/site-i18n";
import { YellowHeroFrameImage } from "@/themes/yellow/yellow-hero-frame-image";
import { yellowHeroFrameCount } from "@/themes/yellow/yellow-hero-urls";
import { YellowReveal } from "@/themes/yellow/yellow-reveal";

type Props = {
  urls: string[];
  title: string;
  photoAltTemplate: string;
  selectedLabel: string;
};

const PLACEHOLDER = "yellow-hero-frame__placeholder";
const MAIN_SIZES = "(max-width: 1023px) 92vw, 52vw";
const SIDE_SIZES = "(max-width: 1023px) 42vw, 18vw";

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

function Frame({
  url,
  alt,
  sizes,
  preload = false,
  className,
}: {
  url?: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className: string;
}) {
  return (
    <div className={className}>
      {url ? (
        <YellowHeroFrameImage
          src={url}
          alt={alt}
          sizes={sizes}
          preload={preload}
          className="yellow-hero-photo yellow-img-zoom"
          placeholderClassName={PLACEHOLDER}
        />
      ) : (
        <div className={PLACEHOLDER} aria-hidden />
      )}
    </div>
  );
}

export function YellowHeroCollage({
  urls,
  title,
  photoAltTemplate,
  selectedLabel,
}: Props) {
  const count = yellowHeroFrameCount(urls);
  const photoCount = urls.length;

  if (count === 0) {
    return (
      <div className="yellow-hero-stage yellow-hero-stage--0">
        <div className="yellow-hero-stage__blob" aria-hidden />
        <div className="yellow-hero-stage__fallback" aria-hidden />
      </div>
    );
  }

  return (
    <div className={`yellow-hero-stage yellow-hero-stage--${count}`}>
      <div className="yellow-hero-stage__blob" aria-hidden />
      <YellowReveal variant="clip" className="yellow-hero-stage__main">
        <Frame
          url={urls[0]}
          alt={frameAlt(urls[0], title, 1, photoCount, photoAltTemplate)}
          sizes={MAIN_SIZES}
          preload
          className="yellow-hero-frame yellow-hero-frame--panorama group"
        />
      </YellowReveal>
      <YellowReveal
        variant="right"
        delayMs={80}
        className="yellow-hero-stage__float yellow-hero-stage__float--a"
      >
        <Frame
          url={urls[1]}
          alt={frameAlt(urls[1], title, 2, photoCount, photoAltTemplate)}
          sizes={SIDE_SIZES}
          className="yellow-hero-frame yellow-hero-frame--float group"
        />
      </YellowReveal>
      <YellowReveal
        variant="right"
        delayMs={160}
        className="yellow-hero-stage__float yellow-hero-stage__float--b"
      >
        <Frame
          url={urls[2]}
          alt={frameAlt(urls[2], title, 3, photoCount, photoAltTemplate)}
          sizes={SIDE_SIZES}
          className="yellow-hero-frame yellow-hero-frame--float group"
        />
      </YellowReveal>
      <YellowReveal variant="zoom" delayMs={220} className="yellow-hero-stage__chip">
        <p className="yellow-hero-chip">{selectedLabel}</p>
      </YellowReveal>
    </div>
  );
}
