"use strict";

const STORAGE_KEY = "unievent_data_v1";

const sampleEvents = [
    {
        id: "e1",
        name: "Ngày hội Công nghệ và AI 2026",
        category: "Công nghệ",
        date: "2026-11-12",
        time: "09:00",
        location: "Hội trường A",
        capacity: 250,
        description: "Khám phá trí tuệ nhân tạo, trải nghiệm công nghệ và giao lưu với các câu lạc bộ lập trình.",
        popularity: 98,
        icon: "💻"
    },
    {
        id: "e2",
        name: "Workshop CV nổi bật cho sinh viên",
        category: "Hướng nghiệp",
        date: "2026-11-05",
        time: "14:00",
        location: "Phòng hội thảo B2",
        capacity: 120,
        description: "Học cách viết CV, xây dựng hồ sơ cá nhân và chuẩn bị cho buổi phỏng vấn thực tập.",
        popularity: 92,
        icon: "🧑‍💼"
    },
    {
        id: "e3",
        name: "Cuộc thi Ý tưởng Khởi nghiệp",
        category: "Học thuật",
        date: "2026-11-18",
        time: "08:30",
        location: "Tòa nhà sáng tạo",
        capacity: 180,
        description: "Trình bày ý tưởng, nhận góp ý từ cố vấn và kết nối với các đội thi.",
        popularity: 87,
        icon: "🚀"
    },
    {
        id: "e4",
        name: "Đêm nhạc Chào Tân Sinh Viên",
        category: "Văn hóa",
        date: "2026-11-08",
        time: "18:30",
        location: "Sân khấu ngoài trời",
        capacity: 500,
        description: "Đêm giao lưu âm nhạc, biểu diễn câu lạc bộ và kết nối sinh viên.",
        popularity: 100,
        icon: "🎵"
    },
    {
        id: "e5",
        name: "Giải bóng đá sinh viên mở rộng",
        category: "Thể thao",
        date: "2026-11-22",
        time: "07:00",
        location: "Sân vận động trường",
        capacity: 300,
        description: "Cổ vũ các đội bóng khoa và lan tỏa tinh thần thể thao, đoàn kết.",
        popularity: 80,
        icon: "⚽"
    },
    {
        id: "e6",
        name: "Chủ nhật xanh - Vì cộng đồng",
        category: "Tình nguyện",
        date: "2026-11-15",
        time: "07:30",
        location: "Cổng chính trường",
        capacity: 100,
        description: "Dọn vệ sinh khuôn viên, phân loại rác và thực hiện hoạt động bảo vệ môi trường.",
        popularity: 75,
        icon: "🌱"
    },
    {
        id: "e7",
        name: "Seminar An toàn thông tin",
        category: "Công nghệ",
        date: "2026-12-02",
        time: "13:30",
        location: "Phòng lab C1",
        capacity: 90,
        description: "Tìm hiểu bảo mật dữ liệu, bảo vệ tài khoản và an toàn mạng.",
        popularity: 88,
        icon: "🔐"
    },
    {
        id: "e8",
        name: "Ngày hội sách và văn hóa đọc",
        category: "Văn hóa",
        date: "2026-11-27",
        time: "08:00",
        location: "Thư viện trung tâm",
        capacity: 200,
        description: "Đổi sách, giới thiệu sách hay và chia sẻ thói quen đọc.",
        popularity: 70,
        icon: "📚"
    },
    {
        id: "e9",
        name: "Olympic Toán học sinh viên",
        category: "Học thuật",
        date: "2026-12-06",
        time: "08:00",
        location: "Giảng đường D",
        capacity: 150,
        description: "Thử sức với các bài toán tư duy và giao lưu học thuật.",
        popularity: 72,
        icon: "📐"
    },
    {
        id: "e10",
        name: "Ngày hội hiến máu nhân đạo",
        category: "Tình nguyện",
        date: "2026-12-10",
        time: "07:00",
        location: "Nhà đa năng",
        capacity: 220,
        description: "Hoạt động hiến máu phối hợp với đơn vị y tế và đội ngũ chuyên môn.",
        popularity: 95,
        icon: "❤️"
    }
];

function loadData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            if (
                Array.isArray(data.events) &&
                Array.isArray(data.registrations) &&
                Array.isArray(data.favorites)
            ) {
                return data;
            }
        }
    } catch (error) {
        console.error("Không thể đọc dữ liệu:", error);
    }

    return {
        events: sampleEvents.map(event => ({ ...event })),
        registrations: [],
        favorites: []
    };
}

let db = loadData();
let currentView = "discover";
let confirmCallback = null;

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (error) {
        console.error("Không thể lưu dữ liệu:", error);
        showToast("Không thể lưu dữ liệu trên trình duyệt.");
    }
    render();
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function formatDate(date) {
    if (!date) return "Chưa xác định";
    const parts = date.split("-");
    if (parts.length !== 3) return date;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getRegistrations(eventId) {
    return db.registrations.filter(
        registration => registration.eventId === eventId
    );
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(window.unieventToastTimer);
    window.unieventToastTimer = setTimeout(() => {
        toast.classList.add("hidden");
    }, 2800);
}

function showConfirm(title, message, callback) {
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;
    confirmCallback = callback;
    document.getElementById("confirmDialog").showModal();
}

document.getElementById("confirmBtn").addEventListener("click", function () {
    if (confirmCallback) confirmCallback();
    document.getElementById("confirmDialog").close();
});

function createEventCard(event, mode = "discover") {
    const registeredCount = getRegistrations(event.id).length;
    const capacity = Number(event.capacity) || 0;
    const isFull = registeredCount >= capacity;
    const isFavorite = db.favorites.includes(event.id);

    let actionButtons = "";

    if (mode === "manage") {
        actionButtons = `
            <button class="btn secondary"
                onclick="editEvent('${event.id}')">
                Sửa
            </button>
            <button class="btn danger"
                onclick="deleteEvent('${event.id}')">
                Xóa
            </button>
        `;
    } else {
        actionButtons = `
            <button class="btn primary"
                ${isFull ? "disabled" : ""}
                onclick="openRegister('${event.id}')">
                ${isFull ? "Đã đủ chỗ" : "Đăng ký"}
            </button>
            <button class="btn favorite"
                onclick="toggleFavorite('${event.id}')">
                ${isFavorite ? "♥ Đã lưu" : "♡ Yêu thích"}
            </button>
        `;
    }

    return `
        <article class="event-card">
            <div class="event-banner">
                ${escapeHTML(event.icon || "🎓")}
            </div>
            <div class="event-content">
                <span class="category-tag">
                    ${escapeHTML(event.category)}
                </span>
                <h3>${escapeHTML(event.name)}</h3>
                <p class="description">
                    ${escapeHTML(event.description)}
                </p>
                <div class="event-meta">
                    <span>📅 ${formatDate(event.date)} · ${escapeHTML(event.time || "08:00")}</span>
                    <span>📍 ${escapeHTML(event.location)}</span>
                    <span>👥 ${registeredCount}/${capacity} chỗ</span>
                </div>
                <div class="actions">
                    ${actionButtons}
                </div>
            </div>
        </article>
    `;
}

function renderGrid(elementId, events, mode = "discover") {
    const container = document.getElementById(elementId);
    if (events.length === 0) {
        container.innerHTML = `
            <div class="empty">
                Chưa có sự kiện phù hợp.
            </div>
        `;
        return;
    }

    container.innerHTML = events
        .map(event => createEventCard(event, mode))
        .join("");
}

function getFilteredEvents() {
    const keyword = document
        .getElementById("search")
        .value.trim()
        .toLocaleLowerCase("vi");

    const category = document.getElementById("category").value;
    const sort = document.getElementById("sort").value;

    const events = db.events.filter(event => {
        const content = [
            event.name,
            event.description,
            event.location,
            event.category
        ].join(" ").toLocaleLowerCase("vi");

        return (
            (!keyword || content.includes(keyword)) &&
            (!category || event.category === category)
        );
    });

    if (sort === "name") {
        events.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } else if (sort === "popular") {
        events.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else {
        events.sort((a, b) => a.date.localeCompare(b.date));
    }

    return events;
}

function render() {
    document.getElementById("statEvents").textContent = db.events.length;
    document.getElementById("statRegistrations").textContent = db.registrations.length;
    document.getElementById("statFavorites").textContent = db.favorites.length;

    renderGrid("eventGrid", getFilteredEvents());

    const favoriteEvents = db.events.filter(event =>
        db.favorites.includes(event.id)
    );
    renderGrid("favoriteGrid", favoriteEvents);

    const sortedEvents = [...db.events].sort((a, b) =>
        a.date.localeCompare(b.date)
    );
    renderGrid("manageGrid", sortedEvents, "manage");
}

function setView(view) {
    currentView = view;
    ["discover", "favorites", "manage"].forEach(name => {
        document
            .getElementById(name + "View")
            .classList.toggle("hidden", name !== view);

        document
            .querySelector(`[data-view="${name}"]`)
            .classList.toggle("active", name === view);
    });
    render();
}

document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => {
        setView(button.dataset.view);
    });
});

document.getElementById("search").addEventListener("input", render);
document.getElementById("category").addEventListener("change", render);
document.getElementById("sort").addEventListener("change", render);

function toggleFavorite(eventId) {
    if (db.favorites.includes(eventId)) {
        db.favorites = db.favorites.filter(id => id !== eventId);
        saveData();
        showToast("Đã bỏ sự kiện khỏi danh sách yêu thích.");
    } else {
        db.favorites.push(eventId);
        saveData();
        showToast("Đã thêm vào danh sách yêu thích.");
    }
}

function openRegister(eventId) {
    const event = db.events.find(item => item.id === eventId);
    if (!event) return;

    if (getRegistrations(eventId).length >= Number(event.capacity)) {
        showToast("Sự kiện đã đủ số lượng.");
        return;
    }

    document.getElementById("registerForm").reset();
    document.getElementById("registerEventId").value = eventId;
    document.getElementById("registerEventName").textContent = event.name;
    document.getElementById("registerDialog").showModal();
}

document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const eventId = document.getElementById("registerEventId").value;
    const selectedEvent = db.events.find(item => item.id === eventId);

    if (!selectedEvent) {
        showToast("Không tìm thấy sự kiện.");
        return;
    }

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim().toLowerCase();
    const code = document.getElementById("studentCode").value.trim();

    if (!name || !email) {
        showToast("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    const alreadyRegistered = db.registrations.some(
        registration =>
            registration.eventId === eventId &&
            registration.email === email
    );

    if (alreadyRegistered) {
        showToast("Email này đã đăng ký sự kiện.");
        return;
    }

    if (getRegistrations(eventId).length >= Number(selectedEvent.capacity)) {
        showToast("Sự kiện đã đủ số lượng.");
        return;
    }

    db.registrations.push({
        eventId,
        eventName: selectedEvent.name,
        name,
        email,
        code,
        createdAt: new Date().toISOString()
    });

    document.getElementById("registerDialog").close();
    saveData();
    showToast("Đăng ký sự kiện thành công!");
});

function openNewEvent() {
    document.getElementById("eventForm").reset();
    document.getElementById("editId").value = "";
    document.getElementById("eventTime").value = "08:00";
    document.getElementById("eventCapacity").value = 100;
    document.getElementById("eventFormTitle").textContent = "Thêm sự kiện mới";
    document.getElementById("eventDialog").showModal();
}

document.getElementById("newEventBtn").addEventListener("click", openNewEvent);

function editEvent(eventId) {
    const event = db.events.find(item => item.id === eventId);
    if (!event) return;

    document.getElementById("editId").value = event.id;
    document.getElementById("eventName").value = event.name;
    document.getElementById("eventCategory").value = event.category;
    document.getElementById("eventDate").value = event.date;
    document.getElementById("eventTime").value = event.time || "08:00";
    document.getElementById("eventLocation").value = event.location;
    document.getElementById("eventCapacity").value = event.capacity;
    document.getElementById("eventDescription").value = event.description;
    document.getElementById("eventFormTitle").textContent = "Chỉnh sửa sự kiện";
    document.getElementById("eventDialog").showModal();
}

document.getElementById("eventForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const editId = document.getElementById("editId").value;
    const capacity = Number(document.getElementById("eventCapacity").value);

    if (!Number.isInteger(capacity) || capacity < 1) {
        showToast("Số chỗ phải là số nguyên lớn hơn 0.");
        return;
    }

    const newEvent = {
        id: editId || "e" + Date.now(),
        name: document.getElementById("eventName").value.trim(),
        category: document.getElementById("eventCategory").value,
        date: document.getElementById("eventDate").value,
        time: document.getElementById("eventTime").value || "08:00",
        location: document.getElementById("eventLocation").value.trim(),
        capacity,
        description: document.getElementById("eventDescription").value.trim(),
        popularity: 50,
        icon: "🎓"
    };

    if (editId) {
        const oldEvent = db.events.find(item => item.id === editId);
        if (oldEvent) {
            newEvent.popularity = oldEvent.popularity;
            newEvent.icon = oldEvent.icon;
        }

        db.events = db.events.map(item => item.id === editId ? newEvent : item);

        db.registrations.forEach(registration => {
            if (registration.eventId === editId) {
                registration.eventName = newEvent.name;
            }
        });

        document.getElementById("eventDialog").close();
        saveData();
        showToast("Đã cập nhật sự kiện.");
    } else {
        db.events.push(newEvent);

        document.getElementById("eventDialog").close();
        saveData();
        showToast("Đã thêm sự kiện mới.");
    }
});

function deleteEvent(eventId) {
    const event = db.events.find(item => item.id === eventId);
    if (!event) return;

    showConfirm(
        "Xác nhận xóa sự kiện",
        `Bạn có chắc muốn xóa sự kiện "${event.name}"? Các đăng ký của sự kiện này cũng sẽ bị xóa.`,
        function () {
            db.events = db.events.filter(item => item.id !== eventId);
            db.registrations = db.registrations.filter(
                registration => registration.eventId !== eventId
            );
            db.favorites = db.favorites.filter(id => id !== eventId);
            saveData();
            showToast("Đã xóa sự kiện.");
        }
    );
}

document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById(button.dataset.close).close();
    });
});

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.getElementById("exportCsv").addEventListener("click", function () {
    const rows = [
        [
            "Tên sự kiện",
            "Họ tên",
            "Email",
            "Mã sinh viên",
            "Thời gian đăng ký"
        ],
        ...db.registrations.map(registration => [
            registration.eventName,
            registration.name,
            registration.email,
            registration.code,
            registration.createdAt
        ])
    ];

    const csv = "﻿" + rows.map(row =>
        row.map(value =>
            '"' + String(value ?? "").replace(/"/g, '""') + '"'
        ).join(",")
    ).join("
");

    downloadFile(
        "unievent-dang-ky.csv",
        csv,
        "text/csv;charset=utf-8"
    );

    showToast("Đã xuất danh sách đăng ký.");
});

document.getElementById("exportJson").addEventListener("click", function () {
    downloadFile(
        "unievent-sao-luu.json",
        JSON.stringify(db, null, 2),
        "application/json;charset=utf-8"
    );

    showToast("Đã sao lưu dữ liệu.");
});

document.getElementById("resetDemo").addEventListener("click", function () {
    showConfirm(
        "Khôi phục dữ liệu mẫu",
        "Bạn có chắc muốn khôi phục dữ liệu mẫu? Các sự kiện, đăng ký và yêu thích hiện tại sẽ bị thay thế.",
        function () {
            db = {
                events: sampleEvents.map(event => ({ ...event })),
                registrations: [],
                favorites: []
            };
            saveData();
            showToast("Đã khôi phục dữ liệu mẫu.");
        }
    );
});

render();
