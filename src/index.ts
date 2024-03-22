import { fetchPodcastFeed } from "./utils/fetch";
import { parsePodcastXML } from "./utils/xml";
import { transformPodcastData } from "./utils/transform";

const podcastXmlParser = async (url: string) => {
  const xmlText = await fetchPodcastFeed(url);
  const parsedXML = parsePodcastXML(xmlText);
  const { podcast, episodes } = transformPodcastData(parsedXML);
  return {
    podcast,
    episodes,
  };
};

export default podcastXmlParser;
