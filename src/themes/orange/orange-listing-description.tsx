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
    <div className="orange-description">
      {blocks.map((block, index) => {
        if (block.type === "subheading") {
          return (
            <p key={`h-${index}`} className="orange-description__heading">
              {block.decoration ? (
                <span className="orange-description__deco" aria-hidden>
                  {block.decoration}
                </span>
              ) : null}
              <span>{block.text}</span>
            </p>
          );
        }
        if (block.type === "callout") {
          return (
            <p key={`c-${index}`} className="orange-description__callout">
              {block.text}
            </p>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={`p-${index}`} className="orange-description__p">
              {block.text}
            </p>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={`l-${index}`} className="orange-description__list">
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item}`}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={`t-${index}`} className="orange-description__tags">
            {block.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function OrangeListingDescription({ description, heading }: Props) {
  const blocks = parseListingDescriptionForDisplay(description);
  if (blocks.length === 0) return null;

  return (
    <section className="orange-panel">
      <h2 className="orange-panel__label">{heading}</h2>
      <DescriptionBlocks blocks={blocks} />
    </section>
  );
}
