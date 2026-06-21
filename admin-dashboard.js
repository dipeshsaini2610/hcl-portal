// =========================
// LIVE CLOCK
// =========================

function updateClock(){

    const clock =
    document.getElementById(
    "liveClock"
    );

    if(!clock) return;

    const now =
    new Date();

    clock.innerHTML =
    now.toLocaleTimeString();

}

setInterval(
updateClock,
1000
);

updateClock();

// =========================
// COUNTER ANIMATION
// =========================

const counters =
document.querySelectorAll(
".counter"
);

function runCounters(){

    counters.forEach(counter=>{

        const target =
        +counter.dataset.target;

        let count = 0;

        const increment =
        target / 120;

        const updateCounter = ()=>{

            if(count < target){

                count += increment;

                counter.innerText =
                Math.floor(count);

                requestAnimationFrame(
                updateCounter
                );

            }

            else{

                counter.innerText =
                target;

            }

        };

        updateCounter();

    });

}

window.addEventListener(
"load",
runCounters
);

// =========================
// NOTIFICATIONS
// =========================

function showNotification(
message
){

    const notification =
    document.createElement(
    "div"
    );

    notification.className =
    "custom-notification";

    notification.innerText =
    message;

    document.body.appendChild(
    notification
    );

    setTimeout(()=>{

        notification.classList.add(
        "show"
        );

    },100);

    setTimeout(()=>{

        notification.remove();

    },3500);

}

// =========================
// ASSISTANT OPEN
// =========================

const assistantBtn =
document.getElementById(
"assistantBtn"
);

const assistantPanel =
document.getElementById(
"assistantPanel"
);

const closeAssistant =
document.getElementById(
"closeAssistant"
);

if(assistantBtn){

    assistantBtn.addEventListener(
    "click",

    ()=>{

        assistantPanel.style.display =
        "block";

        showNotification(
        "HCL Assistant Activated"
        );

    });

}

if(closeAssistant){

    closeAssistant.addEventListener(
    "click",

    ()=>{

        assistantPanel.style.display =
        "none";

    });

}

// =========================
// QUICK ACTION BUTTONS
// =========================

const actionCards =
document.querySelectorAll(
".action-card"
);

actionCards.forEach(card=>{

    card.addEventListener(
    "click",

    ()=>{

        const text =
        card.innerText.trim();

        showNotification(
        text +
        " executed successfully"
        );

    });

});

// =========================
// REPORT CARDS
// =========================

const reportCards =
document.querySelectorAll(
".report-card"
);

reportCards.forEach(card=>{

    card.addEventListener(
    "click",

    ()=>{

        const report =
        card.querySelector(
        "h3"
        ).innerText;

        showNotification(

            report +
            " generated"

        );

    });

});
// =========================
// INTERN SEARCH
// =========================

const searchInput =
document.getElementById(
"internSearch"
);

if(searchInput){

    searchInput.addEventListener(
    "keyup",

    ()=>{

        const filter =
        searchInput.value
        .toLowerCase();

        const rows =
        document.querySelectorAll(
        "#internTable tr"
        );

        rows.forEach(row=>{

            const text =
            row.innerText
            .toLowerCase();

            row.style.display =
            text.includes(filter)
            ? ""
            : "none";

        });

    });

}

// =========================
// DEPARTMENT FILTER
// =========================

const departmentFilter =
document.getElementById(
"departmentFilter"
);

if(departmentFilter){

    departmentFilter.addEventListener(
    "change",

    ()=>{

        const value =
        departmentFilter.value
        .toLowerCase();

        const rows =
        document.querySelectorAll(
        "#internTable tr"
        );

        rows.forEach(row=>{

            if(
                value ===
                "all departments"
            ){

                row.style.display =
                "";

                return;

            }

            const department =
            row.children[2]
            .innerText
            .toLowerCase();

            row.style.display =
            department.includes(value)
            ? ""
            : "none";

        });

    });

}

// =========================
// VIEW BUTTON
// =========================

document.addEventListener("click", (e) => {

    const btn = e.target.closest(".action-btn");

    if (!btn) return;

    const row = btn.closest("tr");
    const name = row?.children[1]?.innerText || "Student";

    if (btn.classList.contains("view-btn")) {
        const studentId = btn.dataset.id;

        if (!studentId) {
            alert("Student ID missing");
            return;
        }

        window.location.href = `student-profile.html?id=${studentId}`;
        return;
    }

    if (btn.classList.contains("edit")) {
        showNotification("Editing " + name);
        return;
    }

    if (btn.classList.contains("delete")) {
        const confirmDelete = confirm("Delete " + name + " ?");

        if (confirmDelete) {
            row?.remove();
            showNotification(name + " removed");
        }
    }

});

// =========================
// CREATE NOTICE BUTTON
// =========================

const createBtn =
document.querySelector(
".create-btn"
);

if(createBtn){

    createBtn.addEventListener(
    "click",

    ()=>{

        const title =
        prompt(
        "Enter Notice Title"
        );

        if(!title) return;

        const noticeList =
        document.querySelector(
        ".notice-list"
        );

        const notice =
        document.createElement(
        "div"
        );

        notice.className =
        "notice-card";

        notice.innerHTML =

        `
        <h4>${title}</h4>

        <p>
        New announcement added
        </p>

        <span>
        ${new Date().toLocaleDateString()}
        </span>
        `;

        noticeList.prepend(
        notice
        );

        showNotification(
        "Announcement Created"
        );

    });

}

// =========================
// HOME BUTTON
// =========================

const homeBtn =
document.querySelector(
".home-btn"
);

if(homeBtn){

    homeBtn.addEventListener(
    "click",

    ()=>{

        showNotification(
        "Redirecting Home..."
        );

    });

}

// =========================
// LOGOUT BUTTON
// =========================

const logoutBtn =
document.querySelector(
".logout-btn"
);

if(logoutBtn){

    logoutBtn.addEventListener(
    "click",

    ()=>{

        const logout =
        confirm(
        "Logout Admin?"
        );

        if(logout){

            showNotification(
            "Logged Out Successfully"
            );

            setTimeout(()=>{

                window.location.href =
                "index.html";

            },1000);

        }

    });

}
// =========================
// AI ASSISTANT RESPONSES
// =========================

const assistantBody =
document.querySelector(
".assistant-body"
);

const botResponses = {

    attendance:
    "Current average attendance is 92% across all internship programs.",

    performance:
    "Performance is calculated using technical skills, discipline, communication and project work.",

    reports:
    "Monthly reports can be generated from the Reports Center section.",

    interns:
    "There are currently 1,250 active interns enrolled.",

    certificates:
    "Certificates are issued after successful internship completion.",

    mentor:
    "Mentor assignments are available inside intern profiles."

};

if(assistantBody){

    const quickActions =
    document.createElement("div");

    quickActions.innerHTML =

    `
    <div class="quick-chat">

        <button class="chat-action">
        Attendance
        </button>

        <button class="chat-action">
        Performance
        </button>

        <button class="chat-action">
        Reports
        </button>

        <button class="chat-action">
        Interns
        </button>

    </div>
    `;

    assistantBody.appendChild(
    quickActions
    );

}

document.addEventListener(
"click",

(e)=>{

    if(
        e.target.classList.contains(
        "chat-action"
        )
    ){

        const keyword =
        e.target.innerText
        .toLowerCase();

        const reply =
        botResponses[keyword];

        const msg =
        document.createElement(
        "div"
        );

        msg.className =
        "bot-message";

        msg.style.marginTop =
        "15px";

        msg.innerText =
        reply;

        assistantBody.appendChild(
        msg
        );

        assistantBody.scrollTop =
        assistantBody.scrollHeight;

    }

});

// =========================
// EXPORT DATA
// =========================

document.querySelectorAll(
".action-card"
)

.forEach(card=>{

    if(

        card.innerText.includes(
        "Export"
        )

    ){

        card.addEventListener(
        "click",

        ()=>{

            const csv =

`Name,Department,Attendance
Rahul Sharma,CSE,94%
Priya Verma,Electrical,88%`;

            const blob =
            new Blob(

            [csv],

            {
                type:
                "text/csv"
            }

            );

            const link =
            document.createElement(
            "a"
            );

            link.href =
            URL.createObjectURL(
            blob
            );

            link.download =
            "intern-data.csv";

            link.click();

            showNotification(
            "CSV Exported"
            );

        });

    }

});

// =========================
// AUTO ACTIVITY FEED
// =========================

const activities = [

"Attendance updated",

"New report generated",

"Workshop scheduled",

"Performance review completed",

"Intern profile updated",

"Certificate approved"

];

setInterval(()=>{

    const feed =
    document.querySelector(
    ".activity-feed"
    );

    if(!feed) return;

    const item =
    document.createElement(
    "div"
    );

    item.className =
    "activity-item";

    item.innerHTML =

    `
    <div class="activity-icon">
        <i class="ri-flashlight-line"></i>
    </div>

    <div>

        <h4>
        System Update
        </h4>

        <p>

        ${
        activities[
        Math.floor(
        Math.random() *
        activities.length
        )
        ]
        }

        </p>

    </div>

    <span>
    just now
    </span>
    `;

    feed.prepend(item);

    if(
        feed.children.length > 6
    ){

        feed.removeChild(
        feed.lastElementChild
        );

    }

},20000);

// =========================
// BAR ANIMATION
// =========================

const bars =
document.querySelectorAll(
".bar"
);

bars.forEach(bar=>{

    const originalHeight =
    bar.style.height;

    bar.style.height =
    "0";

    setTimeout(()=>{

        bar.style.height =
        originalHeight;

    },500);

});

// =========================
// KEYBOARD SHORTCUTS
// =========================

document.addEventListener(
"keydown",

(e)=>{

    // Ctrl + F

    if(
        e.ctrlKey &&
        e.key === "f"
    ){

        e.preventDefault();

        document
        .getElementById(
        "internSearch"
        )
        ?.focus();

        showNotification(
        "Search Activated"
        );

    }

    // Ctrl + N

    if(
        e.ctrlKey &&
        e.key === "n"
    ){

        e.preventDefault();

        document
        .querySelector(
        ".create-btn"
        )
        ?.click();

    }

});

// =========================
// TABLE ROW ANIMATION
// =========================

const rows =
document.querySelectorAll(
"#internTable tr"
);

rows.forEach(

(row,index)=>{

    row.style.opacity =
    "0";

    row.style.transform =
    "translateY(20px)";

    setTimeout(()=>{

        row.style.transition =
        ".5s";

        row.style.opacity =
        "1";

        row.style.transform =
        "translateY(0)";

    },

    index * 150

    );

});
document.addEventListener("DOMContentLoaded", () => {

    const addIntern =
        document.getElementById("addInternBtn");

    const report =
        document.getElementById("reportBtn");

    const notice =
        document.getElementById("noticeBtn");

    const exportData =
        document.getElementById("exportBtn");

    addIntern?.addEventListener("click", () => {

        alert("Add Intern Feature");

        window.location.href =
        "student-form.html";

    });

    report?.addEventListener("click", () => {

        alert("Generating Report...");

    });

    notice?.addEventListener("click", () => {

        const message =
        prompt("Enter Notice");

        if(message){

            localStorage.setItem(
            "latestNotice",
            message
            );

            alert("Notice Created");
        }

    });

    exportData?.addEventListener("click", () => {

        alert(
        "Export Data Feature Coming Soon"
        );

    });

});
document.addEventListener("DOMContentLoaded", () => {

    const adminData =
    JSON.parse(
        localStorage.getItem("adminData")
    );

    if(adminData){

        document.getElementById(
            "adminWelcome"
        ).innerHTML =
        `Welcome Back, ${adminData.name} 👋`;

        document.getElementById(
            "adminDepartmentText"
        ).innerHTML =
        `🏢 ${adminData.department}`;

    }

});
const notificationBtn =
document.getElementById("notificationBtn");

const messageBtn =
document.getElementById("messageBtn");

notificationBtn?.addEventListener(
"click",
() => {

    alert(
    "🔔 Notifications\n\n• 5 New Intern Registrations\n• Attendance Report Generated\n• 2 Pending Approvals"
    );

});

messageBtn?.addEventListener(
"click",
() => {

    alert(
    "📧 Messages\n\n• New query from Intern\n• Meeting scheduled at 3 PM\n• Weekly report received"
    );

});


document.addEventListener("DOMContentLoaded", async () => {

    try {

        const response =
        await fetch("http://localhost:5000/students");

        const students =
        await response.json();
        const presentToday =
        students.filter(
        student => student.attendance >= 75
        ).length;

        const absentToday =
        students.filter(
        student => student.attendance < 75
        ).length;

        const avgPerformance =
        Math.round(

        students.reduce(
        (sum, student) =>
        sum + (student.performance || 0),
        0
        )

        /

        students.length

        );

        const activeInterns =
        students.filter(
        student =>
        student.status === "Active"
        ).length;
        document.getElementById(
        "totalInterns"
        ).innerText =
        students.length;

        document.getElementById(
        "averageScore"
        ).innerText =
        avgPerformance + "%";

        document.getElementById(
        "presentToday"
        ).innerText =
        presentToday;

        document.getElementById(
        "absentToday"
        ).innerText =
        absentToday;

        const totalCounter = document.querySelector(".kpi-card .counter");
        if (totalCounter) {
            totalCounter.dataset.target = students.length;
            totalCounter.innerText = students.length;
        }

        const table =
        document.getElementById("internTable");

        table.innerHTML = "";

        students.forEach(student => {
            table.innerHTML += `
            <tr>
                <td>             </td>  
                <td>${student.name}</td>

                <td>${student.branch}</td>

                <td>${student.attendance || 0}%</td>

                <td>${student.performance || 0}%</td>

                <td>
                    <span class="status ${(student.status || "Active").toLowerCase()}">
                        ${student.status || "Active"}
                    </span>
                </td>

                <td>
                    <button class="action-btn view-btn" data-id="${student._id}">
                        Edit
                    </button>

                    <button class="delete-btn" data-id="${student._id}">
                        Delete
                    </button>
                </td>

            </tr>
            `;

        });

    }

    catch(error){

        console.log(error);

    }

});
document.addEventListener("click", function(e) {

    if (e.target.classList.contains("attendance-btn")) {

        const studentId = e.target.dataset.id;

        window.location.href = `student-profile.html?id=${studentId}`;

    }

});

document.addEventListener("click", async function(e) {

    if (e.target.classList.contains("delete-btn")) {

        const studentId = e.target.dataset.id;

        const confirmDelete = confirm("Delete this student?");

        if (!confirmDelete) {
            return;
        }

        try {

            await fetch(
                `http://localhost:5000/students/${studentId}`,
                {
                    method: "DELETE"
                }
            );

            alert("Student Deleted Successfully");

            location.reload();

        } catch (error) {

            console.log(error);

        }

    }

});
document.addEventListener("DOMContentLoaded",() => {
const chatbotToggle =
document.getElementById(
"chatbotToggle"
);

const chatbotContainer =
document.getElementById(
"chatbotContainer"
);

const closeChatbot =
document.getElementById(
"closeChatbot"
);

chatbotToggle?.addEventListener("click", () => {
    chatbotContainer.style.display = "block";
});
closeChatbot?.addEventListener("click", () => {
    chatbotContainer.style.display = "none";
});
});

// =======================
// CHATBOT RESPONSES
// =======================

const chatInput =
document.getElementById(
"chatInput"
);

const sendMessage =
document.getElementById(
"sendMessage"
);


// =======================
// TYPING ANIMATION
// =======================

function addTyping(reply){

    const typing =
    document.createElement("div");

    typing.className =
    "bot-message";

    typing.innerText =
    "Typing...";

    chatMessages.appendChild(
    typing
    );
    const chatMessages = document.getElementById("chatMessages")
    function addMessage(text, sender) {
        if (!chatMessages) return;

        const div = document.createElement("div");

        div.className = sender === "user" ? "user-message" : "bot-message";
        div.innerText = text;

        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    setTimeout(()=>{

        typing.remove();

        addMessage(
        reply,
        "bot"
        );

    },1000);

}

// =======================
// SEND MESSAGE
// =======================

if(sendMessage){

    sendMessage.addEventListener(
    "click",

    ()=>{

        const question =
        chatInput.value.trim();

        if(!question)
        return;

        addMessage(
        question,
        "user"
        );

        botReply(
        question
        );

        chatInput.value =
        "";

    });

}

