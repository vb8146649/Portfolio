import React, { useRef, useEffect, useState } from 'react';
import { Gamepad2, Volume2, VolumeX, RotateCcw, Play, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

// Audio manager for retro sound synthesizer
let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playSound = (type: 'shoot' | 'explosion' | 'hit' | 'ufo' | 'tick') => {
  if (!audioCtx || audioCtx.state === 'suspended') return;
  const now = audioCtx.currentTime;

  if (type === 'shoot') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(now + 0.12);
  } else if (type === 'explosion') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(10, now + 0.35);
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.linearRampToValueAtTime(40, now + 0.35);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(now + 0.35);
  } else if (type === 'hit') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.55);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(now + 0.55);
  } else if (type === 'ufo') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, now);
    // Modulate pitch up and down quickly
    osc.frequency.linearRampToValueAtTime(700, now + 0.08);
    osc.frequency.linearRampToValueAtTime(500, now + 0.16);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(now + 0.18);
  } else if (type === 'tick') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(now + 0.04);
  }
};

// Pixel-art sprite arrays (1 represents filled pixel, 0 represents blank)
const SPRITES = {
  player: [
    "00000100000",
    "00001110000",
    "00001110000",
    "01111111110",
    "11111111111",
    "11111111111",
    "11111111111"
  ],
  ufo: [
    "000111111000",
    "001111111100",
    "011011011010",
    "111111111111",
    "001101101100",
    "000100001000"
  ],
  invaderA: [ // Top Row (Purple) - 8x8
    [
      "00011000",
      "00111110",
      "01111111",
      "11011011",
      "11111111",
      "00100100",
      "01011010",
      "10100101"
    ],
    [
      "00011000",
      "00111110",
      "01111111",
      "11011011",
      "11111111",
      "00100100",
      "01011010",
      "01000010"
    ]
  ],
  invaderB: [ // Middle Row (Cyan) - 10x8
    [
      "0010000100",
      "0001001000",
      "0011111100",
      "0110110110",
      "1111111111",
      "1011111101",
      "1010000101",
      "0001111000"
    ],
    [
      "0010000100",
      "1001001001",
      "1011111101",
      "1110110111",
      "1111111111",
      "0111111110",
      "0010000100",
      "0100000010"
    ]
  ],
  invaderC: [ // Bottom Row (Yellow/Green) - 12x8
    [
      "000011110000",
      "011111111110",
      "111111111111",
      "111001100111",
      "111111111111",
      "000110011000",
      "001101101100",
      "110000000011"
    ],
    [
      "000011110000",
      "011111111110",
      "111111111111",
      "111001100111",
      "111111111111",
      "000110011000",
      "011001100110",
      "001100001100"
    ]
  ]
};

const BUNKER_SHAPE = [
  "00111100",
  "01111110",
  "11111111",
  "11111111",
  "11100111",
  "11000011"
];

// Helper to render custom pixel sprite
const drawSprite = (
  ctx: CanvasRenderingContext2D,
  sprite: string[],
  x: number,
  y: number,
  pixelSize: number,
  color: string
) => {
  ctx.fillStyle = color;
  const height = sprite.length;
  const width = sprite[0].length;
  const startX = Math.round(x - (width * pixelSize) / 2);
  const startY = Math.round(y - (height * pixelSize) / 2);

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (sprite[r][c] === '1') {
        ctx.fillRect(startX + c * pixelSize, startY + r * pixelSize, pixelSize, pixelSize);
      }
    }
  }
};

interface Laser {
  x: number;
  y: number;
  dy: number;
  isPlayer: boolean;
}

interface Invader {
  x: number;
  y: number;
  type: 'A' | 'B' | 'C';
  points: number;
  color: string;
  width: number;
  height: number;
  animFrame: number;
  alive: boolean;
}

interface Bunker {
  x: number;
  y: number;
  blocks: boolean[][];
}

interface Ufo {
  x: number;
  y: number;
  dx: number;
  active: boolean;
  points: number;
}

export const SpaceInvaders: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('space_invaders_highscore') || '0');
  });
  const [lives, setLives] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // References to keep game loop variables responsive without state lag
  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'gameover' | 'victory',
    score: 0,
    lives: 3,
    playerX: 200,
    playerWidth: 22,
    playerHeight: 14,
    playerCooldown: 0,
    lasers: [] as Laser[],
    invaders: [] as Invader[],
    bunkers: [] as Bunker[],
    ufo: { x: -20, y: 35, dx: 0, active: false, points: 150 } as Ufo,
    keys: {} as { [key: string]: boolean },
    direction: 1, // 1 = right, -1 = left
    invaderStepTimer: 0,
    invaderStepInterval: 45, // lower means faster
    invaderMoveDownPending: false,
    ufoTimer: 0,
    mute: false,
  });

  // Keep stateRef in sync with mute button
  useEffect(() => {
    stateRef.current.mute = isMuted;
  }, [isMuted]);

  // Set initial game states
  const initGame = () => {
    const s = stateRef.current;
    s.score = 0;
    s.lives = 3;
    s.playerX = 200;
    s.lasers = [];
    s.playerCooldown = 0;
    s.direction = 1;
    s.invaderStepInterval = 45;
    s.invaderStepTimer = 0;
    s.invaderMoveDownPending = false;
    s.ufo = { x: -20, y: 35, dx: 0, active: false, points: 150 };
    s.ufoTimer = Math.random() * 600 + 400; // frames before UFO spawns

    setScore(0);
    setLives(3);

    // Generate Invaders Grid (5 rows, 10 columns)
    const invadersList: Invader[] = [];
    const colors = { A: '#b026ff', B: '#00f3ff', C: '#10b981' }; // purple, cyan, green/yellow
    const points = { A: 30, B: 20, C: 10 };
    const sizes = { A: { w: 16, h: 16 }, B: { w: 20, h: 16 }, C: { w: 24, h: 16 } };

    for (let r = 0; r < 5; r++) {
      const type = r === 0 ? 'A' : (r === 1 || r === 2 ? 'B' : 'C');
      for (let c = 0; c < 10; c++) {
        invadersList.push({
          x: 40 + c * 30,
          y: 65 + r * 20,
          type,
          points: points[type],
          color: colors[type],
          width: sizes[type].w,
          height: sizes[type].h,
          animFrame: 0,
          alive: true
        });
      }
    }
    s.invaders = invadersList;

    // Generate 4 Bunkers
    const bunkersList: Bunker[] = [];
    const bunkerWidth = 8;
    const bunkerHeight = 6;
    const bunkerCenters = [65, 155, 245, 335];

    bunkerCenters.forEach(centerX => {
      const blocks: boolean[][] = [];
      for (let row = 0; row < bunkerHeight; row++) {
        const rowBlocks: boolean[] = [];
        for (let col = 0; col < bunkerWidth; col++) {
          rowBlocks.push(BUNKER_SHAPE[row][col] === '1');
        }
        blocks.push(rowBlocks);
      }
      bunkersList.push({
        x: centerX,
        y: 310,
        blocks
      });
    });
    s.bunkers = bunkersList;
  };

  const startGame = () => {
    initAudio();
    initGame();
    stateRef.current.gameState = 'playing';
    setGameState('playing');
    if (!isMuted) playSound('shoot');
  };

  const restartGame = () => {
    startGame();
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeStates = ['playing'];
      if (activeStates.includes(stateRef.current.gameState)) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', ' '].includes(e.key)) {
          e.preventDefault(); // Stop window from scrolling
        }
      }
      stateRef.current.keys[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;

    const updateAndRender = () => {
      const s = stateRef.current;

      // 1. CLEAR CANVAS
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#03050a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (s.gameState === 'playing') {
        // --- GAME LOGIC ---

        // Player Movement
        if (s.keys['ArrowLeft'] || s.keys['a']) {
          s.playerX = Math.max(15, s.playerX - 2.5);
        }
        if (s.keys['ArrowRight'] || s.keys['d']) {
          s.playerX = Math.min(canvas.width - 15, s.playerX + 2.5);
        }

        // Player shooting cooldown
        if (s.playerCooldown > 0) s.playerCooldown--;

        // Player Shoot
        if ((s.keys['ArrowUp'] || s.keys['Space'] || s.keys[' ']) && s.playerCooldown === 0) {
          s.lasers.push({
            x: s.playerX,
            y: 352,
            dy: -4,
            isPlayer: true
          });
          s.playerCooldown = 25; // delay between shots
          if (!s.mute) playSound('shoot');
        }

        // Move UFO
        if (s.ufo.active) {
          s.ufo.x += s.ufo.dx;
          if (s.ufo.x > canvas.width + 20 || s.ufo.x < -20) {
            s.ufo.active = false;
            s.ufoTimer = Math.random() * 600 + 600;
          }
          if (s.ufo.active && Math.random() < 0.015 && !s.mute) {
            playSound('ufo');
          }
        } else {
          s.ufoTimer--;
          if (s.ufoTimer <= 0) {
            s.ufo.active = true;
            s.ufo.x = Math.random() < 0.5 ? -15 : canvas.width + 15;
            s.ufo.dx = s.ufo.x < 0 ? 1.2 : -1.2;
            s.ufoTimer = Math.random() * 600 + 600;
          }
        }

        // Move Lasers
        s.lasers.forEach(laser => {
          laser.y += laser.dy;
        });

        // Filter out off-screen lasers
        s.lasers = s.lasers.filter(laser => laser.y > 10 && laser.y < canvas.height - 10);

        // Update Invaders Timer and steps
        s.invaderStepTimer++;
        const aliveInvaders = s.invaders.filter(inv => inv.alive);

        // Dynamic speed based on count
        const currentStepInterval = Math.max(3, Math.round(s.invaderStepInterval * (aliveInvaders.length / 50)));

        if (s.invaderStepTimer >= currentStepInterval) {
          s.invaderStepTimer = 0;
          let shiftDown = false;

          // Check if any invader hits the edge
          if (s.invaderMoveDownPending) {
            s.invaders.forEach(inv => {
              if (inv.alive) {
                inv.y += 8;
                inv.animFrame = inv.animFrame === 0 ? 1 : 0;
              }
            });
            s.invaderMoveDownPending = false;
            s.direction *= -1; // reverse
          } else {
            // Move horizontally
            s.invaders.forEach(inv => {
              if (inv.alive) {
                inv.x += s.direction * 5;
                inv.animFrame = inv.animFrame === 0 ? 1 : 0;
                // Check edge
                if (inv.x > canvas.width - 15 || inv.x < 15) {
                  shiftDown = true;
                }
              }
            });
            if (!s.mute && aliveInvaders.length > 0) {
              playSound('tick');
            }
            if (shiftDown) {
              s.invaderMoveDownPending = true;
            }
          }
        }

        // Alien shooting randomly
        if (aliveInvaders.length > 0 && Math.random() < 0.015 + (50 - aliveInvaders.length) * 0.0004) {
          // Choose a random bottom-most invader
          const columnsMap: { [key: number]: Invader } = {};
          aliveInvaders.forEach(inv => {
            const colIndex = Math.round(inv.x / 10);
            if (!columnsMap[colIndex] || columnsMap[colIndex].y < inv.y) {
              columnsMap[colIndex] = inv;
            }
          });
          const activeShooters = Object.values(columnsMap);
          if (activeShooters.length > 0) {
            const shooter = activeShooters[Math.floor(Math.random() * activeShooters.length)];
            s.lasers.push({
              x: shooter.x,
              y: shooter.y + 6,
              dy: 2,
              isPlayer: false
            });
          }
        }

        // Laser collisions (Player Lasers vs Invaders)
        s.lasers.forEach((laser, lIdx) => {
          if (laser.isPlayer) {
            // Check UFO collision
            if (s.ufo.active) {
              const ufoWidth = 24;
              const ufoHeight = 12;
              if (
                laser.x > s.ufo.x - ufoWidth / 2 &&
                laser.x < s.ufo.x + ufoWidth / 2 &&
                laser.y > s.ufo.y - ufoHeight / 2 &&
                laser.y < s.ufo.y + ufoHeight / 2
              ) {
                s.score += s.ufo.points;
                setScore(s.score);
                s.ufo.active = false;
                s.lasers.splice(lIdx, 1);
                if (!s.mute) playSound('explosion');
                return;
              }
            }

            // Check Invader collision
            for (let i = 0; i < s.invaders.length; i++) {
              const inv = s.invaders[i];
              if (inv.alive) {
                if (
                  laser.x > inv.x - inv.width / 2 &&
                  laser.x < inv.x + inv.width / 2 &&
                  laser.y > inv.y - inv.height / 2 &&
                  laser.y < inv.y + inv.height / 2
                ) {
                  inv.alive = false;
                  s.score += inv.points;
                  setScore(s.score);
                  s.lasers.splice(lIdx, 1);
                  if (!s.mute) playSound('explosion');

                  // Update high score
                  if (s.score > highScore) {
                    setHighScore(s.score);
                    localStorage.setItem('space_invaders_highscore', String(s.score));
                  }

                  // Check if victory (all dead)
                  const stillAlive = s.invaders.some(v => v.alive);
                  if (!stillAlive) {
                    s.gameState = 'victory';
                    setGameState('victory');
                    confetti({
                      particleCount: 100,
                      spread: 60,
                      origin: { y: 0.7 }
                    });
                  }
                  break;
                }
              }
            }
          } else {
            // Alien Laser vs Player Ship
            const pX = s.playerX;
            const pY = 360;
            const pW = s.playerWidth;
            const pH = s.playerHeight;
            if (
              laser.x > pX - pW / 2 &&
              laser.x < pX + pW / 2 &&
              laser.y > pY - pH / 2 &&
              laser.y < pY + pH / 2
            ) {
              s.lasers.splice(lIdx, 1);
              s.lives--;
              setLives(s.lives);
              if (!s.mute) playSound('hit');

              if (s.lives <= 0) {
                s.gameState = 'gameover';
                setGameState('gameover');
              }
              return;
            }
          }
        });

        // Laser collisions vs Bunkers (destroying local pixel blocks!)
        s.lasers.forEach((laser, lIdx) => {
          for (let b = 0; b < s.bunkers.length; b++) {
            const bunker = s.bunkers[b];
            const blockWidth = 5;
            const blockHeight = 4;
            const bunkerW = 8 * blockWidth;
            const bunkerH = 6 * blockHeight;
            const bLeft = bunker.x - bunkerW / 2;
            const bRight = bunker.x + bunkerW / 2;
            const bTop = bunker.y - bunkerH / 2;
            const bBottom = bunker.y + bunkerH / 2;

            if (laser.x >= bLeft && laser.x <= bRight && laser.y >= bTop && laser.y <= bBottom) {
              // Calculate block index
              const col = Math.floor((laser.x - bLeft) / blockWidth);
              const row = Math.floor((laser.y - bTop) / blockHeight);

              if (col >= 0 && col < 8 && row >= 0 && row < 6) {
                if (bunker.blocks[row][col]) {
                  // Chip away
                  bunker.blocks[row][col] = false;
                  s.lasers.splice(lIdx, 1);
                  if (!s.mute) playSound('tick');
                  return;
                }
              }
            }
          }
        });

        // Check if invaders reached bunkers / bottom of screen
        s.invaders.forEach(inv => {
          if (inv.alive && inv.y >= 295) {
            s.gameState = 'gameover';
            setGameState('gameover');
            if (!s.mute) playSound('hit');
          }
        });
      }

      // --- RENDERING GRAPHICS ---

      // Draw Grid / Telemetry HUD
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Draw grid lines
      for (let i = 40; i < canvas.width; i += 40) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
      }
      for (let i = 30; i < canvas.height; i += 30) {
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
      }
      ctx.stroke();

      // HUD Header Border
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(canvas.width, 30);
      ctx.stroke();

      // HUD footer Line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 20);
      ctx.lineTo(canvas.width, canvas.height - 20);
      ctx.stroke();

      // Draw HUD details
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE: ${s.score.toString().padStart(4, '0')}`, 10, 19);
      ctx.textAlign = 'right';
      ctx.fillText(`HI-SCORE: ${highScore.toString().padStart(4, '0')}`, canvas.width - 10, 19);

      // Render Player ship (Green)
      if (s.gameState === 'playing' || s.gameState === 'victory') {
        drawSprite(ctx, SPRITES.player, s.playerX, 360, 2, '#10b981');
      }

      // Render UFO (Red)
      if (s.ufo.active) {
        drawSprite(ctx, SPRITES.ufo, s.ufo.x, s.ufo.y, 1.8, '#ef4444');
      }

      // Render Invaders
      s.invaders.forEach(inv => {
        if (inv.alive) {
          const spriteKey = inv.type === 'A' ? 'invaderA' : (inv.type === 'B' ? 'invaderB' : 'invaderC');
          const frames = SPRITES[spriteKey];
          const frame = frames[inv.animFrame];
          drawSprite(ctx, frame, inv.x, inv.y, 1.6, inv.color);
        }
      });

      // Render Lasers
      s.lasers.forEach(laser => {
        ctx.fillStyle = laser.isPlayer ? '#00f3ff' : '#ff007f'; // Player = Cyan, Invader = Pink
        ctx.shadowColor = laser.isPlayer ? '#00f3ff' : '#ff007f';
        ctx.shadowBlur = 4;
        ctx.fillRect(laser.x - 1, laser.y - 4, 2, 8);
        ctx.shadowBlur = 0; // reset
      });

      // Render Bunkers (Yellow)
      s.bunkers.forEach(bunker => {
        const blockWidth = 5;
        const blockHeight = 4;
        const startX = bunker.x - (8 * blockWidth) / 2;
        const startY = bunker.y - (6 * blockHeight) / 2;

        ctx.fillStyle = '#f59e0b'; // Gold / Orange
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 8; c++) {
            if (bunker.blocks[r][c]) {
              ctx.fillRect(startX + c * blockWidth, startY + r * blockHeight, blockWidth - 0.5, blockHeight - 0.5);
            }
          }
        }
      });

      // Render Lives in footer
      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'left';
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillText(`SHIPS:`, 10, canvas.height - 6);
      for (let i = 0; i < s.lives; i++) {
        drawSprite(ctx, SPRITES.player, 65 + i * 18, canvas.height - 10, 1, '#10b981');
      }

      // Render Status Labels
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.textAlign = 'right';
      ctx.fillText(s.gameState === 'playing' ? 'SYS: ACTIVE' : 'SYS: STANDBY', canvas.width - 10, canvas.height - 6);

      // --- OVERLAYS ---
      if (s.gameState === 'idle') {
        // Blinking Press Start
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 31, canvas.width, canvas.height - 51);

        ctx.fillStyle = '#00f3ff';
        ctx.textAlign = 'center';
        ctx.font = '700 20px "Orbitron", sans-serif';
        ctx.fillText("SPACE INVADERS", canvas.width / 2, 130);

        // Draw Demo Alien Float
        const pulse = Math.sin(Date.now() / 200) * 4;
        drawSprite(ctx, SPRITES.invaderB[0], canvas.width / 2 - 45, 195 + pulse, 1.8, '#00f3ff');
        drawSprite(ctx, SPRITES.invaderA[0], canvas.width / 2, 195 - pulse, 1.8, '#b026ff');
        drawSprite(ctx, SPRITES.invaderC[0], canvas.width / 2 + 45, 195 + pulse, 1.8, '#10b981');

        ctx.font = '700 12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#f3f4f6';
        if (Math.floor(Date.now() / 450) % 2 === 0) {
          ctx.fillText("CLICK HERE / TAP TO PLAY", canvas.width / 2, 260);
        }

        ctx.font = '500 10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText("Controls: A/D / Arrows to Move | Space/Up to Fire", canvas.width / 2, 300);
      } else if (s.gameState === 'gameover') {
        ctx.fillStyle = 'rgba(3, 5, 10, 0.85)';
        ctx.fillRect(0, 31, canvas.width, canvas.height - 51);

        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.font = '700 24px "Orbitron", sans-serif';
        ctx.fillText("MISSION FAILED", canvas.width / 2, 160);

        ctx.fillStyle = 'var(--text-secondary)';
        ctx.font = '700 14px "JetBrains Mono", monospace';
        ctx.fillText(`FINAL SCORE: ${s.score}`, canvas.width / 2, 205);

        if (Math.floor(Date.now() / 400) % 2 === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 12px "JetBrains Mono", monospace';
          ctx.fillText("CLICK HERE / PRESS RESTART", canvas.width / 2, 270);
        }
      } else if (s.gameState === 'victory') {
        ctx.fillStyle = 'rgba(3, 5, 10, 0.85)';
        ctx.fillRect(0, 31, canvas.width, canvas.height - 51);

        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.font = '700 24px "Orbitron", sans-serif';
        ctx.fillText("GALAXY DEFENDED!", canvas.width / 2, 160);

        ctx.fillStyle = 'var(--text-secondary)';
        ctx.font = '700 14px "JetBrains Mono", monospace';
        ctx.fillText(`SCORE: ${s.score} | HI-SCORE: ${highScore}`, canvas.width / 2, 205);

        ctx.fillStyle = '#00f3ff';
        ctx.font = '500 11px "JetBrains Mono", monospace';
        ctx.fillText("VICTORY CONFETTI DEPLOYED!", canvas.width / 2, 240);

        if (Math.floor(Date.now() / 400) % 2 === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 12px "JetBrains Mono", monospace';
          ctx.fillText("CLICK HERE TO REPLAY", canvas.width / 2, 290);
        }
      }

      frameId = requestAnimationFrame(updateAndRender);
    };

    frameId = requestAnimationFrame(updateAndRender);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [highScore]);

  const handleMobileButtonDown = (key: string) => {
    initAudio();
    stateRef.current.keys[key] = true;
  };

  const handleMobileButtonUp = (key: string) => {
    stateRef.current.keys[key] = false;
  };

  // Click on Canvas Area (Start / Restart)
  const handleCanvasClick = () => {
    const s = stateRef.current;
    if (s.gameState === 'idle' || s.gameState === 'gameover' || s.gameState === 'victory') {
      startGame();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gamepad2 size={16} style={{ color: 'var(--accent-secondary)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
            SPACE INVADERS MINI-ARCADE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
            SCORE: <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>{score}</span>
          </div>
          <div style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>
            LIVES: <span style={{ color: '#10b981', fontWeight: 700 }}>{lives}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* Simulator canvas */}
      <div
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: '#03050a',
          border: '1.5px solid rgba(0, 243, 255, 0.15)',
          borderRadius: '6px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          cursor: gameState === 'playing' ? 'default' : 'pointer'
        }}
      >
        <canvas ref={canvasRef} width={400} height={400} style={{ display: 'block', width: '100%', height: '100%' }} />

        {/* Neon scanlines overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 243, 255, 0.05) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
          }}
        />

        {/* Telemetry Labels */}
        <div style={{ position: 'absolute', top: '8px', left: '10px', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255, 255, 255, 0.35)', pointerEvents: 'none' }}>
          ROM: SP_INV_v1.0
        </div>
        <div style={{ position: 'absolute', top: '8px', right: '10px', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-secondary)', pointerEvents: 'none' }}>
          FPS: 60 // EMULATED
        </div>
      </div>

      {/* Controller Buttons (Visible / Helpful for mobile or clicks) */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', padding: '0.3rem 0' }}>
        <button
          onMouseDown={() => handleMobileButtonDown('ArrowLeft')}
          onMouseUp={() => handleMobileButtonUp('ArrowLeft')}
          onMouseLeave={() => handleMobileButtonUp('ArrowLeft')}
          onTouchStart={(e) => { e.preventDefault(); handleMobileButtonDown('ArrowLeft'); }}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileButtonUp('ArrowLeft'); }}
          className="btn btn-secondary clickable"
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowLeft size={16} />
        </button>

        <button
          onMouseDown={() => handleMobileButtonDown('ArrowUp')}
          onMouseUp={() => handleMobileButtonUp('ArrowUp')}
          onMouseLeave={() => handleMobileButtonUp('ArrowUp')}
          onTouchStart={(e) => { e.preventDefault(); handleMobileButtonDown('ArrowUp'); }}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileButtonUp('ArrowUp'); }}
          className="btn btn-primary clickable"
          style={{ padding: '0.5rem 1.4rem', borderRadius: '6px', fontSize: '0.85rem', flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}
        >
          <Zap size={16} /> FIRE
        </button>

        <button
          onMouseDown={() => handleMobileButtonDown('ArrowRight')}
          onMouseUp={() => handleMobileButtonUp('ArrowRight')}
          onMouseLeave={() => handleMobileButtonUp('ArrowRight')}
          onTouchStart={(e) => { e.preventDefault(); handleMobileButtonDown('ArrowRight'); }}
          onTouchEnd={(e) => { e.preventDefault(); handleMobileButtonUp('ArrowRight'); }}
          className="btn btn-secondary clickable"
          style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <ArrowRight size={16} />
        </button>

        {gameState !== 'playing' && (
          <button
            onClick={startGame}
            className="btn btn-primary clickable"
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}
          >
            <Play size={14} /> START
          </button>
        )}

        {gameState === 'gameover' || gameState === 'victory' ? (
          <button
            onClick={restartGame}
            className="btn btn-secondary clickable"
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}
          >
            <RotateCcw size={14} /> RESTART
          </button>
        ) : null}
      </div>

      {/* Github link reference */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '0.5rem', marginTop: '0.2rem' }}>
        <a
          href="https://github.com/vb8146649/SpaceInvaders_CPP"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-primary)', textDecoration: 'underline' }}
        >
          View C++/Raylib Source Code
        </a>
        <span style={{ fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255, 255, 255, 0.35)' }}>
          WASD / Arrow Keys + Space
        </span>
      </div>
    </div>
  );
};
