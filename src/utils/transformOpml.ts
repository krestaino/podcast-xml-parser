import { parseXml } from "./parseXml";

type Outline = {
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
 * Transforms parsed OPML XML data into an array of feed URLs.
 * @param xmlText The OPML XML data as a string.
 * @returns An array of feed URLs extracted from the OPML data.
 * @throws {Error} If the expected XML structure is not found.
 */
export function transformOpml(xmlText: string): string[] {
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

  const feedUrls = outlines.map((outline: Outline) => outline["@_xmlUrl"]).filter((url): url is string => !!url);

  return feedUrls;
}
