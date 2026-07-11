# Asset_Managment_SMIT

Hackthon project (SMIT)

# MaintainIQ - System Core (Track C)

**Developer:** Syed Hassan Kazmi  
**Hackathon:** SMIT Final Hackathon (Saylani IT)

## Overview

MaintainIQ is a professional, AI-powered asset lifecycle platform. It gives physical hardware nodes a digital identity, generates automated QR protocols, and centralizes issue reporting through a simulated Artificial Intelligence triage engine.

## Core Features Implemented

- **Pre-Loaded Node Registry:** System boots with 5 factory-default assets to demonstrate a live operational dashboard.
- **Persistent Mainframe (LocalStorage):** Full read/write database simulated on the client side. Data survives system reboots (page refreshes).
- **Simulated AI Triage Engine:** A custom, rule-based logic engine that analyzes natural-language hardware complaints and automatically classifies the failure priority and category.
- **Automated QR Compilation:** Generates live QR codes using a REST API strictly linked to the unique Asset Code.
- **Responsive Enterprise UI:** Styled using a professional, modern CSS architecture tailored to the Saylani Welfare corporate color palette (Deep Blue & Vibrant Green).

## How to Deploy

1. Extract the project files.
2. Open `index.html` in any modern web browser.
3. Use the **Control Panel** to test search filtering or reset the demo memory.

## Live Demonstration Protocol

1. Select an operational asset from the registry.
2. Type a natural language complaint (e.g., "The display is flickering").
3. Click "Run AI Triage Engine" to see the system auto-classify the priority.
4. Log the failure and access the Node Interface to view the QR code and history timeline.
5. Apply a maintenance note and restore the node to full operational status.
