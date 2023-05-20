const links = ["hello", "meow"];
const numbers = [1, 2, 3, 4, 5];

// Get all elements with the "p-for" attribute
const elements = document.querySelectorAll("[p-for]");
elements.forEach((element, iterator, array) => {
    let dataLocal = null;
    let itemToInterpolate = null;
    let localCollection = null;
    const stringAttributeValue = element.getAttribute("p-for");

    // Check if the "p-for" attribute contains " of "
    if (!stringAttributeValue.includes(" of ")) {
        throw new Error("Error: The value of 'p-for' attribute must contain ' of '.");
    }

    try {
        // Split the attribute value using " of " or any symbol except letters, numbers, $, _, .
        const datasAttribute = stringAttributeValue.split(/ of |[^a-zA-Z0-9$_.]+/);
        console.log("[Array ]: " + datasAttribute);

        // Ensure that the attribute value has the correct syntax: "item of items"
        if (datasAttribute.length != 2) {
            throw new Error('Error: Follow the syntax, for example "item of items".');
        }

        itemToInterpolate = datasAttribute[0].trim();
        localCollection = datasAttribute[1].trim();
        let dataVariableName = localCollection.split(".")[0];

        // Check if the localCollection is a valid variable name
        if (isValidVariableName(localCollection)) {
            if (eval(localCollection) == undefined) {
                throw new Error(`Error: Variable ${dataVariableName} does not contain such attribute, please implement the sub-attributes cyclically.`);
            }
            try {
                eval(localCollection);
            } catch (error) {
                throw new Error("Error: The attribute value does not match any variable.");
            }
        } else {
            throw new Error("Error: The attribute value contains disallowed characters for security reasons.");
        }

        dataLocal = eval(localCollection);

        // Ensure that the value of the attribute corresponds to an array variable
        if (!Array.isArray(dataLocal)) {
            throw new Error("Error: The value of the attribute you are looking for does not correspond to an array variable.");
        }

        console.log(dataLocal);
        console.log("Eval check passed.");

        const content = element.innerHTML;
        element.innerHTML = "";

        // Iterate over the dataLocal array and replace the itemToInterpolate in the content
        dataLocal.forEach((item, i) => {
            const updatedContent = content.replace(new RegExp(`{{\\s*${itemToInterpolate}\\s*}}`, 'g'), dataLocal[i]);
            console.log(element);
            element.innerHTML += updatedContent;
        });

        console.log("innerHTML: " + content);
    } catch (error) {
        console.error(error);
    }
});

// Check if a string is a valid variable name
function isValidVariableName(input) {
    var regex = /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/; // Starts with a letter, $, or _
    return regex.test(input);
}

// const stringa = "This is an example of {{ link }} and {{value2}} within double curly braces.";
// const regex = /{{(.*?)}}+/g;
// const results = stringa.match(regex).filter(value => value.includes(itemToInterpolate)).map(value => value.slice(2, -2).trim()); // remove {{ }} and space
// console.log(results);
