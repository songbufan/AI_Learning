import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';

import { useSceneStore, useUIStore } from '../../stores';
import styles from './Scene.module.css';

export function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  const { setProgress, setFocus, setWebGLSupport, updateClock, lamp, focus } = useSceneStore();
  const { openPanel, closePanel } = useUIStore();

  // Three.js refs
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const controlsRef = useRef<OrbitControls>();
  const sceneRef = useRef<THREE.Scene>();
  const rafRef = useRef<number>();

  // Mutable scene state
  const lampOnRef = useRef(true);
  const lampLightRef = useRef<THREE.PointLight>();
  const lampShadeMatRef = useRef<THREE.MeshStandardMaterial>();
  const lampBulbMeshRef = useRef<THREE.Mesh>();
  const lampLightBaseRef = useRef(9.0);
  const deskGlowBaseRef = useRef(2.2);
  const deskGlowRef = useRef<THREE.PointLight>();
  const laptopScreenMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const lampMeshesRef = useRef<THREE.Object3D[]>([]);
  const allInteractiveMeshesRef = useRef<THREE.Object3D[]>([]);
  const focusedObjectRef = useRef<any>(null);
  const hoveredObjectRef = useRef<any>(null);
  const isAnimatingRef = useRef(false);
  const charStateRef = useRef('sitting');
  const characterGroupRef = useRef<THREE.Group>();
  const bedBodyLumpRef = useRef<THREE.Group>();
  const particleGeoRef = useRef<THREE.BufferGeometry>();
  const labelElsRef = useRef<Record<string, HTMLElement>>({});
  const labelDefsRef = useRef<any[]>([]);
  const interactiveObjectsRef = useRef<any[]>([]);
  const focusObjectFnRef = useRef<((obj: any) => void) | null>(null);
  const hourPivotRef = useRef<THREE.Group>();
  const minPivotRef = useRef<THREE.Group>();
  const secPivotRef = useRef<THREE.Group>();
  const winPaneMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const winLightRef = useRef<THREE.PointLight>();
  const fillLeftRef = useRef<THREE.PointLight>();
  const fillRightRef = useRef<THREE.PointLight>();
  const ceilBounceRef = useRef<THREE.PointLight>();
  const charLightRef = useRef<THREE.PointLight>();
  const ambientRef = useRef<THREE.AmbientLight>();
  const dirLightRef = useRef<THREE.DirectionalLight>();
  const nightLightPtRef = useRef<THREE.SpotLight>();
  const ceilPanelRef = useRef<THREE.Mesh>();
  const wfSkyMatRef = useRef<THREE.MeshStandardMaterial>();
  const wfMtnMatRef = useRef<THREE.MeshStandardMaterial>();
  const wfMoonRef = useRef<THREE.Mesh>();
  const wfSunRef = useRef<THREE.Mesh>();
  const wfStarsRef = useRef<THREE.Mesh[]>([]);
  const wfBldMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const wfWinMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const lastTimeRef = useRef(0);
  const PARTICLE_COUNT = useRef(200);

  const DEFAULT_CAM_POS = new THREE.Vector3(0, 2.8, 5.2);
  const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 1.4, -3.5);

  useEffect(() => {
    // WebGL detection
    try {
      const c = document.createElement('canvas');
      if (!c.getContext('webgl2') && !c.getContext('webgl')) {
        setWebGLSupport(false);
        return;
      }
    } catch {
      setWebGLSupport(false);
      return;
    }
    setWebGLSupport(true);

    const isMobile = window.innerWidth <= 600 || ('ontouchstart' in window && window.innerWidth <= 1024);
    PARTICLE_COUNT.current = isMobile ? 60 : 200;

    if (!canvasRef.current) return;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: !isMobile });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.2;
    rendererRef.current = renderer;

    /* Scene */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x131325);
    scene.fog = new THREE.FogExp2(0x131325, 0.016);
    sceneRef.current = scene;

    /* Camera */
    const camera = new THREE.PerspectiveCamera(isMobile ? 65 : 55, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.set(0, 7, 14);
    camera.lookAt(DEFAULT_CAM_TARGET);
    cameraRef.current = camera;

    /* Controls */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(DEFAULT_CAM_TARGET);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = isMobile ? 2 : 2.5;
    controls.maxDistance = isMobile ? 12 : 9;
    controls.maxPolarAngle = Math.PI / 2.08;
    controls.minPolarAngle = 0.15;
    controls.enabled = false;
    controlsRef.current = controls;

    setProgress(15, 'Setting up lights…');

    /* Lights */
    const ambient = new THREE.AmbientLight(0xc8d0ff, 1.4);
    scene.add(ambient);
    ambientRef.current = ambient;

    const dirLight = new THREE.DirectionalLight(0xfff8f0, 2.8);
    dirLight.position.set(5, 10, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.camera.left = dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.camera.right = dirLight.shadow.camera.top = 10;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const fillLeft = new THREE.PointLight(0x88aaff, 1.5, 14);
    fillLeft.position.set(-4, 4.5, -3);
    scene.add(fillLeft);
    fillLeftRef.current = fillLeft;

    const fillRight = new THREE.PointLight(0xffddbb, 1.4, 14);
    fillRight.position.set(4, 4.5, -4);
    scene.add(fillRight);
    fillRightRef.current = fillRight;

    deskGlowBaseRef.current = 2.2;
    const deskGlow = new THREE.PointLight(0xffbb66, deskGlowBaseRef.current, 5);
    deskGlow.position.set(-0.3, 3.2, -5.5);
    scene.add(deskGlow);
    deskGlowRef.current = deskGlow;

    lampLightBaseRef.current = 9.0;
    const lampLight = new THREE.PointLight(0xffcc77, lampLightBaseRef.current, 18);
    lampLight.castShadow = false;
    lampLight.position.set(1.2, 2.8, -4.0);
    scene.add(lampLight);
    lampLightRef.current = lampLight;

    const ceilBounce = new THREE.PointLight(0xaabbff, 1.3, 16);
    ceilBounce.position.set(0, 6.0, -5.0);
    scene.add(ceilBounce);
    ceilBounceRef.current = ceilBounce;

    const charLight = new THREE.PointLight(0xffeedd, 1.3, 7);
    charLight.position.set(2, 4, -1.5);
    scene.add(charLight);
    charLightRef.current = charLight;

    setProgress(28, 'Building room…');

    /* Material helpers */
    const mat = (c: number, o: any = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.78, metalness: 0.04, ...o });
    const gloss = (c: number, o: any = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.22, metalness: 0.35, ...o });
    const emMat = (c: number, e: number, i = 1) => new THREE.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: i, roughness: 0.4 });

    /* ROOM */
    const ROOM_W = 10, ROOM_D = 9, ROOM_H = 6.5, ROOM_CZ = -4.0;
    const wallColor = 0x1e1e3a, wallColor2 = 0x1c1c38;
    const wainscotColor = 0x252545, trimColor = 0x2e2e52;

    // Floor
    const floorBase = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), new THREE.MeshStandardMaterial({ color: 0x1e1e36, roughness: 0.9 }));
    floorBase.rotation.x = -Math.PI / 2;
    floorBase.position.set(0, 0, ROOM_CZ);
    floorBase.receiveShadow = true;
    scene.add(floorBase);

    for (let i = 0; i < 12; i++) {
      const plank = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, 0.005), new THREE.MeshStandardMaterial({ color: 0x28284a, roughness: 0.95 }));
      plank.rotation.x = -Math.PI / 2;
      plank.position.set(0, 0.001, ROOM_CZ - ROOM_D / 2 + (i + 1) * (ROOM_D / 13));
      scene.add(plank);
    }

    const grid = new THREE.GridHelper(ROOM_W, 14, 0x2a2a4a, 0x222240);
    grid.position.set(0, 0.002, ROOM_CZ);
    scene.add(grid);

    // Walls
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), mat(wallColor, { roughness: 0.92 }));
    backWall.position.set(0, ROOM_H / 2, -8.5);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), mat(wallColor2, { roughness: 0.92 }));
    leftWall.position.set(-5, ROOM_H / 2, ROOM_CZ);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_D, ROOM_H), mat(wallColor2, { roughness: 0.92 }));
    rightWall.position.set(5, ROOM_H / 2, ROOM_CZ);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), mat(0x14142a));
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, ROOM_H, ROOM_CZ);
    scene.add(ceil);

    // Wainscoting
    ([[ROOM_W, 0, ROOM_H / 2, -8.47, 0], [ROOM_D, -5 + 0.03, ROOM_H / 2, ROOM_CZ, Math.PI / 2], [ROOM_D, 5 - 0.03, ROOM_H / 2, ROOM_CZ, Math.PI / 2]] as any[]).forEach(([w, x, _y, z, ry]) => {
      const lower = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.3), mat(wainscotColor, { roughness: 0.88 }));
      lower.position.set(x, 0.65, z);
      if (ry) lower.rotation.y = ry;
      scene.add(lower);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(ry ? 0.07 : w, 0.055, ry ? w : 0.07), mat(trimColor, { roughness: 0.7 }));
      rail.position.set(x ? x * 0.98 : 0, 1.32, z);
      scene.add(rail);
    });

    // Skirting boards
    ([[ROOM_W, new THREE.Vector3(0, 0.09, -8.46), 0], [ROOM_D, new THREE.Vector3(-4.97, 0.09, ROOM_CZ), Math.PI / 2], [ROOM_D, new THREE.Vector3(4.97, 0.09, ROOM_CZ), Math.PI / 2]] as any[]).forEach(([w, pos, ry]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.18, 0.06), mat(trimColor));
      m.position.copy(pos);
      m.rotation.y = ry;
      scene.add(m);
    });

    // Crown molding
    ([[ROOM_W, new THREE.Vector3(0, 6.44, -8.46), 0], [ROOM_D, new THREE.Vector3(-4.97, 6.44, ROOM_CZ), Math.PI / 2], [ROOM_D, new THREE.Vector3(4.97, 6.44, ROOM_CZ), Math.PI / 2]] as any[]).forEach(([w, pos, ry]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, 0.08), mat(trimColor));
      m.position.copy(pos);
      m.rotation.y = ry;
      scene.add(m);
    });

    // Ceiling light panel
    const ceilPanel = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.04, 0.7), emMat(0xffffff, 0xbbccff, 0.65));
    ceilPanel.position.set(0, 6.48, ROOM_CZ);
    scene.add(ceilPanel);
    ceilPanelRef.current = ceilPanel;

    // Window
    let winLight: THREE.PointLight;
    {
      const winX = -4.97, winY = 3.3, winZ = -5.8, winW = 1.4, winH = 1.2;
      const frameMat = mat(0x2a2a48, { roughness: 0.6 });
      ([[winW + 0.12, 0.08, 0.06, 0, winH / 2 + 0.04, 0], [winW + 0.12, 0.08, 0.06, 0, -winH / 2 - 0.04, 0], [0.08, winH, 0.06, -winW / 2 - 0.04, 0, 0], [0.08, winH, 0.06, winW / 2 + 0.04, 0, 0], [0.04, winH, 0.06, 0, 0, 0], [winW, 0.04, 0.06, 0, 0, 0]] as any[]).forEach(([w, h, d, ox, oy]) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
        bar.position.set(winX + 0.04, winY + oy, winZ + ox);
        bar.rotation.y = Math.PI / 2;
        scene.add(bar);
      });

      ([[-winW / 4, winH / 4], [winW / 4, winH / 4], [-winW / 4, -winH / 4], [winW / 4, -winH / 4]] as any[]).forEach(([ox, oy]) => {
        const paneMat = new THREE.MeshStandardMaterial({ color: 0x0a0a20, emissive: 0x0a0a20, emissiveIntensity: 0.3, roughness: 0.4 });
        winPaneMatsRef.current.push(paneMat);
        const pane = new THREE.Mesh(new THREE.PlaneGeometry(winW / 2 - 0.06, winH / 2 - 0.06), paneMat);
        pane.position.set(winX + 0.03, winY + oy, winZ + ox);
        pane.rotation.y = Math.PI / 2;
        scene.add(pane);
      });

      winLight = new THREE.PointLight(0xaaccff, 0.05, 8);
      winLight.position.set(winX + 0.5, winY, winZ);
      scene.add(winLight);
      winLightRef.current = winLight;
    }

    // Wall panels
    for (let i = 0; i < 3; i++) {
      const pw = 2.2, ph = 0.85, px = -3.3 + i * 3.3;
      const pf = new THREE.Mesh(new THREE.BoxGeometry(pw + 0.12, ph + 0.1, 0.03), mat(wainscotColor, { roughness: 0.85 }));
      pf.position.set(px, 0.72, -8.47);
      scene.add(pf);
      const pi = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, 0.025), mat(wallColor, { roughness: 0.95 }));
      pi.position.set(px, 0.72, -8.455);
      scene.add(pi);
    }

    // Area rug
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 3.2), mat(0x2d1a40, { roughness: 0.95 }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.003, -3.2);
    scene.add(rug);
    const rugBorder = new THREE.Mesh(new THREE.PlaneGeometry(5.08, 3.48), mat(0x4a2a62, { roughness: 0.95 }));
    rugBorder.rotation.x = -Math.PI / 2;
    rugBorder.position.set(0, 0.002, -3.2);
    scene.add(rugBorder);
    const rugPattern = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.2), mat(0x3a1e52, { roughness: 0.95 }));
    rugPattern.rotation.x = -Math.PI / 2;
    rugPattern.position.set(0, 0.004, -3.2);
    scene.add(rugPattern);

    setProgress(42, 'Placing furniture…');

    /* DESK */
    {
      const deskWood = gloss(0x3a2010, { roughness: 0.45, metalness: 0.05 });
      const deskFrame = gloss(0x2c1a0c, { roughness: 0.5 });
      const DX = -0.3, DZ = -6.5;
      const top = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.1, 1.45), deskWood);
      top.position.set(DX, 1.08, DZ);
      top.castShadow = top.receiveShadow = true;
      scene.add(top);
      ([[DX - 1.5, 0.65], [DX + 1.5, 0.65], [DX - 1.5, -0.65], [DX + 1.5, -0.65]] as any[]).forEach(([x, zo]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.08, 0.07), deskFrame);
        leg.position.set(x, 0.54, DZ + zo);
        leg.castShadow = true;
        scene.add(leg);
      });
    }

    /* DESK LAMP */
    const lampGroup = new THREE.Group();
    {
      const LX = 0.7, LY = 1.13, LZ = -6.15;
      const metalMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.25, metalness: 0.85 });
      const shadeMat = new THREE.MeshStandardMaterial({ color: 0xffeecc, emissive: 0xffaa44, emissiveIntensity: 1.8, roughness: 0.55, side: THREE.DoubleSide });
      lampShadeMatRef.current = shadeMat;

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.04, 16), metalMat);
      base.castShadow = true;
      lampGroup.add(base);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.020, 0.74, 10), metalMat);
      pole.position.set(0, 0.39, 0);
      pole.castShadow = true;
      lampGroup.add(pole);
      const topJoint = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), metalMat);
      topJoint.position.set(0, 0.76, 0);
      lampGroup.add(topJoint);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.30, 10), metalMat);
      arm.rotation.x = Math.PI / 2;
      arm.position.set(0, 0.76, 0.15);
      arm.castShadow = true;
      lampGroup.add(arm);
      const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.18, 0.20, 20, 1, true), shadeMat);
      shade.position.set(0, 0.65, 0.30);
      lampGroup.add(shade);
      const shadeCap = new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 }));
      shadeCap.rotation.x = -Math.PI / 2;
      shadeCap.position.set(0, 0.75, 0.30);
      lampGroup.add(shadeCap);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffffee, emissive: 0xffffaa, emissiveIntensity: 3.0 }));
      bulb.position.set(0, 0.66, 0.30);
      lampGroup.add(bulb);
      lampBulbMeshRef.current = bulb;

      lampGroup.position.set(LX, LY, LZ);
      scene.add(lampGroup);
      lampGroup.traverse((c: any) => { if (c.isMesh) lampMeshesRef.current.push(c); });
    }

    /* LAPTOP */
    const laptopGroup = new THREE.Group();
    {
      const alum = gloss(0x2c2c36, { roughness: 0.28, metalness: 0.65 });
      const keyMat = mat(0x1e1e26, { roughness: 0.82 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.055, 0.68), alum);
      base.castShadow = true;
      laptopGroup.add(base);
      for (let i = 0; i < 5; i++) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.008, 0.012), mat(0x111118));
        slot.position.set(-0.28 + i * 0.14, 0.03, 0.32);
        laptopGroup.add(slot);
      }
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.91, 0.59, 0.028), alum);
      screen.position.set(0, 0.312, -0.325);
      screen.rotation.x = -Math.PI * 0.175;
      screen.castShadow = true;
      laptopGroup.add(screen);
      const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.50, 0.006), mat(0x0a0a12));
      bezel.position.set(0, 0.312, -0.31);
      bezel.rotation.x = -Math.PI * 0.175;
      laptopGroup.add(bezel);
      const dispMat = emMat(0x0d1f3c, 0x2244cc, 1.4);
      (dispMat as any)._baseIntensity = dispMat.emissiveIntensity;
      laptopScreenMatsRef.current.push(dispMat);
      const display = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.44, 0.004), dispMat);
      display.position.set(0, 0.312, -0.296);
      display.rotation.x = -Math.PI * 0.175;
      laptopGroup.add(display);
      const codeColors = [0x7c6af7, 0x5af778, 0xf7d96a, 0xf7916a, 0x55ccff, 0x7c6af7, 0x5af778];
      codeColors.forEach((col, i) => {
        const w = 0.12 + Math.random() * 0.25;
        const lm = emMat(col, col, 1.2);
        (lm as any)._baseIntensity = lm.emissiveIntensity;
        laptopScreenMatsRef.current.push(lm);
        const line = new THREE.Mesh(new THREE.BoxGeometry(w, 0.018, 0.002), lm);
        const indent = i % 3 === 0 ? 0.02 : i % 3 === 1 ? 0.06 : 0.1;
        line.position.set(-0.28 + indent + w / 2, 0.145 - i * 0.058 + 0.312, -0.284);
        line.rotation.x = -Math.PI * 0.175;
        laptopGroup.add(line);
      });
      const kbd = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.009, 0.52), keyMat);
      kbd.position.set(0, 0.032, 0.02);
      laptopGroup.add(kbd);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 12; col++) {
          const key = new THREE.Mesh(new THREE.BoxGeometry(0.054, 0.01, 0.044), mat(0x262632));
          key.position.set(-0.37 + col * 0.067, 0.04, -0.08 + row * 0.065);
          laptopGroup.add(key);
        }
      }
      const logo = new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), emMat(0xaaaacc, 0xffffff, 0.4));
      logo.position.set(0, 0.31, -0.34);
      logo.rotation.x = Math.PI * 0.825;
      laptopGroup.add(logo);
      const led = new THREE.Mesh(new THREE.CircleGeometry(0.008, 8), emMat(0x00ff88, 0x00ff88, 3));
      led.position.set(0.44, 0.032, 0.32);
      laptopGroup.add(led);
    }
    laptopGroup.position.set(-0.3, 1.135, -6.52);
    laptopGroup.rotation.y = Math.PI * 0.06;
    laptopGroup.scale.set(0.88, 0.88, 0.88);
    scene.add(laptopGroup);

    /* BOOKSHELF */
    const bookshelfGroup = new THREE.Group();
    {
      const wood = mat(0x9a7c4a, { roughness: 0.75 }), dark = mat(0x6b5638, { roughness: 0.78 });
      const makePanel = (w: number, h: number, d: number, x: number, y: number, z: number) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wood);
        m.position.set(x, y, z);
        m.castShadow = m.receiveShadow = true;
        bookshelfGroup.add(m);
      };
      makePanel(0.12, 3.2, 0.45, -0.73, 0, 0);
      makePanel(0.12, 3.2, 0.45, 0.73, 0, 0);
      makePanel(1.55, 0.12, 0.45, 0, -1.55, 0);
      makePanel(1.55, 0.12, 0.45, 0, 1.55, 0);
      makePanel(1.55, 0.08, 0.43, 0, -0.78, 0);
      makePanel(1.55, 0.08, 0.43, 0, 0.10, 0);
      makePanel(1.55, 0.08, 0.43, 0, 0.98, 0);
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.46, 3.1, 0.04), dark);
      back.position.set(0, 0, -0.20);
      bookshelfGroup.add(back);
      const bookPalette = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6, 0xe67e22, 0x1abc9c, 0xd35400, 0x27ae60, 0x8e44ad, 0xc0392b, 0x2980b9, 0xf1c40f, 0x16a085, 0x7f8c8d];
      let bi = 0;
      for (let row = 0; row < 3; row++) {
        const baseY = -1.48 + row * 0.88;
        let x = -0.62;
        while (x < 0.63) {
          const bw = 0.062 + Math.random() * 0.052, bh = 0.38 + Math.random() * 0.22;
          const tilted = Math.random() > 0.82;
          const book = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.30), mat(bookPalette[bi % bookPalette.length], { roughness: 0.85 }));
          book.position.set(x + bw / 2, baseY + bh / 2, 0.02);
          book.rotation.z = tilted ? (Math.random() - 0.5) * 0.25 : 0;
          book.castShadow = true;
          bookshelfGroup.add(book);
          const spine = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.7, bh * 0.15, 0.01), mat(0xffffff, { roughness: 0.95 }));
          spine.position.set(x + bw / 2, baseY + bh * 0.6, 0.162);
          bookshelfGroup.add(spine);
          x += bw + 0.008;
          bi++;
        }
      }
      const globeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.08, 8), mat(0x8a6030));
      globeBase.position.set(-0.45, 1.67, 0.04);
      bookshelfGroup.add(globeBase);
      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), mat(0x2255aa, { roughness: 0.5 }));
      globe.position.set(-0.45, 1.83, 0.04);
      bookshelfGroup.add(globe);
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.004, 4, 16), mat(0x88aaff));
        ring.position.set(-0.45, 1.83, 0.04);
        ring.rotation.y = (i / 3) * Math.PI;
        bookshelfGroup.add(ring);
      }
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.055, 0.13, 10), mat(0xcc7755));
      pot.position.set(0.5, 1.64, 0.04);
      bookshelfGroup.add(pot);
      const soil = new THREE.Mesh(new THREE.CircleGeometry(0.066, 10), mat(0x3d2b1f));
      soil.position.set(0.5, 1.706, 0.04);
      soil.rotation.x = -Math.PI / 2;
      bookshelfGroup.add(soil);
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.062, 6, 5), mat(0x228844, { roughness: 0.9 }));
        leaf.scale.set(0.6, 1.3, 0.6);
        leaf.position.set(0.5 + Math.sin(angle) * 0.06, 1.82 + Math.random() * 0.06, 0.04 + Math.cos(angle) * 0.06);
        leaf.castShadow = true;
        bookshelfGroup.add(leaf);
      }
      const trophy = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.14, 8), mat(0xf0c040, { roughness: 0.3, metalness: 0.8 }));
      trophy.position.set(0.15, 1.73, 0.04);
      bookshelfGroup.add(trophy);
      const star = new THREE.Mesh(new THREE.SphereGeometry(0.032, 6, 4), mat(0xf0c040, { roughness: 0.2, metalness: 0.9 }));
      star.position.set(0.15, 1.83, 0.04);
      bookshelfGroup.add(star);
      ([[-0.63, -2.15, -0.18], [-0.63, -2.15, 0.18], [0.63, -2.15, -0.18], [0.63, -2.15, 0.18]] as any[]).forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 0.08), wood);
        leg.position.set(x, y, z);
        leg.castShadow = leg.receiveShadow = true;
        bookshelfGroup.add(leg);
      });
    }
    bookshelfGroup.position.set(3.5, 1.85, -7.2);
    bookshelfGroup.scale.set(1.2, 1.2, 1.2);
    scene.add(bookshelfGroup);

    /* WALL FRAME */
    const wallFrameGroup = new THREE.Group();
    {
      const goldMat = gloss(0xd4a048, { roughness: 0.25, metalness: 0.7 });
      const frameW = 1.6, frameH = 1.15, thick = 0.07, depth = 0.055;
      ([[frameW + thick * 2, thick, depth, 0, frameH / 2 + thick / 2, 0], [frameW + thick * 2, thick, depth, 0, -frameH / 2 - thick / 2, 0], [thick, frameH, depth, -frameW / 2 - thick / 2, 0, 0], [thick, frameH, depth, frameW / 2 + thick / 2, 0, 0]] as any[]).forEach(([w, h, d, x, y]) => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), goldMat);
        bar.position.set(x, y, 0);
        bar.castShadow = true;
        wallFrameGroup.add(bar);
      });
      const canvas3d = new THREE.Mesh(new THREE.PlaneGeometry(frameW, frameH), new THREE.MeshStandardMaterial({ color: 0x18183a, roughness: 0.92 }));
      canvas3d.position.z = 0.015;
      wallFrameGroup.add(canvas3d);
      wfSkyMatRef.current = new THREE.MeshStandardMaterial({ color: 0x0a0a25, roughness: 0.9 });
      const skyGrad = new THREE.Mesh(new THREE.PlaneGeometry(frameW * 0.95, frameH * 0.95), wfSkyMatRef.current);
      skyGrad.position.z = 0.018;
      wallFrameGroup.add(skyGrad);
      const mountainPoints: [number, number][] = [[-0.78, -0.42], [0.78, -0.42], [0.78, -0.1], [0.55, -0.1], [0.4, -0.3], [0.22, -0.06], [0.05, -0.28], [-0.18, -0.02], [-0.38, -0.3], [-0.55, -0.1], [-0.78, -0.1]];
      const shape = new THREE.Shape();
      shape.moveTo(...mountainPoints[0]);
      mountainPoints.slice(1).forEach(p => shape.lineTo(...p));
      shape.closePath();
      wfMtnMatRef.current = new THREE.MeshStandardMaterial({ color: 0x1a1a40, roughness: 0.9 });
      const mtn = new THREE.Mesh(new THREE.ShapeGeometry(shape), wfMtnMatRef.current);
      mtn.position.z = 0.022;
      wallFrameGroup.add(mtn);
      wfMoonRef.current = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), new THREE.MeshStandardMaterial({ color: 0xfffde8, emissive: 0xffeeaa, emissiveIntensity: 0.6, transparent: true, opacity: 1 }));
      wfMoonRef.current.position.set(0.4, 0.28, 0.023);
      wallFrameGroup.add(wfMoonRef.current);
      wfSunRef.current = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), new THREE.MeshStandardMaterial({ color: 0xffee55, emissive: 0xffaa00, emissiveIntensity: 1.4, transparent: true, opacity: 0 }));
      wfSunRef.current.position.set(0.35, 0.28, 0.023);
      wfSunRef.current.visible = false;
      wallFrameGroup.add(wfSunRef.current);
      for (let i = 0; i < 18; i++) {
        const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8, transparent: true, opacity: 1 });
        const star = new THREE.Mesh(new THREE.CircleGeometry(0.008 + Math.random() * 0.007, 6), starMat);
        star.position.set((Math.random() - 0.5) * 1.4, Math.random() * 0.55 - 0.05, 0.024);
        wfStarsRef.current.push(star);
        wallFrameGroup.add(star);
      }
      for (let i = 0; i < 14; i++) {
        const bh = 0.06 + Math.random() * 0.16, bw = 0.04 + Math.random() * 0.06;
        const bldMat = new THREE.MeshStandardMaterial({ color: 0x0d0d28, roughness: 0.9 });
        wfBldMatsRef.current.push(bldMat);
        const bld = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.01), bldMat);
        bld.position.set(-0.62 + i * 0.095, -0.42 + bh / 2, 0.025);
        wallFrameGroup.add(bld);
        if (Math.random() > 0.4) {
          const winMat = new THREE.MeshStandardMaterial({ color: 0xffee88, emissive: 0xffdd44, emissiveIntensity: 1.5, transparent: true, opacity: 1 });
          wfWinMatsRef.current.push(winMat);
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.002), winMat);
          win.position.set(-0.62 + i * 0.095, -0.42 + bh * 0.6, 0.027);
          wallFrameGroup.add(win);
        }
      }
    }
    wallFrameGroup.position.set(-1.8, 4.0, -8.49);
    wallFrameGroup.scale.set(1.3, 1.3, 1.3);
    scene.add(wallFrameGroup);

    /* CHAIR */
    const chairGroup = new THREE.Group();
    {
      const seatMat = mat(0x1a1a24, { roughness: 0.8 }), chromeMat = gloss(0x888898, { metalness: 0.9, roughness: 0.15 });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.07, 0.55), seatMat);
      seat.position.y = 0.58;
      seat.castShadow = true;
      chairGroup.add(seat);
      const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.6, 0.06), seatMat);
      chairBack.position.set(0, 0.92, -0.24);
      chairBack.castShadow = true;
      chairGroup.add(chairBack);
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.06), seatMat);
      headrest.position.set(0, 1.27, -0.24);
      chairGroup.add(headrest);
      ([-0.34, 0.34] as number[]).forEach(x => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.36), seatMat);
        arm.position.set(x, 0.74, 0.03);
        chairGroup.add(arm);
        const sup = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.17, 8), chromeMat);
        sup.position.set(x, 0.65, 0.09);
        chairGroup.add(sup);
      });
      const lift = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.4, 10), chromeMat);
      lift.position.set(0, 0.2, 0);
      chairGroup.add(lift);
      for (let i = 0; i < 5; i++) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.04), chromeMat);
        spoke.rotation.y = (i / 5) * Math.PI * 2;
        spoke.position.y = 0.03;
        chairGroup.add(spoke);
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 8), mat(0x111111));
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(Math.sin((i / 5) * Math.PI * 2) * 0.19, 0.03, Math.cos((i / 5) * Math.PI * 2) * 0.19);
        chairGroup.add(wheel);
      }
    }
    chairGroup.position.set(1.6, 0, -2.2);
    chairGroup.rotation.y = -Math.PI * 0.18;
    chairGroup.scale.set(1.18, 1.18, 1.18);
    scene.add(chairGroup);

    /* CHARACTER */
    const characterGroup = new THREE.Group();
    {
      const skin = mat(0xffccaa), shirt = mat(0x3a3acc, { roughness: 0.8 });
      const pants = mat(0x223355, { roughness: 0.85 }), hair = mat(0x1a0f05);
      const shoe = mat(0x111111), glass = gloss(0x222233, { metalness: 0.85, roughness: 0.08 });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.46, 0.22), shirt);
      torso.position.set(0, 0.87, 0.02);
      torso.castShadow = true;
      characterGroup.add(torso);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.30, 0.012), mat(0x5555dd));
      stripe.position.set(0, 0.87, 0.117);
      characterGroup.add(stripe);
      const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.012), mat(0xfafafa));
      collarL.position.set(-0.05, 1.09, 0.116);
      collarL.rotation.z = 0.35;
      characterGroup.add(collarL);
      const collarR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.012), mat(0xfafafa));
      collarR.position.set(0.05, 1.09, 0.116);
      collarR.rotation.z = -0.35;
      characterGroup.add(collarR);

      ([-0.11, 0.11] as number[]).forEach(lx => {
        const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.38), pants);
        thigh.position.set(lx, 0.64, 0.19);
        thigh.castShadow = true;
        characterGroup.add(thigh);
        const calf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.13), pants);
        calf.position.set(lx, 0.40, 0.38);
        calf.castShadow = true;
        characterGroup.add(calf);
        const shoe2 = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.22), shoe);
        shoe2.position.set(lx, 0.14, 0.47);
        characterGroup.add(shoe2);
      });

      ([-0.21, 0.21] as number[]).forEach(ax => {
        const side = ax < 0 ? -1 : 1;
        const uArm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.28, 0.11), shirt);
        uArm.position.set(ax, 0.96, 0.04);
        uArm.rotation.z = side * 0.22;
        uArm.rotation.x = -0.55;
        uArm.castShadow = true;
        characterGroup.add(uArm);
        const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.058, 8, 6), shirt);
        elbow.position.set(ax, 0.841, 0.113);
        characterGroup.add(elbow);
        const fore = new THREE.Mesh(new THREE.BoxGeometry(0.088, 0.21, 0.088), skin);
        fore.position.set(ax * 0.89, 0.766, 0.184);
        fore.rotation.x = 2.38;
        fore.rotation.z = -side * 0.10;
        characterGroup.add(fore);
        const hand = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.036, 0.085), skin);
        hand.position.set(ax * 0.78, 0.690, 0.255);
        characterGroup.add(hand);
        for (let f = 0; f < 4; f++) {
          const fing = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 0.034), skin);
          fing.position.set(ax * 0.78 + (f - 1.5) * 0.020, 0.690, 0.296);
          characterGroup.add(fing);
        }
      });

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.060, 0.09, 10), skin);
      neck.position.set(0, 1.145, 0.02);
      characterGroup.add(neck);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.225, 0.20), skin);
      head.position.set(0, 1.305, 0.02);
      head.castShadow = true;
      characterGroup.add(head);

      const eyeY = 1.315;
      ([-0.056, 0.056] as number[]).forEach(ex => {
        const brow = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.010, 0.006), mat(0x1a0f05));
        brow.position.set(ex, eyeY + 0.022, 0.124);
        characterGroup.add(brow);
        const sclera = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.030, 0.006), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }));
        sclera.position.set(ex, eyeY, 0.128);
        characterGroup.add(sclera);
        const iris = new THREE.Mesh(new THREE.CircleGeometry(0.013, 12), new THREE.MeshStandardMaterial({ color: 0x1a1a2e }));
        iris.position.set(ex, eyeY, 0.132);
        characterGroup.add(iris);
        const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.007, 10), new THREE.MeshStandardMaterial({ color: 0x050508 }));
        pupil.position.set(ex, eyeY, 0.133);
        characterGroup.add(pupil);
        const shine = new THREE.Mesh(new THREE.CircleGeometry(0.004, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0 }));
        shine.position.set(ex + 0.006, eyeY + 0.006, 0.134);
        characterGroup.add(shine);
      });

      ([-0.108, 0.108] as number[]).forEach(ex => {
        const ear = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.048, 0.042), skin);
        ear.position.set(ex, 1.30, 0.02);
        characterGroup.add(ear);
      });

      const hairCap = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.085, 0.21), hair);
      hairCap.position.set(0, 1.455, 0.01);
      characterGroup.add(hairCap);
      ([-0.10, 0.10] as number[]).forEach(hx => {
        const side2 = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.14, 0.18), hair);
        side2.position.set(hx, 1.36, 0.01);
        characterGroup.add(side2);
      });
      const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.04), hair);
      fringe.position.set(0, 1.41, 0.105);
      characterGroup.add(fringe);

      ([-0.054, 0.054] as number[]).forEach(gx => {
        const lens = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.007, 7, 18), glass);
        lens.position.set(gx, 1.30, 0.112);
        characterGroup.add(lens);
        const fill = new THREE.Mesh(new THREE.CircleGeometry(0.022, 16), new THREE.MeshStandardMaterial({ color: 0x88aacc, transparent: true, opacity: 0.35, roughness: 0.1 }));
        fill.position.set(gx, 1.30, 0.114);
        characterGroup.add(fill);
      });
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.007, 0.005), glass);
      bridge.position.set(0, 1.30, 0.113);
      characterGroup.add(bridge);
      ([-0.08, 0.08] as number[]).forEach(tx => {
        const temple = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.006, 0.09), glass);
        temple.position.set(tx, 1.30, 0.067);
        characterGroup.add(temple);
      });

      ([-0.11, 0.11] as number[]).forEach(hpx => {
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.022, 10), mat(0x1a1a22));
        cup.rotation.z = Math.PI / 2;
        cup.position.set(hpx, 1.345, 0.02);
        characterGroup.add(cup);
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.033, 0.008, 10), mat(0x111118));
        pad.rotation.z = Math.PI / 2;
        pad.position.set(hpx * 1.06, 1.345, 0.02);
        characterGroup.add(pad);
      });
      const hpBand = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.010, 7, 20, Math.PI), mat(0x1a1a22));
      hpBand.position.set(0, 1.38, 0.02);
      hpBand.rotation.z = Math.PI / 2;
      characterGroup.add(hpBand);

      const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.032, 0.30), gloss(0x2c2c36, { metalness: 0.6 }));
      lapBase.position.set(0, 0.66, 0.19);
      lapBase.rotation.x = -0.08;
      lapBase.castShadow = true;
      characterGroup.add(lapBase);
      const lapScreen = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.27, 0.016), gloss(0x2c2c36, { metalness: 0.6 }));
      lapScreen.position.set(0, 0.86, 0.01);
      lapScreen.rotation.x = -1.05;
      characterGroup.add(lapScreen);
      const lapDispMat = emMat(0x0d1f3c, 0x2244ee, 0.9);
      (lapDispMat as any)._baseIntensity = lapDispMat.emissiveIntensity;
      laptopScreenMatsRef.current.push(lapDispMat);
      const lapDisplay = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.21, 0.006), lapDispMat);
      lapDisplay.position.set(0, 0.86, 0.022);
      lapDisplay.rotation.x = -1.05;
      characterGroup.add(lapDisplay);
      [0xf7916a, 0x5af778, 0x7c6af7, 0xffee88, 0x55ccff].forEach((col, i) => {
        const w = 0.055 + Math.random() * 0.10;
        const indent = (i % 3) * 0.022;
        const clm = emMat(col, col, 1.5);
        (clm as any)._baseIntensity = clm.emissiveIntensity;
        laptopScreenMatsRef.current.push(clm);
        const cl = new THREE.Mesh(new THREE.BoxGeometry(w, 0.013, 0.002), clm);
        cl.position.set(-0.08 + indent + w / 2, 0.88 + 0.04 - i * 0.038, 0.034);
        cl.rotation.x = -1.05;
        characterGroup.add(cl);
      });
    }
    characterGroup.position.set(1.6, 0, -2.2);
    characterGroup.rotation.y = -Math.PI * 0.18;
    characterGroup.scale.set(1.18, 1.18, 1.18);
    scene.add(characterGroup);
    characterGroupRef.current = characterGroup;

    /* BED */
    const BED_X = -3.5, BED_Z = -7.1, BED_W = 2.2, BED_L = 2.9;
    {
      const bedWood = gloss(0x2e1a0e, { roughness: 0.48, metalness: 0.06 });
      const mattressMat = mat(0xcec0aa, { roughness: 0.88 });
      const blanketBase = mat(0x1e2d50, { roughness: 0.92 });
      const blanketFoldMat = mat(0x2a3f6a, { roughness: 0.88 });
      const bedGroup = new THREE.Group();

      ([[BED_W / 2 - 0.06, BED_L / 2 - 0.07], [-BED_W / 2 + 0.06, BED_L / 2 - 0.07], [BED_W / 2 - 0.06, -BED_L / 2 + 0.07], [-BED_W / 2 + 0.06, -BED_L / 2 + 0.07]] as any[]).forEach(([ox, oz]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.36, 0.07), bedWood);
        leg.position.set(ox, 0.18, oz);
        leg.castShadow = true;
        bedGroup.add(leg);
      });
      ([-BED_W / 2 + 0.04, BED_W / 2 - 0.04] as number[]).forEach(ox => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.20, BED_L - 0.14), bedWood);
        rail.position.set(ox, 0.22, 0);
        rail.castShadow = true;
        bedGroup.add(rail);
      });
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(BED_W - 0.09, 0.22, BED_L - 0.04), mattressMat);
      mattress.position.set(0, 0.41, 0);
      mattress.receiveShadow = mattress.castShadow = true;
      bedGroup.add(mattress);
      const headboard = new THREE.Mesh(new THREE.BoxGeometry(BED_W + 0.12, 0.75, 0.10), bedWood);
      headboard.position.set(0, 0.58, -BED_L / 2 - 0.05);
      headboard.castShadow = true;
      bedGroup.add(headboard);
      const headTop = new THREE.Mesh(new THREE.BoxGeometry(BED_W + 0.12, 0.09, 0.14), bedWood);
      headTop.position.set(0, 0.97, -BED_L / 2 - 0.05);
      bedGroup.add(headTop);
      for (let i = 0; i < 4; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.62, 0.07), bedWood);
        slat.position.set(-BED_W / 2 + 0.32 + i * (BED_W - 0.30) / 3, 0.58, -BED_L / 2 - 0.04);
        bedGroup.add(slat);
      }
      const footboard = new THREE.Mesh(new THREE.BoxGeometry(BED_W + 0.12, 0.34, 0.08), bedWood);
      footboard.position.set(0, 0.38, BED_L / 2 + 0.04);
      footboard.castShadow = true;
      bedGroup.add(footboard);
      ([-0.34, 0.34] as number[]).forEach(px => {
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.11, 0.38), mat(0xf5f0e8, { roughness: 0.85 }));
        pillow.position.set(px, 0.55, -BED_L / 2 + 0.27);
        bedGroup.add(pillow);
      });
      const blanket = new THREE.Mesh(new THREE.BoxGeometry(BED_W - 0.09, 0.13, BED_L - 0.55), blanketBase);
      blanket.position.set(0, 0.55, 0.16);
      blanket.castShadow = true;
      bedGroup.add(blanket);
      const fold = new THREE.Mesh(new THREE.BoxGeometry(BED_W - 0.09, 0.07, 0.24), blanketFoldMat);
      fold.position.set(0, 0.61, -BED_L / 2 + 0.57);
      bedGroup.add(fold);

      // Sleeping body lump
      const bedBodyLump = new THREE.Group();
      const BSY = 0.52, HZ = -BED_L / 2 + 0.26, S = 1.18;
      const _skin = mat(0xf0c090, { roughness: 0.75 }), _hair = mat(0x1a1008, { roughness: 0.85 });
      const _shirt = mat(0x3a3acc, { roughness: 0.8 }), _blkA = mat(0x1c2e55, { roughness: 0.90 }), _blkB = mat(0x253e6e, { roughness: 0.88 });
      const blkUpper = new THREE.Mesh(new THREE.BoxGeometry(BED_W - 0.08, 0.26, 1.22), _blkA);
      blkUpper.position.set(0, BSY + 0.18, -BED_L / 2 + 1.16);
      bedBodyLump.add(blkUpper);
      const blkMid = new THREE.Mesh(new THREE.BoxGeometry(BED_W - 0.08, 0.20, 0.93), _blkA);
      blkMid.position.set(0, BSY + 0.15, -BED_L / 2 + 2.26);
      bedBodyLump.add(blkMid);
      const blkLow = new THREE.Mesh(new THREE.BoxGeometry(BED_W - 0.08, 0.12, 0.52), _blkA);
      blkLow.position.set(0, BSY + 0.10, BED_L / 2 - 0.21);
      bedBodyLump.add(blkLow);
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.09, 1.30), _blkB);
      ridge.position.set(0, BSY + 0.25, -BED_L / 2 + 1.35);
      bedBodyLump.add(ridge);
      const chest = new THREE.Mesh(new THREE.BoxGeometry(0.45 * S, 0.15, 0.28 * S), _shirt);
      chest.position.set(0, BSY + 0.25, HZ + 0.40 * S);
      bedBodyLump.add(chest);
      const headBox = new THREE.Mesh(new THREE.BoxGeometry(0.26 * S, 0.19, 0.28 * S), _skin);
      headBox.position.set(0, BSY + 0.16, HZ);
      bedBodyLump.add(headBox);
      const hairMain = new THREE.Mesh(new THREE.BoxGeometry(0.27 * S, 0.08, 0.22 * S), _hair);
      hairMain.position.set(0, BSY + 0.225, HZ - 0.045);
      bedBodyLump.add(hairMain);
      bedBodyLump.visible = false;
      bedGroup.add(bedBodyLump);
      bedGroup.position.set(BED_X, 0, BED_Z);
      scene.add(bedGroup);
      bedBodyLumpRef.current = bedBodyLump;
    }

    /* Moonlight */
    const nightLightPt = new THREE.SpotLight(0x8899bb, 0, 11, Math.PI * 0.14, 0.6, 1.5);
    nightLightPt.position.set(-4.7, 3.0, -5.8);
    nightLightPt.target.position.set(BED_X, 0.5, BED_Z);
    nightLightPt.castShadow = false;
    scene.add(nightLightPt);
    scene.add(nightLightPt.target);
    nightLightPtRef.current = nightLightPt;
    {
      const poolMat = new THREE.MeshBasicMaterial({ color: 0x99aacc, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const pool = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.8), poolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.rotation.z = Math.PI * 0.12;
      pool.position.set(BED_X + 0.2, 0.01, BED_Z + 0.3);
      scene.add(pool);
      const bedMat = new THREE.MeshBasicMaterial({ color: 0xaabbee, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const bedPool = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.4), bedMat);
      bedPool.rotation.x = -Math.PI / 2;
      bedPool.rotation.z = Math.PI * 0.12;
      bedPool.position.set(BED_X + 0.1, 0.53, BED_Z + 0.2);
      scene.add(bedPool);
      nightLightPt.userData.poolMat = poolMat;
      nightLightPt.userData.bedPoolMat = bedMat;
    }

    /* Sleep state machine */
    const DESK_POS = new THREE.Vector3(1.6, 0, -2.2), DESK_ROT_Y = -Math.PI * 0.18;
    const BED_ENTRY = new THREE.Vector3(BED_X + 0.95, 0, BED_Z + 0.55), BED_ROT_Y = Math.PI * 0.55;
    {
      const h = new Date().getHours();
      if (h >= 23 || h < 7) {
        charStateRef.current = 'sleeping';
        if (characterGroupRef.current) characterGroupRef.current.visible = false;
        if (bedBodyLumpRef.current) bedBodyLumpRef.current.visible = true;
      }
    }

    function startGoingToBed() {
      if (charStateRef.current !== 'sitting' || !characterGroupRef.current || !bedBodyLumpRef.current) return;
      charStateRef.current = 'going_to_bed';
      const proxy = { px: characterGroupRef.current.position.x, pz: characterGroupRef.current.position.z, ry: characterGroupRef.current.rotation.y };
      gsap.to(proxy, {
        px: BED_ENTRY.x, pz: BED_ENTRY.z, ry: BED_ROT_Y, duration: 2.6, ease: 'power2.inOut',
        onUpdate() {
          if (characterGroupRef.current) {
            characterGroupRef.current.position.set(proxy.px, 0, proxy.pz);
            characterGroupRef.current.rotation.y = proxy.ry;
          }
        },
        onComplete() {
          if (characterGroupRef.current) characterGroupRef.current.visible = false;
          if (bedBodyLumpRef.current) bedBodyLumpRef.current.visible = true;
          charStateRef.current = 'sleeping';
        }
      });
    }

    function startWakingUp() {
      if (charStateRef.current !== 'sleeping' || !characterGroupRef.current || !bedBodyLumpRef.current) return;
      charStateRef.current = 'waking_up';
      bedBodyLumpRef.current.visible = false;
      characterGroupRef.current.position.copy(BED_ENTRY);
      characterGroupRef.current.rotation.y = BED_ROT_Y;
      characterGroupRef.current.visible = true;
      const proxy = { px: BED_ENTRY.x, pz: BED_ENTRY.z, ry: BED_ROT_Y };
      gsap.to(proxy, {
        px: DESK_POS.x, pz: DESK_POS.z, ry: DESK_ROT_Y, duration: 2.6, ease: 'power2.inOut',
        onUpdate() {
          if (characterGroupRef.current) {
            characterGroupRef.current.position.set(proxy.px, 0, proxy.pz);
            characterGroupRef.current.rotation.y = proxy.ry;
          }
        },
        onComplete() {
          charStateRef.current = 'sitting';
        }
      });
    }

    setProgress(60, 'Hanging clock…');

    /* WALL CLOCK */
    const clockGroup = new THREE.Group();
    const handMat = new THREE.MeshStandardMaterial({ color: 0x111122 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xe84040 });
    const clockBody = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.065, 52), gloss(0x1a1a32, { roughness: 0.18, metalness: 0.6 }));
    clockBody.rotation.x = Math.PI / 2;
    clockGroup.add(clockBody);
    const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.325, 52), new THREE.MeshStandardMaterial({ color: 0xf2f0e8, roughness: 0.95 }));
    clockFace.position.z = 0.035;
    clockGroup.add(clockFace);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.335, 0.026, 10, 52), gloss(0x999ab0, { metalness: 0.85, roughness: 0.18 }));
    rim.position.z = 0.028;
    clockGroup.add(rim);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, big = i % 3 === 0;
      const mark = new THREE.Mesh(new THREE.BoxGeometry(big ? 0.025 : 0.014, big ? 0.065 : 0.042, 0.01), new THREE.MeshStandardMaterial({ color: 0x1a1a2e }));
      mark.position.set(Math.sin(a) * 0.265, Math.cos(a) * 0.265, 0.04);
      mark.rotation.z = -a;
      clockGroup.add(mark);
    }
    function makeHand(w: number, len: number, m: THREE.Material, zOff: number) {
      const pivot = new THREE.Group();
      pivot.position.z = zOff;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.011), m);
      mesh.position.y = len / 2;
      pivot.add(mesh);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(w * 1.1, len * 0.22, 0.011), m);
      tail.position.y = -(len * 0.22) / 2;
      pivot.add(tail);
      return pivot;
    }
    hourPivotRef.current = makeHand(0.019, 0.16, handMat, 0.048);
    minPivotRef.current = makeHand(0.013, 0.23, handMat, 0.055);
    secPivotRef.current = makeHand(0.008, 0.27, redMat, 0.062);
    clockGroup.add(hourPivotRef.current, minPivotRef.current, secPivotRef.current);
    const pin = new THREE.Mesh(new THREE.CircleGeometry(0.02, 14), redMat.clone());
    pin.position.z = 0.068;
    clockGroup.add(pin);
    clockGroup.position.set(0.8, 4.4, -8.49);
    scene.add(clockGroup);

    /* PARTICLES */
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(PARTICLE_COUNT.current * 3);
    for (let i = 0; i < PARTICLE_COUNT.current; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 9;
      particlePos[i * 3 + 1] = Math.random() * 5.5 + 0.5;
      particlePos[i * 3 + 2] = Math.random() * -8 - 0.3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    scene.add(new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0x9aafff, size: 0.042, sizeAttenuation: true, transparent: true, opacity: 0.55, depthWrite: false })));
    particleGeoRef.current = particleGeo;

    /* Corner plants */
    function buildPlant(s: number) {
      const g = new THREE.Group();
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * s, 0.14 * s, 0.28 * s, 10), mat(0xaa6633));
      pot.castShadow = true;
      g.add(pot);
      const soil = new THREE.Mesh(new THREE.CircleGeometry(0.175 * s, 10), mat(0x3a2310));
      soil.rotation.x = -Math.PI / 2;
      soil.position.y = 0.142 * s;
      g.add(soil);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2, h = 0.3 + Math.random() * 0.28;
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.14 * s, 7, 5), mat(0x228844, { roughness: 0.88 }));
        leaf.scale.set(0.55, h / 0.28, 0.55);
        leaf.position.set(Math.sin(a) * 0.12 * s, (0.45 + h * 0.2) * s, Math.cos(a) * 0.12 * s);
        leaf.castShadow = true;
        g.add(leaf);
      }
      return g;
    }
    const plant1 = buildPlant(1.2);
    plant1.position.set(-4.6, 0, -1.5);
    scene.add(plant1);
    const plant2 = buildPlant(0.9);
    plant2.position.set(4.5, 0, -6.5);
    scene.add(plant2);

    /* Coffee mug */
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.12, 12), mat(0xf0f0f0));
    mug.position.set(-1.0, 1.19, -6.55);
    mug.castShadow = true;
    scene.add(mug);
    const mugLiq = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), mat(0x3a1800));
    mugLiq.rotation.x = -Math.PI / 2;
    mugLiq.position.set(-1.0, 1.252, -6.55);
    scene.add(mugLiq);
    const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.014, 7, 14, Math.PI), mat(0xf0f0f0));
    mugHandle.position.set(-0.935, 1.19, -6.55);
    mugHandle.rotation.y = Math.PI / 2;
    scene.add(mugHandle);

    /* Sticky notes */
    ([[0xffee44, -2.2], [0xff9999, 0.0], [0xaaffaa, 2.2]] as any[]).forEach(([col, px]) => {
      const note = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.015), mat(col, { roughness: 0.9 }));
      note.position.set(px, 2.1, -8.47);
      note.rotation.z = (Math.random() - 0.5) * 0.1;
      scene.add(note);
      for (let r = 0; r < 3; r++) {
        const ln = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.014, 0.002), mat(0x33333333));
        ln.position.set(px, 2.18 - r * 0.07, -8.46);
        scene.add(ln);
      }
    });

    setProgress(86, 'Wiring interactions…');

    /* FLOATING LABELS */
    labelDefsRef.current = [
      { key: 'laptop', mesh: laptopGroup, icon: '💻', text: 'Projects', offset: new THREE.Vector3(0, 0.7, 0) },
      { key: 'bookshelf', mesh: bookshelfGroup, icon: '📚', text: 'Skills', offset: new THREE.Vector3(0, 2.3, 0) },
      { key: 'frame', mesh: wallFrameGroup, icon: '🖼️', text: 'About Me', offset: new THREE.Vector3(0, 1.0, 0) },
      { key: 'character', mesh: characterGroup, icon: '🛏️', text: 'Contact', offset: new THREE.Vector3(0, 2.0, 0), getMesh: () => charStateRef.current === 'sleeping' ? bedBodyLumpRef.current : characterGroupRef.current },
    ];

    if (labelsRef.current) {
      labelDefsRef.current.forEach(def => {
        const div = document.createElement('div');
        div.className = styles.sceneLabel;
        div.innerHTML = `<span class="${styles.labelEmoji}">${def.icon}</span><span class="${styles.labelText}">${def.text}</span>`;
        if ('ontouchstart' in window) {
          div.style.pointerEvents = 'auto';
          div.addEventListener('click', (e: Event) => {
            e.stopPropagation();
            const obj = interactiveObjectsRef.current.find((o: any) => o.key === def.key);
            if (obj && focusObjectFnRef.current) focusObjectFnRef.current(obj);
          });
        }
        labelsRef.current!.appendChild(div);
        labelElsRef.current[def.key] = div;
      });
    }

    /* INTERACTIVE OBJECTS MAP */
    interactiveObjectsRef.current = [
      { mesh: laptopGroup, key: 'laptop', camPos: new THREE.Vector3(-0.1, 2.1, -4.5), camTarget: new THREE.Vector3(-0.3, 1.2, -6.5) },
      { mesh: bookshelfGroup, key: 'bookshelf', camPos: new THREE.Vector3(1.6, 2.4, -5.5), camTarget: new THREE.Vector3(3.5, 2.0, -7.2) },
      { mesh: wallFrameGroup, key: 'frame', camPos: new THREE.Vector3(-1.7, 4.0, -6.5), camTarget: new THREE.Vector3(-1.8, 4.0, -8.5) },
      {
        mesh: characterGroup, key: 'character', camPos: new THREE.Vector3(-2.5, 2.0, -5.0), camTarget: new THREE.Vector3(-3.5, 0.5, -7.1),
        getMesh: () => charStateRef.current === 'sleeping' ? bedBodyLumpRef.current : characterGroupRef.current,
        getCamPos: () => charStateRef.current === 'sleeping' ? new THREE.Vector3(-2.5, 2.0, -5.0) : new THREE.Vector3(-0.2, 2.0, 0.8),
        getCamTarget: () => charStateRef.current === 'sleeping' ? new THREE.Vector3(-3.5, 0.5, -7.1) : new THREE.Vector3(1.6, 0.8, -2.2)
      },
    ];

    const bedBodyMeshes = new Set<THREE.Object3D>();
    const meshToObject = new Map<THREE.Object3D, any>();
    function getAllMeshes(obj: THREE.Object3D) { const out: THREE.Object3D[] = []; obj.traverse((c: any) => { if (c.isMesh) out.push(c); }); return out; }

    interactiveObjectsRef.current.forEach(o => getAllMeshes(o.mesh).forEach(m => { allInteractiveMeshesRef.current.push(m); meshToObject.set(m, o); }));
    if (bedBodyLumpRef.current) {
      bedBodyLumpRef.current.traverse((c: any) => {
        if (c.isMesh) {
          allInteractiveMeshesRef.current.push(c);
          meshToObject.set(c, interactiveObjectsRef.current.find(o => o.key === 'character'));
          bedBodyMeshes.add(c);
        }
      });
    }

    function resolveHit(mesh: THREE.Object3D) {
      if (bedBodyMeshes.has(mesh) && charStateRef.current !== 'sleeping') return null;
      return meshToObject.get(mesh) ?? null;
    }

    function setEmissive(group: THREE.Object3D, color: number, intensity: number) {
      group.traverse((c: any) => {
        if (!c.isMesh) return;
        (Array.isArray(c.material) ? c.material : [c.material]).forEach((m: any) => {
          if (m.emissive) {
            m.emissive.set(color);
            m.emissiveIntensity = intensity;
          }
        });
      });
    }

    function clearEmissive(group: THREE.Object3D) { setEmissive(group, 0x000000, 0); }

    /* LIGHTING UPDATE */
    function updateRoomLighting(now: Date) {
      const h24 = now.getHours() + now.getMinutes() / 60;
      let dayT = h24 < 5 ? 0 : h24 < 7 ? (h24 - 5) / 2 : h24 < 18 ? 1 : h24 < 20 ? 1 - (h24 - 18) / 2 : 0;
      const glowT = (h24 >= 5 && h24 < 8) ? Math.sin(((h24 - 5) / 3) * Math.PI) : (h24 >= 17 && h24 < 20) ? Math.sin(((h24 - 17) / 3) * Math.PI) : 0;

      if (ambientRef.current) {
        ambientRef.current.color.lerpColors(new THREE.Color(0x1a1b38), new THREE.Color(0xc8d0ff), dayT);
        if (glowT > 0) ambientRef.current.color.lerp(new THREE.Color(0x6b3318), glowT * 0.4);
        ambientRef.current.intensity = 1.2 + dayT * 0.8;
      }

      if (dirLightRef.current) {
        dirLightRef.current.color.lerpColors(new THREE.Color(0x1a2650), new THREE.Color(0xfff8f0), dayT);
        if (glowT > 0) dirLightRef.current.color.lerp(new THREE.Color(0xff7722), glowT * 0.7);
        dirLightRef.current.intensity = 0.6 + dayT * 2.2;
      }

      const moonColor = new THREE.Color(0x8899cc);
      const paneColor = new THREE.Color(0x1a2244).lerp(new THREE.Color(0x6699cc), dayT);
      if (glowT > 0) paneColor.lerp(new THREE.Color(0xdd5500), glowT * 0.65);
      winPaneMatsRef.current.forEach(m => { m.color.copy(paneColor); m.emissive.copy(dayT < 0.1 ? moonColor : paneColor); m.emissiveIntensity = dayT < 0.1 ? 0.55 : 0.05 + dayT * 0.5 + glowT * 0.35; });

      if (winLightRef.current) {
        winLightRef.current.color.lerpColors(moonColor, new THREE.Color(0xaaccff), dayT);
        if (glowT > 0) winLightRef.current.color.lerp(new THREE.Color(0xff8844), glowT * 0.6);
        winLightRef.current.intensity = 0.55 * (1 - dayT) + 0.05 + dayT * 1.15 + glowT * 0.4;
      }

      if (fillLeftRef.current) {
        fillLeftRef.current.color.lerpColors(new THREE.Color(0x3355aa), new THREE.Color(0x88aaff), dayT);
        fillLeftRef.current.intensity = 0.9 + dayT * 0.6;
      }
      if (fillRightRef.current) fillRightRef.current.intensity = 1.0 + dayT * 0.4;
      if (ceilBounceRef.current) ceilBounceRef.current.intensity = 0.8 + dayT * 0.5;
      if (charLightRef.current) charLightRef.current.intensity = 2.5 - dayT * 0.5;
      deskGlowBaseRef.current = 4.0 - dayT * 0.9;
      lampLightBaseRef.current = lampOnRef.current ? (9.0 - dayT * 1.5) : 0;
      if (ceilPanelRef.current?.material) (ceilPanelRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2 - dayT * 0.2;

      const nightT = Math.max(0, 1 - dayT * 2.5);
      if (nightLightPtRef.current) {
        nightLightPtRef.current.intensity = nightT * 2.2;
        if (nightLightPtRef.current.userData.poolMat) { nightLightPtRef.current.userData.poolMat.opacity = nightT * 0.12; }
        if (nightLightPtRef.current.userData.bedPoolMat) { nightLightPtRef.current.userData.bedPoolMat.opacity = nightT * 0.22; }
      }

      const screenOn = h24 >= 7 && h24 < 23;
      laptopScreenMatsRef.current.forEach((m: any) => { m.emissiveIntensity = screenOn ? (m._baseIntensity ?? 1.2) : 0; });

      updateClock(now.getHours(), now.getMinutes(), dayT);
    }

    function updateWallFrameTime(now: Date) {
      const h24 = now.getHours() + now.getMinutes() / 60;
      let dayT = h24 < 5 ? 0 : h24 < 7 ? (h24 - 5) / 2 : h24 < 18 ? 1 : h24 < 20 ? 1 - (h24 - 18) / 2 : 0;
      const glowT = (h24 >= 5 && h24 < 8) ? Math.sin(((h24 - 5) / 3) * Math.PI) : (h24 >= 17 && h24 < 20) ? Math.sin(((h24 - 17) / 3) * Math.PI) : 0;
      const skyColor = new THREE.Color(0x0a0a25).lerp(new THREE.Color(0x2277bb), dayT);
      if (glowT > 0) skyColor.lerp(new THREE.Color(0xcc5511), glowT * 0.6);
      if (wfSkyMatRef.current) wfSkyMatRef.current.color.copy(skyColor);
      if (wfMtnMatRef.current) wfMtnMatRef.current.color.lerpColors(new THREE.Color(0x1a1a40), new THREE.Color(0x1e3e18), dayT);

      const moonAlpha = Math.max(0, 1 - dayT * 2.5);
      if (wfMoonRef.current) {
        wfMoonRef.current.visible = moonAlpha > 0.02;
        (wfMoonRef.current.material as THREE.MeshStandardMaterial).opacity = moonAlpha;
      }

      const sunAlpha = Math.min(1, dayT * 3);
      if (wfSunRef.current) {
        wfSunRef.current.visible = sunAlpha > 0.02;
        (wfSunRef.current.material as THREE.MeshStandardMaterial).opacity = sunAlpha;
      }

      const sunAngle = Math.max(0, Math.min(Math.PI, ((h24 - 6) / 12) * Math.PI));
      if (wfSunRef.current) {
        wfSunRef.current.position.x = 0.48 * Math.cos(Math.PI - sunAngle);
        wfSunRef.current.position.y = 0.38 * Math.sin(sunAngle) + 0.04;
      }

      const zenithT = Math.sin(sunAngle);
      if (wfSunRef.current?.material) {
        (wfSunRef.current.material as THREE.MeshStandardMaterial).color.lerpColors(new THREE.Color(0xff8800), new THREE.Color(0xffee88), zenithT);
        (wfSunRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0 + zenithT * 0.6;
      }

      const starAlpha = Math.max(0, 1 - dayT * 3);
      wfStarsRef.current.forEach(s => {
        s.visible = starAlpha > 0.02;
        (s.material as THREE.MeshStandardMaterial).opacity = starAlpha;
      });

      wfWinMatsRef.current.forEach(m => {
        m.emissiveIntensity = Math.max(0, 1.5 - dayT * 1.8);
        m.opacity = Math.max(0.1, 1 - dayT * 0.6);
      });
      wfBldMatsRef.current.forEach(m => m.color.lerpColors(new THREE.Color(0x0d0d28), new THREE.Color(0x2d2d50), dayT));
    }

    /* CLOCK TICK */
    let simTime: Date | null = null;
    (window as any).setSimHour = (h: number, m = 0) => {
      simTime = new Date(2024, 0, 1, h, m, 0);
      charStateRef.current = 'sitting';
      if (characterGroupRef.current) {
        characterGroupRef.current.visible = true;
        characterGroupRef.current.position.copy(DESK_POS);
        characterGroupRef.current.rotation.y = DESK_ROT_Y;
      }
      if (bedBodyLumpRef.current) bedBodyLumpRef.current.visible = false;
    };

    function tickScene() {
      const now = simTime ? new Date(simTime) : new Date();
      const h = now.getHours() % 12, m = now.getMinutes(), s = now.getSeconds(), ms = now.getMilliseconds();
      if (secPivotRef.current) secPivotRef.current.rotation.z = -((s + ms / 1000) / 60) * Math.PI * 2;
      if (minPivotRef.current) minPivotRef.current.rotation.z = -((m + (s + ms / 1000) / 60) / 60) * Math.PI * 2;
      if (hourPivotRef.current) hourPivotRef.current.rotation.z = -((h + m / 60) / 12) * Math.PI * 2;
      updateWallFrameTime(now);
      updateRoomLighting(now);
      const h24 = now.getHours() + now.getMinutes() / 60;
      if (h24 >= 23 && charStateRef.current === 'sitting') startGoingToBed();
      if (h24 >= 7 && h24 < 23 && charStateRef.current === 'sleeping') startWakingUp();
    }

    /* RAYCASTING + INTERACTIONS */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let lastTouchEndTime = 0;

    function updatePointer(e: MouseEvent | Touch) {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    function animateCamera(toPos: THREE.Vector3, toTarget: THREE.Vector3, onComplete?: () => void) {
      isAnimatingRef.current = true;
      if (controlsRef.current) controlsRef.current.enabled = false;
      const fromPos = camera.position.clone();
      const fromTarget = controls.target.clone();
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1, duration: 1.45, ease: 'power2.inOut',
        onUpdate() {
          camera.position.lerpVectors(fromPos, toPos, proxy.t);
          if (controlsRef.current) {
            controlsRef.current.target.lerpVectors(fromTarget, toTarget, proxy.t);
            camera.lookAt(controlsRef.current.target);
          }
        },
        onComplete() {
          isAnimatingRef.current = false;
          onComplete?.();
        }
      });
    }

    function getActiveMesh(obj: any) { return obj.getMesh ? obj.getMesh() : obj.mesh; }

    function focusObject(obj: any) {
      if (hoveredObjectRef.current) { clearEmissive(getActiveMesh(hoveredObjectRef.current)); hoveredObjectRef.current = null; }
      if (focusedObjectRef.current && focusedObjectRef.current !== obj) clearEmissive(getActiveMesh(focusedObjectRef.current));
      focusedObjectRef.current = obj;
      setEmissive(getActiveMesh(obj), 0xaa88ff, 0.55);
      setFocus(obj.key);
      const camPos = obj.getCamPos ? obj.getCamPos() : obj.camPos;
      const camTarget = obj.getCamTarget ? obj.getCamTarget() : obj.camTarget;
      animateCamera(camPos, camTarget);
      setTimeout(() => openPanel(obj.key), 320);
    }
    focusObjectFnRef.current = focusObject;

    function doResetCamera() {
      if (focusedObjectRef.current) { clearEmissive(getActiveMesh(focusedObjectRef.current)); focusedObjectRef.current = null; }
      setFocus(null);
      closePanel();
      animateCamera(DEFAULT_CAM_POS, DEFAULT_CAM_TARGET, () => { if (controlsRef.current) controlsRef.current.enabled = true; });
    }

    const canvasEl = canvasRef.current;
    canvasEl.addEventListener('mousemove', (e: MouseEvent) => {
      if (isAnimatingRef.current || focusedObjectRef.current || !cameraRef.current) return;
      updatePointer(e);
      raycaster.setFromCamera(pointer, cameraRef.current);
      const lampHover = raycaster.intersectObjects(lampMeshesRef.current, false);
      if (lampHover.length > 0) {
        if (hoveredObjectRef.current) { clearEmissive(getActiveMesh(hoveredObjectRef.current)); hoveredObjectRef.current = null; }
        canvasEl.style.cursor = 'pointer';
        return;
      }
      const hits = raycaster.intersectObjects(allInteractiveMeshesRef.current, false);
      const obj = hits.length > 0 ? resolveHit(hits[0].object) : null;
      if (obj) {
        if (obj !== hoveredObjectRef.current) {
          if (hoveredObjectRef.current) clearEmissive(getActiveMesh(hoveredObjectRef.current));
          hoveredObjectRef.current = obj;
          setEmissive(getActiveMesh(hoveredObjectRef.current), 0x9977ff, 0.4);
        }
        canvasEl.style.cursor = 'pointer';
      } else {
        if (hoveredObjectRef.current) { clearEmissive(getActiveMesh(hoveredObjectRef.current)); hoveredObjectRef.current = null; }
        canvasEl.style.cursor = 'default';
      }
    });

    window.addEventListener('click', (e: MouseEvent) => {
      if (isAnimatingRef.current || !cameraRef.current) return;
      if (Date.now() - lastTouchEndTime < 350) return;
      updatePointer(e);
      raycaster.setFromCamera(pointer, cameraRef.current);
      const lampHits = raycaster.intersectObjects(lampMeshesRef.current, false);
      if (lampHits.length > 0) { useSceneStore.getState().toggleLamp(); return; }
      const hits = raycaster.intersectObjects(allInteractiveMeshesRef.current, false);
      if (hits.length > 0) { const obj = resolveHit(hits[0].object); if (obj) { focusObject(obj); return; } }
      if (focusedObjectRef.current) doResetCamera();
    });

    window.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Escape' && focusedObjectRef.current) doResetCamera(); });

    window.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      pointer.x = (t.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(t.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    window.addEventListener('touchend', (e: TouchEvent) => {
      if (!cameraRef.current) return;
      lastTouchEndTime = Date.now();
      const t = e.changedTouches[0];
      updatePointer(t);
      raycaster.setFromCamera(pointer, cameraRef.current);
      const lampHits = raycaster.intersectObjects(lampMeshesRef.current, false);
      if (lampHits.length > 0) { useSceneStore.getState().toggleLamp(); return; }
      const hits = raycaster.intersectObjects(allInteractiveMeshesRef.current, false);
      const obj = hits.length > 0 ? resolveHit(hits[0].object) : null;
      if (obj) { focusObject(obj); } else if (focusedObjectRef.current) { doResetCamera(); }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    });

    /* RENDER LOOP */
    const _vProj = new THREE.Vector3();
    function updateLabels(hideDueToFocus: boolean) {
      labelDefsRef.current.forEach((def: any) => {
        const el = labelElsRef.current[def.key];
        if (!el || !cameraRef.current) return;
        if (hideDueToFocus) { el.style.opacity = '0'; return; }
        const srcMesh = def.getMesh ? def.getMesh() : def.mesh;
        if (!srcMesh) return;
        const wp = new THREE.Vector3();
        srcMesh.getWorldPosition(wp);
        wp.add(def.offset);
        _vProj.copy(wp).project(cameraRef.current);
        if (_vProj.z > 1) { el.style.opacity = '0'; return; }
        const x = (_vProj.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-_vProj.y * 0.5 + 0.5) * window.innerHeight;
        el.style.transform = `translate(-50%, -100%) translate(${x}px,${y}px)`;
        el.style.opacity = '1';
      });
    }

    tickScene();
    setProgress(100, 'Ready!');

    gsap.to(camera.position, {
      x: DEFAULT_CAM_POS.x, y: DEFAULT_CAM_POS.y, z: DEFAULT_CAM_POS.z, duration: 2.2, ease: 'power3.inOut',
      onUpdate() { camera.lookAt(DEFAULT_CAM_TARGET); },
      onComplete() { if (controlsRef.current) controlsRef.current.enabled = true; }
    });

    function animate(time: number) {
      rafRef.current = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTimeRef.current) * 0.001, 0.05);
      lastTimeRef.current = time;
      tickScene();
      if (deskGlowRef.current) deskGlowRef.current.intensity = deskGlowBaseRef.current + Math.sin(time * 0.0028) * 0.06;
      if (lampOnRef.current && lampLightRef.current) lampLightRef.current.intensity = lampLightBaseRef.current + Math.sin(time * 0.0031 + 1.2) * 0.08;

      if (particleGeoRef.current) {
        const posAttr = particleGeoRef.current.attributes.position;
        for (let i = 0; i < PARTICLE_COUNT.current; i++) {
          posAttr.setY(i, posAttr.getY(i) + dt * 0.05);
          if (posAttr.getY(i) > 6.2) posAttr.setY(i, 0.4);
          posAttr.setX(i, posAttr.getX(i) + Math.sin(time * 0.0004 + i) * dt * 0.012);
        }
        posAttr.needsUpdate = true;
      }

      if (charStateRef.current === 'sitting' && characterGroupRef.current) {
        characterGroupRef.current.rotation.y = DESK_ROT_Y + Math.sin(time * 0.0009) * 0.035;
      }

      updateLabels(!!focusedObjectRef.current);
      if (controlsRef.current) controlsRef.current.update();
      renderer.render(scene, camera);
    }
    animate(0);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose();
    };
  }, []);

  // Listen for lamp state changes
  useEffect(() => {
    lampOnRef.current = lamp.on;
    if (!lampLightRef.current) return;
    if (lamp.on) {
      lampLightRef.current.intensity = lampLightBaseRef.current;
      if (lampShadeMatRef.current) { lampShadeMatRef.current.emissive.set(0xffaa44); lampShadeMatRef.current.emissiveIntensity = 3.0; }
      if (lampBulbMeshRef.current) (lampBulbMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 5.0;
    } else {
      lampLightRef.current.intensity = 0;
      if (lampShadeMatRef.current) { lampShadeMatRef.current.emissive.set(0x000000); lampShadeMatRef.current.emissiveIntensity = 0; }
      if (lampBulbMeshRef.current) (lampBulbMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
    }
  }, [lamp.on]);

  // Listen for focus state changes (from nav dots)
  useEffect(() => {
    const key = focus.key;
    if (!key || !focusObjectFnRef.current) return;
    const obj = interactiveObjectsRef.current.find((o: any) => o.key === key);
    if (obj && (!focusedObjectRef.current || focusedObjectRef.current.key !== key)) {
      focusObjectFnRef.current(obj);
    }
  }, [focus.key]);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive 3D portfolio room — use mouse to orbit, click objects to explore" />
      <div ref={labelsRef} className={styles.labelsContainer} aria-hidden="true" />
    </>
  );
}
