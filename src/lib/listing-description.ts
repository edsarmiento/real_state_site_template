export type DescriptionParagraph = { type: "paragraph"; text: string };
export type DescriptionCallout = { type: "callout"; text: string };
export type DescriptionList = { type: "list"; items: string[] };
export type DescriptionSubheading = {
  type: "subheading";
  text: string;
  decoration: string | null;
};
export type DescriptionTags = { type: "tags"; tags: string[] };

export type DescriptionBlock =
  | DescriptionParagraph
  | DescriptionCallout
  | DescriptionList
  | DescriptionSubheading
  | DescriptionTags;

const MARKER_BULLET = /^(?:[-*•])\s+/;
const LEADING_EMOJI =
  /^(?:\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*)\s*/u;
const HASHTAG = /^#[\p{L}\p{N}_-]+$/u;

function normalizeNewlines(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function collapseExcessBlankLines(value: string): string {
  return value.replace(/\n{3,}/g, "\n\n").trim();
}

function splitLeadingDecoration(line: string): {
  decoration: string | null;
  text: string;
} {
  const match = line.match(LEADING_EMOJI);
  if (!match) return { decoration: null, text: line };
  const text = line.slice(match[0].length).trim();
  if (!text) return { decoration: null, text: line };
  return { decoration: match[0].trim(), text };
}

function stripMarkerPrefix(line: string): string | null {
  const marker = line.match(MARKER_BULLET);
  if (!marker) return null;
  const rest = line.slice(marker[0].length).trim();
  return rest || null;
}

function isHashtagToken(token: string): boolean {
  return HASHTAG.test(token);
}

function isHashtagOnlyLine(line: string): boolean {
  const parts = line.trim().split(/\s+/).filter(Boolean);
  return parts.length > 0 && parts.every(isHashtagToken);
}

function extractHashtags(line: string): string[] {
  return line.trim().split(/\s+/).filter(isHashtagToken);
}

/**
 * Conservative subheading: short line ending in ":", optionally starting
 * with a decorative emoji. Not a sentence, list marker, or hashtag line.
 */
export function isDescriptionSubheading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (stripMarkerPrefix(trimmed)) return false;
  if (isHashtagOnlyLine(trimmed)) return false;

  const { text } = splitLeadingDecoration(trimmed);
  if (isInvitationHeading(text)) return true;
  if (text.length < 3 || text.length > 56) return false;
  if (!text.endsWith(":")) return false;
  const body = text.slice(0, -1).trim();
  if (!body) return false;
  if (/[.!?…]/.test(body.replace(/^¿/, ""))) return false;
  if (body.split(/\s+/).length > 8) return false;
  return true;
}

function isInvitationHeading(text: string): boolean {
  const body = text.replace(/:$/, "").trim();
  if (!/^(Agenda|Contáctanos|Escríbenos|Visítanos|Conoce)\b/iu.test(body)) {
    return false;
  }
  if (/[.!?…]/.test(body.replace(/^¿/, ""))) return false;
  return body.split(/\s+/).length <= 8;
}

function isCalloutLine(line: string): boolean {
  const { text } = splitLeadingDecoration(line.trim());
  return /^¿.+\?$/.test(text);
}

function isShortListPhrase(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 42) return false;
  if (/[.!?…]/.test(trimmed.replace(/^¿/, ""))) return false;
  return trimmed.split(/\s+/).length <= 6;
}

function nextMeaningfulLine(lines: string[], from: number): string {
  for (let index = from; index < lines.length; index += 1) {
    const line = lines[index]?.trim() ?? "";
    if (line) return line;
  }
  return "";
}

function flushParagraph(
  buffer: string[],
  blocks: DescriptionBlock[],
): void {
  const text = buffer.join(" ").replace(/\s+/g, " ").trim();
  buffer.length = 0;
  if (text) blocks.push({ type: "paragraph", text });
}

function flushList(items: string[], blocks: DescriptionBlock[]): void {
  if (items.length === 0) return;
  blocks.push({ type: "list", items: [...items] });
  items.length = 0;
}

/**
 * Safe display parser for listing.description.
 * Does not interpret HTML, mutate stored content, or create links.
 */
export function parseListingDescriptionForDisplay(
  description: string,
): DescriptionBlock[] {
  if (!description || !description.trim()) return [];

  const normalized = collapseExcessBlankLines(normalizeNewlines(description));
  if (!normalized) return [];

  const lines = normalized.split("\n");
  const blocks: DescriptionBlock[] = [];
  const paragraph: string[] = [];
  const listItems: string[] = [];

  const trailingTagLines: string[] = [];
  let contentEnded = false;

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index].trim();
    if (!line) {
      if (contentEnded) break;
      continue;
    }
    if (isHashtagOnlyLine(line)) {
      trailingTagLines.unshift(line);
      continue;
    }
    contentEnded = true;
    break;
  }

  const cutoff =
    trailingTagLines.length === 0
      ? lines.length
      : lines.length -
        trailingTagLines.length -
        countTrailingBlanks(lines);

  for (let index = 0; index < cutoff; index += 1) {
    const line = (lines[index] ?? "").trim();

    if (!line) {
      flushList(listItems, blocks);
      flushParagraph(paragraph, blocks);
      continue;
    }

    if (isCalloutLine(line)) {
      flushList(listItems, blocks);
      flushParagraph(paragraph, blocks);
      blocks.push({
        type: "callout",
        text: splitLeadingDecoration(line).text,
      });
      continue;
    }

    if (isDescriptionSubheading(line)) {
      flushList(listItems, blocks);
      flushParagraph(paragraph, blocks);
      const split = splitLeadingDecoration(line);
      const label = split.text.replace(/:$/, "").trim();
      blocks.push({
        type: "subheading",
        text: label,
        decoration: split.decoration,
      });
      continue;
    }

    const marker = stripMarkerPrefix(line);
    if (marker) {
      flushParagraph(paragraph, blocks);
      listItems.push(marker);
      continue;
    }

    const emojiLine = splitLeadingDecoration(line);
    if (
      emojiLine.decoration &&
      emojiLine.text !== line &&
      isShortListPhrase(emojiLine.text)
    ) {
      const upcoming = nextMeaningfulLine(lines, index + 1);
      const upcomingEmoji = splitLeadingDecoration(upcoming);
      const continuesList =
        listItems.length > 0 ||
        Boolean(stripMarkerPrefix(upcoming)) ||
        (Boolean(upcomingEmoji.decoration) &&
          upcomingEmoji.text !== upcoming &&
          isShortListPhrase(upcomingEmoji.text) &&
          !isDescriptionSubheading(upcoming) &&
          !isCalloutLine(upcoming));
      if (continuesList) {
        flushParagraph(paragraph, blocks);
        listItems.push(emojiLine.text);
        continue;
      }
    }

    if (
      emojiLine.decoration &&
      emojiLine.text !== line &&
      !isShortListPhrase(emojiLine.text)
    ) {
      flushList(listItems, blocks);
      flushParagraph(paragraph, blocks);
      paragraph.push(line);
      flushParagraph(paragraph, blocks);
      continue;
    }

    flushList(listItems, blocks);
    paragraph.push(line);
  }

  flushList(listItems, blocks);
  flushParagraph(paragraph, blocks);

  if (trailingTagLines.length > 0) {
    blocks.push({
      type: "tags",
      tags: trailingTagLines.flatMap(extractHashtags),
    });
  }

  return blocks;
}

function countTrailingBlanks(lines: string[]): number {
  let count = 0;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index]?.trim()) break;
    count += 1;
  }
  return count;
}

export type DescriptionCase = {
  name: string;
  input: string;
  expectedTypes: DescriptionBlock["type"][];
  notes: string;
};

/**
 * Documented cases (no test runner in this repo).
 */
export const LISTING_DESCRIPTION_CASES: DescriptionCase[] = [
  {
    name: "single paragraph",
    input: "Departamento luminoso en zona residencial.",
    expectedTypes: ["paragraph"],
    notes: "Una sola línea se renderiza como un párrafo.",
  },
  {
    name: "multiple paragraphs",
    input: "Primera parte.\n\nSegunda parte.",
    expectedTypes: ["paragraph", "paragraph"],
    notes: "Un salto doble separa párrafos.",
  },
  {
    name: "dash list",
    input: "- Recámara principal\n- Cocina integral",
    expectedTypes: ["list"],
    notes: "Guiones consecutivos se agrupan.",
  },
  {
    name: "bullet list",
    input: "• Estacionamiento\n• Seguridad 24 h",
    expectedTypes: ["list"],
    notes: "Viñetas • consecutivas se agrupan.",
  },
  {
    name: "emoji list",
    input: "✅ Alberca\n✅ Jardín",
    expectedTypes: ["list"],
    notes: "Emoji inicial + espacio actúa como viñeta si hay más de una línea.",
  },
  {
    name: "mixed",
    input: "Casa en esquina.\n\n- Terraza\n- Cuarto de servicio\n\nLista para habitar.",
    expectedTypes: ["paragraph", "list", "paragraph"],
    notes: "Párrafos y listas se conservan en orden.",
  },
  {
    name: "trailing hashtags",
    input: "Vista al valle.\n\n#venta #lujo",
    expectedTypes: ["paragraph", "tags"],
    notes: "Hashtags finales son secundarios. No se convierten en enlaces.",
  },
  {
    name: "repeated breaks",
    input: "Uno.\n\n\n\nDos.",
    expectedTypes: ["paragraph", "paragraph"],
    notes: "Líneas vacías excesivas se colapsan.",
  },
  {
    name: "empty",
    input: "   ",
    expectedTypes: [],
    notes: "Vacío o solo espacios → sin bloques; la sección se omite.",
  },
  {
    name: "special characters",
    input: "Precio <negociable> & “escrituras” 100%.",
    expectedTypes: ["paragraph"],
    notes: "React escapa el texto. No se interpreta HTML.",
  },
  {
    name: "subheading plus list",
    input:
      "Casa amplia en zona residencial.\n\nCaracterísticas principales:\n• Superficie 180 m²\n• 3 recámaras\n• 2 baños",
    expectedTypes: ["paragraph", "subheading", "list"],
    notes: "La línea con ':' no entra a la lista.",
  },
  {
    name: "emoji subheading plus list and paragraph",
    input:
      "Precio: $1,690,000 MXN\n\n🏠 Características principales:\n• Superficie 180 m²\n• 3 recámaras\n\nUbicación estratégica:\nA 5 minutos del centro.\n\nAgenda tu visita hoy mismo:\nEscríbenos para coordinar.\n\n#venta #lujo",
    expectedTypes: [
      "paragraph",
      "subheading",
      "list",
      "subheading",
      "paragraph",
      "subheading",
      "paragraph",
      "tags",
    ],
    notes: "Encabezados con o sin emoji salen de <ul>. Precio con ':' interno es párrafo.",
  },
  {
    name: "question is callout",
    input: "¿Quieres conocerlo?\n\nAgenda tu visita hoy mismo:\nTe esperamos.",
    expectedTypes: ["callout", "subheading", "paragraph"],
    notes: "Una pregunta promocional se muestra como callout, no como lista.",
  },
  {
    name: "invitation without colon is subheading",
    input: "Agenda tu visita hoy mismo\nEscríbenos para coordinar.",
    expectedTypes: ["subheading", "paragraph"],
    notes: "Invitación breve sin ':' sigue siendo encabezado.",
  },
  {
    name: "long emoji sentences stay paragraphs",
    input:
      "✅ Excelente iluminación natural en toda la casa.\n✅ Ubicada en una de las mejores zonas de la ciudad.",
    expectedTypes: ["paragraph", "paragraph"],
    notes: "Oraciones largas con emoji no se convierten en lista.",
  },
  {
    name: "single emoji line is paragraph",
    input: "✅ Casa lista para habitar.",
    expectedTypes: ["paragraph"],
    notes: "Un único renglón con emoji no se vuelve lista de un bullet.",
  },
];

export function verifyListingDescriptionCases(): string[] {
  const failures: string[] = [];
  for (const testCase of LISTING_DESCRIPTION_CASES) {
    const types = parseListingDescriptionForDisplay(testCase.input).map(
      (block) => block.type,
    );
    const same =
      types.length === testCase.expectedTypes.length &&
      types.every((type, index) => type === testCase.expectedTypes[index]);
    if (!same) {
      failures.push(
        `${testCase.name}: expected ${testCase.expectedTypes.join(",")} got ${types.join(",")}`,
      );
    }
  }
  return failures;
}
