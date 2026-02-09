import React, { useEffect, useRef, useState } from 'react';

const DecouplerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 320, H = 240, GRID = 20;
    const GREEN = "#00ff66";
    const BG = "#000000";

    const keys = new Set<string>();
    const handleKeyDown = (e: KeyboardEvent) => { keys.add(e.code); if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.code)) e.preventDefault(); };
    const handleKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Grid-based sokoban-ish logic
    let player = { x: 5, y: 5 };
    let blocks = [{ x: 8, y: 5 }, { x: 5, y: 8 }];
    let targets = [{ x: 12, y: 5 }, { x: 5, y: 10 }];
    let walls = [{ x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }];

    function draw() {
      ctx!.fillStyle = BG; ctx!.fillRect(0, 0, W, H);
      
      // Grid help
      ctx!.strokeStyle = "rgba(0,255,102,0.05)";
      for(let i=0; i<W; i+=GRID) { ctx!.beginPath(); ctx!.moveTo(i,0); ctx!.lineTo(i,H); ctx!.stroke(); }
      for(let i=0; i<H; i+=GRID) { ctx!.beginPath(); ctx!.moveTo(0,i); ctx!.lineTo(W,i); ctx!.stroke(); }

      // Targets (Nodes)
      ctx!.fillStyle = "rgba(0,255,102,0.2)";
      for(const t of targets) ctx!.fillRect(t.x*GRID, t.y*GRID, GRID, GRID);

      // Blocks (Data)
      ctx!.fillStyle = "#ffffff";
      for(const b of blocks) {
        ctx!.fillRect(b.x*GRID + 2, b.y*GRID + 2, GRID - 4, GRID - 4);
        ctx!.strokeStyle = GREEN; ctx!.strokeRect(b.x*GRID + 2, b.y*GRID + 2, GRID - 4, GRID - 4);
      }

      // Walls (Silos)
      ctx!.fillStyle = "#333333";
      for(const w of walls) ctx!.fillRect(w.x*GRID, w.y*GRID, GRID, GRID);

      // Player
      ctx!.fillStyle = GREEN;
      ctx!.fillRect(player.x*GRID, player.y*GRID, GRID, GRID);
    }

    function move(dx: number, dy: number) {
      let nx = player.x + dx, ny = player.y + dy;
      if (walls.some(w => w.x === nx && w.y === ny)) return;

      let blockIdx = blocks.findIndex(b => b.x === nx && b.y === ny);
      if (blockIdx !== -1) {
        let bnx = nx + dx, bny = ny + dy;
        if (walls.some(w => w.x === bnx && w.y === bny) || blocks.some(b => b.x === bnx && b.y === bny)) return;
        blocks[blockIdx].x = bnx; blocks[blockIdx].y = bny;
      }
      player.x = nx; player.y = ny;
      draw();
      
      if (targets.every(t => blocks.some(b => b.x === t.x && b.y === t.y))) {
        alert("NODE DECOUPLED // UPLINK SECURE");
        player = { x: 5, y: 5 }; blocks = [{ x: 8, y: 5 }, { x: 5, y: 8 }];
      }
    }

    const interval = setInterval(() => {
      if (keys.has("ArrowLeft")) { move(-1, 0); keys.delete("ArrowLeft"); }
      if (keys.has("ArrowRight")) { move(1, 0); keys.delete("ArrowRight"); }
      if (keys.has("ArrowUp")) { move(0, -1); keys.delete("ArrowUp"); }
      if (keys.has("ArrowDown")) { move(0, 1); keys.delete("ArrowDown"); }
    }, 150);

    draw();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(interval);
    };
  }, []);

  return <canvas ref={canvasRef} width="320" height="240" className="w-full max-w-[640px] aspect-[4/3] bg-black" />;
};

export default DecouplerGame;