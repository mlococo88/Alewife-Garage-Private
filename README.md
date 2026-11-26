# Alewife Station Garage — asset model (private)

Clickable 3D model of the MBTA Alewife Station garage (Red Line Extension North West, Contract 091-601, drawings S101–S178, 1980) for condition inspections: click any member for its details, NBI 0–9 rating, inspection history and photos. Views: 3D, floor plan per level, and a sortable table.

**Keep this repository private.** It holds the member-by-member structure of an MBTA facility.

## Open it
Download the repository (Code → Download ZIP, or clone it) and double-click `index.html`. Keep `index.html`, `model.js` and `github-sync.js` in the same folder. No install; needs internet for three.js and fonts.

## Files
| File | What it is |
|---|---|
| `index.html` | The app (same engine as All-Structural `apps/garage-asset/`, loading the model from `model.js`) |
| `model.js` | The Alewife model: grid, levels and all 3,099 members, with the sheet each comes from |
| `github-sync.js` | Copy of All-Structural `shared/github-sync.js` (Cloud sync settings and GitHub client) |

## Where inspections and photos go
Saved in the browser first (IndexedDB `garageAsset.alewife.v1`), then, with Cloud sync set up in that browser, copied to the private projects repository under `garage-assets/alewife/`: one JSON file per inspection, photos as JPEG in a folder per component ID.

## Model content
- Garage block: steel W14 columns (S148), precast beams PB on the numbered lines (S152), edge girders / spandrels GB, the cast-in-place girder on line 12 at Level 3 (S153), precast double tees (S174), the sloped ramp bay 2.1–2.9, the light well 5–6.
- Two double-helix drum ramps: exit (Ramps C and D) west of line A, entrance (Ramps A and B) east of line K (S114–S125, S149, S160, S161), and the links joining each drum to the garage at Levels 3–5: the entrance bridge with its bump-out to line 11.2, deep beams under Level 3 and 18 ft transverse beams at Levels 4–5 (S116–S119, S162).
- Light well skylight over bay 5–6, A to J (S138): W18 beams on lines 5 and 6, W18×71 on line A, box beams BB1–BB4, column extensions with bearings, glazing.
- Lobby / mezzanine, flood storage tank and bus platform as simplified blocks.

## Assumptions to verify (also shown in the app, "About this model")
- Level elevations: L1 El. 117.5 (S104), L3 El. 148.0 (S116), L5 El. 172.0 (S117), 12 ft floor to floor; L2 El. 136.0 by extension (verify).
- Column sizes transcribed from the scanned S148 schedule.
- Ramp bay slope direction (rises from line B to line K) read from the "ramp up / ramp down" notes.
- Drum geometry: outer radius 61 ft, inner edge 36 ft, on grids A1 and R, tangent to line 12; ramp elevations between levels interpolated.
- Lobby, tank and bus platform locations and extents.
- Skylight bearing elevation (assumed 12 ft above Level 5; not on S138).
