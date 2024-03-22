import { fetchPodcastFeed } from "./fetch";
import { fetchItunes } from "./itunes";

import { parsePodcastXML } from "./xml";
import { transformPodcastData } from "./transform";
import { Itunes } from "./types/Itunes";

const podcastXmlParser = async (input: URL | number | string) => {
  let xmlText: string;
  let itunes: Itunes = {};

  if (input instanceof URL) {
    xmlText = await fetchPodcastFeed(input);
  } else if (typeof input === "number") {
    itunes = await fetchItunes(input);
    if (!itunes.feedUrl) {
      throw new Error("Unable to retrieve podcast feed URL from iTunes");
    }
    xmlText = await fetchPodcastFeed(new URL(itunes.feedUrl));
  } else if (typeof input === "string") {
    xmlText = input;
  } else {
    throw new Error("Invalid input type. Expected URL, number, or string.");
  }

  const parsedXML = parsePodcastXML(xmlText);
  const { podcast, episodes } = transformPodcastData(parsedXML);

  if (!itunes.feedUrl) {
    itunes = await fetchItunes(podcast.title);
  }

  return { podcast, episodes, itunes };
};

export default podcastXmlParser;
