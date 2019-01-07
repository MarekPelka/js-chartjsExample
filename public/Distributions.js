// // Laplace vars
// var mu = 0
// var b = 1

// // Gaussian vars
// var sigma = 1

// // Maxwell vars
// var a = 1

// //util vars
// var muInput, bInput, sigmaInput, aInput, recalculateButton
// var laplaceSumDiv, gaussianSumDiv, rayleighSumDiv, maxwellSumDiv


var gui
var first = true
// p5.js function - will run once
function setup() {

    gui = new Gui()
    // Gui.addDefaultInputs()
}

// p5.js function - will run in a loop
function draw() {
    if (first) {
        gaussian = new Distribution("gaussian", gaussianfn, {sigma : 1, mu : 0})
        laplace = new Distribution("laplace", laplacefn, {b : 1, mu : 1})
        gui.addDistribution(new DualProbability(gaussian, {mu : 1}))
        gui.addDistribution(new DualProbability(laplace, {mu : 1}))

        gui.setRecalculateAction(recalculateAction)
        gui.init()
        // gaussian = new Distribution("gaussian", gaussian, {sigma : 1, mu : 1})
        // gaussian = new Distribution("gaussian", gaussian, {sigma : 1, mu : 1})
        // distribution = new Map([
        //     ["Laplace", laplace],
        //     ["Gaussian", gaussian],
        //     ["Rayleigh", rayleigh],
        //     ["Maxwell", maxwell],
        //     ["LaplaceIntegral", integralWrapper(laplace)],
        //     ["GaussianIntegral", integralWrapper(gaussian)],
        //     ["RayleighIntegral", integralWrapper(rayleigh)],
        //     ["MaxwellIntegral", integralWrapper(maxwell)],
        // ])
        // distribution.forEach(addNewDataset);
        // updateSums()
        first = false
    }
}

function recalculateAction() {
    gui.currentDistribution = gui.getSelectedDistribution()
    // gui.currentDistribution = new DualProbability(currentDistribution, {mu : 1})
    gui.recalculate()
}

const verticalLinePlugin = {
    getLinePosition: function (chart, pointIndex) {
        const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
        const data = meta.data;
        return data[pointIndex]._model.x;
    },
    renderVerticalLine: function (chartInstance, pointIndex) {
        const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
        const scale = chartInstance.scales['y-axis-0'];
        const context = chartInstance.chart.ctx;
  
        // render vertical line
        context.beginPath();
        context.strokeStyle = '#ff0000';
        context.moveTo(lineLeftOffset, scale.top);
        context.lineTo(lineLeftOffset, scale.bottom);
        context.stroke();
  
        // write label
        context.fillStyle = "#ff0000";
        context.textAlign = 'center';
        context.fillText('MY TEXT', lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
    },
  
    afterDatasetsDraw: function (chart, easing) {
        if (chart.config.lineAtIndex) {
            chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
        }
    }
};
  
Chart.plugins.register(verticalLinePlugin);


// function integralWrapper(fun) {
//     return function (x) {
//         return 1 - math.integrate(fun, xMin, x, xStep)
//     }
// }

// function calculateDistribution(fun, dataset) {

//     // Next 4 lines are to make sure that stepping from xMin to xMax we will hit 0 - very important for one-sided distributions
//     var x = 0
//     while (x > xMin) {
//         x -= xStep
//     }
//     // '- xStep' just for Chart.js to have domain up to xMax, otherwise it is extended to xMax + 2
//     while (x < xMax - xStep) {
//         x += xStep
//         y = fun(x)
//         dataset.push({ x: x, y: y })
//     }
//     window['chartCanvas1'].update()
// }

// function addNewDataset(value, key, map) {
//     // select random color and remove it from color list to make sure that all series have different colors
//     var colorNames = Object.keys(window.chartColors);
//     var colorName = colorNames[Math.floor(Math.random() * colorNames.length)]
//     var color = chartColors[colorName]
//     delete chartColors[colorName]

//     var newDataset = {
//         label: key,
//         data: [],
//         fill: false,
//         borderColor: color,
//         backgroundColor: color,
//         borderWidth: 3,
//         pointRadius: 0
//     }
//     window['chartCanvas1'].data.datasets.push(newDataset)
//     calculateDistribution(value, getDataset(key).data)
//     window['chartCanvas1'].update()
// }

// //////////////////////////
// // Logic for recalculating distributions after user input
// ////////////////////////// 

// function recalculate() {

//     var changedParams = getChangedParams()
//     whatDatasetToRecalculate(changedParams)
// }

// function getChangedParams() {

//     var output = []
//     var newParam = getParamFromInput(muInput)
//     if (newParam != mu) { mu = newParam; output.push('mu') }
//     newParam = getParamFromInput(bInput)
//     if (newParam != b) { b = newParam; output.push('b') }
//     newParam = getParamFromInput(sigmaInput)
//     if (newParam != sigma) { sigma = newParam; output.push('sigma') }
//     newParam = getParamFromInput(aInput)
//     if (newParam != a) { a = newParam; output.push('a') }

//     newParam = getParamFromInput(xMinInput)
//     if (newParam != xMin) { xMin = newParam; output.push('xMin') }
//     newParam = getParamFromInput(xMaxInput)
//     if (newParam != xMax) { xMax = newParam; output.push('xMax') }
//     newParam = getParamFromInput(xStepInput)
//     if (newParam != xStep) { xStep = newParam; output.push('xStep') }
//     return output
// }

// function getParamFromInput(input) {
//     return parseFloat(input.value(), 10);
// }

// function whatDatasetToRecalculate(changedParamsList) {
//     changedParamsList.forEach(param => {

//         switch (param) {
//             case 'mu':
//                 recalculateDataset('Gaussian')
//                 recalculateDataset('Laplace')
//                 break;
//             case 'b':
//                 recalculateDataset('Laplace')
//                 break;
//             case 'sigma':
//                 recalculateDataset('Gaussian')
//                 recalculateDataset('Rayleigh')
//                 break;
//             case 'a':
//                 recalculateDataset('Maxwell')
//                 break;
//             case 'xMin':
//             case 'xMax':
//             case 'xStep':
//                 recalculateAllDatasets()
//                 break;
//         }
//     });
//     updateSums()
//     window['chartCanvas1'].update()
// }

// function recalculateDataset(label) {
//     filterDatasetByLabel(label)
//     filterDatasetByLabel(label + 'Integral')

//     addNewDatasetFromDistribution(label)
//     addNewDatasetFromDistribution(label + 'Integral')
// }

// function recalculateAllDatasets() {
    
//     recalculateDataset('Gaussian')
//     recalculateDataset('Rayleigh')
//     recalculateDataset('Laplace')
//     recalculateDataset('Maxwell')
// }

// function getDataset(label) {
//     return window['chartCanvas1'].data.datasets.find(dataset => dataset.label === label)
// }

// function filterDatasetByLabel(label) {
//     var dataset = getDataset(label)
//     // Cool way for returning a color back to pool
//     chartColors[Math.random()] = dataset.backgroundColor
//     window['chartCanvas1'].data.datasets = window['chartCanvas1'].data.datasets.filter(dataset => dataset.label !== label)
// }

// function addNewDatasetFromDistribution(label) {
//     addNewDataset(distribution.get(label), label)
// }

// function updateSums() {
//     laplaceSumDiv.html('<td>Laplace: </td><td>' + getSumFromLabel('Laplace') + '</td>')
//     gaussianSumDiv.html('<td>Gaussian: </td><td>' + getSumFromLabel('Gaussian') + '</td>')
//     rayleighSumDiv.html('<td>Rayleigh: </td><td>' + getSumFromLabel('Rayleigh') + '</td>')
//     maxwellSumDiv.html('<td>Maxwell: </td><td>' + getSumFromLabel('Maxwell') + '</td>')
// }

// function getSumFromLabel(label) {
//     integralLabel = label + 'Integral'
//     return (1 - getDataset(integralLabel).data[getDataset(integralLabel).data.length - 1].y).toString()
// }

//////////////////////////
// Distribution functions
////////////////////////// 




  