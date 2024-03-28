import { Config } from "../types";

/**
 * Fixes an incomplete XML feed by ensuring it ends with a complete <item> tag
 * and closes with </channel></rss> tags. If no incomplete <item> tags are found,
 * the original XML data is returned unmodified.
 * @param xmlData - The XML data that may be incomplete.
 * @returns The fixed XML data with properly closed tags.
 */
function fixIncompleteFeed(xmlData: string): string {
  // Length of the </item> tag
  const itemTagLength = 7;

  // Find the last complete <item> tag
  const lastItemIndex = xmlData.lastIndexOf("</item>");

  // If no <item> tag is found, return the original data
  if (lastItemIndex === -1) {
    return xmlData;
  }

  // Cut off everything after the last complete <item> tag
  const fixedData = xmlData.substring(0, lastItemIndex + itemTagLength);

  // Close the feed with </channel></rss>
  return `${fixedData}</channel></rss>`;
}

/**
 * Fetches the podcast content from the provided URL.
 * @param url - The URL of the podcast.
 * @param config - Optional configuration object for the fetch request.
 *   - requestHeaders: Headers to include in the fetch request.
 *   - requestSize: The maximum size of the response in bytes. If specified,
 *     the response is truncated to this size and any incomplete XML is fixed.
 * @returns A promise that resolves to the text content of the podcast response.
 */
export async function fetchPodcast(url: URL, config?: Config): Promise<string> {
  const headers = new Headers(config?.requestHeaders);

  if (config?.requestSize) {
    headers.set("Range", `bytes=0-${config.requestSize}`);
  }

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  let text = await response.text();

  if (config?.requestSize) {
    text = fixIncompleteFeed(text);
  }

  return text;
}
