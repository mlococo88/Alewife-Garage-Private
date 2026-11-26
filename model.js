/* model.js — Alewife Station Garage (MBTA Red Line Extension North West, Contract 091-601, drawings S101–S178 + R1, 25 July 1980).
   Classic script (opens from file://). Defines window.GARAGE_MODEL for index.html.

   Rebuilt 2026-11-26 from a sheet-by-sheet review of all 79 sheets. Every member lists the sheets it comes from; items read
   with doubt say "uncertain" or "assumed" in their details and are listed in M.assumptions.

   Coordinates (feet): x east along the lettered grid (line A = 0), z along the numbered grid (line 1 = 0, increasing to line 12),
   y up from the Level 1 (ground) datum El. 117.5. Levels: L2 El. 136.0, L3 148.0, L4 160.0, L5 172.0 (stair elevations S158,
   bridge high points S116/S117, line-12 top of concrete S109).

   Member geometry: bar {a, b, sec} (sec.s rect | it | dt | w | round | truss) or quad {p: 4 corners, t thickness}. */
(function () {
  'use strict';
  /* ---------------- grid ---------------- */
  const X = { W: -113.17, Y: -38.17, ZL: -4.67, A1: -72, A: 0, A5: 22.5, B: 45, C: 81, C5: 99, D: 117, E: 135, F: 171, G: 207, H: 243,
    J: 279, K: 324, L: 328, M: 364, N: 400, P: 436, Q: 472, R: 544 };
  const XO = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const Z = { '1': 0, '1.9': 60.33, '2': 63, '2.1': 65.67, '2.9': 123.33, '3': 126, '3.1': 128.67, '4': 189, '5': 252, '6': 288, '7': 351,
    '8': 414, '9': 477, '10': 540, '11': 603, '11.2': 608.67, '11.5': 620, '12': 638.25 };
  const EL0 = 117.5, yE = el => el - EL0;
  const LEV = { 1: 0, 2: 18.5, 3: 30.5, 4: 42.5, 5: 54.5 };
  const PBD = 4.0;                                     // precast beam depth 4'-0" (S152)

  const M = {
    name: 'Alewife Station Garage', short: 'Alewife', project: 'alewife',
    subtitle: 'MBTA Red Line Extension North West · Contract 091-601 · drawings S101–S178 (1980)',
    elev0: EL0,
    levels: [1, 2, 3, 4, 5].map(n => ({ n, name: n === 1 ? 'Level 1 (Ground)' : n === 5 ? 'Level 5 (Top deck)' : 'Level ' + n, y: LEV[n], el: EL0 + LEV[n] })),
    groups: [
      { k: 'COL', label: 'Columns & piers', color: 0x8b929c },
      { k: 'BEAM', label: 'Beams & girders', color: 0x7d8896 },
      { k: 'DECK', label: 'Double tees & slabs', color: 0xc8ccd2 },
      { k: 'EDGE', label: 'Spandrels, walls & parapets', color: 0xa39c8c },
      { k: 'RAMP', label: 'Drum ramps, bridges & legs', color: 0xb9b2a4 },
      { k: 'STAIR', label: 'Stairs', color: 0xc79f6b },
      { k: 'SKY', label: 'Light well skylight', color: 0x7fb3d5 },
      { k: 'LOBBY', label: 'Lobby, tower & escalator', color: 0xa9b7a6 },
      { k: 'SITE', label: 'Tank, South Ramp, bus canopy', color: 0x9fb2b8 },
      { k: 'FDN', label: 'Foundations & transfer girders', color: 0x8f8574, off: true }
    ],
    types: {
      COL: { name: 'Steel column (W14, concrete encased)', group: 'COL', material: 'steel', color: 0x8a8f98 },
      CC: { name: 'Concrete column', group: 'COL', material: 'concrete', color: 0x9a9488 },
      PIER: { name: 'Concrete pier', group: 'FDN', material: 'concrete', color: 0x8f8574 },
      PB: { name: 'Precast beam', group: 'BEAM', material: 'precast', color: 0x8892a0 },
      RPB: { name: 'Precast beam, ramp bay', group: 'BEAM', material: 'precast', color: 0x8892a0 },
      CG: { name: 'Cast-in-place girder / beam', group: 'BEAM', material: 'concrete', color: 0x9a9488 },
      DT: { name: 'Precast double tee', group: 'DECK', material: 'precast', color: 0xc8ccd2 },
      RDT: { name: 'Precast double tee, ramp', group: 'DECK', material: 'precast', color: 0xbcc2ca },
      SLAB: { name: 'Cast-in-place slab', group: 'DECK', material: 'concrete', color: 0xc9c4b8 },
      SP: { name: 'Precast spandrel panel & CIP edge beam', group: 'EDGE', material: 'precast', color: 0xa39c8c },
      WALL: { name: 'Concrete wall', group: 'EDGE', material: 'concrete', color: 0xb0a898 },
      CURB: { name: 'Curb / parapet wall', group: 'EDGE', material: 'concrete', color: 0xb0a898 },
      HS: { name: 'Drum ramp slab', group: 'RAMP', material: 'concrete', color: 0xc9c2b4 },
      HB: { name: 'Drum ramp spandrel beam', group: 'RAMP', material: 'concrete', color: 0xa69d8f },
      RW: { name: 'Drum outer wall', group: 'RAMP', material: 'concrete', color: 0xb3ab9c },
      RC: { name: 'Drum ramp column (24 in round)', group: 'RAMP', material: 'concrete', color: 0x9a9182 },
      BS: { name: 'Bridge / link / leg slab', group: 'RAMP', material: 'concrete', color: 0xc9c2b4 },
      BB: { name: 'Bridge / link beam', group: 'RAMP', material: 'concrete', color: 0xa69d8f },
      BP: { name: 'Bridge column', group: 'RAMP', material: 'concrete', color: 0x9a9182 },
      BW: { name: 'Bridge / leg wall', group: 'RAMP', material: 'concrete', color: 0xb3ab9c },
      ST: { name: 'Stair flight', group: 'STAIR', material: 'concrete', color: 0xc79f6b },
      SL: { name: 'Stair landing', group: 'STAIR', material: 'concrete', color: 0xd2b07e },
      SW: { name: 'Stair wall / core', group: 'STAIR', material: 'concrete', color: 0xb08a5c },
      SKP: { name: 'Skylight support', group: 'SKY', material: 'steel', color: 0x6f7a88 },
      SKB: { name: 'Skylight beam (W18)', group: 'SKY', material: 'steel', color: 0x5f6f82 },
      SKX: { name: 'Skylight box beam', group: 'SKY', material: 'steel', color: 0x4f6f8f },
      GL: { name: 'Skylight glazing', group: 'SKY', material: 'glass', color: 0x9fd0ea },
      LS: { name: 'Lobby slab', group: 'LOBBY', material: 'concrete', color: 0xa9b7a6 },
      LB: { name: 'Lobby beam', group: 'LOBBY', material: 'concrete', color: 0x8fa38c },
      LC: { name: 'Lobby column', group: 'LOBBY', material: 'concrete', color: 0x86998a },
      LW: { name: 'Lobby wall', group: 'LOBBY', material: 'concrete', color: 0x98a796 },
      LT: { name: 'Lobby roof truss (steel pipe)', group: 'LOBBY', material: 'steel', color: 0x6f8a7a },
      ET: { name: 'Escalator truss (steel)', group: 'LOBBY', material: 'steel', color: 0x5f7a6a },
      LG: { name: 'Lobby glazing', group: 'LOBBY', material: 'glass', color: 0x9fd0ea },
      LRD: { name: 'Lobby roof deck', group: 'LOBBY', material: 'steel', color: 0xb9c4b7 },
      PED: { name: 'Pedestrian bridge (precast)', group: 'LOBBY', material: 'precast', color: 0xb8c6b4 },
      TS: { name: 'Flood storage tank roof slab', group: 'SITE', material: 'concrete', color: 0x9fb2b8 },
      TB: { name: 'Flood storage tank roof beam', group: 'SITE', material: 'concrete', color: 0x8fa3aa },
      TC: { name: 'Flood storage tank column', group: 'SITE', material: 'concrete', color: 0x8297a0 },
      TW: { name: 'Flood storage tank wall', group: 'SITE', material: 'concrete', color: 0x8fa3aa },
      SR: { name: 'South Ramp slab', group: 'SITE', material: 'concrete', color: 0xc2bba9 },
      SRB: { name: 'South Ramp beam', group: 'SITE', material: 'concrete', color: 0xa69d8f },
      SRW: { name: 'South Ramp wall', group: 'SITE', material: 'concrete', color: 0xb3ab9c },
      MA: { name: 'Managers area roof framing (steel)', group: 'SITE', material: 'steel', color: 0x76808c },
      MW: { name: 'Masonry bearing wall', group: 'SITE', material: 'masonry', color: 0xb59a86 },
      BUS: { name: 'Bus platform slab', group: 'SITE', material: 'concrete', color: 0xb8b3a2 },
      BT: { name: 'Bus canopy truss (steel pipe)', group: 'SITE', material: 'steel', color: 0x6c7a88 },
      BJ: { name: 'Bus canopy joist / deck', group: 'SITE', material: 'steel', color: 0x8a96a3 },
      BC: { name: 'Bus canopy column (pipe)', group: 'SITE', material: 'steel', color: 0x5c6875 },
      PC: { name: 'Pile cap', group: 'FDN', material: 'concrete', color: 0x8f8574 },
      TIE: { name: 'Tie beam', group: 'FDN', material: 'concrete', color: 0x857b6b },
      TG: { name: 'Transfer girder (over Red Line tunnel)', group: 'FDN', material: 'concrete', color: 0x7b7263 }
    },
    grid: {
      x: [['W', X.W], ['Y', X.Y], ['A1', X.A1]].concat(XO.map(k => [k, X[k]])).concat(['M', 'N', 'P', 'Q', 'R'].map(k => [k, X[k]])),
      z: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(k => [k, Z[k]])
    },
    assumptions: [
      'Levels: L1 El. 117.5, L2 136.0, L3 148.0, L4 160.0, L5 172.0 (12 ft floor to floor; S158 stair landings are 8 in higher, at finish).',
      'Column sizes from the S148 schedule (re-checked cell by cell). Splice 5 ft above Level 2 (line A: above Level 3). Columns drawn as their 36 in concrete encasement (S151). Handwritten size substitutions on S148 (e.g. W14×287→311) are not applied.',
      'Internal ramps: bay 2.1–2.9 rises from line B (level n) to line J (level n+1), 5.1%; flat landing in J–K, bay 2–3, at every level (S106–S113). Ramp 1 arrives at Level 2 from the South Ramp.',
      'Drum ramps: double helix, about 24 ft rise per turn; ramps start on their grade legs; elevations read from the radial leaders on S115–S125 and interpolated between them.',
      'Skylight: eaves on the W18 beams at El. 184.67 (S158 / S178; not stated on S138); gable profile from aerial imagery, ridge assumed 9 ft above the eaves.',
      'Lobby roof: four areas laid out from S128 with truss elevations from S142 / S143 (glass triangle to El. 201′-9″ at the tower, front slope El. 155 → 130, slope beside the tower, flat roof at El. 130 with a 30° glazed upturn); trusses T29, T31, T32 not yet placed; lobby curtain walls from aerial imagery.',
      'Lobby, tank, South Ramp, bus canopy: framing laid out from S126–S137 with simplified geometry where the scans are unclear (truss fans, skewed lobby lines at 19.83°). Lobby grid: Y 38.17 ft and W 113.17 ft west of A.',
      'Not modelled: lobby foundation sections MF-1–MF-47 (below-grade U-walls, S165–S172), stairs 16, 23, 30 and the covered exit approach (RP-6/7) — locations not fixed on the sheets reviewed.'
    ],
    members: []
  };
  const add = m => { M.members.push(m); return m; };
  const ft = v => { v = Math.abs(v); const f = Math.floor(v + 1e-6), i = Math.round((v - f) * 12); return i === 12 ? (f + 1) + '′-0″' : f + '′-' + i + '″'; };
  const elTxt = y => 'El. ' + (EL0 + y).toFixed(1);
  const P2 = n => String(n).padStart(2, '0');
  const bar = (id, type, level, grid, size, props, a, b, sec) => add({ id, type, level, grid, size, props, g: { k: 'bar', a, b, sec } });
  const quad = (id, type, level, grid, size, props, p, t) => add({ id, type, level, grid, size, props, g: { k: 'quad', p, t } });
  const levelOf = y => { let n = 1; [1, 2, 3, 4, 5].forEach(k => { if (y >= LEV[k] - 0.6) n = k; }); return n; };
  const wallQ = (a, b, y0, y1) => [[a[0], y1, a[1]], [b[0], y1, b[1]], [b[0], y0, b[1]], [a[0], y0, a[1]]];
  const hslab = (x0, x1, z0, z1, y) => [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]];

  /* ============ GARAGE COLUMNS (S148 schedule, S150, S151, S153) ============ */
  const SCHED = {
    A: { '1': '287/605/1A', '2': '287/750/1A', '3': '287/750/1A', '4': '287/750/1A', '5': '287/605/1A', '6': '287/605/1A', '7': '287/750/1A', '8': '287/750/GC', '9': '287/750/1A', '10': '287/750/1A', '11': '287/605/1A' },
    B: { '1': '287/605/2A', '1.9': '287/500/4', '2.1': '342/605/4', '2.9': '342/605/4', '3.1': '287/500/4', '4': '398/550/2A', '5': '398/605/2A', '6': '398/605/2A', '7': '398/550/2A', '8': '398/750/6A', '9': '398/665/6B', '10': '398/550/2A', '11': '398/605/2A' },
    C: { '1': '287/550/1C', '1.9': '287/550/4', '2.1': '287/550/4', '2.9': '287/550/4', '3.1': '287/550/4', '4': '342/500/1C', '5': '287/550/1C', '6': '342/550/1C', '7': '342/500/1C', '8': '342/605/6B', '9': '342/550/6A', '10': '342/500/1C', '11': '342/550/1C' },
    D: { '1': '246/426/2B', '1.9': '246/426/4', '2.1': '246/426/4', '2.9': '246/426/4', '3.1': '246/455/4', '4': '246/455/2B', '5': '246/455/2B', '6': '314/455/2B', '7': '314/455/2B', '8': '314/500/2B', '9': '314/500/3', '10': '314/455/2B', '11': '314/426/2B' },
    E: { '1': '246/426/2B', '1.9': '246/426/4', '2.1': '246/426/4', '2.9': '246/426/4', '3.1': '246/455/4', '4': '246/455/2B', '5': '246/455/1E', '6': '314/455/2B', '7': '314/455/1E', '8': '314/500/2B', '9': '314/500/3', '10': '314/455/2B', '11': '314/426/2B' },
    F: { '1': '287/426/1B', '1.9': '287/426/4', '2.1': '287/426/4', '2.9': '287/426/4', '3.1': '287/426/4', '4': '342/500/1B', '5': '287/426/1B', '6': '342/426/1B', '7': '342/500/1B', '8': '342/500/1B', '9': '342/500/6B', '10': '342/500/1A', '11': '342/426/1B' },
    G: { '1': '287/426/1B', '1.9': '287/426/1B', '2.1': '287/426/1B', '2.9': '287/426/1B', '3.1': '287/455/1B', '4': '342/500/1B', '5': '287/455/1B', '6': '342/455/7', '7': '342/500/1B', '8': '342/500/1B', '9': '342/500/1B', '10': '342/500/1A', '11': '342/426/1B' },
    H: { '1': '287/500/1D', '1.9': '287/455/1D', '2.1': '287/455/1D', '2.9': '287/455/1D', '3.1': '287/550/1D', '4': '342/500/1D', '5': '287/550/1D', '6': '342/550/7', '7': '342/500/1D', '8': '342/605/1D', '9': '342/550/1D', '10': '342/500/1A', '11': '342/550/6C' },
    J: { '1': '287/605/2A', '1.9': '287/500/2A', '2.1': '370/605/2A', '2.9': '370/605/2A', '3.1': '287/500/2A', '4': '398/550/2A', '5': '398/605/2A', '6': '398/605/2A', '7': '398/550/2A', '8': '398/750/2A', '9': '398/665/2A', '10': '398/550/2A', '11': '398/605/6C' },
    K: { '1': '342/550/2A', '2': '342/605/2A', '3': '342/605/2A', '4': '342/605/2A', '5': '342/605/2A', '6': '342/605/2A', '7': '342/605/2A', '8': '342/665/2A', '9': '342/665/2A', '10': '342/605/2A', '11': '342/550/2A' }
  };
  const BASE_NOTE = { '1A': 'base plate type 1A', '1B': 'type 1B', '1C': 'type 1C', '1D': 'type 1D', '1E': 'type 1E', '2A': 'type 2A', '2B': 'type 2B',
    '3': 'type 3, on top of a concrete column', '4': 'type 4, double plate at the expansion-joint pair', '6A': 'type 6A, skewed, on a pier / transfer girder over the Red Line tunnel',
    '6B': 'type 6B, skewed, on a pier / transfer girder over the Red Line tunnel', '6C': 'type 6C, skewed, on a transfer girder', 'GC': 'on a concrete column (top El. 113′-0″)', '7': 'type 7, on a concrete pier' };
  const BASEY = { A8: yE(113), D9: yE(113), E9: yE(113), B8: yE(115), B9: yE(115), C8: yE(115), C9: yE(115), F9: yE(115), H11: yE(115), J11: yE(115) };
  const rampY = (n, x) => LEV[n] + (Math.max(X.B, Math.min(X.J, x)) - X.B) / (X.J - X.B) * 12;   // ramp n: level n at B to n+1 at J
  const ramp1Y = x => yE(134) + (Math.max(X.G, Math.min(X.J, x)) - X.G) / (X.J - X.G) * (LEV[2] - yE(134));
  const isRampLine = l => l === '2.1' || l === '2.9';
  const lobbyOn = (g, line) => (line === '6' || line === '7') && X[g] <= X.F;
  Object.keys(SCHED).forEach(g => Object.keys(SCHED[g]).forEach(line => {
    const [up, lo, bt] = SCHED[g][line].split('/'), x = X[g], z = Z[line];
    const key = g + line;
    const base = BASEY[key] !== undefined ? BASEY[key] : lobbyOn(g, line) ? yE(116) : 0;
    let tops;
    if (isRampLine(line) && g !== 'A' && g !== 'K') tops = (x >= X.G ? [ramp1Y(x)] : []).concat([rampY(2, x), rampY(3, x), rampY(4, x)]);
    else if (g === 'A') tops = [LEV[3], LEV[4], LEV[5]];
    else tops = [LEV[2], LEV[3], LEV[4], LEV[5]];
    const splice = (g === 'A' ? LEV[3] : LEV[2]) + 5;
    let y0 = base;
    tops.forEach((yt, i) => {
      const y1 = yt - PBD;
      const tier = y1 <= splice ? `W14×${lo} (lower tier)` : y0 >= splice ? `W14×${up} (upper tier)` : `W14×${lo} below / W14×${up} above the splice 5′-0″ above Level ${g === 'A' ? 3 : 2}`;
      const lvFrom = levelOf(y0 + 0.5);
      const story = `${i === 0 ? (base < -0.5 ? elTxt(base) : 'ground') : elTxt(y0)} to ${elTxt(yt)}${isRampLine(line) ? ' (ramp)' : ''}`;
      bar(`L${lvFrom}-COL-${g}${line}${isRampLine(line) ? '-' + (i + 1) : ''}`, 'COL', lvFrom, `${g}-${line}`, y1 <= splice ? 'W14×' + lo : y0 >= splice ? 'W14×' + up : `W14×${lo}/${up}`,
        [['Location', `Grid ${g}-${line}, ${story}`], ['Section', tier + '; encased in 36 in dia. concrete (S151); Fy 50 ksi'],
          ['Base', i === 0 ? BASE_NOTE[bt] || bt : 'Bears on / continuous with the column below'], ['Height', ft(y1 - y0) + ' to underside of beam'], ['Source', 'S148, S151' + (BASEY[key] !== undefined ? ', S105, S140, S149' : lobbyOn(g, line) ? ', S127 (rotation bearing on concourse beam, LG-13)' : '')]],
        [x, y0, z], [x, y1, z], { s: 'round', dia: 3.0 });
      y0 = yt;
    });
  }));
  XO.forEach(g => [3, 4].forEach(n => bar(`L${n}-COL-${g}12`, 'COL', n, `${g}-12`, 'W14×264',
    [['Location', `Grid ${g}-12, Level ${n} to Level ${n + 1}`], ['Section', 'W14×264, encased (S148 line 12)'], ['Base', n === 3 ? 'Type 5, on the 12 ft deep CIP girder (S153)' : 'Splice'], ['Source', 'S148, S153']],
    [X[g], LEV[n], Z['12']], [X[g], LEV[n + 1] - PBD, Z['12']], { s: 'round', dia: 3.0 })));
  [['A', 'round', 3.5, '42 in dia., 26-#11'], ['D', 'rect', 0, 'oval 5′-4″ × 3′-6″, 5-#10 + 5-#10'], ['E', 'rect', 0, 'oval 5′-4″ × 3′-6″'], ['G', 'rect', 0, 'oval 5′-4″ × 3′-6″'], ['K', 'round', 3.5, '42 in dia., 22-#10']].forEach(([g, s, d, txt]) =>
    bar(`L1-CC-${g}12`, 'CC', 1, `${g}-12`, s === 'round' ? '42 in round' : 'Oval column', [['Location', `Grid ${g}-12, ground to the line 12 girder soffit (El. 136.0)`], ['Section', txt], ['Source', 'S150, S153']],
      [X[g], 0, Z['12']], [X[g], LEV[2], Z['12']], s === 'round' ? { s: 'round', dia: d } : { s: 'rect', w: 5.33, d: 3.5, center: true }));
  [['A', X.A], ['K', X.K]].forEach(([g, x]) => bar(`L1-CC-${g}11.5`, 'CC', 1, `${g}-11.5`, '24 in round', [['Location', `Grid ${g}-11.5, ground to Level 3, under the corner slab (Part Plan A)`], ['Section', 'Round, 10-#9 (diameter uncertain, 24 in assumed)'], ['Source', 'S105, S109, S150']],
    [x, 0, Z['11.5']], [x, LEV[3] - 1, Z['11.5']], { s: 'round', dia: 2.0 }));
  [['A', '6', 4, '48×48, 20-#11 (type E)'], ['A5', '6', 2, '24×24, 20-#11 (type G)'], ['B', '6', 4, '48×48, 20-#11 (type E)'], ['C', '6', 4, '48×48, 36-#11 (type J)'], ['C5', '6', 2, '24×24, 16-#11 (type H)'],
    ['D', '6', 4, '48×48, 36-#11 (type J)'], ['E', '6', 4, '44×48, 16-#11 (type D)'], ['F', '6', 4, '48×48, 16-#11 (type D)'], ['A', '7', 4, '48×48, 22-#11 (type F)'], ['A5', '7', 2, '24×24, 20-#11'], ['B', '7', 4, '48×48, 22-#11 (type F)']]
    .forEach(([g, line, s, txt]) => bar(`L1-CC-MZ-${g.replace('5', '.5')}${line}`, 'CC', 1, `${g.replace('5', '.5')}-${line}`, `${s * 12}×${s * 12} concrete`,
      [['Location', `Grid ${g.replace('5', '.5')}-${line}, mezzanine (El. 101) to the concourse girders (El. 112)`], ['Section', txt], ['Source', 'S149, S126, S127']],
      [X[g], yE(101), Z[line]], [X[g], yE(112), Z[line]], { s: 'rect', w: s, d: s, center: true }));

  /* ============ PRECAST BEAMS (S106–S113 marks, S152 sections) ============ */
  function pbMark(n, line, a, b) {
    const bay = a + b;
    if (line === '1' || (line === '11' && n === 2) || line === '12') return { AB: 'PB-4', DE: 'PB-10', JK: 'PB-4' }[bay] || 'PB-5';
    if (line === '11') return { AB: 'PB-1A', DE: 'PB-8', JK: 'PB-1A' }[bay] || 'PB-2';
    if (line === '1.9' || line === '3.1' || isRampLine(line)) return bay === 'DE' ? 'PB-11' : 'PB-3';
    if (line === '5') return { AB: 'PB-6', DE: 'PB-10', JK: 'PB-6' }[bay] || (bay === 'BC' && n === 2 ? 'PB-7' : 'PB-5');
    if (line === '6') return { AB: 'PB-1', DE: 'PB-10', JK: 'PB-1' }[bay] || (bay === 'BC' && n === 2 ? 'PB-2' : 'PB-5');
    if (line === '9') return { AB: 'PB-6', DE: 'PB-9', JK: 'PB-6' }[bay] || 'PB-7';
    return { AB: 'PB-1', DE: 'PB-8', JK: 'PB-1' }[bay] || 'PB-2';
  }
  const PBINFO = { 'PB-1': 'prestressed, Pi 1041 k, ledges 7 in both sides', 'PB-1A': 'prestressed, Pi 1041 k, 11 in seat for 14 ft from A / K', 'PB-2': 'prestressed, Pi 636 k, 7 in ledges both sides',
    'PB-3': 'L-shaped (one ledge), Pi 375 k', 'PB-3A': 'L-shaped, shelf omitted at the stair', 'PB-4': 'prestressed, Pi 855 k, 11 in ledge', 'PB-5': 'prestressed, Pi 405 k, 11 in ledge',
    'PB-6': 'prestressed, Pi 1041 k, 11 in ledge', 'PB-7': 'prestressed, Pi 636 k, 11 in ledge', 'PB-8': 'non-prestressed, 7 in ledges', 'PB-9': 'non-prestressed', 'PB-10': 'non-prestressed', 'PB-11': 'non-prestressed, L-shaped' };
  const pbSec = mk => ({ s: 'it', w: 2.0, d: PBD, lw: /PB-(2|8|1)$/.test(mk) ? 0.58 : 0.92, ld: 1.67 });
  const pb = (id, type, n, grid, mk, where, a, b, extra) => bar(id, type, n, grid, mk,
    [['Location', where], ['Mark', mk], ['Section', `Precast beam 4′-0″ deep, 2′-0″ stem (S152); ${PBINFO[mk] || ''}`], ['Span', ft(Math.hypot(b[0] - a[0], b[2] - a[2]))], ['Source', 'S106–S113, S151, S152']].concat(extra || []), a, b, pbSec(mk));
  for (let n = 2; n <= 5; n++) {
    const y = LEV[n];
    const lines = ['1', '1.9', '3.1', '4', '5', '6', '7', '8', '9', '10', '11'].concat(n >= 4 ? ['12'] : []);
    lines.forEach(line => {
      const xs = n === 2 || line === '1.9' || line === '3.1' ? XO.slice(1) : XO;
      for (let i = 0; i < xs.length - 1; i++) {
        const a = xs[i], b = xs[i + 1];
        if ((line === '1.9' || line === '3.1') && a === 'J') continue;
        const mk = pbMark(n, line, a, b);
        pb(`L${n}-PB-${line}-${a}${b}`, 'PB', n, `Line ${line}, ${a}–${b}`, mk, `Level ${n}, line ${line}, ${a} to ${b}`, [X[a], y, Z[line]], [X[b], y, Z[line]]);
      }
    });
    [['2.1', '2'], ['2.9', '3']].forEach(([lj, lk]) => pb(`L${n}-PB-${lk}-JK`, 'PB', n, `Skewed J-${lj} to K-${lk}`, 'PB-6', `Level ${n}, skewed beam J-${lj} to K-${lk} at the J–K landing`, [X.J, y, Z[lj]], [X.K, y, Z[lk]]));
    if (n >= 3) [['2', '2.1'], ['3', '2.9']].forEach(([la, lb]) => pb(`L${n}-PB-${la}-AB`, 'PB', n, `Skewed A-${la} to B-${lb}`, 'PB-6', `Level ${n}, skewed beam A-${la} to B-${lb}`, [X.A, y, Z[la]], [X.B, y, Z[lb]]));
    if (n <= 4) ['2.1', '2.9'].forEach(line => {
      for (let i = 1; i <= 7; i++) {
        const a = XO[i], b = XO[i + 1];
        pb(`L${n}-PB-${line}-${a}${b}`, 'RPB', n, `Ramp ${n}, line ${line}, ${a}–${b}`, pbMark(n, line, a, b), `Ramp ${n} (Level ${n} at B up to Level ${n + 1} at J), line ${line}, ${a} to ${b}`,
          [X[a], rampY(n, X[a]), Z[line]], [X[b], rampY(n, X[b]), Z[line]], [['Elevation', `${elTxt(rampY(n, X[a]))} to ${elTxt(rampY(n, X[b]))}, slope 5.1%`]]);
      }
    });
    [['29', 142.7], ['31', 430.7]].forEach(([s, z]) => pb(`L${n}-PB-ST${s}`, 'PB', n, `Stair #${s} header`, 'PB-3A', `Level ${n}, header at stair #${s} opening, bay H–J`, [251, y, z], [272.5, y, z]));
  }
  ['2.1', '2.9'].forEach(line => ['G', 'H'].forEach((a, i) => {
    const b = i ? 'J' : 'H';
    pb(`L1-PB-${line}-${a}${b}`, 'RPB', 2, `Ramp 1, line ${line}, ${a}–${b}`, 'PB-3', `Ramp 1 (South Ramp top El. 134 at G up to Level 2 at J), line ${line}, ${a} to ${b}`, [X[a], ramp1Y(X[a]), Z[line]], [X[b], ramp1Y(X[b]), Z[line]]);
  }));
  for (let n = 2; n <= 5; n++) (n === 2 ? [['C', 'GB-4'], ['J', 'GB-5']] : [['B', 'GB-4'], ['J', 'GB-4']]).forEach(([g, mk]) =>
    bar(`L${n}-GB-${g}-5-6`, 'CG', n, `Light well, line ${g}, 5–6`, mk, [['Location', `Level ${n}, light well edge girder on line ${g}, 5 to 6`], ['Mark', `${mk} (CIP, S155)`], ['Span', ft(36)], ['Source', 'S106–S113, S155']],
      [X[g], LEV[n], Z['5']], [X[g], LEV[n], Z['6']], { s: 'rect', w: 2.0, d: 4.0 }));
  bar('L2-GB-B-5-6-PED', 'CG', 2, 'Line B, 5–6', 'GB-6', [['Location', 'Level 2, line B 5 to 6, supports the pedestrian bridge'], ['Mark', 'GB-6 (CIP)'], ['Source', 'S106, S155']], [X.B - 1, LEV[2], Z['5']], [X.B - 1, LEV[2], Z['6']], { s: 'rect', w: 2.0, d: 4.0 });
  for (let i = 0; i < XO.length - 1; i++) {
    const a = XO[i], b = XO[i + 1];
    bar(`L3-CG-12-${a}${b}`, 'CG', 3, `Line 12, ${a}–${b}`, '12′ deep CIP girder',
      [['Location', `Level 3, line 12 girder, ${a} to ${b} (continuous A–K; supports at A, D, E, G, K)`], ['Section', '3′-6″ wide × 12′-0″ deep, 3′-4″ haunch at each steel column; top El. 148.0, bottom El. 136.0'], ['Source', 'S153']],
      [i === 0 ? -1.75 : X[a], LEV[3], Z['12']], [b === 'K' ? 325.75 : X[b], LEV[3], Z['12']], { s: 'rect', w: 3.5, d: 12 });
  }

  /* ============ DOUBLE TEES (S106–S113, S174) ============ */
  const TEE_BAYS = [['A', 'B', 5], ['B', 'C', 4], ['C', 'D', 4], ['D', 'E', 2], ['E', 'F', 4], ['F', 'G', 4], ['G', 'H', 4], ['H', 'J', 4], ['J', 'K', 5]];
  const TEEINFO = { T1: 'T1 edge tee, 7′-11⅝″ wide, 2′-8″ deep, 4 in flange', T2: 'T2 / T2A, 8′-11¾″ wide, 2′-8″ deep, 4 in flange', T3: 'T3 / T3A, 8′-11¾″ wide, 2′-4″ deep, 2 in flange + 2 in CIP topping', T4: 'T4 edge tee, 2′-4″ deep, 2 in flange + topping' };
  function tee(id, type, n, bayTxt, a, b, k, cnt, xc, w, za, zb, ya, yb, mk, extra) {
    const d = /T3|T4/.test(mk) ? 2.33 : 2.67;
    add({ id, type, level: n, grid: `Bay ${bayTxt}, ${a}–${b}`, size: mk,
      props: [['Location', `${type === 'RDT' ? 'Ramp' : 'Level ' + n}, bay ${bayTxt}, tee ${k} of ${cnt} in ${a}–${b} (from the west)`], ['Section', TEEINFO[mk] + ' (S174)'], ['Span', ft(Math.hypot(zb - za, yb - ya))],
        ['Source', 'S106–S113, S174']].concat(extra || []),
      g: { k: 'bar', a: [xc, ya, za], b: [xc, yb, zb], sec: { s: 'dt', w: w - 0.05, d, tf: 0.33 } } });
  }
  function teeBay(n, zl0, zl1, bayTxt, include, opts) {
    opts = opts || {};
    TEE_BAYS.forEach(([a, b, cnt]) => {
      if (!include(a, b)) return;
      for (let k = 0; k < cnt; k++) {
        const w = (X[b] - X[a]) / cnt, xc = X[a] + w * (k + 0.5);
        let za = Z[zl0] + 0.75;
        const zb = Z[zl1] - 0.75, cut = opts.stair && xc > 251 && xc < 272.5;
        if (cut) za = opts.stair + 0.5;
        const edge = (a === 'A' && k === 0) || (a === 'B' && k === 0 && n === 2) || (b === 'K' && k === cnt - 1);
        const mk = edge ? 'T1' : 'T2';
        const ya = opts.ramp ? opts.ramp(xc) : LEV[n];
        tee(`${opts.pre || 'L' + n + '-DT-' + bayTxt}-${a}${b}${k + 1}`, opts.ramp ? 'RDT' : 'DT', n, bayTxt, a, b, k + 1, cnt, xc, w, za, zb, ya, ya, mk,
          (opts.ramp ? [['Elevation', elTxt(ya) + ' (ramp)']] : []).concat(cut ? [['Note', 'Short tee at the stair opening (T2A / T3)']] : []));
      }
    });
  }
  for (let n = 2; n <= 5; n++) {
    const AB = a => n >= 3 || a !== 'A';
    teeBay(n, '1', '1.9', '1-2', a => a !== 'A' && a !== 'J');
    teeBay(n, '1', '2', '1-2', a => a === 'J');
    teeBay(n, '2', '3', '2-3', a => a === 'J');
    teeBay(n, '3.1', '4', '3-4', a => a !== 'A' && a !== 'J', { stair: 142.7 });
    teeBay(n, '3', '4', '3-4', a => a === 'J');
    if (n >= 3) ['1-2', '2-3', '3-4'].forEach(bt => { const [p, q] = bt.split('-'); teeBay(n, p, q, bt, a => a === 'A'); });
    [['4', '5'], ['6', '7'], ['7', '8'], ['8', '9'], ['9', '10'], ['10', '11']].forEach(([p, q]) =>
      teeBay(n, p, q, `${p}-${q}`, a => AB(a), p === '8' ? { stair: 430.7 } : null));
    teeBay(n, '5', '6', '5-6', (a, b) => n === 2 ? (a === 'B' || b === 'K') : (a === 'A' || b === 'K'));
    if (n <= 4) teeBay(n, '2.1', '2.9', '2-3R', a => a !== 'A' && a !== 'J', { ramp: xc => rampY(n, xc) });
    if (n >= 3) {
      const runs = [[18, 45, 3], [45, 81, 4], [81, 117, 4], [117, 135, 2], [135, 171, 4], [171, 207, 4], [207, 243, 4], [243, 279, 4], [279, 306, 3]];
      let k = 0;
      runs.forEach(([x0, x1, c], ri) => { for (let j = 0; j < c; j++) { k++; const w = (x1 - x0) / c, xc = x0 + w * (j + 0.5); const mk = (ri === 0 && j === 0) || (ri === runs.length - 1 && j === c - 1) ? 'T4' : 'T3';
        tee(`L${n}-DT-11-12-${P2(k)}`, 'DT', n, '11-12', XO[ri], XO[ri + 1], k, 32, xc, w, Z['11'] + 0.75, Z['12'] - 0.75, LEV[n], LEV[n], mk); } });
      [['A', 0, 18], ['K', 306, X.K]].forEach(([g, x0, x1]) => quad(`L${n}-SLAB-11-12-${g}`, 'SLAB', n, `Part Plan A, ${g}, 11–12`, 'CIP slab',
        [['Location', `Level ${n}, cast-in-place corner slab between lines 11 and 12 at line ${g} (Part Plan A), with curved curb R = 12′-5″`], ['Source', 'S109, S111, S113']], hslab(x0, x1, Z['11'], Z['12'], LEV[n]), 0.75));
    }
  }
  teeBay(2, '2.1', '2.9', 'ramp 1', a => a === 'G' || a === 'H', { ramp: ramp1Y, pre: 'L2-DT-RAMP1' });

  /* ============ EDGES: spandrels & parapets (S106–S113, S176) ============ */
  const GBMARK = { '1-2': 'GB-2', '2-3': 'GB-1', '3-4': 'GB-3', '4-5': 'GB-1', '5-6': 'GB-4', '8-9': 'GB-2' };
  for (let n = 2; n <= 5; n++) {
    const edges = n === 2 ? ['B', 'K'] : ['A', 'K'];
    const zl = n === 2 ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    edges.forEach(e => {
      for (let i = 0; i < zl.length - 1; i++) {
        const bt = zl[i] + '-' + zl[i + 1], xo = X[e] + (e === 'K' ? 1.2 : -1.2), mk = GBMARK[bt] || 'GB-1';
        quad(`L${n}-SP-${e}-${bt}`, 'SP', n, `Edge ${e}, ${bt}`, mk,
          [['Location', `Level ${n}, edge line ${e}, bay ${bt}`], ['Mark', `${mk} edge beam with precast spandrel panel (G-1) and CIP parapet / curb (G-5, detail J)`], ['Span', ft(Z[zl[i + 1]] - Z[zl[i]])], ['Source', 'S106–S113, S176']],
          wallQ([xo, Z[zl[i]]], [xo, Z[zl[i + 1]]], LEV[n] - 2.67, LEV[n] + 3.5), 0.67);
      }
    });
    const xs = n === 2 ? XO.slice(1) : XO;
    [['1', -1.2], [n === 2 ? '11' : '12', 1.2]].forEach(([line, dz]) => { for (let i = 0; i < xs.length - 1; i++) quad(`L${n}-SP-${line}-${xs[i]}${xs[i + 1]}`, 'SP', n, `Edge line ${line}, ${xs[i]}–${xs[i + 1]}`, 'Spandrel',
      [['Location', `Level ${n}, edge on line ${line}, ${xs[i]} to ${xs[i + 1]}`], ['Section', 'Precast spandrel panel / parapet on the edge beam (S176 G-1)'], ['Source', 'S106–S113, S176']],
      wallQ([X[xs[i]], Z[line] + dz], [X[xs[i + 1]], Z[line] + dz], LEV[n] - 2.67, LEV[n] + 3.5), 0.67); });
  }
  for (let n = 3; n <= 5; n++) [['A', 0, 1], ['L', X.L, -1]].forEach(([g, cx, s]) => {
    for (let i = 0; i < 4; i++) {
      const a0 = i * Math.PI / 8, a1 = (i + 1) * Math.PI / 8, r = 12.42, p = a => [cx + s * r * Math.cos(a), Z['11'] + r * Math.sin(a)];
      quad(`L${n}-CURB-${g}11-${i + 1}`, 'CURB', n, `Curved curb at ${g}-11`, '12 in wall', [['Location', `Level ${n}, curved 12 in curb wall R = 12′-5″ about ${g}-11, segment ${i + 1} of 4`], ['Source', 'S109, S116–S125']],
        wallQ(p(a0), p(a1), LEV[n], LEV[n] + 3.5), 1.0);
    }
  });

  /* ============ DRUM RAMPS (S114–S125, S149, S160, S161) ============ */
  const R_IN = 36, R_OUT = 61, R_COL = 38, SEG = 16, ZC = Z['12'] - R_OUT, DEG = Math.PI / 180;
  const DRUMS = [
    { code: 'NR', name: 'Entrance drum (Ramps A and B)', cx: X.R, dir: 1, sheets: 'S114–S119', capY: yE(105), cols: 1,
      threads: [{ k: 'A', th0: 0, el0: 115, el1: 169, travel: 810, note: 'starts at grade on its leg at the east point' }, { k: 'B', th0: 225, el0: 115, el1: 156, travel: 585, note: 'starts at grade on its leg at the north-west' }] },
    { code: 'XR', name: 'Exit drum (Ramps C and D)', cx: X.A1, dir: -1, sheets: 'S120–S125', capY: yE(106.75), cols: 9,
      threads: [{ k: 'C', th0: -45, el0: 130, el1: 169, travel: 585, note: 'enters on its elevated leg at the north-east' }, { k: 'D', th0: -45, el0: 116, el1: 156, travel: 585, note: 'enters on its grade leg at the north-east' }] }
  ];
  const tEl = (T, t) => T.el0 + (T.el1 - T.el0) * t / T.travel;
  function passes(D, phi) {
    const out = [];
    D.threads.forEach(T => { let t = (((phi - T.th0) * D.dir) % 360 + 360) % 360; for (; t <= T.travel + 1e-6; t += 360) out.push(yE(tEl(T, t))); });
    return out.sort((a, b) => a - b);
  }
  DRUMS.forEach(D => {
    const pt = (r, th, y) => [D.cx + r * Math.cos(th * DEG), y, ZC + r * Math.sin(th * DEG)];
    D.threads.forEach(T => {
      const nseg = Math.round(T.travel / 22.5);
      for (let s = 0; s < nseg; s++) {
        const t0 = s * 22.5, t1 = t0 + 22.5, a0 = T.th0 + D.dir * t0, a1 = T.th0 + D.dir * t1;
        const y0 = yE(tEl(T, t0)), y1 = yE(tEl(T, t1)), lv = levelOf((y0 + y1) / 2);
        quad(`${D.code}-${T.k}-S${P2(s + 1)}`, 'HS', lv, `${D.name}, Ramp ${T.k}`, '8 in slab',
          [['Location', `${D.name}, Ramp ${T.k}, segment ${s + 1} of ${nseg} (turn ${Math.floor(t0 / 360) + 1})`], ['Elevation', `${elTxt(y0)} to ${elTxt(y1)}`],
            ['Section', '8 in CIP slab spanning 20′-2″ radially from the inner spandrel beam to the outer wall; #5@6 T, #4@6 B radial'], ['Source', `${D.sheets}, S161; ${T.note}; elevations interpolated`]],
          [pt(R_IN, a0, y0), pt(R_OUT, a0, y0), pt(R_OUT, a1, y1), pt(R_IN, a1, y1)], 0.67);
        bar(`${D.code}-${T.k}-SB${P2(s + 1)}`, 'HB', lv, `${D.name}, Ramp ${T.k}`, '12×105 spandrel',
          [['Location', `${D.name}, Ramp ${T.k}, inner spandrel beam at segment ${s + 1}`], ['Section', '1′-0″ wide × 8′-9″ deep (4′-8″ above the slab), seated on the round columns (RP-9 / RP-17)'], ['Source', 'S161, ' + D.sheets]],
          pt(R_IN + 0.5, a0, y0 + 4.67), pt(R_IN + 0.5, a1, y1 + 4.67), { s: 'rect', w: 1.0, d: 8.75 });
      }
    });
    [90, 135, 180, 225, 270, 315, 0, 45].forEach((th, i) => {
      const cn = D.cols + i, ps = passes(D, th);
      let y0 = D.capY;
      ps.forEach((yp, j) => {
        bar(`${D.code}-C${P2(cn)}-${j + 1}`, 'RC', levelOf(y0 + 0.5), `${D.name}, column C-${cn}`, '24 in round',
          [['Location', `${D.name}, column C-${cn} on the ${th}° radial line, ${elTxt(y0)} to the ramp at ${elTxt(yp)}`], ['Section', '24 in dia., reinforcement per S149 (8-#7 to 16-#9 by storey)'], ['Source', 'S149, ' + D.sheets]],
          pt(R_COL, th, y0), pt(R_COL, th, yp - 0.67), { s: 'round', dia: 2.0 });
        y0 = yp;
      });
      const src = D.code === 'NR' ? 'S114' : 'S120';
      bar(`${D.code}-PC-C${P2(cn)}`, 'PC', 1, `${D.name}, C-${cn}`, i === 0 ? 'PC-4' : 'PC-3', [['Location', `Pile cap under column C-${cn}`], ['Top', elTxt(D.capY)], ['Source', src]],
        pt(R_COL, th, D.capY - 3), pt(R_COL, th, D.capY), { s: 'rect', w: 6, d: 6, center: true });
      bar(`${D.code}-PC-W${P2(i + 1)}`, 'PC', 1, `${D.name}, outer wall`, th === 90 ? 'PC-7' : 'PC-4', [['Location', `Pile cap under the outer wall on the ${th}° radial line`], ['Source', src]],
        pt(R_OUT, th, D.capY - 3), pt(R_OUT, th, D.capY), { s: 'rect', w: 6, d: 6, center: true });
      bar(`${D.code}-TB-R${P2(i + 1)}`, 'TIE', 1, `${D.name}, radial tie beam`, 'TB-4', [['Location', `Radial tie beam on the ${th}° line, column cap to wall cap`], ['Source', src]],
        pt(R_COL, th, D.capY), pt(R_OUT, th, D.capY), { s: 'rect', w: 1.5, d: 1.5 });
      bar(`${D.code}-TB-C${P2(i + 1)}`, 'TIE', 1, `${D.name}, ring tie beam`, 'TB-4', [['Location', `Ring tie beam between the column caps at ${th}° and ${th + 45}°`], ['Source', src]],
        pt(R_COL, th, D.capY), pt(R_COL, th + 45, D.capY), { s: 'rect', w: 1.5, d: 1.5 });
    });
    const linkSide = D.dir === 1 ? [101.25, 123.75] : [78.75, 56.25];
    // grade-leg entries: one 22.5° sector on the side the leg arrives from (Ramp A at the east point, Ramp B at the north-west,
    // exit Ramps C and D at the north-east); the opening runs from grade up to the first ramp above it
    const legSide = D.code === 'NR' ? [348.75, 213.75] : [326.25];
    for (let s = 0; s < SEG; s++) {
      const a0 = s * 22.5, a1 = a0 + 22.5, mid = a0 + 11.25, ps = passes(D, mid);
      const lv = [D.capY + 1.5].concat(ps), top = ps[ps.length - 1] + 4;
      for (let j = 0; j < lv.length; j++) {
        const yb = lv[j], yt = j + 1 < lv.length ? lv[j + 1] : top;
        if (linkSide.includes(mid) && yb > 20) continue;
        if (legSide.includes(mid) && j === 0) continue;
        quad(`${D.code}-W${P2(s + 1)}-${j + 1}`, 'RW', levelOf(yb + 0.5), `${D.name}, outer wall`, '10 in wall',
          [['Location', `${D.name}, outer wall, sector ${s + 1} of 16 (${a0}° to ${a1}°), ${elTxt(yb)} to ${elTxt(yt)}${j + 1 === lv.length ? ' (parapet)' : ''}`],
            ['Section', '10 in CIP wall, continuous from a 3′-0″ × 1′-6″ strip footing on the pile caps (RP-8 / RP-9, S161)'], ['Source', 'S161, ' + D.sheets]],
          [pt(R_OUT + 0.4, a0, yt), pt(R_OUT + 0.4, a1, yt), pt(R_OUT + 0.4, a1, yb), pt(R_OUT + 0.4, a0, yb)], 0.83);
      }
    }
  });

  /* ============ ENTRANCE BRIDGE (S116–S119, S149, S162) ============ */
  const zNorth = x => {
    const k = [[X.L, Z['11.5']], [X.M - 4, Z['11.2']], [X.P + 4, Z['11.2']], [X.Q + 8, Z['11.5']], [X.R, Z['11.5']]];
    if (x <= k[0][0]) return k[0][1];
    for (let i = 0; i < k.length - 1; i++) if (x <= k[i + 1][0]) return k[i][1] + (k[i + 1][1] - k[i][1]) * (x - k[i][0]) / (k[i + 1][0] - k[i][0]);
    return k[k.length - 1][1];
  };
  const GN = { [X.K]: 'K', [X.L]: 'L', [X.M]: 'M', [X.N]: 'N', [X.P]: 'P', [X.Q]: 'Q', [X.R]: 'R' };
  const sta = x => GN[x] || (GN[x - 18] ? GN[x - 18] + '+18′' : GN[x + 4] ? GN[x + 4] + '−4′' : GN[x - 4] ? GN[x - 4] + '+4′' : GN[x - 8] ? GN[x - 8] + '+8′' : ft(x - X.L) + ' from L');
  const SRC_BR = { 3: 'S116, S118', 4: 'S119', 5: 'S117' };
  const DRUMY = { 3: yE(145), 4: yE(156), 5: yE(169) };
  const DEEP = { L: ['3DB7', '48×144'], M: ['3DB1', '36×144'], N: ['3DB2', '36×144'], P: ['3DB3', '30×144 (uncertain)'], Q: ['3DB4', '36×144'] };
  for (let n = 3; n <= 5; n++) {
    const y = LEV[n], src = SRC_BR[n], yd = DRUMY[n];
    const yAt = x => x <= X.Q + 8 ? y : y + (yd - y) * (x - (X.Q + 8)) / (X.R - (X.Q + 8));
    const st = [X.L, X.L + 18, X.M - 4, X.M, X.M + 18, X.N, X.N + 18, X.P, X.P + 4, X.P + 18, X.Q, X.Q + 8, X.Q + 40, X.R];
    for (let i = 0; i < st.length - 1; i++) {
      const xa = st[i], xb = st[i + 1];
      quad(`BR-L${n}-S${P2(i + 1)}`, 'BS', n, `Entrance bridge, ${sta(xa)} to ${sta(xb)}`, n === 3 && xa >= X.Q ? '10 in slab' : '7–9 in slab',
        [['Location', `Entrance bridge, Level ${n}, deck panel ${sta(xa)} to ${sta(xb)}${zNorth(xa) < Z['11.5'] - 0.5 || zNorth(xb) < Z['11.5'] - 0.5 ? ' (bump-out to line 11.2)' : ''}${xa >= X.Q + 8 ? ', sloping to the drum' : ''}`],
          ['Section', '7 in min – 9 in max CIP slab, sloped to drains'], ['Elevation', xa >= X.Q + 8 ? `${elTxt(yAt(xa))} to ${elTxt(yAt(xb))}` : n === 3 ? 'H.P. El. 148′-0⅜″ (S116)' : n === 5 ? 'H.P. El. 172′-0⅜″ (S117)' : elTxt(y)], ['Source', src]],
        [[xa, yAt(xa), zNorth(xa)], [xb, yAt(xb), zNorth(xb)], [xb, yAt(xb), Z['12']], [xa, yAt(xa), Z['12']]], 0.67);
    }
    [X.L, X.L + 18, X.M, X.M + 18, X.N, X.N + 18, X.P, X.P + 18, X.Q].forEach((x, i) => {
      if (n === 3 && !GN[x]) return;
      const deep = n === 3 ? DEEP[GN[x]] : null, mark = deep ? deep[0] : `${n}DB${i + 1}`;
      bar(`BR-L${n}-${mark}`, 'BB', n, `Entrance bridge, ${sta(x)}`, mark, [['Location', `Entrance bridge, Level ${n}, transverse beam at ${sta(x)}`], ['Mark / size', `${mark} (${deep ? deep[1] + ' in, 12 ft deep beam spanning the storey below' : '18×36 in'})`], ['Source', src + (deep ? ', S118, S149' : '')]],
        [x, y, zNorth(x)], [x, y, Z['12']], { s: 'rect', w: deep ? +deep[1].split('×')[0] / 12 : 1.5, d: deep ? 12 : 3 });
    });
    if (n >= 4) bar(`BR-L${n}-${n}DB10`, 'BB', n, 'Entrance bridge at R', `${n}DB10`, [['Location', `Entrance link, Level ${n}, transverse beam at grid R (drum tangent)`], ['Mark / size', `${n}DB10 (24×24 in)`], ['Source', src]],
      [X.R, yd, Z['11.5']], [X.R, yd, Z['12']], { s: 'rect', w: 2, d: 2 });
    const NE = n === 3
      ? [['3DB10', X.L, X.M - 4, '12×49'], ['3DB11', X.M - 4, X.N, '12×49'], ['3DB12', X.N, X.P + 4, '12×49'], ['3DB13', X.P + 4, X.Q + 8, '12×49'], ['3DB8', X.Q + 8, X.R, '48×144']]
      : [[`${n}DB11`, X.L, X.M - 4, '12×49'], [`${n}DB12`, X.M - 4, X.N, '30×36'], [`${n}DB13`, X.N, X.P + 4, '30×36'], [`${n}DB14`, X.P + 4, X.Q + 8, '30×36'], [`${n}DB15`, X.Q + 8, X.R, '12×105']];
    NE.forEach(([mk, xa, xb, sz]) => bar(`BR-L${n}-${mk}`, 'BB', n, 'Entrance bridge, north edge', mk,
      [['Location', `Entrance bridge, Level ${n}, north edge beam ${sta(xa)} to ${sta(xb)}${Math.abs(zNorth(xa) - zNorth(xb)) > 1 ? ' (angled, bump-out)' : ''}`], ['Mark / size', `${mk} (${sz} in)`], ['Source', src]],
      [xa, yAt(xa), zNorth(xa)], [xb, yAt(xb), zNorth(xb)], { s: 'rect', w: +sz.split('×')[0] / 12, d: Math.min(+sz.split('×')[1] / 12, 12) }));
    if (n === 3) [['3DB5', X.L, X.Q, '48×144', '11.5'], ['3DB6', X.L, X.Q, '42×144', '12'], ['3DB9', X.Q, X.R, '42×144', '12']].forEach(([mk, xa, xb, sz, line]) =>
      bar(`BR-L3-${mk}`, 'BB', 3, `Entrance bridge, line ${line}`, mk, [['Location', `Entrance bridge, 12 ft deep beam on line ${line}, ${sta(xa)} to ${sta(xb)}, spanning Level 2 to Level 3`], ['Mark / size', `${mk} (${sz} in)`], ['Source', 'S116, S118, S162']],
        [xa, yAt(xa), Z[line]], [xb, yAt(xb), Z[line]], { s: 'rect', w: +sz.split('×')[0] / 12, d: 12 }));
    const xsW = [X.L, X.M, X.N, X.P, X.Q, X.Q + 8, X.R];
    for (let i = 0; i < xsW.length - 1; i++) {
      const xa = xsW[i], xb = xsW[i + 1], yt = n === 5 ? 3.5 : 12 - 0.67;
      quad(`BR-L${n}-W12-${i + 1}`, 'BW', n, 'Entrance bridge, line 12 wall', '12 in wall', [['Location', `Entrance bridge, line 12 wall ${sta(xa)} to ${sta(xb)}, ${n === 5 ? 'parapet above Level 5' : `Level ${n} to Level ${n + 1}`}`], ['Source', 'S162 (RP-20)']],
        [[xa, yAt(xa) + yt, Z['12'] + 0.6], [xb, yAt(xb) + yt, Z['12'] + 0.6], [xb, yAt(xb), Z['12'] + 0.6], [xa, yAt(xa), Z['12'] + 0.6]], 1.0);
      quad(`BR-L${n}-WN-${i + 1}`, 'BW', n, 'Entrance bridge, north wall', '12 in wall', [['Location', `Entrance bridge, north edge wall ${sta(xa)} to ${sta(xb)}, ${n === 5 ? 'parapet above Level 5' : `Level ${n} to Level ${n + 1}`}`], ['Source', 'S162 (RP-21); extent uncertain']],
        [[xa, yAt(xa) + yt, zNorth(xa) - 0.6], [xb, yAt(xb) + yt, zNorth(xb) - 0.6], [xb, yAt(xb), zNorth(xb) - 0.6], [xa, yAt(xa), zNorth(xa) - 0.6]], 1.0);
    }
    quad(`BR-L${n}-KL`, 'BS', n, 'Entrance bridge, K–L transition', 'CIP slab', [['Location', `Entrance bridge, Level ${n}, K–L transition slab between lines 11 and 12 (curved curb R = 12′-5″)`], ['Source', src + ', S109']],
      hslab(X.K, X.L, Z['11'], Z['12'], LEV[n]), 0.67);
  }
  [['L', '12', 3.5, '42 in dia., 18-#9'], ['P', '12', 3.5, '42 in dia., 45-#11'], ['L', '11.5', 4, '48 in dia., 46-#11'], ['P', '11.5', 4, '48 in dia., 51-#11']].forEach(([g, line, d, txt]) =>
    bar(`BR-L1-C-${g}${line}`, 'BP', 1, `Entrance bridge, ${g}-${line}`, `${d * 12} in round`, [['Location', `Entrance bridge column ${g}-${line}, ground to Level 2 (12 ft deep beams above)`], ['Section', txt + ", f'c 5000 psi"], ['Source', 'S149, S118']],
      [X[g], 0, Z[line]], [X[g], LEV[2], Z[line]], { s: 'round', dia: d }));
  [['L', '11.5', 'wall', '10×30 in wall-column, 12-#8 (type M)'], ['M', '11.2', 'round', '24 in dia., 8-#7'], ['N', '11.2', 'round', '24 in dia., 8-#7'], ['P', '11.2', 'round', '24 in dia., 8-#7'], ['Q', '11.5', 'round', '24 in dia., 16-#9']]
    .forEach(([g, line, s, txt]) => [3, 4].forEach(n => bar(`BR-L${n}-C-${g}${line}`, 'BP', n, `Entrance bridge, ${g}-${line}`, s === 'wall' ? '10×30 wall-column' : '24 in round',
      [['Location', `Entrance bridge column ${g}-${line}, Level ${n} to Level ${n + 1}`], ['Section', txt], ['Source', 'S149, S116–S119']],
      [X[g], LEV[n], Z[line]], [X[g], LEV[n + 1] - 3, Z[line]], s === 'wall' ? { s: 'rect', w: 0.83, d: 2.5, center: true } : { s: 'round', dia: 2.0 })));
  [['P', '11.5', 'PC-15', 111], ['P', '12', 'PC-10', 111], ['L', '11.5', 'PC-12', 110.83], ['L', '12', 'PC-8', 104]].forEach(([g, line, mk, el]) =>
    bar(`BR-PC-${g}${line}`, 'PC', 1, `Entrance bridge, ${g}-${line}`, mk, [['Location', `Pile cap at ${g}-${line}`], ['Top', 'El. ' + el], ['Source', 'S114, S105']], [X[g], yE(el) - 3.5, Z[line]], [X[g], yE(el), Z[line]], { s: 'rect', w: 7, d: 7, center: true }));
  bar('BR-TB-P', 'TIE', 1, 'Entrance bridge, line P', 'TB-3', [['Location', 'Tie beam along P between the 11.5 and 12 caps'], ['Source', 'S114']], [X.P, yE(111), Z['11.5']], [X.P, yE(111), Z['12']], { s: 'rect', w: 1.5, d: 1.5 });
  const leg = (id, name, c0, c1, w, y0, y1, src, wallH) => {
    const dx = c1[0] - c0[0], dz = c1[1] - c0[1], L = Math.hypot(dx, dz), nx = -dz / L * w / 2, nz = dx / L * w / 2;
    quad(id + '-S', 'BS', levelOf(Math.max(y0, y1)), name, '8 in slab', [['Location', name + ', ramp slab'], ['Length', ft(L)], ['Elevation', `${elTxt(y0)} to ${elTxt(y1)}`], ['Source', src]],
      [[c0[0] + nx, y0, c0[1] + nz], [c1[0] + nx, y1, c1[1] + nz], [c1[0] - nx, y1, c1[1] - nz], [c0[0] - nx, y0, c0[1] - nz]], 0.67);
    [1, -1].forEach(sg => quad(`${id}-W${sg > 0 ? 1 : 2}`, 'BW', levelOf(y0), name, '10 in wall', [['Location', `${name}, retaining / parapet wall, side ${sg > 0 ? 1 : 2}`], ['Source', src]],
      [[c0[0] + sg * nx, y0 + wallH, c0[1] + sg * nz], [c1[0] + sg * nx, y1 + wallH, c1[1] + sg * nz], [c1[0] + sg * nx, Math.min(y1, 0) - 2, c1[1] + sg * nz], [c0[0] + sg * nx, Math.min(y0, 0) - 2, c0[1] + sg * nz]], 0.83));
  };
  leg('NR-LEG-A', 'Ramp A grade leg (entrance drum)', [592.5, 527], [592.5, ZC], 25, yE(115), yE(115), 'S114, S115 (RP-1, RP-4)', 4);
  leg('NR-LEG-B', 'Ramp B grade leg (entrance drum)', [465, 585], [508, 541], 21, yE(115), yE(115), 'S118 (RP-1, RP-5); position ±5 ft', 4);

  /* ============ EXIT LINK, LEGS AND LANES (S120–S125) ============ */
  const EXM = { 3: ['3DB14', '3DB15'], 4: ['4DB16', '4DB17'], 5: ['5DB17', '5DB16'] };
  for (let n = 3; n <= 5; n++) {
    const yd = DRUMY[n], yAt = x => yd + (LEV[n] - yd) * (x - X.A1) / (X.A - X.A1);
    [[X.A1, -28.5], [-28.5, -2], [-2, 0]].forEach(([xa, xb], i) => quad(`XL-L${n}-S${i + 1}`, 'BS', n, 'Exit link, A1–A', n === 3 ? '10 in slab' : '8 in slab',
      [['Location', `Exit link, Level ${n}, ${['at the drum tangent', 'between the drum wall and line A', 'at the 2 ft expansion joint at A'][i]}, lines 11.5–12`], ['Elevation', `${elTxt(yAt(xa))} to ${elTxt(yAt(xb))}`], ['Source', 'S122, S123, S125']],
      [[xa, yAt(xa), Z['11.5']], [xb, yAt(xb), Z['11.5']], [xb, yAt(xb), Z['12']], [xa, yAt(xa), Z['12']]], 0.75));
    bar(`XL-L${n}-${EXM[n][0]}`, 'BB', n, 'Exit link, line 11.5', EXM[n][0], [['Location', `Exit link, Level ${n}, edge beam on line 11.5, A1 to A`], ['Mark / size', EXM[n][0] + ' (12×105 in)'], ['Source', 'S122, S123, S125']],
      [X.A1, yd, Z['11.5']], [X.A, LEV[n], Z['11.5']], { s: 'rect', w: 1.0, d: 8.75 });
    if (n === 3) bar('XL-L3-3DB15', 'BB', 3, 'Exit link, line 12', '3DB15', [['Location', 'Exit link, Level 3, 12 ft deep beam on line 12, A1 to A'], ['Mark / size', '3DB15 (42×144 in)'], ['Source', 'S122']],
      [X.A1, yd, Z['12']], [X.A, LEV[3], Z['12']], { s: 'rect', w: 3.5, d: 12 });
    else {
      bar(`XL-L${n}-${EXM[n][1]}`, 'BB', n, 'Exit link at A1', EXM[n][1], [['Location', `Exit link, Level ${n}, transverse beam at A1 (drum tangent)`], ['Mark / size', EXM[n][1] + ' (24×24 in)'], ['Source', n === 4 ? 'S125' : 'S123']],
        [X.A1, yd, Z['11.5']], [X.A1, yd, Z['12']], { s: 'rect', w: 2, d: 2 });
      quad(`XL-L${n}-W12`, 'BW', n, 'Exit link, line 12 wall', '10 in wall', [['Location', `Exit link, line 12 wall ${n === 5 ? '(parapet above Level 5)' : `Level ${n} to Level ${n + 1}`}: drum wall continued`], ['Source', 'S123, S125']],
        wallQ([X.A1, Z['12'] + 0.6], [X.A, Z['12'] + 0.6], yd, LEV[n] + (n === 5 ? 3.5 : 11.3)), 0.83);
    }
    bar(`XL-L${n}-EJ`, 'BB', n, 'Exit link at A−2′', 'Beam at exp. jt', [['Location', `Exit link, Level ${n}, transverse beam at the 2 ft expansion joint west of A`], ['Source', 'S122, S123, S125; size not read']],
      [-2, yAt(-2), Z['11.5']], [-2, yAt(-2), Z['12']], { s: 'rect', w: 1.5, d: 2.5 });
  }
  bar('XL-L3-C-11.5', 'BP', 3, 'Exit link, column', '24 in round', [['Location', 'Column under the Level 4 exit link on line 11.5, about 22 ft west of A ("COL. BELOW", S125)'], ['Source', 'S125; uncertain']],
    [-22, LEV[3], Z['11.5']], [-22, DRUMY[4] + (LEV[4] - DRUMY[4]) * 50 / 72 - 9, Z['11.5']], { s: 'round', dia: 2.0 });
  [['A', '11', 'PC-8'], ['A', '11.5', 'PC-4'], ['A', '12', 'PC-11']].forEach(([g, line, mk]) => bar(`XL-PC-${g}${line}`, 'PC', 1, `Exit link, ${g}-${line}`, mk, [['Location', `Pile cap at ${g}-${line}`], ['Top', 'El. 109.5'], ['Source', 'S120']],
    [X[g], yE(109.5) - 3.5, Z[line]], [X[g], yE(109.5), Z[line]], { s: 'rect', w: 7, d: 7, center: true }));
  const xd0 = [X.A1 + 48.5 * Math.cos(-45 * DEG), ZC + 48.5 * Math.sin(-45 * DEG)];
  leg('XR-LEG-D', 'Ramp D grade leg (exit drum)', xd0, [16, 594], 21, yE(116), yE(116), 'S124; geometry approximate', 4);
  leg('XR-LEG-C', 'Ramp C elevated leg (exit drum)', xd0, [16, 629], 21, yE(130), yE(125.5), 'S121, S120; elevated, geometry approximate', 3.5);
  [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E']].forEach(([a, b]) => {
    const xa = Math.max(X[a], 16), xb = X[b];
    const yc = x => yE(125.5) + (yE(116) - yE(125.5)) * (x - 16) / (X.E - 16);
    quad(`XG-D-${a}${b}`, 'BS', 1, 'Exit lane, Ramp D', '5 in slab on grade', [['Location', `Ramp D exit lane at grade north of line 11, ${a}–${b}`], ['Elevation', 'El. 116.0'], ['Source', 'S124']], hslab(xa, xb, 585, Z['11'], yE(116)), 0.42);
    quad(`XG-C-${a}${b}`, 'BS', levelOf(yc(xa)), 'Exit lane, Ramp C', '8 in slab', [['Location', `Ramp C exit lane between lines 11.5 and 12, ${a}–${b}, descending east to grade at E`], ['Elevation', `${elTxt(yc(xa))} to ${elTxt(yc(xb))}`], ['Source', 'S121; slope approximate']],
      [[xa, yc(xa), Z['11.5']], [xb, yc(xb), Z['11.5']], [xb, yc(xb), Z['12']], [xa, yc(xa), Z['12']]], 0.67);
    [[585, 'D', 0], [Z['11.5'], 'C', 1]].forEach(([z, k, el]) => quad(`XG-W${k}-${a}${b}`, 'BW', 1, `Exit lane ${k} wall`, '10 in wall', [['Location', `Exit lane wall, Ramp ${k}, ${a}–${b}`], ['Source', 'S120, S121, S124 (PC-21 caps)']],
      wallQ([xa, z], [xb, z], yE(113), (el ? Math.max(yc(xa), yc(xb)) : yE(116)) + 3.5), 0.83));
  });

  /* ============ LIGHT WELL SKYLIGHT (S138) ============ */
  const SKY_Y = yE(184.67), SKX = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'];
  SKX.forEach(g => ['5', '6'].forEach(line => bar(`SK-POST-${g}${line}`, 'SKP', 5, `Skylight support ${g}-${line}`, 'Column extension',
    [['Location', `Skylight support on grid ${g}-${line}, Level 5 to the skylight bearing`], ['Bearing', (g === 'D' || g === 'E') && line === '5' ? 'Fixed (non-shrink grout, S138)' : 'Slide bearing, PTFE on neoprene (S138)'], ['Plate', '¾ in × 12 in × 1′-2″ (S138 schedule)'], ['Source', 'S138']],
    [X[g], LEV[5], Z[line]], [X[g], SKY_Y - 1.5, Z[line]], { s: 'round', dia: 2.0 })));
  for (let i = 0; i < SKX.length - 1; i++) {
    const a = SKX[i], b = SKX[i + 1], sz = { AB: 'W18×71', BC: 'W18×65' }[a + b] || 'W18×60';
    ['5', '6'].forEach(line => bar(`SK-W${line}-${a}${b}`, 'SKB', 5, `Skylight, line ${line}, ${a}–${b}`, sz, [['Location', `Skylight beam on line ${line}, ${a} to ${b}`], ['Section', sz], ['Span', ft(X[b] - X[a])], ['Source', 'S138']],
      [X[a], SKY_Y, Z[line]], [X[b], SKY_Y, Z[line]], { s: 'w', d: 1.5, bf: 0.63 }));
  }
  bar('SK-WA-56', 'SKB', 5, 'Skylight, line A, 5–6', 'W18×76', [['Location', 'Skylight beam on line A, 5 to 6, at the elevator tower (3 in gap)'], ['Section', 'W18×76 (last digit uncertain)'], ['Source', 'S138']], [X.A, SKY_Y, Z['5']], [X.A, SKY_Y, Z['6']], { s: 'w', d: 1.5, bf: 0.63 });
  const BBX = [['BB1', 15], ['BB2', 30]];
  ['B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((g, i, arr) => { BBX.push(['BB3', X[g]]); const nx = X[arr[i + 1] || 'J']; if (nx - X[g] > 20) BBX.push(['BB3', (X[g] + nx) / 2]); });
  BBX.push(['BB4', X.J]);
  const BBS = { BB1: '12 × 15 in, tf ¾, tw ½', BB2: '12 × 15 in, tf ½, tw ⁵⁄₁₆, camber ½ in', BB3: '12 × 15 in, tf ⅜, tw ¼, camber ½ in', BB4: '15 × 15 in, tf ⅜, tw ⅜' };
  /* Gable roof (seen in aerial imagery): the box beams are rafters rising from the W18 beams on lines 5 and 6 to a ridge on the
     centre of the light well; glazing slopes both ways between them, ridge running A to J, glazed gable end at J.
     Ridge height is not on S138: assumed 9 ft above the eaves (about 27°). */
  const SKY_RISE = 9, ZR = (Z['5'] + Z['6']) / 2, yE5 = SKY_Y + 1.25, yR = yE5 + SKY_RISE;
  BBX.forEach(([mk, x], i) => [['5', Z['5'], 'S', 'south (line 5)'], ['6', Z['6'], 'N', 'north (line 6)']].forEach(([ln, z, k, side]) =>
    bar(`SK-${mk}-${P2(i + 1)}${k}`, 'SKX', 5, `Skylight rafter ${i + 1}`, mk, [['Location', `Skylight box-beam rafter ${i + 1} of ${BBX.length}, ${ft(x)} east of A, ${side} slope, eave to ridge, with glazing gutter`],
      ['Section', `${mk}: steel box ${BBS[mk]}`], ['Geometry', `Gable rafter, rise ${SKY_RISE} ft over ${ft(18)} (assumed; ridge height not on S138)`], ['Source', 'S138; gable profile from aerial imagery']],
      [x, yE5, z], [x, yR, ZR], { s: 'rect', w: mk === 'BB4' ? 1.25 : 1.0, d: 1.25 })));
  bar('SK-RIDGE', 'SKB', 5, 'Skylight ridge', 'Ridge', [['Location', 'Skylight ridge along the centre of the light well, A to J'], ['Section', 'Ridge member / cap per skylight manufacturer (not detailed on S138)'], ['Source', 'S138; aerial imagery']],
    [X.A, yR + 0.3, ZR], [X.J, yR + 0.3, ZR], { s: 'rect', w: 0.7, d: 0.5 });
  const gx = [X.A].concat(BBX.map(q => q[1]));
  for (let i = 0; i < gx.length - 1; i++) {
    const xa = gx[i] + 0.4, xb = gx[i + 1] - 0.4;
    quad(`SK-GL-${P2(i + 1)}`, 'GL', 5, `Skylight glazing bay ${i + 1}`, 'Glazing', [['Location', `Skylight glazing bay ${i + 1} (${ft(xa)} to ${ft(xb)} east of A), south slope, line 5 to ridge`], ['Source', 'S138; system per skylight manufacturer']],
      [[xa, yE5 + 0.1, Z['5']], [xb, yE5 + 0.1, Z['5']], [xb, yR + 0.1, ZR], [xa, yR + 0.1, ZR]], 0.1);
    quad(`SK-GL-${P2(i + 1)}B`, 'GL', 5, `Skylight glazing bay ${i + 1}`, 'Glazing', [['Location', `Skylight glazing bay ${i + 1} (${ft(xa)} to ${ft(xb)} east of A), north slope, ridge to line 6`], ['Source', 'S138']],
      [[xa, yR + 0.1, ZR], [xb, yR + 0.1, ZR], [xb, yE5 + 0.1, Z['6']], [xa, yE5 + 0.1, Z['6']]], 0.1);
  }
  quad('SK-GL-END-J', 'GL', 5, 'Skylight gable end at J', 'Glazing', [['Location', 'Glazed gable end of the skylight at line J'], ['Source', 'Aerial imagery; framing per skylight manufacturer']],
    [[X.J + 0.6, yE5, Z['5']], [X.J + 0.6, yR, ZR - 0.01], [X.J + 0.6, yR, ZR + 0.01], [X.J + 0.6, yE5, Z['6']]], 0.1);

  /* ============ STAIRS (S106–S113 openings, S129, S157–S159) ============ */
  function stair(code, name, x0, x1, z0, z1, els, src, opts) {
    opts = opts || {};
    const zm = (z0 + z1) / 2, land = Math.min(7, (x1 - x0) / 3);
    for (let i = 0; i < els.length - 1; i++) {
      const ya = yE(els[i]), yb = yE(els[i + 1]), ym = (ya + yb) / 2, lv = levelOf(ya + 0.5), st = `${elTxt(ya)} to ${elTxt(yb)}`;
      quad(`${code}-F${i + 1}A`, 'ST', lv, name, '6 in waist slab', [['Location', `${name}, flight up from ${elTxt(ya)} to the landing ${elTxt(ym)}`], ['Section', '6 in waist slab with cast steps (S158 details 1–6)'], ['Source', src]],
        [[x0, ya, z0 + 0.3], [x1 - land, ym, z0 + 0.3], [x1 - land, ym, zm - 0.3], [x0, ya, zm - 0.3]], 0.5);
      quad(`${code}-L${i + 1}`, 'SL', lv, name, 'Landing', [['Location', `${name}, intermediate landing ${elTxt(ym)} (storey ${st})`], ['Source', src]], hslab(x1 - land, x1, z0 + 0.3, z1 - 0.3, ym), 0.5);
      quad(`${code}-F${i + 1}B`, 'ST', lv, name, '6 in waist slab', [['Location', `${name}, flight up from the landing ${elTxt(ym)} to ${elTxt(yb)}`], ['Section', '6 in waist slab with cast steps'], ['Source', src]],
        [[x1 - land, ym, zm + 0.3], [x0, yb, zm + 0.3], [x0, yb, z1 - 0.3], [x1 - land, ym, z1 - 0.3]], 0.5);
      if (opts.core) quad(`${code}-CORE${i + 1}`, 'SW', lv, name, 'RC core', [['Location', `${name}, central RC spine wall, ${st}`], ['Section', opts.core], ['Source', src]],
        wallQ([x0 + 1, zm], [x1 - land - 1, zm], ya, yb), 1.0);
    }
    if (opts.walls) {
      const yb = yE(els[0]) - 1, yt = yE(opts.roof || els[els.length - 1]);
      [[[x0, z0], [x1, z0]], [[x1, z0], [x1, z1]], [[x1, z1], [x0, z1]], [[x0, z1], [x0, z0]]].forEach(([p, q], i) => quad(`${code}-W${i + 1}`, 'SW', 1, name, '10 in wall', [['Location', `${name}, tower wall ${i + 1} of 4, ${elTxt(yb)} to ${elTxt(yt)}`], ['Section', '10 in CIP wall (8 in centre wall, S158 / S159)'], ['Source', src]],
        wallQ(p, q, yb, yt), 0.83));
      if (opts.roof) quad(`${code}-ROOF`, 'SL', 5, name, 'Roof slab', [['Location', `${name}, tower roof slab El. ${opts.roof}`], ['Source', src]], hslab(x0, x1, z0, z1, yE(opts.roof)), 0.67);
    }
  }
  stair('ST29', 'Stair #29', 251, 272.5, 128.7, 142.7, [117.25, 137.25, 149.25, 161.25, 173.25], 'S106–S113, S134, S158', { walls: true, roof: 181.25 });
  stair('ST31', 'Stair #31', 251, 272.5, 416.8, 430.7, [117.25, 127.55, 137.25, 149.25, 161.25, 173.25], 'S107–S113, S158', { walls: true, roof: 183.6 });
  stair('ST20', 'Stair #20 (light well)', 258, 279, 252.5, 287.5, [117.33, 136.67, 148.67, 160.67, 172.67], 'S106–S112, S158, S159', { core: 'Obround RC spine 12′-2″ × 3′-0″, 20-#11 (S159)' });
  stair('ST24', 'Stairs #24–#26 (lobby tower, grid 5)', -20, -6, 264.6, 286.8, [136.67, 148.67, 160.67, 172.67], 'S129, S157, S158; cantilevered stair beams SB-1–SB-7');
  stair('ST27', 'Stair #27 (lobby tower above Level 5)', -20, -6, 264.6, 286.8, [172.67, 184.67, 196.67], 'S130, S158');

  /* ============ LOBBY: mezzanine, concourse, tower, escalator, roof trusses, pedestrian bridge ============ */
  const LX = [X.W, X.Y, X.ZL, X.A, X.A5, X.B, X.C, X.C5, X.D, X.E, X.F];
  for (let i = 0; i < LX.length - 1; i++) [[260, 288], [288, 351]].forEach(([z0, z1], j) =>
    quad(`LB-MEZZ-${P2(i + 1)}${'AB'[j]}`, 'LS', 1, 'Lobby mezzanine', '5 in slab on grade', [['Location', `Lobby / garage mezzanine slab on grade, x ${LX[i].toFixed(1)} to ${LX[i + 1].toFixed(1)} ft from A, z ${z0}–${z1}`], ['Elevation', 'El. 101.0'], ['Source', 'S126']],
      hslab(LX[i], LX[i + 1], z0, z1, yE(101)), 0.42));
  [X.ZL, X.A, X.B, X.C, X.D, X.E, X.F].forEach((x, i, arr) => { if (i < arr.length - 1) quad(`LB-CONC-${P2(i + 1)}`, 'LS', 1, 'Lobby concourse slab', '8–15 in slab', [['Location', `Concourse level slab (lobby roof), lines 6–7, x ${x.toFixed(1)} to ${arr[i + 1].toFixed(1)} ft from A`], ['Elevation', 'H.P. El. 116.0'], ['Source', 'S127']], hslab(x, arr[i + 1], Z['6'], Z['7'], yE(116)), 1.0); });
  [['MB-12', X.ZL, X.A, '6', '57×48'], ['MB-13', X.A, X.B, '6', '57×48'], ['MB-14', X.C, X.C5, '6', '57×48'], ['MB-15', X.C5, X.D, '6', '57×48'], ['MB-16', X.A, X.A5, '7', '60×48'], ['MB-17', X.A5, X.B, '7', '60×48']]
    .forEach(([mk, xa, xb, line, sz]) => bar(`LB-${mk}`, 'LB', 1, `Concourse, line ${line}`, mk, [['Location', `Concourse girder on line ${line}, x ${xa.toFixed(1)} to ${xb.toFixed(1)} ft from A`], ['Mark / size', `${mk} (${sz} in)`], ['Source', 'S127, S156']],
      [xa, yE(116), Z[line]], [xb, yE(116), Z[line]], { s: 'rect', w: +sz.split('×')[0] / 12, d: 4 }));
  [1, 8.3, 15.7, 23, 30.3, 37.7, 44].forEach((x, i) => bar(`LB-PTB${i + 1}`, 'LB', 1, 'Concourse joists A–B', `PTB${i + 1}`, [['Location', `Post-tensioned concourse beam PTB${i + 1}, line 6 to 7, ${ft(x)} east of A`], ['Mark / size', `PTB${i + 1} (${i === 0 ? '25×48' : i === 6 ? '36×48' : '24×48'} in)`], ['Source', 'S127, S155']],
    [x, yE(116), Z['6']], [x, yE(116), Z['7']], { s: 'rect', w: 2.0, d: 4 }));
  [['MB-1', X.B, '54'], ['MB-2', 87, '24'], ['MB-3', 94, '24'], ['MB-4', 101, '24'], ['MB-5', 108, '24'], ['MB-6', 114, '38'], ['MB-7', X.D + 2, '34.5'], ['MB-8', 144, '24'], ['MB-9', 153, '24'], ['MB-10', 162, '24'], ['MB-11', X.F, '72']]
    .forEach(([mk, x, w]) => bar(`LB-${mk}`, 'LB', 1, 'Concourse beams 6–7', mk, [['Location', `Concourse beam ${mk}, line 6 to 7 at ${ft(x)} east of A`], ['Mark / size', `${mk} (${w} in wide × varies)`], ['Source', 'S127, S156']],
      [x, yE(116), Z['6']], [x, yE(116), Z['7']], { s: 'rect', w: +w / 12, d: 4 }));
  bar('LB-MB-23', 'LB', 1, 'Concourse A–B', 'MB-23', [['Location', 'Concourse cross beam MB-23 at mid-bay, A to B'], ['Mark / size', 'MB-23 (24×26 in)'], ['Source', 'S127']], [X.A, yE(116), 319.5], [X.B, yE(116), 319.5], { s: 'rect', w: 2, d: 2.17 });
  [['N', [X.W, 244], [X.F, 244]], ['W', [X.W, 244], [X.W, 351]], ['S', [X.W, 351], [X.ZL, 351]]].forEach(([k, p, q]) => quad(`LB-WALL-${k}`, 'LW', 1, 'Lobby retaining wall', '1′-0″–1′-6″ wall',
    [['Location', `Lobby mezzanine ${({ N: 'north', W: 'west', S: 'south' })[k]} retaining wall (simplified alignment)`], ['Section', 'CIP retaining wall, footing El. 100, top El. 117–119 (MF sections S165–S172)'], ['Source', 'S126, S165–S172']],
    wallQ(p, q, yE(100), yE(118)), 1.25));
  const TW = [X.Y, X.ZL, Z['5'], Z['6']], TEL = [136.46, 148.46, 160.46, 172.46, 184.46, 196.46, 208.8];
  TEL.forEach((el, i) => {
    const y = yE(el), lab = i === 6 ? 'Roof' : `Lobby level ${i + 2}`;
    quad(`LT-SLAB-${i + 2}`, 'LS', levelOf(y), 'Lobby tower', i >= 4 ? '6 in slab' : '5 in slab', [['Location', `Lobby elevator / stair tower, ${lab} slab`], ['Elevation', 'El. ' + el], ['Source', i < 3 ? 'S129' : 'S130']], hslab(TW[0], TW[1], TW[2], TW[3], y), 0.5);
    [[[TW[0], TW[2]], [TW[1], TW[2]]], [[TW[1], TW[2]], [TW[1], TW[3]]], [[TW[1], TW[3]], [TW[0], TW[3]]], [[TW[0], TW[3]], [TW[0], TW[2]]]].forEach(([p, q], j) =>
      bar(`LT-B${i + 2}-${j + 1}`, 'LB', levelOf(y), 'Lobby tower beams', i === 6 ? 'RB' : `${i + 2}B`, [['Location', `Lobby tower, ${lab}, perimeter beam ${j + 1} of 4`], ['Section', '12×34½ to 12×36½ in (S129 / S130)'], ['Source', i < 3 ? 'S129' : 'S130']],
        [p[0], y, p[1]], [q[0], y, q[1]], { s: 'rect', w: 1, d: 3 }));
  });
  [[X.Y, Z['5']], [X.ZL, Z['5']], [X.Y, Z['6']], [X.ZL, Z['6']]].forEach(([x, z], j) => {
    const lv = [101].concat(TEL);
    for (let i = 0; i < lv.length - 1; i++) bar(`LT-C${j + 1}-${i + 1}`, 'LC', levelOf(yE(lv[i]) + 0.5), 'Lobby tower column', i < 3 ? '32 in round' : '24 in round',
      [['Location', `Lobby tower corner column ${j + 1}, El. ${lv[i]} to El. ${lv[i + 1]}`], ['Section', 'CIP column (Y-5 / Z-5 32 in dia. per S149; other corners 20–22 in / 14 in, uncertain)'], ['Source', 'S129, S130, S149']],
        [x, yE(lv[i]), z], [x, yE(lv[i + 1]) - 3, z], { s: 'round', dia: i < 3 ? 2.67 : 2.0 });
  });
  [[X.W, 255], [X.W, 285]].forEach(([x, z], j) => bar(`LB-COL-W5.${j + 1}`, 'LC', 1, `Lobby column W-5.${j + 1}`, '36 in round', [['Location', `Lobby column W-5.${j + 1}, footing to the roof trusses`], ['Section', '36 in dia., 40-#10 (S149)'], ['Source', 'S149, S126']],
    [x, yE(101), z], [x, yE(155) - 6, z], { s: 'round', dia: 3 }));
  [['ET-1', Z['5'] + 0.58 + 2.25 + 6.42, 'TS7×7×½ / TS6×6×½ chords, TS diagonals'], ['ET-2', Z['5'] + 0.58 + 2.25, 'WT12×42 / WT12×34 chords, 2L diagonals'], ['ET-3', Z['5'] + 0.58, 'WT8×33.5 / WT8×25 chords, 2L diagonals']]
    .forEach(([mk, z, txt]) => bar(`LB-${mk}`, 'ET', 2, 'Escalator 9', mk, [['Location', `Escalator 9 truss ${mk}, W to Y (75 ft, 7 panels), El. 136′-8″ to 172′-8″`], ['Section', txt], ['Bearing', '60-durometer elastomeric pads; ET-3 on W10×33 at Y'], ['Source', 'S146, S147']],
      [X.W, yE(136.67), z], [X.Y, yE(172.67), z], { s: 'truss', d: 4, panel: 7, t: 0.5 }));
  /* ---------- lobby / mezzanine roof (S128 plan, S142–S145 trusses) ----------
     Lobby grid skewed 19.83° to the garage. Plan positions scaled from S128; truss end elevations from S142 / S143.
     u = truss direction (skew), v = along the skewed grid lines 5.2, 7 and X–Z1. Point helper: L(z, x, el). */
  const LR = (z, x, el) => [x, yE(el), z];
  const th = 19.8304 * DEG, U = [Math.cos(th), -Math.sin(th)], V = [-Math.sin(th), -Math.cos(th)];   // [dz, dx]
  const APEX = [350.9, -4.5], LW = 24.8, H7 = 76.9;                    // A-7 corner; 5.2 to 7 width; length of line 7 (9 equal spaces)
  const at = (p, du, dv) => [p[0] + du * U[0] + dv * V[0], p[1] + du * U[1] + dv * V[1]];
  const SRCR = 'S128, S142–S145; plan scaled from S128';
  const truss = (id, mk, a, b, d, desc, extra) => bar(id, 'LT', levelOf(a[1]), 'Lobby roof truss', mk, [['Location', desc], ['Section', 'Steel pipe truss (Fy 36 ksi), chords and webs per S142 / S143']].concat(extra || []).concat([['Source', SRCR]]), a, b, { s: 'truss', d, panel: 8, t: 0.4 });
  const glass = (id, name, p, desc) => quad(id, 'LG', levelOf(p[0][1]), name, 'Sloped glazing', [['Location', desc], ['System', 'Sloped glazing on purlins (TS 5×5) over the trusses; system per architectural drawings'], ['Source', SRCR + '; aerial imagery']], p, 0.12);
  const deck = (id, name, p, desc) => quad(id, 'LRD', 3, name, '3 in steel deck', [['Location', desc], ['Section', '3 in acoustical steel deck on the trusses (S128 note 1)'], ['Source', SRCR]], p, 0.35);

  // Area 1: slope beside the tower (T22–T27), El. 155 near Y down to El. 130 at Z; diagonal T27/T28 from the A-7 corner to 5.2
  const xZ = -3.3, xY = -39.5, elX = x => 130 + 25 * (xZ - x) / (xZ - xY);
  const diagX = z => APEX[1] + (z - APEX[0]) * (36.2 / 39.6);
  const far = z => Math.max(xY, diagX(z));
  const zs1 = [290.1, 295, 302.8, 311.2, 318.1, 326.8, APEX[0]];
  ['T22', 'T22', 'T23', 'T24', 'T25', 'T26'].forEach((mk, i) => { const z = zs1[i + 1]; if (i === 0) return;
    truss(`LR-${mk}-${i}`, mk, LR(z, far(z), Math.min(155, elX(far(z)))), LR(z, xZ, 130), 4, `Lobby roof truss ${mk}, ${ft(z - Z['6'])} south of line 6, from the high side toward Y (El. ${Math.min(155, elX(far(z))).toFixed(1)}) down to line Z (El. 130)`); });
  truss('LR-T22-0', 'T22', LR(295, xY, 155), LR(295, xZ, 130), 4, 'Lobby roof truss T22 next to the tower, from Y (El. 155) down to Z (El. 130)');
  truss('LR-T27', 'T27', LR(311.3, -40.7, 155), LR(APEX[0], APEX[1], 130), 4, 'Lobby roof truss T27 / T28 on the diagonal from line 5.2 (El. 155) to the A-7 corner (El. 130)');
  for (let i = 0; i < zs1.length - 1; i++) { const za = zs1[i], zb = zs1[i + 1];
    glass(`LR-G1-${i + 1}`, 'Lobby roof slope by the tower', [LR(za, xZ, 130.4), LR(zb, xZ, 130.4), LR(zb, far(zb), elX(far(zb)) + 0.4), LR(za, far(za), elX(far(za)) + 0.4)], `Glazed slope beside the tower, bay ${i + 1} of ${zs1.length - 1}, between line Z (El. 130) and the high side (El. 155)`); }

  // Area 2: front glazed slope between skewed 5.2 (El. 155) and skewed 7 (El. 130), trusses T4–T10
  const s2 = [0, 25.6, 34.2, 42.7, 51.3, 59.8, 68.4, H7];
  const w2 = s => Math.min(LW, LW * s / 47.5);                         // truncated by the diagonal above s = 47.5
  const el2 = d => 130 + 25 * d / LW;
  s2.forEach((s, i) => { if (i === 0) return; const q = at(APEX, 0, s), w = w2(s), p = at(q, -w, 0);
    truss(`LR-T${i + 3}`, `T${i + 3}`, LR(p[0], p[1], el2(w)), LR(q[0], q[1], 130), 6, `Lobby roof truss T${i + 3}, ${ft(s)} along skewed line 7 from the A-7 corner, from line 5.2 (El. ${el2(w).toFixed(1)}) down to line 7 (El. 130)`); });
  for (let i = 0; i < s2.length - 1; i++) { const qa = at(APEX, 0, s2[i]), qb = at(APEX, 0, s2[i + 1]), pa = at(qa, -w2(s2[i]), 0), pb = at(qb, -w2(s2[i + 1]), 0);
    glass(`LR-G2-${i + 1}`, 'Lobby front glazed slope', [LR(qa[0], qa[1], 130.4), LR(qb[0], qb[1], 130.4), LR(pb[0], pb[1], el2(w2(s2[i + 1])) + 0.4), LR(pa[0], pa[1], el2(w2(s2[i])) + 0.4)],
      `Front glazed slope (trusses T4–T10), bay ${i + 1} of ${s2.length - 1}, from line 7 (El. 130) up to line 5.2 (El. 155)`); }

  // Area 3: tall glass triangle against the tower, trusses T11–T20 from 5.2 (El. 155) up to the hip truss T30 on 5.1
  const z51 = 254.9, z52 = x => 311.3 + (x + 40.7) * 0.3607, x3 = k => -40 - 9.19 * k;
  const t30 = x => 153.3 + (201.75 - 153.3) * (x - (-122.7)) / ((-38.2) - (-122.7));
  for (let k = 0; k <= 9; k++) { const x = x3(k), mk = `T${11 + k}`;
    truss(`LR-${mk}`, mk, LR(z52(x), x, 155), LR(z51, x, t30(x)), k === 9 ? 4 : 6, `Lobby roof truss ${mk}, ${ft(-40 - x)} south-west of Y, from line 5.2 (El. 155) up to the hip on line 5.1 (El. ${t30(x).toFixed(1)})`); }
  truss('LR-T30', 'T30', LR(z51, -122.7, 153.3), LR(z51, -38.2, 201.75), 6, 'Hip truss T30 along line 5.1, from W (El. 153′-3″) up to the tower at Y (El. 201′-9″)', [['Members', '6 in dia. (X) chords, 6 in (STD) webs except as noted']]);
  truss('LR-T21', 'T21', LR(z51, -122.7, 155), LR(z52(-122.7), -122.7, 155), 4, 'Lobby roof truss T21 at the W end, line 5.1 to 5.2, El. 155');
  for (let k = 0; k < 9; k++) { const xa = x3(k), xb = x3(k + 1);
    glass(`LR-G3-${k + 1}`, 'Lobby glass triangle', [LR(z52(xa), xa, 155.4), LR(z52(xb), xb, 155.4), LR(z51, xb, t30(xb) + 0.4), LR(z51, xa, t30(xa) + 0.4)], `Tall sloped glazing against the tower, bay ${k + 1} of 9 (between T${11 + k} and T${12 + k}), from line 5.2 (El. 155) up to the hip on line 5.1`); }

  // Area 4: flat roof at El. 130 east of skewed line 7 (T1, T2 ×8, T3) with the 30° upturned glazed end of T2
  const L4 = 100.2, UP = 11.4, elUp = 130 + UP * Math.tan(30 * DEG);
  for (let k = 0; k <= 9; k++) { const s = H7 * k / 9, q = at(APEX, 0, s), mk = k === 0 ? 'T1' : k === 9 ? 'T3' : 'T2', len = k === 0 ? 84 : k === 9 ? 33.3 : L4, e = at(q, len, 0);
    truss(`LR-${mk}-${k}`, mk, LR(q[0], q[1], 130), LR(e[0], e[1], 130), 6, `Lobby roof truss ${mk}, ${ft(s)} along skewed line 7 from the A-7 corner, El. 130, ${ft(len)} long${mk === 'T2' ? ' with a 30° upturned end' : ''}`);
    if (mk === 'T2') { const e2 = at(q, L4 + UP, 0); truss(`LR-T2-${k}-UP`, 'T2', LR(e[0], e[1], 130), LR(e2[0], e2[1], elUp), 6, `Upturned 30° end of truss T2 (${ft(s)} along line 7)`); } }
  for (let k = 0; k < 9; k++) { const qa = at(APEX, 0, H7 * k / 9), qb = at(APEX, 0, H7 * (k + 1) / 9), ea = at(qa, L4, 0), eb = at(qb, L4, 0), ua = at(qa, L4 + UP, 0), ub = at(qb, L4 + UP, 0);
    deck(`LR-D4-${k + 1}`, 'Lobby flat roof', [LR(qa[0], qa[1], 130.5), LR(ea[0], ea[1], 130.5), LR(eb[0], eb[1], 130.5), LR(qb[0], qb[1], 130.5)], `Lobby flat roof at El. 130, bay ${k + 1} of 9 between trusses, from skewed line 7 east for ${ft(L4)}`);
    glass(`LR-G4-${k + 1}`, 'Lobby roof upturned glazing', [LR(ea[0], ea[1], 130.6), LR(eb[0], eb[1], 130.6), LR(ub[0], ub[1], elUp + 0.6), LR(ua[0], ua[1], elUp + 0.6)], `Upturned glazed band at the east end of the flat roof (30°), bay ${k + 1} of 9`); }
  // enclosure glazing under the flat roof (curtain walls seen in aerial imagery; approximate)
  const c0 = at(APEX, 0, H7), c1 = at(c0, L4 + UP, 0), c2 = at(APEX, L4 + UP, 0);
  [[c0, c1, 'south'], [c1, c2, 'east']].forEach(([p, q, k], i) => { for (let j = 0; j < 4; j++) { const a = [p[0] + (q[0] - p[0]) * j / 4, p[1] + (q[1] - p[1]) * j / 4], b = [p[0] + (q[0] - p[0]) * (j + 1) / 4, p[1] + (q[1] - p[1]) * (j + 1) / 4];
    quad(`LR-CW-${k}-${j + 1}`, 'LG', 1, 'Lobby curtain wall', 'Curtain wall', [['Location', `Lobby ${k} curtain wall under the flat roof, panel ${j + 1} of 4, grade to El. 130`], ['System', 'Glazed curtain wall (architectural); location from aerial imagery, approximate'], ['Source', 'Aerial imagery; S126–S128']],
      [LR(a[0], a[1], 130), LR(b[0], b[1], 130), LR(b[0], b[1], 117.5), LR(a[0], a[1], 117.5)], 0.12); } });
  [[X.ZL, X.A, 'PB-1'], [X.A, X.A5, 'PB-2'], [X.A5, X.B, 'PB-3']].forEach(([xa, xb, mk]) => bar(`PED-${mk}`, 'PED', 2, 'Pedestrian bridge', mk,
    [['Location', `Pedestrian bridge ${mk}, Level 2, x ${xa.toFixed(1)} to ${xb.toFixed(1)} ft from A, z 272.6–279.7`], ['Section', 'Precast U-trough 8′-2″ wide, two 1′-0″ stems about 2′-11½″ deep, camber 2 in; slide bearing at Z'], ['Source', 'S106, S129, S177']],
    [xa, LEV[2], 276.15], [xb, LEV[2], 276.15], { s: 'rect', w: 8.17, d: 2.96 }));

  /* ============ FLOOD STORAGE & RETENTION TANK (S132, S133, S154, S163, S164) ============ */
  const zTop = x => x <= X.E ? 461 + (522 - 461) * x / X.E : 565;
  const TX = [0, 22.5, 45, 63, 81, 99, 117, 135, 153, 171, 189, 207, 225, 243], TZS = 643;
  for (let i = 0; i < TX.length - 1; i++) {
    const xa = TX[i], xb = TX[i + 1];
    [[null, 540], [540, 603], [603, TZS]].forEach(([za, zb], j) => {
      const z0a = za === null ? zTop(xa) : Math.max(za, zTop(xa)), z0b = za === null ? zTop(xb) : Math.max(za, zTop(xb));
      if (z0a >= zb - 0.5 && z0b >= zb - 0.5) return;
      quad(`TK-ROOF-${P2(i + 1)}${'ABC'[j]}`, 'TS', 1, 'Flood storage tank roof', '12 in slab', [['Location', `Flood storage & retention tank roof, x ${xa}–${xb} ft from A, ${['north part', 'lines 10–11', 'lines 11–12'][j]}`], ['Elevation', 'El. 116.0'], ['Source', 'S133, S163']],
        [[xa, yE(116), Math.min(z0a, zb)], [xb, yE(116), Math.min(z0b, zb)], [xb, yE(116), zb], [xa, yE(116), zb]], 1.0);
    });
  }
  let fsb = 7, tcol = 0;
  [22.5, 45, 63, 81, 99, 117, 135, 153, 171, 189, 207, 225].forEach(x => {
    const rows = [498, 519, 540, 561, 582, 603, 624].filter(z => z > zTop(x) + 3);
    const stops = [zTop(x)].concat(rows).concat([TZS]);
    for (let i = 0; i < stops.length - 1; i++) {
      fsb++;
      bar(`TK-FSB${fsb}`, 'TB', 1, 'Tank roof beams', `FSB-${fsb}`, [['Location', `Tank roof beam FSB-${fsb}, x ${x} ft from A, z ${stops[i].toFixed(0)}–${stops[i + 1].toFixed(0)}`], ['Mark / size', `FSB-${fsb} (18×30 in)`], ['Source', 'S133, S154']],
        [x, yE(115), stops[i]], [x, yE(115), stops[i + 1]], { s: 'rect', w: 1.5, d: 2.5 });
    }
    rows.forEach(z => { tcol++; bar(`TK-C${P2(tcol)}`, 'TC', 1, 'Tank columns', '18 in square', [['Location', `Tank column at x ${x} ft, z ${z} (on pile cap PC-1 at El. 109.5)`], ['Section', '18 in square (RT-12)'], ['Source', 'S132, S164']],
      [x, yE(109.5), z], [x, yE(115) - 2.5, z], { s: 'rect', w: 1.5, d: 1.5, center: true }); });
  });
  for (let i = 0; i < 7; i++) { const xa = [0, 22.5, 45, 63, 81, 99, 117][i], xb = [22.5, 45, 63, 81, 99, 117, 135][i];
    bar(`TK-FSB${i + 1}`, 'TB', 1, 'Tank roof beams, line 10', `FSB-${i + 1}`, [['Location', `Tank roof beam FSB-${i + 1} along line 10, x ${xa}–${xb} ft from A`], ['Mark / size', `FSB-${i + 1} (18×30 in)`], ['Source', 'S133, S154']],
      [xa, yE(115), Z['10']], [xb, yE(115), Z['10']], { s: 'rect', w: 1.5, d: 2.5 }); }
  [['W', [0, 461], [0, TZS]], ['NW', [0, 461], [X.E, 522]], ['E1', [X.E, 522], [X.E, 565]], ['N', [X.E, 565], [X.H, 565]], ['E2', [X.H, 565], [X.H, TZS]], ['S', [X.H, TZS], [0, TZS]]].forEach(([k, p, q]) =>
    quad(`TK-WALL-${k}`, 'TW', 1, 'Flood storage tank wall', '10–12 in wall', [['Location', `Flood storage tank wall ${k} (${k === 'NW' ? 'along the Red Line tunnel' : k === 'S' ? '5 ft outside line 12' : 'perimeter'})`], ['Section', '10 in (12 in on line 12) CIP wall on a 3′-0″ footing (RT-1, RT-7, RT-9)'], ['Source', 'S132, S163, S164']],
      wallQ(p, q, yE(105), yE(116)), 0.9));

  /* ============ TRANSFER GIRDERS & PIERS OVER THE RED LINE TUNNEL (S105, S140, S141, S150) ============ */
  const tg = (mk, a, b, top, w, d, note) => bar(`FDN-${mk}`, 'TG', 1, 'Transfer girder', mk, [['Location', note], ['Section', `${w}′ × ${d}′ concrete transfer girder, top ${elTxt(top)}`], ['Source', 'S105, S140, S141; positions approximate']],
    [a[0], top, a[1]], [b[0], top, b[1]], { s: 'rect', w, d });
  tg('TG-1', [X.B, 455], [X.B, 500], yE(110), 8, 5, 'TG-1 under column B-9, spanning the Red Line tunnel');
  tg('TG-2', [X.C, 455], [X.C, 500], yE(110), 8, 5, 'TG-2 under column C-9, spanning the tunnel');
  tg('TG-4', [X.C, 414], [X.C, 455], yE(110), 8, 5, 'TG-4 near C, lines 8–9 (uncertain)');
  tg('TG-5', [X.F - 8.5, Z['9'] - 12.4], [X.F + 8.5, Z['9'] + 12.4], yE(115), 5, 5, 'TG-5 at F-9, skewed 55°40′');
  tg('TG-6', [143, Z['10']], [269, Z['10']], yE(115), 5, 9, 'TG-6 along line 10, three spans about 55′ / 18′ / 55′');
  tg('TG-7', [X.H - 9, Z['11'] - 9], [X.H + 9, Z['11'] + 9], yE(115), 5, 5, 'TG-7 at H-11, skewed');
  tg('TG-8', [X.J - 9, 571 - 9], [X.J + 9, 571 + 9], yE(115), 5, 5, 'TG-8 at J-10.5 / 11, skewed');
  tg('TG-9', [X.K - 6, Z['12'] - 9], [X.L + 6, Z['12'] + 3], yE(112), 6, 6, 'TG-9 at K/L-12, skewed (about 30°)');
  [['B8', X.B, Z['8'], 'L', 4, 6], ['C8', X.C, Z['8'], 'L', 4, 6], ['B9', X.B, Z['9'], 'L', 4, 6], ['C9', X.C, Z['9'], 'L', 4, 6], ['B10', X.B, Z['10'], 'G', 5.5, 5.5], ['C10', X.C, Z['10'], 'G', 5.5, 5.5],
    ['D10', X.D, Z['10'], 'G', 5.5, 5.5], ['E5', X.E, Z['5'], 'D', 3, 4.5], ['E7', X.E, Z['7'], 'E', 3.83, 4.5]].forEach(([k, x, z, t, w, d]) =>
    bar(`FDN-PIER-${k}`, 'PIER', 1, `Pier ${k}`, `Type ${t}`, [['Location', `Concrete pier at ${k}`], ['Section', `Type ${t}, ${ft(w)} × ${ft(d)} (S150)`], ['Source', 'S105, S150']], [x, yE(103), z], [x, yE(115), z], { s: 'rect', w, d, center: true }));

  /* ============ PILE CAPS & TIE BEAMS UNDER THE GARAGE (S104, S105, S131, S134, S139) ============ */
  const CAPS = { A1: 'PC-6/114', B1: 'PC-8/113.75', C1: 'PC-7/112.5', D1: 'PC-6/113', E1: 'PC-6/113', F1: 'PC-8/113', G1: 'PC-7/113', H1: 'PC-8/113', J1: 'PC-8/111', K1: 'PC-7/110',
    A2: 'PC-8/114', B2: 'PC-5/114.25', C2: 'PC-5/114.25', D2: 'PC-6/113', E2: 'PC-8/113', F2: 'PC-8/113', G2: 'PC-9/113', H2: 'PC-9/113', J2: 'PC-10/113', K2: 'PC-9/113', A3: 'PC-6/114', F3: 'PC-10/113', G3: 'PC-9/113', H3: 'PC-10/113', J3: 'PC-11/113', K3: 'PC-9/113',
    A4: 'PC-8/114', B4: 'PC-9/114', C4: 'PC-9/106', D4: 'PC-8/103', E4: 'PC-7/103', F4: 'PC-8/113', G4: 'PC-8/113', H4: 'PC-9/113', J4: 'PC-9/113', K4: 'PC-9/113',
    B5: 'PC-9/116', C5: 'PC-12/103', D5: 'PC-5/99.75', E5: 'PC-3/99.75', F5: 'PC-7/114', G5: 'PC-8/114', H5: 'PC-5/114', J5: 'PC-9/113.42', K5: 'PC-6/113', K6: 'PC-8/113',
    A6: 'PC-4/99', B6: 'PC-12/100', C6: 'PC-11/100', D6: 'PC-3/100', E6: 'PC-2/100', A7: 'PC-12/100', B7: 'PC/100', C7: 'PC-5/103', D7: 'PC-9/107', E7: 'PC-5/113', F7: 'PC-5/113',
    G7: 'PC-8/113.5', H7: 'PC-8/113.5', J7: 'PC-9/113.5', K7: 'PC-9/113', A8: 'PC-9/108', B8: 'PC-5/100', C8: 'PC-3/100.5', D8: 'PC-8/113', E8: 'PC-8/113', F8: 'PC-8/113.5', G8: 'PC-5/113.5', H8: 'PC-8/113.5', J8: 'PC-10/112.75', K8: 'PC-9/113',
    B9: 'PC-7/100.5', C9: 'PC-5/100.5', G9: 'PC-5/113', H9: 'PC-5/113', J9: 'PC-10/111', K9: 'PC-10/112', B10: 'PC-11/111.5', C10: 'PC-10/111.5', D10: 'PC-9/111.25', G10: 'PC-20/113', J10: 'PC-10/111.5', K10: 'PC-9/112', K11: 'PC-8/111' };
  Object.keys(SCHED).forEach(g => Object.keys(SCHED[g]).forEach(line => {
    if (line === '2.1' || line === '3.1') return;
    const key = g + line.replace('1.9', '2').replace('2.9', '3'), c = (CAPS[key] || 'PC/113').split('/'), el = +c[1], pair = line === '1.9' || line === '2.9';
    bar(`FDN-PC-${g}${line}`, 'PC', 1, `Pile cap ${g}-${line}`, c[0] === 'PC' ? 'Pile cap' : c[0],
      [['Location', `Pile cap under column ${g}-${line}${pair ? ' and its expansion-joint pair' : ''}`], ['Type', c[0] === 'PC' ? 'Type per S104 / S105 (not read)' : c[0] + ' (S139)'], ['Top', 'El. ' + el + (CAPS[key] ? '' : ' (assumed)')], ['Source', 'S104, S105, S131, S134, S139']],
      [X[g], yE(el) - 3.5, Z[line] + (pair ? 2.67 : 0)], [X[g], yE(el), Z[line] + (pair ? 2.67 : 0)], { s: 'rect', w: 7, d: 7, center: true });
  }));
  const TBS = { 'TB-3': '18×18', 'TB-5': '18×48', 'TB-6': '18×24', 'TB-9': 'size not scheduled' };
  const tie = (id, mk, a, b, el, note) => bar(id, 'TIE', 1, 'Tie beam', mk, [['Location', note], ['Section', `${mk} (${TBS[mk]} in)`], ['Source', 'S102, S104, S105']],
    [a[0], yE(el), a[1]], [b[0], yE(el), b[1]], { s: 'rect', w: 1.5, d: 1.5 });
  for (let i = 0; i < XO.length - 1; i++) tie(`FDN-TB-1-${XO[i]}${XO[i + 1]}`, 'TB-3', [X[XO[i]], 0], [X[XO[i + 1]], 0], 113, `Tie beam along line 1, ${XO[i]}–${XO[i + 1]}`);
  ['A', 'B', 'C', 'D'].forEach((g, i, a) => { if (i < 3) tie(`FDN-TB-2-${g}${a[i + 1]}`, 'TB-3', [X[g], Z['2']], [X[a[i + 1]], Z['2']], 113.5, `Tie beam along line 2, ${g}–${a[i + 1]}`); });
  XO.slice(1).forEach(g => tie(`FDN-TB-${g}-1-2`, ['F', 'G', 'H', 'J', 'K'].includes(g) ? 'TB-5' : 'TB-6', [X[g], 0], [X[g], Z['1.9']], 113, `Tie beam on line ${g}, lines 1 to 1.9`));
  [['2', '3'], ['3', '4'], ['4', '5']].forEach(([p, q]) => tie(`FDN-TB-A-${p}-${q}`, 'TB-5', [0, Z[p]], [0, Z[q]], 114, `Tie beam on line A, ${p}–${q}`));
  ['5', '6', '7', '8'].forEach(line => ['F', 'G', 'H', 'J', 'K'].forEach((g, i, a) => { if (i < 4) tie(`FDN-TB-${line}-${g}${a[i + 1]}`, +line < 7 ? 'TB-5' : 'TB-3', [X[g], Z[line]], [X[a[i + 1]], Z[line]], 113.5, `Tie beam along line ${line}, ${g}–${a[i + 1]}`); }));
  tie('FDN-TB-11-JK', 'TB-3', [X.J, Z['11']], [X.K, Z['11']], 111, 'Tie beam along line 11, J–K');
  tie('FDN-TB-K-10-11', 'TB-9', [X.K, Z['10']], [X.K, Z['11']], 111, 'Tie beam on line K, 10–11 (top El. 111)');

  /* ============ SOUTH RAMP & MANAGERS AREA (S134, S135, S154, S175) ============ */
  const SRC = [205, 126], SRi = 27.67, SRo = 64.33;
  const srp = (r, th, y) => [SRC[0] + r * Math.cos(th * DEG), y, SRC[1] + r * Math.sin(th * DEG)];
  for (let s = 0; s < 6; s++) {
    const a0 = 180 + s * 15, a1 = a0 + 15, y0 = yE(116) + (yE(134) - yE(116)) * s / 6, y1 = yE(116) + (yE(134) - yE(116)) * (s + 1) / 6;
    quad(`SRMP-S${s + 1}`, 'SR', levelOf(y0 + 0.5), 'South Ramp', '7 in slab', [['Location', `South Ramp (ramp 1), curved slab segment ${s + 1} of 6`], ['Elevation', `${elTxt(y0)} to ${elTxt(y1)}`], ['Section', '7 in CIP slab on radial beams'], ['Source', 'S134, S135; geometry approximate']],
      [srp(SRi, a0, y0), srp(SRo, a0, y0), srp(SRo, a1, y1), srp(SRi, a1, y1)], 0.58);
    quad(`SRMP-W${s + 1}`, 'SRW', 1, 'South Ramp outer wall', '1′-0″ wall', [['Location', `South Ramp outer retaining wall, segment ${s + 1} of 6 (R = 64′-4″)`], ['Section', '1′-0″ CIP wall, 1′-2″ at the base, on a 3′-0″ footing (SR-1)'], ['Source', 'S134, S175']],
      [srp(SRo + 0.5, a0, y0 + 3.5), srp(SRo + 0.5, a1, y1 + 3.5), srp(SRo + 0.5, a1, yE(113)), srp(SRo + 0.5, a0, yE(113))], 1.0);
  }
  [[195, 'SRB-1'], [210, 'SRB-2'], [225, 'SRB-3'], [240, 'SRB-4'], [255, 'SRB-4']].forEach(([th, mk], i) => {
    const y = yE(116) + (yE(134) - yE(116)) * (th - 180) / 90;
    bar(`SRMP-${mk}-${i + 1}`, 'SRB', levelOf(y), 'South Ramp beams', mk, [['Location', `South Ramp radial beam ${mk} at ${th}°`], ['Mark / size', `${mk} (15×30 in)`], ['Source', 'S135, S154']], srp(SRi, th, y), srp(SRo, th, y), { s: 'rect', w: 1.25, d: 2.5 });
  });
  bar('SRMP-SRB-5', 'SRB', 1, 'South Ramp beam on line 3', 'SRB-5', [['Location', 'South Ramp beam SRB-5 along line 3'], ['Mark / size', 'SRB-5 (12/24×24 in)'], ['Source', 'S135']], [X.E, yE(116), Z['3']], [X.G, yE(116), Z['3']], { s: 'rect', w: 1, d: 2 });
  quad('SRMP-LEG', 'SR', 1, 'South Ramp leg', '8 in slab', [['Location', 'South Ramp straight leg along line 3.1, E to F'], ['Source', 'S134, S135']], hslab(X.E, X.F, Z['3.1'], Z['3.1'] + 10, yE(116)), 0.67);
  [['G', 'H', 4], ['H', 'J', 4], ['J', 'K', 4]].forEach(([a, b, c]) => {
    quad(`MGR-DECK-${a}${b}`, 'MA', 1, 'Managers area roof', 'Steel deck', [['Location', `Managers area roof deck, ${a}–${b}`], ['Section', '1½ in steel deck + 2½ in topping, top El. 131.0'], ['Source', 'S135']], hslab(X[a], X[b], Z['3'], 152, yE(131)), 0.33);
    for (let k = 1; k <= c; k++) { const x = X[a] + (X[b] - X[a]) * k / (c + 1);
      bar(`MGR-J-${a}${b}${k}`, 'MA', 1, 'Managers area joists', 'Joist "DD"', [['Location', `Managers area roof joist ${k} of ${c}, ${a}–${b}, line 3 to the masonry wall`], ['Source', 'S135']], [x, yE(130.67), Z['3']], [x, yE(130.67), 152], { s: 'rect', w: 0.5, d: 1.33 }); }
  });
  bar('MGR-BM-3', 'MA', 1, 'Managers area beam', 'W21×35 (as read)', [['Location', 'Managers area roof edge beam along line 3, G to K'], ['Section', 'W21×35 (read as "W21×3G", uncertain)'], ['Source', 'S135']], [X.G, yE(130.67), Z['3']], [X.K, yE(130.67), Z['3']], { s: 'w', d: 1.75, bf: 0.55 });
  [['S', [X.G, 152], [X.K, 152]], ['W', [X.G, Z['3']], [X.G, 152]], ['E', [X.K, Z['3']], [X.K, 152]]].forEach(([k, p, q]) => quad(`MGR-MW-${k}`, 'MW', 1, 'Managers area wall', '8 in masonry', [['Location', `Managers area ${({ S: 'south', W: 'west', E: 'east' })[k]} masonry bearing wall`], ['Section', '8 in CMU on footing F-9 (El. 113.5)'], ['Source', 'S134, S135']],
    wallQ(p, q, yE(113.5), yE(130.67)), 0.67));
  bar('MGR-C-G3', 'CC', 1, 'Managers area column', '14×14 CIP', [['Location', 'Managers area 14×14 CIP column about 18 ft south of G-3'], ['Source', 'S134']], [X.G, 0, Z['3'] + 18], [X.G, yE(130.67) - 1.5, Z['3'] + 18], { s: 'rect', w: 1.17, d: 1.17, center: true });

  /* ============ BUS PLATFORM & CANOPY (S104, S105, S136, S137) ============ */
  const BL = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
  for (let i = 0; i < BL.length - 1; i++) quad(`BUS-P-${BL[i]}-${BL[i + 1]}`, 'BUS', 1, 'Bus platform', 'Slab on grade', [['Location', `Bus platform slab, lines ${BL[i]}–${BL[i + 1]}, between B and C`], ['Section', '4–5 in slab on grade with curbs'], ['Source', 'S104, S105, S137']],
    hslab(X.B, X.C, Z[BL[i]], Z[BL[i + 1]], 0.5), 0.5);
  quad('BUS-P-END', 'BUS', 1, 'Bus platform', 'Slab on grade', [['Location', 'Bus platform, semicircular east end south of line 2'], ['Source', 'S136, S137']], hslab(X.B, X.C, 45, Z['2'], 0.5), 0.5);
  const PT = { '9-8': 'PT-3', '8-7': 'PT-1', '7-6': 'PT-1', '6-5': 'PT-5', '5-4': 'PT-1', '4-3': 'PT-2', '3-2': 'PT-4' };
  ['B', 'C'].forEach(g => Object.entries(PT).forEach(([k, mk]) => { const [p, q] = k.split('-');
    bar(`BUS-${mk}-${g}${k}`, 'BT', 1, `Bus canopy truss, line ${g}`, mk, [['Location', `Bus canopy truss ${mk} on line ${g}, lines ${p} to ${q}, bracketed to the garage columns`], ['Section', 'Pipe 5 std chords, Pipe 3 std Warren diagonals, 9′-0″ panels, about 6′-0″ deep'], ['Source', 'S136, S137 (PR-1)']],
      [X[g] + (g === 'B' ? 2 : -2), yE(125.33), Z[p] + (p === '9' ? 31.5 : 0)], [X[g] + (g === 'B' ? 2 : -2), yE(125.33), Z[q]], { s: 'truss', d: 6, panel: 9, t: 0.42 }); }));
  let bj = 0;
  for (let z = Z['2'] + 9; z < Z['9'] + 31; z += 9) { bj++; bar(`BUS-J${P2(bj)}`, 'BJ', 1, 'Bus canopy joists', 'J2 16H5', [['Location', `Bus canopy joist ${bj}, B to C at z ${z.toFixed(0)}`], ['Section', '16H5 open-web joist, 1½ in acoustical deck'], ['Source', 'S136']],
    [X.B + 2, yE(125.33), z], [X.C - 2, yE(125.33), z], { s: 'rect', w: 0.4, d: 1.33 }); }
  for (let s = 0; s < 4; s++) { const a0 = 180 + s * 45, a1 = a0 + 45, p = a => [63 + 18 * Math.cos(a * DEG), yE(125.33), Z['2'] + 18 * Math.sin(a * DEG)];
    bar(`BUS-ARC-${s + 1}`, 'BT', 1, 'Bus canopy curved end', 'Pipe 5', [['Location', `Bus canopy curved end chord, segment ${s + 1} of 4 (R = 18′ on line 2)`], ['Source', 'S136']], p(a0), p(a1), { s: 'round', dia: 0.47 }); }
  [[X.B, Z['2'], 'Pipe 5 XX'], [X.C, Z['2'], 'Pipe 5 XX'], [63 - 12.7, Z['2'] - 12.7, 'Pipe 5 std'], [63, Z['2'] - 18, 'Pipe 5 std'], [63 + 12.7, Z['2'] - 12.7, 'Pipe 5 std']].forEach(([x, z, sz], i) =>
    bar(`BUS-COL-${i + 1}`, 'BC', 1, 'Bus canopy column', sz, [['Location', `Bus canopy column ${i + 1} at the curved east end`], ['Section', sz], ['Source', 'S136, S137 (PF-4)']], [x, yE(117.25), z], [x, yE(125.33) - 6, z], { s: 'round', dia: 0.47 }));
  ['B', 'C'].forEach(g => { for (let i = 0; i < BL.length - 1; i++) quad(`BUS-PF-${g}${BL[i]}-${BL[i + 1]}`, 'WALL', 1, `Busway wall, line ${g}`, 'PF wall', [['Location', `Busway perimeter wall on line ${g}, lines ${BL[i]}–${BL[i + 1]}`], ['Section', 'CIP wall, top El. 119′-3″, footing 2′-0″ (PF-1 to PF-9)'], ['Source', 'S137']],
    wallQ([X[g] + (g === 'B' ? 2 : -2), Z[BL[i]]], [X[g] + (g === 'B' ? 2 : -2), Z[BL[i + 1]]], yE(113.75), yE(119.25)), 0.83); });

  window.GARAGE_MODEL = M;
})();
