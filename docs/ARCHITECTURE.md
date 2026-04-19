# The Complete Architecture Guide

## Written So Anyone Can Understand — Even Without Technical Background

---

# TABLE OF CONTENTS

1. [What Are We Building?](#1-what-are-we-building)
2. [What is a Monorepo?](#2-what-is-a-monorepo)
3. [The Folder Structure — Every Folder Explained](#3-the-folder-structure)
4. [The Layer System — Who Can Talk to Who](#4-the-layer-system)
5. [Types — The Dictionary](#5-types--the-dictionary)
6. [Services — The Delivery System](#6-services--the-delivery-system)
7. [Service Injection — Choosing the Right Delivery](#7-service-injection)
8. [Core — The Communication System](#8-core--the-communication-system)
9. [State Management — How the App Remembers Things](#9-state-management)
10. [Features — Independent Rooms](#10-features--independent-rooms)
11. [Design System — The Building Blocks](#11-design-system--the-building-blocks)
12. [Registry — The Dynamic Menu Board](#12-registry--the-dynamic-menu-board)
13. [Error Handling — The Safety Net](#13-error-handling--the-safety-net)
14. [Performance — Speed and Efficiency](#14-performance--speed-and-efficiency)
15. [Multi-Platform — One App, Two Homes](#15-multi-platform--one-app-two-homes)
16. [Complete Flow — A Real Example Start to Finish](#16-complete-flow)
17. [Enforcement — Making Rules Unbreakable](#17-enforcement)
18. [Package Dependency Rules — The Full Map](#18-package-dependency-rules)
19. [PlatformProvider — One Wrapper for Everything](#19-platformprovider)
20. [Design Tokens — The Foundation of All Styling](#20-design-tokens)
21. [UI Primitives and Typography — No Inline CSS](#21-ui-primitives-and-typography)
22. [Bundle Budget — Performance Protection](#22-bundle-budget)
23. [Security Policies — Protecting the System](#23-security-policies)
24. [Dependency Governance — Keeping Dependencies Healthy](#24-dependency-governance)
25. [Observability — Watching the System in Production](#25-observability)
26. [Remote Build Cache — Faster Builds for Everyone](#26-remote-build-cache)
27. [Quick Reference Card](#27-quick-reference-card)
28. [Glossary — Every Term Explained](#28-glossary)

---

# 1. WHAT ARE WE BUILDING?

## The Simple Version

We are building an **application** that works in two places:

- **Web** (opens in a browser like Chrome, Safari, Firefox)
- **Desktop** (installs on your computer like Word, Photoshop)

Both versions look and behave the **same** to the user. The only difference is how they connect to data behind the scenes.

## The Hotel Analogy

Think of our system as a **hotel**:

```
THE HOTEL (Our Application)
|
|-- Reception Desk .............. The App (what guests see first)
|-- Guest Rooms ................. Features (AI chat, dashboard, login)
|-- Room Furniture .............. Design System (beds, tables, chairs)
|-- Internal Phone System ....... Core (how rooms communicate)
|-- Supply Deliveries ........... Services (getting food, towels from outside)
|-- Guest Registry Book ......... Store (remembering guest preferences)
|-- Room Directory .............. Registry (mapping room numbers to rooms)
|-- Hotel Rules Book ............ Types (rules everyone follows)
|-- Utility Closet .............. Utils (shared tools like flashlights)
```

**Key insight**: Each part of the hotel has ONE job. The chef doesn't check in guests. The receptionist doesn't cook food. Everyone has a clear role.

## What Makes This Architecture Special?

| Property           | What It Means             | Why It Matters                                    |
| ------------------ | ------------------------- | ------------------------------------------------- |
| **Modular**        | Each piece is independent | You can change one piece without breaking others  |
| **Scalable**       | Can grow easily           | Adding new features doesn't make the code messy   |
| **Performant**     | Fast and efficient        | The app only updates what changed, not everything |
| **Type-safe**      | Errors caught early       | Mistakes are found before users see them          |
| **Multi-platform** | Works on web and desktop  | Write the code once, run it everywhere            |

---

# 2. WHAT IS A MONOREPO?

## The Simple Explanation

"Monorepo" = "Mono" (one) + "Repo" (repository/folder)

It means **all your code lives in one big folder** instead of many separate folders.

## The Library Analogy

Imagine you're writing a book series:

**Without Monorepo** (multiple repos):

```
Folder 1: Chapter 1 (has its own copy of the character list)
Folder 2: Chapter 2 (has its own copy of the character list)
Folder 3: Chapter 3 (has its own copy of the character list)

Problem: You rename a character in Chapter 1...
         but forget to rename in Chapter 2 and 3.
         Now your book has inconsistencies!
```

**With Monorepo** (one repo):

```
One Folder:
  - Character List (shared — ONE copy)
  - Chapter 1 (uses the shared character list)
  - Chapter 2 (uses the shared character list)
  - Chapter 3 (uses the shared character list)

Benefit: Rename a character once → it updates everywhere.
         Impossible to have inconsistencies!
```

## What Tool Manages Our Monorepo?

**Turborepo** — it's a tool made by Vercel (the company behind Next.js).

What Turborepo does:

- Builds packages in the **correct order** (you can't build Chapter 2 before the character list)
- Caches builds (doesn't rebuild what hasn't changed — saves time)
- Runs tasks in parallel when possible (builds independent things at the same time)

Think of Turborepo as the **project manager** at a construction site. It knows which workers need to finish before others can start, and it makes sure nobody waits unnecessarily.

---

# 3. THE FOLDER STRUCTURE

## The Big Picture

```
demo-monoreo/
|
|-- apps/                    <-- THE APPLICATIONS (what users see)
|   |-- web/                 <-- Website version
|   |-- desktop/             <-- Desktop app version
|   |-- .storybook/          <-- Component preview tool (dev only)
|
|-- packages/                <-- THE SHARED PIECES (reusable code)
|   |-- types/               <-- Shared definitions
|   |-- utils/               <-- Helper functions
|   |-- config/              <-- Environment vars, feature flags       [ENTERPRISE]
|   |-- tokens/              <-- Design tokens (colors, spacing)       [ENTERPRISE]
|   |-- services/            <-- Talks to outside world (APIs)
|   |-- core/                <-- Internal communication system
|   |   |-- provider/        <-- PlatformProvider (wraps all infra)    [ENTERPRISE]
|   |-- store/               <-- Remembers UI state
|   |-- design-system/       <-- Reusable UI components
|   |   |-- primitives/      <-- Box, Stack, Grid, Flex               [ENTERPRISE]
|   |   |-- typography/      <-- H1, H2, Text, Label                  [ENTERPRISE]
|   |   |-- components/      <-- Button, Card, Modal, Input
|   |   |-- theme/           <-- ThemeProvider, dark mode
|   |-- features/            <-- App features (AI, auth, dashboard)
|   |-- registry/            <-- Maps names to components
|   |-- observability/       <-- Logger, metrics, error tracking       [ENTERPRISE]
|
|-- security/                <-- Security configs                      [ENTERPRISE]
|   |-- audit.config.js      <-- Vulnerability scanning
|   |-- license-policy.js    <-- License compliance
|   |-- env-policy.md        <-- Environment variable rules
|
|-- docs/                    <-- Documentation (you are here!)
|   |-- ARCHITECTURE.md
|   |-- coding-standards.md
|   |-- ui-guidelines.md
|
|-- turbo.json               <-- Turborepo configuration
|-- pnpm-workspace.yaml      <-- Workspace configuration
|-- package.json             <-- Project settings
|-- .github/
|   |-- workflows/
|       |-- ci.yml           <-- Lint, test, build, bundle budget     [ENTERPRISE]
|       |-- security.yml     <-- Audit, license check                 [ENTERPRISE]
```

## Every Folder Explained

---

### apps/web/ — The Website

**What it is**: The version of your app that runs in a web browser.

**Real-world analogy**: This is like a restaurant's **dine-in area**. Customers come to the building (browser), sit down, and use the service.

**Technology**: Built with Vite + React (or Next.js)

**What's inside**:

```
apps/web/
|-- src/
|   |-- main.tsx          <-- The starting point (front door)
|   |-- App.tsx           <-- Assembles all features together
|-- index.html            <-- The webpage shell
|-- vite.config.ts        <-- Build tool configuration
|-- package.json          <-- This app's settings
```

**Key rule**: The app folder is just an **assembler**. It takes pieces from `packages/` and puts them together. It should have almost NO logic of its own.

---

### apps/desktop/ — The Desktop App

**What it is**: The version that installs on Windows, Mac, or Linux.

**Real-world analogy**: This is like the restaurant's **delivery app**. Same menu, same food, but delivered to your home (your computer) instead of eating at the restaurant.

**Technology**: Built with Tauri (Rust-based framework that wraps web UI into a native app)

**What's inside**:

```
apps/desktop/
|-- src/                  <-- Same React UI code
|-- src-tauri/            <-- Rust backend code (native features)
|   |-- src/main.rs       <-- Desktop-specific logic
|   |-- tauri.conf.json   <-- Desktop app configuration
|-- package.json
```

**Key insight**: The UI code inside `apps/desktop/src/` is nearly IDENTICAL to `apps/web/src/`. The only difference is `src-tauri/` which handles desktop-specific things like file system access, system tray, etc.

---

### packages/types/ — The Dictionary

**What it is**: Shared definitions that describe what data looks like throughout the system.

**Real-world analogy**: A **dictionary/glossary** that everyone in the company reads. It defines:

- What an "AI request" contains (a question)
- What an "AI response" contains (an answer + model name)
- What a "user" looks like (name, email, role)

```
packages/types/
|-- src/
|   |-- commands.ts       <-- What each command expects
|   |-- events.ts         <-- What each event carries
|   |-- models.ts         <-- Data shapes (User, Message, Panel)
|   |-- index.ts          <-- Exports everything
```

**Why it matters**: If everyone agrees on definitions, there are no misunderstandings. When someone says "user," everyone knows it means `{ name, email, role }` — not just a name, not just an email.

---

### packages/utils/ — The Toolbox

**What it is**: Small helper functions used everywhere.

**Real-world analogy**: A **shared toolbox** in an office. Things like scissors, tape, stapler — everyone needs them, nobody owns them.

```
packages/utils/
|-- src/
|   |-- formatDate.ts     <-- Formats dates nicely
|   |-- generateId.ts     <-- Creates unique IDs
|   |-- debounce.ts       <-- Prevents rapid repeated actions
|   |-- index.ts
```

**Examples**:

- `formatDate("2024-01-15")` returns `"January 15, 2024"`
- `generateId()` returns `"abc123xyz"`
- `debounce(fn, 300)` waits 300ms before running (prevents spam-clicking)

**Rules**:

- Utils NEVER depend on any other package (they're the most basic building block)
- No business logic here — just pure helper functions

---

### packages/services/ — The Delivery System

**What it is**: The ONLY code that talks to the outside world (APIs, databases, external systems).

**Real-world analogy**: A **delivery service**. Your app never goes to the "restaurant" (API server) itself. It sends a delivery driver. The app doesn't care HOW the food arrives — it just places an order and gets food back.

```
packages/services/
|-- src/
|   |-- ai.service.ts     <-- Talks to AI APIs
|   |-- auth.service.ts   <-- Handles login/logout
|   |-- user.service.ts   <-- Fetches user data
|   |-- platform/
|   |   |-- web.ts        <-- Web-specific implementations
|   |   |-- tauri.ts      <-- Desktop-specific implementations
|   |-- context.tsx       <-- Service provider (injection)
|   |-- index.ts
```

**Two versions of the same service**:

Web (browser):

```
"Ask AI a question"
  --> sends an internet request (fetch) to a server
  --> server responds with answer
```

Desktop (Tauri):

```
"Ask AI a question"
  --> calls a local Rust function (invoke)
  --> Rust code processes and responds
```

**Both return the same shaped data**. The rest of the app doesn't know or care which version is running.

---

### packages/core/ — The Internal Phone System

**What it is**: The communication backbone. How different parts of the app talk to each other WITHOUT knowing about each other.

**Real-world analogy**: An **internal phone system** in a large company.

- **Commands** = calling someone and saying "Please do this task"
- **Events** = making an announcement over the intercom "This just happened"

```
packages/core/
|-- src/
|   |-- commands.ts       <-- Command system (request actions)
|   |-- events.ts         <-- Event system (broadcast notifications)
|   |-- query-client.ts   <-- React Query setup
|   |-- hooks/
|   |   |-- useEvent.ts   <-- React hook for listening to events
|   |-- index.ts
```

**Why not just call functions directly?**

Without Core (tightly coupled):

```
AI Panel knows about Dashboard
AI Panel knows about Notification Bar
AI Panel knows about Analytics Tracker
When AI responds, AI Panel must update ALL of them manually
```

With Core (decoupled):

```
AI Panel announces: "AI just responded"
Dashboard hears it and updates itself
Notification Bar hears it and shows a notification
Analytics Tracker hears it and logs it
AI Panel doesn't know ANY of them exist
```

**Benefit**: You can add or remove features without changing existing code. Add a new "Activity Log" feature? It just starts listening for events. Zero changes to AI Panel.

---

### packages/store/ — The Memory Board

**What it is**: Where the app remembers UI-related things.

**Real-world analogy**: A **sticky note board** in an office where people post current status:

```
"Sidebar: OPEN"
"Theme: DARK"
"Active Panels: AI Chat, Dashboard"
"Selected Model: GPT-4"
```

```
packages/store/
|-- src/
|   |-- layout.store.ts   <-- Sidebar, panels, theme
|   |-- ai.store.ts       <-- AI preferences, input history
|   |-- auth.store.ts     <-- Login modal state
|   |-- index.ts
```

**CRITICAL RULE**: The store ONLY holds **UI state** — things about how the app LOOKS and BEHAVES:

```
YES (belongs in store):           NO (does NOT belong in store):
- Is sidebar open?                - User profile from API
- Which theme is selected?        - AI response from server
- Which panels are visible?       - List of products from database
- What did the user type before?  - Loading state for API calls
```

Why? Because data from APIs has its own storage system (React Query). Putting it in the store too would create two copies that get out of sync.

---

### packages/design-system/ — The LEGO Set

**What it is**: Reusable visual building blocks — buttons, cards, inputs, modals, etc.

**Real-world analogy**: A **LEGO set**. Each piece is simple on its own, but you combine them to build anything. A red 2x4 brick is just a brick — it doesn't know if it's part of a house or a spaceship.

```
packages/design-system/
|-- src/
|   |-- tokens/
|   |   |-- colors.ts     <-- Color palette (primary blue, error red)
|   |   |-- spacing.ts    <-- Spacing values (4px, 8px, 16px)
|   |   |-- typography.ts <-- Font sizes, weights
|   |-- components/
|   |   |-- Button.tsx     <-- Reusable button
|   |   |-- Card.tsx       <-- Reusable card container
|   |   |-- Input.tsx      <-- Text input field
|   |   |-- Modal.tsx      <-- Popup dialog
|   |   |-- Loader.tsx     <-- Loading spinner
|   |   |-- ErrorView.tsx  <-- Error display
|   |-- index.ts
```

**Tokens** = The design language. Instead of saying `color: #3B82F6` everywhere (what color even is that?), you say `color: tokens.primary` — clear, consistent, changeable in one place.

**Rules**:

- Design system components are **pure visual** — they display what you tell them
- NO business logic (no "if user is admin, show delete button")
- NO data fetching (no API calls inside a Button)
- NO store access (a Card doesn't read from Zustand)

Think of it this way: a LEGO brick doesn't care what you're building. It just snaps together.

---

### packages/features/ — The Guest Rooms

**What it is**: The actual functionality of your app, organized by domain.

**Real-world analogy**: **Guest rooms in a hotel**. Each room is self-contained with its own bathroom, TV, and phone. You don't need to enter Room 201 to use Room 305.

```
packages/features/
|-- ai/
|   |-- components/
|   |   |-- AIPanel.tsx       <-- The AI chat interface
|   |   |-- AIInput.tsx       <-- Where you type questions
|   |   |-- ResponseView.tsx  <-- Where answers appear
|   |-- hooks/
|   |   |-- useAIQuery.ts    <-- Logic for fetching AI data
|   |   |-- useAIMutation.ts <-- Logic for sending questions
|   |-- index.ts              <-- Public API (what others can import)
|
|-- auth/
|   |-- components/
|   |   |-- LoginForm.tsx
|   |   |-- SignupForm.tsx
|   |-- hooks/
|   |   |-- useAuth.ts
|   |-- index.ts
|
|-- dashboard/
|   |-- components/
|   |   |-- Dashboard.tsx
|   |   |-- StatCard.tsx
|   |-- hooks/
|   |   |-- useDashboardData.ts
|   |-- index.ts
```

**The Most Important Rule**: Features are **isolated islands**.

```
ALLOWED:
  AI feature uses: design-system (buttons), store (UI state),
                   core (commands), services (API)

FORBIDDEN:
  AI feature imports from: auth feature, dashboard feature

  If AI needs to know "is user logged in?", it:
    - Reads from the auth STORE (shared state)
    - Or listens for an auth EVENT (broadcast)
    - NEVER imports auth feature code directly
```

**Why?** If AI imports from Dashboard, and Dashboard imports from AI... changing either one risks breaking the other. They become tangled like headphone cords. By keeping them separate, you can:

- Delete the entire Dashboard feature — AI still works
- Give Dashboard to a different team — they can't accidentally break AI
- Add 50 more features — no existing feature changes

---

### packages/registry/ — The Room Directory

**What it is**: A lookup table that maps names to components.

**Real-world analogy**: A **directory board** in a building lobby:

```
Room 101 ......... AI Chat
Room 102 ......... Dashboard
Room 103 ......... Settings
Room 104 ......... User Profile
```

You tell the directory which room you want, it tells you where to go.

```
packages/registry/
|-- src/
|   |-- index.ts           <-- The mapping
```

**How it works**:

```
registry = {
  "ai"        --> AIPanel component
  "dashboard" --> Dashboard component
  "settings"  --> Settings component
}
```

When someone says "open the AI panel":

1. Command says: `panel.open("ai")`
2. Store adds `"ai"` to active panels list
3. Renderer looks up `registry["ai"]` --> gets `AIPanel`
4. Renders `<AIPanel />`

**Why not just use `<AIPanel />` directly?** Because with a registry, you can:

- Open any panel by name (from a config file, user settings, URL, etc.)
- Add new panels without changing the rendering code
- Support a plugin system (third-party panels)

---

# 4. THE LAYER SYSTEM

## The Building Analogy

Think of the architecture as a **building with floors**. Each floor has a clear job, and there's a strict rule about who can visit whom.

```
FLOOR 6 (Roof)   : Apps              -- Puts everything together
FLOOR 5          : Features          -- Business logic (AI, auth, dashboard)
FLOOR 4          : Design System     -- Visual components (buttons, cards)
FLOOR 3          : Store + Query     -- Remembers things
FLOOR 2          : Core              -- Communication system
FLOOR 1          : Services          -- Talks to outside world
GROUND FLOOR     : Types + Utils     -- Basic building blocks
```

## The One Rule

```
You can ONLY visit floors BELOW you. Never above.
```

- Floor 5 (Features) CAN use Floor 4 (Design System), Floor 3 (Store), Floor 2 (Core), Floor 1 (Services), Ground (Types)
- Floor 1 (Services) can ONLY use Ground Floor (Types + Utils)
- Floor 1 (Services) can NEVER use Floor 3 (Store) or Floor 5 (Features)

**Why?** If the ground floor depends on the roof, and you change the roof, the ground floor breaks. Then floors 1-5 break because they depend on ground. One change at the top destroys everything.

By making things only depend DOWNWARD, changes at the top can never break things at the bottom.

## The Complete Dependency Map

```
WHO CAN USE WHAT:

apps          can use --> everything
features      can use --> design-system, store, core, services, types, utils
design-system can use --> types, utils (ONLY — no business logic!)
store         can use --> core, types, utils
core          can use --> services, types, utils
services      can use --> types, utils (ONLY — most restricted)
registry      can use --> features, design-system, types
types         can use --> nothing (it's the foundation)
utils         can use --> types (and nothing else)

NEVER ALLOWED:

services    --> store, features, UI      (services don't know about state)
core        --> features, UI             (core doesn't know about business logic)
design-system --> features, store, core  (UI blocks have no business logic)
features    --> other features           (features are independent)
```

### Visualized as a Diagram

```
                    +------------------+
                    |      APPS        |    <-- Can see everything below
                    +------------------+
                            |
              +-------------+-------------+
              |                           |
     +--------v--------+       +---------v--------+
     |    FEATURES      |       |     REGISTRY     |
     +---------+--------+       +------------------+
               |
    +----------+----------+
    |          |          |
+---v---+ +---v---+ +----v----+
| DESIGN | | STORE | | SERVER  |
| SYSTEM | |       | | STATE   |
+---+----+ +---+---+ | (React  |
    |          |      | Query)  |
    |      +---v---+  +----+----+
    |      | CORE  |       |
    |      +---+---+  +----v----+
    |          |      |SERVICES |
    |      +---v---+  +----+----+
    |      |SERVICE|       |
    |      +---+---+       |
    |          |           |
+---v----------v-----------v---+
|       TYPES  +  UTILS        |    <-- Foundation (depends on nothing)
+------------------------------+
```

---

# 5. TYPES — THE DICTIONARY

## What Are Types?

Types are **definitions** — they describe the shape of things before those things exist.

**Real-world analogy**: Before building a house, you draw blueprints. The blueprint isn't the house — it's a description of what the house SHOULD look like. Types are blueprints for data.

## Why Do We Need Types?

Without types:

```
Someone sends: { q: "hello" }
Someone else expects: { question: "hello" }
Result: CRASH -- the names don't match, nobody knows until it's too late
```

With types:

```
The dictionary says: AI questions must have { question: string }
Someone tries to send: { q: "hello" }
Result: ERROR caught IMMEDIATELY -- before the code even runs
        "Property 'question' is missing"
```

## Command Types — What Actions Expect

Commands are like filling out specific forms. Each form has required fields:

```
COMMAND: "ai.ask"
Required fields: question (text)
Example: { question: "What is the weather?" }

COMMAND: "panel.open"
Required fields: type (text), props (optional extra settings)
Example: { type: "ai", props: { mode: "compact" } }

COMMAND: "auth.login"
Required fields: email (text), password (text)
Example: { email: "john@test.com", password: "secret123" }

COMMAND: "auth.logout"
Required fields: none
Example: (no data needed)

COMMAND: "theme.toggle"
Required fields: none
Example: (no data needed)
```

## Event Types — What Notifications Carry

Events are like news bulletins. Each type of news carries specific information:

```
EVENT: "ai.response"
Carries: answer (text), model (text)
Example: { answer: "It's sunny!", model: "gpt-4" }

EVENT: "ai.streaming"
Carries: chunk (text), done (true/false)
Example: { chunk: "It's", done: false }

EVENT: "auth.changed"
Carries: isAuthenticated (true/false)
Example: { isAuthenticated: true }

EVENT: "panel.opened"
Carries: type (text)
Example: { type: "ai" }

EVENT: "error"
Carries: error (the error), context (where it happened)
Example: { error: Error("API failed"), context: "ai.ask" }
```

## Why This Matters (Non-Technical)

Imagine a company where:

- The sales team says "client" meaning "paying customer"
- The support team says "client" meaning "anyone who contacts us"

Confusion! Types prevent this. Everyone uses the **exact same definitions**.

---

# 6. SERVICES — THE DELIVERY SYSTEM

## What Services Do

Services are the **only code that talks to the outside world**. No other part of the app is allowed to contact APIs, databases, or external systems.

## The Restaurant Analogy

```
YOUR APP = Restaurant kitchen
SERVICES = Delivery drivers
API/SERVER = Grocery stores

The chef (Features) NEVER goes to the grocery store personally.
The chef tells a delivery driver (Service): "Get me 2kg tomatoes"
The driver goes to the store, gets tomatoes, brings them back.
The chef doesn't care WHICH store or HOW the driver got there.
```

## Two Delivery Methods (Web vs Desktop)

### Web Version (Browser)

```
Your app runs in a browser.
To get data, it sends an internet request (called "fetch").

App: "Hey internet, give me AI response for 'hello'"
Internet: sends request to server
Server: processes and responds
Internet: delivers response back to app
```

### Desktop Version (Tauri)

```
Your app runs as a native program on the computer.
To get data, it calls a local function (called "invoke").

App: "Hey local Rust program, give me AI response for 'hello'"
Rust: processes locally or contacts server
Rust: returns response directly
```

### Same Interface, Different Method

Both versions have the EXACT same "menu":

```
ai.ask(question)      --> returns an answer
auth.login(email, pw) --> returns user info
user.getProfile()     --> returns profile data
```

The ONLY difference is HOW they fulfill the request internally.

This is like ordering food through **UberEats** vs **DoorDash**. Same pizza. Different delivery service. You don't care which one — you just want your pizza.

## Why This Rule Matters

If features called APIs directly:

```
AI Panel: fetch("/api/ai")
Dashboard: fetch("/api/ai")
Settings: fetch("/api/ai")

Problem: API URL changes from "/api/ai" to "/api/v2/ai"
Fix: Change code in 3 places. Miss one? Bug.
Also: None of this works on desktop (no server to fetch from!)
```

With services:

```
AI Panel: services.ai.ask(question)
Dashboard: services.ai.ask(question)
Settings: services.ai.ask(question)

Problem: API URL changes
Fix: Change code in ONE place (the service). Done.
Also: Desktop version? Just swap the service. Features unchanged.
```

---

# 7. SERVICE INJECTION

## The Problem

We have two sets of services (web + desktop). How does the app know which one to use?

## The Solution: Decide Once at the Top

```
STEP 1: At the very start of the app, check which platform we're on.

STEP 2: Pick the right services.

STEP 3: Make them available to the ENTIRE app.

STEP 4: Every component just says "give me services" — gets the right one.
```

Think of it like a **power outlet standard**:

- In the US, outlets are Type A (two flat pins)
- In Europe, outlets are Type C (two round pins)

You decide which outlet type to install ONCE when building the house. Every device in the house just plugs in — it doesn't need to know if it's in the US or Europe, as long as the outlet matches.

## How It Works

```
App starts
  |
  |--> "Am I on web or desktop?"
  |
  |--> Web?     Use web services (fetch-based)
  |--> Desktop? Use Tauri services (invoke-based)
  |
  |--> Wrap entire app with chosen services
  |
  |--> Every component can now access: useServices()
       Returns the right service automatically
```

**Rule**: Platform detection happens ONCE at the top level. Never inside individual components. No component should ever have `if (platform === "web")` in it.

---

# 8. CORE — THE COMMUNICATION SYSTEM

## What Core Does

Core is the **nervous system** of the app. It lets different parts communicate without knowing about each other.

## The Walkie-Talkie Analogy

Imagine a large construction site with multiple teams:

```
Team A: Electricians
Team B: Plumbers
Team C: Painters
Team D: Inspectors
```

**Without walkie-talkies** (without Core):

```
When electricians finish wiring a room, they must:
1. Walk to plumbers and say "Room 5 is ready"
2. Walk to painters and say "Room 5 is ready"
3. Walk to inspectors and say "Room 5 is ready"

Electricians need to KNOW about every other team.
Add a new team? Electricians must update their list.
```

**With walkie-talkies** (with Core):

```
Electricians radio: "Room 5 wiring complete" (EVENT)

Anyone with a walkie-talkie hears it:
- Plumbers hear it --> start plumbing Room 5
- Painters hear it --> note to paint Room 5 later
- Inspectors hear it --> schedule inspection

Electricians don't know WHO is listening.
Add 10 new teams? Electricians' code doesn't change.
```

## Two Types of Communication

### COMMANDS — "Please Do This"

A command is a **direct request** to perform an action.

```
COMMAND: "ai.ask"
Meaning: "Please ask the AI this question"
Data:    { question: "What is the weather?" }

COMMAND: "panel.open"
Meaning: "Please open this panel"
Data:    { type: "ai" }

COMMAND: "auth.logout"
Meaning: "Please log the user out"
Data:    (none needed)
```

How it works:

```
STEP 1: Someone REGISTERS a handler (sets up the phone line)
        "When someone calls 'ai.ask', here's what to do..."

STEP 2: Someone EXECUTES the command (makes the call)
        "Hey, 'ai.ask', here's a question!"

STEP 3: The handler runs (the person answers)
        Fetches data, updates state, etc.
```

### EVENTS — "This Just Happened"

An event is a **broadcast notification**. Anyone can listen.

```
EVENT: "ai.response"
Meaning: "The AI just responded"
Data:    { answer: "It's sunny!", model: "gpt-4" }

EVENT: "error"
Meaning: "Something went wrong"
Data:    { error: Error("API failed"), context: "ai.ask" }
```

How it works:

```
STEP 1: Interested parties SUBSCRIBE (tune in their radio)
        "I want to hear about ai.response events"

STEP 2: Something EMITS an event (makes an announcement)
        "Broadcasting: AI just responded with 'It's sunny!'"

STEP 3: All subscribers receive the event
        Dashboard updates, notification shows, log records it

STEP 4: When done, UNSUBSCRIBE (turn off radio)
        "I don't need to hear about this anymore"
```

## When to Use Commands vs Events

```
COMMANDS (one-to-one):
  "Do this specific thing"
  --> Used for: triggering actions
  --> Example: "Ask the AI", "Open a panel", "Log out"

EVENTS (one-to-many):
  "This thing happened, FYI"
  --> Used for: notifying multiple listeners
  --> Example: "AI responded", "User logged in", "Error occurred"
```

## The Cleanup Rule

When a component starts listening for events, it MUST stop listening when it's removed from screen. Otherwise, you get "ghost listeners" — invisible code still running, causing bugs and memory leaks.

```
Component appears on screen:
  --> Start listening for "ai.response" events

Component disappears from screen:
  --> STOP listening (cleanup/unsubscribe)
```

This is like leaving a conference call. If you don't hang up, you're still on the call, hearing everything, potentially causing issues.

---

# 9. STATE MANAGEMENT

## The Big Picture

The app needs to "remember" things. But there are TWO kinds of things to remember, and they work completely differently:

```
+--------------------------------------------------+
|           WHAT THE APP REMEMBERS                  |
|                                                   |
|  +-----------------------+  +------------------+  |
|  | SERVER STATE          |  | CLIENT STATE     |  |
|  | (React Query)         |  | (Zustand)        |  |
|  |                       |  |                  |  |
|  | Data FROM the server: |  | Data IN the app: |  |
|  | - User profile        |  | - Sidebar open?  |  |
|  | - AI responses        |  | - Theme dark?    |  |
|  | - Product lists       |  | - Panel visible? |  |
|  | - Messages            |  | - Input history  |  |
|  +-----------------------+  +------------------+  |
+--------------------------------------------------+
```

## Server State — React Query

### What It Is

Server state is data that comes from an external source (API, database). React Query manages this automatically.

### The Librarian Analogy

```
WITHOUT React Query (manual approach):
  You: "I need the book 'AI Basics'"
  You walk to library, find it, bring it back
  5 minutes later, someone else needs the same book
  They walk to library AGAIN, find it AGAIN, bring it back AGAIN

  Problems:
  - Repeated trips (duplicate API calls)
  - No idea if book was updated (stale data)
  - If library is closed, you're stuck (no error handling)

WITH React Query (automated librarian):
  You: "I need the book 'AI Basics'"
  Librarian fetches it, gives you a copy, KEEPS a copy on desk
  5 minutes later, someone else needs the same book
  Librarian: "I already have it!" (serves from cache)
  30 minutes later...
  Librarian: "This might be outdated, let me check for a new edition"
  (automatic refetch)
  Library closed?
  Librarian: "Let me try again in a moment" (automatic retry)
```

### What React Query Handles FOR YOU

| Feature       | Without React Query                    | With React Query      |
| ------------- | -------------------------------------- | --------------------- |
| Loading state | You write `setLoading(true)` manually  | Automatic `isLoading` |
| Error state   | You write `try/catch` and `setError`   | Automatic `error`     |
| Caching       | You copy data to store manually        | Automatic cache       |
| Refetching    | You write timer/polling logic          | Automatic `staleTime` |
| Retrying      | You write retry loops                  | Automatic `retry: 2`  |
| Deduplication | You track which requests are in-flight | Automatic             |

### How Features Use React Query

```
STEP 1: Define what to fetch
  "Get AI answer for this question from the AI service"

STEP 2: React Query does everything else
  - Shows loading while fetching
  - Returns data when ready
  - Shows error if something fails
  - Caches result for next time
  - Retries if request fails
  - Refetches when data gets stale

STEP 3: Your component just reads the result
  - data: the response (or null if not ready)
  - isLoading: true/false
  - error: the error (or null if no error)
```

## Client State — Zustand

### What It Is

Client state is data that exists ONLY in the user's browser/app. It's about the UI itself.

### The Sticky Note Board Analogy

```
Imagine a shared whiteboard in an office:

+------------------------------------+
|         STATUS BOARD               |
|                                    |
|  Sidebar: [OPEN]                   |
|  Theme: [DARK]                     |
|  Active Panels: [AI, Dashboard]    |
|  Selected AI Model: [GPT-4]       |
|  Login Modal: [CLOSED]            |
+------------------------------------+

Anyone can LOOK at the board (read state)
Authorized people can UPDATE the board (write state)
When something changes, everyone looking sees the update
```

### What Goes in Each Store

**AI Store** — AI feature UI preferences:

```
- selectedModel: "gpt-4"          Which AI model is selected
- panelOpen: true                  Is the AI panel showing
- inputHistory: ["hello", "hi"]   What the user typed before
```

**Layout Store** — How the app looks:

```
- sidebarOpen: true               Is sidebar expanded
- theme: "dark"                   Light or dark mode
- activePanels: ["ai"]            Which panels are visible
```

**Auth Store** — Authentication UI state:

```
- isLoginModalOpen: false          Is login popup showing
- redirectAfterLogin: "/dashboard" Where to go after login
```

### The Golden Rule (Most Important Rule in the Architecture)

```
+------------------------------------------------------------------+
|                                                                    |
|   DATA FROM SERVER  -->  React Query    (fetch, cache, retry)     |
|   DATA FOR UI       -->  Zustand Store  (toggles, selections)    |
|                                                                    |
|   NEVER copy server data into Zustand.                            |
|   NEVER put UI toggles in React Query.                            |
|                                                                    |
+------------------------------------------------------------------+
```

**Why?** If you copy server data into Zustand:

```
React Query has: { user: "Alice" }
Zustand copy:   { user: "Alice" }

Server updates Alice's name to "Alicia"
React Query refreshes: { user: "Alicia" }    <-- updated!
Zustand still has:     { user: "Alice" }      <-- STALE! BUG!

Two sources of truth = guaranteed bugs
```

### How Components Read State

**Reading server data** (from React Query):

```
"Show me the AI response"
  --> const { data, isLoading, error } = useAIQuery(question)
  --> data comes directly from the cache/API
```

**Reading client data** (from Zustand):

```
"Is the sidebar open?"
  --> const sidebarOpen = useLayoutStore(s => s.sidebarOpen)
  --> reads from the sticky note board
```

**The Selector Rule**: Always pick SPECIFIC data from the store. Never grab everything.

```
BAD:  "Give me the ENTIRE status board"
      --> Every time ANYTHING changes, you get notified
      --> Like subscribing to EVERY newspaper section when you only read Sports

GOOD: "Just tell me about the sidebar"
      --> You only get notified when the sidebar changes
      --> Like subscribing ONLY to the Sports section
```

---

# 10. FEATURES — INDEPENDENT ROOMS

## What Features Are

Features are complete, self-contained chunks of functionality. Each feature handles one domain of the app.

## The Apartment Building Analogy

```
APARTMENT BUILDING (Your App)
|
|-- Apartment 101: AI Chat
|   |-- Living Room (AIPanel component)
|   |-- Kitchen (useAIQuery hook)
|   |-- Bathroom (useAIMutation hook)
|   |-- Everything the resident needs is inside
|
|-- Apartment 102: Authentication
|   |-- Living Room (LoginForm component)
|   |-- Kitchen (useAuth hook)
|   |-- Complete and self-contained
|
|-- Apartment 103: Dashboard
|   |-- Living Room (Dashboard component)
|   |-- Kitchen (useDashboardData hook)
|   |-- Complete and self-contained
```

**Rules of the building**:

- Each apartment is **self-contained** (has everything it needs)
- Residents do NOT enter each other's apartments (no cross-feature imports)
- They communicate through the **building intercom** (Core events/commands)
- They check the **lobby bulletin board** (Store) for shared information
- All apartments use **standard furniture** (Design System)

## What's Inside a Feature

Each feature has:

```
components/    --> The visual parts (what users see)
hooks/         --> The logic (how things work)
index.ts       --> The front door (what's available to outsiders)
```

The `index.ts` is like a **reception window**. It controls what other parts of the app can access. Internal implementation details stay private.

## How Features Communicate

```
SCENARIO: User logs in via Auth, Dashboard needs to update

WRONG WAY (direct coupling):
  Auth feature: import { refreshDashboard } from "../dashboard"
  Auth feature: refreshDashboard()

  Problem: Auth now DEPENDS on Dashboard.
  Remove Dashboard? Auth breaks.

RIGHT WAY (via Core events):
  Auth feature: emit("auth.changed", { isAuthenticated: true })
  Dashboard feature: on("auth.changed", () => refetchData())

  Benefit: Auth doesn't know Dashboard exists.
  Remove Dashboard? Auth still works perfectly.

RIGHT WAY (via Store):
  Auth feature: useAuthStore sets isAuthenticated = true
  Dashboard feature: reads isAuthenticated from useAuthStore

  Benefit: Both read/write shared state. Neither imports the other.
```

---

# 11. DESIGN SYSTEM — THE BUILDING BLOCKS

## What the Design System Is

A collection of reusable visual pieces that look consistent across the entire app.

## The LEGO Analogy (Detailed)

```
LEGO PIECES (Design System Components):

  [BUTTON]     --> A clickable rectangle
                   Comes in: primary (blue), secondary (gray), danger (red)
                   Sizes: small, medium, large

  [CARD]       --> A container with a border
                   Has: title, subtitle, content area

  [INPUT]      --> A text field where users type
                   Types: text, password, email, search

  [MODAL]      --> A popup dialog box
                   Has: title, content, close button

  [LOADER]     --> A spinning circle
                   Shows when something is loading

  [ERROR VIEW] --> A red box with error message
                   Shows when something goes wrong
```

**LEGO Rule**: A LEGO brick doesn't know what you're building. A red brick works in a house, a car, or a spaceship. Similarly:

- A `<Button>` works in the AI panel, login form, or dashboard
- A `<Card>` works everywhere without knowing where it is
- A `<Modal>` pops up regardless of which feature triggered it

## Design Tokens — The Color Palette

Instead of using raw values, we use named tokens:

```
INSTEAD OF:                     WE USE:
color: "#3B82F6"               color: tokens.colors.primary
color: "#EF4444"               color: tokens.colors.error
font-size: "14px"              font-size: tokens.text.sm
spacing: "16px"                spacing: tokens.space.4

WHY?
- "#3B82F6" means nothing to a reader. "primary" is clear.
- Want to change the primary color? Change ONE token.
  Every component updates automatically.
```

---

# 12. REGISTRY — THE DYNAMIC MENU BOARD

## What Registry Does

Registry connects **names** to **components** so you can render things dynamically.

## The Restaurant Menu Board Analogy

```
MENU BOARD (Registry):

  "burger"     --> Kitchen makes a Burger
  "pizza"      --> Kitchen makes a Pizza
  "salad"      --> Kitchen makes a Salad
  "pasta"      --> Kitchen makes Pasta

CUSTOMER ORDER (Command):
  "I'd like a pizza please"

WAITER (Renderer):
  Looks at menu board
  Finds "pizza" --> Kitchen makes a Pizza
  Delivers Pizza to customer

ADDING NEW ITEM:
  Chef adds "sushi" --> Kitchen makes Sushi to the menu board
  No other changes needed. Waiter can now serve sushi.
```

## How It Works in the App

```
STEP 1: Registry maps names to components
  "ai"        --> AIPanel
  "dashboard" --> Dashboard
  "settings"  --> Settings

STEP 2: User triggers a command
  "Open the AI panel"

STEP 3: Store updates
  activePanels: ["ai"]

STEP 4: Renderer reads store, looks up registry
  activePanels has "ai"
  registry["ai"] = AIPanel
  Renders <AIPanel />

STEP 5: Panel appears on screen!
```

## Why Not Just Hard-Code Everything?

```
WITHOUT Registry (hard-coded):
  if (type === "ai") return <AIPanel />
  if (type === "dashboard") return <Dashboard />
  if (type === "settings") return <Settings />
  // Adding a new panel? Edit this file.
  // 50 panels? 50 if-statements. Messy.

WITH Registry (dynamic):
  const Component = registry[type]
  return <Component />
  // Adding a new panel? Add ONE line to registry.
  // 50 panels? Same two lines of rendering code.
```

---

# 13. ERROR HANDLING — THE SAFETY NET

## Why Errors Need a System

Things WILL go wrong:

- The internet goes down (network error)
- User enters invalid data (validation error)
- A bug in code crashes a component (UI error)
- Server returns unexpected data (system error)

Without a system, each developer handles errors differently (or not at all). With a system, errors are caught, shown, logged, and recovered from — consistently.

## The Safety Net Analogy

```
CIRCUS TRAPEZE ACT (Your App):

  Performer (Feature) does tricks on the trapeze

  SAFETY NET LAYER 1: Service Level
    Catches: API failures, bad responses
    Action: Throws a clear error message upward
    "The internet request failed"

  SAFETY NET LAYER 2: React Query
    Catches: Service errors
    Action: Retries automatically (2 times), provides error state
    "I tried 3 times and it still failed"

  SAFETY NET LAYER 3: Command Level
    Catches: Errors from mutations
    Action: Emits error event for global logging
    "Broadcasting: an error occurred in ai.ask"

  SAFETY NET LAYER 4: UI Level
    Catches: Error state from React Query
    Action: Shows user-friendly error message
    "Sorry, something went wrong. Try again."

  SAFETY NET LAYER 5: Error Boundary
    Catches: Component crashes (bugs in code)
    Action: Shows fallback UI instead of blank screen
    "This section encountered a problem. Click to retry."

  SAFETY NET LAYER 6: Global Error Listener
    Catches: ALL error events
    Action: Logs to monitoring service for developers
    "Error logged at 2024-01-15 14:30 - AI service timeout"
```

## The Flow When Something Goes Wrong

```
User clicks "Ask AI"
     |
     v
Service tries to call API --> FAILS (server is down)
     |
     v
React Query catches error --> Retries 2 times --> Still fails
     |
     v
React Query sets: error = "API unavailable"
     |
     v
Component reads error state --> Shows: "Unable to reach AI. Try again."
     |
     v
Error event emitted --> Global listener logs it for developers
     |
     v
User clicks "Try again" --> Process restarts
```

## Error Boundary — The Last Resort

If a component's code has a bug and CRASHES:

```
WITHOUT Error Boundary:
  Component crashes --> Entire app goes blank/white
  User: "The app is broken!" (closes app)

WITH Error Boundary:
  Component crashes --> Error boundary catches it
  Shows: "Something went wrong in this section" + Retry button
  REST OF THE APP STILL WORKS
  User can click retry or use other features
```

Error boundaries are like **circuit breakers** in a house. If one circuit overloads, that breaker trips — but the rest of the house still has power.

---

# 14. PERFORMANCE — SPEED AND EFFICIENCY

## The Core Problem

Every time something changes, React wants to redraw the ENTIRE screen. This is like repainting your entire house when you just want to change the bedroom color.

## The Goal

> Only redraw (re-render) the SPECIFIC parts that actually changed.

## The Newspaper Subscription Analogy

```
BAD: Subscribe to the ENTIRE newspaper
  --> Every day you get: Sports, Politics, Weather, Finance, Comics, etc.
  --> Even if you only read Sports
  --> Result: Waste of paper and your time

GOOD: Subscribe to ONLY the Sports section
  --> You only receive Sports updates
  --> You ignore changes in other sections
  --> Result: Efficient, no waste
```

This is exactly how store selectors work:

```
BAD:  const everything = useStore()
      --> Component redraws when ANYTHING in store changes

GOOD: const theme = useStore(s => s.theme)
      --> Component redraws ONLY when theme changes
```

## Performance Rules (Simple Version)

### Rule 1: Use Selectors (Always)

```
"Only subscribe to what you need from the store"
Like: Only get sports news, not the whole newspaper
```

### Rule 2: Split Stores by Domain

```
"Have many small stores instead of one giant store"
Like: Having separate mailboxes for bills, personal, and work mail
      Instead of one giant pile where finding anything is slow
```

### Rule 3: Memo Expensive Components (When Needed)

```
"Tell heavy components: don't redraw if your inputs didn't change"
Like: Don't repaint a mural if the wall color around it changed
      Only repaint the mural if the mural design itself changed

When to use: Heavy components (charts, graphs, large lists)
When NOT to use: Simple components (a label, a single button)
```

### Rule 4: Virtualize Long Lists

```
"If you have 1000 items in a list, only draw the ~20 visible ones"
Like: A library doesn't display ALL 10,000 books at once
      It shows the shelf you're looking at
      As you walk to next shelf, those books appear

When to use: Lists with more than ~100 items
```

### Rule 5: Defer Heavy Updates

```
"If an update would freeze the screen, do it in the background"
Like: Processing a large file while still letting the user click buttons
      The file processes in background, UI stays responsive
```

## Performance Summary Table

| Technique      | What It Does                | When to Use          |
| -------------- | --------------------------- | -------------------- |
| Selectors      | Subscribe to specific data  | Always               |
| Split stores   | Smaller update groups       | Always               |
| React.memo     | Prevent unnecessary redraws | Expensive components |
| Virtualization | Only render visible items   | Lists over 100 items |
| Transitions    | Background heavy work       | UI-blocking updates  |

---

# 15. MULTI-PLATFORM — ONE APP, TWO HOMES

## The Concept

Your app runs in two places:

- **Web**: in a browser (Chrome, Safari, Firefox)
- **Desktop**: as an installed application (Windows, Mac, Linux)

## The Car Analogy

```
SAME CAR BODY (UI + Features + Store + Core):
  - Same dashboard
  - Same steering wheel
  - Same seats
  - Same experience for the driver

DIFFERENT ENGINE (Services):
  - Web version: Electric motor (fetch API calls)
  - Desktop version: Diesel engine (Tauri invoke calls)

The driver (user) doesn't know or care about the engine.
They just drive the car.
```

## What's Shared vs What's Different

```
SHARED (95% of the code):
  - All UI components (buttons, cards, panels)
  - All features (AI, auth, dashboard)
  - All stores (layout, AI, auth)
  - Core system (commands, events)
  - Design system (visual pieces)
  - Types and utils

DIFFERENT (5% of the code):
  - Service implementations
    Web:     fetch("https://api.example.com/ai")
    Desktop: invoke("ask_ai", { question })
  - App shell
    Web:     index.html + React mount
    Desktop: Tauri window + React mount
```

## Why This Architecture Makes Multi-Platform Easy

```
TRADITIONAL APPROACH:
  Build web app.
  Build desktop app FROM SCRATCH.
  Maintain TWO complete codebases.
  Fix a bug? Fix it TWICE.
  Add a feature? Add it TWICE.
  Cost: 2x development, 2x maintenance.

THIS ARCHITECTURE:
  Build ONCE.
  Swap only the service layer (5% of code).
  Fix a bug? Fix it ONCE.
  Add a feature? Add it ONCE.
  Cost: ~1.05x development, ~1.05x maintenance.
```

---

# 16. COMPLETE FLOW

## Real Example: User Asks AI a Question

Let's trace EVERY step, from the moment a user types a question to the moment they see the answer.

```
STEP 1: USER TYPES AND CLICKS "ASK"

  The user types "What is the weather?" into the AI input box
  and clicks the Ask button.

  Where: AIPanel component (features/ai/)
  What happens: The button click triggers a command

         +------------------+
         |  [What is the    |
         |   weather?    ]  |
         |  [  ASK  ]       |
         +------------------+
                 |
                 v

STEP 2: COMMAND IS EXECUTED

  The component calls: executeCommand("ai.ask", { question: "What is the weather?" })

  Core looks up who handles "ai.ask" and runs that handler.

  Where: Core (packages/core/)
  What happens: Command handler activates

                 |
                 v

STEP 3: REACT QUERY MUTATION FIRES

  The command handler triggers a React Query mutation.
  React Query calls the service to fetch data.

  Where: Feature hook (features/ai/hooks/useAIMutation.ts)
  What happens: React Query manages the entire request lifecycle

  React Query automatically:
    - Sets isLoading = true (so UI can show a spinner)
    - Calls the service function
    - Will retry 2 times if it fails

                 |
                 v

STEP 4: SERVICE CALLS THE API

  The service makes the actual external request.

  Where: Services (packages/services/)
  What happens depends on platform:

  Web:     fetch("https://api.example.com/ai?q=What+is+the+weather")
  Desktop: invoke("ask_ai", { question: "What is the weather?" })

                 |
                 v

STEP 5: RESPONSE COMES BACK

  The API responds with: { answer: "It's sunny and 72F!", model: "gpt-4" }

  Where: Service returns data to React Query
  What happens: React Query processes the response

  React Query automatically:
    - Sets isLoading = false
    - Stores data in cache (for next time someone asks same question)
    - Sets data = { answer: "It's sunny and 72F!", model: "gpt-4" }

                 |
                 v

STEP 6: SIDE EFFECTS RUN

  After successful response, two things happen:

  A) Event broadcast:
     emit("ai.response", { answer: "It's sunny and 72F!", model: "gpt-4" })

     This notifies anyone listening:
     - Activity log might record it
     - Analytics might track it
     - Notification might show "AI responded"

  B) Client state update:
     useAIStore adds "What is the weather?" to inputHistory

     This is UI state — remembering what the user asked.

                 |
                 v

STEP 7: UI RE-RENDERS

  The AIPanel component is subscribed to the React Query result.
  When data arrives, React automatically redraws ONLY the changed parts.

  Before:
    +------------------+
    |  [What is the    |
    |   weather?    ]  |
    |  [  ASK  ]       |
    |                  |
    |  [LOADING...]    |   <-- Spinner was showing
    +------------------+

  After:
    +------------------+
    |  [What is the    |
    |   weather?    ]  |
    |  [  ASK  ]       |
    |                  |
    |  It's sunny and  |   <-- Answer now showing!
    |  72F!            |
    |  (via gpt-4)     |
    +------------------+
```

## What If Something Goes Wrong?

```
STEP 4 FAILS: Server is down

  Service: fetch fails with "Network Error"
            |
            v
  React Query: Retry attempt 1... still fails
  React Query: Retry attempt 2... still fails
  React Query: Sets error = "Network Error"
            |
            v
  Command handler: emit("error", { error, context: "ai.ask" })
            |
            v
  Global listener: Logs error to monitoring service
            |
            v
  UI re-renders:
    +------------------+
    |  [What is the    |
    |   weather?    ]  |
    |  [  ASK  ]       |
    |                  |
    |  [!] Unable to   |
    |  reach AI.       |
    |  [Try Again]     |
    +------------------+
```

---

# 17. ENFORCEMENT

## Why Enforcement Matters

Rules written in a document are **suggestions**. Developers might forget, ignore, or misunderstand them.

Rules enforced by **tools** are **laws**. The code literally won't build if rules are violated.

## The School Analogy

```
DOCUMENT RULES (suggestions):
  "Please don't run in the hallways"
  --> Some kids still run. No enforcement.

TOOL RULES (laws):
  Speed bumps in the hallway + hall monitors
  --> Physically impossible to run. Enforced.
```

## Three Enforcement Tools

### Tool 1: TypeScript (Strict Mode)

**What it does**: Catches type mismatches before the code runs.

```
WITHOUT TypeScript:
  You call: executeCommand("ai.askkk", { query: "hello" })
  Result: Runs fine... then CRASHES at runtime. In production. Users see it.

WITH TypeScript:
  You call: executeCommand("ai.askkk", { query: "hello" })
  Result: RED ERROR immediately:
    - "ai.askkk" is not a valid command
    - Property should be "question", not "query"
  Code doesn't even compile. Bug caught before it exists.
```

### Tool 2: ESLint (Architecture Rules)

**What it does**: Checks that code follows architecture rules.

```
RULE: "No API calls in UI code"
  Developer writes: fetch("/api/data") inside a component
  ESLint: "ERROR: fetch is not allowed in feature files. Use services layer."

RULE: "No cross-feature imports"
  Developer writes: import { X } from "@repo/features/auth" inside AI feature
  ESLint: "ERROR: Features must not import from other features."

RULE: "Correct dependency direction"
  Developer makes services import from store
  ESLint: "ERROR: services cannot depend on store."
```

### Tool 3: Turborepo (Build Order)

**What it does**: Builds packages in the correct order and skips unchanged packages.

```
Build order (automatic):
  1. types + utils       (no dependencies — build first)
  2. services            (depends on types, utils)
  3. core                (depends on services)
  4. store               (depends on core)
  5. design-system       (depends on types, utils)
  6. features            (depends on everything above)
  7. registry            (depends on features)
  8. apps                (depends on everything)

If you ONLY changed the AI feature:
  Turborepo: "types, utils, services, core, store, design-system unchanged"
  Turborepo: Only rebuilds features + registry + apps
  Result: Build takes 5 seconds instead of 60 seconds
```

---

# 18. PACKAGE DEPENDENCY RULES

## The Complete Map

This table shows every allowed and forbidden dependency:

```
+---------------+------+------+------+------+------+------+------+------+------+
| FROM \ TO     | apps | feat | d-s  | store| core | svc  | reg  | utils| types|
+---------------+------+------+------+------+------+------+------+------+------+
| apps          |  --  |  YES |  YES |  YES |  YES |  YES |  YES |  YES |  YES |
| features      |  NO  |  NO  |  YES |  YES |  YES |  YES |  NO  |  YES |  YES |
| design-system |  NO  |  NO  |  --  |  NO  |  NO  |  NO  |  NO  |  YES |  YES |
| store         |  NO  |  NO  |  NO  |  --  |  YES |  NO  |  NO  |  YES |  YES |
| core          |  NO  |  NO  |  NO  |  NO  |  --  |  YES |  NO  |  YES |  YES |
| services      |  NO  |  NO  |  NO  |  NO  |  NO  |  --  |  NO  |  YES |  YES |
| registry      |  NO  |  YES |  YES |  NO  |  NO  |  NO  |  --  |  NO  |  YES |
| utils         |  NO  |  NO  |  NO  |  NO  |  NO  |  NO  |  NO  |  --  |  YES |
| types         |  NO  |  NO  |  NO  |  NO  |  NO  |  NO  |  NO  |  NO  |  --  |
+---------------+------+------+------+------+------+------+------+------+------+

YES = allowed    NO = forbidden    -- = same package (not applicable)
```

### Reading the Table

Pick a row (FROM) and a column (TO). The cell tells you if that import is allowed.

Example: Row "features", Column "design-system" = YES
Meaning: Features CAN import from design-system.

Example: Row "services", Column "store" = NO
Meaning: Services can NEVER import from store.

---

# 19. PLATFORMPROVIDER

## What It Is

PlatformProvider is a **single wrapper** that sets up ALL the infrastructure your app needs. Every app uses it.

## The Hotel Reception Analogy

```
WITHOUT PlatformProvider:
  Every hotel (app) must individually set up:
  - Key card system (auth)
  - Phone system (services)
  - Emergency procedures (error handling)
  - Room service menu (theme)
  - Guest notification system (toasts)

  3 hotels = set up everything 3 times.
  Forget one thing? That hotel is broken.

WITH PlatformProvider:
  A "Hotel Starter Kit" that includes EVERYTHING.
  Open a new hotel? Just use the kit.

  3 hotels = use the kit 3 times. Done.
  Every hotel has identical, reliable infrastructure.
```

## How It Works

```
Every app simply wraps itself:

<PlatformProvider>
  <App />
</PlatformProvider>

This ONE wrapper automatically sets up:

  +-- ThemeProvider .............. Dark/light mode support
  |   +-- ErrorBoundary ......... Catches crashes, shows fallback
  |   |   +-- QueryProvider ..... React Query for server data
  |   |   |   +-- ServiceProvider  Platform services (web/tauri)
  |   |   |   |   +-- ToastProvider  Notification popups
  |   |   |   |   |   +-- <App />    Your actual application
```

## Why This Matters

```
WITHOUT (each app wires its own):        WITH (one wrapper):
  App 1: 15 lines of provider setup       App 1: <PlatformProvider><App/></PlatformProvider>
  App 2: 15 lines (maybe different)       App 2: <PlatformProvider><App/></PlatformProvider>
  App 3: 15 lines (maybe forgot one)      App 3: <PlatformProvider><App/></PlatformProvider>

  Result: Inconsistency                   Result: Guaranteed consistency
  Risk: Missing providers                 Risk: Zero — everything included
```

---

# 20. DESIGN TOKENS

## What Design Tokens Are

Design tokens are the **named values** that define how everything looks — colors, spacing, font sizes, border radius.

## The Paint Store Analogy

```
WITHOUT Tokens (raw values):
  Developer A uses: color "#3B82F6" for buttons
  Developer B uses: color "#2563EB" for buttons
  Developer C uses: color "#1D4ED8" for buttons

  Result: 3 different "blue" buttons. Inconsistent app.
  Changing brand color: Find and replace across 500 files. Miss some.

WITH Tokens (named values):
  Everyone uses: color "primary"
  Token file says: primary = "#3B82F6"

  Result: Every button is the same blue. Consistent app.
  Changing brand color: Change ONE file. Entire app updates.
```

## What Tokens Define

```
COLORS:
  primary ........... Main brand color (blue)
  secondary ......... Secondary actions (gray)
  success ........... Positive feedback (green)
  warning ........... Caution (yellow)
  error ............. Mistakes/failures (red)
  background ........ Page background
  foreground ........ Text color

SPACING:
  xs .... 4px  (tiny gap)
  sm .... 8px  (small gap)
  md .... 16px (medium gap)
  lg .... 24px (large gap)
  xl .... 32px (extra large gap)

TYPOGRAPHY:
  xs .... 12px (fine print)
  sm .... 14px (small text)
  md .... 16px (body text)
  lg .... 18px (subheading)
  xl .... 24px (heading)
  2xl ... 32px (page title)

RADIUS:
  sm .... 4px  (slightly rounded)
  md .... 8px  (rounded)
  lg .... 16px (very rounded)
  full .. 9999px (circle/pill)
```

## What Tokens Generate

From these single definitions, the system automatically creates:

```
ONE token file generates:
  |
  |--> CSS Variables      (for stylesheets)
  |--> Tailwind Preset    (for Tailwind CSS classes)
  |--> JS Theme Object    (for JavaScript usage)

Change the token once --> all three update automatically.
```

## Why This Matters for the Business

```
SCENARIO: Marketing says "We're rebranding. New colors."

WITHOUT Tokens:
  Developer: "That will take 2 weeks. Colors are scattered
              across 300 files."

WITH Tokens:
  Developer: "Done. Changed 1 file. Deploying now."
```

---

# 21. UI PRIMITIVES AND TYPOGRAPHY

## What UI Primitives Are

Primitives are the basic **layout building blocks**: Box, Stack, Grid, Flex.

They replace writing CSS manually for common layouts.

## The Room Furnishing Analogy

```
WITHOUT Primitives (manual CSS):
  "I need a vertical list with gaps between items"
  Developer writes:
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

  "I need a 3-column grid"
  Developer writes:
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>

  Problems:
  - Different developers write it differently
  - Magic numbers everywhere (16px? 24px? Why?)
  - Hard to make responsive (different on phone vs desktop)
  - Inline CSS becomes unreadable

WITH Primitives (pre-built blocks):
  "I need a vertical list with gaps"
    <Stack gap="md">

  "I need a 3-column grid"
    <Grid columns={3} gap="lg">

  Benefits:
  - Everyone writes it the same way
  - Named values ("md" not "16px")
  - Responsive by default
  - Clean, readable code
```

## Available Primitives

```
BOX     -- Basic container (like a <div> with superpowers)
            <Box padding="md" bg="primary">content</Box>

STACK   -- Vertical list with spacing
            <Stack gap="sm">
              <Card />
              <Card />
              <Card />
            </Stack>

GRID    -- Multi-column layout
            <Grid columns={3} gap="md">
              <Item />
              <Item />
              <Item />
            </Grid>

FLEX    -- Flexible horizontal layout
            <Flex justify="between" align="center">
              <Logo />
              <Nav />
            </Flex>
```

## Typography Components

Instead of random font sizes, use named typography components:

```
WITHOUT (random sizes):
  <p style={{ fontSize: "32px", fontWeight: "bold" }}>Dashboard</p>
  <p style={{ fontSize: "14px", color: "gray" }}>Welcome back</p>

WITH (typography components):
  <H1>Dashboard</H1>
  <Text variant="muted">Welcome back</Text>

Available:
  <H1 />     -- Page title (largest)
  <H2 />     -- Section title
  <H3 />     -- Subsection title
  <Text />   -- Body text
  <Label />  -- Form labels
  <Code />   -- Code snippets
```

## The No Inline CSS Rule

```
FORBIDDEN:
  <div style={{ marginTop: 16, padding: 8, display: "flex" }}>

ALLOWED:
  <Stack gap="md">

EXCEPTION: Truly dynamic values (position from drag-and-drop)
  <div style={{ left: dragPosition.x }}> <!-- OK, this is dynamic -->
```

**Why?** Inline CSS:

- Can't use design tokens automatically
- Can't support dark mode automatically
- Can't be responsive automatically
- Makes code unreadable
- Is impossible to maintain globally

---

# 22. BUNDLE BUDGET

## What Bundle Budget Is

A **size limit** for each part of your app. If any part exceeds its limit, the build fails.

## The Suitcase Analogy

```
You're packing for a flight. Airlines have weight limits.

WITHOUT budget:
  Pack everything. Suitcase weighs 50kg.
  At airport: "Sorry, limit is 23kg. You can't board."
  Now you're unpacking at the gate. Stressful. Too late.

WITH budget:
  Your scale at home says: "Limit 23kg"
  You pack carefully. Remove unnecessary items BEFORE leaving.
  At airport: No problems. You planned ahead.
```

## How It Works

```
EACH PACKAGE HAS A SIZE LIMIT:

  Package             Max Size    What Happens if Exceeded
  ----------------------------------------------------------------
  design-system       120 KB      Build fails. Must optimize.
  Any single feature  200 KB      Build fails. Must split or lazy-load.
  App entry point     400 KB      Build fails. Must code-split.

CHECKED AUTOMATICALLY:
  1. Developer pushes code
  2. CI builds the project
  3. CI checks bundle sizes
  4. Size exceeded? --> BUILD FAILS with clear message:
     "feature-ai is 250 KB, limit is 200 KB.
      Consider lazy-loading heavy dependencies."
  5. Developer optimizes, pushes again
  6. Under budget? --> BUILD PASSES
```

## Why This Matters

```
WITHOUT bundle budget:
  Month 1: App loads in 1 second (small)
  Month 6: App loads in 3 seconds (growing)
  Month 12: App loads in 8 seconds (bloated)
  Users leave. Performance death by a thousand cuts.

WITH bundle budget:
  Month 1: App loads in 1 second
  Month 6: App loads in 1.2 seconds (budget caught bloat early)
  Month 12: App loads in 1.3 seconds (budget keeps enforcing)
  Users stay. Performance stays healthy.
```

---

# 23. SECURITY POLICIES

## Why Security Needs Rules

Without security policies, vulnerabilities sneak in through:

- Outdated dependencies with known bugs
- Risky open-source licenses
- Accidentally exposed secrets
- Desktop apps with too many system permissions

## The Building Security Analogy

```
YOUR APP = Office Building

VULNERABILITY SCANNING = Security guard checking IDs
  "Is this dependency safe to let in?"
  Checks every dependency for known security issues.
  Found a vulnerability? Build fails. Must fix before deploying.

LICENSE COMPLIANCE = Legal team reviewing contracts
  "Are we allowed to use this code commercially?"
  Some open-source licenses (GPL, AGPL) require you to
  open-source YOUR code too. Dangerous for commercial apps.
  Found a risky license? Warning. Must review or replace.

ENVIRONMENT SAFETY = Key card access system
  "Only certain keys work in certain areas"
  - Client-side variables start with VITE_ (safe to expose)
  - API keys, database passwords NEVER in client code
  - Secrets only in server-side or Tauri runtime

TAURI CAPABILITY GOVERNANCE = Room access permissions
  "This app can read files but NOT delete them"
  Desktop apps can access the user's system.
  We restrict EXACTLY what each app can do:
  - Can read files? Yes/No
  - Can access network? Yes/No
  - Can run system commands? Yes/No

SECURE LOGGING = Redacted CCTV footage
  "Record everything, but blur sensitive information"
  Logger automatically hides:
  - Passwords
  - API tokens
  - Personal information (email, phone)
  Even if a developer accidentally logs sensitive data,
  the logger strips it out.
```

## What Runs Automatically

```
ON EVERY CODE PUSH:
  1. pnpm audit        --> Checks for vulnerable dependencies
  2. license-checker   --> Checks for risky licenses
  3. env validation    --> Ensures no secrets in client code

RESULT:
  All pass? --> Code is deployed
  Any fail? --> Build blocked. Developer notified. Must fix.
```

---

# 24. DEPENDENCY GOVERNANCE

## What It Is

A system to keep your project's external libraries healthy, up-to-date, and minimal.

## The Kitchen Pantry Analogy

```
WITHOUT governance:
  Everyone buys their own ingredients.
  3 different brands of flour. 2 expired. Some never used.
  Pantry is a mess. Nobody knows what's in there.

WITH governance:
  One person manages the pantry (central install).
  One brand of flour (single version per dependency).
  Weekly check: what's expired? What's unused? (automated scans)
  Auto-restock: new versions arrive automatically (Renovate bot).
```

## Four Rules

```
RULE 1: CENTRAL INSTALL
  All dependencies installed at the root level.
  Not inside individual packages.
  Ensures one version of everything.

RULE 2: LAYER POLICY
  Foundation packages (types, utils): Minimal dependencies
  Feature packages: Medium dependencies (scoped to domain)
  App packages: Heavier dependencies allowed

  WHY: If a foundation package has heavy dependencies,
       EVERYTHING above it gets heavy too.

RULE 3: UNUSED DEPENDENCY DETECTION
  Tool called "Knip" scans the entire project.
  Finds: packages installed but never imported.
  CI fails if unused dependencies found.

  WHY: Unused packages slow down installs,
       increase attack surface, and confuse developers.

RULE 4: AUTOMATED UPDATES
  Renovate Bot (or Dependabot) runs weekly.
  Checks: are any dependencies outdated?
  Creates pull requests to update them.

  WHY: Small, frequent updates are safe.
       Large, delayed updates are painful and risky.
```

---

# 25. OBSERVABILITY

## What Observability Is

The ability to **see what your app is doing in production** — not just when things break, but continuously.

## The Car Dashboard Analogy

```
WITHOUT Observability:
  You're driving with no dashboard.
  No speedometer, no fuel gauge, no engine light.
  You only know something is wrong when the car STOPS.

WITH Observability:
  Full dashboard.
  Speed: How fast are requests being processed?
  Fuel: How much memory/CPU is being used?
  Engine light: Something is failing — here's what and where.
  Trip computer: Which features are users actually using?
```

## Three Parts

```
STRUCTURED LOGGER:
  Not: console.log("something happened")
  But: logger.info("ai.response", { model: "gpt-4", latency: 230 })

  Benefits:
  - Searchable (filter by "ai.response")
  - Measurable (average latency: 230ms)
  - Safe (automatically redacts passwords/tokens)

METRICS:
  Tracks numbers over time:
  - How many AI queries per minute?
  - Average response time?
  - Error rate?

  Benefits:
  - See trends (getting slower? getting more errors?)
  - Set alerts (if error rate > 5%, notify team)

ERROR TRACKING:
  Connects to our Core error event system:
  - Core emits: emit("error", { error, context })
  - Observability catches it, logs it, sends to monitoring service
  - Team gets notified with full context:
    "Error in ai.ask at 2:30pm. User was on dashboard.
     Network timeout after 30 seconds."
```

## How It Connects to Our Architecture

```
Core Event System                    Observability
     |                                    |
     |-- emit("error", ...)  ----------> logger.error(...)
     |-- emit("ai.response", ...) ----> metrics.track("ai.response", ...)
     |                                    |
     |                               Monitoring Service
     |                               (dashboards, alerts)
```

---

# 26. REMOTE BUILD CACHE

## What It Is

When you build the project, the results are saved in the cloud. Next time anyone builds the same code, they get the cached result instantly — no rebuilding.

## The Test Results Analogy

```
WITHOUT Remote Cache:
  Student A takes a math test. Scores 95. Paper filed locally.
  Student B takes the SAME test. Must take it again from scratch.
  Teacher grades it again. Same result: 95. Wasted time.

WITH Remote Cache:
  Student A takes a math test. Scores 95. Paper filed in cloud.
  Student B has the SAME test. System says:
  "This exact test was already graded. Result: 95."
  No re-grading needed. Instant result.
```

## How It Works

```
DEVELOPER A:
  Changes feature-ai code.
  Builds the project.
  Turborepo: "Building types... services... core... ai... done."
  Results uploaded to cloud cache.

DEVELOPER B (same day):
  Pulls the same code.
  Builds the project.
  Turborepo: "types unchanged (cache hit)
              services unchanged (cache hit)
              core unchanged (cache hit)
              ai unchanged (cache hit)
              ALL CACHED. Build complete in 0.3 seconds."

CI SERVER:
  Same code pushed.
  Turborepo: "Everything cached. Build: 0.3 seconds."

WITHOUT CACHE: Build takes 60-120 seconds.
WITH CACHE: Build takes 0.3-5 seconds (only rebuilds what changed).
```

## Setup (One-Time)

```
npx turbo login     --> Authenticate with Vercel
npx turbo link      --> Connect project to remote cache

Done. Every future build is cached automatically.
```

## Why This Saves Real Money

```
TEAM OF 10 DEVELOPERS:
  Without cache: 10 people x 20 builds/day x 60 seconds = 200 minutes/day WASTED
  With cache: 10 people x 20 builds/day x 5 seconds = 16 minutes/day

  SAVINGS: 184 minutes/day = 3 hours/day = 60+ hours/month
```

---

# 27. QUICK REFERENCE CARD

## "Where Does This Code Go?"

```
I need to...                              Put it in...
---------------------------------------------------------
Make an API call                          services/
Define data shapes                        types/
Format a date / generate an ID           utils/
Define colors, spacing, fonts             tokens/
Create a reusable button                  design-system/components/
Create a layout component (Stack, Grid)   design-system/primitives/
Use H1, H2, Text components              design-system/typography/
Build the AI chat feature                 features/ai/
Remember if sidebar is open              store/
Fetch and cache user data from API        React Query (in feature hook)
Send a cross-feature action               core/ (command)
Notify multiple parts that X happened     core/ (event)
Wrap entire app with infrastructure       core/provider/ (PlatformProvider)
Render components dynamically             registry/
Log events and track metrics              observability/
Set up env vars and feature flags         config/
Check security vulnerabilities            security/
Assemble everything into final app        apps/
```

## "How Do I Communicate Between Parts?"

```
SITUATION                                USE
-----------------------------------------------
Parent to child component               Props (direct)
Shared UI state (sidebar, theme)         Zustand Store
Server data (API responses)              React Query
Trigger an action from anywhere          Core Command
Notify multiple listeners               Core Event
Feature A needs info from Feature B      Store or Event (NEVER direct import)
```

## "What Tool Handles What?"

```
TOOL                  RESPONSIBILITY
---------------------------------------------------------
TypeScript            Catch type errors before runtime
ESLint                Enforce architecture rules
eslint-plugin-        Enforce package dependency direction
  boundaries
Turborepo             Build order + caching + remote cache
React Query           Server state (fetch, cache, retry)
Zustand               Client state (UI preferences)
Vite                  Development server + bundling
Tauri                 Desktop app wrapper
React                 UI rendering
PNPM                  Package manager (workspaces)
Knip                  Detect unused dependencies
Renovate/Dependabot   Automated dependency updates
pnpm audit / Snyk     Security vulnerability scanning
license-checker       Open-source license compliance
Storybook             Component development + preview
Vitest                Unit + component testing
Playwright            End-to-end testing
rollup-plugin-        Bundle size visualization
  visualizer
```

---

# 28. GLOSSARY

Every term used in this document, explained simply.

| Term                            | Simple Explanation                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| **API**                         | A service on the internet that your app talks to (like a waiter taking your order)   |
| **Bundle**                      | All your code packaged together for delivery to the browser (like a shipped box)     |
| **Bundle Budget**               | A size limit for how big each package can be (like a luggage weight limit)           |
| **Cache**                       | Temporarily saved data so you don't have to fetch it again (like bookmarking a page) |
| **CI (Continuous Integration)** | Automated system that builds, tests, and checks code on every push                   |
| **Code Splitting**              | Breaking the app into smaller pieces loaded on demand (like chapters of a book)      |
| **Command**                     | A request to perform a specific action ("please do this")                            |
| **Component**                   | A reusable piece of UI (like a LEGO brick)                                           |
| **Decoupled**                   | Two things that work independently, not directly connected                           |
| **Dependency**                  | Code that another piece of code needs to work (like ingredients for a recipe)        |
| **Dependency Governance**       | Rules and tools for managing external libraries safely                               |
| **Design Token**                | A named design value (like "primary-blue" instead of "#3B82F6")                      |
| **DI (Dependency Injection)**   | Giving code the tools it needs from outside, rather than hardcoding them             |
| **Error Boundary**              | A safety wrapper that catches UI crashes and shows a fallback                        |
| **ESLint**                      | A tool that checks your code follows rules (like a spell-checker for architecture)   |
| **Event**                       | A notification broadcast to anyone listening ("this happened")                       |
| **Feature Flag**                | A switch to turn features on/off without deploying new code                          |
| **Fetch**                       | A way for browsers to request data from the internet                                 |
| **Hook**                        | A function that lets components use features like state and effects                  |
| **Invoke**                      | Tauri's way of calling native (Rust) functions from the UI                           |
| **Knip**                        | A tool that finds unused dependencies and code in your project                       |
| **Lazy Loading**                | Loading code only when it's needed, not upfront (like ordering food when hungry)     |
| **Metrics**                     | Numbers tracked over time (response times, error rates, usage counts)                |
| **Monorepo**                    | All project code in one folder (mono = one, repo = repository)                       |
| **Mutation**                    | An action that changes data (like submitting a form, unlike just reading data)       |
| **Observability**               | The ability to see what your app is doing in production                              |
| **Package**                     | A self-contained folder of code with its own purpose                                 |
| **PlatformProvider**            | A single wrapper that sets up all infrastructure for an app                          |
| **PNPM**                        | A fast, disk-efficient package manager (alternative to npm)                          |
| **Primitive**                   | A basic layout building block (Box, Stack, Grid, Flex)                               |
| **Props**                       | Data passed from a parent component to a child component                             |
| **Query**                       | A request to READ data (unlike mutation which CHANGES data)                          |
| **React**                       | A JavaScript library for building user interfaces                                    |
| **React Query**                 | A library that manages server data (fetching, caching, retrying)                     |
| **Registry**                    | A lookup table mapping names to components                                           |
| **Remote Cache**                | Build results stored in the cloud, shared across team and CI                         |
| **Renovate**                    | A bot that automatically creates PRs to update outdated dependencies                 |
| **Re-render**                   | When React redraws a component on screen                                             |
| **Selector**                    | A function that picks specific data from a store                                     |
| **Service**                     | Code that handles communication with external systems                                |
| **Snyk**                        | A tool that scans dependencies for security vulnerabilities                          |
| **State**                       | Data that the app remembers and can change over time                                 |
| **Store**                       | A centralized place to keep shared state                                             |
| **Storybook**                   | A tool for developing and previewing UI components in isolation                      |
| **Tauri**                       | A framework for building desktop apps using web technologies                         |
| **Turborepo**                   | A tool that manages building multiple packages in a monorepo                         |
| **TypeScript**                  | JavaScript with type checking (catches errors before code runs)                      |
| **UI**                          | User Interface — what the user sees and interacts with                               |
| **Unsubscribe**                 | Stop listening for events (cleanup to prevent ghost listeners)                       |
| **Virtualization**              | Only rendering visible items in a long list (showing 20 of 1000)                     |
| **Vite**                        | A fast build tool for web applications                                               |
| **Zustand**                     | A lightweight state management library for React                                     |

---

# END OF DOCUMENT

This architecture provides **28 integrated systems** covering:

- Modular monorepo structure with clear ownership
- Layered architecture with enforced dependency rules
- Fully typed communication system (commands + events)
- Dual state management (server + client, never duplicated)
- Multi-platform support (Web + Desktop) with shared 95% codebase
- 6-layer error handling with automatic retry and recovery
- Performance governance with bundle budgets and render control
- Enterprise security (vulnerability scanning, license compliance, secret protection)
- Automated dependency health (unused detection, auto-updates)
- Production observability (structured logging, metrics, error tracking)
- Cloud-cached builds saving 60+ hours/month for a 10-person team
- Centralized design system with tokens, primitives, and typography

The system is designed so that:

- Each piece has ONE clear job
- Changes in one place don't break other places
- New features can be added without touching existing code
- Bugs are caught before users see them
- The app stays fast as it grows
- Security and performance are enforced automatically, not by discipline alone
