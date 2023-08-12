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
var parser = new xmldom_1.DOMParser();
/**
 * Preprocesses an XML string to handle possible XML inconsistencies.
 * Wraps content in a root tag if it doesn't start with one.
 *
 * @param {string} xmlString - The XML string to preprocess.
 * @returns {string} The preprocessed XML string.
 */
function preprocessXml(xmlString) {
    // Check if source is a valid XML string
    if (xmlString.trim() === "") {
        throw new Error("Empty XML feed. Please provide valid XML content.");
    }
    var wrappedString = xmlString.startsWith("<") ? xmlString : "<root>".concat(xmlString, "</root>");
    var doc = parser.parseFromString(wrappedString, "text/xml");
    return new xmldom_1.XMLSerializer().serializeToString(doc);
}
/**
 * Retrieves XML content from a given URL using the Fetch API.
 * Supports optional byte range requests.
 *
 * @param {string} url - The URL from which to fetch the XML content.
 * @param {string} [range] - Optional range for byte requests.
 * @param {boolean} [fetchEnd] - If true, fetch from the end of the range.
 * @returns {Promise<string>} Resolves to the XML content as a string.
 * @throws {Error} Throws an error if there's an issue fetching the XML content.
 */
function fetchXmlFromUrl(url, range, fetchEnd) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = {};
                    if (range !== null && range !== undefined && range.trim() !== "") {
                        headers.Range = range;
                    }
                    return [4 /*yield*/, fetch(url, { headers: headers })];
                case 1:
                    response = _a.sent();
                    // Check if partial content is returned
                    if ((range !== null && range !== void 0 ? range : fetchEnd) !== undefined && response.status !== 206) {
                        throw new Error("Server does not support byte range requests.");
                    }
                    return [4 /*yield*/, response.text()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
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
/**
 * Fetches podcast information from iTunes based on the provided podcast ID.
 *
 * @param {number} id - The podcast ID for iTunes search.
 * @returns {Promise<any | undefined>} The search results for the podcast from iTunes or undefined on error.
 */
function itunesLookup(id) {
    return __awaiter(this, void 0, void 0, function () {
        var itunesResponse, itunesData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://itunes.apple.com/lookup?id=".concat(id, "&entity=podcast"))];
                case 1:
                    itunesResponse = _a.sent();
                    return [4 /*yield*/, itunesResponse.json()];
                case 2:
                    itunesData = _a.sent();
                    return [2 /*return*/, itunesData.results[0]];
                case 3:
                    err_1 = _a.sent();
                    throw new Error("Error fetching from iTunes.");
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Retrieves XML content from a given source, which can be a URL, iTunes ID, or an XML string.
 *
 * @param {string | URL | number} source - The source of the XML content, can be a URL object, an iTunes ID, or an XML string.
 * @returns {Promise<{ itunes?: any, xmlString: string }>} Object containing iTunes data (if relevant) and the XML string.
 * @throws {Error} Throws an error if the source type is invalid or if unable to fetch associated feed URL with the given iTunes ID.
 */
function retrieveXmlFromSource(source) {
    return __awaiter(this, void 0, void 0, function () {
        var xmlString, itunes, xmlString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(source instanceof URL)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetchXmlFromUrl(source.toString())];
                case 1:
                    xmlString = _a.sent();
                    return [2 /*return*/, { xmlString: xmlString }];
                case 2:
                    if (!(typeof source === "number")) return [3 /*break*/, 6];
                    return [4 /*yield*/, itunesLookup(source)];
                case 3:
                    itunes = _a.sent();
                    if (!(typeof (itunes === null || itunes === void 0 ? void 0 : itunes.feedUrl) === "string")) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetchXmlFromUrl(itunes.feedUrl)];
                case 4:
                    xmlString = _a.sent();
                    return [2 /*return*/, { itunes: itunes, xmlString: xmlString }];
                case 5: 
                // If iTunes ID is invalid or unable to fetch associated feed URL, throw an error
                throw new Error("Invalid iTunes ID or unable to fetch associated feed URL.");
                case 6:
                    if (typeof source === "string") {
                        // If source is already an XML string, return it directly
                        return [2 /*return*/, { xmlString: source }];
                    }
                    else {
                        // If the source type is none of the above, throw an error
                        throw new Error("Invalid source type. Please provide a valid URL, iTunes ID, or XML string.");
                    }
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Parses a podcast's XML feed and returns structured data about the podcast and its episodes.
 * Supports optional iTunes integration to retrieve additional details.
 *
 * @param {string | URL | number} source - XML content, a URL pointing to the podcast feed, or an iTunes collectionId.
 * @param {Config} [config] - Configuration options for parsing, like pagination or iTunes integration.
 * @returns {Promise<{ podcast: Podcast; episodes: Episode[]; itunes?: any }>} Parsed podcast data.
 * @throws {Error} Throws an error for invalid or empty XML feeds.
 */
function podcastXmlParser(source, config) {
    if (config === void 0) { config = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, itunes, xmlString, preprocessedXml, doc, podcast, episodeElements, _b, start, limit, end, paginatedElements, episodes, itunesResponse, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, retrieveXmlFromSource(source)];
                case 1:
                    _a = _c.sent(), itunes = _a.itunes, xmlString = _a.xmlString;
                    preprocessedXml = preprocessXml(xmlString);
                    doc = parser.parseFromString(preprocessedXml, "text/xml");
                    podcast = createPodcast(doc.documentElement);
                    episodeElements = Array.from(doc.getElementsByTagName("item"));
                    _b = config.start, start = _b === void 0 ? 0 : _b, limit = config.limit;
                    end = start + (typeof limit === "number" && limit > 0 ? limit : episodeElements.length);
                    paginatedElements = episodeElements.slice(start, end);
                    episodes = paginatedElements.map(createEpisode);
                    if (!(config.itunes === true)) return [3 /*break*/, 7];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 6, , 7]);
                    if (!(itunes === null || itunes === undefined)) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetch("https://itunes.apple.com/search?term=".concat(podcast.title, "&entity=podcast"))];
                case 3:
                    itunesResponse = _c.sent();
                    return [4 /*yield*/, itunesResponse.json()];
                case 4:
                    itunes = _c.sent();
                    // Set podcast if the feedUrl is equal on iTunes and in the XML
                    itunes = itunes.results.find(function (result) { return result.feedUrl === podcast.feedUrl; });
                    _c.label = 5;
                case 5: 
                // All done, return data
                return [2 /*return*/, { itunes: itunes, podcast: podcast, episodes: episodes }];
                case 6:
                    err_2 = _c.sent();
                    throw new Error("Error fetching from iTunes.");
                case 7: 
                // All done, return data
                return [2 /*return*/, { podcast: podcast, episodes: episodes }];
            }
        });
    });
}
exports.default = podcastXmlParser;
