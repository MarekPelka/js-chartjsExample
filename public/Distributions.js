var gui
var first = true
// p5.js function - will run once
function setup() {

    gui = new Gui()
}

// p5.js function - will run in a loop
function draw() {
    if (first) {
        gaussian = new Distribution("gaussian", gaussianfn, {sigma : 1, mu : 0})
        laplace = new Distribution("laplace", laplacefn, {b : 1, mu : 0})
        gui.addDistribution(new DualProbability(gaussian, {mu : 1}))
        gui.addDistribution(new DualProbability(laplace, {mu : 1}))

        gui.setRecalculateAction(recalculateAction)
        gui.init()

        first = false
    }
}

function recalculateAction() {
    gui.currentDistribution = gui.getSelectedDistribution()
    gui.recalculate()
}
