import React, { useEffect, useRef, useState } from 'react';
import { StreamStatus } from '../types';
import { Sparkles, Activity } from 'lucide-react';

interface EqualizerVisualizerProps {
  analyserNode: AnalyserNode | null;
  status: StreamStatus;
  volume: number;
  isMuted: boolean;
  barCount?: number;
}

export function EqualizerVisualizer({
  analyserNode,
  status,
  volume,
  isMuted,
  barCount = 13,
}: EqualizerVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasRealAudio, setHasRealAudio] = useState<boolean>(false);

  // Maintain smooth bar heights (normalized 0 to 1)
  const barHeightsRef = useRef<number[]>(new Array(barCount).fill(0.2));
  // Maintain peak hold dots/levels
  const barPeaksRef = useRef<number[]>(new Array(barCount).fill(0.2));

  const isPlaying = status === 'playing';
  const effectiveVolume = isMuted ? 0 : volume;

  useEffect(() => {
    // Re-initialize array if barCount changes
    barHeightsRef.current = new Array(barCount).fill(0.15);
    barPeaksRef.current = new Array(barCount).fill(0.15);
  }, [barCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const freqDataArray = analyserNode ? new Uint8Array(analyserNode.frequencyBinCount) : null;

    // Diamond envelope weights: Center bar is 1.0, tapering off to the sides
    // Matches the iconic diamond / rhombus silhouette from Pinterest pin
    const diamondEnvelope: number[] = [];
    const centerIdx = (barCount - 1) / 2;
    for (let i = 0; i < barCount; i++) {
      const distFromCenter = Math.abs(i - centerIdx) / centerIdx; // 0 at center, 1 at edges
      // Diamond profile: 1.0 at center down to 0.22 at the outermost bars
      const weight = Math.max(0.18, 1.0 - Math.pow(distFromCenter, 1.1) * 0.78);
      diamondEnvelope.push(weight);
    }

    const render = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Clear with transparent background (outer container provides dark theme)
      ctx.clearRect(0, 0, width, height);

      let realAudioDetected = false;

      if (analyserNode && freqDataArray && isPlaying) {
        analyserNode.getByteFrequencyData(freqDataArray);
        let sum = 0;
        const testBins = Math.min(32, freqDataArray.length);
        for (let i = 0; i < testBins; i++) {
          sum += freqDataArray[i] || 0;
        }
        if (sum > 10) {
          realAudioDetected = true;
          if (!hasRealAudio) setHasRealAudio(true);
        }
      }

      // Geometry calculation: clean, bold bars inspired by the Pinterest GIF
      // Aim for bars around 10-14px wide with 6-8px gap
      const maxVisualizerWidth = Math.min(width * 0.92, 380);
      const spacing = Math.max(5, Math.floor(maxVisualizerWidth / (barCount * 2.2)));
      const barWidth = Math.max(8, Math.floor((maxVisualizerWidth - (barCount - 1) * spacing) / barCount));
      const totalWidth = barCount * barWidth + (barCount - 1) * spacing;
      const startX = (width - totalWidth) / 2;

      const minBarHeight = 8; // minimum capsule height
      const maxBarHeight = height * 0.90; // maximum vertical span

      // Calculate target normalized height for each bar (0 to 1)
      for (let i = 0; i < barCount; i++) {
        let targetNorm = 0;
        const envelope = diamondEnvelope[i] || 0.5;
        const distFromCenter = Math.abs(i - centerIdx) / centerIdx;

        if (isPlaying) {
          if (realAudioDetected && freqDataArray) {
            // Map frequency spectrum:
            // Center bars handle heavy sub-bass and bass kicks,
            // Intermediate bars handle guitars and rock vocals,
            // Outer bars handle cymbals, air, and stereo transients
            const binRatio = distFromCenter; // 0 = low bass, 1 = treble
            const binIndex = Math.min(
              freqDataArray.length - 1,
              Math.floor(Math.pow(binRatio, 1.5) * (freqDataArray.length * 0.6))
            );
            const rawMag = (freqDataArray[binIndex] || 0) / 255;
            // Apply diamond envelope to preserve the iconic rhombus silhouette
            targetNorm = (rawMag * 0.75 + 0.25) * envelope * effectiveVolume;
          } else {
            // Audio simulation precisely mirroring the animated GIF:
            // Rhythmic rock tempo (~128 BPM = ~2.1 Hz)
            const t = tick * 0.085;

            // 1. Kick beat: strong punch on center bars
            const kickBeat = Math.pow(Math.max(0, Math.sin(t * 1.5)), 6);
            const bassPunch = kickBeat * Math.exp(-distFromCenter * 3.0);

            // 2. Traveling rhythm wave sweeping from left to right (as seen in frames 8-15)
            const waveA = Math.sin(t * 2.2 - i * 0.65) * 0.5 + 0.5;
            const waveB = Math.cos(t * 1.6 + i * 0.45) * 0.5 + 0.5;
            const riffEnergy = waveA * 0.6 + waveB * 0.4;

            // 3. High snare/crash transients on alternating beats
            const snareAccent = Math.pow(Math.max(0, Math.cos(t * 0.75 + 1.0)), 8) * (0.3 + distFromCenter * 0.7);

            // Combine components and sculpt through the diamond envelope
            const combinedEnergy = (0.2 + bassPunch * 0.65 + riffEnergy * 0.45 + snareAccent * 0.35);
            targetNorm = Math.min(1.0, combinedEnergy * envelope * effectiveVolume);
          }
        } else if (status === 'connecting') {
          // Connecting: pulsating energy breathing outwards from center
          const pulse = Math.sin(tick * 0.12 - distFromCenter * 2.5) * 0.5 + 0.5;
          targetNorm = (0.15 + 0.35 * pulse) * envelope;
        } else {
          // Paused / idle: serene, clean glowing diamond silhouette (as in frame 1)
          const breathing = Math.sin(tick * 0.04) * 0.06;
          targetNorm = (0.22 + breathing) * envelope;
        }

        // Snappy spring-like physics interpolation
        const current = barHeightsRef.current[i] || 0.1;
        const speed = targetNorm > current ? 0.42 : 0.16; // Fast attack, smooth release
        const newHeight = current + (targetNorm - current) * speed;
        barHeightsRef.current[i] = newHeight;

        // Peak tracking
        if (newHeight >= (barPeaksRef.current[i] || 0)) {
          barPeaksRef.current[i] = newHeight;
        } else {
          barPeaksRef.current[i] = Math.max(newHeight, (barPeaksRef.current[i] || 0) - 0.015);
        }

        // Calculate symmetrical vertical span centered at centerY
        const barH = Math.max(minBarHeight, newHeight * maxBarHeight);
        const topY = centerY - barH / 2;
        const bottomY = centerY + barH / 2;
        const x = startX + i * (barWidth + spacing);

        // Draw pill bar (rounded rectangle)
        const cornerRadius = Math.min(barWidth / 2, 5);

        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, topY, barWidth, barH, cornerRadius);
        } else {
          // Fallback if roundRect is not supported
          ctx.moveTo(x + cornerRadius, topY);
          ctx.lineTo(x + barWidth - cornerRadius, topY);
          ctx.quadraticCurveTo(x + barWidth, topY, x + barWidth, topY + cornerRadius);
          ctx.lineTo(x + barWidth, bottomY - cornerRadius);
          ctx.quadraticCurveTo(x + barWidth, bottomY, x + barWidth - cornerRadius, bottomY);
          ctx.lineTo(x + cornerRadius, bottomY);
          ctx.quadraticCurveTo(x, bottomY, x, bottomY - cornerRadius);
          ctx.lineTo(x, topY + cornerRadius);
          ctx.quadraticCurveTo(x, topY, x + cornerRadius, topY);
          ctx.closePath();
        }

        // Color styling: Glowing neon red palette matching the app
        if (isPlaying) {
          const grad = ctx.createLinearGradient(0, topY, 0, bottomY);
          // High intensity neon red tips, intense crimson body, and bright center pulse
          grad.addColorStop(0.0, '#FF2020'); // Glowing bright neon red at top tip
          grad.addColorStop(0.25, '#E50914'); // Intense rock red
          grad.addColorStop(0.5, newHeight > 0.6 ? '#FFA0A0' : '#FF3333'); // Hot center highlight
          grad.addColorStop(0.75, '#E50914'); // Intense rock red
          grad.addColorStop(1.0, '#FF2020'); // Glowing bright neon red at bottom tip

          ctx.fillStyle = grad;
          ctx.shadowColor = '#FF2020';
          ctx.shadowBlur = newHeight > 0.4 ? 14 : 7;
        } else if (status === 'connecting') {
          const grad = ctx.createLinearGradient(0, topY, 0, bottomY);
          grad.addColorStop(0.0, '#FF4444');
          grad.addColorStop(0.5, '#B91C1C');
          grad.addColorStop(1.0, '#FF4444');
          ctx.fillStyle = grad;
          ctx.shadowColor = '#E50914';
          ctx.shadowBlur = 6;
        } else {
          // Paused resting diamond: subtle metallic dark red with crisp perimeter
          const grad = ctx.createLinearGradient(0, topY, 0, bottomY);
          grad.addColorStop(0.0, 'rgba(255, 32, 32, 0.65)');
          grad.addColorStop(0.5, 'rgba(185, 28, 28, 0.4)');
          grad.addColorStop(1.0, 'rgba(255, 32, 32, 0.65)');
          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(229, 9, 20, 0.3)';
          ctx.shadowBlur = 3;
        }

        ctx.fill();

        // Add subtle peak indicator line on top and bottom if active
        if (isPlaying && newHeight > 0.4) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#FFFFFF';
          // Small white-hot spark at peak
          ctx.fillRect(x + 2, topY, barWidth - 4, 1.5);
          ctx.fillRect(x + 2, bottomY - 1.5, barWidth - 4, 1.5);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyserNode, isPlaying, effectiveVolume, barCount, status, hasRealAudio]);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Equalizer Container with dark rock chassis & glowing backing */}
      <div className="w-full relative px-3 py-3 bg-[#08080a] rounded-2xl border border-red-950/40 shadow-[0_4px_24px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(229,9,20,0.06)] overflow-hidden group">
        {/* Ambient Red Glow in the center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-20 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

        {/* Subtle grid texture lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(229,9,20,0.03)_1px,transparent_1px)] bg-[size:20px_10px] pointer-events-none" />

        {/* Subtle Center horizontal axis line */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent pointer-events-none" />

        {/* Main Canvas rendering the diamond equalizer */}
        <div className="relative w-full flex justify-center items-center py-1">
          <canvas
            ref={canvasRef}
            width={360}
            height={84}
            className="w-full h-[76px] md:h-[86px] block object-contain"
          />
        </div>

        {/* Bottom scale labels */}
        <div className="flex justify-between items-center px-2 pt-1 border-t border-white/5 text-[9px] font-mono text-zinc-500 tracking-wider">
          <div className="flex items-center gap-1 text-zinc-400">
            <Activity size={10} className={isPlaying ? 'text-red-500 animate-pulse' : 'text-zinc-600'} />
            <span className="uppercase tracking-widest">RHOMBUS EQ</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 shadow-[0_0_6px_#FF2020]' : 'bg-zinc-700'}`} />
            <span className="text-[8px] font-semibold tracking-widest text-zinc-400">
              {isPlaying ? 'ACTIVE 24/7' : status === 'connecting' ? 'SYNCING...' : 'STANDBY'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
