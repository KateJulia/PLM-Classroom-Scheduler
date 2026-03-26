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

let currentBuildingCode = "";

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

//Input database here to check reservations
        for(let i=1; i<=3; i++) {
            const roomNum = `${floor}0${i}`;
            const isOccupied = false; 
            if (filter !== 'all' && (isOccupied ? 'occupied' : 'available') !== filter) continue;

            floorRow.innerHTML += `
                <div class="room-card ${isOccupied ? 'occupied' : 'available'}">
                    <div class="room-header">
                        <h3>${currentBuildingCode} ${roomNum}</h3>
                        <span>${isOccupied ? 'CURRENTLY OCCUPIED' : 'CURRENTLY AVAILABLE'}</span>
                    </div>
                    <div class="room-body">
                        <p>Reservations for ${selectedDate}:</p>
                        <p>No reservations</p>
                        </div>
                </div>`;
        }
        grid.appendChild(floorRow);
    });
}