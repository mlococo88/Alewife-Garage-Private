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

## Model content (rebuilt 2026-11-26 from a review of all 79 sheets; 4,005 members)
- Garage: W14 columns per S148 (corrected cells, splice 5 ft above L2, base types), precast beams with S106–S113 marks and S152 4 ft section, skewed PB-6 beams, double tees T1–T4 with S174 depths, internal ramps B→J with J–K landings, light-well girders, line 12 girder (12 ft deep) and its concrete columns, spandrels and parapets, Part Plan A corners.
- Drums: double helix at about 24 ft per turn from the sheet elevations, inner spandrel beams, 8 inner columns per drum, continuous 10 in outer wall, pile caps and tie beams, grade legs, sloped links at Levels 3–5, entrance bridge with bump-out, walls and S149 columns, exit lanes.
- Skylight (S138), stairs #20, #24–#27, #29, #31, lobby (mezzanine, concourse beams, tower, Escalator 9, roof trusses, pedestrian bridge), flood storage tank (roof beams FSB, columns, walls), South Ramp and managers area, bus canopy trusses and joists, transfer girders, piers, pile caps and tie beams (Foundations group, off by default).

## Assumptions to verify
See "About this model" in the app. Main items: drum ramp elevations interpolated between the leader readings; lobby roof truss layout simplified; exit legs and lanes approximate; tank outline along the tunnel approximate; lobby foundation walls MF-1–MF-47 and stairs 16, 23, 30 not modelled.

## Member view and located defects (2026-11-26)
Clicking a member opens a member window: the member alone in 3D (neighbours faint, nearby grid bubbles, views from above / below) beside its details.
- **Add defect**, then click on the member: a pin is dropped and the location is described from the grid, face and distance along the member (editable).
- Each defect has a type, AASHTO condition state CS1–CS4, size (length, width, depth, crack width), notes and its own photos (file or camera).
- **Re-inspect** adds a new observation (Unchanged / Grown / Repaired / Not found) with its own condition state, size and photos; the full history is kept.
- Pins are numbered and coloured by condition state; the main model shows a badge with the open-defect count on each member; the table has Open defects and Worst CS columns; **Defect log** exports every observation to CSV.
- Stored in IndexedDB (store "defects", database version 2) and synced to `garage-assets/alewife/defects/<id>.json`; defect photos sync with the other photos and carry `defectId`.

## Element view (fourth tab, 2026-11-26)
One member at a time, built for many years of inspection data:
- **Picker:** search (ID, grid, mark), level, member type and condition filters (including "has open defects"); Previous / Next step through the filtered list. From the 3D view, a member's window has **Open in Element view**.
- **3D view** of the member with its defect pins (Add defect works here too) and a **summary card**: current NBI, last inspection, recommended action, open defects and worst CS, number of inspections and since when, photos.
- **Condition over time:** NBI rating as a step line across the years, with bars for the open defects by condition state at each inspection.
- **Defects** (cards), **Defect register** (one row per defect: first and last seen, condition-state trend CS2 → CS3 → CS4, latest size, status, photos) and **Defects by inspection** (each defect's condition state at each inspection date, ▲ when grown).
- **Inspection history** grouped by year (latest three years open, older years folded), with the change in NBI from the previous inspection.
- **Photos** grouped by year, tagged with their defect number.

## Inspection visits (2026-11-26)
For the monthly programme: one record per site visit, not per member.
- **Start visit** (header): date, inspector(s), levels and areas covered, notes. While it is open the header shows it, and every inspection, defect observation and photo entered is stamped with it and defaults to its date and inspectors.
- **End visit**: confirm the coverage and add closing notes. Every member in the covered levels and areas counts as looked at on that date, with no change unless something was recorded.
- Element view: **Last looked at**, **Last change** and the number of visits; the condition timeline marks each visit as a tick. Table: **Last looked at** and **Last change** columns and a "Not looked at in 45+ days" filter.
- Sidebar: recent visits; **Visit log** exports every visit (coverage, members covered, records and photos made) to CSV.
- Stored in IndexedDB (store "visits", database version 3); a visit syncs to `garage-assets/alewife/visits/<id>.json` once it is ended.
