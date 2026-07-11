// Hardware DOM Interfaces
const btnCompileNode = document.getElementById('compile-node-btn');
const btnWipeMemory = document.getElementById('wipe-memory-btn');
const btnLogDiagnostic = document.getElementById('log-diagnostic-btn');
const btnCloseModal = document.getElementById('close-modal-btn');
const btnResolveNode = document.getElementById('resolve-node-btn');

const inputNodeCode = document.getElementById('node-code-input');
const inputNodeDesig = document.getElementById('node-designation-input');
const selectNodeCat = document.getElementById('node-category-select');
const selectDiagnosticTarget = document.getElementById('diagnostic-target-select');
const ledgerOutput = document.getElementById('system-ledger-output');
const queryTerminal = document.getElementById('query-terminal');

// Pre-loaded Factory Data (Requirement C.1)
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
 },
 {
  code: "RTR-03",
  desig: "Network Core Router",
  category: "Network",
  status: "Operational",
  history: []
 },
 {
  code: "HVAC-04",
  desig: "Lab AC Unit",
  category: "Infrastructure",
  status: "Operational",
  history: []
 },
 {
  code: "SRV-05",
  desig: "Database Server Node",
  category: "Hardware",
  status: "Operational",
  history: []
 }
];

// Initialize Main Memory Registry (LocalStorage)
let mainframeStorage = JSON.parse(localStorage.getItem('MaintainIQ_DB'));
if (!mainframeStorage || mainframeStorage.length === 0) {
 mainframeStorage = factoryDefaults;
 pushToDatabase();
}

let activeModalNodeCode = null;

// Core Function: Boot Render Sequence
function executeRenderCycle(filterQuery = "") {
 ledgerOutput.innerHTML = '';
 selectDiagnosticTarget.innerHTML = '';

 mainframeStorage.forEach(node => {
  // Populate the dropdown for Issue Reporting
  if (node.status === "Operational") {
   selectDiagnosticTarget.innerHTML += `<option value="${node.code}">[${node.code}] ${node.desig}</option>`;
  }

  // Search Filter Logic
  if (node.code.toLowerCase().includes(filterQuery.toLowerCase()) || node.desig.toLowerCase().includes(filterQuery.toLowerCase())) {

   let statusClass = node.status !== "Operational" ? "status-issue" : "";

   const packetHTML = `
                <div class="node-packet ${statusClass}">
                    <h3>${node.desig}</h3>
                    <p style="color: #64748b; font-size: 0.85rem;">Code: <strong style="color:#38bdf8">${node.code}</strong> | Cat: ${node.category}</p>
                    <p style="margin-top: 5px; color: ${node.status === 'Operational' ? '#34d399' : '#ea580c'}">Status: ${node.status}</p>
                    <button class="node-action-btn" onclick="openNodeInterface('${node.code}')">Access Node Interface</button>
                </div>
            `;
   ledgerOutput.innerHTML += packetHTML;
  }
 });
}

// Core Function: Register New Asset
function compileNewNode() {
 const code = inputNodeCode.value.trim().toUpperCase();
 const desig = inputNodeDesig.value.trim();
 const cat = selectNodeCat.value;

 if (!code || !desig) return alert("Syntax Error: Complete payload required.");

 // Prevent Duplicate Codes
 if (mainframeStorage.some(n => n.code === code)) return alert("Conflict: Node Code already exists in Mainframe.");

 const newNode = {
  code,
  desig,
  category: cat,
  status: "Operational",
  history: [`Node Initialized at ${new Date().toLocaleTimeString()}`]
 };
 mainframeStorage.push(newNode);

 pushToDatabase();
 inputNodeCode.value = '';
 inputNodeDesig.value = '';
 executeRenderCycle();
}

// Core Function: Report Issue
function logDiagnosticFailure() {
 const targetCode = selectDiagnosticTarget.value;
 const title = document.getElementById('diagnostic-title').value.trim();

 if (!targetCode || !title) return alert("Syntax Error: Required parameters missing.");

 const targetNode = mainframeStorage.find(n => n.code === targetCode);
 if (targetNode) {
  targetNode.status = "Issue Reported";
  targetNode.history.push(`[FAILURE LOGGED] ${title} - ${new Date().toLocaleTimeString()}`);
  pushToDatabase();
  document.getElementById('diagnostic-title').value = '';
  executeRenderCycle();
 }
}

// Core Function: Access Asset Details & Generate QR
window.openNodeInterface = function (code) {
 const node = mainframeStorage.find(n => n.code === code);
 if (!node) return;

 activeModalNodeCode = code;
 document.getElementById('modal-node-title').innerText = `[${node.code}] ${node.desig}`;

 // Auto-Generate QR Code using Free Image API based on the Asset Code
 document.getElementById('qr-render-sector').innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://yourusername.github.io/MaintainIQ-Core/public-asset.html?code=${node.code}&bgcolor=0f172a&color=38bdf8" alt="QR Code" style="border: 2px solid #38bdf8; border-radius: 4px;">
    `;

 const historyBox = document.getElementById('modal-history-log');
 historyBox.innerHTML = node.history.map(log => `<div style="margin-bottom: 5px;">> ${log}</div>`).join('');

 document.getElementById('history-modal').classList.remove('hidden');
}

// Core Function: Resolve Issue (Technician)
function resolveNodeFailure() {
 if (!activeModalNodeCode) return;
 const note = document.getElementById('maintenance-note-input').value.trim();
 if (!note) return alert("Syntax Error: Maintenance notes required for resolution.");

 const node = mainframeStorage.find(n => n.code === activeModalNodeCode);
 node.status = "Operational";
 node.history.push(`[MAINTENANCE RESOLVED] Tech Note: ${note} - ${new Date().toLocaleTimeString()}`);

 pushToDatabase();
 document.getElementById('maintenance-note-input').value = '';
 closeNodeInterface();
 executeRenderCycle();
}

// Memory Utilities
function pushToDatabase() {
 localStorage.setItem('MaintainIQ_DB', JSON.stringify(mainframeStorage));
}

function closeNodeInterface() {
 document.getElementById('history-modal').classList.add('hidden');
 activeModalNodeCode = null;
}

// Trigger Switches (Event Listeners)
btnCompileNode.addEventListener('click', compileNewNode);
btnLogDiagnostic.addEventListener('click', logDiagnosticFailure);
btnResolveNode.addEventListener('click', resolveNodeFailure);
btnCloseModal.addEventListener('click', closeNodeInterface);
queryTerminal.addEventListener('input', (e) => executeRenderCycle(e.target.value));
btnWipeMemory.addEventListener('click', () => {
 if (confirm("WARNING: Wipe mainframe registry and restore factory defaults?")) {
  localStorage.removeItem('MaintainIQ_DB');
  location.reload();
 }
});

// Initial Boot
executeRenderCycle();
// Target the new AI elements
const btnRunTriage = document.getElementById('run-triage-engine-btn');
const inputComplaint = document.getElementById('ai-complaint-input');
const inputDiagnosticTitle = document.getElementById('diagnostic-title');
const inputDiagnosticPriority = document.getElementById('diagnostic-priority');

// Simulated AI Triage Logic (Rule-Based Engine)
function executeAITriageEngine() {
 const rawPayload = inputComplaint.value.toLowerCase().trim();

 if (!rawPayload) {
  return alert("Syntax Error: Provide description for AI analysis.");
 }

 // Change button text to show processing
 btnRunTriage.innerText = "Analyzing Node Failure...";

 setTimeout(() => {
  let aiTitle = "General System Anomaly";
  let aiPriority = "Low";

  // Logic Gates: Checking keywords
  if (rawPayload.includes("flicker") || rawPayload.includes("hdmi") || rawPayload.includes("display")) {
   aiTitle = "Display Output Sync Failure";
   aiPriority = "High";
  } else if (rawPayload.includes("leak") || rawPayload.includes("water")) {
   aiTitle = "Coolant / Liquid Containment Breach";
   aiPriority = "High";
  } else if (rawPayload.includes("hot") || rawPayload.includes("overheat") || rawPayload.includes("fire")) {
   aiTitle = "CRITICAL: Thermal Overload Detected";
   aiPriority = "High";
  } else if (rawPayload.includes("noise") || rawPayload.includes("sound")) {
   aiTitle = "Acoustic Anomaly / Hardware Friction";
   aiPriority = "Low";
  }

  // Auto-fill the inputs with the AI result
  inputDiagnosticTitle.value = aiTitle;
  inputDiagnosticPriority.value = aiPriority;

  // Let the user know they can edit it
  inputDiagnosticTitle.removeAttribute('readonly');
  btnRunTriage.innerText = "Triage Complete. Edit if needed.";
  btnRunTriage.style.background = "#16a34a"; // Turn green

  setTimeout(() => {
   btnRunTriage.innerText = "Run AI Triage Engine";
   btnRunTriage.style.background = "#0f172a"; // Revert
  }, 3000);

 }, 800); // 800ms delay to make it feel like a real AI processing request
}

// Attach the Event Listener
btnRunTriage.addEventListener('click', executeAITriageEngine);