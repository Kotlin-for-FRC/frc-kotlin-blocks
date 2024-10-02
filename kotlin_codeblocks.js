const raw_prefix = "https://raw.githubusercontent.com/Kotlin-for-FRC/frc-kotlin-blocks/refs/heads/main/";

const filename = window.location.href.split('docs/')[1].replace('.html', '.yml');

const url = raw_prefix + "blocks/" + filename;

const completed_pages_url = raw_prefix + "completed_pages.json"

const codeblocks = document.querySelectorAll(".sd-tab-set.docutils");

let items = 0;

if (codeblocks.length > 0) {
    // Fetch the blocks asynchronously
    fetchBlocks(url).then(blocks => {
        codeblocks.forEach((blockElement, index) => {
            items += blockElement.getElementsByTagName("input").length;

            console.log(blocks);
            let container = createTab(index, items, "kotlin", highlightKotlinCode(blocks[index])); 
            while (container.firstChild) {
                blockElement.appendChild(container.firstChild);
            }
        });
    });
}

async function fetchBlocks(url) {
    try {
        const completed_pages_response = await fetch(completed_pages_url);
        const response = await fetch(url);

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        } else if (!completed_pages_response.ok) {
            throw new Error(`Error w/ fetching completed pages. Status: ${completed_pages_response.status}`);
        }

        const completed_pages = (await completed_pages_response.json())["completed_pages"];
        const data = await response.text();
        // Extract the "block" strings into an array
        const blocks = extractBlocks(data, completed_pages);

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
    pre.innerHTML = code;

    highlightDiv.appendChild(pre);
    hightlightParentDiv.appendChild(highlightDiv);
    contentDiv.appendChild(hightlightParentDiv);
    container.appendChild(input);
    container.appendChild(labelElement);
    container.appendChild(contentDiv);

    return container;
}

function extractBlocks(input, completed_pages) {
    // Regular expression to match blocks that start with 'blockX: |' and capture the content
    const regex = /block\d+: \|\n((?:[\s\S]*?)(?=\n\n|$))/g;
    const result = [];
    let match;

    // Iterate over all matches
    while ((match = regex.exec(input)) !== null) {
        // Split the matched content into lines
        const lines = match[1].split('\n');

        // Remove the first line's indentation, then trim 2 spaces off all following lines
        let trimmedLines = lines.map((line, index) => {
            if (index === 0) {
                return line.trim(); // No leading spaces on the first line
            }
            return line.startsWith('  ') ? line.slice(2) : line; // Trim extra 2 spaces
        });

        if (!(input in completed_pages)){
            trimmedLines = ["// Notice: the following code is still in java(the kotlin version is yet to be completed)."].concat(trimmedLines);
        }

        // Join the lines back together and push to result
        result.push(trimmedLines.join('\n').trim());
    }

    return result;
}

function highlightKotlinCode(input) {
    const kotlinKeywords = [
        "as", "break", "class", "continue", "do", "else", "false", "for", "fun", 
        "if", "in", "is", "null", "object", "package", "return", "super", 
        "this", "throw", "true", "try", "typealias", "val", "var", "when", 
        "while"
    ];

    // Regex for Kotlin keywords, comments, function calls, and angle brackets
    const keywordRegex = new RegExp(`\\b(${kotlinKeywords.join("|")})\\b`, 'g');
    const commentRegex = /\/\/.*/g;
    const functionCallRegex = /\b\w+(?=\()/g;
    const angleBracketRegex = /[<>]/g;

    // Temporarily replace comments with a placeholder
    let comments = [];
    let highlighted = input.replace(commentRegex, (match) => {
        comments.push(match);
        return `___COMMENT${comments.length - 1}___`;
    });

    // Replace angle brackets
    highlighted = highlighted.replace(angleBracketRegex, (match) => {
        return match === '<' ? `<span>&lt;</span>` : `<span>&gt;</span>`;
    });

    // Replace keywords
    highlighted = highlighted.replace(keywordRegex, (match) => `<span class="kd">${match}</span>`);

    // Replace function calls
    highlighted = highlighted.replace(functionCallRegex, (match) => `<span class="na">${match}</span>`);

    // Restore comments
    highlighted = highlighted.replace(/___COMMENT(\d+)___/g, (match, index) => {
        return `<span class="c1">${comments[index]}</span>`;
    });

    return highlighted;
}


