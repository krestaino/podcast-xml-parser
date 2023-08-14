import { useState } from "react";

import Header from "./components/Header";
import Results from "./components/Results";
import Readme from "./components/Readme";

const CONFIG = {
  start: 0,
  limit: -1,
  requestSize: 50000,
  itunes: true,
};

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [podcast, setPodcast] = useState(undefined);
  const [episodes, setEpisodes] = useState(undefined);
  const [itunes, setItunes] = useState(undefined);
  const [config, setConfig] = useState(CONFIG);

  return (
    <div>
      <Header
        config={config}
        setConfig={setConfig}
        setLoading={setLoading}
        setError={setError}
        setPodcast={setPodcast}
        setEpisodes={setEpisodes}
        setItunes={setItunes}
      />
      <section>
        {loading ? (
          <pre className="bg-blue-400">
            <div className="max-w-5xl mx-auto text-neutral-900 p-4">Loading...</div>
          </pre>
        ) : error ? (
          <pre className="bg-red-400">
            <div className="max-w-5xl mx-auto text-neutral-900 p-4">{error.message}</div>
          </pre>
        ) : podcast ? (
          <Results config={config} podcast={podcast} episodes={episodes} itunes={itunes} />
        ) : null}
      </section>
      <Readme />
    </div>
  );
}

export default App;
