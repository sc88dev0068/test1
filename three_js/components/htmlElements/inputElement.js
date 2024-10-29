function createInputHTMLElement() { 
    const fileInputDiv = document.createElement("div");
    fileInputDiv.className = "fileInputDiv";
    const fileInput1 = document.createElement("input");
    fileInput1.type = "file";
    fileInput1.id = "fileInpt1";
    fileInput1.accept = ".3dmm";
    fileInput1.multiple = "multiple";
    fileInputDiv.appendChild(fileInput1);

    return fileInputDiv;
    
}

export {createInputHTMLElement}