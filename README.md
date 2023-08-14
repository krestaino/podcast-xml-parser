# podcast-xml-parser

Parse podcast feeds in Node.js, React Native, or browser environments.

- **Simple Parsing:** Parse XML podcast feeds into JavaScript objects.
- **Versatile Input:** Parse from URLs, iTunes IDs, or directly from XML strings.
- **Cross-platform:** Designed to be compatible across Node.js, browsers, and React Native.
- **Graceful Handling:** In cases of missing elements in the XML feed, the parser returns empty strings instead of throwing errors.
- **Support for iTunes:** Additional details can be fetched from iTunes.
- **Partial Feed Support:** Allows fetching and parsing a specific byte range of a feed.

<!-- HIDE_SECTION_START -->
## Live Demo
Want to see the library in action? Check the [demo](https://podcast-xml-parser.kmr.io/) and test out `podcast-xml-parser` with various XML podcast feeds.
<!-- HIDE_SECTION_END -->

## Installation

You can install the library using `npm` or `yarn`.

```bash
npm install podcast-xml-parser
# or
yarn add podcast-xml-parser
```

## Basic Example
```javascript
import podcastXmlParser from "podcast-xml-parser";

const url = new URL("https://feeds.simplecast.com/dHoohVNH");
const { podcast } = await podcastXmlParser(url);

console.log(podcast.title); // "Conan O’Brien Needs A Friend"
```

## Usage `podcastXmlParser()`

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
podcastXmlParser(source: string | URL | number): Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: any }>
```

## Configuration Options

The `podcastXmlParser` function accepts a configuration object as its second parameter, allowing you to customize various aspects of the parsing process.

#### `requestSize`: number
Specifies the number of bytes to fetch from the XML feed, allowing you to limit the size of the request. Useful for improving response times when you only need a portion of the feed.
```javascript
const config = { requestSize: 50000 }; // First 50,000 bytes of the feed
```

#### `start`: number
The starting index for episode pagination. Combined with the `limit` option, this allows you to paginate through the episodes in the feed.
```javascript
const config = { start: 0, limit: 10 }; // Retrieves the last 10 episodes
```

#### `limit`: number
The number of episodes to retrieve from the starting index. Used in conjunction with the `start` option for pagination.
```javascript
const config = { start: 5, limit: 5 }; // Retrieves episodes 6 through 10
```

#### `itunes`: boolean
A boolean flag to control whether iTunes data is retrieved. If set to `true`, the parser will fetch additional details from iTunes based on the podcast's feed URL.
```javascript
const config = { itunes: true }; // Enables iTunes integration
```

## Examples

### From a URL

When parsing a URL, you must call `new URL()` otherwise the library will try to parse the URL as XML, rather than the contents of the URL.

```javascript
import podcastXmlParser from "podcast-xml-parser";

const url = new URL("https://feeds.simplecast.com/dHoohVNH"); // must use `new URL()`!
const { podcast, episodes, itunes } = await podcastXmlParser(url);

console.log(podcast.title); // "Conan O’Brien Needs A Friend"
console.log(episodes[episodes.length - 1].title); // "Introducing Conan’s new podcast"
console.log(itunes.collectionId); // 1438054347
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

#### From the filesystem

```javascript
import fs from "fs";
import podcastXmlParser from "podcast-xml-parser";

const xmlData = fs.readFileSync("test.xml", "utf-8");
const { podcast } = await podcastXmlParser(xmlData);

console.log(podcast.title);
```

#### From a string

```javascript
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

### Partial Feed

You can limit the request size of the XML fetch to improve response times. This can be useful to return the latest episodes quickly when you don't need the entire feed.

```javascript
import podcastXmlParser from "podcast-xml-parser";

const url = new URL("https://feeds.simplecast.com/54nAGcIl"); // From a URL with a huge feed
const config = { requestSize: 50000 } // First 50,000 bytes of the feed
const { episodes, itunes } = await podcastXmlParser(collectionId, config);

console.log(episodes.length !== itunes.trackCount) // true
```

### Pagination

Pagination allows you to control the number of episodes returned by the parser. It lets you define the starting point and the limit for fetching the episodes. When parsing a partial feed with `requestSize` set, be aware that the episodes you request may not be in the feed.

```javascript
import podcastXmlParser from "podcast-xml-parser";

const config = { start: 0, limit: 10 } // Last 10 episodes
const { episodes } = await podcastXmlParser(1438054347, config); // From an iTunes ID

console.log(episodes.length); // 10
```

## TypeScript

```typescript
import podcastXmlParser, { Podcast } from "podcast-xml-parser";

const url = new URL("https://feeds.simplecast.com/dHoohVNH"); // From a URL
const { podcast }: { podcast: Podcast } = await podcastXmlParser(url);

console.log(podcast.title); // "Conan O’Brien Needs A Friend"
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
