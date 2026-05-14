
/* ================= CONFIG ================= */
const colors = ["red", "yellow", "green", "blue"];
const STORAGE_KEY = "multiskill";

/* ================= STORAGE SEGURO ================= */
let employees = [];

try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    employees = Array.isArray(data) ? data : [];
} catch {
    employees = [];
}

/* ================= NORMALIZA ================= */
function normalizeEmployee(emp) {
    return {
        name: emp?.name || "",
        skills: Array.isArray(emp?.skills)
            ? [...emp.skills, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].slice(0, 15)
            : Array(15).fill(0)
    };
}

function saveStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

/* ================= RENDER ================= */
function renderTable() {
    const tbody = document.querySelector("#skillTable tbody");
    tbody.innerHTML = "";

    const search = document.getElementById("searchEmployee").value.toLowerCase();

    employees = employees.map(normalizeEmployee);

    employees
        .filter(emp => emp.name.toLowerCase().includes(search))
        .forEach((emp, empIndex) => {

            const tr = document.createElement("tr");

            const tdName = document.createElement("td");
            tdName.textContent = emp.name;
            tdName.className = "func-name";
            tr.appendChild(tdName);

            emp.skills.forEach((_, skillIndex) => {
                const td = document.createElement("td");
                const div = document.createElement("div");

                const level = emp.skills[skillIndex] ?? 0;
                div.className = "skill " + (colors[level] || "red");

                div.onclick = () => {
                    emp.skills[skillIndex] =
                        (emp.skills[skillIndex] + 1) % colors.length;
                    saveStorage();
                    renderTable();
                };

                td.appendChild(div);
                tr.appendChild(td);
            });

            const tdDelete = document.createElement("td");
            const btn = document.createElement("button");
            btn.textContent = "X";
            btn.className = "delete-btn";
            btn.onclick = () => {
                employees.splice(empIndex, 1);
                saveStorage();
                renderTable();
            };

            tdDelete.appendChild(btn);
            tr.appendChild(tdDelete);
            tbody.appendChild(tr);
        });
}

/* ================= ADD ================= */
function addEmployee() {
    const input = document.getElementById("employeeName");
    const name = input.value.trim();
    if (!name) return;

    employees.push({
        name,
        skills: Array(10).fill(0)
    });

    input.value = "";
    saveStorage();
    renderTable();
}

/* ================= JSON BACKUP ================= */
function exportJSON() {
    const blob = new Blob(
        [JSON.stringify(employees, null, 2)],
        { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "multiskill_backup.json";
    a.click();
    URL.revokeObjectURL(url);
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data)) throw "inválido";
            employees = data.map(normalizeEmployee);
            saveStorage();
            renderTable();
            alert("Backup carregado com sucesso!");
        } catch {
            alert("Erro ao importar o arquivo JSON");
        }
    };
    reader.readAsText(file);
}

/* ================= PDF ================= */
function exportPDF() {
    html2pdf()
        .set({
            margin: 5,
            filename: "quadro_multiskill.pdf",
            html2canvas: { scale: 1.5 },
            jsPDF: { orientation: "landscape", unit: "mm", format: "a4" }
        })
        .from(document.getElementById("content"))
        .save();
}

/* ================= INIT ================= */
saveStorage();
renderTable();

