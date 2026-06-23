/* ===================================================================
   Vuné — Intro · Campo de influencia del cursor sobre el logo
   -------------------------------------------------------------------
   Técnica (estilo "mouse-trail texture / influence map"):
     1. El SVG real "vuné" se rasteriza como MÁSCARA ALPHA (silueta).
     2. Una textura-huella (ping-pong FBO) acumula la posición del
        cursor: se estampa un pincel suave y el frame anterior decae
        (TRAIL_DECAY) + retorno lineal (RETURN_SPEED) -> estela temporal.
     3. El shader principal lee esa huella y, con su GRADIENTE, empuja /
        expande y PIXELA solo la zona influida; el resto queda estable.
     4. Física del cursor con interpolación (SMOOTHING) -> estela pesada.
   Stack: Three.js (dos pasadas de ShaderMaterial sobre un quad).
   =================================================================== */

import * as THREE from 'three';

// Colores literales (sin color management) para respetar la paleta de marca
THREE.ColorManagement.enabled = false;

/* ===================== CONSTANTES EDITABLES ======================== */
const CONFIG = {
    CURSOR_RADIUS:       0.20,  // radio de la huella del cursor (en unidades de alto del logo)
    DISTORTION_STRENGTH: 0.55,  // intensidad de empuje/expansión (negativo = invierte la dirección)
    PIXEL_SIZE:          16.0,  // tamaño de los bloques de pixelado (px del buffer; ↑ = bloques más grandes)
    TRAIL_DECAY:         0.90,  // persistencia de la estela por frame (0..1; ↑ = estela más larga)
    RETURN_SPEED:        0.05,  // retorno lineal a la forma original por frame (↑ = vuelve más rápido)
    SMOOTHING:           0.14,  // suavizado del seguimiento del cursor (lerp 0..1; ↓ = más pesado)

    // --- ajustes finos opcionales ---
    PIXEL_MIX:           1.00,  // cuánto pixelado aplicar en el pico de influencia (0..1)
    NOISE:               0.45,  // jitter orgánico (fragmentación) dentro de la huella
    FLOW:                0.40,  // velocidad del movimiento interno de la textura procedural
    COLORS: ['#29B8DD', '#3FD0C9', '#6FC79A', '#F08376'], // cyan, aqua, mint, coral
    CONTENT_SRC: null,          // null => textura procedural · o 'ruta.jpg' / 'ruta.mp4' (loop)
};

/* ------------------------------------------------------------------ */
const root   = document.documentElement;
const intro  = document.getElementById('intro');
const canvas = intro && intro.querySelector('.intro__canvas');
const stage  = intro && intro.querySelector('.intro__stage');
const svg    = intro && intro.querySelector('.intro__logo');

const LOGO_W = 1138, LOGO_H = 474;
const LOGO_ASPECT = LOGO_W / LOGO_H;

// Solo en modo full (hover fino, sin reduced-motion). Si algo falta -> SVG fallback.
if (intro && canvas && svg && root.classList.contains('intro-full')) {
    try { init(); } catch (e) { console.warn('[Vuné] WebGL no disponible, usando logo estático.', e); }
}

/* ------------------------------ Shaders ---------------------------- */
const VERT = /* glsl */`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
    }
`;

// Pasada 1 — acumula la huella del cursor (influence map)
const TRAIL_FRAG = /* glsl */`
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uPrev;
    uniform vec2  uMouse;
    uniform float uAspect;
    uniform float uRadius;
    uniform float uDecay;
    uniform float uReturn;
    uniform float uAdd;     // 0..1 según hover (deja de estampar al salir)

    void main() {
        vec2 d = vUv - uMouse;
        d.x *= uAspect;                              // huella circular real
        float brush = smoothstep(uRadius, 0.0, length(d)) * uAdd;

        float prev = texture2D(uPrev, vUv).r;
        prev = prev * uDecay - uReturn;              // persistencia + retorno a cero
        float v = max(max(prev, 0.0), brush);
        gl_FragColor = vec4(vec3(v), 1.0);
    }
`;

// Pasada 2 — usa la huella para distorsionar + pixelar localmente
const MAIN_FRAG = /* glsl */`
    precision highp float;
    varying vec2 vUv;

    uniform float uTime;
    uniform float uAspect;
    uniform vec2  uResolution;   // tamaño del buffer (px) para el pixelado
    uniform sampler2D uTrail;
    uniform vec2  uTrailTexel;   // 1/resolución del influence map (para el gradiente)

    uniform float uStrength;     // DISTORTION_STRENGTH
    uniform float uPixelSize;    // PIXEL_SIZE
    uniform float uPixelMix;
    uniform float uNoise;
    uniform float uFlow;

    uniform sampler2D uMask;
    uniform vec3  uColA, uColB, uColC, uColD;
    uniform float uHasContent;
    uniform sampler2D uContent;
    uniform float uContentAspect;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        float a = hash(i), b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec3 procedural(vec2 uv){
        float t = uTime * uFlow;
        float w = sin(uv.x * 4.0 + t) + cos(uv.y * 5.0 - t * 0.8);
        float f = 0.5 + 0.5 * sin(uv.x * 6.0 + uv.y * 3.0 + t + w);
        float g = 0.5 + 0.5 * sin(uv.y * 5.0 - uv.x * 2.0 - t * 0.7 + w * 0.8);
        vec3 col = mix(uColA, uColB, f);
        col = mix(col, uColC, g * 0.45);
        col = mix(col, uColD, smoothstep(0.55, 1.0, f * g) * 0.30);
        return col;
    }
    vec3 getContent(vec2 uv){
        if (uHasContent > 0.5){
            vec2 cuv = uv;
            if (uContentAspect > uAspect){ float s = uAspect / uContentAspect; cuv.x = (uv.x - 0.5) * s + 0.5; }
            else { float s = uContentAspect / uAspect; cuv.y = (uv.y - 0.5) * s + 0.5; }
            return texture2D(uContent, cuv).rgb;
        }
        return procedural(uv);
    }

    void main(){
        vec2 uv = vUv;

        // influencia local + gradiente del campo (dirección orgánica del empuje)
        float infl = texture2D(uTrail, uv).r;
        float ix = texture2D(uTrail, uv + vec2(uTrailTexel.x, 0.0)).r
                 - texture2D(uTrail, uv - vec2(uTrailTexel.x, 0.0)).r;
        float iy = texture2D(uTrail, uv + vec2(0.0, uTrailTexel.y)).r
                 - texture2D(uTrail, uv - vec2(0.0, uTrailTexel.y)).r;
        vec2 grad = vec2(ix, iy);
        vec2 dir  = length(grad) > 1e-5 ? normalize(grad) : vec2(0.0);

        // empuje/expansión + jitter de ruido, todo escalado por la influencia
        vec2 push = dir * infl * uStrength * 0.1;
        push += (vec2(vnoise(uv * 60.0 + uTime), vnoise(uv * 60.0 - uTime)) - 0.5)
                * infl * uNoise * 0.04;
        vec2 dUv = uv + push;

        // pixelado localizado (fragmentación digital solo donde hay huella)
        vec2 cells = uResolution / max(uPixelSize, 1.0);
        vec2 pix   = (floor(dUv * cells) + 0.5) / cells;
        vec2 fUv   = mix(dUv, pix, clamp(infl * uPixelMix, 0.0, 1.0));

        float mask = texture2D(uMask, fUv).a;   // la silueta se deforma/rompe solo cerca del cursor
        vec3  col  = getContent(fUv);
        col += infl * 0.07;                       // leve realce en la zona activa

        gl_FragColor = vec4(col * mask, mask);   // alpha premultiplicado
    }
`;

/* ------------------------------ Init ------------------------------- */
function init() {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);

    const cam = new THREE.Camera();           // passthrough (clip space)
    const geo = new THREE.PlaneGeometry(2, 2);

    /* ---- Influence map (ping-pong FBO, baja resolución = barato y suave) ---- */
    const RT_W = 360, RT_H = Math.round(RT_W / LOGO_ASPECT);
    const rtOpts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, stencilBuffer: false };
    let rtRead  = new THREE.WebGLRenderTarget(RT_W, RT_H, rtOpts);
    let rtWrite = new THREE.WebGLRenderTarget(RT_W, RT_H, rtOpts);

    const trailMat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: TRAIL_FRAG,
        uniforms: {
            uPrev:   { value: rtRead.texture },
            uMouse:  { value: new THREE.Vector2(0.5, 0.5) },
            uAspect: { value: LOGO_ASPECT },
            uRadius: { value: CONFIG.CURSOR_RADIUS },
            uDecay:  { value: CONFIG.TRAIL_DECAY },
            uReturn: { value: CONFIG.RETURN_SPEED },
            uAdd:    { value: 0 },
        },
    });
    const trailScene = new THREE.Scene();
    trailScene.add(new THREE.Mesh(geo, trailMat));

    /* ---- Pasada principal ---- */
    const dummy = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat);
    dummy.needsUpdate = true;

    const mainMat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: MAIN_FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
            uTime:          { value: 0 },
            uAspect:        { value: LOGO_ASPECT },
            uResolution:    { value: new THREE.Vector2(1, 1) },
            uTrail:         { value: rtRead.texture },
            uTrailTexel:    { value: new THREE.Vector2(1 / RT_W, 1 / RT_H) },
            uStrength:      { value: CONFIG.DISTORTION_STRENGTH },
            uPixelSize:     { value: CONFIG.PIXEL_SIZE },
            uPixelMix:      { value: CONFIG.PIXEL_MIX },
            uNoise:         { value: CONFIG.NOISE },
            uFlow:          { value: CONFIG.FLOW },
            uMask:          { value: buildMaskTexture() },
            uColA:          { value: new THREE.Color(CONFIG.COLORS[0]) },
            uColB:          { value: new THREE.Color(CONFIG.COLORS[1]) },
            uColC:          { value: new THREE.Color(CONFIG.COLORS[2]) },
            uColD:          { value: new THREE.Color(CONFIG.COLORS[3]) },
            uHasContent:    { value: 0 },
            uContent:       { value: dummy },
            uContentAspect: { value: 1 },
        },
    });
    const mainScene = new THREE.Scene();
    mainScene.add(new THREE.Mesh(geo, mainMat));

    loadContent(mainMat.uniforms);

    // WebGL OK -> mostramos canvas, ocultamos SVG fallback
    stage.classList.add('webgl-on');

    function resize() {
        const r = canvas.getBoundingClientRect();
        if (!r.width || !r.height) return;
        renderer.setSize(r.width, r.height, false);
        const buf = renderer.getDrawingBufferSize(new THREE.Vector2());
        mainMat.uniforms.uResolution.value.copy(buf);
        const a = r.width / r.height;
        mainMat.uniforms.uAspect.value = a;
        trailMat.uniforms.uAspect.value = a;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ----------------- Física del cursor (lerp / inercia) ---------- */
    const target = new THREE.Vector2(0.5, 0.5);
    let addTarget = 0;

    canvas.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        target.set((e.clientX - r.left) / r.width, 1.0 - (e.clientY - r.top) / r.height);
        addTarget = 1;
    }, { passive: true });
    canvas.addEventListener('pointerenter', () => { addTarget = 1; });
    canvas.addEventListener('pointerleave', () => { addTarget = 0; });
    window.addEventListener('blur', () => { addTarget = 0; });

    /* ----------------------- Loop de render ------------------------ */
    const clock = new THREE.Clock();
    let running = true;

    function frame() {
        if (!running) return;
        requestAnimationFrame(frame);
        const S = CONFIG.SMOOTHING;

        // física del cursor
        trailMat.uniforms.uMouse.value.lerp(target, S);
        trailMat.uniforms.uAdd.value += (addTarget - trailMat.uniforms.uAdd.value) * S;

        // Pasada 1: actualizar el influence map (ping-pong)
        trailMat.uniforms.uPrev.value = rtRead.texture;
        renderer.setRenderTarget(rtWrite);
        renderer.render(trailScene, cam);
        renderer.setRenderTarget(null);
        const tmp = rtRead; rtRead = rtWrite; rtWrite = tmp;

        // Pasada 2: render principal usando la huella recién escrita
        mainMat.uniforms.uTrail.value = rtRead.texture;
        mainMat.uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(mainScene, cam);
    }
    requestAnimationFrame(frame);

    // Pausa de GPU cuando la intro sale de vista / la pestaña se oculta
    const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
            if (en.isIntersecting && !document.hidden) {
                if (!running) { running = true; requestAnimationFrame(frame); }
            } else { running = false; }
        });
    }, { threshold: 0 });
    io.observe(intro);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) running = false;
        else if (!running) { running = true; requestAnimationFrame(frame); }
    });

    // Calibrá en vivo desde la consola, ej: VUNE.set('CURSOR_RADIUS', 0.3)
    window.VUNE = {
        config: CONFIG,
        set(key, val) {
            CONFIG[key] = val;
            const U = {
                CURSOR_RADIUS: [trailMat, 'uRadius'], TRAIL_DECAY: [trailMat, 'uDecay'],
                RETURN_SPEED: [trailMat, 'uReturn'],
                DISTORTION_STRENGTH: [mainMat, 'uStrength'], PIXEL_SIZE: [mainMat, 'uPixelSize'],
                PIXEL_MIX: [mainMat, 'uPixelMix'], NOISE: [mainMat, 'uNoise'], FLOW: [mainMat, 'uFlow'],
            };
            if (U[key]) U[key][0].uniforms[U[key][1]].value = val;
        },
    };
}

/* --------- Máscara: rasteriza la silueta real del SVG a textura ----- */
function buildMaskTexture() {
    const ds = [...svg.querySelectorAll('path')].map((p) => p.getAttribute('d'));
    const pad = 0.10;                 // margen para que el empuje no recorte en los bordes
    const W = 2000, H = Math.round(W / LOGO_ASPECT);
    const scale = 1 - 2 * pad;
    const inner = ds.map((d) => `<path d="${d}" fill="#ffffff"/>`).join('');
    const svgStr =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${LOGO_W} ${LOGO_H}">` +
        `<g transform="translate(${LOGO_W * pad},${LOGO_H * pad}) scale(${scale})">${inner}</g></svg>`;

    const tex = new THREE.Texture();
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;

    const url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        c.getContext('2d').drawImage(img, 0, 0, W, H);
        tex.image = c; tex.needsUpdate = true;
        URL.revokeObjectURL(url);
    };
    img.src = url;
    return tex;
}

/* --------- Contenido opcional: imagen o video en loop ------------- */
function loadContent(uniforms) {
    const src = CONFIG.CONTENT_SRC;
    if (!src) return; // queda la textura procedural
    if (/\.(mp4|webm|ogv|mov)$/i.test(src)) {
        const v = document.createElement('video');
        Object.assign(v, { src, loop: true, muted: true, autoplay: true, playsInline: true, crossOrigin: 'anonymous' });
        v.play().catch(() => {});
        uniforms.uContent.value = new THREE.VideoTexture(v);
        uniforms.uHasContent.value = 1;
        v.addEventListener('loadedmetadata', () => {
            uniforms.uContentAspect.value = v.videoWidth / v.videoHeight || uniforms.uAspect.value;
        });
    } else {
        new THREE.TextureLoader().load(src, (t) => {
            uniforms.uContent.value = t;
            uniforms.uHasContent.value = 1;
            uniforms.uContentAspect.value = (t.image && t.image.width / t.image.height) || uniforms.uAspect.value;
        });
    }
}
