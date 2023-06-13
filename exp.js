const createVariable = (name, object) => {
    window[name] = object;
};

createVariable("ciao", { a: [{ a: "cacchio" }] });
//console.log(eval(ciao));

const variables = Object.keys(window);
//console.log(variables);
variables.forEach(variable => {
    const value = window[variable];
    try {
        //console.log(variable + ':', JSON.stringify(value));
    } catch (error) {
        //console.log(variable + ':', 'Unserializable value');
    }
});

const els = document.querySelectorAll("[p-for]");
const elementsdata = Array.from(els);

const mappingCheck = elementsdata.map((element) => {
    const childDivCount = element.querySelectorAll("[p-for]").length;
    return childDivCount;
})
console.log(mappingCheck);