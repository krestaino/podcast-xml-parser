import React from "react";

export default function Results({ config, podcast, episodes, itunes }) {
  return (
    <section className="font-mono max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold">Podcast ({podcast.title})</h2>
      <table className="mt-4 w-full bg-neutral-800 block overflow-scroll h-[35vh]">
        <thead className="bg-neutral-700 text-left">
          <tr>
            <th className="border border-neutral-600 p-2 font-bold">key</th>
            <th className="border border-neutral-600 p-2 font-bold">value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(podcast).map((key) => (
            <tr className="align-top" key={key}>
              <td className="border border-neutral-600 p-2">{key}</td>
              <td className="border border-neutral-600 p-2">{JSON.stringify(podcast[key])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-8">
        <h2 className="text-2xl font-bold">Episodes ({episodes.length})</h2>
        <div className="overflow-scroll h-[35vh]">
          {episodes.map((episode, episodeIdx) => (
            <table className="mt-4 w-full bg-neutral-800 block" key={episodeIdx}>
              <thead className="bg-neutral-700 text-left">
                <tr>
                  <th className="border border-neutral-600 p-2 font-bold">key</th>
                  <th className="border border-neutral-600 p-2 font-bold">value</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(episode).map((key) => (
                  <tr className="align-top" key={key}>
                    <td className="border border-neutral-600 p-2">{key}</td>
                    <td className="border border-neutral-600 p-2">{JSON.stringify(episode[key])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>

      {itunes !== null && itunes !== undefined && config.itunes && (
        <div className="my-8">
          <h2 className="text-2xl font-bold">iTunes</h2>
          <table className="mt-4 w-full bg-neutral-800 block overflow-scroll h-[35vh]">
            <thead className="bg-neutral-700 text-left">
              <tr>
                <th className="border border-neutral-600 p-2 font-bold">key</th>
                <th className="border border-neutral-600 p-2 font-bold">value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(itunes).map((key) => (
                <tr className="align-top" key={key}>
                  <td className="border border-neutral-600 p-2">{key}</td>
                  <td className="border border-neutral-600 p-2">{JSON.stringify(itunes[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
