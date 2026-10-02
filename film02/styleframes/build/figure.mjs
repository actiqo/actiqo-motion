// Film 02 · editorial figure system (vector, parametric pose). Styleframe use only — not a production rig.
// Side / three-quarter view facing +x. Origin = hip centre. Units in px. h = head height.
const rad = (d) => (d * Math.PI) / 180;
const P = (x, y) => ({ x, y });
const add = (a, b) => P(a.x + b.x, a.y + b.y);
const polar = (len, deg) => P(Math.sin(rad(deg)) * len, Math.cos(rad(deg)) * len); // 0° = straight down, +° = forward
const f = (v) => Math.round(v * 10) / 10;

/** tapered limb between a (radius ra) and b (radius rb): convex hull of two circles */
function limb(a, b, ra, rb, fill) {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d, nx = -uy, ny = ux;
  const k = (ra - rb) / d, s = Math.sqrt(Math.max(0, 1 - k * k));
  const off = (r, sign) => P(nx * s * r * sign - ux * k * r, ny * s * r * sign - uy * k * r);
  const a1 = add(a, off(ra, 1)), a2 = add(a, off(ra, -1)), b1 = add(b, off(rb, 1)), b2 = add(b, off(rb, -1));
  return `<path fill="${fill}" d="M${f(a1.x)},${f(a1.y)} L${f(b1.x)},${f(b1.y)} A${f(rb)},${f(rb)} 0 0 0 ${f(b2.x)},${f(b2.y)} L${f(a2.x)},${f(a2.y)} A${f(ra)},${f(ra)} 0 0 0 ${f(a1.x)},${f(a1.y)} Z"/>`;
}
const poly = (pts, fill, extra = '') => `<path fill="${fill}" ${extra} d="M${pts.map((p) => `${f(p.x)},${f(p.y)}`).join(' L')} Z"/>`;
const smooth = (pts, fill, extra = '') => {
  // closed Catmull-Rom → cubic Bézier
  const n = pts.length; let d = `M${f(pts[0].x)},${f(pts[0].y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = P(p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6), c2 = P(p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6);
    d += ` C${f(c1.x)},${f(c1.y)} ${f(c2.x)},${f(c2.y)} ${f(p2.x)},${f(p2.y)}`;
  }
  return `<path fill="${fill}" ${extra} d="${d} Z"/>`;
};
const rot = (p, o, deg) => { const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)); const x = p.x - o.x, y = p.y - o.y; return P(o.x + x * c - y * s, o.y + x * s + y * c); };

export const PALETTE = {
  mom: {
    skin: '#C98F6E', skinShade: '#B57C5D', hair: '#2A211E', coat: '#D9CBB4', coatShade: '#C6B596', coatLine: '#BBA985',
    top: '#0B1F3B', pants: '#6E8098', pantsShade: '#5B6C83', shoe: '#F5F2EC', sole: '#DCD5C8',
  },
  grandma: {
    skin: '#E0B597', skinShade: '#CDA083', hair: '#D8D4CE', coat: '#9AA5B0', coatShade: '#86919C', coatLine: '#7C8792',
    top: '#EDE6DA', pants: '#C9BEAE', pantsShade: '#B6AB9B', shoe: '#6B5E55', sole: '#564B44',
  },
};

/**
 * pose: { lean, headTilt, nearThigh, nearShin, farThigh, farShin, nearUpper, nearFore, farUpper, farFore, shrug,
 *         props: { phone:'near'|'far'|null, bag:bool, cleats:bool }, hair:'bun'|'short' }
 */
export function figure(pose, pal, h = 76) {
  const L = { torso: 2.55 * h, neck: 0.2 * h, thigh: 1.8 * h, shin: 1.75 * h, upper: 1.38 * h, fore: 1.22 * h };
  const hip = P(0, 0);
  const neck = add(hip, P(Math.sin(rad(pose.lean)) * L.torso, -Math.cos(rad(pose.lean)) * L.torso + (pose.shrug || 0)));
  const shoulderN = add(neck, P(0.08 * h, 0.28 * h)), shoulderF = add(neck, P(-0.22 * h, 0.26 * h));
  const headC = add(neck, P(Math.sin(rad(pose.lean + 4)) * (L.neck + 0.44 * h) + 0.04 * h, -(L.neck + 0.44 * h)));
  const hipN = add(hip, P(0.1 * h, 0)), hipF = add(hip, P(-0.12 * h, 0));
  const kneeN = add(hipN, polar(L.thigh, pose.nearThigh)), ankleN = add(kneeN, polar(L.shin, pose.nearShin));
  const kneeF = add(hipF, polar(L.thigh, pose.farThigh)), ankleF = add(kneeF, polar(L.shin, pose.farShin));
  const elbowN = add(shoulderN, polar(L.upper, pose.nearUpper)), handN = add(elbowN, polar(L.fore, pose.nearFore));
  const elbowF = add(shoulderF, polar(L.upper, pose.farUpper)), handF = add(elbowF, polar(L.fore, pose.farFore));
  const out = [];
  const foot = (ankle, heelUp, color, sole) => {
    const a = ankle, toe = add(a, polar(0.86 * h, 90 - (heelUp || 0)));
    const back = add(a, P(-0.22 * h, 0.05 * h)), top = add(a, P(0.1 * h, -0.14 * h));
    return smooth([back, top, add(toe, P(-0.25 * h, -0.14 * h)), add(toe, P(0.02 * h, 0.02 * h)), add(toe, P(-0.1 * h, 0.12 * h)), add(a, P(-0.12 * h, 0.16 * h))], color) +
      `<path stroke="${sole}" stroke-width="${f(0.07 * h)}" stroke-linecap="round" fill="none" d="M${f(a.x - 0.18 * h)},${f(a.y + 0.14 * h)} L${f(toe.x - 0.05 * h)},${f(toe.y + 0.1 * h)}"/>`;
  };
  // ── far side (shaded) ──
  if (pose.props?.bag) {
    // soccer bag on the far shoulder, hanging at the far hip (strap crosses the chest)
    const bagC = add(hip, P(-0.55 * h, 0.35 * h));
    out.push(smooth([add(bagC, P(-0.75 * h, -0.55 * h)), add(bagC, P(0.55 * h, -0.62 * h)), add(bagC, P(0.72 * h, 0.35 * h)), add(bagC, P(0.1 * h, 0.66 * h)), add(bagC, P(-0.8 * h, 0.42 * h))], '#34425A'));
    out.push(`<path stroke="#2A3548" stroke-width="${f(0.05 * h)}" fill="none" d="M${f(bagC.x - 0.6 * h)},${f(bagC.y - 0.1 * h)} Q${f(bagC.x)},${f(bagC.y + 0.05 * h)} ${f(bagC.x + 0.6 * h)},${f(bagC.y - 0.2 * h)}"/>`);
  }
  out.push(limb(hipF, kneeF, 0.4 * h, 0.26 * h, pal.pantsShade), limb(kneeF, ankleF, 0.26 * h, 0.16 * h, pal.pantsShade), foot(ankleF, pose.farHeel, pal.sole, pal.sole));
  out.push(limb(shoulderF, elbowF, 0.2 * h, 0.16 * h, pal.coatShade), limb(elbowF, handF, 0.16 * h, 0.12 * h, pal.coatShade), `<circle cx="${f(handF.x)}" cy="${f(handF.y)}" r="${f(0.14 * h)}" fill="${pal.skinShade}"/>`);
  // ── torso (knit top) + coat ──
  out.push(smooth([add(neck, P(-0.35 * h, 0.1 * h)), add(neck, P(0.3 * h, 0.12 * h)), add(hip, P(0.42 * h, -0.2 * h)), add(hip, P(0.3 * h, 0.2 * h)), add(hip, P(-0.42 * h, 0.2 * h)), add(hip, P(-0.45 * h, -0.4 * h))], pal.top));
  const swing = (pose.nearThigh - pose.farThigh) * 0.012 * h;
  const hemY = 1.55 * h;
  const coatBack = [add(neck, P(-0.5 * h, 0.12 * h)), add(neck, P(-0.62 * h, 0.9 * h)), add(hip, P(-0.62 * h, 0.2 * h)), add(hip, P(-0.66 * h - swing * 0.3, hemY)), add(hip, P(0.1 * h, hemY + 0.05 * h)), add(hip, P(-0.05 * h, 0.2 * h)), add(neck, P(-0.05 * h, 0.35 * h))];
  out.push(smooth(coatBack, pal.coatShade));
  out.push(limb(hipN, kneeN, 0.41 * h, 0.26 * h, pal.pants), limb(kneeN, ankleN, 0.26 * h, 0.16 * h, pal.pants), foot(ankleN, pose.nearHeel, pal.shoe, pal.sole));
  const coatFront = [add(neck, P(-0.25 * h, 0.14 * h)), add(neck, P(0.2 * h, 0.25 * h)), add(neck, P(0.36 * h, 1.1 * h)), add(hip, P(0.42 * h, 0.35 * h)), add(hip, P(0.56 * h + swing * 0.6, hemY - 0.04 * h)), add(hip, P(-0.3 * h, hemY + 0.02 * h)), add(hip, P(-0.45 * h, 0.1 * h)), add(neck, P(-0.48 * h, 0.8 * h))];
  out.push(smooth(coatFront, pal.coat));
  // open-coat edge: a sliver of the knit top stays visible at the front
  out.push(`<path stroke="${pal.top}" stroke-width="${f(0.12 * h)}" stroke-linecap="round" fill="none" d="M${f(neck.x + 0.22 * h)},${f(neck.y + 0.3 * h)} Q${f(neck.x + 0.34 * h)},${f(neck.y + 1.2 * h)} ${f(hip.x + 0.38 * h)},${f(hip.y - 0.1 * h)}"/>`);
  out.push(`<path stroke="${pal.coatLine}" stroke-width="${f(0.035 * h)}" fill="none" d="M${f(hip.x - 0.4 * h)},${f(hip.y - 0.02 * h)} L${f(hip.x + 0.4 * h)},${f(hip.y - 0.08 * h)}"/>`); // belt line
  out.push(smooth([add(neck, P(-0.32 * h, 0.08 * h)), add(neck, P(0.12 * h, 0.05 * h)), add(neck, P(0.24 * h, 0.5 * h)), add(neck, P(-0.02 * h, 0.34 * h))], pal.coatShade)); // collar
  if (pose.props?.bag) {
    // strap over the near shoulder → across to the far hip
    out.push(`<path stroke="#2A3548" stroke-width="${f(0.13 * h)}" stroke-linecap="round" fill="none" d="M${f(neck.x + 0.05 * h)},${f(neck.y + 0.22 * h)} Q${f(hip.x + 0.05 * h)},${f(hip.y - 0.9 * h)} ${f(hip.x - 0.45 * h)},${f(hip.y + 0.05 * h)}"/>`);
  }
  // ── head ──
  out.push(limb(add(neck, P(0, 0.12 * h)), add(headC, P(-0.04 * h, 0.3 * h)), 0.19 * h, 0.17 * h, pal.skinShade));
  const hc = headC, t = pose.headTilt || 0;
  const hp = (x, y) => rot(add(hc, P(x * h, y * h)), hc, t);
  if (pose.hair === 'short') {
    out.push(smooth([hp(-0.46, -0.05), hp(-0.2, -0.56), hp(0.28, -0.52), hp(0.44, -0.2), hp(0.2, -0.28), hp(-0.1, -0.2), hp(-0.36, 0.3)], pal.hair));
  } else {
    out.push(`<ellipse cx="${f(hp(-0.5, 0.18).x)}" cy="${f(hp(-0.5, 0.18).y)}" rx="${f(0.2 * h)}" ry="${f(0.17 * h)}" fill="${pal.hair}"/>`); // low bun
  }
  out.push(smooth([hp(-0.42, -0.08), hp(0.0, -0.52), hp(0.36, -0.36), hp(0.44, -0.1), hp(0.54, 0.04), hp(0.44, 0.12), hp(0.44, 0.24), hp(0.3, 0.44), hp(0.02, 0.46), hp(-0.3, 0.3)], pal.skin));
  out.push(`<ellipse cx="${f(hp(-0.04, 0.04).x)}" cy="${f(hp(-0.04, 0.04).y)}" rx="${f(0.07 * h)}" ry="${f(0.1 * h)}" fill="${pal.skinShade}" transform="rotate(${t} ${f(hp(-0.04, 0.04).x)} ${f(hp(-0.04, 0.04).y)})"/>`);
  if (pose.hair === 'short') {
    out.push(smooth([hp(-0.48, 0.1), hp(-0.44, -0.3), hp(-0.1, -0.58), hp(0.3, -0.5), hp(0.46, -0.24), hp(0.18, -0.32), hp(-0.12, -0.12), hp(-0.24, 0.26)], pal.hair));
  } else {
    out.push(smooth([hp(-0.46, 0.22), hp(-0.46, -0.24), hp(-0.08, -0.58), hp(0.34, -0.46), hp(0.47, -0.22), hp(0.2, -0.3), hp(0.02, -0.2), hp(-0.14, 0.02), hp(-0.2, 0.3)], pal.hair));
  }
  const eye = hp(0.33, -0.06), brow1 = hp(0.25, -0.18), brow2 = hp(0.41, -0.215);
  out.push(`<ellipse cx="${f(eye.x)}" cy="${f(eye.y)}" rx="${f(0.045 * h)}" ry="${f(0.032 * h)}" fill="#2A211E" transform="rotate(${f(t + 8)} ${f(eye.x)} ${f(eye.y)})"/>`);
  out.push(`<path stroke="${pal.hair === '#D8D4CE' ? '#A9A39C' : '#2A211E'}" stroke-opacity=".45" stroke-width="${f(0.026 * h)}" stroke-linecap="round" fill="none" d="M${f(brow1.x)},${f(brow1.y)} L${f(brow2.x)},${f(brow2.y)}"/>`);
  // ── near arm + props ──
  // near sleeve: same cloth as the coat, separated by a hairline so it never disappears into the body
  out.push(`<g stroke="${pal.coatLine}" stroke-width="${f(0.035 * h)}">${limb(shoulderN, elbowN, 0.21 * h, 0.17 * h, pal.coat)}${limb(elbowN, handN, 0.17 * h, 0.12 * h, pal.coat)}</g>`);
  out.push(limb(shoulderN, elbowN, 0.19 * h, 0.15 * h, pal.coat), limb(elbowN, handN, 0.15 * h, 0.1 * h, pal.coat));
  if (pose.props?.phone === 'near') {
    const ang = pose.nearFore + 90;
    out.push(`<rect x="${f(handN.x - 0.12 * h)}" y="${f(handN.y - 0.34 * h)}" width="${f(0.26 * h)}" height="${f(0.5 * h)}" rx="${f(0.06 * h)}" fill="#141821" transform="rotate(${f(-ang + 60)} ${f(handN.x)} ${f(handN.y)})"/>`);
  }
  out.push(`<circle cx="${f(handN.x)}" cy="${f(handN.y)}" r="${f(0.14 * h)}" fill="${pal.skin}"/>`);
  if (pose.props?.cleats) {
    // soccer cleats hanging from the far hand by their laces
    const c = add(handF, P(0.08 * h, 0.5 * h));
    const shoe = (o, fill) => { const q = add(c, o);
      return smooth([add(q, P(-0.34 * h, -0.1 * h)), add(q, P(0.06 * h, -0.16 * h)), add(q, P(0.3 * h, 0.04 * h)), add(q, P(0.24 * h, 0.14 * h)), add(q, P(-0.34 * h, 0.1 * h))], fill)
        + `<path stroke="#E9E4DA" stroke-width="${f(0.04 * h)}" stroke-linecap="round" fill="none" d="M${f(q.x - 0.18 * h)},${f(q.y + 0.02 * h)} L${f(q.x + 0.1 * h)},${f(q.y - 0.06 * h)}"/>`
        + [-0.22, -0.02, 0.18].map((dx) => `<rect x="${f(q.x + dx * h)}" y="${f(q.y + 0.11 * h)}" width="${f(0.05 * h)}" height="${f(0.06 * h)}" rx="1" fill="#E9E4DA"/>`).join(''); };
    out.push(`<path stroke="#D9D2C4" stroke-width="${f(0.025 * h)}" fill="none" d="M${f(handF.x)},${f(handF.y)} L${f(c.x - 0.06 * h)},${f(c.y - 0.14 * h)} M${f(handF.x)},${f(handF.y)} L${f(c.x + 0.16 * h)},${f(c.y + 0.04 * h)}"/>`);
    out.push(shoe(P(0, 0), '#1C222D'), shoe(P(0.2 * h, 0.2 * h), '#262D3A'));
  }
  const feetY = Math.max(ankleN.y, ankleF.y) + 0.18 * h;
  return { svg: out.join(''), feetY, handN, handF, headC, neck, hip, h };
}

export const POSES = {
  // A · opening: walking, reading the phone (attention divided)
  reading: { lean: 5, headTilt: 14, shrug: 4, nearThigh: 20, nearShin: 6, farThigh: -16, farShin: -34, farHeel: 25, nearUpper: 18, nearFore: 150, farUpper: -6, farFore: 8, props: { phone: 'near', bag: true } },
  // B · load building: walking, glancing up toward the world
  glancing: { lean: 7, headTilt: -6, shrug: 5, nearThigh: 24, nearShin: 10, farThigh: -18, farShin: -38, farHeel: 30, nearUpper: 8, nearFore: 22, farUpper: -4, farFore: 12, props: { phone: 'near', bag: true, cleats: true } },
  // C · peak: stopped, forward lean, shoulders up, both hands occupied
  weight: { lean: 10, headTilt: 16, shrug: 9, nearThigh: 6, nearShin: 2, farThigh: -4, farShin: -8, farHeel: 6, nearUpper: 22, nearFore: 140, farUpper: -2, farFore: 6, props: { phone: 'near', bag: true, cleats: true } },
  // D · hero: walking on, steadier, head level
  steady: { lean: 4, headTilt: 2, shrug: 2, nearThigh: 22, nearShin: 8, farThigh: -18, farShin: -34, farHeel: 26, nearUpper: -12, nearFore: -4, farUpper: 10, farFore: 22, props: { bag: true } },
  // E · payoff: long stride, shoulders down, free hands
  free: { lean: 2, headTilt: -2, shrug: -2, nearThigh: 28, nearShin: 12, farThigh: -22, farShin: -40, farHeel: 32, nearUpper: -22, nearFore: -12, farUpper: 20, farFore: 34, props: {} },
  // Grandma walking in (mirrored at use site)
  grandma: { lean: 6, headTilt: 4, shrug: 2, nearThigh: 18, nearShin: 6, farThigh: -14, farShin: -28, farHeel: 20, nearUpper: -10, nearFore: 10, farUpper: 12, farFore: 20, props: {}, hair: 'short' },
};
