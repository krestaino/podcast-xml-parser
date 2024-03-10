import "dotenv/config";

import podcastXmlParser from "../src";
import { assertPodcastProperties, assertEpisodeProperties } from "./index.test";

describe("real feeds", () => {
  // NOTE: To run these tests, ensure that you set the environment variable FEED_URLS to a comma-separated list
  // of URLs of the XML feeds that you want to test. You can create an .env file to do this.
  const { FEED_URLS = "" } = process.env;

  if (FEED_URLS !== "") {
    const FEEDS = FEED_URLS.split(",");

    FEEDS.forEach((FEED_URL) => {
      it(`should parse the XML feed of URL: ${FEED_URL}`, async () => {
        const { podcast, episodes } = await podcastXmlParser(new URL(FEED_URL));

        expect(podcast.feedUrl).toBe(FEED_URL);
        assertPodcastProperties(podcast);
        episodes.forEach((episode) => {
          assertEpisodeProperties(episode);
        });
      });
    });
  }
});
