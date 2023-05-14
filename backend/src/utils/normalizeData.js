const groupBy = (array, key) =>
    array.reduce((a, c) => ({
        ...a,
        [c[key]]: [...a[c[key]] || [], c]
    }), {});

const uniques = (...values) =>
    Array.from(new Set([].concat(...values).filter(Boolean)));

const singularize = array =>
    array.length == 1 ? array[0] : array;

const singularizedUniques = (...values) =>
    singularize(uniques(...values));

const mergeCollect = array =>
    array.reduce((mergedObject, curentObject) =>
        Object.entries(curentObject).reduce((newObject, [k, v]) => ({
            ...newObject,
            [k]: singularizedUniques(newObject[k], v)
        }), mergedObject), {});

exports.groupByKey = (array, key) =>
    Object.fromEntries(Object.entries(groupBy(array, key)).map(([k, v]) => [k, mergeCollect(v)]));

