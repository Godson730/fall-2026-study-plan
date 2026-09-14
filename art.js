/* Course illustrations drawn as inline SVG. Colours come from CSS (the course colour --cc and the theme inks),
   so every scene works in light and dark mode and offline. Scenes change with the week's topic. */
(function (root) {
  "use strict";

  var DEG = Math.PI / 180;
  function f(n) { return Math.round(n * 10) / 10; }
  function line(x1, y1, x2, y2, cls) {
    return '<line class="' + (cls || "ln") + '" x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '"/>';
  }
  function path(d, cls) { return '<path class="' + (cls || "ln") + '" d="' + d + '"/>'; }
  function circle(cx, cy, r, cls) { return '<circle class="' + (cls || "ln") + '" cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '"/>'; }
  function rect(x, y, w, h, rx, cls) {
    return '<rect class="' + (cls || "ln") + '" x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '" rx="' + f(rx) + '"/>';
  }
  function text(x, y, s, cls, anchor) {
    return '<text class="' + (cls || "tx") + '" x="' + f(x) + '" y="' + f(y) + '"' + (anchor ? ' text-anchor="' + anchor + '"' : "") + ">" + s + "</text>";
  }
  function poly(pts, cls, closed) {
    return "<" + (closed ? "polygon" : "polyline") + ' class="' + (cls || "ln") + '" points="' +
      pts.map(function (p) { return f(p[0]) + "," + f(p[1]); }).join(" ") + '"/>';
  }
  function sample(fn, x0, x1, step) {
    var d = "";
    for (var x = x0; x <= x1 + 0.001; x += step) d += (d ? " L" : "M") + f(x) + " " + f(fn(x));
    return d;
  }
  function head(x, y, angle, fill, size) {
    size = size || 7;
    return poly([[x, y],
      [x - size * Math.cos(angle - 0.45), y - size * Math.sin(angle - 0.45)],
      [x - size * Math.cos(angle + 0.45), y - size * Math.sin(angle + 0.45)]], fill, true);
  }
  /* Straight arrow: stroke class plus a matching filled head. */
  function arrow(x1, y1, x2, y2, stroke, fill, size) {
    var a = Math.atan2(y2 - y1, x2 - x1), s = size || 7;
    return line(x1, y1, x2 - s * 0.6 * Math.cos(a), y2 - s * 0.6 * Math.sin(a), stroke || "ln") + head(x2, y2, a, fill || "fl", s);
  }
  /* Curved (mechanism-style) arrow along a quadratic curve. */
  function curved(x1, y1, cx, cy, x2, y2, stroke, fill) {
    var a = Math.atan2(y2 - cy, x2 - cx);
    return path("M" + x1 + " " + y1 + " Q" + cx + " " + cy + " " + f(x2 - 4 * Math.cos(a)) + " " + f(y2 - 4 * Math.sin(a)), stroke || "ln") + head(x2, y2, a, fill || "fl", 7);
  }
  function hexPts(cx, cy, r) {
    var pts = [];
    for (var i = 0; i < 6; i++) pts.push([cx + r * Math.cos(i * 60 * DEG), cy + r * Math.sin(i * 60 * DEG)]);
    return pts;
  }
  function axes(label, xLabel) {
    return line(24, 12, 24, 98, "ln2") + line(24, 98, 304, 98, "ln2") +
      text(30, 18, label, "tx") + text(302, 108, xLabel, "tx", "end");
  }

  /* ---------------- CHEM*1050 ---------------- */

  function energyDiagram() {
    var base = function (x) { return 64 + 22 / (1 + Math.exp(-(x - 170) / 14)); };
    var y = function (x) { return base(x) - 44 * Math.exp(-Math.pow((x - 165) / 30, 2)); };
    var peak = y(165);
    return axes("E", "reaction progress") +
      path(sample(y, 34, 298, 2), "ln thick") +
      line(34, 64, 150, 64, "ln2 dash") +
      arrow(116, 64, 116, peak + 3, "lnb", "flb", 6) + text(124, 48, "Ea", "txc") +
      text(165, peak - 6, "‡", "txc", "middle") +
      line(196, 64, 282, 64, "ln2 dash") +
      arrow(276, 64, 276, 84, "lnb", "flb", 6) + text(284, 78, "ΔH", "txc");
  }

  function rateCurve() {
    var A = function (x) { return 98 - 74 * Math.exp(-(x - 26) / 62); };
    var P = function (x) { return 24 + 74 * Math.exp(-(x - 26) / 62); };
    var th = 26 + 62 * Math.LN2;
    return axes("[ ]", "time") +
      path(sample(P, 26, 298, 2), "ln2") + path(sample(A, 26, 298, 2), "ln thick") +
      line(th, 98, th, A(th), "ln2 dash") + line(24, A(th), th, A(th), "ln2 dash") +
      circle(th, A(th), 3.5, "fl") + text(th + 6, 92, "t½", "txc") +
      text(298, 36, "product", "tx", "end") + text(298, 90, "[A]", "txc", "end");
  }

  function galvanicCell() {
    return path("M40 46 V100 H122 V46", "lnb") + path("M198 46 V100 H280 V46", "lnb") +
      rect(41, 62, 80, 37, 0, "fla") + rect(199, 62, 80, 37, 0, "fla") +
      rect(74, 30, 10, 58, 1.5, "flb") + rect(236, 30, 10, 58, 1.5, "fls") +
      path("M79 30 V16 H147", "lnb") + path("M173 16 H241 V30", "lnb") +
      circle(160, 16, 12, "fls") + text(160, 20, "V", "txc", "middle") +
      path("M104 76 V42 H216 V76", "ln thick") +
      arrow(104, 26, 138, 26, "ln", "fl", 6) + text(98, 30, "e⁻", "txc", "end") +
      text(56, 94, "Zn", "tx", "middle") + text(262, 94, "Cu", "tx", "middle");
  }

  /* ---------------- CHEM*2700 ---------------- */

  function aromaticAcid() {
    var s = poly(hexPts(70, 58, 26), "lnb", true) + circle(70, 58, 15, "lnb");
    s += poly([[96, 58], [118, 45], [140, 58], [162, 45]], "lnb");
    s += line(159, 43, 159, 22, "lnb") + line(165, 43, 165, 22, "lnb") + text(162, 17, "O", "txc", "middle");
    s += line(162, 45, 184, 58, "lnb") + text(188, 62, "OH", "txc");
    var cx = 272, cy = 58;
    s += circle(cx, cy, 22, "ln");
    [-90, 30, 150].forEach(function (a) { s += line(cx, cy, cx + 30 * Math.cos(a * DEG), cy + 30 * Math.sin(a * DEG), "lnb"); });
    [-30, 90, 210].forEach(function (a) {
      s += line(cx + 22 * Math.cos(a * DEG), cy + 22 * Math.sin(a * DEG), cx + 34 * Math.cos(a * DEG), cy + 34 * Math.sin(a * DEG), "ln");
    });
    return s;
  }

  function sn2State() {
    return path("M72 18 H64 V100 H72", "lnb") + path("M248 18 H256 V100 H248", "lnb") + text(262, 24, "‡", "txc") +
      line(160, 60, 160, 28, "lnb") + line(160, 60, 136, 84, "lnb") + line(160, 60, 184, 84, "lnb") +
      circle(160, 60, 3.5, "flb") +
      text(160, 22, "H", "tx", "middle") + text(130, 96, "H", "tx", "middle") + text(190, 96, "H", "tx", "middle") +
      line(106, 60, 152, 60, "ln dash") + line(168, 60, 212, 60, "ln dash") +
      text(100, 64, "Nu", "txc", "end") + text(216, 64, "Br", "txc") +
      text(86, 48, "δ−", "tx", "middle") + text(228, 48, "δ−", "tx", "middle");
  }

  function bromonium() {
    return line(128, 74, 192, 74, "lnb") + line(128, 74, 152, 42, "lnb") + line(192, 74, 168, 42, "lnb") +
      text(160, 38, "Br", "txc", "middle") + text(176, 26, "+", "txc") +
      line(128, 74, 100, 58, "lnb") + line(128, 74, 100, 90, "lnb") +
      line(192, 74, 220, 58, "lnb") + line(192, 74, 220, 90, "lnb") +
      text(254, 104, "Br⁻", "txc", "middle") +
      curved(244, 92, 236, 70, 200, 80, "ln", "fl") +
      text(24, 102, "anti addition", "tx");
  }

  function eas() {
    var c = [120, 60], pts = hexPts(120, 60, 30), s = poly(pts, "lnb", true);
    [0, 2, 4].forEach(function (i) {
      var p = pts[i], q = pts[(i + 1) % 6];
      s += line(c[0] + (p[0] - c[0]) * 0.76, c[1] + (p[1] - c[1]) * 0.76, c[0] + (q[0] - c[0]) * 0.76, c[1] + (q[1] - c[1]) * 0.76, "lnb");
    });
    return s + curved(138, 70, 186, 96, 222, 52, "ln", "fl") + text(240, 44, "NO₂⁺", "txc", "middle") +
      text(240, 96, "E⁺ adds", "tx", "middle");
  }

  function carbonylAddition() {
    return line(113, 62, 113, 34, "lnb") + line(119, 62, 119, 34, "lnb") + text(116, 28, "O", "txc", "middle") +
      line(116, 66, 94, 84, "lnb") + line(116, 66, 138, 84, "lnb") +
      text(88, 98, "R", "tx", "middle") + text(144, 98, "R", "tx", "middle") +
      text(46, 50, "Nu⁻", "txc", "middle") + curved(58, 56, 76, 84, 108, 70, "ln", "fl") +
      arrow(168, 60, 204, 60, "lnb", "flb", 6) +
      line(256, 66, 256, 38, "lnb") + text(256, 30, "O⁻", "txc", "middle") +
      line(256, 66, 232, 56, "lnb") + text(226, 58, "Nu", "txc", "end") +
      line(256, 66, 242, 90, "lnb") + line(256, 66, 278, 86, "lnb");
  }

  /* ---------------- BIOC*2580 ---------------- */

  function water() {
    var mols = [[60, 58, -90], [118, 34, 20], [124, 84, 200], [196, 58, 160], [256, 34, -60], [262, 86, 90]];
    var s = "";
    [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5]].forEach(function (p) {
      var a = mols[p[0]], b = mols[p[1]], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      var ux = (b[0] - a[0]) / d, uy = (b[1] - a[1]) / d;
      s += line(a[0] + ux * 16, a[1] + uy * 16, b[0] - ux * 16, b[1] - uy * 16, "ln2 dash");
    });
    mols.forEach(function (m) {
      [-52, 52].forEach(function (off) {
        var a = (m[2] + off) * DEG;
        s += line(m[0], m[1], m[0] + 14 * Math.cos(a), m[1] + 14 * Math.sin(a), "lnb") + circle(m[0] + 14 * Math.cos(a), m[1] + 14 * Math.sin(a), 4.5, "fl2");
      });
      s += circle(m[0], m[1], 8, "fls");
    });
    return s + text(160, 106, "hydrogen bonds", "tx", "middle");
  }

  function protein() {
    var helix = sample(function (x) { return 56 + 22 * Math.sin((x - 20) / 9); }, 20, 168, 1.5);
    var s = path(helix, "ln helix") + path(helix, "hl");
    [[40, 1], [74, -1]].forEach(function (b) {
      var y = b[0];
      var pts = b[1] > 0
        ? [[190, y], [270, y], [270, y - 8], [298, y + 8], [270, y + 24], [270, y + 16], [190, y + 16]]
        : [[298, y], [218, y], [218, y - 8], [190, y + 8], [218, y + 24], [218, y + 16], [298, y + 16]];
      s += poly(pts, "fla2 ln", true);
    });
    [214, 240, 266].forEach(function (x) { s += line(x, 58, x, 72, "ln2 dash"); });
    return s + text(94, 106, "α-helix", "tx", "middle") + text(244, 106, "β-sheet", "tx", "middle");
  }

  function disaccharide() {
    function ring(cx) {
      return [[cx - 46, 64], [cx - 24, 50], [cx + 22, 50], [cx + 44, 64], [cx + 22, 80], [cx - 24, 80]];
    }
    var r1 = ring(92), r2 = ring(228), s = "";
    [r1, r2].forEach(function (r, i) {
      var cx = i ? 228 : 92;
      s += poly(r, "lnb", true) + line(r[5][0], r[5][1], r[4][0], r[4][1], "lnb thick") +
        text(r[2][0] + 6, 46, "O", "txc", "middle") +
        line(cx - 24, 50, cx - 24, 34, "lnb") + text(cx - 24, 28, "CH₂OH", "tx", "middle");
    });
    s += line(46, 64, 46, 82, "lnb") + text(46, 94, "HO", "tx", "middle");
    s += line(136, 64, 152, 76, "lnb") + line(166, 76, 182, 64, "lnb") + text(159, 82, "O", "txc", "middle");
    s += line(272, 64, 272, 82, "lnb") + text(272, 94, "OH", "tx", "middle");
    return s + text(159, 104, "α(1→4)", "txc", "middle");
  }

  function michaelisMenten() {
    var K = 46, v = function (x) { var t = x - 24; return 98 - 72 * t / (K + t); };
    var xk = 24 + K, yk = v(xk);
    return axes("v₀", "[S]") +
      line(24, 26, 300, 26, "ln2 dash") + text(300, 21, "Vmax", "txc", "end") +
      path(sample(v, 24, 300, 2), "ln thick") +
      line(xk, 98, xk, yk, "ln2 dash") + line(24, yk, xk, yk, "ln2 dash") + circle(xk, yk, 3.5, "fl") +
      text(xk + 5, 93, "Km", "txc") + text(28, yk - 5, "Vmax/2", "tx") +
      path("M240 72 L255 66.5 A16 16 0 1 0 255 77.5 Z", "fla2 ln") + circle(266, 72, 5, "fl");
  }

  function dna() {
    var a = function (x) { return 58 + 30 * Math.sin((x - 20) / 20); };
    var b = function (x) { return 58 - 30 * Math.sin((x - 20) / 20); };
    var s = "", i = 0;
    for (var x = 26; x < 300; x += 11) {
      if (Math.abs(a(x) - b(x)) > 8) s += line(x, a(x), x, b(x), i % 2 ? "rung" : "rung2");
      i++;
    }
    return s + path(sample(b, 20, 300, 2), "lnb thick") + path(sample(a, 20, 300, 2), "ln thick");
  }

  function membrane() {
    var s = "";
    for (var x = 22; x <= 298; x += 16) {
      if (x > 138 && x < 186) continue;
      s += line(x - 2, 36, x - 2, 56, "ln2") + line(x + 2, 36, x + 2, 56, "ln2") + circle(x, 30, 6, "fls");
      s += line(x - 2, 82, x - 2, 62, "ln2") + line(x + 2, 82, x + 2, 62, "ln2") + circle(x, 88, 6, "fls");
    }
    s += rect(146, 16, 32, 86, 10, "fla2 ln");
    s += arrow(162, 8, 162, 104, "lnb", "flb", 7);
    s += circle(108, 12, 3, "fl") + circle(220, 10, 3, "fl") + circle(250, 106, 3, "fl") + circle(70, 106, 3, "fl");
    return s;
  }

  function citricCycle() {
    var cx = 170, cy = 58, r = 34, s = circle(cx, cy, r, "ln thick");
    [-60, 30, 120, 210].forEach(function (d) {
      var a = d * DEG, px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
      s += head(px, py, a + Math.PI / 2, "fl", 8);
    });
    for (var k = 0; k < 8; k++) {
      var t = (k * 45 + 22.5) * DEG;
      s += circle(cx + r * Math.cos(t), cy + r * Math.sin(t), 3.5, "fls");
    }
    function at(d) { return [cx + r * Math.cos(d * DEG), cy + r * Math.sin(d * DEG)]; }
    var pin = at(200), pco2 = at(-50), pnadh = at(40), pgtp = at(130);
    return s + text(cx, cy + 4, "TCA", "txc", "middle") +
      arrow(56, 40, pin[0] - 3, pin[1] - 1, "lnb", "flb", 6) + text(22, 32, "acetyl-CoA", "tx") +
      arrow(pco2[0] + 3, pco2[1] - 3, 226, 14, "lnb", "flb", 6) + text(232, 18, "CO₂", "tx") +
      arrow(pnadh[0] + 3, pnadh[1] + 3, 236, 94, "lnb", "flb", 6) + text(242, 100, "NADH", "tx") +
      arrow(pgtp[0] - 3, pgtp[1] + 3, 120, 102, "lnb", "flb", 6) + text(112, 104, "GTP", "tx", "end");
  }

  /* ---------------- IPS*1500 ---------------- */

  function dots() {
    var s = "";
    for (var x = 44; x <= 300; x += 20) for (var y = 16; y <= 96; y += 20) s += circle(x, y, 1, "fl2");
    return s;
  }

  function vectors() {
    return dots() + arrow(24, 98, 304, 98, "lnb", "flb", 6) + arrow(24, 98, 24, 10, "lnb", "flb", 6) +
      arrow(40, 90, 140, 50, "ln thick", "fl", 9) + text(82, 62, "A", "txc", "middle") +
      arrow(140, 50, 236, 30, "ln thick", "fl", 9) + text(186, 30, "B", "txc", "middle") +
      arrow(40, 90, 236, 30, "ln2 dash", "fl2", 8) + text(160, 76, "A + B", "tx", "middle");
  }

  function projectile() {
    var y = function (x) { var u = (x - 30) / 260; return 96 - 280 * u * (1 - u); };
    var slope = function (x) { var u = (x - 30) / 260; return -280 * (1 - 2 * u) / 260; };
    var s = line(16, 96, 304, 96, "lnb") + path(sample(y, 30, 290, 2), "ln dash");
    [0.15, 0.5, 0.85].forEach(function (u) {
      var x = 30 + 260 * u, yy = y(x);
      s += arrow(x, yy, x + 30, yy + 30 * slope(x), "lnb", "flb", 6) + circle(x, yy, 5, "fl");
    });
    return s + text(160, 16, "v_y = 0 at the top", "tx", "middle") + text(96, 60, "v", "txc");
  }

  function incline() {
    var th = Math.atan2(60, 260), u = [Math.cos(th), -Math.sin(th)], n = [-Math.sin(th), -Math.cos(th)];
    var p = [170, 100 - 60 * (140 / 260)], c = [p[0] + n[0] * 11, p[1] + n[1] * 11];
    function corner(a, b) { return [c[0] + u[0] * 16 * a + n[0] * 11 * b, c[1] + u[1] * 16 * a + n[1] * 11 * b]; }
    return poly([[30, 100], [290, 100], [290, 40]], "lnb", true) +
      poly([corner(-1, -1), corner(1, -1), corner(1, 1), corner(-1, 1)], "fls", true) +
      arrow(c[0], c[1], c[0], c[1] + 36, "ln", "fl", 7) + text(c[0] + 6, c[1] + 38, "mg", "txc") +
      arrow(c[0], c[1], c[0] + n[0] * 36, c[1] + n[1] * 36, "ln", "fl", 7) + text(c[0] + n[0] * 40 - 4, c[1] + n[1] * 40 - 4, "N", "txc", "end") +
      arrow(c[0], c[1], c[0] + u[0] * 38, c[1] + u[1] * 38, "ln", "fl", 7) + text(c[0] + u[0] * 42 + 4, c[1] + u[1] * 42, "f", "txc") +
      path("M74 100 A44 44 0 0 0 73 90", "ln2") + text(84, 96, "θ", "tx");
  }

  function riemann() {
    var y = function (x) { return 96 - (22 + 58 * Math.sin(Math.PI * (x - 30) / 300)); };
    var s = axes("f(x)", "x");
    for (var x = 40; x < 250; x += 30) s += rect(x, y(x), 30, 98 - y(x), 0, "fla2 ln2");
    return s + path(sample(y, 30, 300, 2), "ln thick") + text(278, 76, "∫ f(x) dx", "txc", "middle");
  }

  function springCollision() {
    var s = line(16, 90, 304, 90, "lnb") + line(20, 40, 20, 90, "lnb thick");
    var pts = [[20, 72]];
    for (var i = 1; i < 8; i++) pts.push([20 + i * 7.5, i % 2 ? 64 : 80]);
    pts.push([80, 72]);
    s += poly(pts, "ln") + rect(80, 56, 34, 34, 3, "fls") + text(50, 50, "U = kx²/2", "tx", "middle");
    s += circle(170, 74, 14, "fl") + arrow(188, 74, 214, 74, "lnb", "flb", 6) + text(200, 60, "p₁", "txc", "middle");
    s += circle(282, 74, 14, "fls") + arrow(264, 74, 238, 74, "lnb", "flb", 6) + text(252, 60, "p₂", "txc", "middle");
    return s + text(226, 106, "momentum is conserved", "tx", "middle");
  }

  function wheel() {
    var cx = 150, cy = 58, r = 36, s = circle(cx, cy, r, "lnb thick");
    for (var k = 0; k < 6; k++) {
      var a = (k * 60 + 30) * DEG;
      s += line(cx, cy, cx + r * Math.cos(a), cy + r * Math.sin(a), "ln2");
    }
    s += line(cx, cy, cx + r, cy, "ln thick") + circle(cx, cy, 4, "flb") + text(168, 52, "r", "txc", "middle");
    s += arrow(cx, cy - r, cx + 44, cy - r, "ln", "fl", 7) + text(cx + 50, cy - r + 4, "v", "txc");
    s += arrow(cx + r, cy, cx + r, cy + 38, "ln", "fl", 7) + text(cx + r + 6, cy + 36, "F", "txc");
    var a0 = 160 * DEG, a1 = 250 * DEG, R = 50;
    s += path("M" + f(cx + R * Math.cos(a0)) + " " + f(cy + R * Math.sin(a0)) + " A" + R + " " + R + " 0 0 1 " + f(cx + R * Math.cos(a1)) + " " + f(cy + R * Math.sin(a1)), "ln2");
    s += head(cx + R * Math.cos(a1), cy + R * Math.sin(a1), a1 + Math.PI / 2, "fl2", 7) + text(cx - 58, cy - 34, "ω", "txc");
    return s + text(256, 64, "τ = Iα", "txl", "middle");
  }

  function atom() {
    var cx = 104, cy = 58, s = "";
    [18, 34, 50].forEach(function (r) { s += circle(cx, cy, r, "ln2"); });
    s += circle(cx, cy, 7, "fl");
    var e3 = [cx + 50 * Math.cos(-40 * DEG), cy + 50 * Math.sin(-40 * DEG)], e2 = [cx + 34 * Math.cos(-40 * DEG), cy + 34 * Math.sin(-40 * DEG)];
    s += circle(e3[0], e3[1], 4, "fls") + circle(e2[0], e2[1], 4, "flb") + arrow(e3[0] - 2, e3[1] + 3, e2[0] + 4, e2[1] - 3, "lnb", "flb", 5);
    s += path(sample(function (x) { return 34 + 6 * Math.sin((x - 170) / 5); }, 170, 244, 1.5), "ln") + head(250, 34, 0, "fl", 7);
    return s + text(210, 20, "hf", "txc", "middle") + text(236, 88, "E = mc²", "txl", "middle");
  }

  /* ---------------- choosing a scene ---------------- */

  var SCENES = {
    c1050: [[4, energyDiagram, "Reaction energy diagram"], [8, rateCurve, "Concentration falling over time"], [12, galvanicCell, "Galvanic cell"]],
    c2700: [[4, aromaticAcid, "Benzoic acid and a Newman projection"], [6, sn2State, "SN2 transition state"], [9, bromonium, "Bromonium ion"], [10, eas, "Electrophilic aromatic substitution"], [12, carbonylAddition, "Nucleophilic addition to a carbonyl"]],
    c2580: [[2, water, "Hydrogen-bonded water molecules"], [4, protein, "Protein α-helix and β-sheet"], [5, disaccharide, "A disaccharide"], [7, michaelisMenten, "Michaelis–Menten curve"], [8, dna, "DNA double helix"], [9, membrane, "Membrane channel"], [12, citricCycle, "Citric acid cycle"]],
    c1500: [[2, vectors, "Adding vectors"], [5, projectile, "Projectile motion"], [7, incline, "Forces on an incline"], [8, riemann, "Area under a curve"], [10, springCollision, "Spring energy and a collision"], [11, wheel, "Rotating wheel"], [12, atom, "Bohr atom emitting a photon"]]
  };
  var SIGNATURE = { c1050: 1, c2700: 1, c2580: 8, c1500: 3 };

  function pick(key, week) {
    var list = SCENES[key];
    if (!list) return null;
    var w = week || SIGNATURE[key];
    for (var i = 0; i < list.length; i++) if (w <= list[i][0]) return list[i];
    return list[list.length - 1];
  }

  var cache = {};
  function scene(key, week, decorative) {
    var p = pick(key, week);
    if (!p) return "";
    var id = key + "|" + (week || 0);
    if (!cache[id]) cache[id] = p[1]();
    return '<svg viewBox="0 0 320 110" preserveAspectRatio="xMidYMid meet" focusable="false" ' +
      (decorative ? 'aria-hidden="true"' : 'role="img" aria-label="' + p[2] + '"') + ">" + cache[id] + "</svg>";
  }

  var ICONS = {
    c1050: path("M16 6 H24 M18 6 V16 L9.5 32.5 Q8.5 35 11 35 H29 Q31.5 35 30.5 32.5 L22 16 V6", "ln") +
      path("M13 27 H27 L30 33 Q30.6 34.4 29 34.4 H11 Q9.4 34.4 10 33 Z", "fla2") + circle(19, 23, 1.6, "fl") + circle(22.5, 19.5, 1.1, "fl"),
    c2700: poly(hexPts(20, 20, 13.5), "ln", true) + circle(20, 20, 7.5, "ln"),
    c2580: path(sample(function (x) { return 20 + 9 * Math.sin((x - 5) / 4.2); }, 5, 35, 1), "ln") +
      path(sample(function (x) { return 20 - 9 * Math.sin((x - 5) / 4.2); }, 5, 35, 1), "lnb") +
      line(11.6, 11.5, 11.6, 28.5, "rung") + line(24.8, 11.5, 24.8, 28.5, "rung"),
    c1500: line(4, 33, 36, 33, "lnb") + path(sample(function (x) { var u = (x - 6) / 28; return 32 - 90 * u * (1 - u); }, 6, 34, 1), "ln dash") +
      circle(13, 17, 3, "fl")
  };
  function icon(key) {
    return ICONS[key] ? '<svg viewBox="0 0 40 40" focusable="false" aria-hidden="true">' + ICONS[key] + "</svg>" : "";
  }
  function sceneName(key, week) { var p = pick(key, week); return p ? p[2] : ""; }

  root.COURSE_ART = { scene: scene, icon: icon, sceneName: sceneName, all: SCENES };
})(typeof self !== "undefined" ? self : this);
