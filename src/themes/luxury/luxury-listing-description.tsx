import {
  parseListingDescriptionForDisplay,
  type DescriptionBlock,
} from "@/lib/listing-description";

type Props = {
  description: string;
  heading: string;
};

function DescriptionBlocks({ blocks }: { blocks: DescriptionBlock[] }) {
  return (
    <div className="luxury-description">
      {blocks.map((block, index) => {
        if (block.type === "subheading") {
          return (
            <p key={`h-${index}`} className="luxury-description__heading">
              {block.decoration ? (
                <span className="luxury-description__deco" aria-hidden>
                  {block.decoration}
                </span>
              ) : null}
              <span>{block.text}</span>
            </p>
          );
        }
        if (block.type === "callout") {
          return (
            <p key={`c-${index}`} className="luxury-description__callout">
              {block.text}
            </p>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={`p-${index}`} className="luxury-description__p">
              {block.text}
            </p>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={`l-${index}`} className="luxury-description__list">
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item}`}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={`t-${index}`} className="luxury-description__tags">
            {block.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function LuxuryListingDescription({
  description,
  heading,
}: Props) {
  const blocks = parseListingDescriptionForDisplay(description);
  if (blocks.length === 0) return null;

  return (
    <section className="luxury-panel">
      <h2 className="luxury-panel__label">{heading}</h2>
      <DescriptionBlocks blocks={blocks} />
    </section>
  );
}
