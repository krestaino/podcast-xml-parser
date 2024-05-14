import React, { useState } from "react";
import { podcastXmlParser } from "podcast-xml-parser";

import Config from "./Config";

const PODCAST_FEEDS = [
  "https://feeds.megaphone.fm/climbinggold",
  "https://feeds.simplecast.com/dHoohVNH",
  "https://rss.art19.com/smartless",
  "https://feeds.simplecast.com/qm_9xx0g",
  "https://feeds.megaphone.fm/STU4418364045",
  // "https://feeds.simplecast.com/4T39_jAj",
  // "https://feeds.npr.org/500005/podcast.xml",
];

export default function Header({ config, setConfig, setLoading, setError, setPodcast, setEpisodes, setItunes }) {
  const [source, setSource] = useState("");

  function getRandomFeed() {
    const randomIndex = Math.floor(Math.random() * PODCAST_FEEDS.length);
    const source = PODCAST_FEEDS[randomIndex];
    setSource(source);
    return source;
  }

  async function parse(source, config, setPodcast, setEpisodes, setItunes) {
    const { podcast, episodes, itunes } = await podcastXmlParser(source, config);
    setPodcast(podcast);
    setEpisodes(episodes);
    setItunes(itunes || null);
  }

  function handleError(source, error) {
    if (source.href === "https://feeds.npr.org/500005/podcast.xml") {
      setError({
        message: `You were unlucky. This feed (${source}) has CORS enabled.\nIt is included in the demo to demonstrate that browser based parsing is not reliable.\nUse this library in Node or React Native to parse this feed reliably.\n\n${error}`,
      });
    } else {
      setError(error);
    }
  }

  async function fetchPodcast(source) {
    try {
      setLoading(true);
      setError(null);

      if (source !== "") {
        const url = new URL(source);
        await parse(url, config, setPodcast, setEpisodes, setItunes);
      } else {
        setError({ message: "Invalid input. Must be a URL, number, or a non-empty string." });
      }
    } catch (error) {
      try {
        const num = Number(source);
        if (!isNaN(num)) {
          await parse(parseInt(source), config, setPodcast, setEpisodes, setItunes);
        } else if (typeof source === "string" && source !== "") {
          await parse(source, config, setPodcast, setEpisodes, setItunes);
        } else {
          handleError(source, error);
        }
      } catch (error) {
        handleError(source, error);
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
          <div className="mt-4 flex flex-col lg:flex-row items-start lg:items-center">
            <div className="flex order-1 lg:order-none w-full lg:w-auto mt-4 lg:mt-0">
              <button className="bg-neutral-200 text-neutral-900 p-2 rounded flex-1" type="submit">
                Parse
              </button>

              <button
                onClick={(event) => {
                  event.preventDefault();
                  fetchPodcast(new URL(getRandomFeed()));
                }}
                className="bg-neutral-700 p-2 rounded ml-4 flex-1"
              >
                Random
              </button>
            </div>

            <Config config={config} setConfig={setConfig} />
          </div>
        </form>
      </div>
    </section>
  );
}
