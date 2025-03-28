(() => {
    "use strict";

    const e = "gerenciador de tag: ", t = function() {
        let e = !1;

        try {
            const t = window;

            e = t && t.debug || t.location && (t.location.search || "").toLowerCase().indexOf("debug=") > -1;
        } catch (e) {}

        return e;
    }();

    function n(n) {
        t && console && console.error(`${e} ${n}`);
    }

    function o(e) {
        let t = e;

        try {
            t = JSON.parse(e);
        } catch (e) {
            n("erro de análise na string"), n(e.message);
        }
        
        return t;
    }

    function r(e) {
        return o(JSON.stringify(e));
    }

    function i(e, t) {
        return !(!e || "true" !== e[t]);
    }

    const c = "_api/tag-manager/api/v1/tags/",
        a = `${c}sites/`,
        s = [".wix.com", ".editorx.com"],
        d = "22bef345-3c5b-4c18-b782-74d4085112ff",
        u = !!document.documentMode;

    function l(e, t, n) {
        let o;
        u ? (o = document.createEvent("CustomEvent"), o.initCustomEvent(e, !0, !0, n)) : o = new CustomEvent(e, {
            detail: n
        }), t && t.dispatchEvent && setTimeout((() => {
            t.dispatchEvent(o)
        }), 0)
    }

    const f = "TagManagerLoaded",
        g = "LoadingTags",
        p = "TagLoaded",
        m = "TagLoadError",
        h = "TagManagerConfigSet";

    let y = [];

    const b = [],
        w = [],
        E = [];

    let T, v = [],
        I = {},
        x = !1;

    function A() {
        return E;
    }

    function C() {
        return r(I);
    }

    function N(e) {
        return Object.keys(e).filter((t => !!e[t] && -1 === v.indexOf(t)));
    }

    function P(e) {
        y = e;
    }

    function S() {
        return r(y);
    }

    function O(e) {
        b.push(e);
    }

    function L() {
        return r(b);
    }

    function M(e) {
        w.push(e);
    }

    function $() {
        return r(w);
    }

    function j() {
        T || x || (x = !0);
    }

    function R(e) {
        T || "function" != typeof e || (T = e), x = !1;
    }

    function k() {
        return T;
    }

    function D() {
        if (x)
            return x = !1, d;

        const e = document.currentScript;

        let t = !1;
        let n;

        if (e instanceof HTMLScriptElement && E.forEach((o => {
                !t && o.tag.appInfo && o.embeddedNodes.forEach((r => {
                    var i;

                    t || r === e && (n = (null == (i = o.tag) || null == (i = i.appInfo) ? void 0 : i.id) || "", t = !0);
                }))
        })), !n) {
            const t = function(e) {
                    let t = "script não identificado";

                    if (e instanceof HTMLScriptElement) {
                        const {
                            type: n,
                            src: o
                        } = e;

                        t = `tipo: ${n||"nenhum tipo encontrado"} src: ${o||"nenhum url encontrado"}`;
                    }

                    return t;
                }(e),

                o = `aplicativo não encontrado para script ${t}, id do erro: 404c`;

            console.error(o), n = new Error(o);
        }

        return n;
    }

    function H(e, t, o) {
        const r = () => {
            try {
                if ("function" == typeof e)
                    return e(t);
            } catch (e) {
                n(e);
            }
        };

        return !0 === o ? setTimeout(r, 0) : r();
    }

    function U(e, t, n, o) {
        return () => {
            o(n),
                function(e) {
                    y = y.filter((t => t.name !== e))
                }(n.name), l(e, window, {
                    tagName: t,
                    embed: r(n)
                })
        }
    }

    const B = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    function F(e, t) {
        const n = function() {
                let e = "";

                for (let t = 0; t < 16; t++) e += B.charAt(Math.floor(52 * Math.random()));

                return e;
            }(),

            o = function(e) {
                return `(function(getAccessToken){\n    Object.defineProperty(globalThis, "${e}", {\n      value: getAccessToken,\n      enumerable: false,\n      configurable: true,\n      writable: true,\n    });\n  }(wixEmbedsAPI.getAccessTokenFunction()))`
            }(n),

            r = function(e, t, n) {
                return `import { injectAccessTokenFunction } from "${e}";\n  if(injectAccessTokenFunction){\n    injectAccessTokenFunction(${t}, "${n}");\n  } else {\n    console.error("AppId ${n} does not expose function correctly, error code: Client 404");\n  }`
            }(e, n, t),

            i = () => {
                delete globalThis[id]
            };

        return {
            moduleScriptConfig: {
                node: {
                    tag: "SCRIPT",

                    attributes: {
                        type: "module"
                    },

                    content: r
                },

                callbacks: {
                    onload: function() {
                        i(), this.parentNode.removeChild(this)
                    },

                    onerror: function() {
                        i(), this.parentNode.removeChild(this)
                    }
                }
            },

            helperScriptConfig: {
                tag: "SCRIPT",
                content: o
            }
        }
    }

    function _(e, t, n) {
        let o;

        return e.nodeType === Node.TEXT_NODE ? o = document.createTextNode(e.content) : e.nodeType === Node.COMMENT_NODE ? o = document.createComment(e.content) : (o = document.createElement(e.tag), e && e.attributes instanceof NamedNodeMap ? Array.prototype.forEach.call(e.attributes, (e => {
            q(o, e.name, e.value)
        })) : "object" == typeof e.attributes && Object.keys(e.attributes).forEach((t => {
            void 0 !== typeof e.attributes[t] && q(o, t, e.attributes[t])
        })), "SCRIPT" === e.tag ? o = function(e, t, n, o) {
            void 0 === t && (t = "");
            if (o && "module" === e.getAttribute("type") && "true" === e.getAttribute("accesstoken")) {
                let r = e.src;

                !r && t && (r = J(t)), e = null;

                const {
                    helperScriptConfig: i,
                    moduleScriptConfig: c
                } = F(r, o), a = () => {
                    const e = _(c.node, c.callbacks, o);
                    document.head.appendChild(e)
                };

                return _(i, {
                    onload: a,
                    onerror: null == n ? void 0 : n.onerror
                }, o)
            }! function(e, t, n) {
                void 0 === t && (t = "");

                const o = t && !!t.trim();

                o && (e.src = J(t));

                e.addEventListener("load", (function() {
                    H(n && n.onload, null)
                }), !1), e.addEventListener("error", (function() {
                    H(n && n.onerror, null)
                }), !1)
            }(e, t, n);
            
            return e;
        }(o, e.content, t, n) : e.children && e.children.length > 0 && e.children.forEach((e => {
            const r = _(e, t, n);

            o.appendChild(r);
        }))), o
    }

    function q(e, t, n) {
        e.setAttribute(t, n);
    }

    function J(e) {
        const t = new Blob([e], {
            type: "text/javascript;charset=utf-8"
        });

        return URL.createObjectURL(t);
    }

    function Y(e) {
        const t = [],
            n = document.createElement("DIV");

        return n.innerHTML = e, Array.prototype.forEach.call(n.childNodes, (e => {
            const n = z(e);

            t.push(n);
        })), t
    }

    function z(e) {
        const t = e.nodeType,
            n = e.innerHTML || e.textContent || e.nodeValue,
            o = [];

        return e.hasChildNodes() && Array.prototype.forEach.call(e.childNodes, (e => {
            o.push(z(e))
        })), {
            nodeType: t,
            tag: e.nodeName,
            attributes: e.attributes,
            content: n,
            children: o
        }
    }

    let V = function(e) {
        return e.HEAD = "head", e.BODY_START = "bodyStart", e.BODY_END = "bodyEnd", e
    }({});

    function W(e, t, n) {
        const o = e.filter((e => !e.embeddedNodes)),
            r = i(n, "specs.tagManagerRenderTagByPageID") ? function(e, t) {
                return e.filter((e => function(e, t) {
                    return !(t.id && (n = e, null != (o = n.tag) && null != (o = o.pages) && o.length)) || ((e, t) => {
                        var n;

                        return (null == (n = e.tag) || null == (n = n.pages) ? void 0 : n.includes(t.id || "")) || !1;
                    })(e, t);

                    var n, o;
                }(e, t)))
            }(o, t) : o,

            c = r.map((e => e.tag));
        P(c), l(g, window, c), r.forEach((e => {
            var t;

            const n = null == (t = e.tag.appInfo) ? void 0 : t.id;

            e.embeddedNodes = e.embeddedNodes || [];

            const o = e.tag,
                r = Y(o.content),
                i = o.position && o.position.toLowerCase() !== V.HEAD ? document.body : document.head;

            ! function(e, t, n, o, r, i) {
                let c = 0;

                const a = () => {
                        c -= 1, c >= 0 && H(t.onload, {})
                    },
                    s = () => {
                        c -= 1, c >= 0 && H(t.onerror, {
                            error: !0
                        })
                    },
                    d = n.firstChild;
                e.forEach((e => {
                    "SCRIPT" === e.tag && (c += 1);
                    const t = _(e, {
                        onload: a,
                        onerror: s
                    }, i);
                    r.push(t), o ? n.insertBefore(t, d) : n.appendChild(t)
                })), 0 === c && H(t.onload, {}, !0)
            }(r, {
                onload: U(p, o.name, o, O),
                onerror: U(m, o.name, o, M)
            }, i, o.position === V.BODY_START, e.embeddedNodes, n)
        }))
    }

    function X(e, t, n, o) {
        const r = o && o.headers || {},
            i = o && o.query || {};

        r["content-type"] = r["content-type"] || "application/json";

        const c = new XMLHttpRequest,
            a = o && o.postBody ? "POST" : "GET",
            s = `${e}${function(e){let t="";"object"==typeof e&&Object.keys(e).forEach((n=>{if(void 0!==e[n]){const o=encodeURIComponent(e[n]);t+=`${encodeURIComponent(n)}=${o}&`}}));return t=t?t.substr(0,t.length-1):"",t?` ? $ {
                t
            }
        `:""}(i)}`;

        c.open(a, s, !0), c.onreadystatechange = () => {
            if (4 === c.readyState) {
                const e = c.status;

                e < 200 || e >= 300 ? H(n, {
                    status: e,
                    responseText: c.responseText
                }) : H(t, c.responseText)
            }
        }, Object.keys(r).forEach((e => {
            void 0 !== r[e] && c.setRequestHeader(e, r[e])
        })), c.send(o && o.postBody || null)
    }

    function G(e, t) {
        void 0 === t && (t = location.search);

        let n = t.split(`${e}=`)[1];

        return n = n ? decodeURIComponent(n.split("&")[0]) : void 0, n;
    }

    function K(e, t) {
        const c = o(e),
            {
                currentPageID: a,
                initConsentPolicyManager: s = !1
            } = t;
        if (c.errors && c.errors.length > 0 && n(JSON.stringify(c.errors)), c.config) {
            const e = window.consentPolicyManager;

            (u = c.config.consentPolicy) && "object" == typeof u && (v = [...v, ...N(u)]), s && e && e.init({
                consentPolicy: c.config.consentPolicy
            }), "object" != typeof(d = c.config) || Array.isArray(d) || (I = {
                ...I,
                ...d
            }, l(h, window, r(I)))
        }

        var d, u, f, g;

        if (c.tags) {
            f = c.tags, i(null == (g = I) ? void 0 : g.experiments, "specs.tagManager.ReadLoadOnceFromTag") ? f.forEach((e => {
                var t;

                const n = e.loadOnce || (null == (t = e.content) ? void 0 : t.includes('load-once="true"'));

                E.push({
                    tag: {
                        ...e,
                        loadOnce: n
                    },

                    embeddedNodes: null
                })
            })) : f.forEach((e => {
                E.push({
                    tag: e,
                    embeddedNodes: null
                })
            }));

            const e = {
                id: a
            };

            W(A(), e, c.config.experiments || {});
        }
    }

    function Q(e, t, n) {
        return `${e&&!function(e){let t=!1;return s.forEach((e=>{t||(t=location.hostname.indexOf(e)>0)})),t||e}(!!n)?e:""}/${a}${t}`;
    }

    async function Z(e) {
        const {
            metasiteId: t,
            htmlsiteId: o,
            baseUrl: r,
            wixSite: i,
            language: c,
            categories: a
        } = e, s = G("site-override"), u = G("apps-override"), l = Q(r, t, i), f = window.consentPolicyManager, g = !i && f ? f._getConsentPolicyHeader() : {}, p = function(e) {
            const t = e.wixEmbedsAPI,
                n = t && t.getCurrentPageInfo;

            return "function" == typeof n ? n() : {}
        }(window), m = G("omit"), h = await async function() {
            let e;

            const t = k();

            if ("function" == typeof t) try {
                e = await t()
            } catch (e) {}

            e || (e = H(window.wixEmbedsAPI.getAppToken, d));

            return e;
        }();

        h && (g.authorization = h), X(l, (e => {
            K(e, {
                initConsentPolicyManager: !a && !!i,
                currentPageID: p.id
            })
        }), (e => {
            n(`erro ao carregar tags do site em ${l}`), n(e.message)
        }), {
            query: {
                wixSite: !!i,
                htmlsiteId: o,
                language: c,
                categories: a,
                omit: m,
                partytown: "partytown" in window,
                siteOverrideId: s,
                appsOverrideId: u
            },

            headers: g
        })
    }

    function ee(e) {
        A().forEach((e => {
            e.tag.loadOnce || (e.embeddedNodes && e.embeddedNodes.forEach((e => {
                H((() => {
                    e.parentNode.removeChild(e)
                }))
            })), e.embeddedNodes = null)
        }));

        W(A(), e, C().experiments || {})
    }

    function te(e) {
        if (e && e.detail && e.detail.policy) {
            const t = N(e.detail.policy);

            t.length && Z({
                baseUrl: window.wixEmbedsAPI.getExternalBaseUrl(),
                htmlsiteId: window.wixEmbedsAPI.getHtmlSiteId(),
                metasiteId: window.wixEmbedsAPI.getMetaSiteId(),
                wixSite: window.wixEmbedsAPI.isWixSite(),
                language: window.wixEmbedsAPI.getLanguage(),
                categories: t
            })
        }
    }! function() {
        const e = window;

        function t() {
            const t = e.wixEmbedsAPI;

            ! function() {
                const t = Object.freeze({
                    getLoadedTags: L,
                    getLoadingTags: S,
                    getLoadErrorTags: $,
                    getConfig: C,
                    getAppId: D
                });

                Object.defineProperty(e, "wixTagManager", {
                    value: t,
                    writable: !1,
                    configurable: !1,
                    enumerable: !0
                }), l(f, window, window.wixTagManager)
            }(),

            function(e) {
                if ("function" == typeof e.getAccessTokenFunction) {
                    j();
                    R(e.getAccessTokenFunction())
                }
            }(t), Z({
                baseUrl: t.getExternalBaseUrl(),
                htmlsiteId: t.getHtmlSiteId(),
                metasiteId: t.getMetaSiteId(),
                language: t.getLanguage(),
                wixSite: t.isWixSite()
            }), t.registerToEvent("pageNavigation", ee), document.addEventListener("consentPolicyChanged", te)
        }! function() {
            const n = e.wixEmbedsAPI;

            n && "function" == typeof n.registerToEvent ? t() : e.addEventListener("wixEmbedsAPIReady", t, !1)
        }()
    }()
})();

// # sourcemappingurl = sitetags.bundle.min.js.map