import { parseXml } from "./parseXml";

type Opml = {
  opml: {
    body: {
      outline?: Array<{ "@_xmlUrl"?: string }> | { "@_xmlUrl"?: string };
    };
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

  const outlines = opml.body.outline
    ? Array.isArray(opml.body.outline)
      ? opml.body.outline
      : [opml.body.outline]
    : [];
  const feed = outlines.map((outline) => outline["@_xmlUrl"]).filter((url): url is string => !!url);

  return feed;
}
