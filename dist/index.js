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
var xml_1 = require("./xml");
var create_1 = require("./create");
/**
 * Parses a podcast's XML feed and returns structured data about the podcast and its episodes.
 * Supports optional iTunes integration to retrieve additional details.
 *
 * @param source - XML content, a URL pointing to the podcast feed, or an iTunes collectionId.
 * @param config - Configuration options for parsing, like pagination or iTunes integration.
 * @returns Parsed podcast data.
 * @throws Throws an error for invalid or empty XML feeds.
 */
function podcastXmlParser(source, config) {
    if (config === void 0) { config = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, itunes, xmlString, preprocessedXml, document, podcast, episodeElements, _b, start, limit, end, paginatedElements, episodes, itunesResponse;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, xml_1.retrieveXmlFromSource)(source, config)];
                case 1:
                    _a = _c.sent(), itunes = _a.itunes, xmlString = _a.xmlString;
                    preprocessedXml = (0, xml_1.preprocessXml)(xmlString, config);
                    document = (0, xml_1.parse)(preprocessedXml);
                    podcast = (0, create_1.createPodcast)(document, source);
                    episodeElements = Array.from(document.getElementsByTagName("item"));
                    _b = config.start, start = _b === void 0 ? 0 : _b, limit = config.limit;
                    start = typeof start === "number" && start > 0 ? start : 0;
                    end = start + (typeof limit === "number" && limit > 0 ? limit : episodeElements.length);
                    paginatedElements = episodeElements.slice(start, end);
                    episodes = paginatedElements.map(create_1.createEpisode);
                    if (!(config.itunes === true || itunes !== undefined)) return [3 /*break*/, 5];
                    if (!(itunes === undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, fetch("https://itunes.apple.com/search?term=".concat(podcast.title, "&entity=podcast"))];
                case 2:
                    itunesResponse = _c.sent();
                    return [4 /*yield*/, itunesResponse.json()];
                case 3:
                    itunes = _c.sent();
                    // Set podcast if the feedUrl is equal on iTunes and in the XML
                    itunes = itunes.results.find(function (result) { return result.feedUrl === podcast.feedUrl; });
                    _c.label = 4;
                case 4: 
                // All done, return data
                return [2 /*return*/, { itunes: itunes, podcast: podcast, episodes: episodes }];
                case 5: 
                // All done, return data
                return [2 /*return*/, { podcast: podcast, episodes: episodes }];
            }
        });
    });
}
exports.default = podcastXmlParser;
module.exports = podcastXmlParser;
module.exports.default = podcastXmlParser;
