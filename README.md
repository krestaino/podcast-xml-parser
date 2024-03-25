<!-- HIDE_SECTION_START -->

[![GitHub Repo](https://img.shields.io/github/package-json/v/krestaino/podcast-xml-parser/main?label=GitHub)](https://github.com/krestaino/podcast-xml-parser)
[![NPM Package](https://img.shields.io/npm/v/podcast-xml-parser?color=red)](https://www.npmjs.com/package/podcast-xml-parser)
[![MIT License](https://img.shields.io/github/license/krestaino/podcast-xml-parser.svg)](https://raw.githubusercontent.com/krestaino/podcast-xml-parser/main/LICENSE.md)
[![Build](https://img.shields.io/github/actions/workflow/status/krestaino/podcast-xml-parser/build.yml)](https://github.com/krestaino/podcast-xml-parser/actions/workflows/build.yml)
[![Codecov](https://codecov.io/github/krestaino/podcast-xml-parser/graph/badge.svg?token=IS0T58N4FQ)](https://codecov.io/github/krestaino/podcast-xml-parser)
[![Live Demo](https://img.shields.io/badge/demo-live-blueviolet)](https://podcast-xml-parser.kmr.io/)

<!-- HIDE_SECTION_END -->

# podcast-xml-parser

Parse podcast feeds in browsers, React Native, or Node.js environments.

- **📜 Simple Parsing:** Parse XML podcast feeds into JavaScript objects.
- **🔗 Versatile Input:** Parse from URLs, iTunes IDs, or directly from XML strings.
- **💻 Cross-platform:** Designed to work in browsers, React Native, and Node.js.
- **🚫 Graceful Handling:** In cases of missing elements in the XML feed, the parser returns empty strings instead of throwing errors.
- **🎧 Support for iTunes:** Additional details can be fetched from iTunes.
- **🔢 Partial Feed Support:** Allows fetching and parsing a specific byte range of a feed.
- **🌐 OPML Parsing:** Extracts podcast feed URLs from OPML outlines, commonly used for podcast subscriptions.

<!-- HIDE_SECTION_START -->

## Live Demo

Want to see the library in action? Check the [demo](https://podcast-xml-parser.kmr.io/) and test out `podcast-xml-parser` with various XML podcast feeds.

<!-- HIDE_SECTION_END -->

## Requirements

This library uses the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). In environments where the Fetch API is not available, you need to use a polyfill. Notably, Node.js 17 or lower and Internet Explorer do not support the Fetch API. See [here](https://github.com/BuilderIO/this-package-uses-fetch) for more information about how to polyfill the Fetch API.

## Installation

You can install the library using `npm` or `yarn`.

```bash
npm install podcast-xml-parser
# or
yarn add podcast-xml-parser
```

## Basic Example

```javascript
import { podcastXmlParser } from "podcast-xml-parser";

const url = new URL("https://feeds.simplecast.com/dHoohVNH");
const { podcast } = await podcastXmlParser(url);

console.log(podcast.title); // "Conan O’Brien Needs A Friend"
```

## Usage `podcastXmlParser()`

**Purpose**: Parses a podcast's XML feed to retrieve podcast and episode details.

**Parameters**:

- `source` _(URL | number | string)_: The source of the XML content. Can be a URL object, an iTunes ID, or an XML string.
- `config` _(Config)_: Configuration options for the request, like request size, request headers, pagination, or to additionally return iTunes details.

**Returns**:
A promise that resolves with an object containing:

- `podcast`: Details of the podcast.
- `episodes`: An array of episode details.
- `itunes?`: Additional iTunes details.

**Signature**:

```typescript
podcastXmlParser(source: URL | number | string, config?: Config): Promise<{
  podcast: Podcast;
  episodes: Episode[];
  itunes?: Itunes;
}>
```

## Usage `podcastOpmlParser()`

**Purpose**: Parses an OPML outline to extract podcast feed URLs.

**Parameters**:

- `source` _(URL | string)_: The source of the OPML content. Can be a URL object or an XML string.

**Returns**:
A promise that resolves with an array of feed URLs extracted from the OPML outline.

**Signature**:

```typescript
podcastOpmlParser(source: URL | string): Promise<string[]>
```

## Configuration Options

The `podcastXmlParser` function accepts a configuration object as its second parameter, allowing you to customize various aspects of the parsing process.

#### `requestHeaders`: Record<string, string>

Allows you to set custom headers for the HTTP request when fetching the XML feed. This can be useful for setting a custom `User-Agent` or other headers required by the server. If no `User-Agent` is specified, the default user agent `podcast-xml-parser/{version}` is used, where `{version}` is the version of the library.

```javascript
const config = {
  requestHeaders: {
    "User-Agent": "MyCustomUserAgent/1.0",
  },
}; // Sets a custom User-Agent header
```

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
const config = { itunes: true }; // Fetch additional details from iTunes
```

## Examples

### From a URL

When parsing a URL, you must call `new URL()` otherwise the library will try to parse the URL as XML, rather than the contents of the URL.

```javascript
import { podcastXmlParser } from "podcast-xml-parser";

const url = new URL("https://feeds.simplecast.com/dHoohVNH"); // Use 'new URL()' to ensure the library treats it as a URL
const { podcast, episodes, itunes } = await podcastXmlParser(url);

console.log(podcast.title); // "Conan O’Brien Needs A Friend"
console.log(episodes[episodes.length - 1].title); // "Introducing Conan’s new podcast"
console.log(itunes.collectionId); // 1438054347
```

### From an iTunes ID

When parsing from an iTunes ID, make sure the value is a number.

```javascript
import { podcastXmlParser } from "podcast-xml-parser";

const collectionId = 1438054347; // iTunes collectionId
const { podcast } = await podcastXmlParser(collectionId);

console.log(podcast.title); // "Conan O’Brien Needs A Friend"
```

### From an XML string

You can read from the filesystem or pass a string.

#### From the filesystem

```javascript
import fs from "fs";
import { podcastXmlParser } from "podcast-xml-parser";

const xmlData = fs.readFileSync("test.xml", "utf-8");
const { podcast } = await podcastXmlParser(xmlData);

console.log(podcast.title);
```

#### From a string

```javascript
import { podcastXmlParser } from "podcast-xml-parser";

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

### iTunes Data

You can optionally return additional data from iTunes. This can be useful for obtaining consistent and reasonable artwork. Some podcast feeds use large uncompressed artwork. The artwork returned from the iTunes response is compressed and standardized, making it much easier to work with. You can see the data structure in the [iTunes Search API documentation](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/UnderstandingSearchResults.html). Enabling this feature requires an additional network request.

```javascript
import { podcastXmlParser } from "podcast-xml-parser";

const url = new URL("https://feeds.simplecast.com/dHoohVNH"); // From a URL
const config = { itunes: true }; // Enable additional details from iTunes
const { podcast, itunes } = await podcastXmlParser(url, config);

console.log(podcast.title); // "Conan O’Brien Needs A Friend"
console.log(itunes.artworkUrl600); // "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/0f/89/ef/0f89ef97-d10c-4b90-6127-ccee04776d54/mza_5706050832923787468.jpg/600x600bb.jpg"
```

**Note**: If the podcast is not available on iTunes, the `itunes` property in the returned object from the `podcastXmlParser()` function will be `undefined`.

### Partial Feed

You can limit the request size of the XML fetch to improve response times. This can be useful to return the latest episodes quickly when you don't need the entire feed.

```javascript
import { podcastXmlParser } from "podcast-xml-parser";

const url = new URL("https://feeds.simplecast.com/54nAGcIl"); // From a URL with a huge feed
const config = { requestSize: 50000, itunes: true }; // First 50,000 bytes of the feed
const { episodes, itunes } = await podcastXmlParser(url, config);

console.log(episodes.length !== itunes.trackCount); // true
```

**Note**: To use the `requestSize` option, it is not necessary to enable the iTunes data fetch by setting `itunes: true`. In the above example, the `itunes: true` option is used to demonstrate that the partial feed is returning a subset of episodes. By fetching additional iTunes data, we can compare the total number of episodes from the iTunes metadata with the number of episodes returned in the partial feed.

### Pagination

Pagination allows you to control the number of episodes returned by the parser. It lets you define the starting point and the limit for fetching the episodes. When parsing a partial feed with `requestSize` set, be aware that the episodes you request may not be in the feed.

```javascript
import { podcastXmlParser } from "podcast-xml-parser";

const config = { start: 0, limit: 10 }; // Last 10 episodes
const { episodes } = await podcastXmlParser(1438054347, config); // From an iTunes ID

console.log(episodes.length); // 10
```

## TypeScript

```typescript
import { podcastXmlParser, Podcast, Episode, Itunes } from "podcast-xml-parser";

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
  image: {
    link: string;
    title: string;
    url: string;
  };
  itunesAuthor: string;
  itunesCategory: string;
  itunesExplicit: string;
  itunesImage: string;
  itunesOwner: {
    name: string;
    email: string;
  };
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
  enclosure: {
    url: string;
    type: string;
  };
  guid: string;
  itunesAuthor: string;
  itunesDuration: number;
  itunesEpisode: string;
  itunesEpisodeType: string;
  itunesExplicit: string;
  itunesImage: string;
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
  requestHeaders?: Record<string, string>;
  requestSize?: number;
  itunes?: boolean;
}
```

#### 4. `Itunes`

**Note**: The `Itunes` type interface reflects the current structure of the iTunes API response. However, this structure is subject to change without notice, and fields may be absent in some responses. Developers should implement appropriate error handling to accommodate potential changes and missing fields in the iTunes data.

```typescript
interface Itunes {
  wrapperType?: string;
  kind?: string;
  collectionId?: number;
  trackId?: number;
  artistName?: string;
  collectionName?: string;
  trackName?: string;
  collectionCensoredName?: string;
  trackCensoredName?: string;
  collectionViewUrl?: string;
  feedUrl?: string;
  trackViewUrl?: string;
  artworkUrl30?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  collectionPrice?: number;
  trackPrice?: number;
  trackRentalPrice?: number;
  collectionHdPrice?: number;
  trackHdPrice?: number;
  trackHdRentalPrice?: number;
  releaseDate?: string;
  collectionExplicitness?: string;
  trackExplicitness?: string;
  trackCount?: number;
  country?: string;
  currency?: string;
  primaryGenreName?: string;
  contentAdvisoryRating?: string;
  genreIds?: string[];
  genres?: string[];
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
