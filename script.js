
const themeToggle =
document.getElementById("theme-toggle");

const savedTheme =
localStorage.getItem("theme");

if(savedTheme === "dark"){

    document.body.classList.add("dark");

}

if(themeToggle){

    themeToggle.addEventListener("click",()=>{

        document.body.classList.toggle("dark");

        if(
            document.body.classList.contains("dark")
        ){

            localStorage.setItem(
                "theme",
                "dark"
            );

        }else{

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    });

}

// =======================
// NOTIFICATIONS
// =======================

function showNotification(message){

    const container =
    document.getElementById(
        "notification-container"
    );

    if(!container) return;

    const notification =
    document.createElement("div");

    notification.className =
    "notification";

    notification.innerText =
    message;

    container.appendChild(
        notification
    );

    setTimeout(()=>{

        notification.remove();

    },3000);

}

// =======================
// EXPLORE BUTTON
// =======================

const exploreBtn =
document.getElementById("exploreBtn");

if(exploreBtn){

    exploreBtn.addEventListener("click",()=>{

        document
        .getElementById("features")
        .scrollIntoView({

            behavior:"smooth"

        });

        showNotification(
            "Exploring Portal Features"
        );

    });

}

// =======================
// COUNTER ANIMATION
// =======================

const counters =
document.querySelectorAll(".counter");

const startCounter = ()=>{

    counters.forEach(counter=>{

        const target =
        +counter.dataset.target;

        let count = 0;

        const increment =
        target/100;

        const update = ()=>{

            if(count < target){

                count += increment;

                counter.innerText =
                Math.floor(count);

                requestAnimationFrame(
                    update
                );

            }else{

                counter.innerText =
                target;

            }

        };

        update();

    });

};

const observer =
new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            startCounter();

            observer.disconnect();

        }

    });

},

{threshold:0.4}

);

const statsSection =
document.querySelector(".stats");

if(statsSection){

    observer.observe(
        statsSection
    );

}
// =======================
// SCROLL REVEAL
// =======================

const revealElements =
document.querySelectorAll(

".feature-card, .program-card, .stat-card, .testimonial-card, .contact-card"

);

const revealObserver =
new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add(
                "active"
            );

        }

    });

},

{
    threshold:0.15
}

);

revealElements.forEach(element=>{

    element.classList.add(
        "reveal"
    );

    revealObserver.observe(
        element
    );

});

// =======================
// FEATURE CARD INTERACTION
// =======================

const featureCards =
document.querySelectorAll(
".feature-card"
);

featureCards.forEach(card=>{

    card.addEventListener("click",()=>{

        const feature =
        card.dataset.feature;

        showNotification(

            feature +
            " module available in dashboard"

        );

    });

});

// =======================
// PROGRAM CARD INTERACTION
// =======================

const programCards =
document.querySelectorAll(
".program-card"
);

programCards.forEach(card=>{

    card.addEventListener("click",()=>{

        const program =
        card.querySelector(
        "h3"
        ).innerText;

        showNotification(

            program +
            " Internship Details Viewed"

        );

        card.style.transform =
        "scale(1.03)";

        setTimeout(()=>{

            card.style.transform =
            "";

        },300);

    });

});

// =======================
// ANNOUNCEMENT MODAL
// =======================

const notices =
document.querySelectorAll(
".notice-item"
);

const modal =
document.getElementById(
"announcementModal"
);

const modalText =
document.getElementById(
"announcementText"
);

notices.forEach(notice=>{

    notice.addEventListener(
    "click",

    ()=>{

        if(
            modal &&
            modalText
        ){

            modal.style.display =
            "flex";

            modalText.innerText =
            notice.innerText;

        }

    });

});

window.addEventListener(
"click",

(e)=>{

    if(
        e.target === modal
    ){

        modal.style.display =
        "none";

    }

});

// =======================
// TESTIMONIAL AUTO SLIDER
// =======================

const testimonials =
document.querySelectorAll(
".testimonial-card"
);

let testimonialIndex = 0;

function rotateTestimonials(){

    testimonials.forEach(card=>{

        card.style.opacity =
        ".35";

        card.style.transform =
        "scale(.95)";

    });

    testimonials[
    testimonialIndex
    ].style.opacity = "1";

    testimonials[
    testimonialIndex
    ].style.transform =
    "scale(1)";

    testimonialIndex++;

    if(
        testimonialIndex >=
        testimonials.length
    ){

        testimonialIndex = 0;

    }

}

if(testimonials.length){

    rotateTestimonials();

    setInterval(

        rotateTestimonials,

        3000

    );

}

// =======================
// HERO GLASS CARD EFFECT
// =======================

const glassCards =
document.querySelectorAll(
".glass-card"
);

glassCards.forEach(card=>{

    card.addEventListener(
    "mouseenter",

    ()=>{

        card.style.transform =
        "translateY(-10px)";

    });

    card.addEventListener(
    "mouseleave",

    ()=>{

        card.style.transform =
        "translateY(0px)";

    });

});
// =======================
// CHATBOT
// =======================
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

    chatMessages.scrollTop =
    chatMessages.scrollHeight;

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

// =======================
// QUICK ACTIONS
// =======================

const quickButtons =
document.querySelectorAll(
".quick-actions button"
);

quickButtons.forEach(btn=>{

    btn.addEventListener(
    "click",

    ()=>{

        const question =
        btn.innerText;

        addMessage(
        question,
        "user"
        );

        botReply(
        question
        );

    });

});

// =======================
// CONTACT FORM
// =======================

const contactForm =
document.getElementById(
"contactForm"
);

if(contactForm){

    contactForm.addEventListener(
    "submit",

    (e)=>{

        e.preventDefault();

        const name =
        document.getElementById(
        "name"
        ).value.trim();

        const email =
        document.getElementById(
        "email"
        ).value.trim();

        const message =
        document.getElementById(
        "message"
        ).value.trim();

        if(
            !name ||
            !email ||
            !message
        ){

            showNotification(
            "Please fill all fields"
            );

            return;

        }

        showNotification(
        "Message Sent Successfully"
        );

        contactForm.reset();

    });

}

// =======================
// ACTIVE NAVBAR LINKS
// =======================

const sections =
document.querySelectorAll(
"section"
);

const navLinks =
document.querySelectorAll(
".nav-links a"
);

window.addEventListener(
"scroll",

()=>{

    let current =
    "";

    sections.forEach(section=>{

        const sectionTop =
        section.offsetTop - 150;

        if(
            pageYOffset >=
            sectionTop
        ){

            current =
            section.getAttribute(
            "id"
            );

        }

    });

    navLinks.forEach(link=>{

        link.classList.remove(
        "active"
        );

        if(
            link.getAttribute(
            "href"
            ) ===
            "#" + current
        ){

            link.classList.add(
            "active"
            );

        }

    });

});

// =======================
// HERO PARALLAX
// =======================

const hero =
document.querySelector(
".hero"
);

if(hero){

    hero.addEventListener(
    "mousemove",

    (e)=>{

        const cards =
        document.querySelectorAll(
        ".glass-card"
        );

        const x =
        e.clientX / 50;

        const y =
        e.clientY / 50;

        cards.forEach(card=>{

            card.style.transform =
            `translate(${x}px,${y}px)`;

        });

    });

}

// =======================
// WELCOME MESSAGE
// =======================

window.addEventListener(
"load",

()=>{

    setTimeout(()=>{

        showNotification(
        "Welcome to HCL Internship Management Portal"
        );

    },1000);

});
// SEARCH

const searchInput =
document.getElementById("searchIntern");

if(searchInput){

searchInput.addEventListener(
"keyup",
function(){

const value =
this.value.toLowerCase();

const rows =
document.querySelectorAll(
"#internTable tbody tr"
);

rows.forEach(row=>{

const text =
row.innerText.toLowerCase();

row.style.display =
text.includes(value)
? ""
: "none";

});

});
}

// MODAL

const contactModal =
document.getElementById(
"announcementModal"
);

const openBtn =
document.getElementById(
"openModal"
);

if(openBtn){

openBtn.addEventListener(
"click",
()=>{
contactModal.classList.add(
"show-modal"
);
});

}

window.addEventListener(
"click",
(e)=>{

if(e.target===contactModal){

contactModal.classList.remove(
"show-modal"
);

}

});


const sendBtn =
document.getElementById("sendBtn");

if(chatInput && sendBtn){

    chatInput.addEventListener(
    "keydown",

    (e)=>{

        if(
            e.key === "Enter"
        ){
            e.preventDefault();
            sendBtn.click();

        }

    });

}
