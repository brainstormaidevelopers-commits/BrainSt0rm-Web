import React, { useEffect, useRef } from 'react';

const GalagaGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const W = 320, H = 240;
    const GREEN = "#00ff66";
    const DIM_GREEN = "rgba(0,255,102,0.35)";
    const BG = "#000000";

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const now = () => performance.now();

    const keys = new Set<string>();
    const pressed = new Set<string>(); 

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keys.has(e.code)) pressed.add(e.code);
      keys.add(e.code);
      if (["ArrowLeft","ArrowRight","Space","KeyZ","KeyX","Enter"].includes(e.code)) e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const isDown = (code: string) => keys.has(code);
    const wasPressed = (code: string) => pressed.has(code);

    function drawScanlines() {
      ctx!.fillStyle = "rgba(0,0,0,0.22)";
      for (let y = 0; y < H; y += 2) ctx!.fillRect(0, y, W, 1);
    }

    function glowRect(x: number, y: number, w: number, h: number) {
      ctx!.fillStyle = DIM_GREEN;
      ctx!.fillRect(x-1, y-1, w+2, h+2);
      ctx!.fillStyle = GREEN;
      ctx!.fillRect(x, y, w, h);
    }

    function glowLine(x1: number, y1: number, x2: number, y2: number) {
      ctx!.strokeStyle = DIM_GREEN;
      ctx!.lineWidth = 3;
      ctx!.beginPath(); ctx!.moveTo(x1,y1); ctx!.lineTo(x2,y2); ctx!.stroke();
      ctx!.strokeStyle = GREEN;
      ctx!.lineWidth = 1;
      ctx!.beginPath(); ctx!.moveTo(x1,y1); ctx!.lineTo(x2,y2); ctx!.stroke();
    }

    const stars = Array.from({ length: 70 }, () => ({
      x: Math.floor(rand(0, W)),
      y: Math.floor(rand(0, H)),
      s: rand(0.3, 1.2),
    }));

    function updateStars(dt: number) {
      for (const st of stars) {
        st.y += (18 + st.s * 25) * dt;
        if (st.y >= H) { st.y = 0; st.x = Math.floor(rand(0, W)); st.s = rand(0.3, 1.2); }
      }
    }

    function drawStars() {
      for (const st of stars) {
        const b = st.s > 0.9 ? GREEN : "rgba(0,255,102,0.6)";
        ctx!.fillStyle = b;
        ctx!.fillRect(st.x, st.y, 1, 1);
      }
    }

    const game = { running: true, gameOver: false, t: 0, score: 0, hi: 482900, lives: 3, bombs: 2, wave: 1, shake: 0, freeze: 0 };
    const player = { x: W/2, y: H - 18, w: 12, h: 8, vx: 0, cooldown: 0, invuln: 0 };
    let bullets: any[] = [];
    let enemyBullets: any[] = [];
    let particles: any[] = [];
    let enemies: any[] = [];

    function resetGame() {
      game.running = true; game.gameOver = false; game.t = 0; game.score = 0; game.lives = 3; game.bombs = 2; game.wave = 1; game.shake = 0; game.freeze = 0;
      player.x = W/2; player.y = H - 18; player.cooldown = 0; player.invuln = 1.2;
      bullets = []; enemyBullets = []; particles = []; enemies = [];
      spawnWave(game.wave);
    }

    function spawnWave(wave: number) {
      const cols = 6;
      const rows = 3 + Math.min(2, Math.floor((wave-1)/2));
      const startX = 60, startY = 40, dx = 34, dy = 20;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          enemies.push({
            x: startX + c * dx, y: startY + r * dy,
            hx: startX + c * dx, hy: startY + r * dy,
            w: r === 0 ? 14 : 12, h: 10,
            type: r === 0 ? "leader" : (r === 1 ? "fighter" : "drone"),
            hp: r === 0 ? 2 : 1, phase: rand(0, Math.PI*2),
            dive: false, diveT: 0, fireT: rand(0.6, 2.1), alive: true,
          });
        }
      }
    }

    function rectsOverlap(a: any, b: any) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function spawnBurst(x: number, y: number, n=10) {
      for (let i=0;i<n;i++) {
        particles.push({
          x, y,
          vx: rand(-60, 60), vy: rand(-80, 40),
          life: rand(0.25, 0.55), t: 0, sz: Math.random() < 0.7 ? 1 : 2,
        });
      }
    }

    function award(type: string) {
      if (type === "leader") game.score += 120;
      else if (type === "fighter") game.score += 80;
      else game.score += 50;
      game.hi = Math.max(game.hi, game.score);
    }

    function enemyFire(e: any) {
      enemyBullets.push({
        x: e.x + e.w/2 - 1, y: e.y + e.h,
        w: 2, h: 6, vx: rand(-10, 10), vy: 95 + game.wave*6,
      });
    }

    function update(dt: number) {
      game.t += dt; updateStars(dt);
      const speed = 120;
      let ax = 0;
      if (isDown("ArrowLeft")) ax -= 1;
      if (isDown("ArrowRight")) ax += 1;
      player.vx = ax * speed;
      player.x += player.vx * dt;
      player.x = clamp(player.x, 8, W - player.w - 8);
      player.cooldown -= dt;
      if (isDown("KeyZ") && player.cooldown <= 0) {
        bullets.push({ x: player.x + player.w/2 - 1, y: player.y - 6, w: 2, h: 6, vx: 0, vy: -220 });
        player.cooldown = 0.12;
      }
      if (wasPressed("KeyX") && game.bombs > 0) {
        game.bombs--; enemyBullets = []; game.shake = 0.25;
        spawnBurst(player.x + player.w/2, player.y, 18);
        for (const e of enemies) {
          if (!e.alive) continue;
          const d2 = Math.pow((e.x+e.w/2)-(player.x+player.w/2),2) + Math.pow((e.y+e.h/2)-(player.y+player.h/2),2);
          if (d2 < 140*140) { e.hp -= 1; if (e.hp <= 0) { e.alive = false; award(e.type); spawnBurst(e.x+e.w/2, e.y+e.h/2, 12); } }
        }
      }
      if (player.invuln > 0) player.invuln -= dt;
      bullets = bullets.filter(b => { b.y += b.vy * dt; return b.y > -12; });
      enemyBullets = enemyBullets.filter(b => { b.y += b.vy * dt; return b.y < H + 12; });

      const drift = Math.sin(game.t * 0.9) * (10 + Math.min(18, game.wave*0.8));
      for (const e of enemies) {
        if (!e.alive) continue;
        if (!e.dive) {
          e.x += (e.hx + drift - e.x) * (1 - Math.pow(0.001, dt));
          e.y += (e.hy + Math.sin(game.t * 2 + e.phase) * (6 + Math.min(10, game.wave * 0.6)) - e.y) * (1 - Math.pow(0.001, dt));
          if (Math.random() < (e.type === "leader" ? 0.003 : 0.001) * (1 + game.wave*0.1)) e.dive = true;
        } else {
          e.diveT += dt; e.x += Math.sin(e.diveT * 6) * (38 + game.wave*2) * dt; e.y += (60 + game.wave*12) * dt;
          e.fireT -= dt; if (e.fireT <= 0) { enemyFire(e); e.fireT = rand(0.35, 0.95); }
          if (e.y > H - 80 && e.diveT > 1.1) { e.dive = false; e.diveT = 0; e.y = rand(18, 40); }
        }
        if (e.dive && rectsOverlap(e, player)) { e.alive = false; award(e.type); spawnBurst(e.x+e.w/2, e.y+e.h/2, 18); killPlayer(); }
      }
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        for (const e of enemies) {
          if (e.alive && rectsOverlap(b, e)) {
            e.hp--; spawnBurst(b.x, b.y, 6);
            if (e.hp <= 0) { e.alive = false; award(e.type); game.shake = 0.12; spawnBurst(e.x+e.w/2, e.y+e.h/2, 14); }
            bullets.splice(i, 1); break;
          }
        }
      }
      for (const b of enemyBullets) { if (rectsOverlap(b, player)) { killPlayer(); break; } }
      particles = particles.filter(p => { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 120 * dt; return p.t < p.life; });
      if (enemies.every(e => !e.alive)) { game.wave++; game.bombs = Math.min(4, game.bombs + 1); spawnWave(game.wave); }
      if (wasPressed("Enter") && (game.gameOver || !game.running)) resetGame();
      if (game.shake > 0) game.shake = Math.max(0, game.shake - dt);
    }

    function killPlayer() {
      if (player.invuln > 0) return;
      game.lives--; game.shake = 0.35; game.freeze = 0.08;
      spawnBurst(player.x + player.w/2, player.y + player.h/2, 22);
      player.invuln = 1.3; player.x = W/2;
      if (game.lives < 0) { game.gameOver = true; game.running = false; }
    }

    function render() {
      const sx = game.shake > 0 ? Math.floor(rand(-3, 3) * game.shake * 10) : 0;
      const sy = game.shake > 0 ? Math.floor(rand(-2, 2) * game.shake * 10) : 0;
      ctx!.save(); ctx!.translate(sx, sy);
      ctx!.fillStyle = BG; ctx!.fillRect(-sx, -sy, W, H);
      drawStars();
      ctx!.fillStyle = GREEN; ctx!.font = "10px VT323"; ctx!.textBaseline = "top";
      ctx!.fillText(`SCORE ${String(game.score).padStart(6,"0")}  HI ${String(game.hi).padStart(6,"0")}`, 8, 6);
      ctx!.fillText(`WAVE ${game.wave}  LIVES ${Math.max(0,game.lives)}  BOMBS ${game.bombs}`, 8, 18);
      for (const e of enemies) {
        if (!e.alive) continue;
        const x = Math.floor(e.x), y = Math.floor(e.y);
        if (e.type === "leader") { glowRect(x + 2, y + 2, e.w - 4, 2); glowRect(x + 0, y + 4, e.w, 3); glowRect(x + 6, y + 0, 2, 2); }
        else if (e.type === "fighter") { glowRect(x + 4, y + 2, e.w - 8, 2); glowRect(x + 2, y + 4, e.w - 4, 3); }
        else { glowRect(x + 1, y + 2, e.w - 2, 6); ctx!.fillStyle = "#000"; ctx!.fillRect(x + 5, y + 4, 2, 2); ctx!.fillStyle = GREEN; ctx!.fillRect(x + 6, y + 4, 1, 1); }
      }
      for (const b of bullets) glowRect(b.x, b.y, b.w, b.h);
      for (const b of enemyBullets) { ctx!.fillStyle = "rgba(0,255,102,0.65)"; ctx!.fillRect(b.x, b.y, b.w, b.h); }
      if (!(player.invuln > 0 && Math.floor(game.t * 12) % 2 === 0)) {
        const x = Math.floor(player.x), y = Math.floor(player.y);
        glowRect(x + 5, y + 1, 2, 6); glowRect(x + 0, y + 6, 12, 2); glowLine(x + 0, y + 7, x + 4, y + 3); glowLine(x + 11, y + 7, x + 7, y + 3);
      }
      for (const p of particles) { ctx!.fillStyle = `rgba(0,255,102,${0.15 + 0.7*(1-(p.t/p.life))})`; ctx!.fillRect(p.x, p.y, p.sz, p.sz); }
      drawScanlines();
      if (game.gameOver) {
        ctx!.fillStyle = "rgba(0,0,0,0.6)"; ctx!.fillRect(0, 0, W, H);
        ctx!.fillStyle = GREEN; ctx!.font = "24px VT323"; ctx!.textAlign = "center";
        ctx!.fillText("GAME OVER", W/2, H/2 - 10); ctx!.font = "12px VT323";
        ctx!.fillText("PRESS ENTER TO RESTART", W/2, H/2 + 20); ctx!.textAlign = "left";
      }
      ctx!.restore();
    }

    let lastTime = now();
    const frame = () => {
      const t = now(); let dt = (t - lastTime) / 1000; lastTime = t;
      dt = Math.min(dt, 1/20);
      if (game.freeze > 0) { game.freeze -= dt; dt *= 0.25; }
      pressed.clear();
      if (game.running) update(dt);
      render();
      if (game.running || game.gameOver) requestAnimationFrame(frame);
    };
    resetGame();
    frame();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      game.running = false;
    };
  }, []);

  return <canvas ref={canvasRef} width="320" height="240" className="w-full max-w-[640px] aspect-[4/3] bg-black image-render-pixelated cursor-none" />;
};

export default GalagaGame;