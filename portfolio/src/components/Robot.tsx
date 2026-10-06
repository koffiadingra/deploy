import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface RobotProps {
  className?: string;
}

// Le regard suit le curseur ; veille après 4 s sans mouvement.
//
// Aucun state React : un setState par mouvement déclencherait un rendu complet
// à ~120 Hz, donc la boucle rAF écrit dans le DOM via des refs. Le lissage
// `position += (cible - position) * 0.12` donne la course molle d'un
// servomoteur. `transform` est un attribut SVG, car rotate(angle, cx, cy) prend
// son centre en paramètre. prefers-reduced-motion coupe la boucle entièrement.
export function Robot({ className = '' }: RobotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const shutterRef = useRef<SVGRectElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const svg = svgRef.current;
    const head = headRef.current;
    const eyes = eyesRef.current;
    const shutter = shutterRef.current;
    if (!svg || !head || !eyes || !shutter) return;

    // Cibles visées et positions courantes.
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let lastMove = 0;
    let frame = 0;
    let blinkAt = performance.now() + 2500;
    let blinkUntil = 0;

    // Rayon d'influence : au-delà, le regard est déjà au maximum.
    const REACH = 420;
    // Amplitude des yeux, en unités du viewBox.
    const EYE_X = 11;
    const EYE_Y = 6;
    // Inclinaison maximale, en degrés.
    const TILT = 5;

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const onPointerMove = (event: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height * 0.42; // hauteur de la visiere
      targetX = clamp((event.clientX - cx) / REACH);
      targetY = clamp((event.clientY - cy) / REACH);
      lastMove = performance.now();
    };

    const onPointerDown = () => {
      blinkUntil = performance.now() + 130;
    };

    const tick = (now: number) => {
      // Veille : plus de 4 s sans mouvement.
      if (now - lastMove > 4000) {
        targetX = Math.sin(now / 2200) * 0.65;
        targetY = Math.sin(now / 3700) * 0.28;
      }

      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;

      eyes.setAttribute(
        'transform',
        `translate(${(x * EYE_X).toFixed(2)} ${(y * EYE_Y).toFixed(2)})`,
      );
      head.setAttribute(
        'transform',
        `rotate(${(x * TILT).toFixed(2)} 120 168)`,
      );

      if (now > blinkAt) {
        blinkUntil = now + 120;
        blinkAt = now + 2600 + Math.random() * 4200; // rythme irrégulier
      }
      const closed = now < blinkUntil;
      shutter.setAttribute('y', closed ? '72' : '10');

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    frame = requestAnimationFrame(tick);

    // Sans cela la boucle continue après le démontage.
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [reduced]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label="Illustration d'une tête de robot dont le regard suit le curseur"
    >
      <defs>
        <clipPath id="visor-clip">
          <rect x="64" y="76" width="112" height="50" rx="8" />
        </clipPath>
      </defs>

      <line
        x1="120"
        y1="48"
        x2="120"
        y2="26"
        stroke="var(--color-edge-hi)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="120" cy="20" r="6" fill="var(--color-live)" className="animate-led" />
      <circle cx="120" cy="20" r="10" fill="none" stroke="var(--color-live)" strokeOpacity="0.25" />

      <g ref={headRef}>
        <rect
          x="42"
          y="48"
          width="156"
          height="136"
          rx="20"
          fill="var(--color-panel)"
          stroke="var(--color-edge-hi)"
          strokeWidth="2"
        />
        <rect
          x="52"
          y="58"
          width="136"
          height="116"
          rx="13"
          fill="none"
          stroke="var(--color-edge)"
          strokeWidth="1"
        />
        {[
          [60, 66],
          [180, 66],
          [60, 166],
          [180, 166],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill="var(--color-edge-hi)" />
        ))}

        <rect x="64" y="76" width="112" height="50" rx="8" fill="#0d0c0b" />

        <g clipPath="url(#visor-clip)">
          <g ref={eyesRef}>
            <rect x="86" y="92" width="18" height="18" rx="5" fill="var(--color-signal)" />
            <rect x="136" y="92" width="18" height="18" rx="5" fill="var(--color-signal)" />
          </g>
          {/* Volet : y=10 hors visière, y=72 la couvre. */}
          <rect
            ref={shutterRef}
            x="64"
            y="10"
            width="112"
            height="50"
            fill="var(--color-panel)"
          />
        </g>
        <rect
          x="64"
          y="76"
          width="112"
          height="50"
          rx="8"
          fill="none"
          stroke="var(--color-edge)"
          strokeWidth="1"
        />

        {[
          [82, 14],
          [100, 8],
          [112, 20],
          [136, 10],
          [150, 16],
        ].map(([bx, bw], i) => (
          <rect
            key={bx}
            x={bx}
            y="146"
            width={bw}
            height="5"
            rx="2"
            fill={i === 2 ? 'var(--color-signal)' : 'var(--color-edge-hi)'}
          />
        ))}
      </g>

      <rect x="94" y="188" width="52" height="10" rx="3" fill="var(--color-edge)" />
      <rect x="76" y="200" width="88" height="6" rx="3" fill="var(--color-inset)" />
    </svg>
  );
}
