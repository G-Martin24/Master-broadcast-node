import React from 'react';
import { IconType } from '../types';

interface RockEmblemProps {
  type?: IconType;
  className?: string;
  size?: number;
}

export function RockEmblem({ type = 'badge', className = '', size = 48 }: RockEmblemProps) {
  if (type === 'badge') {
    return (
      <div
        style={{ width: size, height: size }}
        className={`relative shrink-0 rounded-full p-[2px] bg-gradient-to-b from-zinc-200 via-zinc-500 to-zinc-900 shadow-[0_0_12px_rgba(229,9,20,0.6)] border border-[#FF2020]/80 overflow-hidden ${className}`}
      >
        <img
          src="/src/assets/images/rock_metal_radio_logo_1792430917541.jpg"
          alt="Rock & Metal Radio"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }
  if (type === 'oktubre') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 rounded-lg overflow-hidden shadow-md ${className}`}
      >
        {/* Left half: Black */}
        <rect x="0" y="0" width="50" height="100" fill="#18181b" />
        {/* Right half: Electric Blue */}
        <rect x="50" y="0" width="50" height="100" fill="#0062B8" />

        {/* Outer subtle glow/border */}
        <rect x="0" y="0" width="100" height="100" rx="8" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />

        {/* Row 1: O (left) / K (right) */}
        {/* Letter O */}
        <path d="M 16 7 L 38 7 L 38 27 L 16 27 Z M 24 13 L 30 13 L 30 21 L 24 21 Z" fill="#FFFFFF" />
        {/* Letter K */}
        <path d="M 62 7 L 70 7 L 70 14 L 78 7 L 89 7 L 76 17 L 90 27 L 79 27 L 70 19 L 70 27 L 62 27 Z" fill="#FFFFFF" />

        {/* Row 2: T (left) / U (right) */}
        {/* Letter T */}
        <path d="M 14 31 L 41 31 L 41 37 L 31 37 L 31 51 L 23 51 L 23 37 L 14 37 Z" fill="#FFFFFF" />
        {/* Letter U */}
        <path d="M 62 31 L 70 31 L 70 45 L 81 45 L 81 31 L 89 31 L 89 51 L 62 51 Z" fill="#FFFFFF" />

        {/* Row 3: B (left) / R (right) */}
        {/* Letter B */}
        <path d="M 16 55 L 35 55 C 39 55 41 57 41 60 C 41 62 39 64 36 65 C 40 66 41 68 41 71 C 41 74 38 76 34 76 L 16 76 Z M 24 60 L 24 63 L 32 63 C 33 63 34 62 34 61 C 34 60 33 60 32 60 Z M 24 67 L 24 71 L 33 71 C 34 71 35 70 35 69 C 35 68 34 67 33 67 Z" fill="#FFFFFF" />
        {/* Letter R */}
        <path d="M 62 55 L 82 55 C 87 55 89 58 89 62 C 89 65 87 67 83 68 L 90 76 L 80 76 L 75 69 L 70 69 L 70 76 L 62 76 Z M 70 60 L 70 65 L 79 65 C 81 65 82 64 82 62 C 82 61 81 60 79 60 Z" fill="#FFFFFF" />

        {/* Row 4: FM 89.1 (left) / E (right) */}
        {/* FM 89.1 */}
        <g transform="translate(16, 79)">
          <text x="0" y="7" fontFamily="'Russo One', 'Oswald', sans-serif" fontWeight="900" fontSize="7" fill="#FFFFFF">FM</text>
          <text x="0" y="16" fontFamily="'Russo One', 'Oswald', sans-serif" fontWeight="900" fontSize="8" fill="#FFFFFF">89.1</text>
        </g>
        {/* Letter E */}
        <path d="M 62 79 L 89 79 L 89 84 L 71 84 L 71 87 L 86 87 L 86 92 L 71 92 L 71 95 L 89 95 L 89 100 L 62 100 Z" fill="#FFFFFF" />
      </svg>
    );
  }
  if (type === 'skull') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <circle cx="24" cy="24" r="22" stroke="#E50914" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="24" cy="24" r="19" fill="#121212" stroke="#333333" strokeWidth="1.5" />
        {/* Skull Cranium */}
        <path
          d="M15 22C15 16 19 12 24 12C29 12 33 16 33 22C33 26 31 28 29 28H19C17 28 15 26 15 22Z"
          fill="url(#skullMetalGrad)"
          stroke="#e0e0e0"
          strokeWidth="1.2"
        />
        {/* Eye sockets */}
        <ellipse cx="20" cy="21" rx="2.5" ry="3.5" fill="#E50914" />
        <ellipse cx="28" cy="21" rx="2.5" ry="3.5" fill="#E50914" />
        {/* Nose cavity */}
        <polygon points="24,24 22.5,27 25.5,27" fill="#050505" />
        {/* Jaw & Teeth */}
        <path d="M20 28V33H28V28" stroke="#D4D4D8" strokeWidth="1.5" fill="#18181b" />
        <line x1="22" y1="29" x2="22" y2="33" stroke="#E50914" strokeWidth="1" />
        <line x1="24" y1="29" x2="24" y2="33" stroke="#E50914" strokeWidth="1" />
        <line x1="26" y1="29" x2="26" y2="33" stroke="#E50914" strokeWidth="1" />
        <defs>
          <linearGradient id="skullMetalGrad" x1="24" y1="12" x2="24" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F4F4F5" />
            <stop offset="0.6" stopColor="#A1A1AA" />
            <stop offset="1" stopColor="#52525B" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (type === 'pick') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <circle cx="24" cy="24" r="22" stroke="#E50914" strokeWidth="2" opacity="0.6" />
        <circle cx="24" cy="24" r="19" fill="#121212" stroke="#262626" strokeWidth="1.5" />
        {/* Guitar pick shape */}
        <path
          d="M16 16C19 13 29 13 32 16C35 19 32 30 24 36C16 30 13 19 16 16Z"
          fill="url(#pickGrad)"
          stroke="#E50914"
          strokeWidth="1.5"
        />
        {/* Lighting bolt in pick */}
        <path d="M25 18L21 24H25L23 30L29 23H25L27 18H25Z" fill="#FFFFFF" />
        <defs>
          <linearGradient id="pickGrad" x1="16" y1="14" x2="32" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#27272a" />
            <stop offset="0.5" stopColor="#7f1d1d" />
            <stop offset="1" stopColor="#E50914" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Default: Authentic Horns Hand (\m/) inside circle with red distressed ring
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#E50914" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF2020" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="metalHand" x1="20" y1="10" x2="44" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.3" stopColor="#E4E4E7" />
          <stop offset="0.7" stopColor="#A1A1AA" />
          <stop offset="1" stopColor="#52525B" />
        </linearGradient>
        <linearGradient id="cuffGrad" x1="20" y1="46" x2="44" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#27272A" />
          <stop offset="1" stopColor="#09090B" />
        </linearGradient>
      </defs>

      {/* Outer Distressed Red Ring */}
      <circle cx="32" cy="32" r="30" stroke="#FF2020" strokeWidth="2.5" strokeOpacity="0.9" />
      <circle cx="32" cy="32" r="28" stroke="#E50914" strokeWidth="1" strokeDasharray="5 3" strokeOpacity="0.6" />
      <circle cx="32" cy="32" r="26" fill="#0C0C0E" stroke="#27272A" strokeWidth="1.5" />

      {/* Inner red backlight subtle halo */}
      <circle cx="32" cy="32" r="22" fill="#E50914" fillOpacity="0.15" />

      {/* The Rock Horns Hand Silhouette & Details */}
      {/* Index Finger (Extended) */}
      <path
        d="M23 15C23 12.8 24.5 11 26.5 11C28.5 11 30 12.8 30 15V28H23V15Z"
        fill="url(#metalHand)"
        stroke="#18181B"
        strokeWidth="1"
      />
      {/* Pinky Finger (Extended) */}
      <path
        d="M34 17C34 14.8 35.5 13 37.5 13C39.5 13 41 14.8 41 17V29H34V17Z"
        fill="url(#metalHand)"
        stroke="#18181B"
        strokeWidth="1"
      />

      {/* Middle & Ring Fingers (Folded down) */}
      <path
        d="M29 24C29 22.5 30 21.5 31.5 21.5H32.5C34 21.5 35 22.5 35 24V32H29V24Z"
        fill="#A1A1AA"
        stroke="#18181B"
        strokeWidth="1"
      />
      <path
        d="M32 25C32 23.5 33 22.5 34.5 22.5H35.5C37 22.5 38 23.5 38 25V32H32V25Z"
        fill="#71717A"
        stroke="#18181B"
        strokeWidth="1"
      />

      {/* Thumb crossing over folded fingers */}
      <path
        d="M21 28C21 26 23 25 25 25C28 25 34 28 34 31C34 34 29 35 24 33L21 28Z"
        fill="url(#metalHand)"
        stroke="#18181B"
        strokeWidth="1"
      />

      {/* Palm Base */}
      <path
        d="M22 28C21 32 22 41 23 45H41C42 41 42 32 41 28H22Z"
        fill="url(#metalHand)"
        stroke="#18181B"
        strokeWidth="1"
      />

      {/* Palm crease lines */}
      <path d="M26 34C28 36 33 37 37 35" stroke="#3F3F46" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M25 39C29 41 34 41 38 39" stroke="#3F3F46" strokeWidth="1" strokeLinecap="round" />

      {/* Studded Wristband */}
      <rect x="21" y="45" width="22" height="7" rx="1.5" fill="url(#cuffGrad)" stroke="#E50914" strokeWidth="1" />
      {/* Metallic chrome pyramid studs */}
      <polygon points="25,48.5 27,46 29,48.5 27,51" fill="#FFFFFF" stroke="#3F3F46" strokeWidth="0.5" />
      <polygon points="32,48.5 34,46 36,48.5 34,51" fill="#FFFFFF" stroke="#3F3F46" strokeWidth="0.5" />
      <polygon points="39,48.5 41,46 43,48.5 41,51" fill="#FFFFFF" stroke="#3F3F46" strokeWidth="0.5" />
    </svg>
  );
}

export function SocialIcon({ platform, className = '', size = 20 }: { platform: 'instagram' | 'facebook' | 'youtube' | 'whatsapp'; className?: string; size?: number }) {
  if (platform === 'facebook') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }

  if (platform === 'instagram') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }

  if (platform === 'whatsapp') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.777.978-.953 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.135-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.631-.929-2.233-.244-.587-.492-.507-.678-.517-.176-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376-.276.301-1.054 1.03-1.054 2.512s1.079 2.913 1.229 3.114c.15.2 2.123 3.242 5.144 4.547.718.31 1.278.496 1.716.635.722.23 1.379.197 1.9.12.58-.087 1.78-.727 2.03-1.43.25-.703.25-1.305.176-1.43-.076-.126-.276-.201-.577-.352zM12.04 21.783c-1.748 0-3.46-.462-4.97-1.336l-.356-.206-3.694.969.986-3.6-.228-.363c-.96-1.528-1.467-3.3-1.467-5.116 0-5.364 4.364-9.728 9.73-9.728 2.599 0 5.042 1.012 6.879 2.85 1.838 1.837 2.85 4.28 2.849 6.88 0 5.365-4.364 9.728-9.728 9.728zm8.293-18.022C18.125 1.554 15.201.378 12.04.378 5.602.378.36 5.62.36 12.058c0 2.056.537 4.062 1.558 5.83l-1.656 6.046 6.188-1.623c1.712.933 3.642 1.424 5.59 1.424 6.438 0 11.68-5.242 11.68-11.68 0-3.12-1.215-6.05-3.387-8.296z" />
      </svg>
    );
  }

  // YouTube
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
