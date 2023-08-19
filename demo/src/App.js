import { useState } from "react";

import Header from "./components/Header";
import Results from "./components/Results";
import Readme from "./components/Readme";
import ActivityIndicator from "./components/ActivityIndicator";

const CONFIG = {
  start: 0,
  limit: 20,
  requestSize: 150000,
  itunes: true,
};

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState(null);
  const [itunes, setItunes] = useState(undefined);
  const [config, setConfig] = useState(CONFIG);

  return (
    <>
      <Header
        config={config}
        setConfig={setConfig}
        setLoading={setLoading}
        setError={setError}
        setPodcast={setPodcast}
        setEpisodes={setEpisodes}
        setItunes={setItunes}
      />
      {loading || error ? (
        <ActivityIndicator error={error} loading={loading} />
      ) : (
        podcast && <Results config={config} podcast={podcast} episodes={episodes} itunes={itunes} />
      )}
      <Readme />
    </>
  );
}

export default App;
