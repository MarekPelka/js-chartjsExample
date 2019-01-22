class DualProbability {
    constructor(distribution, offset) {
        this.name = distribution.name

        this.zeroDistribution = Distribution.copy(distribution);
        this.zeroDistribution.name += " Zero"

        this.oneDistribution = Distribution.copy(distribution);
        this.oneDistribution.name += " One"

        this.errorSurface = -1
        this.wholeSurface = 2

        this.offset = offset;
        Object.keys(offset).forEach(item => {
            this.oneDistribution[item] += offset[item]
        });
    }

    recalculate(xMin, xMax, xStep) {
        this.zeroDistribution.calculate(xMin, xMax, xStep)
        this.oneDistribution.calculate(xMin, xMax, xStep)
    }

    calculateErrorSurface(xMin, xMax, xStep) {
        this.threshold = this.getThreshold()
        this.errorSurface = 0
        if (this.oneDistribution.integralfn != undefined) {
            this.errorSurface += this.oneDistribution.integralfn(this.threshold)
            this.errorSurface += (1 - this.zeroDistribution.integralfn(this.threshold))
        } else {
            this.errorSurface += integrate(this.oneDistribution, xMin, this.threshold, xStep)
            this.errorSurface += integrate(this.zeroDistribution, this.threshold, xMax, xStep)    
        }
        this.getErrorDataset(xMin, xMax, xStep)
    }

    getBER() {
        return this.errorSurface / (this.wholeSurface)
    }

    getErrorDataset(xMin, xMax, xStep) {
        this.errorDataset = []
        var x = 0
        if (xMin < 0) {
            // var integral = 0
            while (x > xMin) {
                x -= xStep
            }
        } else
            x = xMin
        // '- xStep' just for Chart.js to have domain up to xMax, otherwise it is extended to xMax + 2
        while (x < xMax - xStep) {

            x += xStep
            var y = 0
            if (x < this.threshold)
                y = this.oneDistribution.fn(x)
            else
                y = this.zeroDistribution.fn(x)
            // integral += y * xStep
            this.errorDataset.push({ x: x, y: y })
            // this.integral.push({ x: x, y: integral })
        }
    }

    getThreshold() {
        if (this.name === "gaussian" 
        || this.name === "laplace"
        || this.name === "rayleigh"
        || this.name === "maxwell")
            return 0.5
        var accuracy = 0.0001
        var x = 0
        var xStep = 0.3
        var diff = 10
        var wasPositive = true
        var iter = 0
        while (Math.abs(diff) > accuracy) {
            x += xStep
            diff = this.zeroDistribution.fn(x) - this.oneDistribution.fn(x)
            // console.log("Diff: " + diff + "; X: " + x + "; step: " + xStep)

            if ((diff < 0 && wasPositive) || ((diff > 0 && !wasPositive))) {
                xStep *= -0.1
                wasPositive = !wasPositive
            }


            if (iter++ > 1000) break
        }
        return x
    }

}
