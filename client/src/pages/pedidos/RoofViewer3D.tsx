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

    const bgColor    = isDark ? 0x0f172a : 0xdde6f0;
    const fogColor   = isDark ? 0x0f172a : 0xdde6f0;
    const floorColor = isDark ? 0x1e293b : 0xcad8e8;
    const gridA      = isDark ? 0x334155 : 0x90aac8;
    const gridB      = isDark ? 0x1e2d3d : 0xb8cfe0;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.1 : 1.4;
    renderer.setClearColor(bgColor);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(fogColor, 40, 120);

    const halfL = largo / 2;
    const halfA = ancho / 2;
    const wallT  = 0.22;                                   // wall thickness
    const wallH  = Math.max(2.2, Math.min(ancho * 0.5, 4.0)); // rect. wall height
    const ridgeH = Math.max(1.0, Math.min(ancho * 0.35, 2.5)); // rise above wall
    const overhang = 0.35;                                 // roof overhang beyond wall

    const slopeAngle = Math.atan2(ridgeH, halfA);
    const slopeLen   = Math.sqrt(ridgeH * ridgeH + halfA * halfA);
    const totalSlope = slopeLen + overhang / Math.cos(slopeAngle); // along slope surface
    const roofWidth  = largo + 2 * overhang;
    const ridgeY     = wallH + ridgeH;

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

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(diag * 8, diag * 8),
      new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.92 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    scene.add(new THREE.GridHelper(diag * 6, 50, gridA, gridB));

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

    addBox(largo, wallH, wallT, 0, wallH / 2,  halfA - wallT / 2, wallMat);
    addBox(largo, wallH, wallT, 0, wallH / 2, -(halfA - wallT / 2), wallMat);
    addBox(wallT, wallH, ancho - wallT * 2, -(halfL - wallT / 2), wallH / 2, 0, wallMat);
    addBox(wallT, wallH, ancho - wallT * 2,  (halfL - wallT / 2), wallH / 2, 0, wallMat);

    const makeGable = (xPos: number, isLeft: boolean) => {
      const v = [
        xPos, wallH,  -halfA,
        xPos, wallH,   halfA,
        xPos, ridgeY,  0,
      ];
      const verts = new Float32Array(v.length); v.forEach((n, i) => (verts[i] = n));
      const idx = isLeft ? [0, 1, 2] : [0, 2, 1];
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    };

    if (!colaActiva) {
      makeGable(-halfL, true);
      makeGable( halfL, false);
    }

    if (!colaActiva) {
      const halfCols = Math.max(1, Math.round(columnas / 2));
      const stripW   = roofWidth / halfCols;
      const stripD   = totalSlope / filas;

      const makeSlope = (rotX: number) => {
        const grp = new THREE.Group();
        grp.position.set(0, ridgeY, 0);
        grp.rotation.x = rotX;
        scene.add(grp);

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

        const base = new THREE.Mesh(new THREE.PlaneGeometry(roofWidth, totalSlope), roofBase);
        base.rotation.x = -Math.PI / 2;
        base.position.set(0, 0, totalSlope / 2);
        base.receiveShadow = true;
        grp.add(base);

        const eaveTrim = new THREE.Mesh(new THREE.BoxGeometry(roofWidth + 0.1, 0.1, 0.16), ridgeMat);
        eaveTrim.position.set(0, 0.05, totalSlope);
        eaveTrim.castShadow = true;
        grp.add(eaveTrim);

        for (const sx of [-1, 1]) {
          const fascia = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, totalSlope), ridgeMat);
          fascia.position.set(sx * (roofWidth / 2 + 0.04), 0.035, totalSlope / 2);
          grp.add(fascia);
        }
      };

      makeSlope(slopeAngle);
      makeSlope(Math.PI - slopeAngle);
      addBox(roofWidth, 0.16, 0.3, 0, ridgeY + 0.08, 0, ridgeMat);
      
    } else {
     
      const rX = Math.max(0, halfL - colaBase);
      const eY = wallH - 0.2;
      const eZ = halfA + overhang;
      const eX = halfL + overhang;
      const topY = ridgeY + 0.04;

      const createFace = (pts: number[], mat: THREE.Material) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
        const idx = [0, 1, 2, 0, 2, 3];
        if (pts.length === 12) geo.setIndex(idx);
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      };

      createFace([
        -eX, eY, eZ,
         eX, eY, eZ,
         rX, topY, 0,
        -rX, topY, 0
      ], roofMat[0]);

      createFace([
         eX, eY, -eZ,
        -eX, eY, -eZ,
        -rX, topY, 0,
         rX, topY, 0
      ], roofMat[1]);

      const leftGeo = new THREE.BufferGeometry();
      leftGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
        -eX, eY, -eZ,
        -eX, eY, eZ,
        -rX, topY, 0
      ]), 3));
      leftGeo.computeVertexNormals();
      const leftMesh = new THREE.Mesh(leftGeo, colaMats[0]);
      leftMesh.castShadow = true; scene.add(leftMesh);

      const rightGeo = new THREE.BufferGeometry();
      rightGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
         eX, eY, eZ,
         eX, eY, -eZ,
         rX, topY, 0
      ]), 3));
      rightGeo.computeVertexNormals();
      const rightMesh = new THREE.Mesh(rightGeo, colaMats[1]);
      rightMesh.castShadow = true; scene.add(rightMesh);

      if (rX > 0) {
        addBox(rX * 2, 0.1, 0.2, 0, topY + 0.05, 0, ridgeMat);
      }
      
      const drawHipTrim = (x1: number, z1: number, x2: number, z2: number) => {
        const dx = x2 - x1, dy = eY - topY, dz = z2 - z1;
        const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const trim = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, len), ridgeMat);
        trim.position.set(x1 + dx/2, topY + dy/2 + 0.06, z1 + dz/2);
        trim.lookAt(x2, eY + 0.06, z2);
        scene.add(trim);
      };
      drawHipTrim(-rX, 0, -eX, eZ);
      drawHipTrim(-rX, 0, -eX, -eZ);
      drawHipTrim(rX, 0, eX, eZ);
      drawHipTrim(rX, 0, eX, -eZ);
    }



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
