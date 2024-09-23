let raw_prefix = "https://raw.githubusercontent.com/Kotlin-for-FRC/frc-kotlin-blocks/refs/heads/main/blocks/"

let filename = window.location.href.split("/").pop().split(".")[0] + ".json"

let url = raw_prefix + filename

let codeblocks = document.querySelectorAll(".sd-tab-set.docutils")

let items = 0

console.log(codeblocks.length)
console.log(filename)

if(codeblocks.length > 0) {
    let blocks = fetchBlocks(url)
    
    codeblocks.forEach( (blockElement, index) => {
        items += blockElement.getElementsByTagName("input").length

        let block = blocks[index]
        let container = createTab(index, items, "kotlin", "hello world")
        blockElement.appendChild(container)
        console.log(container.innerHTML)
    })
}

async function fetchBlocks(url) {
    try {
        const response = await fetch(url);
        
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract the "block" strings into an array
        const blocks = data.blocks.map(item => item.block);

        return blocks;
    } catch (error) {
        console.error('Error fetching blocks:', error);
        return [];
    }
}


function createTab(setId, itemId, label, code) {
    const container = document.createElement('div');
    
    const input = document.createElement('input');
    input.type = 'radio';
    input.id = "sd-tab-item-" + itemId;
    input.name = "sd-tab-set-" + setId;
    input.checked = true; // Set to true if you want it checked by default

    const labelElement = document.createElement('label');
    labelElement.className = 'sd-tab-label';
    labelElement.setAttribute('data-sync-id', `tabcode-${label.toLowerCase()}`);
    labelElement.setAttribute('for', "sd-tab-item-" + itemId);
    labelElement.textContent = label.toUpperCase();

    const contentDiv = document.createElement('div');
    contentDiv.className = 'sd-tab-content docutils';
    
    const highlightDiv = document.createElement('div');
    highlightDiv.className = 'highlight-' + label + ' notranslate';
    
    const pre = document.createElement('pre');
    pre.innerText = code;

    highlightDiv.appendChild(pre);
    contentDiv.appendChild(highlightDiv);
    container.appendChild(input);
    container.appendChild(labelElement);
    container.appendChild(contentDiv);

    return container;
}