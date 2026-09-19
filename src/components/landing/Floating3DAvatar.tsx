import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { MessageSquare, Sparkles, X, Volume2 } from 'lucide-react';

interface Floating3DAvatarProps {
  onOpenChat: () => void;
}

export const Floating3DAvatar: React.FC<Floating3DAvatarProps> = ({ onOpenChat }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(true);
  const [blinkCount, setBlinkCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [clickRipple, setClickRipple] = useState(false);

  // Animation & Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const botGroupRef = useRef<THREE.Group | null>(null);
  const headGroupRef = useRef<THREE.Group | null>(null);
  const thrusterLightRef = useRef<THREE.PointLight | null>(null);
  const eyeTextureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const eyeTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const blinkProgressRef = useRef<number>(0); // 0: open, 1: fully closed
  const isBlinkingRef = useRef<boolean>(false);
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const eyeOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Function to draw dynamic digital glowing eyes on the canvas texture
  const drawEyes = useCallback((blinkVal: number, eyeOffsetX: number, eyeOffsetY: number) => {
    const canvas = eyeTextureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Deep sapphire screen background
    ctx.fillStyle = '#050B18';
    ctx.fillRect(0, 0, w, h);

    // Subtle digital matrix / scanline pattern
    ctx.fillStyle = 'rgba(6, 182, 212, 0.05)';
    for (let y = 0; y < h; y += 8) {
      ctx.fillRect(0, y, w, 2);
    }

    // Calculate eye height based on blink progress (1 = closed, 0 = open)
    const eyeOpenFactor = Math.max(0.04, 1 - blinkVal);
    const baseEyeWidth = 72;
    const baseEyeHeight = 110;
    const currentEyeHeight = Math.max(6, baseEyeHeight * eyeOpenFactor);

    // Eye Centers
    const leftEyeX = w * 0.33 + eyeOffsetX * 20;
    const rightEyeX = w * 0.67 + eyeOffsetX * 20;
    const eyeY = h * 0.52 + eyeOffsetY * 15;

    const renderEye = (cx: number, cy: number) => {
      ctx.save();
      ctx.translate(cx, cy);

      // Outer Cyan Glow
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = blinkVal > 0.8 ? 8 : 28;

      // Draw digital pill / arched eye
      ctx.beginPath();
      const ew = baseEyeWidth;
      const eh = currentEyeHeight;

      if (blinkVal > 0.85) {
        // Happy closed eye slit / smile arch
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.moveTo(-ew / 2, 0);
        ctx.quadraticCurveTo(0, -6, ew / 2, 0);
        ctx.stroke();
      } else {
        // Rounded digital capsule with scanlines
        const radius = Math.min(ew / 2, eh / 2);
        ctx.roundRect(-ew / 2, -eh / 2, ew, eh, radius);
        
        // Gradient fill: Cyan to bright electric blue
        const grad = ctx.createLinearGradient(0, -eh / 2, 0, eh / 2);
        grad.addColorStop(0, '#E0F2FE');
        grad.addColorStop(0.2, '#38BDF8');
        grad.addColorStop(0.7, '#00F0FF');
        grad.addColorStop(1, '#0284C7');
        ctx.fillStyle = grad;
        ctx.fill();

        // High-tech horizontal scan-bars inside the eyes
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(5, 11, 24, 0.4)';
        const scanlineStep = 10;
        for (let sy = -eh / 2; sy < eh / 2; sy += scanlineStep) {
          ctx.fillRect(-ew / 2, sy, ew, 3);
        }

        // Specular eye reflections / glints
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-ew * 0.22, -eh * 0.25, Math.min(ew * 0.16, eh * 0.25), 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ew * 0.18, eh * 0.2, Math.min(ew * 0.1, eh * 0.15), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    renderEye(leftEyeX, eyeY);
    renderEye(rightEyeX, eyeY);

    if (eyeTextureRef.current) {
      eyeTextureRef.current.needsUpdate = true;
    }
  }, []);

  // Trigger eye blink animation sequence
  const triggerBlink = useCallback(() => {
    if (isBlinkingRef.current) return;
    isBlinkingRef.current = true;
    setBlinkCount((prev) => prev + 1);

    let startTime: number | null = null;
    const duration = 240; // ms for quick lively blink

    const animateBlink = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Parabolic curve 0 -> 1 -> 0
      blinkProgressRef.current = Math.sin(progress * Math.PI);

      if (progress < 1) {
        requestAnimationFrame(animateBlink);
      } else {
        blinkProgressRef.current = 0;
        isBlinkingRef.current = false;
      }
    };

    requestAnimationFrame(animateBlink);
  }, []);

  // Handle click on the 3D avatar
  const handleAvatarClick = () => {
    triggerBlink();
    setClickRipple(true);
    setTimeout(() => setClickRipple(false), 800);

    // Subtle playful hop
    if (botGroupRef.current) {
      botGroupRef.current.position.y += 0.25;
    }
  };

  // Build the Three.js 3D Avatar
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 160;
    const height = 160;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Lighting Setup (Metallic Lavender & Neon Cyan Highlights)
    const ambientLight = new THREE.AmbientLight(0x818cf8, 0.9);
    scene.add(ambientLight);

    // Front-Top Key Light (Bright white-cyan)
    const dirLight1 = new THREE.DirectionalLight(0xe0f2fe, 2.2);
    dirLight1.position.set(3, 4, 4);
    scene.add(dirLight1);

    // Back-Right Rim Light (Neon Purple/Magenta rim glow)
    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 3.5);
    dirLight2.position.set(-4, -2, -3);
    scene.add(dirLight2);

    // Front Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // Bottom Thruster Point Light
    const thrusterLight = new THREE.PointLight(0x00f0ff, 4, 3);
    thrusterLight.position.set(0, -1.8, 0);
    scene.add(thrusterLight);
    thrusterLightRef.current = thrusterLight;

    // 4. Create Master Bot Hierarchy
    const botMasterGroup = new THREE.Group();
    scene.add(botMasterGroup);
    botGroupRef.current = botMasterGroup;

    const headGroup = new THREE.Group();
    botMasterGroup.add(headGroup);
    headGroupRef.current = headGroup;

    // 5. Materials
    // Main Body: Smooth pearlescent metallic lavender-blue
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.15,
      roughness: 0.28,
      metalness: 0.35,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2
    });

    // Visor/Goggles Rim: Vivid Neon Cyan
    const goggleRimMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.5
    });

    // Goggle Lens: Dark translucent shiny glass
    const goggleLensMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0,
      transmission: 0.3,
      ior: 1.5
    });

    // Ear Discs: Soft Purple Violet
    const earMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.25,
      roughness: 0.3,
      metalness: 0.4
    });

    // Bottom Thruster Metallic Ring
    const thrusterRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x2563eb,
      emissiveIntensity: 0.3,
      roughness: 0.25,
      metalness: 0.7
    });

    // 6. Geometries Assembly

    // A. Head Shell (Rounded stylized cube/capsule)
    const headGeo = new THREE.SphereGeometry(1.25, 36, 36);
    // Squash slightly in Y and expand in X for cute bot proportions
    headGeo.scale(1.15, 0.95, 1.05);
    const headMesh = new THREE.Mesh(headGeo, bodyMaterial);
    headGroup.add(headMesh);

    // B. Face Screen (Beveled Front Plate with Dynamic Eye Texture)
    const eyeCanvas = document.createElement('canvas');
    eyeCanvas.width = 512;
    eyeCanvas.height = 360;
    eyeTextureCanvasRef.current = eyeCanvas;

    const eyeTex = new THREE.CanvasTexture(eyeCanvas);
    eyeTex.colorSpace = THREE.SRGBColorSpace;
    eyeTextureRef.current = eyeTex;

    // Draw initial eyes
    drawEyes(0, 0, 0);

    const screenMaterial = new THREE.MeshBasicMaterial({
      map: eyeTex
    });

    // Curved front face screen geometry
    const screenGeo = new THREE.PlaneGeometry(1.5, 1.08, 16, 16);
    // Curve screen vertices to conform to head curvature
    const pos = screenGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const curveZ = -Math.pow(px / 1.5, 2) * 0.15 - Math.pow(py / 1.1, 2) * 0.1;
      pos.setZ(i, curveZ);
    }
    screenGeo.computeVertexNormals();

    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.set(0, -0.05, 1.08);
    screenMesh.rotation.x = -0.04;
    headGroup.add(screenMesh);

    // C. Screen Bezel / Rim Frame
    const bezelGeo = new THREE.BoxGeometry(1.68, 1.24, 0.15);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xa5b4fc,
      roughness: 0.35,
      metalness: 0.3
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, -0.05, 1.0);
    bezelMesh.rotation.x = -0.04;
    headGroup.add(bezelMesh);

    // D. Dual Goggles on Top of Head (Characteristic Feature in Reference Image)
    const gogglesMasterGroup = new THREE.Group();
    gogglesMasterGroup.position.set(0, 0.95, 0.35);
    gogglesMasterGroup.rotation.x = 0.55; // Tilted back on forehead

    const createGoggle = (offsetX: number) => {
      const goggleGroup = new THREE.Group();
      goggleGroup.position.x = offsetX;

      // Outer Rounded Rim
      const rimGeo = new THREE.TorusGeometry(0.38, 0.09, 16, 32);
      rimGeo.scale(1.15, 0.95, 1.0);
      const rimMesh = new THREE.Mesh(rimGeo, goggleRimMaterial);
      goggleGroup.add(rimMesh);

      // Dark Glass Lens inside
      const lensGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 28);
      lensGeo.rotateX(Math.PI / 2);
      lensGeo.scale(1.1, 0.9, 1.0);
      const lensMesh = new THREE.Mesh(lensGeo, goggleLensMaterial);
      goggleGroup.add(lensMesh);

      return goggleGroup;
    };

    gogglesMasterGroup.add(createGoggle(-0.46));
    gogglesMasterGroup.add(createGoggle(0.46));
    headGroup.add(gogglesMasterGroup);

    // E. Ear Headphones / Side Discs
    const createEar = (isLeft: boolean) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(isLeft ? -1.32 : 1.32, 0.05, 0);
      earGroup.rotation.z = isLeft ? Math.PI / 2 : -Math.PI / 2;

      // Outer Beveled Disc
      const outerDiscGeo = new THREE.CylinderGeometry(0.44, 0.48, 0.28, 32);
      const outerDisc = new THREE.Mesh(outerDiscGeo, earMaterial);
      earGroup.add(outerDisc);

      // Inner Accent Rim
      const innerRimGeo = new THREE.TorusGeometry(0.3, 0.05, 16, 28);
      const innerRim = new THREE.Mesh(innerRimGeo, goggleRimMaterial);
      innerRim.position.y = 0.15;
      innerRim.rotation.x = Math.PI / 2;
      earGroup.add(innerRim);

      return earGroup;
    };

    headGroup.add(createEar(true));
    headGroup.add(createEar(false));

    // F. Bottom Propulsion Thruster Ring & Cyan Glow Cone
    const thrusterGroup = new THREE.Group();
    thrusterGroup.position.set(0, -1.05, 0);

    // Concentric Thruster Ring 1
    const ring1Geo = new THREE.TorusGeometry(0.55, 0.08, 16, 32);
    ring1Geo.rotateX(Math.PI / 2);
    const ring1Mesh = new THREE.Mesh(ring1Geo, thrusterRingMaterial);
    thrusterGroup.add(ring1Mesh);

    // Concentric Thruster Ring 2 (Inner)
    const ring2Geo = new THREE.TorusGeometry(0.36, 0.06, 16, 28);
    ring2Geo.rotateX(Math.PI / 2);
    const ring2Mesh = new THREE.Mesh(ring2Geo, goggleRimMaterial);
    thrusterGroup.add(ring2Mesh);

    // Glowing Ion Thruster Core Flare
    const coreGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = -0.05;
    thrusterGroup.add(coreMesh);

    headGroup.add(thrusterGroup);

    // 7. Global Mouse Move Listener for 3D Head Tracking
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const avatarCenterX = rect.left + rect.width / 2;
      const avatarCenterY = rect.top + rect.height / 2;

      // Distance and angle from avatar to cursor
      const deltaX = e.clientX - avatarCenterX;
      const deltaY = e.clientY - avatarCenterY;

      // Maximum angle rotation limits
      const maxYaw = 0.75; // ~43 degrees left/right
      const maxPitch = 0.55; // ~31 degrees up/down

      const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
      const normDist = Math.min(1, Math.sqrt(deltaX ** 2 + deltaY ** 2) / (screenDiagonal * 0.65));

      const angle = Math.atan2(deltaY, deltaX);

      // Target head rotation angles
      targetRotationRef.current.y = (deltaX / (window.innerWidth * 0.5)) * maxYaw;
      targetRotationRef.current.x = (deltaY / (window.innerHeight * 0.5)) * maxPitch;

      // Pupil offset
      eyeOffsetRef.current = {
        x: Math.cos(angle) * normDist,
        y: Math.sin(angle) * normDist
      };
    };

    window.addEventListener('mousemove', handleWindowMouseMove);

    // 8. Automatic Ambient Blinking (Every 4-5 seconds)
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerBlink();
      }
    }, 4500);

    // 9. Render & Physics Loop
    let time = 0;
    const animate = () => {
      time += 0.035;

      // Smooth Head Tracking Interpolation (Ease-out spring)
      const cur = currentRotationRef.current;
      const tgt = targetRotationRef.current;
      cur.x += (tgt.x - cur.x) * 0.1;
      cur.y += (tgt.y - cur.y) * 0.1;

      if (headGroupRef.current) {
        headGroupRef.current.rotation.y = cur.y;
        headGroupRef.current.rotation.x = cur.x;
        // Subtle tilt roll with yaw
        headGroupRef.current.rotation.z = -cur.y * 0.25;
      }

      // Gentle Hovering / Bobbing Levitation
      if (botMasterGroup) {
        botMasterGroup.position.y = Math.sin(time * 2.2) * 0.12;
      }

      // Pulse Thruster Light Glow
      if (thrusterLightRef.current) {
        thrusterLightRef.current.intensity = 3.2 + Math.sin(time * 6) * 1.2;
      }

      // Redraw Dynamic Screen Eyes
      drawEyes(
        blinkProgressRef.current,
        eyeOffsetRef.current.x,
        eyeOffsetRef.current.y
      );

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      clearInterval(blinkInterval);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [drawEyes, triggerBlink]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* 1. Interactive Companion Speech Bubble / Tooltip */}
      {isTooltipOpen && (
        <div className="mb-3 max-w-[220px] bg-[#111722]/95 backdrop-blur-xl border border-cyan-400/30 rounded-2xl rounded-br-xs p-3.5 shadow-2xl shadow-cyan-950/50 text-white animate-in fade-in slide-in-from-bottom-2 duration-300 relative group/tip">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsTooltipOpen(false);
            }}
            className="absolute top-2 right-2 p-1 text-[#687386] hover:text-white rounded-md transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>MaaBot 3D</span>
          </div>

          <p className="text-xs text-slate-200 leading-snug mb-2 font-medium">
            I&apos;m watching your cursor! 👀 <br />
            <span className="text-[#60A5FA] font-semibold">Click me to blink</span> or chat with Maa AI.
          </p>

          <button
            onClick={onOpenChat}
            className="w-full py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] text-[11px] font-bold text-white flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/40 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="w-3 h-3" />
            <span>Open Maa AI Chat</span>
          </button>
        </div>
      )}

      {/* 2. 3D Avatar Canvas Container */}
      <div className="relative flex items-center justify-center">
        
        {/* Ambient Cyan Thruster Beam & Halo Glow underneath */}
        <div className="absolute -bottom-2 w-28 h-28 bg-gradient-to-t from-cyan-400/40 via-blue-600/20 to-transparent rounded-full blur-xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute -top-2 w-24 h-24 bg-purple-500/20 rounded-full blur-xl pointer-events-none -z-10" />

        {/* Click Ripple Waves */}
        {clickRipple && (
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/80 animate-ping pointer-events-none" />
        )}

        {/* Clickable 3D Canvas Mount */}
        <div
          ref={mountRef}
          onClick={handleAvatarClick}
          className="w-[160px] h-[160px] cursor-pointer relative transition-transform duration-200 hover:scale-105 active:scale-95"
          title="Click to make MaaBot blink eyes!"
        />

        {/* Interactive Badge Indicator */}
        <button
          onClick={onOpenChat}
          className="absolute bottom-1 right-1 p-2 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] border border-cyan-300/50 text-white shadow-lg shadow-blue-950/60 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Launch Maa AI Chat"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
