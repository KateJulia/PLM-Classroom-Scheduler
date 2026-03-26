window.addEventListener('load', function() {
    const loader = document.getElementById('loader-wrapper');
    setTimeout(() => { loader.classList.add('loaded'); }, 1000); 
});

const buildingData = {

    'GA': { title: 'Gusaling Atienza', floors: [2, 3] },
    'GB': { title: 'Gusaling Bagatsing', floors: [1, 2, 3] },
    'GCA': { title: 'Gusaling Corazon Aquino', floors: [2, 3] },
    'GEE': { title: 'Gusaling Ejercito Estrada', floors: [2, 3] },
    'GK': { title: 'Gusaling Katipunan', floors: [2, 3] },
    'GL': { title: 'Gusaling Lacson', floors: [3, 4, 5, 6] },
    'GV': { title: 'Gusaling Villegas', floors: [2, 3, 4, 5] }

};

let pendingRequests = JSON.parse(localStorage.getItem('plm_reservations')) || {};
let currentBuildingCode = "";let currentManageRoom = "";function showSchedule(code) {
    currentBuildingCode = code;
    document.querySelector('.landmarks-section').style.display = 'none'; 
    document.getElementById('building-content').style.display = 'block';
    document.getElementById('building-title').innerText = `${buildingData[code].title} (${code})`;
    loadRoomsByDate();
    window.scrollTo(0,0);

//Di ko talaga alam 'to omg pacheck nalang nung mga javascript!! Nilagay ko lang para makita ano itsura nung Scheduler T-T

}function showMap() {
    document.querySelector('.landmarks-section').style.display = 'block';
    document.getElementById('building-content').style.display = 'none';

}function loadRoomsByDate() {
    const grid = document.getElementById('roomGrid');
    grid.innerHTML = ''; 

    // We check the date selected
    const selectedDate = document.getElementById('datePicker').value;

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
            // Check database for this specific date AND room
            const dailyRequests = (pendingRequests[selectedDate] && pendingRequests[selectedDate][roomKey]) 
                                  ? pendingRequests[selectedDate][roomKey] 
                                  : [];

            const reqCount = dailyRequests.length;
            // UI Logic: Only if reqCount > 0 do we show Gold and "PENDING"
            const headerColor = reqCount > 0 ? 'background-color: #b18c00;' : 'background-color: #00bc51;';
            const statusText = reqCount > 0 ? `${reqCount} PENDING REQUEST(S)` : `NO PENDING REQUESTS`;
            const borderStyle = reqCount > 0 ? 'border: 2px solid #b18c00;' : '';

            floorRow.innerHTML += `
                <div class="room-card" style="${borderStyle}">
                    <div class="room-header" style="${headerColor}">
                        <h3>${currentBuildingCode} ${roomNum}</h3>
                        <span>${statusText}</span>
                    </div>

                    <div class="room-body">
                        <p style="color: #555; font-size: 0.8rem; margin-bottom: 10px;">Review faculty reservations for this room.</p>
                        <button class="btn-manage" onclick="openAdminModal('${currentBuildingCode} ${roomNum}')">Manage</button>
                    </div>
                </div>`;
        }
        grid.appendChild(floorRow);
    });

}function openAdminModal(room) {
    currentManageRoom = room.replace(" ", "_");

    const selectedDate = document.getElementById('datePicker').value;
    document.getElementById('adminModalRoomLabel').innerText = room;

    const listContainer = document.getElementById('pendingRequestsList');
    listContainer.innerHTML = ''; 

    const requests = (pendingRequests[selectedDate] && pendingRequests[selectedDate][currentManageRoom]) 
                      ? pendingRequests[selectedDate][currentManageRoom] 
                      : [];

    if (requests.length === 0) {
        listContainer.innerHTML = '<p style="padding: 20px; color: #555; text-align: center; font-style: italic;">No pending requests for this room at the moment.</p>';
    } else {

        requests.forEach((req, index) => {
            listContainer.innerHTML += `

                <div class="request-item">
                    <div class="req-details">
                        <strong>${req.prof || "Professor"}</strong>
                        <span>🕒 ${req.time || req}</span>
                    </div>

                    <div class="req-actions">
                        <button class="approve-btn" title="Approve" onclick="handleAction(${index}, 'Approved')">&#10004;</button>
                        <button class="remove-btn" title="Remove" onclick="handleAction(${index}, 'Removed')">&#10006;</button>
                    </div>
                </div>
            `;
        });
    }

    document.getElementById('adminModal').style.display = 'block';
}function closeAdminModal() { 
    document.getElementById('adminModal').style.display = 'none'; 
}function handleAction(index, status) {

    const selectedDate = document.getElementById('datePicker').value;

    // 1. Remove specific request from the array
    pendingRequests[selectedDate][currentManageRoom].splice(index, 1);

    // 2. Update LocalStorage so it "saves" the change
    localStorage.setItem('plm_reservations', JSON.stringify(pendingRequests));

    alert(`Request successfully ${status}!`);

    // 3. Refresh UI
    openAdminModal(document.getElementById('adminModalRoomLabel').innerText); 

    loadRoomsByDate(); 

}