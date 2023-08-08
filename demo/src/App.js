import { useEffect, useState } from "react";
import podcastXmlParser from "podcast-xml-parser";
import { marked } from "marked";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");
  const [podcast, setPodcast] = useState({});
  const [episodes, setEpisodes] = useState([]);
  const [readmeContent, setReadmeContent] = useState("");

  async function fetchPodcast() {
    try {
      setLoading(true);
      setError(null);
      const xmlUrl = new URL(url);
      const { podcast, episodes } = await podcastXmlParser(xmlUrl);
      setPodcast(podcast);
      setEpisodes(episodes);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReadme() {
    try {
      const readmeUrl =
        "https://raw.githubusercontent.com/krestaino/podcast-xml-parser/main/README.md";
      const response = await fetch(readmeUrl);
      const readmeText = await response.text();
      setReadmeContent(marked(readmeText));
    } catch (error) {
      console.error("Error fetching README.md:", error);
    }
  }

  useEffect(() => {
    fetchReadme();
  }, []);

  return (
    <div>
      <section className="bg-neutral-800 py-4">
        <div className="max-w-5xl mx-auto">
          <form
            className="flex flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              fetchPodcast(url);
            }}
          >
            <h2 className="text-2xl font-bold">Try the demo</h2>
            <input
              className="bg-neutral-700 p-2 rounded flex-grow mt-4"
              id="urlInput"
              type="text"
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Enter Podcast XML URL"
            />
            <div className="mt-4">
              <button
                className="bg-neutral-200 text-neutral-900 p-2 rounded"
                type="submit"
              >
                Parse
              </button>
              <button
                onClick={() => {
                  setUrl("https://feeds.megaphone.fm/climbinggold");
                  fetchPodcast();
                }}
                className="bg-neutral-700 p-2 rounded ml-4"
                type="submit"
              >
                I'm Feeling Lucky
              </button>
            </div>
          </form>
        </div>
      </section>
      <section>
        {loading ? (
          <pre className="bg-blue-400">
            <div className="max-w-5xl mx-auto text-neutral-900 py-2 mb-4">
              Loading...
            </div>
          </pre>
        ) : error ? (
          <pre className="bg-red-400">
            <div className="max-w-5xl mx-auto text-neutral-900 py-2 mb-4">
              {error.message}
            </div>
          </pre>
        ) : episodes.length !== 0 ? (
          <section className="font-mono mt-8 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold">Podcast</h2>
            <table className="mt-4 w-full bg-neutral-800">
              <thead className="bg-neutral-700">
                <td className="border border-neutral-600 p-2 font-bold">key</td>
                <td className="border border-neutral-600 p-2 font-bold">
                  value
                </td>
              </thead>
              <tbody>
                {Object.keys(podcast).map((key) => (
                  <tr key={key}>
                    <td className="border border-neutral-600 p-2">{key}</td>
                    <td className="border border-neutral-600 p-2">
                      {JSON.stringify(podcast[key])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="text-2xl font-bold mt-4">
              Episodes ({episodes.length})
            </h2>
            {episodes.map((episode, episodeIdx) => (
              <table className="mt-4 w-full bg-neutral-800" key={episodeIdx}>
                <thead className="bg-neutral-700">
                  <td className="border border-neutral-600 p-2 font-bold">
                    key
                  </td>
                  <td className="border border-neutral-600 p-2 font-bold">
                    value
                  </td>
                </thead>
                <tbody>
                  {Object.keys(episode).map((key) => (
                    <tr key={key}>
                      <td className="border border-neutral-600 p-2">{key}</td>
                      <td className="border border-neutral-600 p-2">
                        {JSON.stringify(episode[key])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </section>
        ) : null}
      </section>

      <section className="max-w-5xl mx-auto my-8">
        <div
          className="prose prose-neutral dark:prose-invert max-w-5xl"
          dangerouslySetInnerHTML={{ __html: readmeContent }}
        />
      </section>
    </div>
  );
}

export default App;
