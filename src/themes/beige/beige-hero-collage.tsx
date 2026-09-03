import { BeigeCoverImage } from "@/themes/beige/beige-cover-image";

type Props = {
  urls: string[];
};

export function BeigeHeroCollage({ urls }: Props) {
  const frames = [urls[0], urls[1], urls[2]];
  return (
    <div className="beige-hero-collage grid w-full grid-cols-2 gap-4 lg:w-1/2">
      <div className="beige-hero-frame beige-hero-frame--1 col-span-2 overflow-hidden rounded-3xl border-2 border-white shadow-2xl">
        <BeigeCoverImage
          src={frames[0]}
          alt=""
          className="beige-img-zoom h-52 w-full object-cover md:h-64"
          placeholderClassName="h-52 bg-[#E5D9C5] md:h-64"
          placeholder=""
        />
      </div>
      <div className="beige-hero-frame beige-hero-frame--2 overflow-hidden rounded-2xl border-2 border-white shadow-xl">
        <BeigeCoverImage
          src={frames[1]}
          alt=""
          className="beige-img-zoom h-36 w-full object-cover"
          placeholderClassName="h-36 bg-[#E5D9C5]"
          placeholder=""
        />
      </div>
      <div className="beige-hero-frame beige-hero-frame--3 overflow-hidden rounded-2xl border-2 border-white shadow-xl">
        <BeigeCoverImage
          src={frames[2]}
          alt=""
          className="beige-img-zoom h-36 w-full object-cover"
          placeholderClassName="h-36 bg-[#E5D9C5]"
          placeholder=""
        />
      </div>
    </div>
  );
}
