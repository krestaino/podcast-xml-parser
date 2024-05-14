import { parseXml } from "../utils";

type Outline = {
  "@_text"?: string;
  "@_xmlUrl"?: string;
};

type OutlineContainer = {
  outline?: Outline | Outline[];
};

type OpmlBody = {
  outline?: Outline | Outline[] | OutlineContainer;
};

type Opml = {
  opml: {
    body?: OpmlBody;
  };
};

/**
 * Transforms parsed OPML XML data into an array of objects containing feed URLs and titles.
 *
 * @param xmlText - The OPML XML data as a string.
 * @returns An array of objects with each object containing a feed URL and an optional title.
 * @throws If the expected XML structure is not found.
 */
export function transformOpml(xmlText: string): { title?: string; url: string }[] {
  const parsedXML = parseXml(xmlText) as Opml;
  const { opml } = parsedXML;

  if (!opml?.body) {
    throw new Error("Expected XML structure not found");
  }

  let outlines: Outline[] = [];
  if (opml.body.outline) {
    if (Array.isArray(opml.body.outline)) {
      outlines = opml.body.outline;
    } else if (typeof opml.body.outline === "object" && "outline" in opml.body.outline) {
      const container = opml.body.outline as OutlineContainer;
      if (Array.isArray(container.outline)) {
        outlines = container.outline;
      } else if (container.outline) {
        outlines = [container.outline];
      }
    } else {
      outlines = [opml.body.outline as Outline];
    }
  }

  return outlines
    .filter((outline: Outline) => outline["@_xmlUrl"] !== undefined)
    .map((outline: Outline) => ({
      title: outline["@_text"],
      url: outline["@_xmlUrl"]!,
    }));
}
