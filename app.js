/**
 * MAINTAIN-IQ | Enterprise Asset Management System
 * Core Engine v2.0
 */

// --- 1. CONFIG & DATA LAYER ---
const STORAGE_KEY = 'MaintainIQ_DB_V2'; // Changed key to ensure clean start
const factoryDefaults = [{
  code: "PRJ-01",
  desig: "Classroom Projector 01",
  category: "Hardware",
  status: "Operational",
  history: []
 },
 {
  code: "GEN-02",
  desig: "Main Backup Generator",
  category: "Infrastructure",
  status: "Operational",
  history: []
 }
];

// Load or Initialize
let mainframeStorage = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [...factoryDefaults];

function saveDatabase() {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(mainframeStorage));
 console.log("System Log: Data committed to persistent memory.");
}

// --- 2. DOM ELEMENTS ---
const ledgerOutput = document.getElementById('system-ledger-output');
const selectDiagnosticTarget = document.getElementById('diagnostic-target-select');

// --- 3. CORE RENDERING ENGINE ---
function executeRenderCycle(filterQuery = "") {
 console.log("System Log: Refreshing dashboard UI...");
 ledgerOutput.innerHTML = '';
 selectDiagnosticTarget.innerHTML = '<option value="">-- Select Target Node --</option>';

 mainframeStorage.forEach(node => {
  // Dropdown Population
  if (node.status === "Operational") {
   selectDiagnosticTarget.innerHTML += `<option value="${node.code}">[${node.code}] ${node.desig}</option>`;
  }

  // Search Filter
  if (node.code.toLowerCase().includes(filterQuery.toLowerCase()) || node.desig.toLowerCase().includes(filterQuery.toLowerCase())) {
   const statusClass = node.status !== "Operational" ? "status-issue" : "";
   ledgerOutput.innerHTML += `
                <div class="node-packet ${statusClass}">
                    <h3>${node.desig}</h3>
                    <p style="color: #64748b; font-size: 0.85rem;">Code: <strong>${node.code}</strong></p>
                    <p style="margin-top: 5px; color: ${node.status === 'Operational' ? '#34d399' : '#ea580c'}">Status: ${node.status}</p>
                    <button class="node-action-btn" onclick="openNodeInterface('${node.code}')">Manage Node</button>
                </div>
            `;
  }
 });
}

// --- 4. ASSET MANAGEMENT (CRUD) ---
function compileNewNode() {
 const code = document.getElementById('node-code-input').value.trim().toUpperCase();
 const desig = document.getElementById('node-designation-input').value.trim();
 const cat = document.getElementById('node-category-select').value;

 if (!code || !desig) return alert("System Error: Payload incomplete.");
 if (mainframeStorage.some(n => n.code === code)) return alert("Conflict: Node Code exists.");

 const newNode = {
  code,
  desig,
  category: cat,
  status: "Operational",
  history: [`Initialization: ${new Date().toLocaleString()}`]
 };

 mainframeStorage.push(newNode);
 saveDatabase(); // Save immediately

 // UI Reset
 document.getElementById('node-code-input').value = '';
 document.getElementById('node-designation-input').value = '';
 executeRenderCycle();
 console.log("System Log: New node registered successfully.");
}

// --- 5. AI TRIAGE & MODAL LOGIC ---
window.openNodeInterface = function (code) {
 const node = mainframeStorage.find(n => n.code === code);
 if (!node) return;

 activeModalNodeCode = code;
 document.getElementById('modal-node-title').innerText = `[${node.code}] ${node.desig}`;
 document.getElementById('update-designation-input').value = node.desig;

 const historyBox = document.getElementById('modal-history-log');
 historyBox.innerHTML = node.history.map(log => `<div style="margin-bottom: 5px;">>> ${log}</div>`).join('');

 document.getElementById('history-modal').classList.remove('hidden');
}

// --- 6. EVENT LISTENERS ---
document.getElementById('compile-node-btn').addEventListener('click', compileNewNode);
document.getElementById('update-node-btn').addEventListener('click', () => {
 if (!activeModalNodeCode) return;
 const node = mainframeStorage.find(n => n.code === activeModalNodeCode);
 const newDesig = document.getElementById('update-designation-input').value;
 node.desig = newDesig;
 node.history.push(`Update: Changed name to ${newDesig}`);
 saveDatabase();
 executeRenderCycle();
 document.getElementById('history-modal').classList.add('hidden');
});

document.getElementById('wipe-memory-btn').addEventListener('click', () => {
 if (confirm("CRITICAL: This will erase ALL asset registry data. Proceed?")) {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
 }
});

// Run
executeRenderCycle();