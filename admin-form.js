document.addEventListener("DOMContentLoaded", () => {

    const adminForm =
        document.getElementById("adminForm");

    adminForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const adminName =
                document.getElementById(
                    "adminName"
                ).value.trim();

            const employeeId =
                document.getElementById(
                    "employeeId"
                ).value.trim();

            const department =
                document.getElementById(
                    "adminDepartment"
                ).value;

            const adminEmail =
                document.getElementById(
                    "adminEmail"
                ).value.trim();

            const accessCode =
                document.getElementById(
                    "accessCode"
                ).value.trim();

            /* Demo Access Code */

            if(accessCode !== "HCL2026"){

                alert(
                    "Invalid Access Code!"
                );

                return;
            }

            const adminData = {

                name: adminName,

                employeeId: employeeId,

                department: department,

                email: adminEmail
            };

            localStorage.setItem(
                "adminData",
                JSON.stringify(adminData)
            );

            const btn =
                document.querySelector(
                    ".register-btn"
                );

            btn.innerHTML =
                "Opening Dashboard...";

            btn.disabled = true;

            setTimeout(() => {

                window.location.href =
                    "admin-dashboard.html";

            }, 1200);

        }
    );

});
document.addEventListener(
    "DOMContentLoaded",
    () => {

        const adminData =
            JSON.parse(
                localStorage.getItem(
                    "adminData"
                )
            );

        if(adminData){

            const welcome =
                document.getElementById(
                    "adminWelcome"
                );

            if(welcome){

                welcome.innerHTML =
                    `Welcome Back, ${adminData.name} 👋`;
            }

            const dept =
                document.getElementById(
                    "adminDepartmentText"
                );

            if(dept){

                dept.innerHTML =
                    `🏢 ${adminData.department}`;
            }

        }

    }
);