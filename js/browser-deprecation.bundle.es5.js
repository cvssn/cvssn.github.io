"use strict";

(function() {
    var _window = window;

    function uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === "x" ? r : r & 3 | 8;

            return v.toString(16);
        })
    }

    function sendBI(evid) {
        var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

        var _window$fedops$data = _window.fedops.data,
            site = _window$fedops$data.site,
            rollout = _window$fedops$data.rollout,
            fleetConfig = _window$fedops$data.fleetConfig,
            requestUrl = _window$fedops$data.requestUrl;

        if (requestUrl.includes("suppressbi=true")) {
            return
        }

        var fedOpsAppName = site.appNameForBiEvents;
        var isDACRollout = rollout.isDACRollout, siteAssetsVersionsRollout = rollout.siteAssetsVersionsRollout;
        var is_dac_rollout = isDACRollout ? 1 : 0;
        var is_sav_rollout = siteAssetsVersionsRollout ? 1 : 0;
        var is_rollout = fleetConfig.code === 0 || fleetConfig.code === 1 ? fleetConfig.code : null;
        var pageVisibilty = document.visibilityState;

        var types = {
            WixSite: 1,
            UGC: 2,
            Template: 3
        };

        var siteType = site.siteType;
        var st = types[siteType] || 0;
        var url = "//frog.wix.com/bolt-performance?src=72&evid=" + evid + "&appName=" + fedOpsAppName + "&is_rollout=" + is_rollout + "&is_sav_rollout=" + is_sav_rollout + "&is_dac_rollout=" + is_dac_rollout + "&dc=" + site.dc + "&msid=" + site.metaSiteId + "&session_id=" + site.sessionId + "&vsi=" + uuidv4() + "&pv=" + pageVisibilty + "&v=" + _window.thunderboltVersion + "&url=" + requestUrl + "&st=" + st + extra;

        new Image().src = url;
    }

    function reportPhaseStarted(phase, extra) {
        var evid = 28;
        var ts = Date.now() - _window.initialTimestamps.initialTimestamp;
        var duration = Date.now() - ts;

        sendBI(evid, "&name=".concat(phase, "&duration=").concat(duration).concat(extra ? "&" + extra : ""));
    }

    var version = "v5";
    var _window2 = window;
    var _a, _b, _c;
    var userAgent = ((_c = (_b = (_a = _window2.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.toLowerCase) == null ? void 0 : _c.call(_b)) || "";
    var _a2;
    var isIEbyDocumentMode = !!((_a2 = _window2.document) == null ? void 0 : _a2.documentMode);
    var isIEByUA = !!(userAgent.match(/msie\s([\d.]+)/) || userAgent.match(/trident\/[\d](?=[^\?]+).*rv:([0-9.].)/));
    var isIE = isIEbyDocumentMode || isIEByUA;
    var requiredBrowserNativeApis = ["customElements", "IntersectionObserver", "ResizeObserver"];

    var supportsNativeBrowserApis = function supportsNativeBrowserApis() {
        return requiredBrowserNativeApis.every(function(api) {
            return api in window;
        })
    };

    var isSafari14InStudio = function isSafari14InStudio() {
        var _a3, _b2;

        var isSafari14 = /605\..*version\/14\.(?=.*safari)/i.test(userAgent);
        var isWixStudio = ((_b2 = (_a3 = _window2.viewerModel) == null ? void 0 : _a3.site) == null ? void 0 : _b2.editorName) === "Studio";

        return isSafari14 && isWixStudio;
    };

    var isOldBrowser = !supportsCssVars() || !supportsCssGrid() || !supportsES2017() || !supportsNativeBrowserApis() || isSafari14InStudio();

    if (isIE || isOldBrowser) {
        _window2.__browser_deprecation__ = true;

        hideBody();
        muteSentry();

        if (document.readyState === "complete") {
            runDeprecationFlow();
        } else {
            document.addEventListener("readystatechange", function onReadyStateChange() {
                if (document.readyState === "complete") {
                    runDeprecationFlow();
                }
            })
        }
    }

    function runDeprecationFlow() {
        clearDomFromSSR();
        showDeprecationMessage();
        reportBI();
    }

    function hideBody() {
        var head = document.head || document.getElementsByTagName("head")[0];
        var style = document.createElement("style");

        style.setAttribute("type", "text/css");
        style.appendChild(document.createTextNode("body { visibility: hidden; }"));

        head.appendChild(style);
    }

    function clearDomFromSSR() {
        var siteContainer = document.getElementById("SITE_CONTAINER");

        siteContainer && (siteContainer.innerHTML = "");
    }

    function showDeprecationMessage() {
        var iframe = document.createElement("iframe");
        var iframeUrl = getIframeUrlForOldBrowserMessage();

        iframe.setAttribute("src", iframeUrl);
        iframe.setAttribute("style", "position: fixed; top: 0; left: 0; width: 100%; height: 100%");

        iframe.onload = function() {
            document.body.style.visibility = "visible"
        };

        document.body.appendChild(iframe);
    }

    function getIframeUrlForOldBrowserMessage() {
        var _a3;
        var userLanguage = ((_a3 = _window2.viewerModel) == null ? void 0 : _a3.language.userLanguage) || "en";

        var supportedLanguages = {
            pt: 1,
            fr: 1,
            es: 1,
            de: 1,
            ja: 1
        };

        var messageLanguage = supportedLanguages[userLanguage] ? userLanguage : "en";

        return "https://static.parastorage.com/services/wix-thunderbolt/dist/deprecation-".concat(messageLanguage, ".").concat(version, ".html");
    }

    function reportBI() {
        var supportedFeatures;

        try {
            supportedFeatures = {
                customElements: "customElements" in window,
                IntersectionObserver: "IntersectionObserver" in window,
                ResizeObserver: "ResizeObserver" in window,
                supportsCssVars: supportsCssVars(),
                supportsCssGrid: supportsCssGrid(),
                supportsES2017: supportsES2017(),
                isIE: isIE
            }
        } catch (e) {
            console.error(e);

            supportedFeatures = {}
        }

        reportPhaseStarted("browser_not_supported", "supportedFeatures=".concat(JSON.stringify(supportedFeatures)));
    }

    function muteSentry() {
        _window2.Sentry = {
            mute: true
        }
    }

    function supportsCssVars() {
        var _a3, _b2;

        var styleElement = document.createElement("style");

        styleElement.innerHTML = ":root { --tmp-var: bold; }";

        document.head.appendChild(styleElement);

        var isSupported = !!(_window2.CSS && _window2.CSS.supports && _window2.CSS.supports("font-weight", "var(--tmp-var)"));

        (_b2 = (_a3 = styleElement.parentNode) == null ? void 0 : _a3.removeChild) == null ? void 0 : _b2.call(_a3, styleElement);

        return isSupported;
    }

    function supportsCssGrid() {
        var el = document.createElement("div");

        return typeof el.style.grid === "string";
    }

    function supportsES2017() {
        try {
            new Function("let x = 1");
            new Function("const x = `1`");
            new Function("class X {}");
            new Function("const x = (a = 0, ...b) => a");
            new Function("const x = {...Object}");
            new Function("const y = 1; const x = {y}");
            new Function("const x = (function*() { yield 1; })().next().value === 1");
            new Function("const x = async () => await new Promise(res => res(true))");
            new Function("const objWithTrailingComma = {a: 1, b: 2,}");
            new Function("const arrWithTrailingComma = [1,2,3,]");

            Object.entries({});
            Object.values({});

            "x".padStart(3, "A").padEnd(5, "B");

            Object.getOwnPropertyDescriptor({
                a: 1,
                b: 2
            }, "a");

            Object.fromEntries([
                ["a", 1]
            ]);
        } catch (e) {
            return false;
        }

        return true;
    }
})();