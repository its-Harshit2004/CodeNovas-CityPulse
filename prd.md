CITYPULSE — DETAILED PRODUCT REQUIREMENTS DOCUMENT
1. Product Overview
Product Name

CityPulse — Live Civic Health Dashboard

Hackathon

AmiHacks — Track B

Product Purpose

CityPulse is a real-time civic health monitoring dashboard that combines multiple civic signals such as:

Weather
Traffic
Civic incidents/complaints

into a single geographic view.

The system analyzes these signals by zone and determines whether a zone is experiencing:

Normal conditions
Medium alert
High alert

The primary interface is a live city map where every monitored zone is represented by a colored status dot.

The goal is that a user can look at the dashboard and immediately understand:

What is happening → Where is it happening → How serious is it → Why is it happening

2. Important Product Philosophy

The application should not attempt to reproduce every feature of an emergency/disaster command center.

The visual inspiration may come from modern civic intelligence/risk dashboards such as CityNerve, but CityPulse must remain focused on its own problem statement.

CityPulse is NOT:

An emergency dispatch system
A hospital management system
An evacuation system
A police dispatch system
A disaster-resource management system
A generic analytics dashboard

CityPulse IS:

A geographic civic-health monitoring system that identifies abnormal conditions across city zones using weather, traffic and incident signals.

3. Primary User

The primary user is a:

City administrator / municipal officer / civic monitoring operator

The dashboard should allow this user to quickly identify problematic areas without reading large tables.

4. Core User Experience

When the dashboard opens, the user should immediately see:

CITYPULSE
Live Civic Health Dashboard

------------------------------------------------

Traffic      Rainfall      Incidents      Alerts

  82%          62mm           18             2

------------------------------------------------

              CITY MAP

        🟢 Zone A

                     🟡 Zone B


              🔴 Zone C


                         🟢 Zone D

------------------------------------------------
             SELECTED ZONE

Zone C
HIGH ALERT

Traffic: 82%
Rainfall: 62mm
Incidents: 18

Possible weather-related disruption

------------------------------------------------

The user should not have to navigate through multiple pages to understand the city's current status.

5. Dashboard Layout

Use a modern dark control-room style interface.

Overall layout
┌───────────────────────────────────────────────────────────┐
│ CITYPULSE                              ● LIVE   15:10     │
│ Live Civic Health Dashboard                               │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│ │ TRAFFIC   │ │ RAINFALL  │ │ INCIDENTS │ │   ALERTS  │ │
│ │   82%     │ │   62 mm   │ │    18     │ │     2     │ │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘ │
│                                                           │
├───────────────────────────────────────┬───────────────────┤
│                                       │                   │
│                                       │ SELECTED ZONE     │
│                                       │                   │
│              CITY MAP                 │ Zone C            │
│                                       │ 🔴 HIGH ALERT     │
│        🟢                               │                   │
│                    🟡                 │ Traffic 82%       │
│                                       │ Rain 62mm         │
│             🔴                        │ Incidents 18     │
│                                       │                   │
│                         🟢            │ Possible weather  │
│                                       │ disruption        │
│                                       │                   │
├───────────────────────────────────────┴───────────────────┤
│ 🔴 HIGH ALERT — ZONE C                                    │
│ Rain increased • Traffic 105% above baseline • Incidents ↑│
└───────────────────────────────────────────────────────────┘
6. Header

The header should contain:

Left
CITYPULSE
Live Civic Health Dashboard
Right
● LIVE
Last updated: 15:10

The LIVE indicator should visually communicate that the dashboard is receiving current/simulated live data.

Do not create a fake continuously changing clock merely for visual effect.

The timestamp should come from the latest available data when possible.

7. Top Metric Cards

Display four primary cards.

Card 1 — Traffic
TRAFFIC
82%

Optional:

↑ 105% above baseline
Card 2 — Rainfall
RAINFALL
62 mm
Card 3 — Incidents
INCIDENTS
18
Card 4 — Active Alerts
ACTIVE ALERTS
2

These cards should be generated from the API/data rather than hardcoded.

8. Main Map

The map is the most important component of the application.

Use:

Leaflet / React-Leaflet

if the existing project already supports it.

Do not replace the existing frontend architecture unnecessarily.

9. Zone Representation

Every monitored zone must have exactly one primary status marker.

Example:

🟢 Zone A

🟡 Zone B

🔴 Zone C

🟢 Zone D

The marker should be a circular dot, not a traditional map pin.

The dot represents the overall civic health status of that zone.

10. Zone Status Colors

Use the following semantic states:

Normal
🟢 GREEN

Meaning:

No significant anomaly detected.

Medium Alert
🟡 YELLOW

Meaning:

At least one meaningful anomaly has been detected, but the combined conditions do not indicate a high-severity disruption.

High Alert
🔴 RED

Meaning:

Multiple anomalies/correlation indicate a potentially significant civic disruption.

No Data
⚪ GREY

Meaning:

The application does not have sufficient current data for the zone.

Do not classify missing data as normal.

11. High Alert Visual Effect

High-alert zones should have a subtle animated/pulsing ring.

Concept:

       ○
    ○  🔴  ○
       ○

The animation should be:

subtle
professional
not distracting
accessible
performant

Do NOT make the entire map flash red.

Only the affected zone should visually stand out.

12. Map Legend

Display a small map legend:

ZONE STATUS

🟢 Normal
🟡 Medium Alert
🔴 High Alert
⚪ No Data

The legend should always be visible on desktop.

13. Zone Interaction

When the user clicks a zone marker, that zone becomes the selected zone.

The right-side panel updates.

Example:

ZONE C

🔴 HIGH ALERT

Civic Health Status
High

────────────────────

TRAFFIC
82%

Baseline
40%

105% above baseline

────────────────────

RAINFALL
62 mm

────────────────────

INCIDENTS
18

Baseline
2

────────────────────

POSSIBLE CORRELATION

Rain
 ↓
Traffic
 ↓
Incidents

Possible weather-related
disruption

────────────────────

EVIDENCE

• Rain increased
• Traffic is 105% above baseline
• Incidents increased

────────────────────

Last updated
15:10
14. Selected Zone Panel

The panel should contain:

Zone name

Example:

Zone C
Status
🔴 HIGH ALERT
Current metrics
Traffic
82%

Rainfall
62 mm

Incidents
18
Baselines
Traffic baseline
40%

Incident baseline
2
Anomalies

Example:

Traffic
82% vs 40% baseline

Incidents
18 vs 2 baseline
Correlation
Possible weather-related disruption
Evidence
Rain increased
Traffic is 105% above baseline
Incidents increased
Timestamp
Last updated
2026-09-24 15:10
15. Important Correlation Language

The application must never state correlation as confirmed causation.

Do NOT display:

Rain caused the traffic.

Instead display:

Possible weather-related disruption

or:

Rain, traffic and incidents increased together.

This distinction is important.

16. Alert Banner

When a high alert exists, display a prominent alert banner beneath the map/details area.

Example:

🔴 HIGH ALERT — ZONE C

Possible weather-related disruption

Rain increased
Traffic 105% above baseline
Incidents increased

If there are no alerts:

🟢 CITY STATUS NORMAL

No significant civic anomalies detected.

If there are medium alerts:

🟡 CIVIC ALERT

2 zones are showing abnormal conditions.
17. Multiple Zones

The application must support multiple zones.

Do NOT hardcode the UI specifically for Zone A.

The frontend should be capable of receiving:

Zone A
Zone B
Zone C
Zone D
Zone E
...

Each zone should have:

zone_id
name
latitude
longitude
severity
alert
metrics
anomalies
correlation
evidence
timestamp
18. Example Zone Data

Use this only as development/demo data if the API is not yet connected:

{
  "zone_id": "A",
  "name": "Zone A",
  "latitude": 26.9124,
  "longitude": 75.7873,
  "severity": "normal",
  "alert": false
}

Another:

{
  "zone_id": "C",
  "name": "Zone C",
  "latitude": 26.9000,
  "longitude": 75.8100,
  "severity": "high",
  "alert": true,
  "traffic": {
    "current": 82,
    "baseline": 40
  },
  "weather": {
    "rain_mm": 62
  },
  "incidents": {
    "current": 18,
    "baseline": 2
  }
}
19. Existing Analytics Integration

The frontend must consume the analytics system already created in:

backend/analytics/

Existing modules:

backend/analytics/
├── baseline.js
├── anomalyDetector.js
├── correlationEngine.js
└── analyzer.js

The frontend must not duplicate the anomaly detection logic.

For example, do NOT create frontend code such as:

if (traffic > baseline * 1.5) {
   // determine alert
}

The backend analytics layer is responsible for determining the alert.

Frontend responsibility:

API result
    ↓
display result
20. Analytics Contract

The frontend should expect analysis similar to:

{
  "zone_id": "A",
  "alert": true,
  "severity": "high",
  "anomalies": [
    {
      "metric": "traffic",
      "current": 82,
      "baseline": 40
    },
    {
      "metric": "incidents",
      "current": 18,
      "baseline": 2
    }
  ],
  "correlation": {
    "signals": [
      "rain",
      "traffic",
      "incidents"
    ],
    "message": "Possible weather-related disruption"
  },
  "evidence": [
    "Rain increased",
    "Traffic is 105.0% above baseline",
    "Incidents increased"
  ]
}

The UI must be resilient if some fields are missing.

21. API Integration

The frontend should consume the backend API.

Expected important endpoint:

GET /api/pulse/:zoneId

Example:

GET /api/pulse/A

Potential supporting endpoint:

GET /api/zones

The frontend should not directly access database internals.

Architecture:

Data
 ↓
Analytics
 ↓
Backend API
 ↓
React Frontend
 ↓
Map + Cards + Alerts
22. Loading State

When API data is loading:

Do not display empty/broken cards.

Display:

Loading civic data...

and skeleton/loading states for:

metric cards
map data
selected zone panel
23. Error State

If API fails:

Display something like:

⚠ DATA CONNECTION ISSUE

Unable to retrieve the latest civic data.

Last successfully received:
15:10

Do not crash the entire dashboard.

24. No Data State

If a zone has no usable data:

⚪ NO DATA

Current civic health status
cannot be determined.

Do NOT display:

🟢 Normal

when data is missing.

25. Auto Refresh

Implement auto-refresh only if the backend supports it reliably.

Preferred:

Refresh every 30 seconds

But the interval should be easy to modify.

Example configuration:

const REFRESH_INTERVAL = 30000;

Do not create aggressive requests every second.

26. Responsive Design

Desktop is the primary hackathon presentation target.

However, the dashboard must remain usable on:

Laptop
Tablet
Mobile

Desktop:

Map              Details
70%              30%

Mobile:

Metric cards
      ↓
Map
      ↓
Selected zone
      ↓
Alert

Do not let the map become unusably small.

27. Visual Design

Use a modern dark civic intelligence/control-room aesthetic.

Background

Very dark:

#0B1220

or similar.

Cards

Dark glass/surface:

#111827

with subtle borders.

Text

Primary:

#F8FAFC

Secondary:

#94A3B8
Semantic colors

Green:

#22C55E

Yellow:

#EAB308

Red:

#EF4444

Do not overuse colors.

Semantic colors should primarily communicate status.

28. Typography

Use a clean modern sans-serif font.

Hierarchy:

CITYPULSE
large / bold

Live Civic Health Dashboard
small / secondary

HIGH ALERT
bold / prominent

Traffic
small label

82%
large metric

Avoid extremely small text.

29. Visual Hierarchy

The most important elements should visually dominate in this order:

1.

Map

2.

Zone status

3.

High/medium alert

4.

Key metrics

5.

Evidence

6.

Secondary information

Do not make charts more visually dominant than the map.

30. Charts

Charts are optional.

Do NOT add lots of charts just to make the dashboard look complicated.

If there is enough time, add one small historical trend chart inside the selected-zone panel:

Traffic

90 |             ●
80 |          ●
70 |       ●
60 |    ●
50 | ●
   +----------------
     15:00 15:05 15:10

But this is P1, not MVP.

The map and alert system are more important.

31. MVP Feature Priority
P0 — Must Have

Implement these first:

Dashboard shell
Dark UI
Header
Metric cards
Interactive Leaflet map
Multiple zones
Colored zone dots
Green/yellow/red states
Click zone
Selected zone panel
Alert banner
Analytics/API integration
Loading state
Error state
No-data state
Responsive desktop layout
P1 — Should Have

After P0 works:

Pulsing high-alert markers
Auto refresh
Better animations
Historical mini-chart
Zone search/filter
Alert list
Last updated indicator
Smooth panel transitions
P2 — Only if time remains

Do not work on these until MVP is complete:

AI-generated summaries
ML prediction
Notifications
User accounts
Advanced GIS layers
Heatmaps
Complex charts
Simulation
Resource management
Emergency response systems
32. Things Antigravity Must NOT Do

This section is extremely important.

The agent must NOT:

Rewrite the entire project architecture without justification.
Replace React/Vite unnecessarily.
Replace existing backend analytics.
Duplicate backend anomaly logic inside React.
Modify another team member's module unnecessarily.
Delete working functionality.
Introduce a large dependency for a simple UI problem.
Hardcode the final dashboard data when an API is available.
Create fake analytics results in production code.
Claim correlation is causation.
Add unnecessary AI/ML features before the MVP works.
Build unrelated emergency-management features.
Change API contracts without documenting the change.
Change database schema unless explicitly required.
Remove existing files without explaining why.
Leave unused imports/dependencies.
Finish without running the application and verifying the UI.
33. Code Architecture

Preferred frontend structure:

frontend/
├── src/
│   ├── components/
│   │   ├── Header
│   │   ├── MetricCard
│   │   ├── CityMap
│   │   ├── ZoneMarker
│   │   ├── ZoneDetails
│   │   ├── AlertBanner
│   │   └── MapLegend
│   │
│   ├── pages/
│   │   └── Dashboard
│   │
│   ├── services/
│   │   └── api
│   │
│   └── ...

Do not blindly create this structure if the existing repository already has an established equivalent structure.

First inspect the repository.

34. Component Responsibilities
CityMap

Responsible for:

rendering map
rendering zones
marker interaction
selected zone

NOT responsible for:

determining anomaly severity
ZoneMarker

Responsible for:

marker appearance
severity color
high-alert pulse
click interaction
ZoneDetails

Responsible for:

selected zone information
metrics
anomaly information
correlation
evidence
MetricCard

Responsible only for presenting:

label
value
status
optional trend
AlertBanner

Responsible for:

active alert
severity
message
evidence summary
35. State Management

Keep state simple.

The frontend should primarily need:

zones
selectedZone
dashboardMetrics
loading
error
lastUpdated

Avoid introducing Redux or another complex state-management system unless the existing project already uses it or there is a concrete reason.

36. Map Behavior

Initial map view should focus on the monitored city/region.

Markers should be visible immediately.

When a marker is clicked:

selectedZone = clicked zone

Then:

map marker
      ↓
selected zone
      ↓
details panel
      ↓
alert/evidence

The selected marker can have a stronger visual outline.

37. Marker Behavior Example

Normal:

     🟢

Medium:

     🟡

High:

     🔴
   (pulse)

Selected:

    ◉
   🔴

The selected zone should be clearly distinguishable without changing its actual severity.

38. Demo Scenario

The application must support the following hackathon demonstration.

Initial state
Zone A → 🟢
Zone B → 🟢
Zone C → 🟢

Then new data arrives.

Zone C:

Rainfall = 62 mm
Traffic = 82%
Incidents = 18

Analytics determines:

Traffic anomaly = true
Incident anomaly = true
Rain event = true

Correlation = detected

Severity = high

Dashboard changes:

Zone C

🟢 → 🔴

The alert panel changes:

🔴 HIGH ALERT — ZONE C

Possible weather-related disruption

The judge can then click Zone C and see:

Traffic: 82%
Baseline: 40%

Rain: 62mm

Incidents: 18
Baseline: 2

Traffic 105% above baseline

This should be the main demo moment.

39. Performance Requirements

The dashboard should:

Load quickly.
Avoid unnecessary API requests.
Avoid unnecessary React re-renders.
Avoid rendering hundreds of unnecessary map objects.
Use lightweight animations.
Not freeze when changing zones.

For the hackathon dataset, assume approximately:

5–50 zones

not thousands.

Do not over-engineer clustering unless the dataset actually requires it.

40. Accessibility

Basic accessibility is required.

Ensure:

sufficient text contrast
buttons have labels
interactive markers have accessible descriptions where possible
color is not the only way to communicate status

For example, don't rely solely on:

🔴

Also show:

HIGH ALERT
41. Browser Testing

After implementation, Antigravity must run the application.

Expected development command should be discovered from the repository, normally something like:

npm run dev

Then verify in the browser:

Test 1

Dashboard loads.

Test 2

Map loads.

Test 3

All zone markers appear.

Test 4

Green zone displays correctly.

Test 5

Medium zone displays correctly.

Test 6

High zone displays correctly.

Test 7

High marker pulses.

Test 8

Clicking a marker changes selected zone.

Test 9

Details panel updates.

Test 10

Alert banner updates.

Test 11

API failure doesn't crash the dashboard.

Test 12

Mobile layout remains usable.

Antigravity's documentation specifically recommends establishing these kinds of verification loops and having the agent run the project's local tests/build commands after changes.

42. Acceptance Criteria

The feature is considered complete only when:

Dashboard
 Dashboard loads without console errors.
 Dark UI is implemented.
 Header displays CityPulse.
 Live/last-updated status is visible.
 Metric cards display real API data.
Map
 Leaflet map loads.
 All configured zones appear.
 Every zone has one status dot.
 Green indicates normal.
 Yellow indicates medium.
 Red indicates high.
 Grey indicates no data.
 High-alert markers pulse subtly.
 Marker selection works.
Zone details
 Selected zone name displays.
 Severity displays.
 Traffic displays.
 Rainfall displays.
 Incidents display.
 Baselines display when available.
 Anomalies display.
 Correlation message displays.
 Evidence displays.
 Timestamp displays.
Reliability
 Loading state works.
 Error state works.
 No-data state works.
 No broken images.
 No console errors.
 No unnecessary API calls.
 No duplicate analytics logic.
Integration
 Existing backend analytics remains intact.
 Frontend consumes API data.
 No hardcoded production alert calculations.
 No database changes without approval.
43. Antigravity Development Workflow

Do not give Antigravity the instruction:

"Build this dashboard."

That gives the agent too much freedom.

Instead use this workflow.

Prompt 1 — Exploration
Read the CityPulse repository and understand the current architecture.

Do NOT modify any files.

I want to build the CityPulse Live Civic Health Dashboard described in the attached PRD.

First inspect:

- frontend structure
- backend structure
- existing API routes
- existing analytics modules
- package.json files
- current map libraries
- current styling system
- current components
- current data flow

Identify what already exists and what is missing.

Pay special attention to:
backend/analytics/
and any existing frontend map/dashboard implementation.

Do not implement anything yet.

Return:
1. Current architecture
2. Existing relevant files
3. Missing pieces
4. Dependencies already installed
5. Risks/conflicts
6. Recommended implementation approach

This follows Antigravity's recommended exploration-before-execution pattern.

44. Prompt 2 — Planning

Then:

Now create a detailed implementation plan for the CityPulse dashboard based on the PRD and your repository exploration.

Do not modify source files yet.

The plan must specify:

1. Files to create
2. Files to modify
3. Components required
4. API integration points
5. Map implementation
6. Zone marker implementation
7. Severity-to-color mapping
8. Selected-zone behavior
9. Loading/error/no-data states
10. Responsive layout
11. Testing strategy

Do not redesign the backend analytics.

Do not duplicate anomaly detection logic in the frontend.

Prefer existing dependencies and project architecture.

Minimize unnecessary changes.

Before implementation, identify any ambiguity or conflict with the current repository.

Then review the plan.

Antigravity has a dedicated /plan workflow for this kind of non-trivial change, specifically because planning lets it inspect dependencies and architecture before modifying files.

45. Prompt 3 — Implementation

After you're happy with the plan:

Implement the approved CityPulse dashboard plan.

Important constraints:

- Follow the existing project architecture.
- Do not rewrite unrelated code.
- Do not replace React/Vite.
- Do not replace existing backend analytics.
- Do not duplicate analytics calculations in React.
- Use existing dependencies whenever possible.
- Create reusable components.
- Keep the map as the primary visual element.
- Use colored circular zone markers.
- Green = normal.
- Yellow = medium alert.
- Red = high alert.
- Grey = no data.
- High-alert markers should have a subtle pulse.
- Clicking a marker must update the selected-zone panel.
- The selected-zone panel must display the analytics result.
- Correlation must be described as "possible", never as confirmed causation.
- Implement loading, error and no-data states.
- Keep the UI responsive.
- Do not hardcode production data when an API exists.

After implementation:
1. Run the project's build/test commands.
2. Start the development server if appropriate.
3. Inspect the dashboard in the browser.
4. Verify the acceptance criteria.
5. Fix any errors you find.
6. Report exactly what files changed and why.
46. Prompt 4 — Visual Review

This one is very important for your project.

Once Antigravity has built the dashboard:

Now perform a visual QA pass on the CityPulse dashboard.

Open the running application in the browser and inspect the actual rendered UI.

Check:

- overall visual hierarchy
- map size
- marker visibility
- marker colors
- high-alert pulse
- selected zone panel
- metric cards
- spacing
- typography
- contrast
- responsiveness
- overflow
- alignment
- loading state
- error state

The dashboard should visually communicate:

WHAT is happening
WHERE it is happening
HOW SERIOUS it is
WHY it may be happening

Do not add new features during this pass.

Only fix visual or interaction problems that violate the PRD.

After fixing issues, re-test the application.

Antigravity supports browser interaction and visual artifacts, and its documentation specifically recommends attaching screenshots/video when diagnosing visual UI issues.

47. Prompt 5 — Final Hackathon QA

Finally:

Perform a final production-readiness and hackathon-demo QA of CityPulse.

Do not add new features.

Verify:

1. npm/build succeeds
2. No console errors
3. Dashboard loads
4. Map loads
5. All zones render
6. Severity colors are correct
7. High alert animation works
8. Clicking zones works
9. Details panel updates
10. API integration works
11. Loading state works
12. Error state works
13. No-data state works
14. Responsive layout works
15. Existing analytics code is untouched unless required for integration
16. No duplicate analytics logic exists in frontend
17. No unnecessary dependencies were added
18. No dead code was introduced

Then give me:

- files changed
- tests executed
- issues found
- issues fixed
- remaining issues, if any
48. Give Antigravity a Persistent Rule

This is something I strongly recommend.

Antigravity supports persistent AGENTS.md / GEMINI.md rules so you don't have to repeat project constraints in every prompt.

Create:

AGENTS.md

at the root of your CityPulse repository.

Put the following in it:

# CityPulse Development Rules

## Project

CityPulse is a live civic health dashboard for the AmiHacks Track B problem.

The application combines:
- weather
- traffic
- civic incidents/complaints

and analyzes these signals by geographic zone.

## Architecture

Preferred flow:

Data Sources
→ Normalization
→ Analytics
→ Backend API
→ React Dashboard

## Analytics Ownership

The backend analytics module owns:
- baseline comparison
- anomaly detection
- correlation detection
- severity
- evidence generation

Frontend must NOT duplicate this logic.

Frontend consumes the resulting analysis through the API.

## Dashboard Concept

The primary visualization is a geographic map.

Every monitored zone should be represented by a circular status marker.

Status:

GREEN = normal
YELLOW = medium alert
RED = high alert
GREY = insufficient/no data

High-alert markers may use a subtle pulsing ring.

## Map Interaction

Clicking a zone marker must update the selected-zone details panel.

The details panel should show:
- zone
- severity
- traffic
- rainfall
- incidents
- baselines
- anomalies
- correlation
- evidence
- timestamp

## Correlation Language

Never claim correlation is causation.

Use wording such as:
"Possible weather-related disruption"

Never write:
"Rain caused the traffic problem."

## UI

Use a modern dark civic-intelligence/control-room visual style.

Prioritize:
1. map
2. zone status
3. alert
4. metrics
5. evidence

Avoid unnecessary visual clutter.

## Scope

Do not add unrelated features such as:
- hospitals
- emergency vehicles
- evacuation
- shelters
- resource allocation
- emergency dispatch

unless explicitly requested.

Do not add AI/ML before the MVP works.

## Engineering

Do not rewrite existing architecture unnecessarily.

Prefer existing dependencies.

Do not modify unrelated files.

Do not delete working functionality without justification.

Do not change API contracts without documenting the change.

Always test changes.

Before declaring a task complete:
- run build/tests
- run the application where possible
- inspect the rendered UI
- check console errors
- verify the acceptance criteria

This is much better than repeatedly telling Antigravity the same rules. Rules are automatically discovered and injected into the agent context.

49. One More Important Thing For You

Because your team is working on the same repository, don't let Antigravity blindly modify the whole project.

Your ownership is:

backend/analytics/

Member 3 owns:

backend/routes/
backend/server/

Member 4 owns:

frontend/

So if you're personally using Antigravity on your branch, I'd tell it:

My primary responsibility is the analytics module.

Do not modify backend/analytics/ unless I explicitly ask.

For frontend work, inspect existing analytics/API contracts but keep changes isolated to the frontend unless integration requires a minimal documented change.

If you're going to have Antigravity build the frontend for Member 4, then have the frontend teammate work on their branch/worktree instead.

Antigravity supports isolated Git worktree mode, which is useful when you want an agent to experiment without directly modifying your current working tree.

The biggest improvement over a normal prompt

Don't give Antigravity one giant "build everything" command and walk away.

Use:

PRD
 ↓
Explore
 ↓
Plan
 ↓
Review plan
 ↓
Implement
 ↓
Browser QA
 ↓
Fix
 ↓
Final QA

* Tech stack used :
React
  +
Vite
  +
JavaScript
  +
Tailwind CSS
  +
React-Leaflet
  +
Leaflet
  +
Lucide React
  +
Recharts
  +
Fetch API