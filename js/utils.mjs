import Insights from "./services/insights.mjs";

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

// Measure insights
export async function measure(url, categories) {
    const insights = new Insights(url, categories);
    const success = await insights.run();
    let categoryData = {};
    if (success) {
        categories.forEach(category => {
            categoryData[category] = {
                score: insights.getScore(category),
                audits: insights.getAuditDetails(category)
            }
        });
    }
    return categoryData;
}

// Shows score
export function showScoreDetails(score, category, audits) {
    const elem = document.querySelector(`#${category}`);
    elem.querySelector(".spinner-container").classList.remove("show");
    elem.querySelector(".spinner-container").classList.add("hide");
    elem.querySelector(".score").classList.remove("hide");
    const progress = elem.querySelector('.progress');
    const progressBar = elem.querySelector('.progress-bar');
    const scoreElem = document.querySelector(`#${category}-score`);
    const collapseElem = elem.querySelector(`#${category}-results`);
    let percentage = score;
    let percent = 0;
    const runPercent = setInterval(() => {
        percent++;
        scoreElem.textContent = `${percent}%`;
        if (percent >= percentage) {
            clearInterval(runPercent);
        }
    }, 1);
    progress.ariaValueNow = percentage;
    progressBar.style.width = `${percentage}%`;
    const textColor = getColor(percentage, "text");
    const bgColor = getColor(percentage)
    const collapseColor = getColor(percentage, "bg", true);
    scoreElem.classList.remove("text-secondary", "text-danger", "text-warning", "text-success");
    scoreElem.classList.add(textColor);
    progressBar.classList.remove("bg-secondary", "bg-danger", "bg-warning", "bg-success");
    progressBar.classList.add(bgColor);
    collapseElem.classList.remove("bg-secondary-light", "bg-danger-light", "bg-warning-light", "bg-success-light");
    collapseElem.classList.add(collapseColor);
    // collapseElem.classList.remove("hide");
    // collapseElem.classList.add("show");
    const auditDetails = collapseElem.querySelector("div");
    auditDetails.innerHTML = "";
    let details = document.createElement("ul");
    audits.forEach(audit => {
        const auditItem = document.createElement("li");
        const item = document.createElement("span");
        const icon = document.createElement("span");
        item.textContent = `${audit.title}:`;
        item.classList.add("me-2");
        icon.innerHTML = audit.score.toFixed(0);
        icon.classList.add("fw-bold")
        auditItem.appendChild(item);
        auditItem.appendChild(icon);
        details.appendChild(auditItem);
    });
    auditDetails.appendChild(details);
}

// Gets color based on score
function getColor(score, type = "bg", light = false) {
    let color = type;
    if (score <= 49) {
        color += "-danger";
    } else if (score >= 50 && score <= 89) {
        color += "-warning";
    } else if (score >= 90) {
        color += "-success";
    }
    else {
        color += "-secondary";
    }
    if (light) {
        color += "-light";
    }
    return color;
}

// Show results
export function showResults(selectedMeasurements) {
    const resultElems = document.querySelectorAll(".results");
    resultElems.forEach(resultElem => {
        resultElem.classList.remove("show");
        resultElem.classList.add("hide");
    });
    selectedMeasurements.forEach(selectedMeasurement => {
        if (selectedMeasurement.checked) {
            const measurement = selectedMeasurement.value;
            let result = "pagespeed-insights";
            if (measurement == "html" || measurement == "css") {
                result = measurement;
            }
            const resultElem = document.querySelector(`#${result}-results`);
            resultElem.classList.remove("hide");
            resultElem.classList.add("show");
        }
    });
}

// Checks if pagespeed insights is visible
export function hasPagespeedInsights() {
    const pagespeedInsightsResults = document.querySelector("#pagespeed-insights-results");
    return pagespeedInsightsResults.classList.contains("show");
}

// Gets selected categories from pagespeed insights measurement
export function getSelectedCategories(selectedMeasurements) {
    let categories = [];
    selectedMeasurements.forEach(selectedMeasurement => {
        if (selectedMeasurement.checked) {
            const category = selectedMeasurement.value;
            if (category != "html" && category != "css") {
                categories.push(category);
            }
        }
    });
    return categories;
}

// Show pagespeed insights
export function showPagespeedInsights(categories) {
    const pagespeedInsightsResults = document.querySelector("#pagespeed-insights-results");
    if (categories.length > 0) {
        pagespeedInsightsResults.classList.remove("hide");
        pagespeedInsightsResults.classList.add("show");
    } else {
        pagespeedInsightsResults.classList.remove("show");
        pagespeedInsightsResults.classList.add("hide");
    }
}

// Show specific pagespeed insight results
export function showSelectedPagespeedInsights(categories) {
    const categoryElems = document.querySelectorAll(".category-result");
    categoryElems.forEach(categoryElem => {
        categoryElem.classList.remove("show");
        categoryElem.classList.add("hide");
        const spinnerContainer = categoryElem.querySelector(".spinner-container");
        spinnerContainer.classList.remove("show");
        spinnerContainer.classList.add("hide");
    });
    if (categories.length > 0) {
        categories.forEach(category => {
            const categoryElem = document.querySelector(`#${category}`);
            const spinnerContainer = categoryElem.querySelector(".spinner-container");
            const score = categoryElem.querySelector(".score");
            const progressBar = categoryElem.querySelector(".progress-bar");

            categoryElem.classList.remove("hide");
            categoryElem.classList.add("show");
            spinnerContainer.classList.remove("hide");
            spinnerContainer.classList.add("show");
            score.classList.remove("show");
            score.classList.add("hide");
            progressBar.style.width = "0%";
            progressBar.classList.remove("bg-secondary", "bg-success", "bg-warning", "bg-danger");
            progressBar.classList.add("bg-secondary");
        });
    }
}
