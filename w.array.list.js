/*
*   List methods (adapted from C#)
*   Sebastian Stefaniuk - Webitects.com
*   https://github.com/sebastians86/w.array.list.js
*
*   04-08-2014  v 1.2.4.0   Updated distinct() method; Added select() method.
*   02-17-2014  v 1.1.3.0   Updated distinct() method.
*   02-11-2014  v 1.1.2.0   Updated addRange() method.
*   02-10-2014  v 1.1.1.0   Added clone() method; Updated utility.getCompare() method.
*   02-09-2014  v 1.0.0.0   Initial version
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
    return _this.clone();
}

Array.prototype.any = function () {
    return this.length > 0;
}

Array.prototype.clone = function () {
    var array = [];
    this.foreach(function (item) {
        array.add(item);
    });
    return array;
}

Array.prototype.distinct = function (delegate) {
    var array = [];
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
        if (typeof delegate === 'function') {      
            if (array.findIndex(function (x) { return x === delegate(_this[i]); }) == -1)
                array.add(delegate(_this[i]));
        }
        else if (typeof delegate === 'undefined') {
            if (array.findIndex(function (x) { return x === _this[i]; }) == -1)
                array.add(_this[i]);
        }
        else if (_this[i] === delegate) {
            if (array.findIndex(function (x) { return x === _this[i]; }) == -1)
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

Array.prototype.insertAt = function (obj, index) {    
    if (index >= 0 && index <= this.length) {
        var _array = [];
        var _this = this;

        if (index === 0) {
            _array.add(obj);
            _array.addRange(_this);
        }
        else if (index === _this.length) {
            _array = _this.clone();
            _array.add(obj);
        }
        else {
            _array.addRange(_this.take(index, 0));
            _array.add(obj);
            _array.addRange(_this.take(_this.length - index, index));
        }

        for (var i = 0; i < _array.length; i++)
            _this[i] = _array[i];
    }
    else
        throw 'Array.prototype.insertAt(): Cannot insert at ' + index + '. Array length = ' + this.length;
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

Array.prototype.max = function (delegate) {
    var item;
    var _this = this;
    var max = Number.MIN_VALUE;
    for (var i = 0; i < _this.length; i++) {
        if (typeof delegate === 'function' && delegate(_this[i]) > max)
            max = delegate(_this[i]);
        else if (typeof delegate === 'undefined' && _this[i] > max)
            max = _this[i];
    }
    return max;
}

Array.prototype.min = function (delegate) {
    var item;
    var _this = this;
    var min = Number.MAX_VALUE;
    for (var i = 0; i < _this.length; i++) {
        if (typeof delegate === 'function' && delegate(_this[i]) < min)
            min = delegate(_this[i]);
        else if (typeof delegate === 'undefined' && _this[i] < min)
            min = _this[i];
    }
    return min;
}

Array.prototype.orderBy = function (args) {
    var compareFunc = Array.Utility.getCompare(this, arguments);
    this.sort(compareFunc);
    return this.clone();
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
    for (var i = 0; i < _this.length; i++)
        if (i !== index)
            array.push(_this[i]);
    return array;
}

Array.prototype.select = function (delegate) {
    var array = [];
    var _this = this;
    for (var i = 0; i < _this.length; i++) {
        if (typeof delegate === 'function') {
            array.add(delegate(_this[i]));
        }
        else if (typeof delegate === 'string') {
            array.add(_this[i][delegate]);
        }
    }
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

Array.Utility = {
    getCompare: function () {
        var compares = [],
            delegates = [],
            types = [];

        var compareFunc;
        var args = arguments.length > 1 ? arguments[1] : [];
        var _this = arguments[0];

        for (var i = 0; i < args.length; i++) {
            var delegate = args[i].del;
            var sortType = args[i].sort !== undefined ? args[i].sort : Array.SortType.ASC;
            var compare;

            if (typeof delegate === 'function') {
                compare = function (a, b, pred, type) {
                    var x = Array.Utility.getSortValue(pred(a));
                    var y = Array.Utility.getSortValue(pred(b));
                    if (x < y) return type === Array.SortType.ASC ? -1 : 1;
                    if (x > y) return type === Array.SortType.ASC ? 1 : -1;
                    return 0;
                };
            }
            else if (typeof delegate === 'string') {
                compare = function (a, b, pred, type) {
                    var x = Array.Utility.getSortValue(a[pred]);
                    var y = Array.Utility.getSortValue(b[pred]);
                    if (x < y) return type === Array.SortType.ASC ? -1 : 1;
                    if (x > y) return type === Array.SortType.ASC ? 1 : -1;
                    return 0;
                };
            }

            if (compare !== undefined) {
                compares.push(compare);
                delegates.push(delegate);
                types.push(sortType);
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
            var sortType;

            if (args.length === 1) {
                if (typeof args[0] === 'number') sortType = args[0];
                else sortType = Array.SortType.ASC;
            }
            else
                sortType = Array.SortType.ASC;

            if (sortType === Array.SortType.DESC) {
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