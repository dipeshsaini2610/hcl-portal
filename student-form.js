document.addEventListener("DOMContentLoaded", () => {

    const studentForm = document.getElementById("studentForm");
    const loginBtn = document.getElementById("loginBtn");

    if(studentForm){

        studentForm.addEventListener("submit", async (e) => {

            e.preventDefault();

            const studentData = {
                name: document.getElementById("studentName").value.trim(),
                email: document.getElementById("studentEmail").value.trim(),
                college: document.getElementById("studentCollege").value.trim(),
                branch: document.getElementById("studentBranch").value,
                password: document.getElementById("studentPassword").value.trim()
            };

            try{

                const response = await fetch("http://localhost:5000/students", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                });

                const data = await response.json();

                if(!response.ok){
                    alert(data.message || "Registration Failed");
                    return;
                }

                localStorage.setItem(
                    "studentData",
                    JSON.stringify(data.student)
                );

                alert("Student Registered Successfully");

                window.location.href = "student-dashboard.html";

            }catch(error){
                console.log(error);
                alert("Server Not Running");
            }

        });

    }

    if(loginBtn){

        loginBtn.addEventListener("click", async () => {

            const email = document.getElementById("studentEmail").value.trim();
            const password = document.getElementById("studentPassword").value.trim();

            if(!email || !password){
                alert("Email and Password required for login");
                return;
            }

            try{

                const response = await fetch("http://localhost:5000/student-login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const data = await response.json();

                if(!response.ok){
                    alert(data.message || "Invalid Email or Password");
                    return;
                }

                localStorage.setItem(
                    "studentData",
                    JSON.stringify(data.student)
                );

                alert("Login Successful");

                window.location.href = "student-dashboard.html";

            }catch(error){
                console.log(error);
                alert("Server Not Running");
            }

        });

    }

});