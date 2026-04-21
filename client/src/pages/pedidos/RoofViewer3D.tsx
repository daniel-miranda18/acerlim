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
  caidas?: number;
  theme?: string;
  className?: string;
  style?: React.CSSProperties;
  techoColor?: string;
}

export default function RoofViewer3D({
  largo,
  ancho,
  filas = 4,
  columnas = 6,
  colaActiva = false,
  colaBase = 2,
  colaAltura = 1.5,
  caidas = 2,
  theme = "light",
  className,
  style,
  techoColor,
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
    const wallT  = 0.22;                                   
    const wallH  = Math.max(2.2, Math.min(ancho * 0.5, 4.0)); 
    const ridgeH = Math.max(1.0, Math.min(ancho * 0.35, 2.5)); 
    const overhang = 0.35;                                 
    const ridgeY = wallH + ridgeH;

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

    const tColorObj1 = techoColor ? new THREE.Color(techoColor) : new THREE.Color(0x1dab82);
    const tColorObj2 = techoColor ? new THREE.Color(techoColor).multiplyScalar(0.85) : new THREE.Color(0x14806a);
    const rColorObj = techoColor ? new THREE.Color(techoColor).multiplyScalar(0.6) : new THREE.Color(0x0a3d2c);

    const roofMat = [
      new THREE.MeshStandardMaterial({ color: tColorObj1, roughness: 0.55, metalness: 0.28, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: tColorObj2, roughness: 0.55, metalness: 0.32, side: THREE.DoubleSide }),
    ];
    const ridgeMat = new THREE.MeshStandardMaterial({
      color: rColorObj, roughness: 0.4, metalness: 0.5,
    });

    const cMatColor1 = techoColor ? tColorObj1 : new THREE.Color(0xba7517);
    const cMatColor2 = techoColor ? tColorObj2 : new THREE.Color(0x9a5f12);
    const colaMats = [
      new THREE.MeshStandardMaterial({ color: cMatColor1, roughness: 0.5, metalness: 0.28, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: cMatColor2, roughness: 0.5, metalness: 0.32, side: THREE.DoubleSide }),
    ];

    const addBox = (w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };

    // Paredes
    addBox(largo, wallH, wallT, 0, wallH / 2, halfA - wallT/2, wallMat);
    addBox(largo, wallH, wallT, 0, wallH / 2, -(halfA - wallT/2), wallMat);
    addBox(wallT, wallH, ancho - wallT*2, -(halfL - wallT/2), wallH / 2, 0, wallMat);
    addBox(wallT, wallH, ancho - wallT*2, (halfL - wallT/2), wallH / 2, 0, wallMat);

    const createFace = (pts: number[], mat: THREE.Material) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
      if (pts.length === 12) geo.setIndex([0, 1, 2, 2, 3, 0]);
      else geo.setIndex([0, 1, 2]);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true; mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };

    const drawLine = (p1: THREE.Vector3, p2: THREE.Vector3) => {
      const dir = p2.clone().sub(p1);
      const len = dir.length();
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, len), ridgeMat);
      m.position.copy(p1.clone().add(dir.multiplyScalar(0.5)));
      m.lookAt(p2);
      scene.add(m);
    };

    const eX = halfL + overhang;
    const eZ = halfA + overhang;
    const topY = ridgeY + 0.05;
    const bY = wallH - 0.1;

    if (caidas === 1) {
      // Mono-pitch
      createFace([ -eX, bY, -eZ, eX, bY, -eZ, eX, topY, eZ, -eX, topY, eZ ], roofMat[0]);
      // Triangular sides
      createFace([ eX, bY, -eZ, eX, bY, eZ, eX, topY, eZ ], wallMat);
      createFace([ -eX, bY, -eZ, -eX, topY, eZ, -eX, bY, eZ ], wallMat);
      // Back wall gable
      createFace([ -eX, bY, eZ, eX, bY, eZ, eX, topY, eZ, -eX, topY, eZ ], wallMat);
    } 
    else if (caidas === 2) {
      if (!colaActiva) {
        // Standard Gable
        createFace([ -eX, bY, eZ, eX, bY, eZ, eX, topY, 0, -eX, topY, 0 ], roofMat[0]);
        createFace([ -eX, bY, -eZ, -eX, topY, 0, eX, topY, 0, eX, bY, -eZ ], roofMat[1]);
        // Gable triangles
        createFace([ -halfL, wallH, -halfA, -halfL, wallH, halfA, -halfL, ridgeY, 0 ], wallMat);
        createFace([ halfL, wallH, halfA, halfL, wallH, -halfA, halfL, ridgeY, 0 ], wallMat);
        addBox(eX*2, 0.15, 0.25, 0, topY, 0, ridgeMat);
      } else {
        // Jerkinhead (Cola de pato) - Gable with small hips
        const rX = Math.max(0, halfL - colaBase);
        const hipY = topY - colaAltura;
        createFace([ -eX, bY, eZ, eX, bY, eZ, rX, topY, 0, -rX, topY, 0 ], roofMat[0]);
        createFace([ eX, bY, -eZ, -eX, bY, -eZ, -rX, topY, 0, rX, topY, 0 ], roofMat[1]);
        // Hips
        createFace([ -eX, bY, -eZ, -eX, bY, eZ, -rX, topY, 0 ], colaMats[0]);
        createFace([ eX, bY, eZ, eX, bY, -eZ, rX, topY, 0 ], colaMats[1]);
        if (rX > 0) addBox(rX*2, 0.15, 0.25, 0, topY, 0, ridgeMat);
      }
    }
    else if (caidas === 3) {
      // One side Hip (Left), one side Gable (Right)
      const rX = halfL - halfA; 
      // Main slopes starting from hip apex (-rX) to gable end (eX)
      createFace([ -eX, bY, eZ, eX, bY, eZ, eX, topY, 0, -rX, topY, 0 ], roofMat[0]);
      createFace([ eX, bY, -eZ, -eX, bY, -eZ, -rX, topY, 0, eX, topY, 0 ], roofMat[1]);
      // Hip end (Left)
      createFace([ -eX, bY, -eZ, -eX, bY, eZ, -rX, topY, 0 ], colaMats[0]);
      // Gable end (Right)
      createFace([ halfL, wallH, halfA, halfL, wallH, -halfA, halfL, ridgeY, 0 ], wallMat);
      drawLine(new THREE.Vector3(-rX, topY, 0), new THREE.Vector3(eX, topY, 0));
    }
    else if (caidas === 4) {
      // Full Hip roof
      const rX = Math.max(0, halfL - halfA);
      createFace([ -eX, bY, eZ, eX, bY, eZ, rX, topY, 0, -rX, topY, 0 ], roofMat[0]);
      createFace([ eX, bY, -eZ, -eX, bY, -eZ, -rX, topY, 0, rX, topY, 0 ], roofMat[1]);
      createFace([ -eX, bY, -eZ, -eX, bY, eZ, -rX, topY, 0 ], colaMats[0]);
      createFace([ eX, bY, eZ, eX, bY, -eZ, rX, topY, 0 ], colaMats[1]);
      if (rX > 0) addBox(rX*2, 0.15, 0.25, 0, topY, 0, ridgeMat);
    }

    // Orbit Controls
    let dragging = false, prevX = 0, prevY = 0, lastTX = 0, lastTY = 0, lastPinch = 0;
    const onDown = (e: MouseEvent) => { dragging = true; prevX = e.clientX; prevY = e.clientY; };
    const onUp = () => { dragging = false; };
    const onMove = (e: MouseEvent) => {
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
      else if (e.touches.length === 2) lastPinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    };
    const onTMove = (e: TouchEvent) => {
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
  }, [largo, ancho, filas, columnas, colaActiva, colaBase, colaAltura, caidas, theme, techoColor]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: "100%", height: "100%", cursor: "grab", touchAction: "none", ...style }}
    />
  );
}
