/**
 * * Integrate function taken from:
 * * http://mathjs.org/examples/advanced/custom_argument_parsing.js.html
 */

/**
 * Calculate the numeric integration of a function
 * @param {Function} f
 * @param {number} start
 * @param {number} end
 * @param {number} [step=0.01]
 */
function integrate(f, start, end, step) {
    let total = 0
    step = step || 0.01
    for (let x = start; x < end; x += step) {
        total += f(x + step / 2) * step
    }
    return total
}

/**
 * A transformation for the integrate function. This transformation will be
 * invoked when the function is used via the expression parser of math.js.
 *
 * Syntax:
 *
 *     integrate(integrand, variable, start, end)
 *     integrate(integrand, variable, start, end, step)
 *
 * Usage:
 *
 *     math.eval('integrate(2*x, x, 0, 2)')
 *     math.eval('integrate(2*x, x, 0, 2, 0.01)')
 *
 * @param {Array.<math.expression.node.Node>} args
 *            Expects the following arguments: [f, x, start, end, step]
 * @param {Object} math
 * @param {Object} [scope]
 */
integrate.transform = function (args, math, scope) {
    // determine the variable name
    if (!args[1].isSymbolNode) {
        throw new Error('Second argument must be a symbol')
    }
    const variable = args[1].name

    // evaluate start, end, and step
    const start = args[2].compile().eval(scope)
    const end = args[3].compile().eval(scope)
    const step = args[4] && args[4].compile().eval(scope) // step is optional

    // create a new scope, linked to the provided scope. We use this new scope
    // to apply the variable.
    const fnScope = Object.create(scope)

    // construct a function which evaluates the first parameter f after applying
    // a value for parameter x.
    const fnCode = args[0].compile()
    const f = function (x) {
        fnScope[variable] = x
        return fnCode.eval(fnScope)
    }

    // execute the integration
    return integrate(f, start, end, step)
}

// import the function into math.js. Raw functions must be imported in the
// math namespace, they can't be used via `eval(scope)`.
math.import({
    integrate: integrate
})

