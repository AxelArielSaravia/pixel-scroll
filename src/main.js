// Axel Ariel Saravia

let ScrollValue = 100; //px

let intervalValue = undefined;
let intervalTime = 200; //ms

const InjectionTarget = {
    tabId: undefined
};

const ScrollInjection = {
    args: [ScrollValue],
    files: undefined,
    target: InjectionTarget,
    func: function (val) {
        window.scrollBy(0, val);
    }
};

function injectScroll() {
    chrome.scripting.executeScript(ScrollInjection);
}

function onpointerupHandler(e) {
    e.stopImmediatePropagation();
    clearInterval(interval);
}

chrome.tabs.query({active: true, currentWindow: true}, function (TabData) {
    if (TabData.length === 0) {
        throw Error("No current tab detected");
    }
    InjectionTarget.tabId = TabData[0].id;
});

window.addEventListener("DOMContentLoaded", function () {
    const DOMInput = document.getElementById("input");
    const DOMUp = document.getElementById("up");
    const DOMDown = document.getElementById("down");

    DOMInput.oninput = function () {
        var value = Number(DOMInput.value);
        if (value < DOMInput.min) {
            DOMInput.value = DOMInput.min;
            ScrollValue = Number(DOMInput.min);
        } else {
            ScrollValue = value;
        }
    }

    DOMUp.onclick = function () {
        ScrollInjection.args[0] = -ScrollValue;
        injectScroll();
    }

    DOMUp.onpointerdown = function () {
        ScrollInjection.args[0] = -ScrollValue;
        interval = setInterval(injectScroll, intervalTime);
    }

    DOMUp.onpointerup = onpointerupHandler;

    DOMDown.onclick = function () {
        ScrollInjection.args[0] = ScrollValue;
        injectScroll();
    }

    DOMDown.onpointerdown = function () {
        ScrollInjection.args[0] = ScrollValue;
        interval = setInterval(injectScroll, intervalTime);
    }

    DOMDown.onpointerup = onpointerupHandler;
});
