// This file is for testing real public feeds using podcast IDs and URLs from environment variables

import dotenv from "dotenv";
import podcastXmlParser from "../index";

dotenv.config();

const IDS = process.env.PODCAST_IDS ? process.env.PODCAST_IDS.split(",") : [];
const URLS = process.env.PODCAST_URLS ? process.env.PODCAST_URLS.split(",") : [];

beforeAll(() => {
  global.fetch = fetch;
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("podcastXmlParser", () => {
  (IDS.length > 0 ? test : test.skip)("parses podcast IDs", async () => {
    expect.assertions(IDS.length * 4);

    await Promise.all(
      IDS.map(async (id: string) => {
        const { podcast, episodes, itunes } = await podcastXmlParser(parseInt(id));

        expect(podcast.title).toBeDefined();
        expect(episodes.length).toBeGreaterThan(0);
        expect(episodes[0].title).toBeDefined();
        expect(itunes?.artworkUrl100).toBeDefined();
      }),
    );
  });

  (URLS.length > 0 ? test : test.skip)("parses podcast URLs", async () => {
    expect.assertions(URLS.length * 4);

    await Promise.all(
      URLS.map(async (url) => {
        const { podcast, episodes, itunes } = await podcastXmlParser(new URL(url));

        expect(podcast.title).toBeDefined();
        expect(episodes.length).toBeGreaterThan(0);
        expect(episodes[0].title).toBeDefined();
        expect(itunes?.artworkUrl100).toBeDefined();
      }),
    );
  });
});
