// Item data with image paths and labels
const itemData = {
    photoframes: [
        { id: 'pf1', label: 'Vintage gold frame', image: 'images/photoframes/Untitled6_20260614094131.png' },
        { id: 'pf2', label: 'Colourful large frame', image: 'images/photoframes/Untitled6_20260614094625.png' },
        { id: 'pf3', label: 'Silver frame', image: 'images/photoframes/Untitled6_20260614094737.png' },
        { id: 'pf4', label: 'Colorful painted frame', image: 'images/photoframes/Untitled6_20260614094819.png' }
    ],
    marigolds: [
        { id: 'mg1', label: 'Bright Yellow Bunch', image: 'images/marigolds/Untitled6_20260614100725.png' },
        { id: 'mg2', label: 'Orange Petals', image: 'images/marigolds/Untitled6_20260614100754.png' },
        { id: 'mg3', label: 'Dark orange petals', image: 'images/marigolds/Untitled6_20260614100804.png' }
    ],
    calaveras: [
        { id: 'cv1', label: 'Heart-eyed calavera', image: 'images/calaveras/Untitled2_20260611215113.png' },
        { id: 'cv2', label: 'Orange flower-eyed calavera', image: 'images/calaveras/Untitled2_20260612095904.png' },
        { id: 'cv3', label: 'Purple flowered calavera', image: 'images/calaveras/Untitled2_20260613141754.png' },
        { id: 'cv4', label: 'Colourful white calavera', image: 'images/calaveras/Untitled3_20260611214739.png' },
        { id: 'cv5', label: 'Dark calavera', image: 'images/calaveras/Untitled5_20260611215412.png' }
    ],
    'paper-decorations': [
        { id: 'pd1', label: 'Papel Picado 1', image: 'images/paper-decorations/Untitled6_20260613210009.png' },
        { id: 'pd2', label: 'Papel Picado 2', image: 'images/paper-decorations/Untitled6_20260613210943.png' },
        { id: 'pd3', label: 'Papel Picado 3', image: 'images/paper-decorations/Untitled6_20260613211234.png' },
        { id: 'pd4', label: 'Papel Picado 4', image: 'images/paper-decorations/Untitled6_20260613211502.png' }
    ],
    water: [
        { id: 'wt1', label: 'Crystal Glass', image: 'images/water/Untitled6_20260613212307.png' },
        { id: 'wt2', label: 'Wine', image: 'images/water/Untitled6_20260613213012.png' }
    ],
    food: [
        { id: 'fd1', label: 'Pan de Muerto', image: 'images/food/Untitled2_20260613151112.png' },
        { id: 'fd2', label: 'Tamales Plate', image: 'images/food/Untitled2_20260613174408.png' },
        { id: 'fd3', label: 'Large fruit bowl', image: 'images/food/Untitled2_20260613184537.png' },
        { id: 'fd4', label: 'Small fruit bowl', image: 'images/food/Untitled6_20260613184933.png' }
    ],
    candles: [
        { id: 'cd1', label: 'Large carmine candle', image: 'images/candles/Untitled6_20260613195846.png' },
        { id: 'cd2', label: 'Small green candle', image: 'images/candles/Untitled6_20260613200051.png' },
        { id: 'cd3', label: 'Small blue candle', image: 'images/candles/Untitled6_20260613200806.png' },
        { id: 'cd4', label: 'Large purple candle', image: 'images/candles/Untitled6_20260613201449.png' }
    ]
};

let draggedElement = null;
let draggedItem = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeCategories();
    initializeDragAndDrop();
    initializeClearButton();
    initializeSizeControls();
});

// Category header click handler
function initializeCategories() {
    const headers = document.querySelectorAll('.category-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const category = header.getAttribute('data-category');
            const optionsId = `${category}-options`;
            const optionsElement = document.getElementById(optionsId);
            
            // Toggle the options display
            optionsElement.classList.toggle('hidden');
            
            // Update the expanded attribute for icon rotation
            const isExpanded = !optionsElement.classList.contains('hidden');
            header.setAttribute('data-expanded', isExpanded);
        });
    });
}

// Initialize drag and drop functionality
function initializeDragAndDrop() {
    const ofrenda = document.getElementById('ofrenda');
    const dropZone = document.getElementById('drop-zone');

    setupMenuDragListeners();

    const addDragState = (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        ofrenda.classList.add('drag-over');
        dropZone.classList.add('drag-over');
    };

    const removeDragState = () => {
        ofrenda.classList.remove('drag-over');
        dropZone.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        removeDragState();

        const item = parseDraggedItem(e);
        if (!item) return;

        const rect = ofrenda.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        addItemToOfrenda(item, x, y);
        draggedItem = null;
    };

    [ofrenda, dropZone].forEach((target) => {
        target.addEventListener('dragover', addDragState);
        target.addEventListener('dragleave', removeDragState);
        target.addEventListener('drop', handleDrop);
    });
}

function parseDraggedItem(e) {
    try {
        const json = e.dataTransfer.getData('application/json');
        if (json) {
            const parsed = JSON.parse(json);
            if (parsed && parsed.type && parsed.id) return parsed;
        }
    } catch (err) {
        // ignore invalid JSON
    }

    try {
        const text = e.dataTransfer.getData('text/plain');
        if (text) {
            const parsed = JSON.parse(text);
            if (parsed && parsed.type && parsed.id) return parsed;
        }
    } catch (err) {
        // ignore invalid JSON
    }

    return draggedItem || null;
}

function setupMenuDragListeners() {
    const draggables = document.querySelectorAll('.option-item');

    draggables.forEach((item) => {
        item.draggable = true;

        item.addEventListener('dragstart', (e) => {
            const type = item.getAttribute('data-type');
            const id = item.getAttribute('data-id');

            if (!type || !id) return;

            draggedItem = { type, id };
            item.classList.add('dragging');

            e.dataTransfer.setData('application/json', JSON.stringify({ type, id }));
            e.dataTransfer.setData('text/plain', JSON.stringify({ type, id }));
            e.dataTransfer.effectAllowed = 'copy';
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });
}

// Add item to ofrenda
function addItemToOfrenda(item, x, y, randomPosition = false) {
    const ofrenda = document.getElementById('ofrenda');
    const dropZone = document.getElementById('drop-zone');
    
    // Find item data
    const itemInfo = findItemInfo(item.type, item.id);
    if (!itemInfo) return;
    
    // Create item element
    const itemElement = document.createElement('div');
    itemElement.className = 'ofrenda-item';
    
    // Generate unique ID for this instance
    const instanceId = `${item.id}-${Date.now()}`;
    itemElement.setAttribute('data-instance-id', instanceId);
    itemElement.setAttribute('data-type', item.type);
    
    // Base height is 320px, only allow placement in bottom 320px area
    const baseHeight = 320;
    
    // Determine position
    let posX = x;
    let posY = y;
    
    if (randomPosition) {
        const maxX = ofrenda.clientWidth - 200;
        const maxY = ofrenda.clientHeight - 80;
        posX = Math.random() * Math.max(maxX, 50);
        posY = Math.random() * Math.max(maxY, 50);
    }
    
    // Constrain to container
    posX = Math.max(0, Math.min(posX, ofrenda.clientWidth - 200));
    posY = Math.max(0, Math.min(posY, ofrenda.clientHeight - 80));
    
    itemElement.style.left = `${posX}px`;
    itemElement.style.top = `${posY}px`;
    
    // Create image directly
    const img = document.createElement('img');
    img.src = itemInfo.image;
    img.alt = itemInfo.label;

    let size = 130;
    if (item.type === 'calaveras') {
        size = 60;
    } else if (item.type === 'candles') {
        size = 70;
    } else if (item.type === 'food' && item.id === 'fd2') {
        size = 90;
    } else if (item.type === 'photoframes' || item.type === 'food') {
        size = 160;
    }

    img.style.width = `${size}px`;
    img.style.height = `${size}px`;
    img.style.objectFit = 'contain';
    img.style.objectPosition = 'center';
    
    itemElement.appendChild(img);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'ofrenda-item-remove';
    removeBtn.type = 'button';
    removeBtn.setAttribute('aria-label', 'Remove item');
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        itemElement.remove();

        if (!ofrenda.querySelector('.ofrenda-item')) {
            dropZone.classList.remove('has-items');
        }
    });
    itemElement.appendChild(removeBtn);
    
    // Add to ofrenda
    ofrenda.appendChild(itemElement);
    
    // Hide drop zone message if there are items
    if (ofrenda.querySelectorAll('.ofrenda-item').length > 0) {
        dropZone.classList.add('has-items');
    }
    
    // Make item draggable within ofrenda
    makeOrendaItemDraggable(itemElement);
}

// Find item info from itemData
function findItemInfo(type, id) {
    const category = itemData[type];
    if (!category) return null;
    
    // Search by id
    const item = category.find(item => item.id === id);
    return item || null;
}

// Make ofrenda items draggable
function makeOrendaItemDraggable(element) {
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    
    element.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('ofrenda-item-remove')) return;
        
        isDragging = true;
        element.classList.add('dragging');
        
        const rect = element.getBoundingClientRect();
        const orendaRect = document.getElementById('ofrenda').getBoundingClientRect();
        
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
        
        element.style.zIndex = '999';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const ofrenda = document.getElementById('ofrenda');
        const orendaRect = ofrenda.getBoundingClientRect();
        
        let x = e.clientX - orendaRect.left - offset.x;
        let y = e.clientY - orendaRect.top - offset.y;
        
        // Constrain to container
        x = Math.max(0, Math.min(x, ofrenda.clientWidth - element.offsetWidth));
        y = Math.max(0, Math.min(y, ofrenda.clientHeight - element.offsetHeight));
        
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.classList.remove('dragging');
            element.style.zIndex = 'auto';
        }
    });
}

// Clear button functionality
function initializeClearButton() {
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.addEventListener('click', () => {
        const ofrenda = document.getElementById('ofrenda');
        const dropZone = document.getElementById('drop-zone');
        
        // Remove all items
        const items = ofrenda.querySelectorAll('.ofrenda-item');
        items.forEach(item => item.remove());
        
        // Show drop zone message
        dropZone.classList.remove('has-items');
    });
}

function initializeSizeControls() {
    const sizeSlider = document.getElementById('size-slider');
    const sizeValueLabel = document.getElementById('size-value');
    const rotateSlider = document.getElementById('rotate-slider');
    const rotateValueLabel = document.getElementById('rotate-value');

    if (!sizeSlider || !sizeValueLabel || !rotateSlider || !rotateValueLabel) return;

    const updateSelectedItem = () => {
        const selected = document.querySelector('.ofrenda-item.selected');
        if (!selected) return;

        const img = selected.querySelector('img');
        if (!img) return;

        img.style.width = `${sizeSlider.value}px`;
        img.style.height = `${sizeSlider.value}px`;
        sizeValueLabel.textContent = `${sizeSlider.value}px`;

        const rotation = rotateSlider.value;
        img.style.transform = `rotate(${rotation}deg)`;
        rotateValueLabel.textContent = `${rotation}°`;
    };

    sizeSlider.addEventListener('input', updateSelectedItem);
    rotateSlider.addEventListener('input', updateSelectedItem);

    document.getElementById('ofrenda').addEventListener('click', (e) => {
        const item = e.target.closest('.ofrenda-item');
        document.querySelectorAll('.ofrenda-item').forEach(el => el.classList.remove('selected'));

        if (item) {
            item.classList.add('selected');
            const img = item.querySelector('img');
            if (img) {
                const currentSize = img.style.width || '130px';
                sizeSlider.value = currentSize.replace('px', '');
                sizeValueLabel.textContent = `${sizeSlider.value}px`;

                const currentRotation = img.style.transform.match(/rotate\(([-\d.]+)deg\)/);
                const rotationValue = currentRotation ? currentRotation[1] : '0';
                rotateSlider.value = rotationValue;
                rotateValueLabel.textContent = `${rotationValue}°`;
            }
        }
    });
}
