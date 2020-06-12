const buttons = {
    resize: undefined,
    move: undefined,
    setTitle: undefined,
    setFrameColor: undefined,
    zoomIn: undefined,
    zoomOut: undefined,
    resetZoom: undefined,
    tabHeader: undefined,
    getTabIDs: undefined,
    attachTab: undefined,
    detachTab: undefined,
};

const inputs = {
    resize: {
        width: undefined,
        height: undefined,
    },
    move: {
        top: undefined,
        left: undefined
    },
    title: undefined,
    frameColor: undefined,
    tabID: undefined
};

let tabIDsContainer;
let invalidInputAlert;

let myWindow;

/** SET UP THE APPLICATION **/
window.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
    getDOMElements();

    // Initialize the Glue42 library.
    await initializeGlue42()
        .catch(error => { 
            console.error(error); 
            return 
        });

    // Reference to this window.
    myWindow = glue.windows.my();

    // Button handlers.
    const handlers = {
        resizeWindow: resizeWindow,
        moveWindow: moveWindow,
        setWindowTitle: setWindowTitle,
        setWindowFrameColor: setWindowFrameColor,
        zoomIn: myWindow.zoomIn,
        zoomOut: myWindow.zoomOut,
        resetZoom: resetZoom,
        setTabHeaderVisibility: setTabHeaderVisibility,
        getTabIDs: getTabIDs,
        attachTabToWindow: attachTabToWindow,
        detachTabFromWindow: detachTabFromWindow
    };

    attachEventHandlers(handlers);
};

/** INITIALIZE GLUE42 **/
async function initializeGlue42() {
    window.glue = await Glue();
};

/** EVENT HANDLERS **/
function resizeWindow() {
    const width = inputs.resize.width.value;
    const height = inputs.resize.height.value;

    // Resizing the current window.
    myWindow.resizeTo(width, height);

    inputs.resize.width.value = "";
    inputs.resize.height.value = "";
};

function moveWindow() {
    const top = inputs.move.top.value;
    const left = inputs.move.left.value;

    // Moving the current window.
    myWindow.moveTo(top, left);

    inputs.move.top.value = "";
    inputs.move.left.value = "";
};

function setWindowTitle() {
    const title = inputs.title.value;

    if (title !== "") {

        // Changing the title of the current window.
        myWindow.setTitle(title);

        inputs.title.value = "";
    } else {
        const message = "You must enter a title first!";
        showAlert(message);
    };
};

function setWindowFrameColor() {
    const frameColor = inputs.frameColor.value;

    if(frameColor !== "") {

        // Changing the frame color of the current window.
        myWindow.setFrameColor(frameColor)
            .catch(() => {
                const message = `The value "${frameColor}" is not a valid color!`;
                showAlert(message);
                return;
            });

        inputs.frameColor.value = "";
    } else {
        const message = "You must enter a color name or color code first!"
        showAlert(message);
    }
};

function resetZoom() {

    // Change the zoom factor of the current window to a specific value.
    myWindow.setZoomFactor(100);
};

function setTabHeaderVisibility() {
    // Check whether the tab header is visible.
    if (myWindow.isTabHeaderVisible) {
        // Toggle the tab header visibility of the current window.
        myWindow.setTabHeaderVisible(false);
    } else {
        myWindow.setTabHeaderVisible(true);
    };
};

function getTabIDs() {
    // Get all Glue42 windows.
    const tabIDs = glue.windows.list()
        .reduce(extractTabIDs, []);

    const formattedOutput = tabIDs.join(", ");
    tabIDsContainer.innerText = formattedOutput;
};

function extractTabIDs(tabIDs, window) {
    // Filter all tab windows excluding the current window.
    if (window.mode === "tab" && window.id !== myWindow.id) {
        tabIDs.push(window.id);
    };
    return tabIDs;
};

function attachTabToWindow() {
    const tabID = inputs.tabID.value;

    if (tabID !== "") {
        // Find a window by ID.
        const tab = glue.windows.findById(tabID);

        if (!tab) {
            const message = `A tab with ID "${tabID}" does not exist!`;
            showAlert(message);
            return;
        };

        // Check whether this tab is already in the tab group of the current window.
        const isTabAttached = myWindow.tabs.includes(tab);

        if (isTabAttached) {
            const message = `The tab with ID "${tabID}" is already attached to this window!`;
            showAlert(message);
            return;
        } else {
            // Attach a tab to the current window.
            myWindow.attachTab(tab)
                .catch(() => {
                    const message = `Error attaching tab with ID "${tabID}"!`;
                    showAlert(message);
                });
        };
    } else {
        const message = "You must enter a tab ID first!"
        showAlert(message);
    };
};

function detachTabFromWindow() {
    const tabID = inputs.tabID.value;

    if (tabID !== "") {
        // Find a window by ID.
        const tab = glue.windows.findById(tabID);

        if (!tab) {
            const message = `A tab with ID "${tabID}" does not exist!`;
            showAlert(message);
            return;
        };

        // Check whether this tab is in the tab group of the current window.
        const isTabAttached = myWindow.tabs.includes(tab);

        if (isTabAttached) {
            // Optional settings for the detached tab.
            const detachOptions = {
                bounds: {
                    width: 400,
                    height: 400,
                    top: 300,
                    left: 300
                }
            };

            // Detach the tab from the tab group.
            tab.detachTab(detachOptions)
                .catch(() => {
                    const message = `Error detaching tab with ID "${tabID}"!`;
                    showAlert(message);
                });
        } else {
            const message = `The tab with ID "${tabID}" is not attached to this window!`;
            showAlert(message);
        };
    } else {
        const message = "You must enter a tab ID first!"
        showAlert(message);
    };
};

/** DOM Element Manipulations **/
function getDOMElements() {
    // Buttons.
    buttons.resize = document.getElementById("resize-button");
    buttons.move = document.getElementById("move-button");
    buttons.setTitle = document.getElementById("set-title-button");
    buttons.setFrameColor = document.getElementById("set-frame-color-button");
    buttons.zoomIn = document.getElementById("zoom-in-button");
    buttons.zoomOut = document.getElementById("zoom-out-button");
    buttons.resetZoom = document.getElementById("reset-zoom-button");
    buttons.tabHeader = document.getElementById("tab-header-button");
    buttons.getTabIDs = document.getElementById("get-ids-button");
    buttons.attachTab = document.getElementById("attach-button");
    buttons.detachTab = document.getElementById("detach-button");

    // Inputs.
    inputs.resize.width = document.getElementById("resize-width");
    inputs.resize.height = document.getElementById("resize-height");
    inputs.move.top = document.getElementById("move-top");
    inputs.move.left = document.getElementById("move-left");
    inputs.title = document.getElementById("set-title");
    inputs.frameColor = document.getElementById("set-frame-color");
    inputs.tabID = document.getElementById("tab-id");

    tabIDsContainer = document.getElementById("tab-ids");
    invalidInputAlert = document.getElementById("alert");
};

function attachEventHandlers(handlers) {
    buttons.resize.addEventListener("click", handlers.resizeWindow);
    buttons.move.addEventListener("click", handlers.moveWindow);
    buttons.setTitle.addEventListener("click", handlers.setWindowTitle);
    buttons.setFrameColor.addEventListener("click", handlers.setWindowFrameColor);
    buttons.zoomIn.addEventListener("click", handlers.zoomIn);
    buttons.zoomOut.addEventListener("click", handlers.zoomOut);
    buttons.resetZoom.addEventListener("click", handlers.resetZoom);
    buttons.tabHeader.addEventListener("click", handlers.setTabHeaderVisibility);
    buttons.getTabIDs.addEventListener("click", handlers.getTabIDs);
    buttons.attachTab.addEventListener("click", handlers.attachTabToWindow);
    buttons.detachTab.addEventListener("click", handlers.detachTabFromWindow);

    invalidInputAlert.addEventListener("click", hideAlert);
};

function showAlert(message) {
    invalidInputAlert.firstElementChild.innerText = message;
    invalidInputAlert.style.display = "block";
};

function hideAlert() {
    invalidInputAlert.style.display = "none";
}