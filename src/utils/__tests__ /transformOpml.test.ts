import { parseXml } from "@rgrove/parse-xml";

import { transformOpml } from "../../utils";

describe("transformOpml", () => {
  const validXml = `<?xml version="1.0" encoding="utf-8" standalone="no"?>
  <opml version="1.0">
    <head>
      <title>Podcasts Feeds</title>
    </head>
    <body>
      <outline text="feeds">
        <outline xmlUrl="https://example.com/podcast" type="rss" text="Podcast Title" />
        <outline xmlUrl="https://example.com/podcast-2" type="rss" text="Podcast 2 Title" />
      </outline>
    </body>
  </opml>`;

  it("should transform valid XML data into a string array", () => {
    const parsedXml = parseXml(validXml);
    const result = transformOpml(parsedXml);
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
  });

  it("should throw an error if the body element is not found", () => {
    const invalidXml = `<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"></opml>`;
    const parsedXml = parseXml(invalidXml);
    expect(() => transformOpml(parsedXml)).toThrow("Body element not found");
  });

  it("should throw an error if the outline element is not found", () => {
    const invalidXml = `<?xml version="1.0" encoding="UTF-8"?><opml version="1.0"><body></body></opml>`;
    const parsedXml = parseXml(invalidXml);
    expect(() => transformOpml(parsedXml)).toThrow("Outline element not found");
  });

  it("should transform episode data correctly", () => {
    const parsedXml = parseXml(validXml);
    const result = transformOpml(parsedXml);
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual("https://example.com/podcast");
    expect(result[1]).toEqual("https://example.com/podcast-2");
  });
});
