"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEpisode = exports.createPodcast = void 0;
var sanitize_1 = require("./sanitize");
var xml_1 = require("./xml");
/**
 * Extracts the text content from a specified XML element.
 *
 * @param element - The XML element to extract content from.
 * @param tagName - The name of the tag to retrieve content from.
 * @returns Text content of the tag, or an empty string if not found.
 */
function getText(element, tagName) {
    var _a;
    var node = element === null || element === void 0 ? void 0 : element.getElementsByTagName(tagName)[0];
    return (_a = node === null || node === void 0 ? void 0 : node.textContent) !== null && _a !== void 0 ? _a : "";
}
/**
 * Constructs a Podcast object based on the provided XML item element.
 *
 * @param document - The XML element that represents a podcast.
 * @param source - XML content, a URL pointing to the podcast feed, or an iTunes collectionId.
 * @returns The created Podcast object with parsed values.
 */
function createPodcast(document, source) {
    var _a, _b, _c, _d, _e, _f;
    var documentElement = (0, xml_1.removeItemsFromDocument)(document).documentElement;
    var imageElem = documentElement.getElementsByTagName("image")[0];
    var feedUrl = (_b = (_a = documentElement.getElementsByTagName("atom:link")[0]) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) !== null && _b !== void 0 ? _b : "";
    if (feedUrl === "" && source instanceof URL) {
        feedUrl = source.toString();
    }
    return {
        copyright: getText(documentElement, "copyright"),
        contentEncoded: getText(documentElement, "content:encoded"),
        description: getText(documentElement, "description"),
        feedUrl: feedUrl,
        image: {
            link: getText(imageElem, "link"),
            title: getText(imageElem, "title"),
            url: getText(imageElem, "url"),
        },
        itunesAuthor: getText(documentElement, "itunes:author"),
        itunesCategory: (_d = (_c = documentElement.getElementsByTagName("itunes:category")[0]) === null || _c === void 0 ? void 0 : _c.getAttribute("text")) !== null && _d !== void 0 ? _d : "",
        itunesExplicit: getText(documentElement, "itunes:explicit"),
        itunesImage: (_f = (_e = documentElement.getElementsByTagName("itunes:image")[0]) === null || _e === void 0 ? void 0 : _e.getAttribute("href")) !== null && _f !== void 0 ? _f : "",
        itunesOwner: {
            email: getText(documentElement, "itunes:email"),
            name: getText(documentElement, "itunes:name"),
        },
        itunesSubtitle: getText(documentElement, "itunes:subtitle"),
        itunesSummary: getText(documentElement, "itunes:summary"),
        itunesType: getText(documentElement, "itunes:type"),
        language: getText(documentElement, "language"),
        link: getText(documentElement, "link"),
        title: getText(documentElement, "title"),
    };
}
exports.createPodcast = createPodcast;
/**
 * Constructs an Episode object based on the provided XML item element.
 *
 * @param item - The XML element that represents an episode.
 * @returns The created Episode object with parsed values.
 */
function createEpisode(item) {
    var _a, _b;
    var enclosureElem = item.getElementsByTagName("enclosure")[0];
    return {
        author: getText(item, "author"),
        contentEncoded: getText(item, "content:encoded"),
        description: getText(item, "description"),
        enclosure: {
            url: (_a = enclosureElem === null || enclosureElem === void 0 ? void 0 : enclosureElem.getAttribute("url")) !== null && _a !== void 0 ? _a : "",
            type: (_b = enclosureElem === null || enclosureElem === void 0 ? void 0 : enclosureElem.getAttribute("type")) !== null && _b !== void 0 ? _b : "",
        },
        guid: getText(item, "guid"),
        itunesAuthor: getText(item, "itunes:author"),
        itunesDuration: (0, sanitize_1.getDuration)(getText(item, "itunes:duration")),
        itunesEpisode: getText(item, "itunes:episode"),
        itunesEpisodeType: getText(item, "itunes:episodeType"),
        itunesExplicit: getText(item, "itunes:explicit"),
        itunesSubtitle: getText(item, "itunes:subtitle"),
        itunesSummary: getText(item, "itunes:summary"),
        itunesTitle: getText(item, "itunes:title"),
        link: getText(item, "link"),
        pubDate: getText(item, "pubDate"),
        title: getText(item, "title"),
    };
}
exports.createEpisode = createEpisode;
