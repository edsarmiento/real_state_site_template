import { splitLeadingDecorativeEmojis } from "@/lib/listing-title-display";

type Props = {
  title: string;
  as?: "h1" | "h3";
  className: string;
  decorate?: boolean;
};

export function LuxuryListingTitle({
  title,
  as = "h3",
  className,
  decorate = true,
}: Props) {
  const display = splitLeadingDecorativeEmojis(title);
  const Tag = as;

  return (
    <Tag className={className}>
      {decorate && display.leadingDecorations ? (
        <span className="luxury-title__deco" aria-hidden>
          {display.leadingDecorations}
        </span>
      ) : null}
      <span className="luxury-title__text">{display.visual}</span>
      {decorate && display.trailingDecorations ? (
        <span className="luxury-title__deco luxury-title__deco--end" aria-hidden>
          {display.trailingDecorations}
        </span>
      ) : null}
    </Tag>
  );
}
