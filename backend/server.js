const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1","8.8.8.8"]);
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Error:", err);
});

const Student = require("./models/Student");

// Add student
app.post("/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            message: "Student Added Successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get all students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ joinDate: -1 });
        res.json(students);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get one student
app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Update complete student profile
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student Updated Successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Student login
app.post("/student-login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({
            email,
            password
        });

        if (!student) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        res.json({
            message: "Login Successful",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Quick attendance percentage update
app.put("/students/:id/attendance", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                attendance: req.body.attendance
            },
            {
                new: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Attendance Updated Successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Chatbot
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

app.post("/chatbot", async (req, res) => {
    try {
        const { message } = req.body;

        const result = await model.generateContent(message);
        const response = result.response.text();

        res.json({
            reply: response
        });

    } catch (error) {
        console.log("FULL ERROR =>", error);
        res.status(500).json({
            reply: "Unable to connect with AI Assistant"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started On Port ${PORT}`);
});
