import Link from "next/link";
import { fillTemplate } from "@/lib/site-i18n";
import { getSiteUi } from "@/lib/site-ui";

type Props = {
  lang?: string;
};

export async function SiteFooter({ lang }: Props) {
  const ui = await getSiteUi(lang);
  const name = ui.config.siteName;

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm text-zinc-600">
          {fillTemplate(ui.dict.footer.copyright, {
            year: new Date().getFullYear(),
            name,
          })}{" "}
          — {ui.dict.footer.description}
        </p>
        {ui.config.showPoweredBy ? (
          <p className="mt-4 text-xs text-zinc-500">
            {ui.dict.footer.poweredBy}{" "}
            <Link
              href="https://evenia.mx"
              className="font-medium text-zinc-600 underline-offset-2 hover:underline"
            >
              Evenia
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
