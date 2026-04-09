window.onload = () => {
    renderTable(mockPlantsDatabase);
};

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; 

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center p-8 text-gray-400 font-medium">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</td></tr>`;
        return;
    }

    data.forEach(plant => {
        // 1. สีระดับการดูแล
        let careColor = "";
        if (plant.careLevel.includes("ง่าย")) careColor = "bg-green-100 text-green-700 border-green-200";
        else if (plant.careLevel.includes("ปานกลาง")) careColor = "bg-orange-100 text-orange-700 border-orange-200";
        else if (plant.careLevel.includes("ยาก")) careColor = "bg-red-100 text-red-700 border-red-200";

        // 2. สีและไอคอนแสงแดด
        let sunColor = "", sunIcon = "";
        if (plant.sunlight === "แดดจัด") {
            sunColor = "text-amber-600 bg-amber-50 border-amber-100";
            sunIcon = '<i class="fa-solid fa-sun mr-1"></i>';
        } else if (plant.sunlight === "รำไร") {
            sunColor = "text-yellow-600 bg-yellow-50 border-yellow-100";
            sunIcon = '<i class="fa-solid fa-cloud-sun mr-1"></i>';
        } else if (plant.sunlight === "ในร่ม") {
            sunColor = "text-slate-500 bg-slate-50 border-slate-200";
            sunIcon = '<i class="fa-solid fa-house-chimney-window mr-1"></i>';
        }

        // 3. สีปริมาณน้ำ
        let waterColor = "";
        if (plant.water === "มาก") waterColor = "text-blue-700 bg-blue-50 border-blue-100";
        else if (plant.water === "ปานกลาง") waterColor = "text-sky-600 bg-sky-50 border-sky-100";
        else if (plant.water === "น้อย") waterColor = "text-cyan-600 bg-cyan-50 border-cyan-100";

        // 4. สัญลักษณ์หมวดหมู่
        let catIcon = "";
        if (plant.category === "ไม้ประดับ") catIcon = '<i class="fa-solid fa-leaf mr-1"></i>';
        else if (plant.category === "ผักสวนครัว") catIcon = '<i class="fa-solid fa-carrot mr-1"></i>';
        else if (plant.category === "ไม้มงคล") catIcon = '<i class="fa-solid fa-coins mr-1"></i>';

        tbody.innerHTML += `
            <tr onclick="openModal(${plant.id})" class="hover:bg-green-50 border-b border-gray-100 transition cursor-pointer">
                <td class="p-3 font-mono text-gray-400 text-xs">#${plant.id}</td>
                <td class="p-3 font-bold text-gray-800 underline decoration-green-200 decoration-2 underline-offset-4">${plant.name}</td>
                <td class="p-3">
                    <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold border border-gray-200 uppercase tracking-tighter">
                        ${catIcon} ${plant.category}
                    </span>
                </td>
                <td class="p-3 text-center">
                    <span class="${careColor} px-2 py-1 rounded text-[10px] border font-bold shadow-sm">${plant.careLevel}</span>
                </td>
                <td class="p-3 text-center">
                    <span class="${sunColor} px-2 py-1 rounded text-[10px] border font-bold">${sunIcon} ${plant.sunlight}</span>
                </td>
                <td class="p-3 text-center">
                    <span class="${waterColor} px-2 py-1 rounded text-[10px] border font-bold">${plant.water}</span>
                </td>
            </tr>
        `;
    });
}

function openModal(id) {
    const plant = mockPlantsDatabase.find(p => p.id === id);
    if (!plant) return;

    document.getElementById('modalName').innerText = plant.name;
    document.getElementById('modalImage').src = plant.image || 'https://via.placeholder.com/400x300?text=No+Image';
    document.getElementById('modalCategory').innerText = plant.category;
    document.getElementById('modalCare').innerText = plant.careLevel;
    document.getElementById('modalSun').innerText = plant.sunlight;
    document.getElementById('modalWater').innerText = plant.water;
    document.getElementById('modalDesc').innerText = plant.desc || 'ไม่มีข้อมูลเพิ่มเติม';

    document.getElementById('plantModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('plantModal').classList.add('hidden');
}

window.onclick = function(event) {
    const modal = document.getElementById('plantModal');
    if (event.target == modal) closeModal();
}

function performSearch() {
    const cat = document.getElementById('searchCategory').value;
    const care = document.getElementById('searchCare').value;
    const sun = document.getElementById('searchSunlight').value;
    const water = document.getElementById('searchWater').value;
    const logBox = document.getElementById('logMessage');

    let filtered = mockPlantsDatabase.filter(p => {
        let matchCat = (cat === 'all') ? true : p.category === cat;
        let matchCare = (care === 'all') ? true : p.careLevel === care;
        let matchSun = (sun === 'all') ? true : p.sunlight === sun;
        let matchWater = (water === 'all') ? true : p.water === water;
        return matchCat && matchCare && matchSun && matchWater;
    });

    renderTable(filtered);
    const timestamp = new Date().toLocaleTimeString();
    logBox.innerHTML = `> [${timestamp}] SELECT * FROM plants WHERE filters applied... (Found ${filtered.length} items)`;
}

function resetFilters() {
    document.getElementById('searchCategory').value = 'all';
    document.getElementById('searchCare').value = 'all';
    document.getElementById('searchSunlight').value = 'all';
    document.getElementById('searchWater').value = 'all';
    performSearch();
}