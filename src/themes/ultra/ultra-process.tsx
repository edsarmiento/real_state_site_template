import type { SiteDictionary } from "@/lib/site-i18n";

type Props = {
  dict: SiteDictionary;
};

export function UltraProcess({ dict }: Props) {
  const steps = [
    {
      number: "01",
      title: dict.process.step1Title,
      description: dict.process.step1Description,
    },
    {
      number: "02",
      title: dict.process.step2Title,
      description: dict.process.step2Description,
    },
    {
      number: "03",
      title: dict.process.step3Title,
      description: dict.process.step3Description,
    },
  ];

  return (
    <section id="process" className="ultra-process">
      <div className="ultra-shell">
        <div className="ultra-section-head ultra-section-head--center ultra-section-head--on-dark">
          <p className="ultra-eyebrow ultra-eyebrow--gold">{dict.process.kicker}</p>
          <h2 className="ultra-section-title ultra-section-title--on-dark">
            {dict.process.title}
          </h2>
          <p className="ultra-lead ultra-lead--on-dark">{dict.process.subtitle}</p>
        </div>
        <ol className="ultra-process__steps">
          {steps.map((step) => (
            <li key={step.number} className="ultra-process-card">
              <span className="ultra-process-card__mark">{step.number}</span>
              <h3 className="ultra-process-card__title">{step.title}</h3>
              <p className="ultra-process-card__copy">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
