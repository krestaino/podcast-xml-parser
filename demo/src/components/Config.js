import React from "react";

export default function Config({ config, setConfig }) {
  return (
    <div className="lg:ml-4 flex flex-col lg:flex-row items-start lg:items-center font-mono">
      <span>config = {"{"}</span>
      <div className="ml-4 lg:ml-2 flex items-center mt-1 lg:mt-0">
        <label className="inline-block hover:cursor-pointer" htmlFor="itunes">
          itunes:
        </label>
        <input
          className="ml-2"
          type="checkbox"
          role="switch"
          value={config.itunes}
          checked={config.itunes}
          id="itunes"
          onChange={() => setConfig({ ...config, itunes: !config.itunes })}
        />
        <span className="ml-2">{","}</span>
      </div>

      <div className="ml-4 lg:ml-2 flex items-center mt-1 lg:mt-0">
        <label className="inline-block hover:cursor-pointer" htmlFor="start">
          start:
        </label>
        <input
          className="bg-neutral-700 p-1 px-2 rounded w-14 ml-2"
          id="start"
          type="number"
          onChange={(event) => setConfig({ ...config, start: Number(event.target.value) })}
          value={config.start}
        />
        <span className="ml-2">{","}</span>
      </div>

      <div className="ml-4 lg:ml-2 flex items-center mt-1 lg:mt-0">
        <label className="inline-block hover:cursor-pointer" htmlFor="limit">
          limit:
        </label>
        <input
          className="bg-neutral-700 p-1 px-2 rounded w-14 ml-2"
          id="limit"
          type="number"
          onChange={(event) => setConfig({ ...config, limit: Number(event.target.value) })}
          value={config.limit}
        />
        <span className="ml-2">{","}</span>
      </div>

      <div className="ml-4 lg:ml-2 flex items-center mt-1 lg:mt-0">
        <label className="inline-block hover:cursor-pointer" htmlFor="requestSize">
          requestSize:
        </label>
        <input
          className="bg-neutral-700 p-1 px-2 rounded w-24 ml-2"
          id="requestSize"
          type="number"
          onChange={(event) => setConfig({ ...config, requestSize: Number(event.target.value) })}
          value={config.requestSize}
        />
      </div>

      <span className="lg:ml-2">{"}"}</span>
    </div>
  );
}
