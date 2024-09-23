let raw_prefix = "https://raw.githubusercontent.com/Kotlin-for-FRC/frc-kotlin-blocks/refs/heads/main/blocks/";

let filename = window.location.href.split("/").pop().split(".")[0] + ".yml";

let url = raw_prefix + filename;

let codeblocks = document.querySelectorAll(".sd-tab-set.docutils");

let items = 0;

if (codeblocks.length > 0) {
    // Fetch the blocks asynchronously
    fetchBlocks(url).then(blocks => {
        codeblocks.forEach((blockElement, index) => {
            items += blockElement.getElementsByTagName("input").length;

            console.log(blocks);
            let container = createTab(index, items, "kotlin", blocks[index]); 
            while (container.firstChild) {
                blockElement.appendChild(container.firstChild);
            }
        });
    });
}

async function fetchBlocks(url) {
    try {
        const response = await fetch(url);

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();

        // Extract the "block" strings into an array
        const blocks = extractBlocks(data);

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

    const hightlightParentDiv = document.createElement('div');
    hightlightParentDiv.className = 'highlight-' + label + ' notranslate';

    const highlightDiv = document.createElement('div');
    highlightDiv.className = 'highlight';

    const pre = document.createElement('pre');
    pre.id = "codecell" + itemId;
    pre.innerText = code;

    highlightDiv.appendChild(pre);
    hightlightParentDiv.appendChild(highlightDiv);
    contentDiv.appendChild(hightlightParentDiv);
    container.appendChild(input);
    container.appendChild(labelElement);
    container.appendChild(contentDiv);

    return container;
}

function extractBlocks(input) {
    // Regular expression to match blocks that start with 'blockX: |' and capture the content
    const regex = /block\d+: \|\n((?:[\s\S]*?)(?=\n\n|$))/g;
    const result = [];
    let match;

    // Iterate over all matches
    while ((match = regex.exec(input)) !== null) {
        // Split the matched content into lines
        const lines = match[1].split('\n');
        
        // Determine the minimum leading whitespace length
        const minIndentation = lines.reduce((min, line) => {
            const trimmedLine = line.match(/^(\s*)/)[0]; // Get leading whitespace
            return Math.min(min, trimmedLine.length || Infinity);
        }, Infinity);

        // Trim the determined amount of whitespace from each line
        const trimmedLines = lines.map(line => line.slice(minIndentation));

        // Join the lines back together and push to result
        result.push(trimmedLines.join('\n').trim());
    }

    return result;
}

// Example input
const input = `
block1: |
  // Calculates the output of the PID algorithm based on the sensor reading
  // and sends it to a motor
  motor.set(pid.calculate(encoder.distance, setpoint)

block2: |
    // Another block of code
    console.log("Hello, World!");
`;

console.log(extractBlocks(input));
