const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    college: {
        type: String,
        default: ""
    },
    branch: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    attendance: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "Active"
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    performance: {
        type: Number,
        default: 0
    },
    progress: {
        type: Number,
        default: 0
    },
    attendanceHistory: [
        {
            day: String,
            status: String
        }
    ],
    weeklyPerformance: [
        {
            day: String,
            score: Number
        }
    ],
    attendanceCalendar: {
        type: Object,
        default: {}
    },
    notes: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Student", studentSchema);
