'use strict';

(function() {
    (function() {
        function e(a) {
            for (var b = []; a = a.parentNode || a.host || a.defaultView;) b.push(a);
            
            return b;
        }

        function f(a) {
            return function(b) {
                var c = "undefined" !== typeof b.getAttribute ? b.getAttribute("class") || "" : void 0;

                "undefined" !== typeof c && -1 === c.indexOf(a) && b.setAttribute("class", c.concat(" ", a).trim());
            }
        }

        function g(a) {
            return function(b) {
                var c = "undefined" !== typeof b.getAttribute ? b.getAttribute("class") || "" : void 0;

                if (c) {
                    var d = c.indexOf(a);

                    0 <= d && (0 === d || 0 <= h.indexOf(c.charAt(d - 1))) && (c = c.replace(a, "").trim(), "" === c ? b.removeAttribute("class") : b.setAttribute("class", c));
                }
            }
        }

        function k() {
            var a = function(b) {
                function a() {
                    d = !1;

                    "blur" === b.type && Array.prototype.slice.call(e(b.target)).forEach(g("focus-within"));
                    "focus" === b.type && Array.prototype.slice.call(e(b.target)).forEach(f("focus-within"));
                }

                if (!d) {
                    window.requestAnimationFrame(a);

                    var d = !0;
                }
            };

            document.addEventListener("focus", a, !0);
            document.addEventListener("blur", a, !0);

            f("js-focus-within")(document.body);

            return !0;
        }

        var h = ["\n", "\t", " ",
            "\r"
        ];

        try {
            return "undefined" !== typeof window && !document.querySelector(":focus-within");
        } catch (a) {
            return k();
        }
    })();
})();

// # sourceMappingURL=focus-within-polyfill.js.map