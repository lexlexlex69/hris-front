export const filterFn = (param, arr, direction) => {
    console.log(typeof (param))
    if (direction === 'up') {
        if (typeof (param) === 'string') {
            arr.sort((a, b) => a[param] > b[param] ? 1 : -1)
        }
    }
    else if (direction === 'down') {
        if (typeof (param) === 'string') {
            arr.sort((a, b) => a[param] < b[param] ? 1 : -1)
        }
    }
    return arr
}