/* ===== ĐỘNG CƠ MÔ PHỎNG 3D ISOMETRIC & LINH VẬT CÚ ĐÊM SVG ===== */

function owl(s, w) {
  s = s || 120; if (w === undefined) w = true;
  return '<svg viewBox="0 0 200 200" width="' + s + '" height="' + s + '" aria-label="Cú Đêm">' +
    '<polygon points="52,60 44,22 82,48" fill="#9C7BEF"/><polygon points="148,60 156,22 118,48" fill="#9C7BEF"/>' +
    '<ellipse cx="100" cy="122" rx="64" ry="64" fill="#B79CF5" stroke="#2D2A4A" stroke-width="4"/>' +
    '<ellipse cx="100" cy="146" rx="38" ry="40" fill="#FFF1D6"/>' +
    '<g fill="#9C7BEF" stroke="#2D2A4A" stroke-width="3"><ellipse cx="40" cy="135" rx="14" ry="28"/><ellipse class="' + (w ? 'wave' : '') + '" cx="164" cy="132" rx="14" ry="28"/></g>' +
    '<circle cx="72" cy="98" r="24" fill="#fff" stroke="#2D2A4A" stroke-width="5"/><circle cx="128" cy="98" r="24" fill="#fff" stroke="#2D2A4A" stroke-width="5"/>' +
    '<line x1="96" y1="98" x2="104" y2="98" stroke="#2D2A4A" stroke-width="5"/>' +
    '<g class="blink"><circle cx="74" cy="100" r="10" fill="#2D2A4A"/><circle cx="126" cy="100" r="10" fill="#2D2A4A"/><circle cx="77" cy="96" r="3" fill="#fff"/><circle cx="129" cy="96" r="3" fill="#fff"/></g>' +
    '<polygon points="93,116 107,116 100,130" fill="#FFB84D" stroke="#2D2A4A" stroke-width="3"/>' +
    '<polygon points="48,52 100,30 152,52 100,72" fill="#2D2A4A"/><rect x="76" y="58" width="48" height="14" fill="#2D2A4A"/>' +
    '<line x1="152" y1="52" x2="156" y2="82" stroke="#FFC933" stroke-width="3"/><circle cx="156" cy="85" r="5" fill="#FFC933"/>' +
    '<g fill="#FFB84D" stroke="#2D2A4A" stroke-width="3"><ellipse cx="80" cy="186" rx="14" ry="6"/><ellipse cx="120" cy="186" rx="14" ry="6"/></g></svg>';
}

function rgb(c, k) {
  return 'rgb(' + c.map(function(v) { return Math.min(255, (v * k) | 0); }).join(',') + ')';
}

function box(x, y, z, w, h, d, c) {
  var a = x - w / 2, b = x + w / 2, z0 = z - d / 2, z1 = z + d / 2, y1 = y + h;
  var faces = [
    [[[a, y1, z0], [b, y1, z0], [b, y1, z1], [a, y1, z1]], c, 1.12],
    [[[a, y, z0], [b, y, z0], [b, y1, z0], [a, y1, z0]], c, 0.9],
    [[[a, y, z1], [b, y, z1], [b, y1, z1], [a, y1, z1]], c, 0.7],
    [[[a, y, z0], [a, y, z1], [a, y1, z1], [a, y1, z0]], c, 0.8],
    [[[b, y, z0], [b, y, z1], [b, y1, z1], [b, y1, z0]], c, 0.6]
  ];
  return faces.map(function(f) { return { v: f[0], col: rgb(f[1], f[2]) }; });
}

function scene(type, t, p) {
  var o = { polys: [], dots: [], txt: [] };
  var hash = function(n) { return ((n * 9301 + 49297) % 233280) / 233280; };
  if (type === 'dice_3d') {
    var s = 60; o.polys = box(0, -s, 0, 2 * s, 2 * s, 2 * s, [255, 236, 160]);
    [['1', [0, 0, -s]], ['6', [0, 0, s]], ['3', [-s, 0, 0]], ['4', [s, 0, 0]], ['2', [0, s, 0]], ['5', [0, -s, 0]]].forEach(function(f) { o.txt.push({ t: f[0], p: f[1] }); });
  } else if (type === 'factory_3d') {
    var pr = p.p || 0.1; o.polys = box(0, -16, 0, 460, 16, 80, [130, 130, 160]);
    for (var k = 0; k < 8; k++) {
      var u = k * 60 + t * 50, id = k + 8 * Math.floor(u / 480), x = (u % 480) - 240, bad = hash(id + 1) < pr * 2.2;
      o.polys.push.apply(o.polys, box(x, 0, 0, 32, 28, 32, bad ? [255, 120, 130] : [120, 225, 175]));
    }
    o.polys.push.apply(o.polys, box(0, 0, -44, 6, 70, 6, [255, 220, 90]));
    o.polys.push.apply(o.polys, box(0, 0, 44, 6, 70, 6, [255, 220, 90]));
    o.polys.push.apply(o.polys, box(0, 64, 0, 6, 6, 94, [255, 220, 90]));
  } else if (type === 'bellcurve_3d') {
    var s2 = Math.max(0.3, (p.sigma || 15) / 15);
    for (var i = -6; i <= 6; i++) for (var j = -3; j <= 3; j++) {
      var h = (150 / Math.sqrt(s2)) * Math.exp(-i * i / (8 * s2 * s2)) * Math.exp(-j * j / 6) * (1 + 0.08 * Math.sin(t * 3 + i + j)) + 4;
      var k2 = Math.min(1, h / 150);
      o.polys.push.apply(o.polys, box(i * 26, 0, j * 26, 22, h, 22, [(180 - 70 * k2) | 0, (150 + 80 * k2) | 0, (255 - 60 * k2) | 0]));
    }
  } else if (type === 'medical_3d') {
    var pr2 = p.p || 0.2;
    for (var m = 0; m < 70; m++) {
      var y = 1 - 2 * m / 69, r = Math.sqrt(Math.max(0, 1 - y * y)), a = m * 2.4 + t * 0.5;
      o.dots.push({ p: [95 * r * Math.cos(a), 95 * y, 95 * r * Math.sin(a)], r: 8, c: hash(m + 3) < pr2 ? '#FF7A8A' : '#8FF0C8' });
    }
  } else if (type === 'queue_3d') {
    o.polys = box(0, -30, -70, 120, 60, 60, [190, 170, 255]);
    for (var qk = 0; qk < 8; qk++) {
      var qu = (qk * 70 + t * 60) % 560;
      o.polys.push.apply(o.polys, box(-280 + qu, -10, 40, 26, 26, 26, [255, 200, 120]));
    }
  } else if (type === 'sampling_3d') {
    for (var sk = 0; sk < 60; sk++) {
      var sy = 1 - 2 * sk / 59, sr = Math.sqrt(Math.max(0, 1 - sy * sy)), sa = sk * 2.4 + t * 0.4, hi = hash(sk) < 0.18;
      o.dots.push({ p: [120 * sr * Math.cos(sa), 120 * sy, 120 * sr * Math.sin(sa)], r: hi ? 11 : 6, c: hi ? '#FFD166' : '#B79CF5' });
    }
    o.txt.push({ t: 'x̄', p: [0, -140, 0] });
  } else if (type === 'abtest_3d') {
    var hA = 90 + 30 * Math.sin(t), hB = 115 + 30 * Math.cos(t);
    o.polys.push.apply(o.polys, box(-90, 0, 0, 90, hA, 50, [120, 225, 175]));
    o.polys.push.apply(o.polys, box(90, 0, 0, 90, hB, 50, [255, 150, 160]));
    o.txt.push({ t: 'A', p: [-90, hA + 20, 0] }, { t: 'B', p: [90, hB + 20, 0] });
  } else if (type === 'dice_cards_3d') {
    for (var ci = 0; ci < 5; ci++) {
      o.polys.push.apply(o.polys, box(ci * 44 - 88, Math.sin(t * 2 + ci) * 12, 0, 34, 52, 4, ci % 2 ? [255, 236, 160] : [255, 210, 220]));
    }
  } else {
    for (var fi = 0; fi < 10; fi++) {
      var fh = (40 + 85 * Math.abs(Math.sin(fi * 1.3 + 1))) * (1 + 0.12 * Math.sin(t * 2 + fi));
      o.polys.push.apply(o.polys, box(fi * 38 - 170, 0, 0, 26, fh, 40, fi % 3 !== 0 ? [120, 225, 175] : [255, 150, 160]));
    }
  }
  return o;
}

function draw(c, dt) {
  var g = c.getContext('2d'), q = QM[c.dataset.q]; if (!q) return;
  if (c.__run !== false) c.__t = (c.__t || 0) + dt;
  var t = c.__t || 0, W = c.width, H = c.height;
  var sc = scene(q.viz, t, q.vp || {});
  var ry = (c.__ry || 0) + (q.viz === 'dice_3d' ? t * 0.8 : Math.sin(t * 0.4) * 0.5 + 0.4), rx = 0.5;
  var P = function(v) {
    var x = v[0], y = v[1], z = v[2], co = Math.cos(ry), si = Math.sin(ry);
    var nx = x * co + z * si, nz = -x * si + z * co; x = nx; z = nz;
    co = Math.cos(rx); si = Math.sin(rx);
    var ny = y * co + z * si; nz = -y * si + z * co; y = ny; z = nz;
    var f = 420 / (420 + z);
    return [W / 2 + x * f, H * 0.62 - y * f, z, f];
  };
  var items = [];
  sc.polys.forEach(function(f) {
    var pp = f.v.map(P);
    items.push({
      z: pp.reduce(function(s, a) { return s + a[2]; }, 0) / 4,
      fn: function() {
        g.beginPath();
        pp.forEach(function(a, i) { if (i) g.lineTo(a[0], a[1]); else g.moveTo(a[0], a[1]); });
        g.closePath(); g.fillStyle = f.col; g.fill();
        g.strokeStyle = 'rgba(45,42,74,.6)'; g.stroke();
      }
    });
  });
  sc.dots.forEach(function(d) {
    var a = P(d.p);
    items.push({ z: a[2], fn: function() { g.beginPath(); g.arc(a[0], a[1], Math.max(2, d.r * a[3]), 0, 7); g.fillStyle = d.c; g.fill(); } });
  });
  sc.txt.forEach(function(d) {
    var a = P(d.p);
    items.push({ z: a[2] - 1, fn: function() { g.fillStyle = '#FFF1B8'; g.font = '900 32px Nunito'; g.textAlign = 'center'; g.fillText(d.t, a[0], a[1] + 10); } });
  });
  g.clearRect(0, 0, W, H);
  items.sort(function(a, b) { return b.z - a.z; }).forEach(function(i) { i.fn(); });
  g.fillStyle = '#fff'; g.font = '800 14px Nunito'; g.textAlign = 'left';
  g.fillText('🎲 ' + ((q.vp && q.vp.label) || 'Mô phỏng 3D') + ' · Kéo chuột để xoay góc nhìn', 12, H - 12);
}

var lastT = performance.now();
function loop(n) {
  var dt = Math.min(0.05, (n - lastT) / 1000); lastT = n;
  document.querySelectorAll('canvas.sc').forEach(function(c) { try { draw(c, dt); } catch (e) {} });
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

var drag = null;
document.addEventListener('pointerdown', function(e) { if (e.target.classList && e.target.classList.contains('sc')) drag = { c: e.target, x: e.clientX }; });
window.addEventListener('pointermove', function(e) { if (drag) { drag.c.__ry = (drag.c.__ry || 0) + (e.clientX - drag.x) * 0.01; drag.x = e.clientX; } });
window.addEventListener('pointerup', function() { drag = null; });

function runT(id) {
  var c = document.querySelector('canvas[data-q="' + id + '"]'); if (!c) return;
  c.__run = (c.__run === false);
  var btn = document.getElementById('rb_' + id);
  if (btn) btn.textContent = c.__run ? '⏸ Dừng' : '▶ Chạy 3D';
}
