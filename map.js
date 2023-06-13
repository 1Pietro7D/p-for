const nodecontent = document.querySelector("body"); // Seleziona il contenuto del nodo "body"
const childNodes = Array.from(nodecontent.childNodes); // Converti i sotto-nodi del contenuto del nodo in un array


// creazione dell'albero del dom per i p-for
const nodesTree = childNodes
    .filter((node) => node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('p-for'))
    .map((node) => createSubNodesTree(node));
//const nodesTree = [];
// Itera sui sotto-nodi per trovare i p-for
// childNodes.forEach((node) => {
//     if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('p-for')) {
//         const tree = createSubNodesTree(node); // Crea l'albero dei sotto-nodi
//         nodesTree.push(tree); // Aggiungi l'albero dei sotto-nodi all'array padre
//     }
// });

console.log("nodesTree");
console.log(nodesTree);



// Funzione ricorsiva per creare l'albero dei sotto-nodi
function createSubNodesTree(node) {
    const childNodes = Array.from(node.childNodes); // Converti i sotto-nodi in un array
    console.log(node);
    let subNodes = [];

    childNodes.forEach((subNode) => {
        if (subNode.nodeType === Node.ELEMENT_NODE && subNode.hasAttribute('p-for')) {
            const subTree = createSubNodesTree(subNode); // Chiamata ricorsiva per creare l'albero dei sotto-nodi
            subNodes.push(subTree); // Aggiungi il sotto-albero all'array dei sotto-nodi
        }
    });

    return {
        'tagName': node.tagName, // Nome del tag del nodo
        'p-for': node.getAttribute("p-for"), // Attributi del nodo
        'attributes': getAttributes(node),
        'childNodes': subNodes // Array dei sotto-nodi
    };
}


// Funzione per ottenere gli attributi del nodo
function getAttributes(node) {
    const attributes = Array.from(node.attributes); // Converti gli attributi in un array
    const attributeMap = {};
    attributes.forEach((attr) => {
        attributeMap[attr.name] = attr.value; // Aggiungi l'attributo alla mappa degli attributi
    });
    return attributeMap;
}
