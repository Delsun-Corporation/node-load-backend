"use strict"

/*
 Get Unique error field name
*/

const uniqueMessage = error => {
    let output;
    try {
        let fieldName = error.message.split(".$")[1];
        field = field.split(" dub key")[0];
        field = field.substring(0, field.lastIndexOf("_"))
        req.flash("errors", [{
            message: "An account with this " + field + "already exists"
        }])

        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + " already exists"
    } catch (err) {
        output = "already exists"
    }
    return output;
}

/*
    Get The Error message from error object
*/

exports.errorHandler = error => {
    let message = "Error saving object";

    if(error.code) {
        switch(error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = "Something went wrong";
        }
    } else {
        for(let errorName in error.errorors) {
            if (error.errorors[errorName].message) {
                message = error.errorors[errorName].message;
            }
        }
    }

    return message;
};