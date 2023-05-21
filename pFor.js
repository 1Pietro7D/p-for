const elements = document.querySelectorAll("[p-for]");
elements.forEach((element, iterator, array) => {
    let dataLocal = null;
    let itemToInterpolate = null;
    let localCollection = null;
    const regex = /{{(.*?)}}+/g;
    const stringAttributeValue = element.getAttribute("p-for");

    // Check if the "p-for" attribute contains " of "
    if (!stringAttributeValue.includes(" of ")) {
        throw new Error("Error: The value of 'p-for' attribute must contain ' of '.");
    }

    try {
        // Split the attribute value using " of " or any symbol except letters, numbers, $, _, .
        const datasAttribute = stringAttributeValue.split(/ of |[^a-zA-Z0-9$_.]+/);
        //console.log("[Array ]: " + datasAttribute);

        // Ensure that the attribute value has the correct syntax: "item of items"
        if (datasAttribute.length != 2) {
            throw new Error('Error: Follow the syntax, for example "item of items".');
        }

        itemToInterpolate = datasAttribute[0].trim();
        if (itemToInterpolate == "") {
            throw new Error(`Error: you can't leave empty the name of the value to iterate`);
        }
        localCollection = datasAttribute[1].trim();
        if (localCollection == "") {
            throw new Error(`Error: you can't leave empty the name of Collections`);
        }


        if (isValidVariableName(itemToInterpolate) && itemToInterpolate.split(".").length > 1) {
            throw new Error(`Error: name for the value to interpolate incorrect, enter a valid name without".", in case you can use for interpolate item, es: item of items -> {{ item.id }}`);
        }


        // Check if the localCollection is a valid variable name
        if (isValidVariableName(localCollection)) {
            try {
                if (eval(localCollection) == undefined) {
                    throw new Error(`Error: Variable ${localCollection.split(".")[0]} does not contain such attribute, please implement the sub-attributes cyclically.`);
                }
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

        //console.log(dataLocal);
        console.log("Eval check passed.");

        const content = element.innerHTML;
        element.innerHTML = "";

        // Iterate over the dataLocal array and replace the itemToInterpolate in the content
        dataLocal.forEach((item, i) => {
            const myAttributes = content
                .match(regex)
                .filter(value => value.includes(itemToInterpolate))
                .filter(value => value.slice(2, -2).trim().split(".")[0] == itemToInterpolate)
                .map(value => {
                    const processedValue = value.slice(2, -2).trim().replace(itemToInterpolate, "");
                    if (processedValue != "") {
                        const subProcessedValue = processedValue.substring(1);
                        if (processedValue.startsWith(".") && isValidVariableName(subProcessedValue)) {
                            return processedValue;
                        } else {
                            throw new Error('Invalid value: ' + processedValue);
                        }
                    }
                });

            console.log(myAttributes);
            console.log("eval test");

            const updatedContent = content.replace(new RegExp(`{{\\s*${itemToInterpolate}(.*?)\\s*}}`, "g"), (match) => {
                console.log(match);
                if (myAttributes.length > 0) {
                    let myAttr = myAttributes.shift() || "";
                    console.log(myAttr);
                    if (myAttr != "") {
                        try {
                            console.log(eval(`dataLocal[${i}]${myAttr}`) != undefined ? typeof (eval(`dataLocal[${i}]${myAttr}`)) == typeof (Object) ? "not undefined and object" : "not undefined but not object" : "undefined and error");
                            return eval(`dataLocal[${i}]${myAttr}`) != undefined ? typeof eval(`dataLocal[${i}]${myAttr}`) === "object" ? JSON.stringify(eval(`dataLocal[${i}]${myAttr}`)) : eval(`dataLocal[${i}]${myAttr}`) : error
                        } catch (error) {
                            throw new Error('Undefined value: ' + myAttr);
                        }
                    }
                    else
                        return typeof eval(`dataLocal[${i}]${myAttr}`) === "object" ? JSON.stringify(eval(`dataLocal[${i}]`)) : eval(`dataLocal[${i}]`);
                    //  return JSON.stringify(eval(`dataLocal[${i}]`)); // you don't need to check if it's an object for JSON.stringify but the output will be enclosed in "quotes" if a string


                } else {
                    return match; // Keep the original match if myAttributes is empty
                }
            });

            element.innerHTML += updatedContent

        });


    } catch (error) {
        console.error(error);
    }


});

// Check if a string is a valid variable name
function isValidVariableName(input) {
    var regex = /^[a-zA-Z_$][a-zA-Z0-9_$.]*$/; // Starts with a letter, $, or _
    return regex.test(input);
}
