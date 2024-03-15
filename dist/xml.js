"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.parse = exports.retrieveXmlFromSource = exports.fetchXmlFromUrl = exports.preprocessXml = exports.removeItemsFromDocument = void 0;
var xmldom_1 = require("xmldom");
var itunes_1 = require("./itunes");
var constants_1 = require("./constants");
var parser = new xmldom_1.DOMParser();
/**
 * Removes all <item> elements from a cloned copy of the provided XML document.
 * This function is useful for processing podcast feeds where you want to
 * separate podcast metadata from individual episode information.
 *
 * @param originalDocument - The original XML document from which to remove <item> elements.
 * @returns A new XML document with all <item> elements removed.
 */
function removeItemsFromDocument(originalDocument) {
    // Clone the original document to avoid modifying it
    var document = originalDocument.cloneNode(true);
    // Convert the live NodeList to a static array
    var items = Array.from(document.getElementsByTagName("item"));
    // Remove each item from the document
    items.forEach(function (item) {
        if (item.parentNode !== null) {
            item.parentNode.removeChild(item);
        }
    });
    return document;
}
exports.removeItemsFromDocument = removeItemsFromDocument;
/**
 * Trims XML feed by cutting off anything after the last complete <item>...</item> tag.
 *
 * @param feed - The XML feed to trim.
 * @returns The trimmed XML feed.
 */
function trimXmlFeed(feed) {
    var lastCompleteItem = feed.lastIndexOf("</item>");
    if (lastCompleteItem !== -1) {
        // Cut off anything after the last complete item
        feed = feed.substring(0, lastCompleteItem + "</item>".length);
    }
    return feed + "</channel></rss>"; // Close the RSS feed to parse data
}
/**
 * Preprocesses an XML string to handle possible XML inconsistencies.
 * Wraps content in a root tag if it doesn't start with one.
 *
 * @param xmlString - The XML string to preprocess.
 * @returns The preprocessed XML string.
 * @throws Throws an error if the XML feed is empty.
 */
function preprocessXml(xmlString, config) {
    var feed = config.requestSize !== null && config.requestSize !== undefined && config.requestSize > 0
        ? xmlString.slice(0, config.requestSize)
        : xmlString;
    feed = trimXmlFeed(feed);
    if (feed.trim() === "" || !feed.trim().startsWith("<")) {
        throw new Error("Invalid or empty XML feed.");
    }
    var wrappedString = feed.startsWith("<") ? feed : "<root>".concat(feed, "</root>");
    var doc = parser.parseFromString(wrappedString, "text/xml");
    return new xmldom_1.XMLSerializer().serializeToString(doc);
}
exports.preprocessXml = preprocessXml;
/**
 * Retrieves XML content from a given URL using the Fetch API.
 * Supports optional byte range requests.
 *
 * @param url - The URL from which to fetch the XML content.
 * @param config - Configuration options for the request, like request size.
 * @returns Resolves to the XML content as a string.
 * @throws Throws an error if there's an issue fetching the XML content.
 */
function fetchXmlFromUrl(url, config) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, response, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    headers = config.requestHeaders != null ? __assign({}, config.requestHeaders) : {};
                    if (headers["User-Agent"] === undefined || headers["User-Agent"] === "") {
                        headers["User-Agent"] = constants_1.USER_AGENT;
                    }
                    if (typeof config.requestSize === "number" && config.requestSize > 0) {
                        headers.Range = "bytes=0-".concat(config.requestSize);
                    }
                    return [4 /*yield*/, fetch(url, { headers: headers })];
                case 1:
                    response = _b.sent();
                    _a = trimXmlFeed;
                    return [4 /*yield*/, response.text()];
                case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                case 3:
                    error_1 = _b.sent();
                    throw new Error("Error fetching from feed: " + url);
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.fetchXmlFromUrl = fetchXmlFromUrl;
/**
 * Retrieves XML content from a given source, which can be a URL, iTunes ID, or an XML string.
 *
 * @param source - The source of the XML content, can be a URL object, an iTunes ID, or an XML string.
 * @param config - Configuration options for the request, like request size.
 * @returns Object containing iTunes data (if relevant) and the XML string.
 * @throws Throws an error if the source type is invalid or if unable to fetch associated feed URL with the given iTunes ID.
 */
function retrieveXmlFromSource(source, config) {
    return __awaiter(this, void 0, void 0, function () {
        var itunes;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(source instanceof URL)) return [3 /*break*/, 2];
                    _a = {};
                    return [4 /*yield*/, fetchXmlFromUrl(source.toString(), config)];
                case 1: 
                // Fetch the XML string from a URL
                return [2 /*return*/, (_a.xmlString = _c.sent(), _a)];
                case 2:
                    if (!(typeof source === "number")) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, itunes_1.itunesLookup)(source)];
                case 3:
                    itunes = _c.sent();
                    if ((itunes === null || itunes === void 0 ? void 0 : itunes.feedUrl) == null || itunes.feedUrl === "") {
                        throw new Error("Invalid iTunes ID or unable to fetch associated feed URL.");
                    }
                    _b = { itunes: itunes };
                    return [4 /*yield*/, fetchXmlFromUrl(itunes.feedUrl, config)];
                case 4: 
                // Fetch the XML string from the iTunes feed URL
                return [2 /*return*/, (_b.xmlString = _c.sent(), _b)];
                case 5: 
                // If source is already an XML string, return it directly
                return [2 /*return*/, { xmlString: source }];
            }
        });
    });
}
exports.retrieveXmlFromSource = retrieveXmlFromSource;
/**
 * Parses the given XML string into a Document object.
 *
 * @param preprocessedXml - The preprocessed XML string to be parsed.
 * @returns The parsed Document object.
 */
function parse(preprocessedXml) {
    return parser.parseFromString(preprocessedXml, "text/xml");
}
exports.parse = parse;
