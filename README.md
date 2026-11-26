# Alewife Station Garage — asset model (private)

Clickable 3D model of the MBTA Alewife Station garage (Red Line Extension North West, Contract 091-601, drawings S101–S178, 1980) for condition inspections: click any member for its details, NBI 0–9 rating, inspection history and photos. Views: 3D, floor plan per level, and a sortable table.

**Keep this repository private.** It holds the member-by-member structure of an MBTA facility.

## Open it
Download the repository (Code → Download ZIP, or clone it) and double-click `index.html`. Keep `index.html`, `model.js` and `github-sync.js` in the same folder. No install; needs internet for three.js and fonts.

## Files
| File | What it is |
|---|---|
| `index.html` | The app (same engine as All-Structural `apps/garage-asset/`, loading the model from `model.js`) |
| `model.js` | The Alewife model: grid, levels and all 3,001 members, with the sheet each comes from |
| `github-sync.js` | Copy of All-Structural `shared/github-sync.js` (Cloud sync settings and GitHub client) |

## Where inspections and photos go
Saved in the browser first (IndexedDB `garageAsset.alewife.v1`), then, with Cloud sync set up in that browser, copied to the private projects repository under `garage-assets/alewife/`: one JSON file per inspection, photos as JPEG in a folder per component ID.

## Model content
- Garage block: steel W14 columns (S148), precast beams PB on the numbered lines (S152), edge girders / spandrels GB, the cast-in-place girder on line 12 at Level 3 (S153), precast double tees (S174), the sloped ramp bay 2.1–2.9, the light well 5–6.
- Two double-helix drum ramps: exit (Ramps C and D) west of line A, entrance (Ramps A and B) east of line K (S114–S125, S149, S160, S161), and the links along lines 11.5–12 joining each drum to the garage at Levels 2–5 (entrance bridge on columns at M, N, P, Q; S118, S162).
- Lobby / mezzanine, flood storage tank and bus platform as simplified blocks.

## Assumptions to verify (also shown in the app, "About this model")
- Level elevations: L1 El. 117.5, L2 El. 131.0, then 10 ft floor to floor (L3 141.0, L4 151.0, L5 161.0). Not found on the sheets.
- Column sizes transcribed from the scanned S148 schedule.
- Ramp bay slope direction (rises from line B to line K) read from the "ramp up / ramp down" notes.
- Drum geometry: outer radius 61 ft, inner edge 36 ft, on grids A1 and R, tangent to line 12; ramp elevations between levels interpolated.
- Lobby, tank and bus platform locations and extents.
