class Distribution {
    
    constructor(name, fn, inputs, integralfn) {
        this.name = name;
        this.fn = fn;
        this.inputs = inputs;
        this.integralfn = integralfn;
        this.standardDeviation = Object.keys(this.inputs)[0]
        Object.keys(inputs).forEach(input => {
            this[input] = inputs[input]
        });

        // this.integral = []
        this.dataset = []
    }

    static copy(distribution) {
        return new Distribution(distribution.name, distribution.fn, Object.assign({}, distribution.inputs), distribution.integralfn)
    }

    sdFromQ(q) {
        var u1 = 1
        var u2 = 0
        this[this.standardDeviation] = (u1 - u2)/(2 * q)
    }

    calculate(xMin, xMax, xStep) {
        this.dataset = []
        var x = 0
        // var integral = 0
        while (x > xMin) {
            x -= xStep
        }
        // '- xStep' just for Chart.js to have domain up to xMax, otherwise it is extended to xMax + 2
        while (x < xMax - xStep) {
            
            x += xStep
            var y = this.fn(x)
            // integral += y * xStep
            this.dataset.push({ x: x, y: y })
            // this.integral.push({ x: x, y: integral })
        }
    }
}

function gaussianfn(x) {
    let sigmaSquared = Math.pow(this.sigma, 2)
    let mu = this.mu
    return (1 / Math.sqrt(2 * Math.PI * sigmaSquared)) * Math.exp(-Math.pow(x - mu, 2) / (2 * sigmaSquared))
}


function gaussianIntegralfn(x) {
    return 0.5 * (1 + math.erf((x - this.mu)/(Math.sqrt(2) * this.sigma)))
}

function laplacefn(x) {
    let b = this.b
    let mu = this.mu
    if (x < mu) {
        return 1 / (2 * b) * Math.exp(-(mu - x) / b)
    } else {
        return 1 / (2 * b) * Math.exp(-(x - mu) / b)
    }
}

function laplaceIntegralfn(x) {
    let b = this.b
    let mu = this.mu
    if (x < mu) {
        return 1 / (2) * Math.exp((x - mu) / b)
    } else {
        return 1 - 1 / (2) * Math.exp(-(x - mu) / b)
    }
}

function laplacefn1(x) {
    var b = 1
    var mu = 0
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
