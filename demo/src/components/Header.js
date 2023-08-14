import React, { useState } from "react";
import podcastXmlParser from "podcast-xml-parser";

const PODCAST_FEEDS = [
  "https://feeds.megaphone.fm/climbinggold",
  "https://feeds.simplecast.com/dHoohVNH",
  "https://rss.art19.com/smartless",
  "https://feeds.simplecast.com/qm_9xx0g",
  "https://feeds.megaphone.fm/STU4418364045",
  // "https://feeds.simplecast.com/4T39_jAj",
  "https://feeds.npr.org/500005/podcast.xml",
];

export default function Header({ config, setConfig, setLoading, setError, setPodcast, setEpisodes, setItunes }) {
  const [source, setSource] = useState("");

  function getRandomFeed() {
    const randomIndex = Math.floor(Math.random() * PODCAST_FEEDS.length);
    const source = PODCAST_FEEDS[randomIndex];
    setSource(source);
    return source;
  }

  async function fetchPodcast(source) {
    try {
      setLoading(true);
      setError(null);

      if (source !== "") {
        const url = new URL(source);
        const { podcast, episodes, itunes } = await podcastXmlParser(url, config);
        setPodcast(podcast);
        setEpisodes(episodes);
        setItunes(itunes || null);
      } else {
        setError({ message: "Invalid input. Must be a URL, number, or a non-empty string." });
      }
    } catch (error) {
      const num = Number(source);
      if (!isNaN(num)) {
        const { podcast, episodes, itunes } = await podcastXmlParser(parseInt(source), config);
        setPodcast(podcast);
        setEpisodes(episodes);
        setItunes(itunes || null);
      } else if (typeof source === "string" && source !== "") {
        const { podcast, episodes, itunes } = await podcastXmlParser(source, config);
        setPodcast(podcast);
        setEpisodes(episodes);
        setItunes(itunes || null);
      } else {
        if (source.href === "https://feeds.npr.org/500005/podcast.xml") {
          setError({
            message: `You were unlucky. This feed (${source}) has CORS enabled.\nIt is included in the demo to demonstrate that browser based parsing is not reliable.\nUse this library in Node or React Native to parse this feed reliably.\n\n${error}`,
          });
        } else {
          setError(error);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-neutral-800">
      <div className="max-w-5xl mx-auto p-4">
        <form
          className="flex flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            fetchPodcast(source);
          }}
        >
          <h2 className="text-2xl font-bold">Try the demo</h2>
          <input
            className="bg-neutral-700 p-2 rounded flex-grow mt-4"
            id="urlInput"
            type="text"
            onChange={(event) => setSource(event.target.value)}
            placeholder="Enter Podcast XML URL, iTunes ID, or an XML string"
            value={source}
          />
          <div className="mt-4 flex items-center">
            <button className="bg-neutral-200 text-neutral-900 p-2 rounded" type="submit">
              Parse
            </button>

            <button
              onClick={(event) => {
                event.preventDefault();
                fetchPodcast(new URL(getRandomFeed()));
              }}
              className="bg-neutral-700 p-2 rounded ml-4"
            >
              Random Feed
            </button>

            <div className="ml-4 flex items-center">
              <span>Config:</span>
              <div className="ml-4 flex items-center">
                <input
                  type="checkbox"
                  role="switch"
                  value={config.itunes}
                  checked={config.itunes}
                  id="itunes"
                  onChange={() => setConfig({ ...config, itunes: !config.itunes })}
                />
                <label className="inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="itunes">
                  itunes
                </label>
              </div>

              <div className="ml-4 flex items-center">
                <label className="inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="start">
                  start
                </label>
                <input
                  className="bg-neutral-700 p-2 rounded w-16 ml-2"
                  id="start"
                  type="number"
                  onChange={(event) => setConfig({ ...config, start: Number(event.target.value) })}
                  value={config.start}
                />
              </div>

              <div className="ml-4 flex items-center">
                <label className="inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="limit">
                  limit
                </label>
                <input
                  className="bg-neutral-700 p-2 rounded w-16 ml-2"
                  id="limit"
                  type="number"
                  onChange={(event) => setConfig({ ...config, limit: Number(event.target.value) })}
                  value={config.limit}
                />
              </div>

              <div className="ml-4 flex items-center">
                <label className="inline-block pl-[0.15rem] hover:cursor-pointer" htmlFor="requestSize">
                  requestSize
                </label>
                <input
                  className="bg-neutral-700 p-2 rounded w-24 ml-2"
                  id="requestSize"
                  type="number"
                  onChange={(event) => setConfig({ ...config, requestSize: Number(event.target.value) })}
                  value={config.requestSize}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
