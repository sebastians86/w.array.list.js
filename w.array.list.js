﻿/*
*   List methods (adapted from C#)
*   Sebastian Stefaniuk - Webitects.com
*
*
*/

Array.prototype.add = function (item) {
    var arrayType = this.type;
    if (typeof arrayType === 'undefined')
        this.type = typeof item;
    else if (this.type !== typeof item && item !== null)
        throw 'Item is of type "' + (typeof item) + '," but this array is composed of "' + this.type + '" type objects.';
    this.push(item);
}

Array.prototype.addRange = function (array) {
    var _this = this;
    if (array !== undefined) {
        array.foreach(function (item) {
            _this.add(item);
        });
    }
    return _this;
}

Array.prototype.any = function () {
    return this.length > 0;
}

Array.prototype.clear = function () {
    this = [];
}

Array.prototype.count = function () {
    return this.length;
}

Array.prototype.distinct = function (delegate) {
    var array = [];
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
        if ((typeof delegate === 'function' && delegate(_this[i])) || (_this[i] === delegate)) {
            if (typeof delegate === 'function' && delegate(_this[i])) {
                if (array.findIndex(function (x) { return x == delegate(_this[i]); }) == -1)
                    array.add(delegate(_this[i]));
            }
        }
        else if (typeof delegate === 'undefined') {
            if (array.findIndex(function (x) { return x == _this[i]; }) == -1)
                array.add(_this[i]);
        }
    }
    return array;
}

Array.prototype.find = function (delegate) {
    var item;
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
        if ((typeof delegate === 'function' && delegate(_this[i])) || (_this[i] === delegate)) {
            item = _this[i];
            break;
        }
    }
    return item;
}

Array.prototype.findAll = function (delegate) {
    var array = [];
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
        if ((typeof delegate === 'function' && delegate(_this[i])) || (_this[i] === delegate))
            array.add(_this[i]);
    }
    return array;
}

Array.prototype.findIndex = function (delegate) {
    var index = -1;
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
        if ((typeof delegate === 'function' && delegate(_this[i])) || (_this[i] === delegate)) {
            index = i;
            break;
        }
    }
    return index;
}

Array.prototype.first = function () {
    var item;
    if (this.length > 0)
        item = this[0];
    return item;
}

Array.prototype.foreach = function (delegate) {
    for (var i = 0; i < this.length; i++) {
        if (typeof delegate === 'function') {
            var doBreak = delegate(this[i], i);
            if (doBreak)
                break;
        }
    }
}

Array.prototype.last = function () {
    var item;
    if (this.length > 0)
        item = this[this.length - 1];
    return item;
}

Array.prototype.longCount = function (delegate) {
    var count = 0;
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
        if ((typeof delegate === 'function' && delegate(_this[i])) || (_this[i] === delegate))
            count++;
    }
    return count;
}

Array.prototype.orderBy = function (args) {
    var _this = this;
    var array = [];
    var compareFunc = this.utility.getCompare(this, arguments);

    for (var i = 0; i < _this.length; i++)
        array.push(_this[i]);

    array.sort(compareFunc);
    return array;
}

Array.prototype.removeAll = function (delegate) {
    var array = [];
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
        if ((typeof delegate === 'function' && delegate(_this[i])) || (_this[i] === delegate)) { }
        else
            array.add(_this[i]);
    }
    return array;
}

Array.prototype.removeAt = function (index) {
    var array = [];
    var _this = this;
    console.log(_this);
    for (var i = 0; i < _this.length; i++)
        if (i !== index)
            array.push(_this[i]);
    return array;
}

Array.prototype.take = function (numOfItems, skip) {
    var array = [];
    var _this = this;
    skip = skip !== undefined ? skip : 0;
    for (var i = skip; i < numOfItems + skip; i++) {
        if (i < _this.length) array.add(_this[i]);
        else break;
    }
    return array;
}

Array.prototype.type = undefined;

Array.prototype.utility = {
    compareType: {
        ASC: 1,
        DESC: 2
    },

    getCompare: function () {
        var compares = [],
            delegates = [],
            types = [];

        var compareFunc;
        var args = arguments.length > 1 ? arguments[1] : [];
        var _this = arguments[0];

        for (var i = 0; i < args.length; i++) {
            var delegate = args[i].del;
            var compareType = args[i].type !== undefined ? args[i].type : Array.SortType.ASC;
            var compare;

            if (typeof delegate === 'function') {
                compare = function (a, b, pred, type) {
                    var x = _this.utility.getSortValue(pred(a));
                    var y = _this.utility.getSortValue(pred(b));
                    if (x < y) return type === Array.SortType.ASC ? -1 : 1;
                    if (x > y) return type === Array.SortType.ASC ? 1 : -1;
                    return 0;
                };
            }
            else if (typeof delegate === 'string') {
                compare = function (a, b, pred, type) {
                    var x = _this.utility.getSortValue(a[pred]);
                    var y = _this.utility.getSortValue(b[pred]);
                    if (x < y) return type === Array.SortType.ASC ? -1 : 1;
                    if (x > y) return type === Array.SortType.ASC ? 1 : -1;
                    return 0;
                };
            }

            if (compare !== undefined) {
                compares.push(compare);
                delegates.push(delegate);
                types.push(compareType);
            }
        }

        if (compares.length > 0) {
            compareFunc = function (x, y) {
                var val = 0;
                for (var i = 0; i < compares.length; i++) {
                    val = compares[i](x, y, delegates[i], types[i]);
                    if (val !== 0)
                        break;
                }
                return val;
            }
        }
        else {
            var compareType;

            if (args.length === 1) {
                if (typeof args[0] === 'number') compareType = args[0];
                else compareType = Array.SortType.ASC;
            }
            else
                compareType = Array.SortType.ASC;

            if (compareType === Array.SortType.DESC) {
                compareFunc = function (a, b) {
                    if (a > b) return -1;
                    if (a < b) return 1;
                    return 0;
                };
            }
            else {
                compareFunc = function (a, b) {
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0;
                };
            }
        }

        return compareFunc;
    },

    getSortValue: function (item) {
        if (typeof item === 'number') return parseFloat(item);
        else if (typeof item === 'string') return item.toString();
        return item;
    }
}

Array.SortType = {
    ASC: 1,
    DESC: 2
}