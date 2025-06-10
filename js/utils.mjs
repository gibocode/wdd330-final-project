// Gets data from local storage
export function getLocalStorage(key) {
    const data = localStorage.getItem(key) || {};
    return data;
}

// Sets data to local storage
export function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

// Converts object to JSON format
export function objectToJson(object) {
    return JSON.stringify(object);
}

// Converts JSON to object
export function jsonToObject(json) {
    return JSON.parse(json);
}

// Displays alert message
export function showMessage(message, type = "info") {
    const messageElement = document.querySelector("#message");
    const alertIcon = document.querySelector("#alert-icon")
    const alertMessage = document.querySelector("#alert-message");
    let color = "alert-info";
    let icon = "fa-circle-exclamation";
    if (type == "success") {
        color = "alert-success";
        icon = "fa-circle-check";
    } else if (type == "warning" || type == "error") {
        icon = "fa-triangle-exclamation";
        if (type == "warning") {
            color = "alert-warning";
        } else {
            color = "alert-danger";
        }
    }
    alertIcon.classList.remove("fa-circle-exclamation", "fa-circle-check", "fa-triangle-exclamation");
    alertIcon.classList.add(icon);
    alertMessage.textContent = message;
    messageElement.classList.remove("alert-info", "alert-success", "alert-warning", "alert-danger");
    messageElement.classList.add(color);
    messageElement.classList.remove("hide");
    messageElement.classList.add("show");
}

// Hides alert message
export function hideMessage(messageElement = null) {
    messageElement = messageElement || document.querySelector("#message");
    if (messageElement.classList.contains("show")) {
        messageElement.classList.remove("show");
        messageElement.classList.add("hide");
    }
}

// Toggles check button
export function toggleCheckButton(enable = true) {
    const url = document.querySelector("#url");
    const selectedMeasurementsCount = document.querySelector("#selected-measurements-count");
    const checkButton = document.querySelector("#check-button");
    checkButton.disabled = !enable || url.value == "" || Number(selectedMeasurementsCount.textContent) == 0;
}
