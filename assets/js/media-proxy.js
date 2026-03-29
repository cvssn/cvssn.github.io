/**
 * media-proxy.js — cvssn
 * 
 * - proxy responsivo via `images.weserv.nl` para imagens (src/srcset/data-src)
 * - lazy-load robusto de vídeos (exemplo: attachments.are.na) sem limitar os formatos
 * - prioriza fontes reproduzíveis por navegador (canplaytype) e não rompe se não servir
 * - acesso ao original: alt/ctrl/cmd + click ou long-press (~550ms)
 * - suporta nodes adicionados dinamicamente e alterações de atributos
 * - opt-out por elemento com data-no-proxy
 */
(() => {
    // ----- config -----
    const IMG_HOST_MATCH = /(?:cloudfront\.net|attachments\.are\.na)/i; // imagens e vídeos veiculados por esses hosts
    const IMG_SEL = 'img, source[type^="image/"]';
    const WESERV = 'https://images.weserv.nl/?url=';
    
    const WCFG = '&q=70&we';               // q = qualidade, we = auto webp/avif caso suportado
    const WIDTHS = [480, 960, 1600, 2200]; // breakpoints para srcset
    
    const IO_MARGIN_IMG = '600px 0px';
    const IO_MARGIN_VID = '300px 0px';
    
    const LONGPRESS_MS = 550;

    // ----- utilidades comuns -----
    const fixUrl = u => typeof u === 'string'
        ? u.replace(/\?(\d+)\?bc=0$/, '?$1&bc=0')
        : u;

    const isHttp = u => /^https?:\/\//i.test(u || '');
    const isProxied = u => /^https?:\/\/images\.weserv\.nl\/\?url=/i.test(u || '');

    function proxify(url, w) {
        if (!isHttp(url))
            return null;

        const clean = url.replace(/^https?:\/\//, '');

        return `${WESERV}${encodeURIComponent(clean)}${w ? `&w=${w}` : ''}${WCFG}`;
    }

    function getOriginalFrom(el) {
        // prioridade: data-full -> data-src -> src/srcset
        const df = el.getAttribute('data-full');

        if (df)
            return df;

        const ds = el.getAttribute('data-src');

        if (ds)
            return ds;

        if (el.tagName === 'SOURCE') {
            const ss = el.getAttribute('srcset') || '';
            const s = el.getAttribute('src') || '';

            const first = ss.split(',')[0]?.trim().split(' ')[0];

            return (first && isHttp(first)) ? first : (isHttp(s) ? s : null);
        }

        const s1 = el.getAttribute('src');
        const ss1 = el.getAttribute('srcset') || '';

        if (isHttp(s1))
            return s1;

        const f1 = ss1.split(',')[0]?.trim().split(' ')[0];

        return (f1 && isHttp(f1)) ? f1 : null;
    }

    function enableOpenOriginal(el) {
        // guarda original (caso encontrado) para consultas rápidas
        const orig = getOriginalFrom(el);

        if (orig && !el.getAttribute('data-full'))
            el.setAttribute('data-full', orig);

        // modificadores de desktop
        el.addEventListener('click', (e) => {
            const mod = e.altKey || e.ctrlKey || e.metaKey;

            if (!mod)
                return;

            const href = el.getAttribute('data-full') || getOriginalFrom(el);

            if (!href)
                return;

            e.preventDefault();

            window.open(href, '_blank', 'noopener,noreferrer');
        });

        // long-press em touch
        let timer = null, 
            moved = false;

        const onStart = () => {
            moved = false;

            clearTimeout(timer);

            timer = setTimeout(() => {
                if (moved)
                    return;
                
                const href = el.getAttribute('data-full') || getOriginalFrom(el);

                if (href)
                    window.open(href, '_blank', 'noopener,noreferrer');
            }, LONGPRESS_MS);
        };

        const onMove = () => { moved = true; };
        const onEnd = () => { clearTimeout(timer); };

        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('touchmove', onMove, { passive: true });
        el.addEventListener('touchend', onEnd, { passive: true });
        el.addEventListener('touchcancel', onEnd, { passive: true });
    }

    // ----- imagens -----
    function tuneImgElement(imgLike) {
        // imglike: <img> ou <source[type=image/*]>
        if (!(imgLike instanceof Element))
            return;
        
        if (imgLike.dataset.noProxy != null) { enableOpenOriginal(imgLike); return; }
        if (imgLike.dataset.proxied === '1') { enableOpenOriginal(imgLike); return; }

        const tag = imgLike.tagName;

        let orig = null;

        // caso seja <source> de imagem dentro de <picture>
        if (tag === 'SOURCE' && /^image\//i.test(imgLike.getAttribute('type') || '')) {
            let candidate = imgLike.getAttribute('srcset') || imgLike.getAttribute('data-srcset') || '';

            const first = candidate.split(',')[0]?.trim().split(' ')[0] || '';

            orig = first || imgLike.getAttribute('src') || imgLike.getAttribute('data-src') || null;
        } else {
            // <img>
            orig = imgLike.getAttribute('data-src') || imgLike.getAttribute('src') || null;

            // se o arquivo já vier com srcset/data-srcset configurado pelo autor, não alterar (apenas habilitar o original)
            if (imgLike.hasAttribute('srcset') || imgLike.hasAttribute('data-srcset')) {
                const first = (imgLike.getAttribute('srcset') || imgLike.getAttribute('data-srcset') || '')
                    .split(',')[0]?.trim().split(' ')[0];

                if (first && isHttp(first))
                    imgLike.setAttribute('data-full', first);

                enableOpenOriginal(imgLike);

                imgLike.dataset.proxied = '1';

                return;
            }
        }

        orig = fixUrl(orig);

        // apenas proxificar caso a url aponta para nossos servidores e não estiver já pelo weserv
        if (!orig || !IMG_HOST_MATCH.test(orig) || isProxied(orig)) {
            enableOpenOriginal(imgLike);

            imgLike.dataset.proxied = '1';

            return;
        }

        // guarda original
        imgLike.setAttribute('data-full', orig);

        // constrói o srcset responsivo
        const srcset = WIDTHS
            .map(w => `${proxify(orig, w)} ${w}w`)
            .join(', ');

        // se aplica dependendo do tipo de elemento e se ele usa data-src (lazy) ou src direto
        if (tag === 'SOURCE') {
            imgLike.setAttribute('srcset', srcset);
            imgLike.removeAttribute('data-src');
        } else {
            imgLike.referrerPolicy = 'no-referrer';
            imgLike.decoding = 'async';
            imgLike.loading = 'lazy';

            if (imgLike.hasAttribute('data-src') && !imgLike.getAttribute('src')) {
                imgLike.setAttribute('data-src', proxify(orig, 960));
                imgLike.setAttribute('data-srcset', srcset);
            } else {
                imgLike.setAttribute('src', proxify(orig, 960));
                imgLike.setAttribute('srcset', srcset);
            }

            imgLike.setAttribute('sizes', '(max-width:600px) 480px, (max-width:1200px) 960px, (max-width:1800px) 1600px, 2200px');
        }

        enableOpenOriginal(imgLike);

        imgLike.dataset.proxied = '1';
    }

    function tunePicture(pic) {
        pic.querySelectorAll('source[type^="image/"]').forEach(tuneImgElement);

        const img = pic.querySelector('img');

        if (img)
            tuneImgElement(img);
    }

    // lazy próprio para imagens com data-src (caso o site não forneça um)
    function ensureImageLazyIO() {
        const targets = Array.from(document.querySelectorAll('img[data-src]'))
            .filter(el => !el.__x_lazy_img);

        if (!targets.length)
            return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (!en.isIntersecting)
                    return;

                const el = en.target;

                const ds = el.getAttribute('data-src');
                const dss = el.getAttribute('data-srcset');

                if (ds && !el.getAttribute('src'))
                    el.setAttribute('src', ds);

                if (dss && !el.getAttribute('srcset'))
                    el.setAttribute('srcset', dss);

                io.unobserve(el);
            });
        }, {
            rootMargin: IO_MARGIN_IMG,
            threshold: 0
        });

        targets.forEach(el => {
            el.__x_lazy_img = 1;
            
            io.observe(el);
        });
    }

    // ----- vídeos (suporte universal no cliente sem transcodificação) -----

    // mapa mínimo para reduzir mime caso falte type=""
    const TYPE_MAP = {
        mp4:'video/mp4', m4v:'video/mp4', mov:'video/quicktime',
        webm:'video/webm', mkv:'video/x-matroska',
        ogv:'video/ogg', mpeg:'video/mpeg', mpg:'video/mpeg',
        ts:'video/mp2t', m2ts:'video/mp2t',
        m3u8:'application/vnd.apple.mpegurl'
    };

    function mimeFrom(u) {
        try{
            const ext = (new URL(u, location.href).pathname.split('.').pop()||'').toLowerCase();

            return TYPE_MAP[ext] || '';
        } catch {
            return '';
        }
    }

    function playable(videoEl, mime) {
        if (!mime)
            return false;
        
        const r = videoEl.canPlayType(mime);
        
        return r === 'probably' || r === 'maybe';
    }
    
    function prepareVideo(v) {
        if (!(v instanceof HTMLVideoElement) || v.dataset.videoReady === '1')
            return;

        const hasOwnLazy = v.classList.contains('lazy-video');

        let sources = Array.from(v.querySelectorAll('source'));

        // guardar original para "abrir original"
        const firstUrl =
            sources[0]?.getAttribute('src') ||
            sources[0]?.getAttribute('data-src') ||

            v.getAttribute('src') ||
            v.getAttribute('data-src') || '';

        if (firstUrl)
            v.setAttribute('data-full', fixUrl(firstUrl));

        enableOpenOriginal(v);

        // caso não haja <source> e caso haja video[src], normalizar <source>
        if (!sources.length && (v.getAttribute('src') || v.getAttribute('data-src'))){
            const s = document.createElement('source');
            
            const url = v.getAttribute('src') || v.getAttribute('data-src');
            
            s.setAttribute('src', url);
            
            const t = v.getAttribute('type') || mimeFrom(url);
            
            if (t)
                s.setAttribute('type', t);
            
            v.appendChild(s);
            
            sources = [s];
        }

        // decidir se aplicará lazy próprio: meios de nossos hosts e sem lazy do site
        const isArena = IMG_HOST_MATCH.test(firstUrl || '');

        // mover todas as fontes de data-src para lazy
        if (!hasOwnLazy && isArena) {
            sources.forEach(s => {
                if (!s.getAttribute('data-src')) {
                    const src = s.getAttribute('src');
                    
                    if (src) {
                        s.setAttribute('data-src', src);
                        
                        s.removeAttribute('src');
                    }
                }

                if (!s.getAttribute('type')) {
                    const t = mimeFrom(s.getAttribute('data-src')||'');

                    if (t)
                        s.setAttribute('type', t);
                }
            });

            if (v.getAttribute('src') && !v.getAttribute('data-src')) {
                v.setAttribute('data-src', v.getAttribute('src'));
                v.removeAttribute('src');
                
                if (!v.getAttribute('type')) {
                    const t = mimeFrom(v.getAttribute('data-src'));
                
                    if (t)
                        v.setAttribute('type', t);
                }
            }
        }

        // io: restaura todas as fontes e prioriza uma reproduzível
        const vio = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (!en.isIntersecting)
                    return;
                
                const vid = en.target;

                // restaura todas as fontes <source>
                const ss = Array.from(vid.querySelectorAll('source'));

                ss.forEach(s => {
                    if (!s.getAttribute('src') && s.getAttribute('data-src')) {
                        s.setAttribute('src', s.getAttribute('data-src'));
                    }

                    if (!s.getAttribute('type')) {
                        const t = mimeFrom(s.getAttribute('src') || '');
                        
                        if (t)
                            s.setAttribute('type', t);
                    }
                });

                // restaura video[src] caso estava em data-src
                if (!vid.getAttribute('src') && vid.getAttribute('data-src')) {
                    vid.setAttribute('src', vid.getAttribute('data-src'));
                }

                // 1) preferir hls/mp4 caso o cliente pode reproduzir
                const preferred = ss.find(s => {
                    const t = (s.getAttribute('type') || '').toLowerCase();

                    return t.includes('application/vnd.apple.mpegurl') || t.includes('video/mp4') || t.includes('avc1');
                });

                if (preferred)
                    vid.prepend(preferred);

                // 2) se o primeiro segue sem ser reproduzível, escolher por canplaytype
                let first = vid.querySelector('source');

                if (!playable(vid, first?.getAttribute('type') || '')) {
                    const ok = ss.find(s => playable(vid, s.getAttribute('type') || ''));
                    
                    if (ok && ok !== first)
                        vid.prepend(ok);
                }

                // carregar e reproduzir (caso aplicável)
                vid.load();

                const p = vid.play();
                
                if (p && p.catch)
                    p.catch(() => {});

                vio.unobserve(vid);
            });
        }, {
            rootMargin: IO_MARGIN_VID,
            threshold: 0.2
        });

        if (!hasOwnLazy && isArena)
            vio.observe(v);

        // autoplay/pause por visibilidade
        const apo = new IntersectionObserver(es => {
            es.forEach(en => {
                if (en.isIntersecting) {
                    const p = v.play(); if (p && p.catch) p.catch(()=>{});
                } else {
                    v.pause();
                }
            });
        }, {
            threshold: 0.25
        });
        
        apo.observe(v);

        v.dataset.videoReady = '1';
    }

    function tuneVideosIn(root = document) {
        root.querySelectorAll('video').forEach(prepareVideo);
    }

    // ----- observadores globais -----
    function observeNewNodes() {
        const mo = new MutationObserver((ml) => {
            for (const m of ml) {
                if (m.type === 'childList') {
                    m.addedNodes.forEach(node => {
                        if (node.nodeType !== 1)
                            return;

                        // <picture>
                        if (node.tagName === 'PICTURE') tunePicture(node);
                        node.querySelectorAll?.('picture').forEach(tunePicture);

                        // <img>/<source image>
                        if (node.matches?.(IMG_SEL)) processImgOrSource(node);
                        node.querySelectorAll?.(IMG_SEL).forEach(processImgOrSource);

                        // vídeos
                        if (node.matches?.('video')) prepareVideo(node);
                        node.querySelectorAll?.('video').forEach(prepareVideo);
                    });
                } else if (m.type === 'attributes') {
                    const el = m.target;

                    if (el.matches(IMG_SEL)) processImgOrSource(el);
                    if (el.tagName === 'VIDEO') prepareVideo(el);
                }
            }
        });

        mo.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            
            attributeFilter: [
                'src',
                'srcset',
                'data-src',
                'data-srcset',
                'poster',
                'type'
            ]
        });
    }

    function processImgOrSource(node) {
        // só utilizar proxy se for uma imagem e ela apontar para nossos servidores
        if (node.tagName === 'SOURCE' && !/^image\//i.test(node.getAttribute('type') || ''))
            return;
        
        const candidate =
            node.getAttribute('data-src') ||
            node.getAttribute('src') ||
            (node.getAttribute('srcset') || '').split(',')[0]?.trim().split(' ')[0] || '';

        if (!IMG_HOST_MATCH.test(candidate) && !IMG_HOST_MATCH.test(getOriginalFrom(node) || '')) {
            enableOpenOriginal(node);

            return;
        }

        tuneImgElement(node);
    }

    // ----- boot -----
    document.addEventListener('DOMContentLoaded', () => {
        // <picture>
        document.querySelectorAll('picture').forEach(tunePicture);

        // imgs/sources soltas
        document.querySelectorAll(IMG_SEL).forEach(processImgOrSource);

        // lazy próprio (caso haja imgs com data-src sem loader externo)
        ensureImageLazyIO();

        // vídeos
        tuneVideosIn(document);

        // observar dp,
        observeNewNodes();
    });
})();

/* loader aei-panzoom (robusto) */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.aei-embed'))
        return;
    
    const here = document.currentScript?.src
        || document.querySelector('script[src*="media-proxy.js"]')?.src
        || '/assets/js/media-proxy.js';
    
    const url = new URL('./aei-panzoom.mjs', here); // mesma pasta /assets/js/
    
    import(url.href).catch(() => {});
});