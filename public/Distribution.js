class Distribution {
    
    constructor(name, fn, inputs) {
        this.name = name;
        this.fn = fn;
        this.inputs = inputs;
        Object.keys(inputs).forEach(input => {
            this[input] = inputs[input]
        });

        this.integral = []
        this.dataset = []
    }

    static copy(distribution) {
        return new Distribution(distribution.name, distribution.fn, Object.assign({}, distribution.inputs))
    }

    calculate(xMin, xMax, xStep) {
        this.dataset = []
        var x = 0
        var integral = 0
        while (x > xMin) {
            x -= xStep
        }
        // '- xStep' just for Chart.js to have domain up to xMax, otherwise it is extended to xMax + 2
        while (x < xMax - xStep) {
            
            x += xStep
            var y = this.fn(x)
            integral += y * xStep
            this.dataset.push({ x: x, y: y })
            this.integral.push({ x: x, y: integral })
        }
    }
}

function gaussianfn(x) {
    var sigmaSquared = Math.pow(this.sigma, 2)
    var mu = this.mu
    return (1 / Math.sqrt(2 * Math.PI * sigmaSquared)) * Math.exp(-Math.pow(x - mu, 2) / (2 * sigmaSquared))
}

function laplacefn(x) {
    var b = this.b
    var mu = this.mu
    if (x < mu) {
        return 1 / (2 * b) * Math.exp(-(mu - x) / b)
    } else {
        return 1 / (2 * b) * Math.exp(-(x - mu) / b)
    }
}

function rayleighfn(x) {

    if (x >= 0) {
        var sigmaSquared = Math.pow(this.sigma, 2)
        return x / sigmaSquared * Math.exp(-Math.pow(x, 2) / (2 * sigmaSquared))
    } else {
        return null
    }
}

function maxwellfn(x) {
    if (x >= 0) {
        var aSquared = Math.pow(this.a, 2)
        var xSquared = Math.pow(x, 2)
        var a = this.a
        return Math.sqrt(2 / Math.PI) * (xSquared * Math.exp(-xSquared / (2 * aSquared))) / Math.pow(a, 3)
    } else
        return null
}


function gaussianFnFromQ(q) {
    // this.standardDeviation = sdFromQ(q)
    // var mu1 = 1
    // var mu0 = 0
    var commonPartSurface = 0
    var sumPartSurface = 0
    // this.mu = 1
    // result += integrate(gaussianHardcoded,-10, (mu1 + mu0)/2)
    // this.mu = 0
    // result += integrate(gaussianHardcoded,(mu1 + mu0)/2,10)
    // gui.currentDistribution.oneDistribution.mu = 2
    var standardDeviation = sdFromQ(q)

    recalculateAction()
    gui.currentDistribution.oneDistribution.sigma = Math.pow(standardDeviation,2)
    gui.currentDistribution.zeroDistribution.sigma = Math.pow(standardDeviation,2)

    commonPartSurface += integrate(gui.currentDistribution.oneDistribution, -10, gui.currentDistribution.getThreshold())
    commonPartSurface += integrate(gui.currentDistribution.zeroDistribution, gui.currentDistribution.getThreshold(), 10)

    sumPartSurface += integrate(gui.currentDistribution.zeroDistribution,-10, gui.currentDistribution.getThreshold())
    sumPartSurface += integrate(gui.currentDistribution.oneDistribution, gui.currentDistribution.getThreshold(), 10)


    return  commonPartSurface
}

function licz() {
    var q = 0
    var max = 10
    var step = 0.5

    var newDataset = {
        label: 'q_Ber',
        data: [],
        fill: false,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgb(255, 159, 64)',
        borderWidth: 3,
        pointRadius: 0
    }
    window['ber'].data.datasets.push(newDataset)
    window['ber'].update()

    while (q < max) {

        q += step
        var y = gaussianFnFromQ(q)

        window.ber.data.datasets[0].data.push({ x: q, y: y })

    }
    window.ber.update()
}


function gaussianHardcoded(x) {
    return (1 / Math.sqrt(2 * Math.PI * this.standardDeviation)) * Math.exp(-Math.pow(x - this.mu, 2) / (2 * this.standardDeviation))
}


function sdFromQ(q) {
    var u1 = 1
    var u2 = 0
    return (u1 - u2)/(2 * q)
}