// Sample Data
const projectsData = [
    { id: 1, name: "E-Commerce Platform", manager: "Priya S.", status: "In Progress", progress: 75, deadline: "2026-03-15" },
    { id: 2, name: "Mobile App Redesign", manager: "Rahul K.", status: "Done", progress: 100, deadline: "2026-02-10" },
    { id: 3, name: "API Development", manager: "Anita R.", status: "To Do", progress: 0, deadline: "2026-04-01" },
    { id: 4, name: "Dashboard v2.0", manager: "Vikram M.", status: "In Progress", progress: 45, deadline: "2026-02-28" }
];

const teamData = [
    { name: "Priya Sharma", role: "Project Manager", avatar: "PS", tasks: 12, completed: 8 },
    { name: "Rahul Kumar", role: "Frontend Dev", avatar: "RK", tasks: 15, completed: 12 },
    { name: "Anita Reddy", role: "Backend Dev", avatar: "AR", tasks: 10, completed: 6 },
    { name: "Vikram Singh", role: "Designer", avatar: "VS", tasks: 8, completed: 8 }
];

const tasksData = {
    todo: [
        { id: 1, title: "Design wireframes", desc: "Create initial wireframes for dashboard", priority: "high" },
        { id: 2, title: "API integration", desc: "Connect frontend to backend APIs", priority: "medium" }
    ],
    'in-progress': [
        { id: 3, title: "Build auth module", desc: "Implement login/register functionality", priority: "high" }
    ],
    done: [
        { id: 4, title: "Setup project", desc: "Initialize repository and setup", priority: "low" },
        { id: 5, title: "Responsive design", desc: "Make dashboard mobile-friendly", priority: "medium" }
    ]
};

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const projectsTable = document.getElementById('projectsTable');
const teamGrid = document.querySelector('.team-grid');

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        
        // Update active nav
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show section
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // Update title
        pageTitle.textContent = item.textContent.trim();
    });
});

// Mobile Menu
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Projects Table
function renderProjects() {
    projectsTable.innerHTML = projectsData.map(project => `
        <tr>
            <td>${project.name}</td>
            <td>${project.manager}</td>
            <td><span class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span></td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <span>${project.progress}%</span>
            </td>
            <td>${project.deadline}</td>
            <td>
                <button onclick="editProject(${project.id})" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; margin-right: 8px;">Edit</button>
                <button onclick="deleteProject(${project.id})" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px;">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Team Grid
function renderTeam() {
    teamGrid.innerHTML = teamData.map(member => `
        <div class="team-card">
            <div class="team-avatar">${member.avatar}</div>
            <h4>${member.name}</h4>
            <p>${member.role}</p>
            <div style="display: flex; justify-content: space-around; margin-top: 1rem;">
                <span><strong>${member.tasks}</strong> Tasks</span>
                <span><strong>${member.completed}</strong> Done</span>
            </div>
        </div>
    `).join('');
}

// Kanban Board
function renderKanban() {
    Object.keys(tasksData).forEach(status => {
        const container = document.getElementById(`${status}-tasks`);
        const tasks = tasksData[status];
        container.innerHTML = tasks.map(task => `
            <div class="task-card" draggable="true" data-task-id="${task.id}" data-status="${status}">
                <strong>${task.title}</strong>
                <p>${task.desc}</p>
                <span style="color: #f59e0b; font-size: 0.8rem;">${task.priority}</span>
            </div>
        `).join('');
        document.querySelector(`[data-status="${status}"] .count`).textContent = tasks.length;
    });
    initDragAndDrop();
}

// Drag & Drop
function initDragAndDrop() {
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.dataset.taskId);
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    });

    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData('text/plain');
            moveTask(taskId, column.dataset.status);
        });
    });
}

function moveTask(taskId, newStatus) {
    // Find and move task logic here
    console.log(`Move task ${taskId} to ${newStatus}`);
    renderKanban();
}

// Modal Functions
function addTaskModal() {
    document.getElementById('taskModal').style.display = 'flex';
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const status = document.getElementById('taskStatus').value;
    
    // Add new task
    const newTask = {
        id: Date.now(),
        title,
        desc: document.getElementById('taskDesc').value,
        priority: 'medium'
    };
    
    if (!tasksData[status]) tasksData[status] = [];
    tasksData[status].push(newTask);
    
    renderKanban();
    closeTaskModal();
    e.target.reset();
});

// Sample functions
function editProject(id) { alert(`Edit project ${id}`); }
function deleteProject(id) { if(confirm('Delete project?')) alert(`Deleted project ${id}`); }

// Chart (Simple Canvas)
function renderChart() {
    const canvas = document.getElementById('projectChart');
    const ctx = canvas.getContext('2d');
    // Simple bar chart simulation
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 150, 80, -120);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(150, 150, 80, -90);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(250, 150, 80, -60);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    renderTeam();
    renderKanban();
    renderChart();
});
