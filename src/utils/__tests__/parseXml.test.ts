import { parseXml } from "../parseXml";

describe("parseXml", () => {
  it("should parse XML text into a JavaScript object", () => {
    const xmlText = "<book><title>The Great Gatsby</title><author>F. Scott Fitzgerald</author><year>1925</year></book>";
    const expectedObject = {
      book: {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
      },
    };

    const result = parseXml(xmlText);

    expect(result).toEqual(expectedObject);
  });
});
