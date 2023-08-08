"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var xmldom_1 = require("xmldom");
/**
 * Preprocesses an XML string to handle entities and unclosed tags.
 *
 * @param xmlString - The XML string to preprocess.
 * @returns The preprocessed XML string.
 */
function preprocessXml(xmlString) {
    // Check if the XML string has a root node
    if (!xmlString.startsWith("<")) {
        // Add a root node to the XML string
        xmlString = "<root>".concat(xmlString, "</root>");
    }
    var parser = new xmldom_1.DOMParser();
    var doc = parser.parseFromString(xmlString, "text/xml");
    // Convert the document back to a string to handle undefined entities gracefully
    return new xmldom_1.XMLSerializer().serializeToString(doc);
}
/**
 * Fetches XML content from a URL using Fetch API.
 *
 * @param {string} url - The URL from which to fetch the XML content.
 * @returns {Promise<string>} A Promise that resolves to the XML content as a string.
 * @throws {Error} If there is an error fetching the XML content from the URL.
 */
function fetchXmlFromUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Retrieves the text content of a specified XML element.
 *
 * @param element - The XML element to retrieve content from.
 * @param tagName - The tag name whose content is to be retrieved.
 * @returns The text content of the specified element's tag or an empty string if not found.
 */
function getText(element, tagName) {
    var node = element === null || element === void 0 ? void 0 : element.getElementsByTagName(tagName)[0];
    return node ? node.textContent || "" : "";
}
/**
 * Helper function to create an `Episode` instance from an XML item element.
 *
 * @param item - The XML element representing an episode.
 * @returns The created `Episode` object.
 */
function createEpisodeFromItem(item) {
    var _a, _b;
    var episode = {
        author: getText(item, "author"),
        contentEncoded: getText(item, "content:encoded"),
        description: getText(item, "description"),
        enclosure: {
            url: ((_a = item.getElementsByTagName("enclosure")[0]) === null || _a === void 0 ? void 0 : _a.getAttribute("url")) || "",
            type: ((_b = item.getElementsByTagName("enclosure")[0]) === null || _b === void 0 ? void 0 : _b.getAttribute("type")) || "",
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
    return episode;
}
/**
 * Parses an XML podcast feed and returns a `Podcast` object.
 *
 * @param xmlSource - The XML string or URL representing the podcast feed.
 *                    If an XML string is provided, it will be directly parsed as the XML content.
 *                    If a URL is provided, the XML content will be fetched from the URL before parsing.
 * @returns The parsed `Podcast` object.
 */
function podcastXmlParser(xmlSource) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var xmlString, preprocessedXml, parser, doc, items, episodes, i, item, episode, podcast;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (typeof xmlSource === "string" && xmlSource.trim() === "") {
                        throw new Error("Empty XML feed. Please provide valid XML content.");
                    }
                    if (!(xmlSource instanceof URL)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchXmlFromUrl(xmlSource.toString())];
                case 1:
                    // If it's a URL, fetch the XML content from the URL
                    xmlString = _d.sent();
                    return [3 /*break*/, 3];
                case 2:
                    // If it's a string, use it directly as the XML content
                    xmlString = xmlSource;
                    _d.label = 3;
                case 3:
                    preprocessedXml = preprocessXml(xmlString);
                    parser = new xmldom_1.DOMParser();
                    doc = parser.parseFromString(preprocessedXml, "text/xml");
                    items = doc.getElementsByTagName("item");
                    episodes = [];
                    for (i = 0; i < items.length; i++) {
                        item = items[i];
                        episode = createEpisodeFromItem(item);
                        episodes.push(episode);
                    }
                    podcast = {
                        copyright: getText(doc.documentElement, "copyright"),
                        contentEncoded: getText(doc.documentElement, "content:encoded"),
                        description: getText(doc.documentElement, "description"),
                        feedUrl: xmlSource instanceof URL ? xmlSource.toString() : ((_a = doc.getElementsByTagName("atom:link")[0]) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) || "",
                        image: {
                            link: getText(doc.getElementsByTagName("image")[0], "link"),
                            title: getText(doc.getElementsByTagName("image")[0], "title"),
                            url: getText(doc.getElementsByTagName("image")[0], "url"),
                        },
                        itunesAuthor: getText(doc.documentElement, "itunes:author"),
                        itunesCategory: ((_b = doc.getElementsByTagName("itunes:category")[0]) === null || _b === void 0 ? void 0 : _b.getAttribute("text")) || "",
                        itunesExplicit: getText(doc.documentElement, "itunes:explicit"),
                        itunesImage: ((_c = doc.getElementsByTagName("itunes:image")[0]) === null || _c === void 0 ? void 0 : _c.getAttribute("href")) || "",
                        itunesOwner: {
                            email: getText(doc.documentElement, "itunes:email"),
                            name: getText(doc.documentElement, "itunes:name"),
                        },
                        itunesSubtitle: getText(doc.documentElement, "itunes:subtitle"),
                        itunesSummary: getText(doc.documentElement, "itunes:summary"),
                        itunesType: getText(doc.documentElement, "itunes:type"),
                        language: getText(doc.documentElement, "language"),
                        link: getText(doc.documentElement, "link"),
                        title: getText(doc.documentElement, "title"),
                    };
                    return [2 /*return*/, { podcast: podcast, episodes: episodes }];
            }
        });
    });
}
exports.default = podcastXmlParser;
