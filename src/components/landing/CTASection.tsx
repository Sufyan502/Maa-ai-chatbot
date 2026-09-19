import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowRight, Bot, Sparkles, Droplets } from 'lucide-react';

interface CTASectionProps {
  onOpenChat: () => void;
}

// Particle/Ripple interface for liquid simulation
interface FluidDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface WaveRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  color: string;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenChat }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 }); // Normalized 0..1
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // Physics animation loop refs
  const mouseTargetRef = useRef({ x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, active: false });
  const fluidBlobRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, radius: 140 });
  const ripplesRef = useRef<WaveRipple[]>([]);
  const dropletsRef = useRef<FluidDroplet[]>([]);
  const animFrameId = useRef<number | null>(null);

  // Initialize and run liquid water canvas simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    // Initial blob at center
    fluidBlobRef.current = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: Math.min(width, height) * 0.38
    };

    // Spawn ambient floating bioluminescent droplets
    const droplets: FluidDroplet[] = [];
    const colors = ['#38BDF8', '#60A5FA', '#818CF8', '#A78BFA', '#06B6D4'];
    for (let i = 0; i < 28; i++) {
      droplets.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 3.5 + 1.5,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    dropletsRef.current = droplets;

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      const target = mouseTargetRef.current;
      const blob = fluidBlobRef.current;

      // Update fluid blob position with smooth viscosity / water spring inertia
      const followSpeed = target.active ? 0.085 : 0.035;
      const destX = target.active ? target.x : width / 2 + Math.sin(time * 0.8) * (width * 0.15);
      const destY = target.active ? target.y : height / 2 + Math.cos(time * 0.6) * (height * 0.12);

      blob.x += (destX - blob.x) * followSpeed;
      blob.y += (destY - blob.y) * followSpeed;

      // 1. Draw Deep Ambient Liquid Gradient Base
      const bgGrad = ctx.createRadialGradient(
        blob.x,
        blob.y,
        10,
        blob.x,
        blob.y,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, 'rgba(37, 99, 235, 0.45)');
      bgGrad.addColorStop(0.25, 'rgba(124, 58, 237, 0.35)');
      bgGrad.addColorStop(0.55, 'rgba(14, 165, 233, 0.18)');
      bgGrad.addColorStop(0.85, 'rgba(8, 12, 20, 0.6)');
      bgGrad.addColorStop(1, 'rgba(8, 12, 20, 0.95)');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Organic Multi-Layer Liquid Water Blobs (Deforming with waves)
      const numBlobLayers = 3;
      for (let layer = 0; layer < numBlobLayers; layer++) {
        ctx.save();
        const layerRadius = blob.radius * (1 + layer * 0.25);
        const layerSpeed = time * (1.2 + layer * 0.4);
        const numPoints = 12;

        ctx.beginPath();
        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          // Fluid organic wave deformation formula
          const wave =
            Math.sin(angle * 3 + layerSpeed) * 18 +
            Math.cos(angle * 2 - layerSpeed * 1.5) * 12 +
            Math.sin(angle * 5 + time * 2) * 8;
          
          const r = layerRadius + wave;
          const px = blob.x + Math.cos(angle) * r;
          const py = blob.y + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();

        // Layer gradient & caustics
        const blobGrad = ctx.createRadialGradient(
          blob.x - 20,
          blob.y - 20,
          10,
          blob.x,
          blob.y,
          layerRadius
        );

        if (layer === 0) {
          blobGrad.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
          blobGrad.addColorStop(0.4, 'rgba(37, 99, 235, 0.5)');
          blobGrad.addColorStop(0.8, 'rgba(124, 58, 237, 0.3)');
          blobGrad.addColorStop(1, 'rgba(124, 58, 237, 0)');
        } else if (layer === 1) {
          blobGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
          blobGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.25)');
          blobGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
        } else {
          blobGrad.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
          blobGrad.addColorStop(0.6, 'rgba(37, 99, 235, 0.15)');
          blobGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        }

        ctx.fillStyle = blobGrad;
        ctx.filter = `blur(${8 + layer * 6}px)`;
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw Water Caustics / Sun Glare Streams under cursor
      ctx.save();
      ctx.beginPath();
      for (let c = 0; c < 6; c++) {
        const cAngle = (c / 6) * Math.PI * 2 + time * 0.5;
        const cLen = blob.radius * 0.75 + Math.sin(time * 2 + c) * 25;
        const cx1 = blob.x + Math.cos(cAngle) * 15;
        const cy1 = blob.y + Math.sin(cAngle) * 15;
        const cx2 = blob.x + Math.cos(cAngle) * cLen;
        const cy2 = blob.y + Math.sin(cAngle) * cLen;

        const cGrad = ctx.createLinearGradient(cx1, cy1, cx2, cy2);
        cGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        cGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.3)');
        cGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');

        ctx.strokeStyle = cGrad;
        ctx.lineWidth = 14 + Math.sin(time * 3 + c) * 6;
        ctx.lineCap = 'round';
        ctx.moveTo(cx1, cy1);
        ctx.lineTo(cx2, cy2);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Render and Update Interactive Water Wave Ripples
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 2.2;
        rip.strength *= 0.965;

        if (rip.strength <= 0.01 || rip.radius >= rip.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rip.color.replace('ALPHA', rip.strength.toFixed(3));
        ctx.lineWidth = 2.5 * rip.strength;
        ctx.stroke();
        ctx.restore();
      }

      // 5. Update and Draw Fluid Bioluminescent Floating Droplets
      const droplets = dropletsRef.current;
      for (let i = 0; i < droplets.length; i++) {
        const drop = droplets[i];

        // Fluid attraction / turbulence toward the cursor blob
        const dx = blob.x - drop.x;
        const dy = blob.y - drop.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < blob.radius * 1.8 && dist > 5) {
          // Tangential swirl + subtle pull
          drop.vx += (dx / dist) * 0.06 - (dy / dist) * 0.08;
          drop.vy += (dy / dist) * 0.06 + (dx / dist) * 0.08;
        }

        // Apply friction
        drop.vx *= 0.97;
        drop.vy *= 0.97;

        drop.x += drop.vx;
        drop.y += drop.vy;

        // Bounce from bounds
        if (drop.x < 0) { drop.x = 0; drop.vx *= -1; }
        if (drop.x > width) { drop.x = width; drop.vx *= -1; }
        if (drop.y < 0) { drop.y = 0; drop.vy *= -1; }
        if (drop.y > height) { drop.y = height; drop.vy *= -1; }

        // Render droplet
        ctx.save();
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fillStyle = drop.color;
        ctx.globalAlpha = drop.alpha * (0.6 + Math.sin(time * 3 + i) * 0.4);
        ctx.shadowColor = drop.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  // Handle cursor motion across the liquid box
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = Math.max(0, Math.min(1, x / rect.width));
    const normY = Math.max(0, Math.min(1, y / rect.height));

    setMousePos({ x: normX, y: normY });

    // 3D Tilt calculation (subtle luxury parallax)
    const rx = (normY - 0.5) * -6;
    const ry = (normX - 0.5) * 6;
    setTilt({ rx, ry });

    // Calculate mouse speed for ripple generation
    const target = mouseTargetRef.current;
    const vx = x - target.px;
    const vy = y - target.py;
    const speed = Math.sqrt(vx * vx + vy * vy);

    target.x = x;
    target.y = y;
    target.px = x;
    target.py = y;
    target.vx = vx;
    target.vy = vy;
    target.active = true;

    // Spawn water ripples when cursor is moving
    if (speed > 4 && Math.random() > 0.4) {
      const colors = [
        'rgba(56, 189, 248, ALPHA)',
        'rgba(96, 165, 250, ALPHA)',
        'rgba(167, 139, 250, ALPHA)',
        'rgba(255, 255, 255, ALPHA)'
      ];
      ripplesRef.current.push({
        x,
        y,
        radius: 6,
        maxRadius: Math.min(rect.width, rect.height) * 0.45,
        strength: Math.min(0.85, speed / 25),
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    mouseTargetRef.current.active = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseTargetRef.current.active = false;
    setTilt({ rx: 0, ry: 0 });
    setMousePos({ x: 0.5, y: 0.5 });
  }, []);

  return (
    <section className="py-20 bg-[#080C14] border-t border-[#1D2533] relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#2563EB]/15 via-[#06B6D4]/12 to-[#7C3AED]/15 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 3D Perspective Wrapper for Liquid Glass Box */}
        <div
          style={{ perspective: 1200 }}
          className="w-full flex justify-center"
        >
          
          {/* LIQUID GLASS BOX CONTAINER */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
            }}
            className={`w-full rounded-[32px] relative overflow-hidden transition-all duration-300 select-none
              bg-[#0A101D]/75 backdrop-blur-2xl
              border border-white/15 hover:border-cyan-400/40
              shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(37,99,235,0.15),inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-1px_2px_rgba(0,0,0,0.5)]
              group cursor-default`}
          >
            
            {/* 1. INTERACTIVE LIQUID WATER CANVAS (Behind the glass content) */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-90 transition-opacity duration-300"
            />

            {/* 2. SPECULAR GLASS GLARE & CAUSTIC SPOTLIGHT FOLLOWING CURSOR */}
            <div
              style={{
                background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.14), rgba(56,189,248,0.08) 35%, transparent 70%)`
              }}
              className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200"
            />

            {/* 3. ULTRA-FROSTED GLASS REFRACTION & RIM HIGHLIGHT */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/[0.4] pointer-events-none z-10" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none z-10" />

            {/* 4. FOREGROUND CONTENT (Crisp, High-Contrast Typography & CTAs) */}
            <div className="p-8 sm:p-14 text-center relative z-20">
              
              {/* Floating Liquid AI Badge with Water Ripple Ring */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div
                  style={{
                    transform: `translate(${(mousePos.x - 0.5) * 12}px, ${(mousePos.y - 0.5) * 12}px)`
                  }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] via-[#06B6D4] to-[#7C3AED] flex items-center justify-center text-white shadow-2xl shadow-cyan-500/35 border border-white/30 transition-transform duration-200 ease-out"
                >
                  <Bot className="w-8 h-8 drop-shadow-md" />
                </div>

                {/* Animated Sub-surface Fluid Pulse Ring */}
                <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 animate-ping -z-10 [animation-duration:3s]" />
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                Have a question?
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-200/90 max-w-xl mx-auto mb-8 leading-relaxed font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                Maa AI Chat is ready to help you find information and navigate MaaProject.
              </p>

              {/* CTA Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onOpenChat}
                  id="cta-talk-to-ai-btn"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/40 border border-cyan-400/40 cursor-pointer transition-all duration-200
                    bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#7C3AED] hover:from-[#1D4ED8] hover:to-[#6D28D9] hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.99]"
                >
                  <Sparkles className="w-5 h-5 text-cyan-200 animate-pulse" />
                  <span>Talk to Maa AI</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>

              {/* Liquid Status Footer */}
              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400 font-medium">
                <Droplets className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                <span>Interactive Fluid Interface • Free Public Access • 24/7 Verified Support</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
