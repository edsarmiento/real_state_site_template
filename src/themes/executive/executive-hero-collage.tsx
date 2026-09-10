import { fillTemplate } from "@/lib/site-i18n";
import { ExecutiveHeroFrameImage } from "@/themes/executive/executive-hero-frame-image";
import {
  executiveHeroFrames,
  type ExecutiveHeroSlot,
} from "@/themes/executive/executive-hero-photos";
import { ExecutiveIconHome } from "@/themes/executive/executive-icons";

type Props = {
  urls: string[];
  title: string;
  photoAltTemplate: string;
  plaque: string;
  brandInitial: string;
};

const PLACEHOLDER = "executive-hero-frame__placeholder";
const MAIN_SIZES = "(max-width: 767px) 92vw, (max-width: 1023px) 70vw, 42vw";
const SIDE_SIZES = "(max-width: 767px) 44vw, (max-width: 1023px) 32vw, 18vw";

function photoAlt(
  title: string,
  index: number,
  count: number,
  photoAltTemplate: string,
): string {
  if (!title || count < 1) return "";
  return fillTemplate(photoAltTemplate, { title, index, count });
}

function FrameBody({
  slot,
  alt,
  sizes,
  preload,
  mark,
}: {
  slot: ExecutiveHeroSlot;
  alt: string;
  sizes: string;
  preload?: boolean;
  mark: string;
}) {
  if (slot.kind === "photo") {
    return (
      <ExecutiveHeroFrameImage
        src={slot.src}
        alt={alt}
        sizes={sizes}
        preload={preload}
        className="executive-hero-photo"
        placeholderClassName={PLACEHOLDER}
      />
    );
  }

  return (
    <div className="executive-hero-panel" aria-hidden>
      {mark ? (
        <span className="executive-hero-panel__mark">{mark}</span>
      ) : null}
    </div>
  );
}

export function ExecutiveHeroCollage({
  urls,
  title,
  photoAltTemplate,
  plaque,
  brandInitial,
}: Props) {
  const frames = executiveHeroFrames(urls);
  const photoCount = frames.filter((frame) => frame.kind === "photo").length;
  const alts = frames.map((frame, index) => {
    if (frame.kind !== "photo") return "";
    const photoNumber = frames
      .slice(0, index + 1)
      .filter((item) => item.kind === "photo").length;
    return photoAlt(title, photoNumber, photoCount, photoAltTemplate);
  });

  return (
    <div className="executive-hero-stage">
      <div className="executive-hero-halo" aria-hidden />
      <svg
        className="executive-hero-lines"
        viewBox="0 0 640 640"
        fill="none"
        aria-hidden
      >
        <path
          d="M72 608C150 390 292 148 612 56"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          d="M28 520C118 292 312 108 596 96"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.55"
        />
        <path
          d="M196 36C470 92 566 248 612 528"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.4"
        />
      </svg>
      <div className="executive-hero-collage">
        <div className="executive-hero-frame executive-hero-frame--main">
          <FrameBody
            slot={frames[0]}
            alt={alts[0]}
            sizes={MAIN_SIZES}
            preload={frames[0].kind === "photo"}
            mark={brandInitial}
          />
        </div>
        <div className="executive-hero-stack">
          <div className="executive-hero-frame executive-hero-frame--side executive-hero-frame--a">
            <FrameBody
              slot={frames[1]}
              alt={alts[1]}
              sizes={SIDE_SIZES}
              mark=""
            />
          </div>
          <div className="executive-hero-frame executive-hero-frame--side executive-hero-frame--b">
            <FrameBody
              slot={frames[2]}
              alt={alts[2]}
              sizes={SIDE_SIZES}
              mark=""
            />
          </div>
        </div>
        <p className="executive-hero-plaque">
          <span className="executive-hero-plaque__icon" aria-hidden>
            <ExecutiveIconHome className="executive-hero-plaque__home" />
          </span>
          <span>{plaque}</span>
        </p>
      </div>
    </div>
  );
}
