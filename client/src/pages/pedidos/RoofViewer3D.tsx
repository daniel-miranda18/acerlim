import { useEffect, useRef } from "react";
import * as THREE from "three";

interface RoofViewer3DProps {
  largo: number;
  ancho: number;
  filas?: number;
  columnas?: number;
  colaActiva?: boolean;
  colaBase?: number;
  colaAltura?: number;
  theme?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function RoofViewer3D({
  largo,
  ancho,
  filas = 4,
  columnas = 6,
  colaActiva = false,
  colaBase = 2,
  colaAltura = 1.5,
  theme = "light",
  className,
  style,
}: RoofViewer3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || 800;
    const H = mount.clientHeight || 500;
    const isDark = theme === "dark";

    /* ── Colors ── */
    const bgColor    = isDark ? 0x0f172a : 0xdde6f0;
    const fogColor   = isDark ? 0x0f172a : 0xdde6f0;
    const floorColor = isDark ? 0x1e293b : 0xcad8e8;
    const gridA      = isDark ? 0x334155 : 0x90aac8;
    const gridB      = isDark ? 0x1e2d3d : 0xb8cfe0;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.1 : 1.4;
    renderer.setClearColor(bgColor);
    mount.appendChild(renderer.domElement);

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(fogColor, 40, 120);

    /* ── Dimensions ── */
    const halfL = largo / 2;
    const halfA = ancho / 2;
    const wallT  = 0.22;                                   // wall thickness
    const wallH  = Math.max(2.2, Math.min(ancho * 0.5, 4.0)); // rect. wall height
    const ridgeH = Math.max(1.0, Math.min(ancho * 0.35, 2.5)); // rise above wall
    const overhang = 0.35;                                 // roof overhang beyond wall

    // Slope maths (CRITICAL: correct pivot)
    const slopeAngle = Math.atan2(ridgeH, halfA);
    const slopeLen   = Math.sqrt(ridgeH * ridgeH + halfA * halfA);
    const totalSlope = slopeLen + overhang / Math.cos(slopeAngle); // along slope surface
    const roofWidth  = largo + 2 * overhang;
    const ridgeY     = wallH + ridgeH;

    /* ── Camera ── */
    const diag = Math.sqrt(largo * largo + ancho * ancho);
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 300);
    const camR = diag * 2.0;
    let theta = -Math.PI / 4;
    let phi   = Math.PI / 3.8;
    const target = new THREE.Vector3(0, wallH * 0.5, 0);
    let radius = camR;

    const syncCamera = () => {
      camera.position.set(
        target.x + radius * Math.sin(phi) * Math.sin(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(target);
    };
    syncCamera();

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.5 : 0.75));
    const sun = new THREE.DirectionalLight(isDark ? 0xfff5cc : 0xffffff, isDark ? 2.0 : 2.8);
    sun.position.set(largo * 1.5, diag * 2, ancho * 0.8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = diag * 2.5;
    Object.assign(sun.shadow.camera, { near: 0.1, far: 200, left: -sc, right: sc, top: sc, bottom: -sc });
    scene.add(sun);
    const fill = new THREE.DirectionalLight(isDark ? 0x8ba8c8 : 0x6090c0, 0.45);
    fill.position.set(-largo, diag, -ancho);
    scene.add(fill);

    /* ── Ground & Grid ── */
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(diag * 8, diag * 8),
      new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.92 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    scene.add(new THREE.GridHelper(diag * 6, 50, gridA, gridB));

    /* ─────────────────────────────────────────
       MATERIALS
    ───────────────────────────────────────── */
    const wallMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xbfb09a : 0xd4c5a9,
      roughness: 0.85,
      side: THREE.DoubleSide,
    });
    const roofMat = [
      new THREE.MeshStandardMaterial({ color: 0x1dab82, roughness: 0.55, metalness: 0.28 }),
      new THREE.MeshStandardMaterial({ color: 0x14806a, roughness: 0.55, metalness: 0.32 }),
    ];
    const roofBase = new THREE.MeshStandardMaterial({
      color: 0x186b5a, roughness: 0.6, metalness: 0.2, side: THREE.DoubleSide,
    });
    const ridgeMat = new THREE.MeshStandardMaterial({
      color: 0x0a3d2c, roughness: 0.4, metalness: 0.5,
    });
    const colaMats = [
      new THREE.MeshStandardMaterial({ color: 0xba7517, roughness: 0.5, metalness: 0.28, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: 0x9a5f12, roughness: 0.5, metalness: 0.32, side: THREE.DoubleSide }),
    ];
    const doorMat   = new THREE.MeshStandardMaterial({ color: 0x7c3e1a, roughness: 0.7 });
    const frameMat  = new THREE.MeshStandardMaterial({ color: isDark ? 0xbfb09a : 0xd4c5a9, roughness: 0.8 });
    const glassMat  = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc, roughness: 0.1, metalness: 0.7, transparent: true, opacity: 0.75,
    });

    /* ─────────────────────────────────────────
       HELPER: add mesh to scene
    ───────────────────────────────────────── */
    const addBox = (
      w: number, h: number, d: number,
      x: number, y: number, z: number,
      mat: THREE.Material,
      cast = true
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = cast;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };

    /* ─────────────────────────────────────────
       WALLS (4 box walls)
    ───────────────────────────────────────── */
    // Front (Z+) & Back (Z-)
    addBox(largo + wallT * 2, wallH, wallT, 0, wallH / 2,  halfA + wallT / 2, wallMat);
    addBox(largo + wallT * 2, wallH, wallT, 0, wallH / 2, -(halfA + wallT / 2), wallMat);
    // Left (X-) & Right (X+)
    addBox(wallT, wallH, ancho, -(halfL + wallT / 2), wallH / 2, 0, wallMat);
    addBox(wallT, wallH, ancho,  (halfL + wallT / 2), wallH / 2, 0, wallMat);

    /* ─────────────────────────────────────────
       GABLE TRIANGLE WALLS  (pentagon per side)
       Vertices are in WORLD space, placed at ±halfL on X.
       Pentagon = rect base + triangle peak.
    ───────────────────────────────────────── */
    const makeGable = (xPos: number) => {
      // 5 vertices (pentagon):
      // 0: bottom-left  1: bottom-right
      // 2: top-right    3: peak        4: top-left
      const v = [
        xPos, 0,          -halfA,        // 0
        xPos, 0,           halfA,        // 1
        xPos, wallH,       halfA,        // 2
        xPos, ridgeY,      0,            // 3 peak
        xPos, wallH,      -halfA,        // 4
      ];
      const verts = new Float32Array(v.length); v.forEach((n, i) => (verts[i] = n));

      // Triangulate the pentagon (3 triangles):
      // front: 0→1→2,  0→2→4,  2→3→4
      // rear (reversed):  0→2→1, 0→4→2, 2→4→3
      const idx = [
        0, 1, 2,  0, 2, 4,  2, 3, 4,   // front face
        0, 2, 1,  0, 4, 2,  2, 4, 3,   // back face
      ];
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    };
    makeGable(-halfL);
    makeGable( halfL);

    /* ─────────────────────────────────────────
       ROOF SLOPES
       Key insight:
         Front slope → slopeGroup.rotation.x = +slopeAngle
           local +Z travels in world (Z+, Y-) direction = down toward front eave ✓
         Back slope  → slopeGroup.rotation.x = Math.PI - slopeAngle
           local +Z travels in world (Z-, Y-) direction = down toward back eave ✓
         Both groups have their origin at the ridge.
    ───────────────────────────────────────── */
    const halfCols = Math.max(1, Math.round(columnas / 2));
    const stripW   = roofWidth / halfCols;
    const stripD   = totalSlope / filas;

    const makeSlope = (rotX: number) => {
      const grp = new THREE.Group();
      grp.position.set(0, ridgeY, 0);
      grp.rotation.x = rotX;
      scene.add(grp);

      // Calamina strips (rows × cols/2)
      for (let row = 0; row < filas; row++) {
        for (let col = 0; col < halfCols; col++) {
          const mat = roofMat[(row + col) % 2];
          const strip = new THREE.Mesh(
            new THREE.BoxGeometry(stripW - 0.04, 0.06, stripD - 0.04),
            mat
          );
          strip.position.set(
            -roofWidth / 2 + col * stripW + stripW / 2,
            0.03,
            row * stripD + stripD / 2
          );
          strip.castShadow = true;
          strip.receiveShadow = true;
          grp.add(strip);
        }
      }

      // Base plane (fills gaps between strips)
      const base = new THREE.Mesh(
        new THREE.PlaneGeometry(roofWidth, totalSlope),
        roofBase
      );
      base.rotation.x = -Math.PI / 2;
      base.position.set(0, 0, totalSlope / 2);
      base.receiveShadow = true;
      grp.add(base);

      // Ridge trim (at z=0 in group = world ridge)
      const ridgeTrim = new THREE.Mesh(new THREE.BoxGeometry(roofWidth, 0.08, 0.16), ridgeMat);
      ridgeTrim.position.set(0, 0.04, 0.05);
      grp.add(ridgeTrim);

      // Eave trim (at z=totalSlope in group = world eave)
      const eaveTrim = new THREE.Mesh(new THREE.BoxGeometry(roofWidth + 0.1, 0.1, 0.16), ridgeMat);
      eaveTrim.position.set(0, 0.05, totalSlope);
      eaveTrim.castShadow = true;
      grp.add(eaveTrim);

      // Fascia boards on left/right ends of slope
      for (const sx of [-1, 1]) {
        const fascia = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, totalSlope), ridgeMat);
        fascia.position.set(sx * (roofWidth / 2 + 0.04), 0.035, totalSlope / 2);
        grp.add(fascia);
      }
    };

    makeSlope(slopeAngle);             // front slope
    makeSlope(Math.PI - slopeAngle);   // back slope

    // Ridge cap (world space, sitting on top of ridge)
    addBox(roofWidth, 0.16, 0.3, 0, ridgeY + 0.08, 0, ridgeMat);

    /* ─────────────────────────────────────────
       COLA DE PATO
       A triangular flap sticking out from the
       left side (X = -halfL) of the house.
       In plan view (top-down):
         The right-angle corner is at (-halfL, _, -halfA) (top-left corner of techo)
         The base runs along -Z (world): from -halfA to -halfA + colaAltura
         The apex extends in -X: from -halfL to -halfL - colaBase
       In 3D, the flap is roughly horizontal at wallH height
       (it represents the flat plan, below the eave).
    ───────────────────────────────────────── */
    if (colaActiva) {
      const nFranjas = 4;
      // build in plan (XZ plane) at Y = wallH
      for (let i = 0; i < nFranjas; i++) {
        const t0 = i / nFranjas;
        const t1 = (i + 1) / nFranjas;

        // Each franja is a quad:
        //   inner edge: x = -halfL, z from [-halfA + colaAltura*t0] to [-halfA + colaAltura*t1]
        //   outer edge: x = -halfL - colaBase*(1-t), interpolated
        const z0 = -halfA + colaAltura * t0;
        const z1 = -halfA + colaAltura * t1;
        const xOut0 = -(halfL + colaBase * (1 - t0));  // outer X at z0
        const xOut1 = -(halfL + colaBase * (1 - t1));  // outer X at z1 (closer to apex)

        // 4 vertices of the quad (at y=wallH)
        // v0: inner at z0, v1: outer at z0, v2: outer at z1, v3: inner at z1
        const geo = new THREE.BufferGeometry();
        const verts = new Float32Array([
          -halfL, wallH, z0,    // 0 inner z0
          xOut0,  wallH, z0,    // 1 outer z0
          xOut1,  wallH, z1,    // 2 outer z1
          -halfL, wallH, z1,    // 3 inner z1
        ]);
        geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
        geo.setIndex([0, 1, 2, 0, 2, 3,   2, 1, 0, 3, 2, 0]);  // both faces
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, colaMats[i % 2]);
        mesh.castShadow = true;
        scene.add(mesh);
      }

      // Small vertical trim strip where cola meets wall
      addBox(0.08, wallH * 0.15, colaAltura, -(halfL + 0.04), wallH - wallH * 0.075, -halfA + colaAltura / 2, ridgeMat, false);
    }

    /* ─────────────────────────────────────────
       DOOR & WINDOWS
    ───────────────────────────────────────── */
    const frontZ = halfA + wallT + 0.01;
    const wY = wallH * 0.62;

    const addWindow = (x: number, z: number, rotY = 0) => {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 0.08), frameMat);
      frame.position.set(x, wY, z);
      frame.rotation.y = rotY;
      scene.add(frame);
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.65), glassMat);
      glass.position.set(x, wY, z + (rotY === 0 ? 0.045 : -0.045));
      glass.rotation.y = rotY;
      scene.add(glass);
    };

    // Center front window
    addWindow(0, frontZ);
    // Side windows only if house is wide enough
    if (largo > 5) {
      const wx = Math.min(halfL - 1.5, largo * 0.3);
      addWindow( wx, frontZ);
      addWindow(-wx, frontZ);
    }
    // Back window
    if (largo > 3) addWindow(0, -(halfA + wallT + 0.01), Math.PI);

    // Door
    const doorX = largo > 5 ? halfL * 0.4 : 0;
    addBox(1.0, 2.1, 0.1, doorX, 1.05, frontZ, doorMat);

    /* ─────────────────────────────────────────
       ORBIT CONTROLS (manual, no deps)
    ───────────────────────────────────────── */
    let dragging = false;
    let prevX = 0, prevY = 0;
    let lastTX = 0, lastTY = 0, lastPinch = 0;

    const onDown  = (e: MouseEvent) => { dragging = true; prevX = e.clientX; prevY = e.clientY; };
    const onUp    = ()               => { dragging = false; };
    const onMove  = (e: MouseEvent) => {
      if (!dragging) return;
      theta -= (e.clientX - prevX) * 0.008;
      phi = Math.max(0.12, Math.min(Math.PI / 2.05, phi + (e.clientY - prevY) * 0.007));
      prevX = e.clientX; prevY = e.clientY;
      syncCamera();
    };
    const onWheel = (e: WheelEvent) => {
      radius = Math.max(diag * 0.5, Math.min(diag * 6, radius + e.deltaY * 0.05));
      syncCamera();
    };
    const onTStart = (e: TouchEvent) => {
      if (e.touches.length === 1) { lastTX = e.touches[0].clientX; lastTY = e.touches[0].clientY; }
      if (e.touches.length === 2)
        lastPinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    };
    const onTMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        theta -= (e.touches[0].clientX - lastTX) * 0.011;
        phi = Math.max(0.12, Math.min(Math.PI / 2.05, phi + (e.touches[0].clientY - lastTY) * 0.009));
        lastTX = e.touches[0].clientX; lastTY = e.touches[0].clientY;
        syncCamera();
      } else if (e.touches.length === 2) {
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        radius = Math.max(diag * 0.5, Math.min(diag * 6, radius - (d - lastPinch) * 0.06));
        lastPinch = d;
        syncCamera();
      }
    };

    renderer.domElement.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });
    renderer.domElement.addEventListener("touchstart", onTStart, { passive: true });
    renderer.domElement.addEventListener("touchmove", onTMove, { passive: false });

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* ── Animate ── */
    let raf: number;
    const tick = () => { raf = requestAnimationFrame(tick); renderer.render(scene, camera); };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("touchstart", onTStart);
      renderer.domElement.removeEventListener("touchmove", onTMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [largo, ancho, filas, columnas, colaActiva, colaBase, colaAltura, theme]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: "100%", height: "100%", cursor: "grab", touchAction: "none", ...style }}
    />
  );
}
