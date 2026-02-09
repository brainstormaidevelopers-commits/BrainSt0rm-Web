
import React, { useEffect, useRef } from 'react';

const IceBreaker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const W = 320, H = 240;
    const GREEN = "#00ff66";
    const DARK_GREEN = "#004411";
    const BG = "#000000";

    const keys = new Set<string>();
    const pressed = new Set<string>();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keys.has(e.code)) pressed.add(e.code);
      keys.add(e.code);
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"].includes(e.code)) e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const wasPressed = (code: string) => pressed.has(code);

    // Added missing 'now' function to fix the errors on lines 179 and 181.
    const now = () => performance.now();

    // Game state
    const ROW_H = 24;
    const game = { score: 0, lives: 3, gameOver: false, level: 1, t: 0 };
    const player = { x: W/2 - 10, y: H - ROW_H, w: 20, h: ROW_H - 4 };

    interface Entity { x: number; y: number; w: number; speed: number; type: 'agent' | 'tunnel'; label: string; }
    let entities: Entity[] = [];

    function spawnLanes() {
      entities = [];
      // Surveillance Lanes (Bottom-ish)
      for (let i = 1; i <= 3; i++) {
        const speed = (0.5 + Math.random()) * (0.8 + game.level * 0.2) * (i % 2 === 0 ? 1 : -1);
        for (let j = 0; j < 3; j++) {
          entities.push({
            x: j * 120, y: H - (i + 1) * ROW_H,
            w: 60, speed, type: 'agent', label: '[ ICE ]'
          });
        }
      }
      // Encrypted Tunnels (Top-ish)
      for (let i = 5; i <= 7; i++) {
        const speed = (0.4 + Math.random()) * (0.6 + game.level * 0.1) * (i % 2 === 0 ? 1 : -1);
        for (let j = 0; j < 2; j++) {
          entities.push({
            x: j * 180, y: H - (i + 1) * ROW_H,
            w: 100, speed, type: 'tunnel', label: '==== TUNNEL ===='
          });
        }
      }
    }

    function resetPlayer() {
      player.x = W/2 - 10;
      player.y = H - ROW_H;
    }

    function resetGame() {
      game.score = 0; game.lives = 3; game.gameOver = false; game.level = 1;
      resetPlayer(); spawnLanes();
    }

    function update(dt: number) {
      game.t += dt;
      if (wasPressed("ArrowLeft")) player.x -= 24;
      if (wasPressed("ArrowRight")) player.x += 24;
      if (wasPressed("ArrowUp")) player.y -= ROW_H;
      if (wasPressed("ArrowDown")) player.y += ROW_H;

      player.x = Math.max(0, Math.min(W - player.w, player.x));
      player.y = Math.max(0, Math.min(H - ROW_H, player.y));

      let onTunnel = false;
      const row = Math.floor(player.y / ROW_H);

      for (const e of entities) {
        e.x += e.speed;
        if (e.x > W) e.x = -e.w;
        if (e.x < -e.w) e.x = W;

        // Collision
        if (player.x < e.x + e.w && player.x + player.w > e.x && player.y < e.y + ROW_H && player.y + player.w > e.y) {
          if (e.type === 'agent') {
            game.lives--;
            resetPlayer();
            if (game.lives <= 0) game.gameOver = true;
          } else {
            onTunnel = true;
            player.x += e.speed; // Drift with tunnel
          }
        }
      }

      // If in water zone (top lanes) and not on tunnel
      if (row >= 2 && row <= 4) {
        if (!onTunnel) {
          game.lives--; resetPlayer();
          if (game.lives <= 0) game.gameOver = true;
        }
      }

      // Goal
      if (player.y < ROW_H) {
        game.score += 1000;
        game.level++;
        resetPlayer();
        spawnLanes();
      }

      if (wasPressed("Enter") && game.gameOver) resetGame();
      pressed.clear();
    }

    function render() {
      ctx!.fillStyle = BG; ctx!.fillRect(0, 0, W, H);
      
      // Draw background lanes
      for (let i = 0; i < 10; i++) {
        const y = i * ROW_H;
        if (i === 0) ctx!.fillStyle = "#002200"; // Goal
        else if (i === 9) ctx!.fillStyle = "#001100"; // Start
        else if (i >= 2 && i <= 4) ctx!.fillStyle = "#000033"; // Firewall Gap
        else if (i === 5) ctx!.fillStyle = "#111111"; // Median
        else ctx!.fillStyle = BG;
        ctx!.fillRect(0, y, W, ROW_H);
        ctx!.strokeStyle = "rgba(0,255,102,0.1)";
        ctx!.strokeRect(0, y, W, ROW_H);
      }

      // Entities
      ctx!.font = "12px VT323";
      for (const e of entities) {
        ctx!.fillStyle = e.type === 'agent' ? "#ff0000" : DARK_GREEN;
        ctx!.fillRect(e.x, e.y + 2, e.w, ROW_H - 4);
        ctx!.fillStyle = GREEN;
        ctx!.textAlign = "center";
        ctx!.fillText(e.label, e.x + e.w/2, e.y + ROW_H/2 + 4);
      }

      // Player
      ctx!.fillStyle = GREEN;
      ctx!.fillRect(player.x, player.y + 4, player.w, player.h);
      ctx!.fillStyle = BG;
      ctx!.textAlign = "center";
      ctx!.fillText("( @ )", player.x + player.w/2, player.y + ROW_H/2 + 4);

      // HUD
      ctx!.fillStyle = GREEN;
      ctx!.font = "10px VT323";
      ctx!.textAlign = "left";
      ctx!.fillText(`SCORE: ${game.score}  LIVES: ${game.lives}  LVL: ${game.level}`, 10, 10);

      // Game Over
      if (game.gameOver) {
        ctx!.fillStyle = "rgba(0,0,0,0.8)";
        ctx!.fillRect(0, 0, W, H);
        ctx!.fillStyle = GREEN;
        ctx!.font = "24px VT323";
        ctx!.textAlign = "center";
        ctx!.fillText("UPLINK LOST", W/2, H/2 - 10);
        ctx!.font = "12px VT323";
        ctx!.fillText("PRESS ENTER TO RECONNECT", W/2, H/2 + 20);
      }

      // Scanlines
      ctx!.fillStyle = "rgba(0,0,0,0.15)";
      for (let y = 0; y < H; y += 2) ctx!.fillRect(0, y, W, 1);
    }

    let lastTime = now();
    const frame = () => {
      const t = now(); let dt = (t - lastTime) / 1000; lastTime = t;
      if (!game.gameOver) update(dt);
      else if (wasPressed("Enter")) resetGame();
      render();
      requestAnimationFrame(frame);
    };

    resetGame();
    frame();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return <canvas ref={canvasRef} width="320" height="240" className="w-full max-w-[640px] aspect-[4/3] bg-black image-render-pixelated border border-green-900" />;
};

export default IceBreaker;