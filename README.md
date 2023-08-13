# podcast-xml-parser

A library for parsing XML podcast feeds, designed to work in Node.js, browser environments, and React Native.

## Features

- **Simple Parsing:** Parse XML podcast feeds into JavaScript objects.
- **Versatile Input:** Parse directly from XML strings, URLs, or even iTunes IDs.
- **Cross-platform:** Designed to be compatible across Node.js, browsers, and React Native.
- **Graceful Handling:** In cases of missing elements in the XML feed, the parser returns empty strings instead of throwing errors.
- **Support for iTunes:** Additional details can be fetched from iTunes.
- **Partial Feed Support:** Allows fetching and parsing a specific byte range of a feed.

<!-- HIDE_SECTION_START -->
## Live Demo
Want to see the library in action? Check the [demo](https://podcast-xml-parser.kmr.io/) and test out `podcast-xml-parser` with various XML podcast feeds.
<!-- HIDE_SECTION_END -->

## Installation

You can install the library using npm or yarn.

```bash
npm install podcast-xml-parser

# or

yarn add podcast-xml-parser
```

## Usage

### `podcastXmlParser`

**Purpose**: Parses a podcast's XML feed to retrieve podcast and episode details.

**Parameters**:

- `source` _(string | URL | number)_: The source of the XML content. Can be a URL object, an iTunes ID, or an XML string.
- `config` _(Config)_: Configuration options for the request, like request size, pagination, or to additionally return iTunes details.

**Returns**:
A promise that resolves with an object containing:

- `podcast`: Details of the podcast.
- `episodes`: An array of episode details.
- `itunes?`: Additional iTunes details.

**Signature**:

```typescript
podcastXmlParser(xmlSource: string | URL| number): Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: any }>
```

## Examples

### From a URL

When parsing a URL, you must call `new URL()` otherwise the library will try to parse the URL as XML, rather than the contents of the URL.

```javascript
import podcastXmlParser from "podcast-xml-parser";

const xmlUrl = new URL("https://example.com/podcast.xml"); // must use `new URL()`!
const { podcast, episodes } = await podcastXmlParser(xmlUrl);

console.log(podcast.title);
console.log(episodes[0].title);
```
### From an iTunes ID

When parsing from an iTunes ID, make sure the value is a number.

```javascript
import podcastXmlParser from "podcast-xml-parser";

const collectionId = 1438054347; // iTunes collectionId
const { podcast } = await podcastXmlParser(collectionId);

console.log(podcast.title); // "Conan O’Brien Needs A Friend"
```

### From an XML string

You can read from the filesystem or pass a string.

```javascript
// From the filesystem
import fs from "fs";
import podcastXmlParser from "podcast-xml-parser";

const xmlData = fs.readFileSync("test.xml", "utf-8");
const { podcast } = await podcastXmlParser(xmlData);

console.log(podcast.title);
```

```javascript
// From a string
import podcastXmlParser from "podcast-xml-parser";

const xmlString = `
  <rss version="2.0">
    <channel>
      <title>Podcast Title</title>
      <item>
        <title>Episode 1 Title</title>
      </item>
    </channel>
  </rss>
`;

const { podcast, episodes } = await podcastXmlParser(xmlString);

console.log(podcast.title); // Podcast Title
console.log(episodes[0].title); // Episode 1 Title
```

## TypeScript

```typescript
// From a URL
import podcastXmlParser, { Podcast, Episode } from "podcast-xml-parser";

const xmlUrl = new URL("https://example.com/podcast.xml"); // must use `new URL()`!
const { podcast, episodes }: { podcast: Podcast; episodes: Episode[] } = await podcastXmlParser(xmlUrl);

console.log(podcast.title);
console.log(episodes[0].title);
```

### Types

The library defines the following custom types that can be used in your code:

#### 1. `Podcast`

```typescript
interface Podcast {
  copyright: string;
  contentEncoded: string;
  description: string;
  feedUrl: string;
  image: { link: string; title: string; url: string } | null;
  itunesAuthor: string;
  itunesCategory: string | null;
  itunesExplicit: string;
  itunesImage: string | null;
  itunesOwner: { name: string; email: string } | null;
  itunesSubtitle: string;
  itunesSummary: string;
  itunesType: string;
  language: string;
  link: string;
  title: string;
}
```

#### 2. `Episode`

```typescript
interface Episode {
  author: string;
  contentEncoded: string;
  description: string;
  enclosure: { url: string; type: string } | null;
  guid: string;
  itunesAuthor: string;
  itunesDuration: string;
  itunesEpisode: string;
  itunesEpisodeType: string;
  itunesExplicit: string;
  itunesSubtitle: string;
  itunesSummary: string;
  itunesTitle: string;
  link: string;
  pubDate: string;
  title: string;
}
```

#### 3. `Config`

```typescript
interface Config {
  start?: number;
  limit?: number;
  requestSize?: number;
  itunes?: boolean;
}
```

## Running Tests

To run the test suite, execute the following command:

```bash
npm test

# or

yarn test
```

## Contribution

Contributions to `podcast-xml-parser` are welcome! If you find any bugs, have feature requests, or want to improve the library, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
