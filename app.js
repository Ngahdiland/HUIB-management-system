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

// Render login/register form
function renderAuthForm() {
    document.getElementById('main-content').innerHTML = `
        <div>
            <h3>Login</h3>
            <form id="loginForm">
                <label>Role:</label>
                <select id="role">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
                <div id="studentFields">
                    <input type="text" id="studentMatricule" placeholder="Matricule Number" required />
                </div>
                <div id="teacherFields" style="display:none;">
                    <input type="text" id="teacherAccessCode" placeholder="Access Code" required />
                </div>
                <div id="adminFields" style="display:none;">
                    <input type="text" id="adminUsername" placeholder="Username" required />
                    <input type="password" id="adminPassword" placeholder="Password" required />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>New student? <a href="#" id="showRegister">Register here</a></p>
        </div>
    `;
    document.getElementById('role').addEventListener('change', handleRoleChange);
    document.getElementById('showRegister').addEventListener('click', renderRegisterForm);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function handleRoleChange(e) {
    const role = e.target.value;
    document.getElementById('studentFields').style.display = role === 'student' ? '' : 'none';
    document.getElementById('teacherFields').style.display = role === 'teacher' ? '' : 'none';
    document.getElementById('adminFields').style.display = role === 'admin' ? '' : 'none';
}

function renderRegisterForm() {
    document.getElementById('main-content').innerHTML = `
        <div>
            <h3>Student Registration</h3>
            <form id="registerForm">
                <input type="text" id="regName" placeholder="Full Name" required />
                <input type="date" id="regDob" placeholder="Date of Birth" required />
                <input type="text" id="regPlace" placeholder="Place of Birth" required />
                <input type="number" id="regAge" placeholder="Age" required min="10" max="100" />
                <input type="text" id="regMatricule" placeholder="Matricule Number" required />
                <button type="submit">Register</button>
            </form>
            <p>Already registered? <a href="#" id="showLogin">Back to login</a></p>
        </div>
    `;
    document.getElementById('showLogin').addEventListener('click', renderAuthForm);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const dob = document.getElementById('regDob').value;
    const place = document.getElementById('regPlace').value.trim();
    const age = parseInt(document.getElementById('regAge').value, 10);
    const matricule = document.getElementById('regMatricule').value.trim();
    if (!name || !dob || !place || !age || !matricule) return;
    if (data.students.some(s => s.matricule === matricule)) {
        alert('Matricule already exists!');
        return;
    }
    data.students.push({
        id: Date.now(),
        name, dob, placeOfBirth: place, age, matricule,
        courses: [], performance: {}, transcript: [], bonuses: 0
    });
    saveData();
    alert('Registration successful! You can now log in.');
    renderAuthForm();
}

function handleLogin(e) {
    e.preventDefault();
    const role = document.getElementById('role').value;
    if (role === 'student') {
        const matricule = document.getElementById('studentMatricule').value.trim();
        const student = data.students.find(s => s.matricule === matricule);
        if (student) renderStudentDashboard(student);
        else alert('Student not found!');
    } else if (role === 'teacher') {
        const code = document.getElementById('teacherAccessCode').value.trim();
        const teacher = data.teachers.find(t => t.accessCode === code);
        if (teacher) renderTeacherDashboard(teacher);
        else alert('Invalid access code!');
    } else if (role === 'admin') {
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;
        const admin = data.admins.find(a => a.username === username && a.password === password);
        if (admin) renderAdminDashboard(admin);
        else alert('Invalid admin credentials!');
    }
}

// Student dashboard
function renderStudentDashboard(student) {
    const courseList = student.courses.map(code => {
        const course = data.courses.find(c => c.code === code);
        const lecturer = course ? data.teachers.find(t => t.id === course.lecturerId) : null;
        return `<li>${course ? course.name : code} - Lecturer: ${lecturer ? lecturer.name : 'N/A'}</li>`;
    }).join('');
    const performanceRows = Object.entries(student.performance).map(([code, perf]) => {
        const course = data.courses.find(c => c.code === code);
        return `<tr><td>${course ? course.name : code}</td><td>${perf.ca || '-'} / 30</td><td>${perf.exam || '-'} / 70</td></tr>`;
    }).join('');
    document.getElementById('main-content').innerHTML = `
        <h3>Welcome, ${student.name}</h3>
        <div><strong>Matricule:</strong> ${student.matricule}</div>
        <div><strong>Date of Birth:</strong> ${student.dob}</div>
        <div><strong>Place of Birth:</strong> ${student.placeOfBirth}</div>
        <div><strong>Age:</strong> ${student.age}</div>
        <h4>Courses & Lecturers</h4>
        <ul>${courseList || '<li>No courses enrolled.</li>'}</ul>
        <h4>Performance</h4>
        <table style="width:100%;border-collapse:collapse;">
            <tr><th>Course</th><th>CA</th><th>Exam</th></tr>
            ${performanceRows || '<tr><td colspan="3">No performance data.</td></tr>'}
        </table>
        <h4>Transcript</h4>
        <pre>${JSON.stringify(student.transcript, null, 2) || 'No transcript yet.'}</pre>
        <div><strong>Bonuses:</strong> ${student.bonuses}</div>
        <h4>School News</h4>
        <ul>${data.news.map(n => `<li><strong>${n.title}</strong>: ${n.content}</li>`).join('') || '<li>No news.</li>'}</ul>
        <button onclick="location.reload()">Logout</button>
    `;
}

// Teacher dashboard
function renderTeacherDashboard(teacher) {
    const courseList = teacher.courses.map(code => {
        const course = data.courses.find(c => c.code === code);
        return `<li>${course ? course.name : code}</li>`;
    }).join('');
    // List students for each course
    let studentsHtml = '';
    teacher.courses.forEach(code => {
        const course = data.courses.find(c => c.code === code);
        const students = data.students.filter(s => s.courses.includes(code));
        studentsHtml += `<h5>${course ? course.name : code}</h5><ul>` +
            (students.length ? students.map(s => `<li>${s.name} (${s.matricule}) <button onclick="recordMark('${s.matricule}','${code}')">Record Mark</button></li>`).join('') : '<li>No students enrolled.</li>') + '</ul>';
    });
    document.getElementById('main-content').innerHTML = `
        <h3>Welcome, ${teacher.name}</h3>
        <div><strong>Access Code:</strong> ${teacher.accessCode}</div>
        <h4>Your Courses</h4>
        <ul>${courseList || '<li>No courses assigned.</li>'}</ul>
        <h4>Students in Your Courses</h4>
        ${studentsHtml}
        <button onclick="location.reload()">Logout</button>
    `;
}

// Mark recording popup
window.recordMark = function(matricule, code) {
    const student = data.students.find(s => s.matricule === matricule);
    if (!student) return alert('Student not found!');
    const perf = student.performance[code] || { ca: '', exam: '' };
    const ca = prompt('Enter CA mark (out of 30):', perf.ca);
    if (ca === null) return;
    const exam = prompt('Enter Exam mark (out of 70):', perf.exam);
    if (exam === null) return;
    student.performance[code] = { ca: Number(ca), exam: Number(exam) };
    saveData();
    alert('Marks recorded!');
}

// Admin dashboard
function renderAdminDashboard(admin) {
    document.getElementById('main-content').innerHTML = `
        <h3>Welcome, ${admin.name}</h3>
        <h4>Generate Lecturer Access Code</h4>
        <form id="genCodeForm">
            <input type="text" id="lecturerName" placeholder="Lecturer Name" required />
            <input type="text" id="courseCode" placeholder="Course Code" required />
            <input type="text" id="courseName" placeholder="Course Name" required />
            <button type="submit">Generate & Assign</button>
        </form>
        <h4>Post School News</h4>
        <form id="newsForm">
            <input type="text" id="newsTitle" placeholder="Title" required />
            <textarea id="newsContent" placeholder="Content" required style="width:100%;height:60px;"></textarea>
            <button type="submit">Post News</button>
        </form>
        <button onclick="location.reload()">Logout</button>
    `;
    document.getElementById('genCodeForm').addEventListener('submit', handleGenCode);
    document.getElementById('newsForm').addEventListener('submit', handlePostNews);
}

function handleGenCode(e) {
    e.preventDefault();
    const name = document.getElementById('lecturerName').value.trim();
    const code = document.getElementById('courseCode').value.trim();
    const courseName = document.getElementById('courseName').value.trim();
    if (!name || !code || !courseName) return;
    const accessCode = 'LECT' + Math.floor(1000 + Math.random() * 9000);
    const teacherId = Date.now();
    data.teachers.push({ id: teacherId, name, accessCode, courses: [code] });
    data.courses.push({ code, name: courseName, lecturerId: teacherId });
    saveData();
    alert(`Lecturer access code generated: ${accessCode}`);
    renderAdminDashboard(data.admins.find(a => a.id === data.admins[0].id));
}

function handlePostNews(e) {
    e.preventDefault();
    const title = document.getElementById('newsTitle').value.trim();
    const content = document.getElementById('newsContent').value.trim();
    if (!title || !content) return;
    data.news.unshift({ id: Date.now(), title, content });
    saveData();
    alert('News posted!');
    renderAdminDashboard(data.admins.find(a => a.id === data.admins[0].id));
}

// Initial load
loadData();
renderAuthForm();
