import React from "react";

export default function ActivityIndicator({ loading, error }) {
  return (
    <pre className={loading ? "bg-blue-400" : "bg-red-400"}>
      <div className="max-w-5xl mx-auto text-neutral-900 p-4">{loading ? "Loading..." : error.message}</div>
    </pre>
  );
}
