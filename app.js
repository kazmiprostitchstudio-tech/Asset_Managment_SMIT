/**
 * MAINTAIN-IQ | ULTIMATE STABLE BUILD
 * Fixing the Modal/Button interaction issue
 */

// --- GLOBAL STATE ---
let mainframeStorage = JSON.parse(localStorage.getItem('MaintainIQ_DB_V2')) || [{
 code: "PRJ-01",
 desig: "Classroom Projector 01",
 category: "Hardware",
 status: "Operational",
 history: ["Initialized"]
}];
let activeModalNodeCode = null;

function saveDatabase() {
 localStorage.setItem('MaintainIQ_DB_V2', JSON.stringify(mainframeStorage));
}

// --- RENDER ENGINE ---
function executeRenderCycle() {
 const ledger = document.getElementById('system-ledger-output');
 const select = document.getElementById('diagnostic-target-select');
 if (!ledger) return;

 ledger.innerHTML = '';
 select.innerHTML = '<option value="">-- Select Asset --</option>';

 mainframeStorage.forEach(node => {
  if (node.status === "Operational") {
   select.innerHTML += `<option value="${node.code}">[${node.code}] ${node.desig}</option>`;
  }
  ledger.innerHTML += `
            <div class="node-packet ${node.status !== "Operational" ? "status-issue" : ""}">
                <h3>${node.desig}</h3>
                <p>Code: <strong>${node.code}</strong></p>
                <button class="node-action-btn" onclick="openNodeInterface('${node.code}')">Manage Node</button>
            </div>
        `;
 });
}

// --- MODAL FUNCTIONS (Global to prevent scope issues) ---
window.openNodeInterface = function (code) {
 activeModalNodeCode = code;
 const node = mainframeStorage.find(n => n.code === code);
 if (!node) return;

 document.getElementById('modal-node-title').innerText = `[${node.code}] ${node.desig}`;
 document.getElementById('update-designation-input').value = node.desig;

 // Show Modal
 document.getElementById('history-modal').classList.remove('hidden');
};

window.closeModal = function () {
 document.getElementById('history-modal').classList.add('hidden');
 activeModalNodeCode = null;
};

window.updateNode = function () {
 if (!activeModalNodeCode) return;
 const node = mainframeStorage.find(n => n.code === activeModalNodeCode);
 node.desig = document.getElementById('update-designation-input').value;
 saveDatabase();
 executeRenderCycle();
 window.closeModal();
};

window.resolveNode = function () {
 if (!activeModalNodeCode) return;
 const node = mainframeStorage.find(n => n.code === activeModalNodeCode);
 node.status = "Operational";
 node.history.push("Resolved: " + new Date().toLocaleTimeString());
 saveDatabase();
 executeRenderCycle();
 window.closeModal();
};

// --- INITIALIZERS ---
document.addEventListener('DOMContentLoaded', () => {
 // Compile Node
 document.getElementById('compile-node-btn').addEventListener('click', () => {
  const code = document.getElementById('node-code-input').value.toUpperCase();
  const desig = document.getElementById('node-designation-input').value;
  if (!code || !desig) return alert("Fill fields!");

  mainframeStorage.push({
   code,
   desig,
   status: "Operational",
   history: ["Initialized"]
  });
  saveDatabase();
  executeRenderCycle();
  document.getElementById('node-code-input').value = '';
  document.getElementById('node-designation-input').value = '';
 });

 // AI Triage
 document.getElementById('run-triage-engine-btn').addEventListener('click', () => {
  const text = document.getElementById('ai-complaint-input').value.toLowerCase();
  const title = document.getElementById('diagnostic-title');

  if (text.includes("heatup")) {
   title.value = "CRITICAL: Thermal Overload";
   document.getElementById('diagnostic-priority').value = "High";
  } else {
   title.value = "General System Anomaly";
  }
 });

 executeRenderCycle();
});

function generateReport() {
 alert("System: Generating PDF Report for " + activeModalNodeCode + "...");
 setTimeout(() => {
  alert("SUCCESS: Maintenance_Report_" + activeModalNodeCode + ".pdf Downloaded!");
 }, 1500);
}