export interface AtomLink {
  "@_rel"?: string;
  "@_href"?: string;
}

export interface Enclosure {
  "@_url"?: string;
  "@_type"?: string;
}

export interface ItunesCategory {
  "@_text"?: string;
  "itunes:category"?: ItunesCategory | ItunesCategory[];
}

export interface EpisodeItem {
  title?: string;
  description?: string;
  pubDate?: string;
  enclosure?: Enclosure;
  "itunes:author"?: string;
  "itunes:duration"?: string;
  "itunes:episode"?: string;
  "itunes:episodeType"?: string;
  "itunes:explicit"?: string;
  "itunes:subtitle"?: string;
  "itunes:summary"?: string;
  "itunes:title"?: string;
  link?: string;
  guid?: string;
  author?: string;
  "content:encoded"?: string;
}

export interface Channel {
  "atom:link"?: AtomLink | AtomLink[];
  title?: string;
  description?: string;
  link?: string;
  language?: string;
  "content:encoded"?: string;
  copyright?: string;
  "itunes:author"?: string;
  "itunes:category"?: ItunesCategory | ItunesCategory[];
  "itunes:explicit"?: string;
  "itunes:image"?: { "@_href"?: string };
  "itunes:owner"?: {
    "itunes:email"?: string;
    "itunes:name"?: string;
  };
  "itunes:subtitle"?: string;
  "itunes:summary"?: string;
  "itunes:type"?: string;
  image?: {
    link?: string;
    title?: string;
    url?: string;
  };
  item?: EpisodeItem[];
}

export interface Rss {
  channel?: Channel;
}

export interface ParsedXML {
  rss?: Rss;
}
