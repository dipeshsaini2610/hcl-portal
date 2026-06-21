// =========================
// STUDENT DASHBOARD JS
// =========================

const API_URL = "http://localhost:5000";

function updateClock() {
    const clock = document.getElementById("liveClock");

    if (!clock) return;

    clock.innerHTML = new Date().toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

function showNotification(message) {
    const notification = document.createElement("div");

    notification.className = "custom-notification";
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 100);

    setTimeout(() => {
        notification.remove();
    }, 3500);
}

function setText(id, text) {
    const element = document.getElementById(id);

    if (element) {
        element.innerHTML = text;
    }
}

function getMonthAttendance(attendanceCalendar, year, monthIndex) {
    const prefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const entries = Object.entries(attendanceCalendar || {})
        .filter(([date]) => date.startsWith(prefix))
        .sort(([a], [b]) => a.localeCompare(b));

    return entries;
}

function renderAttendanceCalendar(student) {
    const calendar = document.getElementById("attendanceCalendar");

    if (!calendar) return;

    calendar.innerHTML = "";

    const attendanceCalendar = student.attendanceCalendar || {};

    let year = 2026;
    let monthIndex = 5; // June

    const allDates = Object.keys(attendanceCalendar).sort();

    if (allDates.length > 0) {
        const latestDate = allDates[allDates.length - 1];
        const parts = latestDate.split("-");

        year = Number(parts[0]);
        monthIndex = Number(parts[1]) - 1;
    }

    const monthEntries = getMonthAttendance(attendanceCalendar, year, monthIndex);

    if (monthEntries.length === 0) {
        const fallback = student.attendanceHistory || [];

        if (fallback.length === 0) {
            calendar.innerHTML = `<p style="opacity:.7;">No attendance marked yet</p>`;
            return;
        }

        fallback.forEach(item => {
            const status = (item.status || "").toLowerCase();

            const div = document.createElement("div");
            div.className = `day ${status}`;
            div.title = item.day || "";

            div.innerText =
                status === "present" ? "P" :
                status === "absent" ? "A" : "L";

            calendar.appendChild(div);
        });

        return;
    }

    monthEntries.forEach(([date, status]) => {
        const statusLower = status.toLowerCase();

        const div = document.createElement("div");
        div.className = `day ${statusLower}`;
        div.title = date;

        div.innerHTML = `
            <span style="font-size:10px;display:block;">${Number(date.slice(-2))}</span>
            <strong>
                ${
                    status === "Present" ? "P" :
                    status === "Absent" ? "A" : "L"
                }
            </strong>
        `;

        calendar.appendChild(div);
    });
}

function renderWeeklyPerformance(student) {
    const weekly = document.getElementById("weeklyPerformance");

    if (!weekly) return;

    const data = student.weeklyPerformance?.length
        ? student.weeklyPerformance
        : [
            { day: "Mon", score: student.performance || 0 },
            { day: "Tue", score: student.performance || 0 },
            { day: "Wed", score: student.performance || 0 },
            { day: "Thu", score: student.performance || 0 },
            { day: "Fri", score: student.performance || 0 }
        ];

    weekly.innerHTML = "";

    data.forEach(item => {
        weekly.innerHTML += `
            <div class="bar" style="height:${item.score || 0}%">
                <span>${item.day}</span>
            </div>
        `;
    });
}

function updateProgressBars(student) {
    const progressFill = document.querySelector(".progress-card .progress-fill");

    if (progressFill) {
        progressFill.style.width = `${student.progress || 0}%`;
    }

    const progressTitle = document.querySelector(".progress-card h2");

    if (progressTitle) {
        progressTitle.innerText = `${student.progress || 0}% Completed`;
    }
}

function updateAttendanceRing(student) {
    const progressCircle = document.querySelector(".progress-circle");

    if (!progressCircle) return;

    const percent = Number(student.attendance || 0);
    const circumference = 440;
    const offset = circumference - (circumference * percent) / 100;

    progressCircle.style.strokeDashoffset = offset;
}

async function loadStudentDashboard() {
    const studentData = JSON.parse(localStorage.getItem("studentData") || "null");

    if (!studentData || !studentData._id) {
        showNotification("Please login/register again");
        setTimeout(() => {
            window.location.href = "student-form.html";
        }, 1200);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/students/${studentData._id}`);
        const student = await response.json();

        if (!response.ok) {
            showNotification(student.message || "Student not found");
            return;
        }

        localStorage.setItem("studentData", JSON.stringify(student));

        setText("welcomeStudent", `Welcome Back, ${student.name || "Student"} 👋`);
        setText("studentCollegeDisplay", `🏫 ${student.college || "College"}`);
        setText("studentBranchDisplay", `🎓 ${student.branch || "Branch"}`);
        setText("attendanceValue", `${student.attendance || 0}%`);
        setText("performanceValue", `${student.performance || 0}%`);
        setText("progressValue", `${student.progress || 0}%`);

        renderAttendanceCalendar(student);
        renderWeeklyPerformance(student);
        updateProgressBars(student);
        updateAttendanceRing(student);

        showNotification("Dashboard Synced With Database");

    } catch (error) {
        console.log("Dashboard load error:", error);
        showNotification("Failed To Load Dashboard");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadStudentDashboard();

    const assistantBtn = document.getElementById("assistantBtn");
    const assistantPanel = document.getElementById("assistantPanel");
    const closeAssistant = document.getElementById("closeAssistant");

    assistantBtn?.addEventListener("click", () => {
        if (assistantPanel) {
            assistantPanel.style.display = "block";
        }
    });

    closeAssistant?.addEventListener("click", () => {
        if (assistantPanel) {
            assistantPanel.style.display = "none";
        }
    });

    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotContainer = document.getElementById("chatbotContainer");
    const closeChatbot = document.getElementById("closeChatbot");

    chatbotToggle?.addEventListener("click", () => {
        if (chatbotContainer) {
            chatbotContainer.style.display = "block";
        }
    });

    closeChatbot?.addEventListener("click", () => {
        if (chatbotContainer) {
            chatbotContainer.style.display = "none";
        }
    });

    const searchBox = document.querySelector(".search-box input");

    searchBox?.addEventListener("keyup", () => {
        if (searchBox.value.trim().length > 2) {
            showNotification("Searching: " + searchBox.value.trim());
        }
    });

    document.querySelectorAll(".task-item input").forEach(box => {
        box.addEventListener("change", () => {
            const text = box.nextElementSibling;

            if (text) {
                text.style.textDecoration = box.checked ? "line-through" : "none";
                text.style.opacity = box.checked ? ".6" : "1";
            }

            const completed = document.querySelectorAll(".task-item input:checked").length;
            showNotification(`${completed} Tasks Completed`);
        });
    });

    document.querySelectorAll(".download-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            showNotification("Certificate Download Started");
        });
    });

    document.querySelectorAll(".sidebar-menu li").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".sidebar-menu li").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
        });
    });

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("day")) {
            if (e.target.classList.contains("present")) {
                showNotification("Present Day");
            } else if (e.target.classList.contains("absent")) {
                showNotification("Absent Day");
            } else {
                showNotification("Leave Day");
            }
        }
    });

    const darkToggle = document.createElement("button");
    darkToggle.className = "dark-toggle";
    darkToggle.innerHTML = "🌙";
    document.body.appendChild(darkToggle);

    if (localStorage.getItem("studentTheme") === "dark") {
        document.body.classList.add("dark");
    }

    darkToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem(
            "studentTheme",
            document.body.classList.contains("dark") ? "dark" : "light"
        );
    });

    const logoutBtn = document.querySelector(".logout-btn");

    logoutBtn?.addEventListener("click", () => {
        const confirmLogout = confirm("Logout from Student Portal?");

        if (confirmLogout) {
            localStorage.removeItem("studentData");
            window.location.href = "index.html";
        }
    });

    const homeBtn = document.querySelector(".home-btn");

    homeBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
    });

    const chatInput = document.getElementById("chatInput");
    const sendMessage = document.getElementById("sendMessage");
    const chatMessages = document.getElementById("chatMessages");

    function addMessage(text, sender) {
        if (!chatMessages) return;

        const div = document.createElement("div");

        div.className = sender === "user" ? "user-message" : "bot-message";
        div.innerText = text;

        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function botReply(question) {
        try {
            const response = await fetch(`${API_URL}/chatbot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: question
                })
            });

            const data = await response.json();

            addMessage(data.reply || "No response received", "bot");

        } catch (error) {
            addMessage("Unable to connect with AI Assistant", "bot");
        }
    }

    sendMessage?.addEventListener("click", () => {
        const question = chatInput?.value.trim();

        if (!question) return;

        addMessage(question, "user");
        botReply(question);

        chatInput.value = "";
    });

    chatInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage?.click();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "f") {
            e.preventDefault();
            document.querySelector(".search-box input")?.focus();
            showNotification("Search Activated");
        }
    });
});

window.addEventListener("load", () => {
    setTimeout(() => {
        showNotification("Student Dashboard Ready 🚀");
    }, 1200);
});
