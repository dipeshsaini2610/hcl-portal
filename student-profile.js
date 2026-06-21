// =========================
// STUDENT PROFILE MANAGER
// =========================

const API_URL = "https://hcl-backend-portal.onrender.com";

const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let attendanceData = {};

const calendarGrid = document.getElementById("calendarGrid");
const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");
const loader = document.getElementById("loader");

function showLoader() {
    if (loader) {
        loader.style.display = "flex";
    }
}

function hideLoader() {
    if (loader) {
        loader.style.display = "none";
    }
}

function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value ?? "";
    }
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = value;
    }
}

function getInputValue(id) {
    return document.getElementById(id)?.value ?? "";
}

function getNumberValue(id) {
    return Number(document.getElementById(id)?.value || 0);
}

function getDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getSelectedMonthKeys() {
    const keys = [];
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= totalDays; day++) {
        keys.push(getDateKey(currentYear, currentMonth, day));
    }

    return keys;
}

function calculateAttendancePercentage() {
    const values = Object.values(attendanceData);

    const present = values.filter(status => status === "Present").length;
    const absent = values.filter(status => status === "Absent").length;
    const leave = values.filter(status => status === "Leave").length;

    const totalMarked = present + absent + leave;

    if (totalMarked === 0) {
        return 0;
    }

    return Math.round((present / totalMarked) * 100);
}

function buildAttendanceHistoryForSelectedMonth() {
    return getSelectedMonthKeys()
        .filter(date => attendanceData[date])
        .map(date => ({
            day: date,
            status: attendanceData[date].toLowerCase()
        }));
}

async function loadStudent() {
    if (!studentId || studentId === "undefined" || studentId === "null") {
        alert("Student ID missing. Open this page from Admin Dashboard View/Attendance button.");
        window.location.href = "admin-dashboard.html";
        return;
    }

    try {
        showLoader();

        const response = await fetch(`${API_URL}/students/${studentId}`);
        const student = await response.json();

        if (!response.ok) {
            alert(student.message || "Student not found");
            window.location.href = "admin-dashboard.html";
            return;
        }

        setValue("studentName", student.name || "");
        setValue("studentEmail", student.email || "");
        setValue("studentCollege", student.college || "");
        setValue("studentBranch", student.branch || "");
        setValue("studentAttendance", student.attendance || 0);
        setValue("studentPerformance", student.performance || 0);
        setValue("studentProgress", student.progress || 0);
        setValue("studentStatus", student.status || "Active");

        const notes = document.getElementById("adminNotes");
        if (notes) {
            notes.value = student.notes || "";
        }

        attendanceData = student.attendanceCalendar || {};

        if (monthSelect) {
            monthSelect.value = currentMonth;
        }

        if (yearSelect) {
            yearSelect.value = currentYear;
        }

        generateCalendar();
        updateSummary();

    } catch (error) {
        console.log("Load student error:", error);
        alert("Failed To Load Student");
    } finally {
        hideLoader();
    }
}

function generateCalendar() {
    if (!calendarGrid) return;

    calendarGrid.innerHTML = "";

    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    for (let blank = 0; blank < firstDay; blank++) {
        const emptyBox = document.createElement("div");
        emptyBox.className = "calendar-day empty";
        calendarGrid.appendChild(emptyBox);
    }

    for (let day = 1; day <= totalDays; day++) {
        const fullDate = getDateKey(currentYear, currentMonth, day);
        const status = attendanceData[fullDate] || "";

        const dayBox = document.createElement("div");
        dayBox.className = "calendar-day";

        if (status) {
            dayBox.classList.add(status.toLowerCase());
        }

        dayBox.dataset.date = fullDate;

        dayBox.innerHTML = `
            <div class="date">${day}</div>
            <div class="status">${status || "Not Marked"}</div>
        `;

        dayBox.addEventListener("click", () => {
            toggleAttendance(fullDate, dayBox);
        });

        calendarGrid.appendChild(dayBox);
    }
}

function toggleAttendance(date, element) {
    const currentStatus = attendanceData[date];

    let newStatus = "Present";

    if (currentStatus === "Present") {
        newStatus = "Absent";
    } else if (currentStatus === "Absent") {
        newStatus = "Leave";
    } else if (currentStatus === "Leave") {
        delete attendanceData[date];
        newStatus = "";
    } else {
        newStatus = "Present";
    }

    if (newStatus) {
        attendanceData[date] = newStatus;
    }

    element.className = "calendar-day";

    if (newStatus) {
        element.classList.add(newStatus.toLowerCase());
    }

    const statusElement = element.querySelector(".status");
    if (statusElement) {
        statusElement.innerText = newStatus || "Not Marked";
    }

    const attendancePercent = calculateAttendancePercentage();
    setValue("studentAttendance", attendancePercent);

    updateSummary();
}

function updateSummary() {
    const values = Object.values(attendanceData);

    const present = values.filter(status => status === "Present").length;
    const absent = values.filter(status => status === "Absent").length;
    const leave = values.filter(status => status === "Leave").length;

    const percentage = calculateAttendancePercentage();

    setText("presentCount", present);
    setText("absentCount", absent);
    setText("leaveCount", leave);
    setText("totalAttendance", `${percentage}%`);
}

function markAll(status) {
    getSelectedMonthKeys().forEach(date => {
        attendanceData[date] = status;
    });

    setValue("studentAttendance", calculateAttendancePercentage());

    generateCalendar();
    updateSummary();
}

monthSelect?.addEventListener("change", () => {
    currentMonth = Number(monthSelect.value);
    generateCalendar();
});

yearSelect?.addEventListener("change", () => {
    currentYear = Number(yearSelect.value);
    generateCalendar();
});

document.getElementById("markAllPresent")?.addEventListener("click", () => {
    markAll("Present");
});

document.getElementById("markAllAbsent")?.addEventListener("click", () => {
    markAll("Absent");
});

document.getElementById("markAllLeave")?.addEventListener("click", () => {
    markAll("Leave");
});

document.getElementById("saveAttendanceBtn")?.addEventListener("click", async () => {
    if (!studentId || studentId === "undefined" || studentId === "null") {
        alert("Student ID missing. Please open profile from Admin Dashboard.");
        return;
    }

    try {
        showLoader();

        const attendancePercent = calculateAttendancePercentage();

        const updatedStudent = {
            name: getInputValue("studentName").trim(),
            email: getInputValue("studentEmail").trim(),
            college: getInputValue("studentCollege").trim(),
            branch: getInputValue("studentBranch").trim(),
            attendance: attendancePercent,
            performance: getNumberValue("studentPerformance"),
            progress: getNumberValue("studentProgress"),
            status: getInputValue("studentStatus"),
            attendanceCalendar: attendanceData,
            attendanceHistory: buildAttendanceHistoryForSelectedMonth(),
            notes: getInputValue("adminNotes")
        };

        const response = await fetch(`${API_URL}/students/${studentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedStudent)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Failed To Save");
            return;
        }

        setValue("studentAttendance", attendancePercent);

        // If this same student is logged in, update localStorage too.
        const currentStudent = JSON.parse(localStorage.getItem("studentData") || "null");
        if (currentStudent && currentStudent._id === studentId) {
            localStorage.setItem("studentData", JSON.stringify(result.student));
        }

        const popup = document.getElementById("successPopup");

        if (popup) {
            popup.style.display = "flex";

            setTimeout(() => {
                popup.style.display = "none";
            }, 2500);
        } else {
            alert("Changes Saved Successfully");
        }

    } catch (error) {
        console.log("Save error:", error);
        alert("Server Error");
    } finally {
        hideLoader();
    }
});

loadStudent();
