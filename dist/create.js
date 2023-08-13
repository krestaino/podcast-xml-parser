"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEpisode = exports.createPodcast = void 0;
/**
 * Extracts the text content from a specified XML element.
 *
 * @param {Element} element - The XML element to extract content from.
 * @param {string} tagName - The name of the tag to retrieve content from.
 * @returns {string} Text content of the tag, or an empty string if not found.
 */
function getText(element, tagName) {
    var _a;
    var node = element === null || element === void 0 ? void 0 : element.getElementsByTagName(tagName)[0];
    return (_a = node === null || node === void 0 ? void 0 : node.textContent) !== null && _a !== void 0 ? _a : "";
}
/**
 * Constructs a Podcast object based on the provided XML item element.
 *
 * @param {Element} document - The XML element that represents a podcast.
 * @returns {Podcast} The created Podcast object with parsed values.
 */
function createPodcast(document) {
    var _a, _b, _c, _d, _e, _f;
    var imageElem = document.getElementsByTagName("image")[0];
    return {
        copyright: getText(document, "copyright"),
        contentEncoded: getText(document, "content:encoded"),
        description: getText(document, "description"),
        feedUrl: (_b = (_a = document.getElementsByTagName("atom:link")[0]) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) !== null && _b !== void 0 ? _b : "",
        image: {
            link: getText(imageElem, "link"),
            title: getText(imageElem, "title"),
            url: getText(imageElem, "url"),
        },
        itunesAuthor: getText(document, "itunes:author"),
        itunesCategory: (_d = (_c = document.getElementsByTagName("itunes:category")[0]) === null || _c === void 0 ? void 0 : _c.getAttribute("text")) !== null && _d !== void 0 ? _d : "",
        itunesExplicit: getText(document, "itunes:explicit"),
        itunesImage: (_f = (_e = document.getElementsByTagName("itunes:image")[0]) === null || _e === void 0 ? void 0 : _e.getAttribute("href")) !== null && _f !== void 0 ? _f : "",
        itunesOwner: {
            email: getText(document, "itunes:email"),
            name: getText(document, "itunes:name"),
        },
        itunesSubtitle: getText(document, "itunes:subtitle"),
        itunesSummary: getText(document, "itunes:summary"),
        itunesType: getText(document, "itunes:type"),
        language: getText(document, "language"),
        link: getText(document, "link"),
        title: getText(document, "title"),
    };
}
exports.createPodcast = createPodcast;
/**
 * Constructs an Episode object based on the provided XML item element.
 *
 * @param {Element} item - The XML element that represents an episode.
 * @returns {Episode} The created Episode object with parsed values.
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
        itunesDuration: getText(item, "itunes:duration"),
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
