"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";

// Game constants
const GAME_CONSTANTS = {
  LETTER_SPACING: 1,
  WORD_SPACING: 3,
  CANVAS_HEIGHT: 384, // 384px = h-96 in Tailwind
  SCALE_BASE: 1000,
  TEXT_WIDTH_FACTOR: 0.8,
  BALL_START_X_FACTOR: 0.9,
  BALL_START_Y_FACTOR: 0.1,
  PADDLE_SMOOTHING: 0.1,
} as const;

// Color utilities to get CSS custom properties
const getCanvasColors = () => {
  if (typeof window === "undefined") {
    // Default colors for SSR
    return {
      background: "#000000",
      foreground: "#ffffff",
      muted: "#666666",
      primary: "#3b82f6",
    };
  }
  
  // Create temporary elements to get computed colors from Tailwind classes
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.visibility = 'hidden';
  
  // Create elements for each color we need
  const bgElement = document.createElement('div');
  bgElement.className = 'bg-background';
  
  const fgElement = document.createElement('div');
  fgElement.className = 'text-foreground';
  
  const mutedElement = document.createElement('div');
  mutedElement.className = 'text-muted-foreground';
  
  const primaryElement = document.createElement('div');
  primaryElement.className = 'text-primary';
  
  tempDiv.appendChild(bgElement);
  tempDiv.appendChild(fgElement);
  tempDiv.appendChild(mutedElement);
  tempDiv.appendChild(primaryElement);
  document.body.appendChild(tempDiv);
  
  const colors = {
    background: getComputedStyle(bgElement).backgroundColor || '#000000',
    foreground: getComputedStyle(fgElement).color || '#ffffff',
    muted: getComputedStyle(mutedElement).color || '#666666',
    primary: getComputedStyle(primaryElement).color || '#3b82f6',
  };
  
  document.body.removeChild(tempDiv);
  return colors;
};

// Pixel art font mapping
const PIXEL_MAP: Record<string, number[][]> = {
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
} as const;

// TypeScript interfaces
interface Pixel {
  x: number;
  y: number;
  size: number;
  hit: boolean;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetY: number;
  isVertical: boolean;
}

interface GameState {
  pixels: Pixel[];
  ball: Ball;
  paddles: Paddle[];
  scale: number;
}

export interface PromptingIsAllYouNeedProps {
  className?: string;
  words?: string[];
  title?: string;
  subtitle?: string;
}

export const PromptingIsAllYouNeed = ({ 
  words = ["PROMPTING", "IS ALL YOU NEED"],
}: PromptingIsAllYouNeedProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    pixels: [],
    ball: { x: 0, y: 0, dx: 0, dy: 0, radius: 0 },
    paddles: [],
    scale: 1
  });
  const [themeColors, setThemeColors] = useState(() => getCanvasColors());

  // Update colors when theme changes
  useEffect(() => {
    const updateColors = () => {
      setThemeColors(getCanvasColors());
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
          updateColors();
        }
      });
    });

    // Observe changes to the html element's class attribute (for theme switching)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    // Initial color update
    updateColors();

    return () => observer.disconnect();
  }, []);

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { scale } = gameStateRef.current;
    const LARGE_PIXEL_SIZE = 8 * scale;
    const SMALL_PIXEL_SIZE = 4 * scale;
    const BALL_SPEED = 6 * scale;

    gameStateRef.current.pixels = [];

    const calculateWordWidth = (word: string, pixelSize: number): number => {
      return (
        word.split("").reduce((width, letter) => {
          const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0;
          return width + letterWidth * pixelSize + GAME_CONSTANTS.LETTER_SPACING * pixelSize;
        }, 0) -
        GAME_CONSTANTS.LETTER_SPACING * pixelSize
      );
    };

    const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE);
    const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
      return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + 
        (index > 0 ? GAME_CONSTANTS.WORD_SPACING * SMALL_PIXEL_SIZE : 0);
    }, 0);
    
    const totalWidth = Math.max(totalWidthLarge, totalWidthSmall);
    const scaleFactor = (canvas.width * GAME_CONSTANTS.TEXT_WIDTH_FACTOR) / totalWidth;

    const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor;
    const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor;

    const largeTextHeight = 5 * adjustedLargePixelSize;
    const smallTextHeight = 5 * adjustedSmallPixelSize;
    const spaceBetweenLines = 5 * adjustedLargePixelSize;
    const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight;

    let startY = (canvas.height - totalTextHeight) / 2;

    words.forEach((word, wordIndex) => {
      const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize;
      const totalWidth =
        wordIndex === 0
          ? calculateWordWidth(word, adjustedLargePixelSize)
          : words[1].split(" ").reduce((width, w, index) => {
              return (
                width +
                calculateWordWidth(w, adjustedSmallPixelSize) +
                (index > 0 ? GAME_CONSTANTS.WORD_SPACING * adjustedSmallPixelSize : 0)
              );
            }, 0);

      let startX = (canvas.width - totalWidth) / 2;

      if (wordIndex === 1) {
        word.split(" ").forEach((subWord) => {
          subWord.split("").forEach((letter) => {
            const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP];
            if (!pixelMap) return;

            for (let i = 0; i < pixelMap.length; i++) {
              for (let j = 0; j < pixelMap[i].length; j++) {
                if (pixelMap[i][j]) {
                  const x = startX + j * pixelSize;
                  const y = startY + i * pixelSize;
                  gameStateRef.current.pixels.push({ x, y, size: pixelSize, hit: false });
                }
              }
            }
            startX += (pixelMap[0].length + GAME_CONSTANTS.LETTER_SPACING) * pixelSize;
          });
          startX += GAME_CONSTANTS.WORD_SPACING * adjustedSmallPixelSize;
        });
      } else {
        word.split("").forEach((letter) => {
          const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP];
          if (!pixelMap) return;

          for (let i = 0; i < pixelMap.length; i++) {
            for (let j = 0; j < pixelMap[i].length; j++) {
              if (pixelMap[i][j]) {
                const x = startX + j * pixelSize;
                const y = startY + i * pixelSize;
                gameStateRef.current.pixels.push({ x, y, size: pixelSize, hit: false });
              }
            }
          }
          startX += (pixelMap[0].length + GAME_CONSTANTS.LETTER_SPACING) * pixelSize;
        });
      }
      startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0;
    });

    // Initialize ball position
    const ballStartX = canvas.width * GAME_CONSTANTS.BALL_START_X_FACTOR;
    const ballStartY = canvas.height * GAME_CONSTANTS.BALL_START_Y_FACTOR;

    gameStateRef.current.ball = {
      x: ballStartX,
      y: ballStartY,
      dx: -BALL_SPEED,
      dy: BALL_SPEED,
      radius: adjustedLargePixelSize / 2,
    };

    const paddleWidth = adjustedLargePixelSize;
    const paddleLength = 10 * adjustedLargePixelSize;

    gameStateRef.current.paddles = [
      {
        x: 0,
        y: canvas.height / 2 - paddleLength / 2,
        width: paddleWidth,
        height: paddleLength,
        targetY: canvas.height / 2 - paddleLength / 2,
        isVertical: true,
      },
      {
        x: canvas.width - paddleWidth,
        y: canvas.height / 2 - paddleLength / 2,
        width: paddleWidth,
        height: paddleLength,
        targetY: canvas.height / 2 - paddleLength / 2,
        isVertical: true,
      },
      {
        x: canvas.width / 2 - paddleLength / 2,
        y: 0,
        width: paddleLength,
        height: paddleWidth,
        targetY: canvas.width / 2 - paddleLength / 2,
        isVertical: false,
      },
      {
        x: canvas.width / 2 - paddleLength / 2,
        y: canvas.height - paddleWidth,
        width: paddleLength,
        height: paddleWidth,
        targetY: canvas.width / 2 - paddleLength / 2,
        isVertical: false,
      },
    ];
  }, [words]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height || GAME_CONSTANTS.CANVAS_HEIGHT;
    gameStateRef.current.scale = Math.min(
      canvas.width / GAME_CONSTANTS.SCALE_BASE, 
      canvas.height / GAME_CONSTANTS.SCALE_BASE
    );
    initializeGame();
  }, [initializeGame]);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { ball, paddles, pixels } = gameStateRef.current;

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.dy = -ball.dy;
    }
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
      ball.dx = -ball.dx;
    }

    // Ball collision with paddles
    paddles.forEach((paddle) => {
      if (paddle.isVertical) {
        if (
          ball.x - ball.radius < paddle.x + paddle.width &&
          ball.x + ball.radius > paddle.x &&
          ball.y > paddle.y &&
          ball.y < paddle.y + paddle.height
        ) {
          ball.dx = -ball.dx;
        }
      } else {
        if (
          ball.y - ball.radius < paddle.y + paddle.height &&
          ball.y + ball.radius > paddle.y &&
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.width
        ) {
          ball.dy = -ball.dy;
        }
      }
    });

    // Update paddle positions
    paddles.forEach((paddle) => {
      if (paddle.isVertical) {
        paddle.targetY = ball.y - paddle.height / 2;
        paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY));
        paddle.y += (paddle.targetY - paddle.y) * GAME_CONSTANTS.PADDLE_SMOOTHING;
      } else {
        paddle.targetY = ball.x - paddle.width / 2;
        paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY));
        paddle.x += (paddle.targetY - paddle.x) * GAME_CONSTANTS.PADDLE_SMOOTHING;
      }
    });

    // Ball collision with pixels
    pixels.forEach((pixel) => {
      if (
        !pixel.hit &&
        ball.x + ball.radius > pixel.x &&
        ball.x - ball.radius < pixel.x + pixel.size &&
        ball.y + ball.radius > pixel.y &&
        ball.y - ball.radius < pixel.y + pixel.size
      ) {
        pixel.hit = true;
        const centerX = pixel.x + pixel.size / 2;
        const centerY = pixel.y + pixel.size / 2;
        if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
          ball.dx = -ball.dx;
        } else {
          ball.dy = -ball.dy;
        }
      }
    });
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { pixels, ball, paddles } = gameStateRef.current;

    // Clear canvas with theme-aware background
    ctx.fillStyle = themeColors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pixels with theme-aware colors
    pixels.forEach((pixel) => {
      ctx.fillStyle = pixel.hit ? themeColors.muted : themeColors.foreground;
      ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
    });

    // Draw ball with theme-aware color
    ctx.fillStyle = themeColors.primary;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw paddles with theme-aware color
    ctx.fillStyle = themeColors.foreground;
    paddles.forEach((paddle) => {
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    });
  }, [themeColors]);

  const gameLoop = useCallback(() => {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
  }, [updateGame, drawGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    
    // Use ResizeObserver for better canvas sizing
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(canvas);
    
    window.addEventListener("resize", resizeCanvas);
    gameLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      resizeObserver.disconnect();
    };
  }, [resizeCanvas, gameLoop]);

  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <canvas
          ref={canvasRef}
          className="w-full h-96 bg-background rounded-lg border border-border shadow-lg"
          aria-label="Prompting Is All You Need: Interactive Pong game with pixel text"
        />
      </div>
    </section>
  );
};

export default PromptingIsAllYouNeed;
