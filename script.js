let heatmapInstance;

function initHeatmap(width, height) {
    const container = document.getElementById('heatmapContainer');
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    heatmapInstance = h337.create({ container });
}

function loadFloorplan(file) {
    const img = document.getElementById('floorplan-img');
    const reader = new FileReader();
    reader.onload = function (e) {
        img.src = e.target.result;
        img.style.display = 'block';
        img.onload = () => {
            initHeatmap(img.width, img.height);
        };
    };
    reader.readAsDataURL(file);
}

function parseData(text) {
    try {
        if (text.trim().startsWith('[') || text.trim().startsWith('{')) {
            return JSON.parse(text);
        }
        // CSV format x,y,value per line
        return text.trim().split(/\n|\r/).map(line => {
            const [x, y, value] = line.split(',');
            return { x: parseFloat(x), y: parseFloat(y), value: parseFloat(value) };
        });
    } catch (e) {
        alert('Failed to parse data');
        return [];
    }
}

function loadData(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const points = parseData(e.target.result);
        const img = document.getElementById('floorplan-img');
        const width = img.width;
        const height = img.height;
        const data = { max: 100, data: [] };
        points.forEach(p => {
            data.data.push({ x: p.x * width, y: p.y * height, value: p.value });
        });
        heatmapInstance.setData(data);
    };
    reader.readAsText(file);
}

document.getElementById('floorplan-upload').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) loadFloorplan(file);
});

document.getElementById('data-upload').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) loadData(file);
});

// Chat stub
function appendMessage(author, text) {
    const chat = document.getElementById('chat-box');
    const p = document.createElement('p');
    p.textContent = `${author}: ${text}`;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
}

document.getElementById('chat-send').addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    appendMessage('You', msg);
    // Simple canned response
    let response = "I'll look into that.";
    if (msg.toLowerCase().includes('signal')) {
        response = 'Try moving closer to the router or adding an extender.';
    }
    appendMessage('Mike', response);
    input.value = '';
});

document.getElementById('support-btn').addEventListener('click', () => {
    alert('Support request sent to ISP.');
});
