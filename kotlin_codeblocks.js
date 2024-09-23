let filename = window.location.href.split("/").pop().split(".")[0] + ".json"

let codeblocks = document.querySelectorAll(".sd-tab-set.docutils")

console.log(codeblocks.length)
console.log(filename)