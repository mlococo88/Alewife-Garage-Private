/* model.js — Alewife Station Garage (MBTA Red Line Extension North West, Contract 091-601, drawings S101–S178, 25 July 1980).
   Classic script (opens from file://). Defines window.GARAGE_MODEL for index.html.

   Coordinates (feet): x east along the lettered grid (line A = 0), z along the numbered grid (line 1 = 0, increasing to line 12),
   y up from the Level 1 (ground) slab, El. 117.5 ft.

   Sources and assumptions (stated in the app's About panel too):
   - Grid: S106–S113, S153. Lettered: A–B 45, B–C 36, C–D 36, D–E 18, E–F 36, F–G 36, G–H 36, H–J 36, J–K 45, K–L 4 ft.
     Numbered: 63 ft bays (36 ft for 5–6), 11–11.5 17 ft, 11.5–12 about 18.25 ft. Lines 1.9 / 2.1 and 2.9 / 3.1 are 2.67 ft
     either side of lines 2 and 3 (S104, column schedule S148).
   - Levels: Level 1 ground El. 117.5 (S104); Level 2 El. 131.0 (S175 SR-7); 10 ft floor to floor above (engineer's decision,
     2026-11-26: elevations not found on the sheets). Approximate.
   - Level 2 deck: lines B–K, 1–11. Levels 3–5: A–K, 1–12 (columns on line A run from the ground to Level 3; line 12 columns sit on
     the cast-in-place girder at Level 3, S148 note A, S153).
   - Internal ramp: bay 2.1–2.9 slopes from line B (level n) to line K (level n+1) for n = 2, 3, 4; the opening on Level 5 west of
     F is the top of the ramp. Interpretation of S106–S113 "ramp up / ramp down" notes.
   - Light well: bay 5–6, C–J on Level 2, B–J on Levels 3–5.
   - Steel columns W14, upper / lower tier per S148 (transcribed from the scan; verify); splice at Level 3.
   - Precast: double tees about 9 ft wide (S174), precast beams PB (S152), edge girders / spandrels GB (S176).
   - Drum ramps: two double-helix drums (S114–S125), exit drum (Ramps C and D) on grid A1 (72 ft west of A), entrance drum
     (Ramps A and B) on grid R (K–L 4, then 36 ft bays L–M–N–P–Q, Q–R 72 ft). Outer radius 61 ft, tangent to line 12; inner edge
     36 ft; 16 columns C1–C16 (24 in round, S149). One ramp per drum reaches Levels 2 and 4, the other Levels 3 and 5.
   - Links along lines 11.5–12 to each drum at Levels 2–5; the entrance bridge on 42 in columns at M, N, P, Q (S118, S162).
   - Lobby / mezzanine (S126–S131), flood storage tank (S132, S133, S163, S164) and bus platform (S104, S136, S137): simplified
     blocks at approximate locations, to be refined from those sheets. */
(function () {
  'use strict';
  const X = { A1: -72, A: 0, B: 45, C: 81, D: 117, E: 135, F: 171, G: 207, H: 243, J: 279, K: 324, L: 328, M: 364, N: 400, P: 436, Q: 472, R: 544 };
  const XO = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const Z = { '1': 0, '1.9': 60.33, '2': 63, '2.1': 65.67, '2.9': 123.33, '3': 126, '3.1': 128.67, '4': 189, '5': 252, '6': 288, '7': 351,
    '8': 414, '9': 477, '10': 540, '11': 603, '11.5': 620, '12': 638.25 };
  const EL0 = 117.5;
  const LEV = { 1: 0, 2: 13.5, 3: 23.5, 4: 33.5, 5: 43.5 };
  const DT_W = 9.0, DT_D = 2.33, PB_D = 3.5, PB_W = 2.0, COL_TOP_GAP = PB_D;

  const M = {
    name: 'Alewife Station Garage', short: 'Alewife', project: 'alewife',
    subtitle: 'MBTA Red Line Extension North West · Contract 091-601 · drawings S101–S178 (1980)',
    elev0: EL0,
    levels: [1, 2, 3, 4, 5].map(n => ({ n, name: n === 1 ? 'Level 1 (Ground)' : n === 5 ? 'Level 5 (Top deck)' : 'Level ' + n,
      y: LEV[n], el: EL0 + LEV[n] })),
    groups: [
      { k: 'COL', label: 'Columns', color: 0x8b929c },
      { k: 'BEAM', label: 'Beams & girders', color: 0x7d8896 },
      { k: 'DECK', label: 'Double tees', color: 0xc8ccd2 },
      { k: 'RAMP', label: 'Drum ramps & bridge', color: 0xb9b2a4 },
      { k: 'OTHER', label: 'Lobby, tank, bus platform', color: 0xa9b7a6 }
    ],
    types: {
      COL: { name: 'Steel column (W14)', group: 'COL', material: 'steel', color: 0x7f8794 },
      PB: { name: 'Precast beam', group: 'BEAM', material: 'precast', color: 0x8892a0 },
      RPB: { name: 'Precast beam, ramp bay', group: 'BEAM', material: 'precast', color: 0x8892a0 },
      GB: { name: 'Edge girder / spandrel', group: 'BEAM', material: 'precast', color: 0x75808e },
      CG: { name: 'Cast-in-place girder', group: 'BEAM', material: 'concrete', color: 0x9a9488 },
      DT: { name: 'Precast double tee', group: 'DECK', material: 'precast', color: 0xc8ccd2 },
      RDT: { name: 'Precast double tee, ramp bay', group: 'DECK', material: 'precast', color: 0xbcc2ca },
      HS: { name: 'Drum ramp slab', group: 'RAMP', material: 'concrete', color: 0xc9c2b4 },
      RB: { name: 'Drum ramp radial beam', group: 'RAMP', material: 'concrete', color: 0xa69d8f },
      RC: { name: 'Drum ramp column (24 in round)', group: 'RAMP', material: 'concrete', color: 0x9a9182 },
      RW: { name: 'Drum outer wall', group: 'RAMP', material: 'concrete', color: 0xb3ab9c },
      BS: { name: 'Bridge slab', group: 'RAMP', material: 'concrete', color: 0xc9c2b4 },
      BB: { name: 'Bridge beam', group: 'RAMP', material: 'concrete', color: 0xa69d8f },
      BP: { name: 'Bridge pier', group: 'RAMP', material: 'concrete', color: 0x9a9182 },
      LS: { name: 'Lobby / mezzanine slab', group: 'OTHER', material: 'concrete', color: 0xa9b7a6 },
      LW: { name: 'Lobby wall', group: 'OTHER', material: 'concrete', color: 0x98a796 },
      TS: { name: 'Flood storage tank slab', group: 'OTHER', material: 'concrete', color: 0x9fb2b8 },
      TW: { name: 'Flood storage tank wall', group: 'OTHER', material: 'concrete', color: 0x8fa3aa },
      BUS: { name: 'Bus platform slab', group: 'OTHER', material: 'concrete', color: 0xb8b3a2 }
    },
    grid: {
      x: ['A1'].concat(XO).concat(['M', 'N', 'P', 'Q', 'R']).map(k => [k, X[k]]),
      z: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(k => [k, Z[k]])
    },
    assumptions: [
      'Level elevations: Level 1 El. 117.5 (S104), Level 2 El. 131.0 (S175 SR-7), then 10 ft floor to floor (engineer, 2026-11-26). Approximate.',
      'Column sizes from the S148 schedule, transcribed from the scanned sheet: verify against the drawing.',
      'Internal ramp: bay 2.1–2.9 slopes from line B (level n) up to line K (level n+1), from the "ramp up / ramp down" notes on S106–S113.',
      'Drum ramps: double helix, outer radius 61 ft (S120, S124), inner edge 36 ft, centred on grid A1 (72 ft west of A) and grid R (216 ft east of L), tangent to line 12. One ramp of each drum reaches Levels 2 and 4, the other Levels 3 and 5. Ramp elevations between levels are interpolated.',
      'Links: straight bridges along lines 11.5–12 join each drum to the garage at Levels 2–5; the entrance bridge rests on 42 in columns on grids M, N, P and Q (S118, S162).',
      'Lobby / mezzanine, flood storage tank and bus platform are simplified blocks at approximate locations.'
    ],
    members: []
  };
  const T = M.types;
  const add = m => { M.members.push(m); return m; };
  const ft = v => { const f = Math.floor(v + 1e-6), i = Math.round((v - f) * 12); return i === 12 ? (f + 1) + '′-0″' : f + '′-' + i + '″'; };
  const elTxt = y => 'El. ' + (EL0 + y).toFixed(1);

  /* ---------- columns (S148, transcribed) ---------- */
  const SCHED = {
    A: { '1': '287/605', '2': '287/750', '3': '287/750', '4': '287/750', '5': '287/605', '6': '287/605', '7': '287/750', '8': '287/750', '9': '287/750', '10': '287/750', '11': '287/605' },
    B: { '1': '287/605', '1.9': '287/500', '2.1': '342/605', '2.9': '342/605', '3.1': '287/500', '4': '398/550', '5': '398/550', '6': '398/605', '7': '398/550', '8': '398/750', '9': '398/665', '10': '398/550', '11': '398/605' },
    C: { '1': '287/550', '1.9': '287/550', '2.1': '287/550', '2.9': '287/550', '3.1': '287/550', '4': '342/500', '5': '287/550', '6': '342/550', '7': '342/550', '8': '342/605', '9': '342/550', '10': '342/500', '11': '342/550' },
    D: { '1': '246/426', '1.9': '246/426', '2.1': '246/426', '2.9': '246/426', '3.1': '246/455', '4': '246/455', '5': '246/455', '6': '314/455', '7': '314/455', '8': '314/500', '9': '314/500', '10': '314/455', '11': '314/426' },
    E: { '1': '246/426', '1.9': '246/426', '2.1': '246/426', '2.9': '246/426', '3.1': '246/455', '4': '246/455', '5': '246/455', '6': '314/455', '7': '314/455', '8': '314/500', '9': '314/500', '10': '314/455', '11': '314/426' },
    F: { '1': '287/426', '1.9': '287/426', '2.1': '287/426', '2.9': '287/426', '3.1': '287/426', '4': '342/500', '5': '287/426', '6': '342/426', '7': '342/500', '8': '342/500', '9': '342/500', '10': '342/500', '11': '342/426' },
    G: { '1': '287/426', '1.9': '287/426', '2.1': '287/426', '2.9': '287/426', '3.1': '287/426', '4': '342/500', '5': '287/455', '6': '342/455', '7': '342/500', '8': '342/500', '9': '342/500', '10': '342/500', '11': '342/426' },
    H: { '1': '287/426', '1.9': '287/426', '2.1': '287/455', '2.9': '287/455', '3.1': '287/426', '4': '342/500', '5': '287/500', '6': '342/500', '7': '342/500', '8': '342/605', '9': '342/550', '10': '342/550', '11': '342/550' },
    J: { '1': '287/605', '1.9': '287/500', '2.1': '370/605', '2.9': '370/605', '3.1': '287/500', '4': '398/550', '5': '398/605', '6': '398/605', '7': '398/550', '8': '398/750', '9': '398/665', '10': '398/550', '11': '398/605' },
    K: { '1': '342/550', '2': '342/605', '3': '342/605', '4': '342/605', '5': '342/605', '6': '342/605', '7': '342/605', '8': '342/665', '9': '342/665', '10': '342/605', '11': '342/550' }
  };
  const W14D = w => ({ 246: 16.0, 257: 16.4, 264: 16.5, 283: 16.7, 287: 16.8, 311: 17.1, 314: 17.2, 342: 17.5, 370: 17.9, 398: 18.3, 426: 18.7, 455: 19.0, 500: 19.6, 550: 20.2, 605: 20.9, 665: 21.6, 750: 22.4 }[w] || 18) / 12;
  const rampY = (n, x) => LEV[n] + (Math.max(X.B, Math.min(X.K, x)) - X.B) / (X.K - X.B) * (LEV[n + 1] - LEV[n]);
  // ramp-bay columns (lines 2.1, 2.9): segment 1 ground to ramp 2, then ramp 2 to ramp 3, ramp 3 to ramp 4
  const isRampLine = (line, x) => (line === '2.1' || line === '2.9') && x > X.A;
  Object.keys(SCHED).forEach(g => Object.keys(SCHED[g]).forEach(line => {
    const [up, lo] = SCHED[g][line].split('/').map(Number), x = X[g], z = Z[line];
    for (let n = 1; n <= 4; n++) {
      if (g === 'A' && n === 2) continue;                      // line A: one column from the ground to Level 3
      const rl = isRampLine(line, x);
      if (rl && n === 4) continue;
      const top = g === 'A' && n === 1 ? LEV[3] : rl ? rampY(n + 1, x) : LEV[n + 1];
      const base = n === 1 ? 0 : rl ? rampY(n, x) : LEV[n];
      const w = n <= 2 ? lo : up, d = W14D(w);
      const story = g === 'A' && n === 1 ? 'Level 1 to Level 3 (Level 2 open on line A)' : rl ? (n === 1 ? 'ground to the ramp from Level 2' : `ramp from Level ${n} to the ramp from Level ${n + 1}`) : `Level ${n} to Level ${n + 1}`;
      add({ id: `L${n}-COL-${g}${line}`, type: 'COL', level: n, grid: `${g}-${line}`, size: `W14×${w}`,
        props: [['Location', `Grid ${g}-${line}, ${story}`], ['Section', `W14×${w} (${n <= 2 ? 'lower' : 'upper'} tier; S148 lists ${up} upper / ${lo} lower)`],
          ['Height', ft(top - COL_TOP_GAP - base) + ' clear to underside of beam'], ['Base', n === 1 ? 'Base plate on pile cap (S148, S104/S105)' : 'Splice / bearing on column below (S148)'],
          ['Source', 'S148 column schedule (transcribed; verify)']],
        g: { k: 'bar', a: [x, base, z], b: [x, top - COL_TOP_GAP, z], sec: { s: 'w', d, bf: 1.38 } } });
    }
  }));
  // line 12 columns on the CIP girder at Level 3 (S148 note A, S153)
  XO.forEach(g => {
    for (let n = 3; n <= 4; n++) add({ id: `L${n}-COL-${g}12`, type: 'COL', level: n, grid: `${g}-12`, size: 'W14×264',
      props: [['Location', `Grid ${g}-12, Level ${n} to Level ${n + 1}`], ['Section', 'W14×264 (S148 line 12, note A)'], ['Base', n === 3 ? 'Seated on the cast-in-place girder on line 12 at Level 3 (S153)' : 'Splice'], ['Source', 'S148, S153']],
      g: { k: 'bar', a: [X[g], LEV[n], Z['12']], b: [X[g], LEV[n + 1] - COL_TOP_GAP, Z['12']], sec: { s: 'w', d: W14D(264), bf: 1.33 } } });
  });

  /* ---------- precast beams along the numbered lines ---------- */
  const pbMark = (line, a, b) => {
    const bay = a + b;
    if (line === '1' || line === '11' || line === '12') return { AB: 'PB-4', BC: 'PB-3', CD: 'PB-5', DE: 'PB-10', EF: 'PB-5', FG: 'PB-5', GH: 'PB-5', HJ: 'PB-5', JK: 'PB-4' }[bay];
    if (line === '5' || line === '6') return { DE: 'PB-10', JK: 'PB-6', AB: 'PB-7' }[bay] || 'PB-5';
    if (line === '9') return { JK: 'PB-6', DE: 'PB-8' }[bay] || 'PB-7';
    return { JK: 'PB-1', DE: 'PB-8', AB: 'PB-4' }[bay] || 'PB-2';
  };
  const flatLinesBK = ['1', '1.9', '3.1', '4', '5', '6', '7', '8', '9', '10', '11'];
  for (let n = 2; n <= 5; n++) {
    const lines = n === 2 ? flatLinesBK : flatLinesBK.concat(['12']);
    lines.forEach(line => {
      const xs = n === 2 || line === '1.9' || line === '3.1' ? XO.slice(1) : XO;
      for (let i = 0; i < xs.length - 1; i++) {
        const a = xs[i], b = xs[i + 1];
        if (line === '12' && n === 3) {                            // CIP girder at Level 3 on line 12
          add({ id: `L3-CG-12-${a}${b}`, type: 'CG', level: 3, grid: `Line 12, ${a}–${b}`, size: '6′-0″ deep CIP girder',
            props: [['Location', `Level 3, line 12, ${a} to ${b}`], ['Section', 'Cast-in-place girder, 6′-0″ deep (S153)'], ['Span', ft(X[b] - X[a])], ['Carries', 'Level 3 deck and the line 12 columns above (S148 note A)'], ['Source', 'S153']],
            g: { k: 'bar', a: [X[a], LEV[3], Z['12']], b: [X[b], LEV[3], Z['12']], sec: { s: 'rect', w: 3.0, d: 6.0 } } });
          continue;
        }
        const mk = pbMark(line, a, b);
        add({ id: `L${n}-PB-${line}-${a}${b}`, type: 'PB', level: n, grid: `Line ${line}, ${a}–${b}`, size: mk,
          props: [['Location', `Level ${n}, line ${line}, ${a} to ${b}`], ['Mark', `${mk} (from S106–S113; verify)`], ['Section', 'Precast beam with ledges for the tees (S152)'],
            ['Span', ft(X[b] - X[a]) + ', moment connection to columns (S151)'], ['Source', 'S106–S113, S151, S152']],
          g: { k: 'bar', a: [X[a], LEV[n], Z[line]], b: [X[b], LEV[n], Z[line]], sec: { s: 'it', w: PB_W, d: PB_D, lw: 0.6, ld: 1.2 } } });
      }
    });
    // A–B strip on Levels 3–5 uses lines 2 and 3 (no ramp there)
    if (n >= 3) ['2', '3'].forEach(line => add({ id: `L${n}-PB-${line}-AB`, type: 'PB', level: n, grid: `Line ${line}, A–B`, size: 'PB-4',
      props: [['Location', `Level ${n}, line ${line}, A to B`], ['Mark', 'PB-4 (verify)'], ['Span', ft(45)], ['Source', 'S108–S113']],
      g: { k: 'bar', a: [X.A, LEV[n], Z[line]], b: [X.B, LEV[n], Z[line]], sec: { s: 'it', w: PB_W, d: PB_D, lw: 0.6, ld: 1.2 } } }));
    // ramp bay beams on 2.1 / 2.9 (ramp n: level n at B rising to level n+1 at K)
    if (n <= 4) ['2.1', '2.9'].forEach(line => {
      for (let i = 1; i < XO.length - 1; i++) {
        const a = XO[i], b = XO[i + 1];
        add({ id: `L${n}-PB-${line}-${a}${b}`, type: 'RPB', level: n, grid: `Line ${line}, ${a}–${b}`, size: 'PB (ramp)',
          props: [['Location', `Ramp from Level ${n} to Level ${n + 1}, line ${line}, ${a} to ${b}`], ['Elevation', `${elTxt(rampY(n, X[a]))} to ${elTxt(rampY(n, X[b]))}`],
            ['Slope', ((LEV[n + 1] - LEV[n]) / (X.K - X.B) * 100).toFixed(1) + '% (rises toward line K)'], ['Source', 'S106–S113 ramp notes; interpretation, verify']],
          g: { k: 'bar', a: [X[a], rampY(n, X[a]), Z[line]], b: [X[b], rampY(n, X[b]), Z[line]], sec: { s: 'it', w: PB_W, d: PB_D, lw: 0.6, ld: 1.2 } } });
      }
    });
    // edge girders / spandrels along the long sides
    const edges = n === 2 ? ['B', 'K'] : ['A', 'K'];
    const zl = n === 2 ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    edges.forEach(e => {
      for (let i = 0; i < zl.length - 1; i++) {
        const a = zl[i], b = zl[i + 1];
        const ramp = a === '2' && e !== 'A';
        const y0 = ramp ? (e === 'B' ? LEV[n] : n <= 4 ? LEV[n + 1] : LEV[n]) : LEV[n];
        add({ id: `L${n}-GB-${e}-${a}-${b}`, type: 'GB', level: n, grid: `Line ${e}, ${a}–${b}`, size: 'GB',
          props: [['Location', `Level ${n}, edge line ${e}, ${a} to ${b}`], ['Section', 'Precast spandrel / edge girder with ledge (S176 G-1)'], ['Span', ft(Z[b] - Z[a])], ['Source', 'S106–S113, S176']],
          g: { k: 'bar', a: [X[e] + (e === 'K' ? 0.4 : -0.4), y0 + 3.0, Z[a]], b: [X[e] + (e === 'K' ? 0.4 : -0.4), y0 + 3.0, Z[b]], sec: { s: 'rect', w: 0.67, d: 6.5 } } });
      }
    });
  }

  /* ---------- double tees ---------- */
  const TEE_BAYS = [['A', 'B', 5], ['B', 'C', 4], ['C', 'D', 4], ['D', 'E', 2], ['E', 'F', 4], ['F', 'G', 4], ['G', 'H', 4], ['H', 'J', 4], ['J', 'K', 5]];
  function teesInBay(n, z0l, z1l, bayName, opts) {
    let num = 0;
    TEE_BAYS.forEach(([a, b, cnt]) => {
      for (let k = 0; k < cnt; k++) {
        num++;
        if (!opts.include(a, b)) continue;
        const w = (X[b] - X[a]) / cnt, xc = X[a] + w * (k + 0.5);
        const ramp = !!opts.ramp;
        const y = ramp ? rampY(n, xc) : LEV[n];
        const za = Z[z0l] + 0.75, zb = Z[z1l] - 0.75;
        const id = `L${n}-DT-${bayName}-${String(num).padStart(2, '0')}`;
        const edge = (a === 'A' && k === 0) || (a === 'B' && k === 0 && n === 2) || (b === 'K' && k === cnt - 1);
        add({ id, type: ramp ? 'RDT' : 'DT', level: n, grid: `Bay ${bayName}, ${a}–${b}`, size: edge ? 'T1' : 'T2',
          props: [['Location', `${ramp ? `Ramp bay, Level ${n} to ${n + 1}` : 'Level ' + n}, bay ${bayName.replace('R', '')}, tee ${num} counted from line A (${a}–${b})`],
            ['Section', `${edge ? 'T1 (edge)' : 'T2 / T2A'} precast double tee, about 9 ft wide, 4 in flange (S174)`], ['Span', ft(zb - za) + ` (line ${z0l} to ${z1l})`],
            ['Strand', 'Profile A–F per plan (S174 rib schedule)'], ['Source', 'S106–S113, S174']].concat(ramp ? [['Elevation', elTxt(y) + ' (ramp)']] : []),
          g: { k: 'bar', a: [xc, y, za], b: [xc, y, zb], sec: { s: 'dt', w: w - 0.05, d: DT_D, tf: 0.33 } } });
      }
    });
  }
  for (let n = 2; n <= 5; n++) {
    const hasAB = n >= 3;
    const full = (a) => a !== 'A' || hasAB;
    // flat bays B–K (and A–B on 3–5)
    [['1', '1.9', '1-2'], ['3.1', '4', '3-4'], ['4', '5', '4-5'], ['6', '7', '6-7'], ['7', '8', '7-8'], ['8', '9', '8-9'], ['9', '10', '9-10'], ['10', '11', '10-11']]
      .forEach(([z0, z1, nm]) => teesInBay(n, z0, z1, nm, { include: (a) => a !== 'A' && full(a) }));
    if (hasAB) [['1', '2', '1-2'], ['2', '3', '2-3'], ['3', '4', '3-4'], ['4', '5', '4-5'], ['6', '7', '6-7'], ['7', '8', '7-8'], ['8', '9', '8-9'], ['9', '10', '9-10'], ['10', '11', '10-11'], ['11', '12', '11-12'], ['5', '6', '5-6']]
      .forEach(([z0, z1, nm]) => teesInBay(n, z0, z1, nm, { include: (a) => a === 'A' }));
    if (hasAB) teesInBay(n, '11', '12', '11-12', { include: (a) => a !== 'A' });
    // light well bay 5–6
    teesInBay(n, '5', '6', '5-6', { include: (a, b) => a !== 'A' && (n === 2 ? (a === 'B' || b === 'K') : b === 'K') });
    // ramp bay
    if (n <= 4) teesInBay(n, '2.1', '2.9', '2-3R', { include: (a) => a !== 'A', ramp: true });
  }

  /* ---------- drum ramps (double helix) and their links ----------
     S114–S125: each drum is centred on its own grid line (A1, 72 ft west of A; R, 216 ft east of L) with its outer edge tangent to
     line 12 (centre 61 ft north of line 12). Ramps leave the drum at that tangent point and run straight along lines 11.5–12 to the
     garage. One ramp of each drum serves Levels 2 and 4, the other Levels 3 and 5; both start at grade. */
  const R_IN = 36, R_OUT = 61, R_COL = 37.5, SEG = 16;
  const ZC = Z['12'] - R_OUT, TH0 = Math.PI / 2;          // tangent point (on line 12) is at angle 90 degrees
  const DRUMS = [
    { code: 'XR', name: 'Exit drum (Ramps C and D)', cx: X.A1, cz: ZC, dir: 1, sheets: 'S120–S125',
      threads: [{ k: 'D', lv: [2, 4] }, { k: 'C', lv: [3, 5] }] },
    { code: 'NR', name: 'Entrance drum (Ramps A and B)', cx: X.R, cz: ZC, dir: -1, sheets: 'S114–S119',
      threads: [{ k: 'B', lv: [2, 4] }, { k: 'A', lv: [3, 5] }] }
  ];
  const levelOf = y => { let n = 1; [1, 2, 3, 4, 5].forEach(k => { if (y >= LEV[k] - 0.01) n = k; }); return n; };
  DRUMS.forEach(D => {
    const pt = (r, th, y) => [D.cx + r * Math.cos(th), y, D.cz + r * Math.sin(th)];
    // each drum turns so that its ramps meet the tangent point heading toward the garage (exit drum east, entrance drum west)
    const sgn = D.dir;
    D.threads.forEach(T => {
      const ys = [0].concat(T.lv.map(n => LEV[n]));            // elevation at the tangent point after each full turn
      for (let turn = 0; turn < T.lv.length; turn++) for (let s = 0; s < SEG; s++) {
        const k = turn * SEG + s;
        const a0 = TH0 - sgn * s * 2 * Math.PI / SEG, a1 = TH0 - sgn * (s + 1) * 2 * Math.PI / SEG;
        const y0 = ys[turn] + (ys[turn + 1] - ys[turn]) * s / SEG, y1 = ys[turn] + (ys[turn + 1] - ys[turn]) * (s + 1) / SEG;
        const lv = levelOf((y0 + y1) / 2);
        add({ id: `${D.code}-${T.k}-S${String(k + 1).padStart(2, '0')}`, type: 'HS', level: lv, grid: `${D.name}, ramp ${T.k}`, size: '8 in slab',
          props: [['Location', `${D.name}, Ramp ${T.k}, segment ${k + 1} of ${SEG * T.lv.length} (turn ${turn + 1}: grade or Level ${turn ? T.lv[turn - 1] : 1} up to Level ${T.lv[turn]})`],
            ['Elevation', `${elTxt(y0)} to ${elTxt(y1)}`], ['Section', '8 in cast-in-place slab on radial beams (S115–S125)'], ['Width', ft(R_OUT - R_IN)], ['Source', D.sheets + '; elevations interpolated']],
          g: { k: 'quad', p: [pt(R_IN, a0, y0), pt(R_OUT, a0, y0), pt(R_OUT, a1, y1), pt(R_IN, a1, y1)], t: 0.67 } });
        add({ id: `${D.code}-${T.k}-W${String(k + 1).padStart(2, '0')}`, type: 'RW', level: lv, grid: `${D.name}, ramp ${T.k}`, size: 'Parapet',
          props: [['Location', `${D.name}, Ramp ${T.k}, outer parapet wall at segment ${k + 1}`], ['Section', 'Cast-in-place wall, 12 in, parapet 3′-6″ above the ramp (RP-8, S161)'], ['Source', 'S160, S161']],
          g: { k: 'quad', p: [pt(R_OUT + 0.5, a0, y0 + 3.5), pt(R_OUT + 0.5, a1, y1 + 3.5), pt(R_OUT + 0.5, a1, y1 - 0.67), pt(R_OUT + 0.5, a0, y0 - 0.67)], t: 1.0 } });
        if (s % 2 === 0) add({ id: `${D.code}-${T.k}-RB${String(k / 2 + 1).padStart(2, '0')}`, type: 'RB', level: lv, grid: `${D.name}, ramp ${T.k}`, size: 'Radial beam',
          props: [['Location', `${D.name}, Ramp ${T.k}, radial beam ${k / 2 + 1}`], ['Elevation', elTxt(y0)], ['Section', 'Cast-in-place radial beam, about 16 in × 36 in (S160)'], ['Source', D.sheets]],
          g: { k: 'bar', a: pt(R_COL, a0, y0), b: pt(R_OUT, a0, y0), sec: { s: 'rect', w: 1.33, d: 3.0 } } });
      }
    });
    // columns C1–C16: 8 on the inner ring, 8 at the outer wall, one segment per story
    for (let c = 0; c < 16; c++) {
      const inner = c < 8, th = (c % 8) * Math.PI / 4 + Math.PI / 8, r = inner ? R_COL : R_OUT - 0.5;
      for (let n = 1; n <= 4; n++) add({ id: `${D.code}-L${n}-C${String(c + 1).padStart(2, '0')}`, type: 'RC', level: n, grid: `${D.name}, column C${c + 1}`, size: '24 in round',
        props: [['Location', `${D.name}, column C-${c + 1} (${inner ? 'inner ring' : 'outer wall'}), Level ${n} to Level ${n + 1}`], ['Section', '24 in diameter, reinforcement per S149 (8-#7 to 16-#9)'], ['Source', 'S149, ' + D.sheets]],
        g: { k: 'bar', a: pt(r, th, LEV[n]), b: pt(r, th, LEV[n + 1]), sec: { s: 'round', dia: 2.0 } } });
    }
  });

  /* links along lines 11.5–12 between each drum's tangent point and the garage, Levels 2–5 (S116–S118, S122–S125, S162) */
  const LINKS = [
    { code: 'XL', name: 'Exit link (exit drum to line A)', x0: X.A1, x1: X.A, piers: [], sheets: 'S122–S125' },
    { code: 'BR', name: 'Entrance bridge (line L to the entrance drum)', x0: X.L, x1: X.R, piers: ['M', 'N', 'P', 'Q'], sheets: 'S116–S118, S162' }
  ];
  LINKS.forEach(Lk => {
    const stops = [Lk.x0].concat(Lk.piers.map(p => X[p])).concat([Lk.x1]).sort((a, b) => a - b);
    const names = ['A1', 'A', 'L', 'M', 'N', 'P', 'Q', 'R'], nameOf = x => names.find(k => Math.abs(X[k] - x) < 0.01) || '';
    for (let n = 2; n <= 5; n++) for (let i = 0; i < stops.length - 1; i++) {
      const xa = stops[i], xb = stops[i + 1], sp = `${nameOf(xa)}–${nameOf(xb)}`;
      add({ id: `${Lk.code}-L${n}-S-${nameOf(xa)}${nameOf(xb)}`, type: 'BS', level: n, grid: `${Lk.name}, ${sp}`, size: '8 in slab',
        props: [['Location', `${Lk.name}, Level ${n}, ${sp}, between lines 11.5 and 12`], ['Section', 'Cast-in-place slab on beams along lines 11.5 and 12 (RP-19, S162)'], ['Span', ft(xb - xa)], ['Source', Lk.sheets]],
        g: { k: 'quad', p: [[xa, LEV[n], Z['11.5']], [xb, LEV[n], Z['11.5']], [xb, LEV[n], Z['12']], [xa, LEV[n], Z['12']]], t: 0.67 } });
      ['11.5', '12'].forEach(line => add({ id: `${Lk.code}-L${n}-B${line}-${nameOf(xa)}${nameOf(xb)}`, type: 'BB', level: n, grid: `${Lk.name}, line ${line}`, size: 'CIP beam',
        props: [['Location', `${Lk.name}, Level ${n}, beam on line ${line}, ${sp}`], ['Section', 'Cast-in-place beam (42×144 / 30×105 per plan marks)'], ['Span', ft(xb - xa)], ['Source', Lk.sheets]],
        g: { k: 'bar', a: [xa, LEV[n], Z[line]], b: [xb, LEV[n], Z[line]], sec: { s: 'rect', w: 1.5, d: 3.5 } } }));
    }
    Lk.piers.forEach(p => ['11.5', '12'].forEach(line => { for (let n = 1; n <= 4; n++) add({ id: `${Lk.code}-L${n}-P-${p}${line}`, type: 'BP', level: n, grid: `${Lk.name}, grid ${p}-${line}`, size: '42 in round',
      props: [['Location', `${Lk.name}, column on grid ${p}-${line}, Level ${n} to Level ${n + 1}`], ['Section', '42 in diameter concrete column (S118, S162)'], ['Source', Lk.sheets]],
      g: { k: 'bar', a: [X[p], LEV[n], Z[line]], b: [X[p], LEV[n + 1] - 3.5, Z[line]], sec: { s: 'round', dia: 3.5 } } }); }));
  });
  // grade approach from the exit drum to the street, between lines 11 and 12 (S121)
  [['A1A', X.A1, X.A], ['AB', X.A, X.B], ['BC', X.B, X.C], ['CD', X.C, X.D], ['DE', X.D, X.E]].forEach(([k, xa, xb]) =>
    add({ id: `XG-${k}`, type: 'BS', level: 1, grid: 'Exit ramp approach at grade', size: '5 in slab on grade',
      props: [['Location', `Exit ramps C and D approach at grade, between lines 11 and 12, ${k.replace(/^(A1|[A-K])/, '$1–')}`], ['Section', '5 in slab on grade (S121, S124)'], ['Source', 'S121, S124; simplified']],
      g: { k: 'quad', p: [[xa, 0.3, Z['11']], [xb, 0.3, Z['11']], [xb, 0.3, Z['12']], [xa, 0.3, Z['12']]], t: 0.42 } }));

  /* ---------- lobby / mezzanine, flood storage tank, bus platform (simplified) ---------- */
  const yM = 101 - EL0;   // mezzanine slab on grade El. 101.0 (S126)
  const LX = [-112, -37, 0, 45, 81, 117, 171], LZ0 = Z['5'], LZ1 = Z['7'];
  for (let i = 0; i < LX.length - 1; i++) {
    const x0 = LX[i], x1 = LX[i + 1];
    add({ id: `LB-MEZZ-${i + 1}`, type: 'LS', level: 1, grid: 'Lobby / mezzanine', size: '5 in slab on grade',
      props: [['Location', `Lobby / mezzanine level slab, panel ${i + 1} (x ${x0} to ${x1} ft from line A, lines 5–7)`], ['Elevation', 'El. 101.0 (S126)'], ['Section', '5 in slab on grade (S126)'], ['Source', 'S126; simplified block, approximate location']],
      g: { k: 'quad', p: [[x0, yM, LZ0], [x1, yM, LZ0], [x1, yM, LZ1], [x0, yM, LZ1]], t: 0.42 } });
    add({ id: `LB-ROOF-${i + 1}`, type: 'LS', level: 1, grid: 'Lobby roof / concourse', size: 'CIP slab',
      props: [['Location', `Lobby roof at the concourse level, panel ${i + 1}`], ['Source', 'S127, S128; simplified block, approximate location']],
      g: { k: 'quad', p: [[x0, -0.5, LZ0], [x1, -0.5, LZ0], [x1, -0.5, LZ1], [x0, -0.5, LZ1]], t: 1.0 } });
  }
  [['S', [LX[0], LZ0], [LX[6], LZ0]], ['N', [LX[6], LZ1], [LX[0], LZ1]], ['W', [LX[0], LZ1], [LX[0], LZ0]], ['E', [LX[6], LZ0], [LX[6], LZ1]]].forEach(([k, p, q]) =>
    add({ id: `LB-WALL-${k}`, type: 'LW', level: 1, grid: 'Lobby retaining wall', size: 'CIP wall',
      props: [['Location', `Lobby / mezzanine ${({ S: 'south', N: 'north', W: 'west', E: 'east' })[k]} retaining wall`], ['Section', 'Cast-in-place retaining wall (S165–S172)'], ['Source', 'S126, S165–S172; approximate']],
      g: { k: 'quad', p: [[p[0], -0.5, p[1]], [q[0], -0.5, q[1]], [q[0], yM, q[1]], [p[0], yM, p[1]]], t: 1.25 } }));
  const TX0 = 0, TX1 = 117, TZ0 = Z['10'], TZ1 = Z['11'], yTF = -14, yTR = -1.5;
  [[0, 45], [45, 81], [81, 117]].forEach(([x0, x1], i) => {
    add({ id: `TK-ROOF-${i + 1}`, type: 'TS', level: 1, grid: 'Flood storage tank roof', size: 'CIP slab',
      props: [['Location', `Flood storage & retention tank roof, panel ${i + 1}`], ['Source', 'S133, S163, S164; simplified, approximate location']],
      g: { k: 'quad', p: [[x0, yTR, TZ0], [x1, yTR, TZ0], [x1, yTR, TZ1], [x0, yTR, TZ1]], t: 1.0 } });
    add({ id: `TK-FLOOR-${i + 1}`, type: 'TS', level: 1, grid: 'Flood storage tank floor', size: 'CIP slab',
      props: [['Location', `Flood storage & retention tank floor, panel ${i + 1}`], ['Source', 'S132, S163, S164; simplified, approximate location']],
      g: { k: 'quad', p: [[x0, yTF, TZ0], [x1, yTF, TZ0], [x1, yTF, TZ1], [x0, yTF, TZ1]], t: 1.5 } });
  });
  [['S', [TX0, TZ0], [TX1, TZ0]], ['N', [TX1, TZ1], [TX0, TZ1]], ['W', [TX0, TZ1], [TX0, TZ0]], ['E', [TX1, TZ0], [TX1, TZ1]]].forEach(([k, p, q]) =>
    add({ id: `TK-WALL-${k}`, type: 'TW', level: 1, grid: 'Flood storage tank wall', size: 'CIP wall',
      props: [['Location', `Flood storage & retention tank ${({ S: 'south', N: 'north', W: 'west', E: 'east' })[k]} wall`], ['Source', 'S132, S163, S164; approximate']],
      g: { k: 'quad', p: [[p[0], yTR, p[1]], [q[0], yTR, q[1]], [q[0], yTF, q[1]], [p[0], yTF, p[1]]], t: 1.25 } }));
  for (let i = 0; i < 8; i++) {
    const z0 = Z['2'] + i * (Z['10'] - Z['2']) / 8, z1 = z0 + (Z['10'] - Z['2']) / 8;
    add({ id: `BUS-P-${i + 1}`, type: 'BUS', level: 1, grid: 'Bus platform, B–C', size: 'Slab on grade',
      props: [['Location', `Bus platform slab, panel ${i + 1} of 8, between lines B and C`], ['Section', '4–5 in slab on grade with curbs (S104, S105, S137)'], ['Source', 'S104, S105, S137; approximate']],
      g: { k: 'quad', p: [[X.B + 3, 0.6, z0], [X.C - 3, 0.6, z0], [X.C - 3, 0.6, z1], [X.B + 3, 0.6, z1]], t: 0.6 } });
  }

  window.GARAGE_MODEL = M;
})();
