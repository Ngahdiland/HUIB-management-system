// Data structure for the school management system
// This will be used to store and retrieve data locally using JSON

const data = {
    students: [
        // Example student
        // {
        //   id: 1,
        //   name: "John Doe",
        //   dob: "2000-01-01",
        //   placeOfBirth: "Buea",
        //   age: 24,
        //   matricule: "HIB12345",
        //   courses: ["CSE101", "MAT102"],
        //   performance: { "CSE101": { ca: 15, exam: 60 }, ... },
        //   transcript: [],
        //   bonuses: 0
        // }
    ],
    teachers: [
        // Example teacher
        // {
        //   id: 1,
        //   name: "Dr. Smith",
        //   accessCode: "TEACH2025",
        //   courses: ["CSE101"]
        // }
    ],
    admins: [
        // Example admin
        // { id: 1, name: "Admin", username: "admin", password: "admin123" }
    ],
    courses: [
        // Example course
        // { code: "CSE101", name: "Intro to CS", lecturerId: 1 }
    ],
    news: [
        // { id: 1, title: "Welcome!", content: "New semester starts soon." }
    ]
};

// Utility functions for localStorage
function saveData() {
    localStorage.setItem('hibmatData', JSON.stringify(data));
}
function loadData() {
    const stored = localStorage.getItem('hibmatData');
    if (stored) {
        Object.assign(data, JSON.parse(stored));
    }
}

// Add a default admin if none exists
if (!data.admins.length) {
    data.admins.push({ id: 1, name: "System Admin", username: "admin", password: "admin123" });
    saveData();
}

// Initial load
document.addEventListener('DOMContentLoaded', loadData);
