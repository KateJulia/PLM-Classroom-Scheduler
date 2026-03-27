window.addEventListener('load', function() {
    const loader = document.getElementById('loader-wrapper');
    setTimeout(() => { loader.classList.add('loaded'); }, 500); 
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

let currentBuildingCode = "";

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

//UI Generation
function loadRoomsByDate() {
    const grid = document.getElementById('roomGrid');
    if (!grid) return; 
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
            
            floorRow.innerHTML += `
                <div class="room-card">
                    <div class="room-header" style="background-color: #00bc51;">
                        <h3>${currentBuildingCode} ${roomNum}</h3>
                        <span>NO PENDING REQUESTS</span>
                    </div>
                    <div class="room-body">
                        <p style="color: #555; font-size: 0.8rem; margin-bottom: 10px;">Review faculty reservations for this room.</p>
                        <button class="btn-manage" onclick="openAdminModal('${currentBuildingCode} ${roomNum}')">Manage</button>
                    </div>
                </div>`;
        }
        grid.appendChild(floorRow);
    });
}

//Modal
function openAdminModal(room) {
    document.getElementById('adminModalRoomLabel').innerText = room;
    
    //Reservations Data
    const listContainer = document.getElementById('pendingRequestsList');
    listContainer.innerHTML = '<p style="padding: 20px; color: #555; text-align: center; font-style: italic;">[Backend Team: Inject Database Requests Here]</p>';
    
    document.getElementById('adminModal').style.display = 'block';
}

function closeAdminModal() { 
    document.getElementById('adminModal').style.display = 'none'; 
}