// This file is for testing real public feeds using podcast IDs and URLs from environment variables

import dotenv from "dotenv";
import podcastXmlParser, { podcastOpmlParser } from "../index";

dotenv.config();

const OPML_URLS = process.env.OPML_URLS ? process.env.OPML_URLS.split(",") : [];
const PODCAST_IDS = process.env.PODCAST_IDS ? process.env.PODCAST_IDS.split(",") : [];
const PODCAST_URLS = process.env.PODCAST_URLS ? process.env.PODCAST_URLS.split(",") : [];

beforeAll(() => {
  global.fetch = fetch;
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("podcastXmlParser", () => {
  (PODCAST_IDS.length > 0 ? test : test.skip)("parses podcast IDs", async () => {
    expect.assertions(PODCAST_IDS.length * 5);

    await Promise.all(
      PODCAST_IDS.map(async (id: string) => {
        const { podcast, episodes, itunes } = await podcastXmlParser(parseInt(id));

        expect(podcast.title).toBeDefined();
        expect(episodes.length).toBeGreaterThan(0);
        expect(episodes[0].title).toBeDefined();
        expect(itunes?.artworkUrl100).toBeDefined();
        expect(itunes?.collectionId).toBe(parseInt(id));
      }),
    );
  });

  (PODCAST_URLS.length > 0 ? test : test.skip)("parses podcast IDs", async () => {
    const baseAssertions = PODCAST_URLS.length * 3;
    let itunesAssertions = 0;

    await Promise.all(
      PODCAST_URLS.map(async (url: string) => {
        const { podcast, episodes, itunes } = await podcastXmlParser(new URL(url));

        expect(podcast.title).toBeDefined();
        expect(episodes.length).toBeGreaterThan(0);
        expect(episodes[0].title).toBeDefined();

        if (itunes) {
          itunesAssertions += 2;
          expect(itunes.artworkUrl100).toBeDefined();
          expect(itunes.feedUrl).toBe(url);
        }
      }),
    );

    expect.assertions(baseAssertions + itunesAssertions);
  });
});

describe("podcastOpmlParser", () => {
  (OPML_URLS ? test : test.skip)("parses OPML feeds", async () => {
    expect.assertions(OPML_URLS.length * 2);

    await Promise.all(
      OPML_URLS.map(async (url) => {
        const feeds = await podcastOpmlParser(new URL(url));

        expect(feeds).toBeDefined();
        expect(feeds.length).toBeGreaterThan(0);
      }),
    );
  });
});
