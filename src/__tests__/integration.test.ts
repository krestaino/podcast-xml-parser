// This file is for testing real public feeds using podcast IDs and URLs from environment variables

import dotenv from "dotenv";
import podcastXmlParser from "../index";

dotenv.config();

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

  (PODCAST_URLS.length > 0 ? test : test.skip)("parses podcast URLs", async () => {
    expect.assertions(PODCAST_URLS.length * 5);

    await Promise.all(
      PODCAST_URLS.map(async (url) => {
        const { podcast, episodes, itunes } = await podcastXmlParser(new URL(url));

        expect(podcast.title).toBeDefined();
        expect(episodes.length).toBeGreaterThan(0);
        expect(episodes[0].title).toBeDefined();
        expect(itunes?.artworkUrl100).toBeDefined();
        expect(itunes?.feedUrl).toBe(url);
      }),
    );
  });
});
