// src/pages/home/Home.js

export const initEngine = () => {
    const canvas = document.getElementById("webgl-canvas");
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) {
        canvas.style.background = "#0a0a0f";
        return;
    }

    // --- SHADER SOURCES ---
    const vs = `attribute vec2 a; void main(){ gl_Position=vec4(a,0,1); }`;
    const fs = `
    precision highp float;
    uniform vec2 uR;
    uniform float uT, uS, uSc, uBl;
    uniform vec3 uBg;
    #define TAU 6.2831853
    mat2 r2(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
    float sphere(vec3 p, float r) { return length(p) - r; }
    float torus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }
    float box(vec3 p, vec3 b) { vec3 q = abs(p) - b; return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.); }
    float octa(vec3 p, float s) { p = abs(p); return (p.x + p.y + p.z - s) * .5773; }
    float sdf(vec3 p) {
      float t = uT * .25, sc = uSc, bl = uBl;
      float d0 = sphere(p, .65 + .05 * sin(t * 1.3));
      vec3 p1 = p; p1.xz = r2(t * .6) * p1.xz;
      float d1 = torus(p1, vec2(.55, .22));
      vec3 p2 = p; p2.xy = r2(t * .4) * p2.xy; p2.yz = r2(t * .3) * p2.yz;
      float d2 = box(p2, vec3(.42 + .04 * sin(t * 2.)));
      vec3 p3 = p; p3.xy = r2(t * .5) * p3.xy;
      float d3 = octa(p3, .72 + .04 * sin(t * 1.7));
      float d4 = torus(p, vec2(.45, .15));
      if (sc < 1.) return mix(d0, d1, bl);
      if (sc < 2.) return mix(d1, d2, bl);
      if (sc < 3.) return mix(d2, d3, bl);
      return mix(d3, d4, bl);
    }
    vec3 norm(vec3 p) {
      float e = .001;
      return normalize(vec3(sdf(p+vec3(e,0,0))-sdf(p-vec3(e,0,0)), sdf(p+vec3(0,e,0))-sdf(p-vec3(0,e,0)), sdf(p+vec3(0,0,e))-sdf(p-vec3(0,0,e))));
    }
    vec3 pal(float t) { return .5 + .5 * cos(6.283 * (.9 * t + vec3(0., .15, .25))); }
    void main() {
      vec2 uv = (gl_FragCoord.xy - uR * .5) / min(uR.x, uR.y);
      vec3 ro = vec3(0, 0, 2.4), rd = normalize(vec3(uv, -1.2));
      float t = 0., hit = 0.;
      for (int i = 0; i < 80; i++) {
        float d = sdf(ro + rd * t);
        if (d < .001) { hit = 1.; break; }
        t += d; if (t > 6.) break;
      }
      vec3 col = uBg;
   if (hit > .5) {
        vec3 p = ro + rd * t, n = norm(p);
        
        // Tus colores corporativos
        vec3 color1 = vec3(0.376, 0.886, 1.0); // #60e2ff
        vec3 color2 = vec3(0.341, 0.761, 0.808); // #57c2ce
        
        // Mezclamos los dos colores según el movimiento (uS es el scroll)
        vec3 bc = mix(color1, color2, sin(uS * 3.0) * 0.5 + 0.5);
        
        vec3 l = normalize(vec3(.7, 1., .5));
        float dif = clamp(dot(n, l), 0., 1.);
        
        // Efecto Fresnel (brillo en los bordes) usando el cian más claro
        float fr = pow(1. - clamp(dot(-rd, n), 0., 1.), 3.5);
        
        // Resultado: Base de tus colores + un brillo eléctrico en las orillas
        col = bc * (dif * 0.7 + 0.3) + fr * color1 * 0.6;
        
        // Niebla para que se desvanezca en la profundidad
        col = mix(uBg, col, exp(-t * 0.2));
      }
      col = mix(uBg, col, clamp(1. - dot(uv * .9, uv * .9), 0., 1.));
gl_FragColor = vec4(col, hit > .5 ? 1.0 : 0.0);
    }`;

    // --- COMPILE & LINK ---
    const mk = (t, s) => {
        const sh = gl.createShader(t);
        gl.shaderSource(sh, s);
        gl.compileShader(sh);
        return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // --- LOCATIONS ---
    const uLoc = {
        uR: gl.getUniformLocation(prog, "uR"),
        uT: gl.getUniformLocation(prog, "uT"),
        uS: gl.getUniformLocation(prog, "uS"),
        uSc: gl.getUniformLocation(prog, "uSc"),
        uBl: gl.getUniformLocation(prog, "uBl"),
        uBg: gl.getUniformLocation(prog, "uBg")
    };

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(ap);
    gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);

    // --- STATE ---
    let tgt = 0, smooth = 0, velocity = 0, frameId = null;
    const NAMES = ["SCENE 01", "SCENE 02", "SCENE 03", "SCENE 04", "SCENE 05"];

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uLoc.uR, canvas.width, canvas.height);
    };

    const updateHUD = (s) => {
        const p = Math.round(s * 100);
        const hudPct = document.getElementById("hud-pct");
        const progFill = document.getElementById("prog-fill");
        const sceneName = document.getElementById("scene-name");
        const dots = document.querySelectorAll(".scene-dot");

        if (hudPct) hudPct.textContent = String(p).padStart(3, "0") + "%";
        if (progFill) progFill.style.width = `${p}%`;
        const si = Math.min(4, Math.floor(s * 5));
        if (sceneName) sceneName.textContent = NAMES[si];
        dots.forEach((d, i) => d.classList.toggle("active", i === si));
    };

    // Intersection Observer para textos
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.text-card > *').forEach(el => io.observe(el));

    // --- MAIN LOOP ---
    const t0 = performance.now();
    let lastNow = t0;

    // --- DENTRO DE Home.js ---

    const frame = (now) => {
        // 1. Verificación de seguridad: Si no hay programa o contexto, abortar
        if (!gl || !prog || !gl.isProgram(prog)) return;

        const dt = Math.min((now - lastNow) / 1000, 0.05);
        lastNow = now;

        // Inercia y suavizado
        velocity *= Math.pow(0.85, dt * 60);
        if (Math.abs(velocity) > 0.2) window.scrollBy(0, velocity * 0.1);

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        tgt = window.scrollY / (maxScroll || 1);
        smooth += (tgt - smooth) * (1 - Math.exp(-dt * 8));

        const raw = smooth * 4;
        const si = Math.floor(raw);
        const bl = raw - si;

        // 2. Asegurar que estamos usando el programa correcto antes de enviar uniforms
        gl.useProgram(prog);

        // 3. Enviar uniforms (Usando el objeto uLoc que definimos antes)
        gl.uniform3f(uLoc.uBg, 0.02, 0.11, 0.15); // Fondo #051d26
        gl.uniform1f(uLoc.uT, (now - t0) / 1000);
        gl.uniform1f(uLoc.uS, smooth);
        gl.uniform1f(uLoc.uSc, si);
        gl.uniform1f(uLoc.uBl, bl);

        updateHUD(smooth);

        // 4. Dibujar
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Guardar el ID para poder cancelarlo si el componente se desmonta
        frameId = requestAnimationFrame(frame);
    };

    // Eventos
    const onWheel = (e) => {
        e.preventDefault();
        const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
        velocity = Math.max(-600, Math.min(600, velocity + d));
    };

    window.addEventListener("resize", resize);
    window.addEventListener("wheel", onWheel, { passive: false });

    // --- START ---
    resize();
    frameId = requestAnimationFrame(frame);

    // Retornar limpieza para React
    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("wheel", onWheel);
        io.disconnect();
    };
};