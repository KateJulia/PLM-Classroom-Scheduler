window.addEventListener('load', function() {
    const loader = document.getElementById('loader-wrapper');
    setTimeout(() => {
        loader.classList.add('loaded');
    }, 500); 
});

//Floors per Building
const buildingData = {
    'GA': { title: 'Gusaling Atienza', floors: [2, 3] },
    'GB': { title: 'Gusaling Bagatsing', floors: [1, 2, 3] },
    'GCA': { title: 'Gusaling Corazon Aquino', floors: [2, 3] },
    'GEE': { title: 'Gusaling Ejercito Estrada', floors: [2, 3] },
    'GK': { title: 'Gusaling Katipunan', floors: [2, 3] },
    'GL': { title: 'Gusaling Lacson', floors: [3, 4, 5, 6] },
    'GV': { title: 'Gusaling Villegas', floors: [2, 3, 4, 5] }
};

let reservations = {}; 
let currentBuildingCode = "";
let selectedRoomKey = "";

//UI Navigation
function showSchedule(code) {
    currentBuildingCode = code;
    document.querySelector('.landmarks-section').style.display = 'none'; 
    document.getElementById('building-content').style.display = 'block';
    document.getElementById('building-title').innerText = `${buildingData[code].title} (${code})`;
    loadRoomsByDate();
    window.scrollTo(0,0);
}

function showMap() {
    document.querySelector('.landmarks-section').style.display = 'block';
    document.getElementById('building-content').style.display = 'none';
}

function loadRoomsByDate() {
    const grid = document.getElementById('roomGrid');
    const selectedDate = document.getElementById('datePicker').value;
    const filter = document.getElementById('roomFilter').value;
    grid.innerHTML = ''; 

    buildingData[currentBuildingCode].floors.forEach(floor => {
        const floorHeader = document.createElement('h3');
        floorHeader.className = 'floor-label';
        floorHeader.innerText = `Floor ${floor}`;
        grid.appendChild(floorHeader);

        const floorRow = document.createElement('div');
        floorRow.className = 'floor-row';
        
        for(let i=1; i<=3; i++) {
            const roomNum = `${floor}0${i}`;
            const roomKey = `${currentBuildingCode}_${roomNum}`;
            const roomRes = (reservations[selectedDate] && reservations[selectedDate][roomKey]) || [];
            const isOccupied = checkStatus(roomRes, selectedDate);
            
            if (filter !== 'all' && (isOccupied ? 'occupied' : 'available') !== filter) continue;

            floorRow.innerHTML += `
                <div class="room-card ${isOccupied ? 'occupied' : 'available'}">
                    <div class="room-header">
                        <h3>${currentBuildingCode} ${roomNum}</h3>
                        <span>${isOccupied ? 'CURRENTLY OCCUPIED' : 'CURRENTLY AVAILABLE'}</span>
                    </div>
                    <div class="room-body">
                        <p>Reservations for ${selectedDate}:</p>
                        ${roomRes.length ? roomRes.map(r => `<p>🕒 ${r}</p>`).join('') : '<p>No reservations</p>'}
                        <button class="btn-schedule" onclick="openModal('${currentBuildingCode} ${roomNum}')">Schedule</button>
                    </div>
                </div>`;
        }
        grid.appendChild(floorRow);
    });
}

function checkStatus(times, selectedDate) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (selectedDate !== today) return false;

    return times.some(range => {
        const [start, end] = range.split(' - ').map(t => parseTime(t));
        return now >= start && now <= end;
    });
}

function parseTime(tStr) {
    const [time, ampm] = tStr.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const d = new Date(); d.setHours(h, m, 0, 0);
    return d;
}

// Modal
function openModal(room) {
    selectedRoomKey = room.replace(" ", "_");
    document.getElementById('modalRoomLabel').innerText = room;
    document.getElementById('modalDateLabel').innerText = "Date: " + document.getElementById('datePicker').value;
    document.getElementById('schedulerModal').style.display = 'block';
}

function closeModal() { document.getElementById('schedulerModal').style.display = 'none'; }

function toggleAMPM(el) {
    const spans = el.querySelectorAll('span');
    spans.forEach(s => s.classList.toggle('active'));
}

//Scrollable time inputs
document.addEventListener('wheel', function(e) {
    if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
        e.preventDefault(); 
        
        let val = parseInt(e.target.value);
        let min = parseInt(e.target.min);
        let max = parseInt(e.target.max);
        let step = parseInt(e.target.step) || 1;

        if (e.deltaY < 0) { // Scroll Up
            val = (val + step > max) ? min : val + step;
        } else {
            val = (val - step < min) ? max : val - step;
        }

        // Minutes with leading zeroes
        e.target.value = e.target.id.includes('M') ? String(val).padStart(2, '0') : val;
    }
}, { passive: false });

function confirmRequest() {
    const surname = document.getElementById('profSurname').value.trim();
    const firstName = document.getElementById('profFirstName').value.trim();
    const idNo = document.getElementById('profID').value.trim();
    const date = document.getElementById('datePicker').value;

    // Check if fields are empty
    if (!surname || !firstName || !idNo) {
        alert("Action Denied: Please provide the Professor's Surname, First Name, and PLM ID No.");
        return; // Stop the function here
    }

    // Capture Time
    const startH = document.getElementById('startH').value;
    const startM = document.getElementById('startM').value.padStart(2, '0');
    const startAP = document.querySelectorAll('.ampm-group span.active')[0].innerText;
    
    const endH = document.getElementById('endH').value;
    const endM = document.getElementById('endM').value.padStart(2, '0');
    const endAP = document.querySelectorAll('.ampm-group span.active')[1].innerText;

    const resEntry = `${startH}:${startM} ${startAP} - ${endH}:${endM} ${endAP} (Prof. ${surname})`;
    
    if (!reservations[date]) reservations[date] = {};
    if (!reservations[date][selectedRoomKey]) reservations[date][selectedRoomKey] = [];
    
    reservations[date][selectedRoomKey].push(resEntry);
    
    closeModal();
    document.getElementById('schedulerSuccessOverlay').style.display = 'flex'; 
    
    loadRoomsByDate();
}

function closeSchedulerSuccess() {
    document.getElementById('schedulerSuccessOverlay').style.display = 'none';
    
    // Clears inputs if refreshed
    document.getElementById('profSurname').value = '';
    document.getElementById('profFirstName').value = '';
    document.getElementById('profID').value = '';
}