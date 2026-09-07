import type { PublicSiteContent } from "@/lib/public-site-content";
import type { SiteDictionary } from "@/lib/site-i18n";
import { ultraContactChannels } from "@/themes/ultra/ultra-contact-channels";

type Props = {
  content: PublicSiteContent;
  dict: SiteDictionary;
};

export function UltraFinalCta({ content, dict }: Props) {
  const title = content.finalCta.title || dict.finalCta.title;
  const description = content.finalCta.description || dict.finalCta.description;
  const whatsappHref = ultraContactChannels(content).whatsappHref;

  return (
    <section className="ultra-final-cta" aria-label={dict.contact.finalCtaAria}>
      <div className="ultra-shell">
        <div className="ultra-final-cta__panel">
          <h2 className="ultra-section-title">{title}</h2>
          <p className="ultra-lead">{description}</p>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              className="ultra-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${dict.whatsapp.label}. ${dict.a11y.opensInNewTab}`}
            >
              {dict.whatsapp.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
