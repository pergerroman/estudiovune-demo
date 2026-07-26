// 1. Textura del rastro
class MouseTrail {
    constructor() {
        this.size = 1024;
        this.maxAge = 120;
        const isChrome = /Chrome|CriOS/.test(navigator.userAgent)
            && !/Edg|OPR/.test(navigator.userAgent);
        this.radius = isChrome ? 0.22 : 0.08;
        this.intensity = 0.8;
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.ctx = this.canvas.getContext('2d');
        
        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.generateMipmaps = false;
        this.trail = [];
    }

    addPoint(x, y) {
        this.trail.push({ x, y, age: 0 });
    }

    update() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.size, this.size);
        
        this.ctx.globalCompositeOperation = 'difference';
        
        for (let i = this.trail.length - 1; i >= 0; i--) {
            let p = this.trail[i];
            p.age += 1;
            
            if (p.age >= this.maxAge) {
                this.trail.splice(i, 1);
                continue;
            }
            
            let force = 1.0 - (p.age / this.maxAge);
            force = Math.pow(force, 1.5); 
            
            let r = this.radius * this.size * force;
            let px = p.x * this.size;
            let py = p.y * this.size; 
            
            let grad = this.ctx.createRadialGradient(px, py, 0, px, py, Math.max(0.1, r));
            let colorVal = Math.floor(255 * this.intensity * force);
            
            grad.addColorStop(0, `rgba(${colorVal}, ${colorVal}, ${colorVal}, 1)`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(px, py, r, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
        this.texture.needsUpdate = true;
    }
}

// 2. Shaders de transparencia, grano y distorsión
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float uTime;
    uniform sampler2D tTrail;
    uniform sampler2D tMask;
    uniform vec2 uMaskScale;
    uniform float uZoom;
    uniform float uTrailBlurRadius;
    
    varying vec2 vUv;

    // Simplex 3D Noise function
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        float n_ = 1.0/7.0;
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
    
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float sampleBlurredTrail(vec2 uv) {
        // El blur se aplica solo a la textura de la estela.
        vec2 radius = vec2(uTrailBlurRadius / 1024.0);
        float trail = texture2D(tTrail, uv).r * 0.28;

        trail += texture2D(tTrail, uv + vec2( radius.x, 0.0)).r * 0.12;
        trail += texture2D(tTrail, uv + vec2(-radius.x, 0.0)).r * 0.12;
        trail += texture2D(tTrail, uv + vec2(0.0,  radius.y)).r * 0.12;
        trail += texture2D(tTrail, uv + vec2(0.0, -radius.y)).r * 0.12;

        trail += texture2D(tTrail, uv + vec2( radius.x,  radius.y)).r * 0.06;
        trail += texture2D(tTrail, uv + vec2(-radius.x,  radius.y)).r * 0.06;
        trail += texture2D(tTrail, uv + vec2( radius.x, -radius.y)).r * 0.06;
        trail += texture2D(tTrail, uv + vec2(-radius.x, -radius.y)).r * 0.06;

        return trail;
    }

    void main() {
        vec2 uv = vUv;
        
        float trail = sampleBlurredTrail(uv);
        
        float grain = random(uv + uTime * 0.1);
        
        float noiseX = snoise(vec3(uv * 5.0, uTime * 0.5));
        float noiseY = snoise(vec3(uv * 5.0 + 10.0, uTime * 0.5));
        
        vec2 distortion = vec2(noiseX, noiseY) * (0.01 + trail * 0.15) * uZoom;
        
        vec2 maskUv = ((uv - 0.5) * uMaskScale) * uZoom + 0.5;
        
        float baseMask = texture2D(tMask, maskUv + distortion).r;
        float grainyMask = baseMask + (grain * 0.2);
        float hole = grainyMask + (trail * grain * 1.5);
        
        float alpha = 1.0 - smoothstep(0.3, 0.6, hole);
        
        float zoomFade = 1.0 - smoothstep(0.0, 0.004, uZoom);
        alpha = mix(alpha, 0.0, zoomFade);
        
        float dustMask = 1.0 - smoothstep(0.1, 0.5, hole);
        float dust = dustMask * trail * grain * 2.5;
        
        vec3 baseColor = vec3(247.0/255.0, 247.0/255.0, 244.0/255.0);
        vec3 finalColor = baseColor; 
        
        finalColor -= dust; 
        finalColor -= alpha * grain * 0.03;
        
        gl_FragColor = vec4(finalColor, alpha);
    }
`;

// 3. Escena Three.js
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // Background transparente
container.appendChild(renderer.domElement);

// SVG usado como máscara del efecto WebGL.
const rawSvg = `<svg width="1138" height="474" viewBox="0 0 1138 474" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1_3)">
<path d="M435.412 137.909C431.847 157.449 438.652 175.03 436.265 196.08C434.176 219.117 424.428 241.447 418.509 265.659C409.925 293.341 413.489 325.603 396.395 346.899C386.03 355.903 381.582 343.306 381.152 330.194C380.575 309.82 386.147 287.193 387.137 266.439C388.972 235.993 384.172 210.091 370.715 186.901C357.082 161.305 321.728 145.909 308.274 179.844C302.76 196.73 309.547 215.422 313.97 232.281C318.945 249.609 320.172 267.887 316.179 285.65C309.318 319.719 288.072 349.804 285.274 384.465C282.241 415.873 307.592 439.911 338.075 440.879C364.638 442.282 387.89 429.591 414.966 428.509C425.575 427.807 436.24 428.201 446.893 429.098C467.513 430.448 494.047 437.075 508.96 420.061C526.218 397.158 500.627 369.5 488.126 349.724C474.567 330.446 474.346 306.208 481.179 284.278C492.218 243.61 523.394 200.315 516.306 154.987C513.675 138.189 503.877 121.762 488.54 114.529C467.926 103.578 439.825 114.881 435.53 137.392L435.412 137.909Z" fill="black"/>
<path d="M197.374 333.233C181.208 360.642 178.956 399.992 169.806 430.78C160.482 465.906 127.693 488.899 96.7016 462.707C80.5028 448.903 73.5581 422.141 69.5939 399.684C65.7639 379.737 62.2376 357.447 56.4443 336.149C47.3854 300.559 29.1284 268.662 15.4465 234.916C-2.09646 190.138 -9.72272 135.345 20.1453 98.3923C40.9594 73.5704 81.0527 69.9961 105.964 91.151C142.956 120.669 130.766 177.145 116.307 215.534C109.222 236.239 101.493 257.563 103.768 279.677C105.825 299.56 117.933 336.094 135.469 321.4C146.29 310.503 152.09 293.904 159.777 280.327C171.275 258.031 186.761 236.612 193.709 214.618C207.302 178.898 190.384 129.435 224.308 103.667C250.853 87.0707 278.743 117.233 284.394 142.767C302.677 218.771 232.891 276.154 197.692 332.655L197.374 333.233Z" fill="black"/>
<path d="M558.078 129.007C514.097 153.989 559.845 201.834 558.473 237.35C558.235 261.485 547.638 284.977 543.955 308.833C539.11 336.036 539.884 360.808 544.06 382.819C551.967 432.119 595.612 443.96 624.414 401.69C641.366 377.379 646.619 344.471 657.174 318.688C667.529 291.298 688.217 271.118 706.985 249.272C719.775 235.159 734.921 207.731 748.685 199.769C774.932 186.794 762.684 247.371 761.781 263.878C759.703 280.455 757.536 297.33 753.595 313.645C744.314 349.947 719.204 396.759 750.222 427.316C764.892 441.082 788.064 441.647 806.982 436.422C832.029 430.516 850.422 411.532 850.336 385.092C851.258 362.073 842.847 338.758 839.659 316.28C836.662 297.066 838.066 279.686 840.968 259.557C845.309 231.22 847.78 200.225 837.818 172.505C820.934 123.592 784.549 98.4683 732.396 119.045C721.061 123.23 710.251 128.839 700.418 135.955C683.314 145.588 657.228 186.899 638.752 180.716C627.419 175.831 622.577 156.828 614.3 144.388C603.112 124.398 578.267 117.632 558.605 128.724L558.078 129.007Z" fill="black"/>
<path d="M1133.53 361.919C1126.43 346.079 1109.59 338.848 1093.22 336.536C1074.77 333.494 1050.89 334.897 1035.53 332.266C1027.17 331.368 1009.88 325.695 1022.13 316.314C1043.5 302.036 1087.99 297.517 1104.59 270.317C1115.89 254.134 1117.74 230.976 1112.65 210.987C1100.88 160.629 1042.58 128.553 992.785 132.569C910.155 138.376 832.054 287.586 873.821 358.951C891.042 388.069 901.471 409.944 931.722 420.606C959.955 430.2 1013.53 428.094 1042.34 434.89C1069.6 441.018 1105.21 448.751 1124.66 423.347C1136.87 407.283 1142.49 381.771 1133.77 362.45L1133.53 361.919ZM962.726 249.477C972.018 230.096 987.696 200.967 1013.55 198.325C1051.24 199.55 1054.71 244.8 1027.98 264.341C1002.6 285.357 938.727 302.625 962.427 250.187L962.726 249.477Z" fill="black"/>
<path d="M932.757 112.867C933.281 109.686 936.106 107.518 938.412 105.264C948.126 95.8941 951.084 81.7798 954.531 68.7462C959.374 50.275 966.478 31.6425 980.118 18.2854C998.72 0.110806 1028.75 -5.21714 1052.44 5.47959C1058.74 8.31663 1064.86 12.4896 1067.87 18.6859C1072.2 27.6644 1068.78 38.9028 1062 46.2221C1055.2 53.536 1045.69 57.6056 1036.25 60.853C1025.44 62.2431 1014.81 67.0935 1006.39 74.043C995.664 82.8791 988.493 95.2336 979.213 105.608C969.934 115.982 956.804 124.823 943.036 122.758C937.758 121.99 931.897 118.092 932.757 112.867Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_1_3">
<rect width="1138" height="474" fill="white"/>
</clipPath>
</defs>
</svg>`;

const maskSvgString = rawSvg.replace(/fill="black"/g, 'fill="white"');
const svgBlob = new Blob([maskSvgString], {type: 'image/svg+xml;charset=utf-8'});
const svgUrl = URL.createObjectURL(svgBlob);

const maskCanvas = document.createElement('canvas');
maskCanvas.width = 2048;
maskCanvas.height = 2048;
const maskCtx = maskCanvas.getContext('2d');
const maskTexture = new THREE.CanvasTexture(maskCanvas);
maskTexture.minFilter = THREE.LinearFilter;
maskTexture.magFilter = THREE.LinearFilter;
maskTexture.generateMipmaps = false;

const maskImg = new Image();
maskImg.onload = () => {
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, 2048, 2048);
    
    const scale = 1.3;
    const w = 1138 * scale;
    const h = 474 * scale;
    const dx = (2048 - w) / 2;
    const dy = (2048 - h) / 2;
    
    maskCtx.drawImage(maskImg, dx, dy, w, h);
    maskTexture.needsUpdate = true;
};
maskImg.src = svgUrl;

const mouseTrail = new MouseTrail();

const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    precision: 'highp',
    transparent: true, 
    uniforms: {
        uTime: { value: 0 },
        tTrail: { value: mouseTrail.texture },
        tMask: { value: maskTexture }, 
        uMaskScale: { value: new THREE.Vector2(1.0, 1.0) },
        uZoom: { value: 1.0 },
        uTrailBlurRadius: {
            value: /Chrome|CriOS/.test(navigator.userAgent)
                && !/Edg|OPR/.test(navigator.userAgent) ? 4.0 : 8.0
        }
    }
});

function updateMaskScale() {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    
    const maxW = screenW * 0.85;
    const maxH = screenH * 0.70;
    
    const svgW = 1138;
    const svgH = 474;
    const svgAspect = svgW / svgH;
    
    let targetW = maxW;
    let targetH = targetW / svgAspect;
    
    if (targetH > maxH) {
        targetH = maxH;
        targetW = targetH * svgAspect;
    }
    
    const texDrawScale = 1.3;
    const drawnW = svgW * texDrawScale;
    const drawnH = svgH * texDrawScale;
    const texSize = 2048; 
    
    const scaleX = (drawnW / texSize) * (screenW / targetW);
    const scaleY = (drawnH / texSize) * (screenH / targetH);
    
    material.uniforms.uMaskScale.value.set(scaleX, scaleY);
}

updateMaskScale();

const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Zoom vinculado al scroll.
function updateScroll() {
    const scrollY = window.scrollY;
    
    // La zona de zoom coincide con la altura de .zoom-spacer.
    const zoomZone = window.innerHeight * 1.2; 
    
    let progress = Math.min(Math.max(scrollY / zoomZone, 0), 1);

    // Ease-in: arranca algo mas suave y acelera hacia el final.
    const easeProgress = Math.pow(progress, 1.5);

    // Zoom exponencial por "octavas": la escala se duplica a ritmo
    // constante, asi el acercamiento se siente mucho mas fuerte.
    const ZOOM_OCTAVES = 12.0;
    const zoom = Math.pow(2, -easeProgress * ZOOM_OCTAVES);

    material.uniforms.uZoom.value = Math.max(0.00001, zoom);

    // Mostramos el header únicamente cuando el zoom terminó.
    const header = document.querySelector('.header');
    if(header) {
        const zoomFinished = progress >= 1;
        header.style.opacity = zoomFinished ? '1' : '0';
        header.style.pointerEvents = zoomFinished ? 'auto' : 'none';
    }
}

window.addEventListener('scroll', updateScroll);
updateScroll(); 

// Manejo del ratón (sigue funcionando porque los eventos se leen del window global)
let currentMouse = { x: 0.5, y: 0.5 };
let lastMove = 0;

window.addEventListener('mousemove', (e) => {
    currentMouse.x = e.clientX / window.innerWidth;
    currentMouse.y = e.clientY / window.innerHeight;
    
    const now = performance.now();
    if (now - lastMove > 16) { 
        mouseTrail.addPoint(currentMouse.x, currentMouse.y);
        lastMove = now;
    }
});

window.addEventListener('touchmove', (e) => {
    currentMouse.x = e.touches[0].clientX / window.innerWidth;
    currentMouse.y = e.touches[0].clientY / window.innerHeight;
    mouseTrail.addPoint(currentMouse.x, currentMouse.y);
});

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateMaskScale(); 
    updateScroll(); 
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    mouseTrail.update();
    material.uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

animate();

