/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 99);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function warning() {};

if (true) {
  warning = function warning(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.length < 10 || /^[s\W]*$/.test(format)) {
      throw new Error('The warning format should be able to uniquely identify this ' + 'warning. Please, use a more descriptive format than: ' + format);
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    }
  };
}

module.exports = warning;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);
var core = __webpack_require__(1);
var ctx = __webpack_require__(15);
var hide = __webpack_require__(10);
var PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? function (C) {
      var F = function F(a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0:
              return new C();
            case 1:
              return new C(a);
            case 2:
              return new C(a, b);
          }return new C(a, b, c);
        }return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
      // make static versions for prototype methods
    }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var store = __webpack_require__(45)('wks');
var uid = __webpack_require__(24);
var _Symbol = __webpack_require__(4).Symbol;
var USE_SYMBOL = typeof _Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
// eslint-disable-next-line no-new-func
: Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(12);
var IE8_DOM_DEFINE = __webpack_require__(70);
var toPrimitive = __webpack_require__(38);
var dP = Object.defineProperty;

exports.f = __webpack_require__(6) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(13)(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(109);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports["default"] = _assign2["default"] || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (it) {
  return (typeof it === 'undefined' ? 'undefined' : babelHelpers['typeof'](it)) === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

  var isValidElement = function isValidElement(object) {
    return (typeof object === 'undefined' ? 'undefined' : babelHelpers['typeof'](object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(102)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dP = __webpack_require__(5);
var createDesc = __webpack_require__(23);
module.exports = __webpack_require__(6) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(8);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// optional / simple context binding
var aFunction = __webpack_require__(69);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(39);
var defined = __webpack_require__(41);
module.exports = function (it) {
  return IObject(defined(it));
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports["default"] = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _typeof = typeof Symbol === "function" && babelHelpers["typeof"](Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

var _toCss = __webpack_require__(48);

var _toCss2 = _interopRequireDefault(_toCss);

var _toCssValue = __webpack_require__(29);

var _toCssValue2 = _interopRequireDefault(_toCssValue);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var StyleRule = function () {
  function StyleRule(key, style, options) {
    _classCallCheck(this, StyleRule);

    this.type = 'style';
    this.isProcessed = false;
    var sheet = options.sheet,
        Renderer = options.Renderer,
        selector = options.selector;

    this.key = key;
    this.options = options;
    this.style = style;
    if (selector) this.selectorText = selector;
    this.renderer = sheet ? sheet.renderer : new Renderer();
  }

  /**
   * Set selector string.
   * Attention: use this with caution. Most browsers didn't implement
   * selectorText setter, so this may result in rerendering of entire Style Sheet.
   */

  _createClass(StyleRule, [{
    key: 'prop',

    /**
     * Get or set a style property.
     */
    value: function prop(name, nextValue) {
      // It's a setter.
      if (nextValue != null) {
        // Don't do anything if the value has not changed.
        if (this.style[name] !== nextValue) {
          nextValue = this.options.jss.plugins.onChangeValue(nextValue, name, this);
          this.style[name] = nextValue;

          // Renderable is defined if StyleSheet option `link` is true.
          if (this.renderable) this.renderer.setStyle(this.renderable, name, nextValue);else {
            var sheet = this.options.sheet;

            if (sheet && sheet.attached) {
              (0, _warning2['default'])(false, 'Rule is not linked. Missing sheet option "link: true".');
            }
          }
        }
        return this;
      }

      return this.style[name];
    }

    /**
     * Apply rule to an element inline.
     */

  }, {
    key: 'applyTo',
    value: function applyTo(renderable) {
      var json = this.toJSON();
      for (var prop in json) {
        this.renderer.setStyle(renderable, prop, json[prop]);
      }return this;
    }

    /**
     * Returns JSON representation of the rule.
     * Fallbacks are not supported.
     * Useful for inline styles.
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var json = {};
      for (var prop in this.style) {
        var value = this.style[prop];
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') json[prop] = value;else if (Array.isArray(value)) json[prop] = (0, _toCssValue2['default'])(value);
      }
      return json;
    }

    /**
     * Generates a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      var sheet = this.options.sheet;

      var link = sheet ? sheet.options.link : false;
      var opts = link ? _extends({}, options, { allowEmpty: true }) : options;
      return (0, _toCss2['default'])(this.selector, this.style, opts);
    }
  }, {
    key: 'selector',
    set: function set(selector) {
      if (selector === this.selectorText) return;

      this.selectorText = selector;

      if (this.renderable) {
        var hasChanged = this.renderer.setSelector(this.renderable, selector);

        // If selector setter is not implemented, rerender the rule.
        if (!hasChanged && this.renderable) {
          var renderable = this.renderer.replaceRule(this.renderable, this);
          if (renderable) this.renderable = renderable;
        }
      }
    }

    /**
     * Get selector string.
     */

    , get: function get() {
      return this.selectorText;
    }
  }]);

  return StyleRule;
}();

exports['default'] = StyleRule;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(72);
var enumBugKeys = __webpack_require__(46);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.1.13 ToObject(argument)
var defined = __webpack_require__(41);
module.exports = function (it) {
  return Object(defined(it));
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _createRule = __webpack_require__(30);

var _createRule2 = _interopRequireDefault(_createRule);

var _linkRule = __webpack_require__(79);

var _linkRule2 = _interopRequireDefault(_linkRule);

var _StyleRule = __webpack_require__(18);

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _escape = __webpack_require__(144);

var _escape2 = _interopRequireDefault(_escape);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Contains rules objects and allows adding/removing etc.
 * Is used for e.g. by `StyleSheet` or `ConditionalRule`.
 */
var RuleList = function () {

  // Original styles object.
  function RuleList(options) {
    _classCallCheck(this, RuleList);

    this.map = {};
    this.raw = {};
    this.index = [];

    this.options = options;
    this.classes = options.classes;
  }

  /**
   * Create and register rule.
   *
   * Will not render after Style Sheet was rendered the first time.
   */

  // Used to ensure correct rules order.

  // Rules registry for access by .get() method.
  // It contains the same rule registered by name and by selector.


  _createClass(RuleList, [{
    key: 'add',
    value: function add(name, decl, options) {
      var _options = this.options,
          parent = _options.parent,
          sheet = _options.sheet,
          jss = _options.jss,
          Renderer = _options.Renderer,
          generateClassName = _options.generateClassName;

      options = _extends({
        classes: this.classes,
        parent: parent,
        sheet: sheet,
        jss: jss,
        Renderer: Renderer,
        generateClassName: generateClassName
      }, options);

      if (!options.selector && this.classes[name]) {
        options.selector = '.' + (0, _escape2['default'])(this.classes[name]);
      }

      this.raw[name] = decl;

      var rule = (0, _createRule2['default'])(name, decl, options);

      var className = void 0;

      if (!options.selector && rule instanceof _StyleRule2['default']) {
        className = generateClassName(rule, sheet);
        rule.selector = '.' + (0, _escape2['default'])(className);
      }

      this.register(rule, className);

      var index = options.index === undefined ? this.index.length : options.index;
      this.index.splice(index, 0, rule);

      return rule;
    }

    /**
     * Get a rule.
     */

  }, {
    key: 'get',
    value: function get(name) {
      return this.map[name];
    }

    /**
     * Delete a rule.
     */

  }, {
    key: 'remove',
    value: function remove(rule) {
      this.unregister(rule);
      this.index.splice(this.indexOf(rule), 1);
    }

    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.index.indexOf(rule);
    }

    /**
     * Run `onProcessRule()` plugins on every rule.
     */

  }, {
    key: 'process',
    value: function process() {
      var plugins = this.options.jss.plugins;
      // We need to clone array because if we modify the index somewhere else during a loop
      // we end up with very hard-to-track-down side effects.

      this.index.slice(0).forEach(plugins.onProcessRule, plugins);
    }

    /**
     * Register a rule in `.map` and `.classes` maps.
     */

  }, {
    key: 'register',
    value: function register(rule, className) {
      this.map[rule.key] = rule;
      if (rule instanceof _StyleRule2['default']) {
        this.map[rule.selector] = rule;
        if (className) this.classes[rule.key] = className;
      }
    }

    /**
     * Unregister a rule.
     */

  }, {
    key: 'unregister',
    value: function unregister(rule) {
      delete this.map[rule.key];
      if (rule instanceof _StyleRule2['default']) {
        delete this.map[rule.selector];
        delete this.classes[rule.key];
      }
    }

    /**
     * Update the function values with a new data.
     */

  }, {
    key: 'update',
    value: function update(name, data) {
      var _options2 = this.options,
          plugins = _options2.jss.plugins,
          sheet = _options2.sheet;

      if (typeof name === 'string') {
        plugins.onUpdate(data, this.get(name), sheet);
        return;
      }

      for (var index = 0; index < this.index.length; index++) {
        plugins.onUpdate(name, this.index[index], sheet);
      }
    }

    /**
     * Link renderable rules with CSSRuleList.
     */

  }, {
    key: 'link',
    value: function link(cssRules) {
      var map = this.options.sheet.renderer.getUnescapedKeysMap(this.index);

      for (var i = 0; i < cssRules.length; i++) {
        var cssRule = cssRules[i];
        var _key = this.options.sheet.renderer.getKey(cssRule);
        if (map[_key]) _key = map[_key];
        var rule = this.map[_key];
        if (rule) (0, _linkRule2['default'])(rule, cssRule);
      }
    }

    /**
     * Convert rules to a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      var str = '';
      var sheet = this.options.sheet;

      var link = sheet ? sheet.options.link : false;

      for (var index = 0; index < this.index.length; index++) {
        var rule = this.index[index];
        var css = rule.toString(options);

        // No need to render an empty rule.
        if (!css && !link) continue;

        if (str) str += '\n';
        str += css;
      }

      return str;
    }
  }]);

  return RuleList;
}();

exports['default'] = RuleList;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value) && !isSpecial(value);
};

function isNonNullObject(value) {
	return !!value && (typeof value === 'undefined' ? 'undefined' : babelHelpers['typeof'](value)) === 'object';
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value);
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol['for'];
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol['for']('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE;
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value, optionsArgument) {
	var clone = !optionsArgument || optionsArgument.clone !== false;

	return clone && isMergeableObject(value) ? deepmerge(emptyTarget(value), value, optionsArgument) : value;
}

function defaultArrayMerge(target, source, optionsArgument) {
	return target.concat(source).map(function (element) {
		return cloneUnlessOtherwiseSpecified(element, optionsArgument);
	});
}

function mergeObject(target, source, optionsArgument) {
	var destination = {};
	if (isMergeableObject(target)) {
		Object.keys(target).forEach(function (key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], optionsArgument);
		});
	}
	Object.keys(source).forEach(function (key) {
		if (!isMergeableObject(source[key]) || !target[key]) {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], optionsArgument);
		} else {
			destination[key] = deepmerge(target[key], source[key], optionsArgument);
		}
	});
	return destination;
}

function deepmerge(target, source, optionsArgument) {
	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var options = optionsArgument || { arrayMerge: defaultArrayMerge };
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, optionsArgument);
	} else if (sourceIsArray) {
		var arrayMerge = options.arrayMerge || defaultArrayMerge;
		return arrayMerge(target, source, optionsArgument);
	} else {
		return mergeObject(target, source, optionsArgument);
	}
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array');
	}

	return array.reduce(function (prev, next) {
		return deepmerge(prev, next, optionsArgument);
	}, {});
};

var deepmerge_1 = deepmerge;

exports['default'] = deepmerge_1;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(73);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports["default"] = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2["default"])(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(129), __esModule: true };

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = toCssValue;
var join = function join(value, by) {
  var result = '';
  for (var i = 0; i < value.length; i++) {
    // Remove !important from the value, it will be readded later.
    if (value[i] === '!important') break;
    if (result) result += by;
    result += value[i];
  }
  return result;
};

/**
 * Converts array values to string.
 *
 * `margin: [['5px', '10px']]` > `margin: 5px 10px;`
 * `border: ['1px', '2px']` > `border: 1px, 2px;`
 * `margin: [['5px', '10px'], '!important']` > `margin: 5px 10px !important;`
 * `color: ['red', !important]` > `color: red !important;`
 */
function toCssValue(value) {
  var ignoreImportant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!Array.isArray(value)) return value;

  var cssValue = '';

  // Support space separated values via `[['5px', '10px']]`.
  if (Array.isArray(value[0])) {
    for (var i = 0; i < value.length; i++) {
      if (value[i] === '!important') break;
      if (cssValue) cssValue += ', ';
      cssValue += join(value[i], ' ');
    }
  } else cssValue = join(value, ', ');

  // Add !important, because it was ignored.
  if (!ignoreImportant && value[value.length - 1] === '!important') {
    cssValue += ' !important';
  }

  return cssValue;
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = createRule;

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

var _StyleRule = __webpack_require__(18);

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _cloneStyle = __webpack_require__(139);

var _cloneStyle2 = _interopRequireDefault(_cloneStyle);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

/**
 * Create a rule instance.
 */
function createRule() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'unnamed';
  var decl = arguments[1];
  var options = arguments[2];
  var jss = options.jss;

  var declCopy = (0, _cloneStyle2['default'])(decl);

  var rule = jss.plugins.onCreateRule(name, declCopy, options);
  if (rule) return rule;

  // It is an at-rule and it has no instance.
  if (name[0] === '@') {
    (0, _warning2['default'])(false, '[JSS] Unknown at-rule %s', name);
  }

  return new _StyleRule2['default'](name, declCopy, options);
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : babelHelpers["typeof"](window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var _typeof = typeof Symbol === "function" && babelHelpers["typeof"](Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
};

var isBrowser = exports.isBrowser = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object" && (typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && document.nodeType === 9;

exports["default"] = isBrowser;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(12);
var dPs = __webpack_require__(176);
var enumBugKeys = __webpack_require__(46);
var IE_PROTO = __webpack_require__(44)('IE_PROTO');
var Empty = function Empty() {/* empty */};
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var _createDict = function createDict() {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(71)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(177).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  _createDict = iframeDocument.F;
  while (i--) {
    delete _createDict[PROTOTYPE][enumBugKeys[i]];
  }return _createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = _createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var def = __webpack_require__(5).f;
var has = __webpack_require__(14);
var TAG = __webpack_require__(3)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ctx = __webpack_require__(15);
var call = __webpack_require__(201);
var isArrayIter = __webpack_require__(202);
var anObject = __webpack_require__(12);
var toLength = __webpack_require__(42);
var getIterFn = __webpack_require__(203);
var BREAK = {};
var RETURN = {};
var _exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () {
    return iterable;
  } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
_exports.BREAK = BREAK;
_exports.RETURN = RETURN;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */


var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true
};

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
        // don't hoist over string (html) components

        if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        var keys = getOwnPropertyNames(sourceComponent);

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try {
                    // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(7);

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = __webpack_require__(17);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _deepmerge = __webpack_require__(26);

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

var _createTypography = __webpack_require__(115);

var _createTypography2 = _interopRequireDefault(_createTypography);

var _createBreakpoints = __webpack_require__(116);

var _createBreakpoints2 = _interopRequireDefault(_createBreakpoints);

var _createPalette = __webpack_require__(117);

var _createPalette2 = _interopRequireDefault(_createPalette);

var _createMixins = __webpack_require__(124);

var _createMixins2 = _interopRequireDefault(_createMixins);

var _shadows = __webpack_require__(127);

var _shadows2 = _interopRequireDefault(_shadows);

var _transitions = __webpack_require__(128);

var _transitions2 = _interopRequireDefault(_transitions);

var _zIndex = __webpack_require__(134);

var _zIndex2 = _interopRequireDefault(_zIndex);

var _spacing = __webpack_require__(135);

var _spacing2 = _interopRequireDefault(_spacing);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function createMuiTheme() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$palette = options.palette,
      paletteInput = _options$palette === undefined ? {} : _options$palette,
      _options$breakpoints = options.breakpoints,
      breakpointsInput = _options$breakpoints === undefined ? {} : _options$breakpoints,
      _options$mixins = options.mixins,
      mixinsInput = _options$mixins === undefined ? {} : _options$mixins,
      _options$typography = options.typography,
      typographyInput = _options$typography === undefined ? {} : _options$typography,
      shadowsInput = options.shadows,
      other = (0, _objectWithoutProperties3['default'])(options, ['palette', 'breakpoints', 'mixins', 'typography', 'shadows']);

  var palette = (0, _createPalette2['default'])(paletteInput);
  var breakpoints = (0, _createBreakpoints2['default'])(breakpointsInput);

  var muiTheme = (0, _extends3['default'])({
    direction: 'ltr',
    palette: palette,
    typography: (0, _createTypography2['default'])(palette, typographyInput),
    mixins: (0, _createMixins2['default'])(breakpoints, _spacing2['default'], mixinsInput),
    breakpoints: breakpoints,
    shadows: shadowsInput || _shadows2['default']
  }, (0, _deepmerge2['default'])({
    transitions: _transitions2['default'],
    spacing: _spacing2['default'],
    zIndex: _zIndex2['default']
  }, other));

   true ? (0, _warning2['default'])(muiTheme.shadows.length === 25, 'Material-UI: the shadows array provided to createMuiTheme should support 25 elevations.') : void 0;

  return muiTheme;
} // < 1kb payload overhead when lodash/merge is > 3kb.
exports['default'] = createMuiTheme;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(8);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(40);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.1.15 ToLength
var toInteger = __webpack_require__(43);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var shared = __webpack_require__(45)('keys');
var uid = __webpack_require__(24);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// IE 8- don't enum bug keys
module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = toCss;

var _toCssValue = __webpack_require__(29);

var _toCssValue2 = _interopRequireDefault(_toCssValue);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

/**
 * Indent a string.
 * http://jsperf.com/array-join-vs-for
 */
function indentStr(str, indent) {
  var result = '';
  for (var index = 0; index < indent; index++) {
    result += '  ';
  }return result + str;
}

/**
 * Converts a Rule to CSS string.
 */

function toCss(selector, style) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var result = '';

  if (!style) return result;

  var _options$indent = options.indent,
      indent = _options$indent === undefined ? 0 : _options$indent;
  var fallbacks = style.fallbacks;

  indent++;

  // Apply fallbacks first.
  if (fallbacks) {
    // Array syntax {fallbacks: [{prop: value}]}
    if (Array.isArray(fallbacks)) {
      for (var index = 0; index < fallbacks.length; index++) {
        var fallback = fallbacks[index];
        for (var prop in fallback) {
          var value = fallback[prop];
          if (value != null) {
            result += '\n' + indentStr(prop + ': ' + (0, _toCssValue2['default'])(value) + ';', indent);
          }
        }
      }
    }
    // Object syntax {fallbacks: {prop: value}}
    else {
        for (var _prop in fallbacks) {
          var _value = fallbacks[_prop];
          if (_value != null) {
            result += '\n' + indentStr(_prop + ': ' + (0, _toCssValue2['default'])(_value) + ';', indent);
          }
        }
      }
  }

  for (var _prop2 in style) {
    var _value2 = style[_prop2];
    if (_value2 != null && _prop2 !== 'fallbacks') {
      result += '\n' + indentStr(_prop2 + ': ' + (0, _toCssValue2['default'])(_value2) + ';', indent);
    }
  }

  // Allow empty style in this case, because properties will be added dynamically.
  if (!result && !options.allowEmpty) return result;

  indent--;
  result = indentStr(selector + ' {' + result + '\n', indent) + indentStr('}', indent);

  return result;
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SheetsRegistry = __webpack_require__(77);

var _SheetsRegistry2 = _interopRequireDefault(_SheetsRegistry);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

/**
 * This is a global sheets registry. Only DomRenderer will add sheets to it.
 * On the server one should use an own SheetsRegistry instance and add the
 * sheets to it, because you need to make sure to create a new registry for
 * each request in order to not leak sheets across requests.
 */
exports['default'] = new _SheetsRegistry2['default']();

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isInBrowser = __webpack_require__(32);

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var js = ''; /**
              * Export javascript style and css style vendor prefixes.
              * Based on "transform" support test.
              */

var css = '';

// We should not do anything if required serverside.
if (_isInBrowser2['default']) {
  // Order matters. We need to check Webkit the last one because
  // other vendors use to add Webkit prefixes to some properties
  var jsCssMap = {
    Moz: '-moz-',
    // IE did it wrong again ...
    ms: '-ms-',
    O: '-o-',
    Webkit: '-webkit-'
  };
  var style = document.createElement('p').style;
  var testProp = 'Transform';

  for (var key in jsCssMap) {
    if (key + testProp in style) {
      js = key;
      css = jsCssMap[key];
      break;
    }
  }
}

/**
 * Vendor prefix string for the current browser.
 *
 * @type {{js: String, css: String}}
 * @api public
 */
exports['default'] = { js: js, css: css };

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(170), __esModule: true };

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(73);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports["default"] = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2["default"])(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(83);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports["default"] = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3["default"])(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LIBRARY = __webpack_require__(56);
var $export = __webpack_require__(2);
var redefine = __webpack_require__(85);
var hide = __webpack_require__(10);
var has = __webpack_require__(14);
var Iterators = __webpack_require__(22);
var $iterCreate = __webpack_require__(175);
var setToStringTag = __webpack_require__(34);
var getPrototypeOf = __webpack_require__(82);
var ITERATOR = __webpack_require__(3)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function returnThis() {
  return this;
};

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function getMethod(kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS:
        return function keys() {
          return new Constructor(this, kind);
        };
      case VALUES:
        return function values() {
          return new Constructor(this, kind);
        };
    }return function entries() {
      return new Constructor(this, kind);
    };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = !BUGGY && $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() {
      return $native.call(this);
    };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = true;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.f = __webpack_require__(3);

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var META = __webpack_require__(24)('meta');
var isObject = __webpack_require__(8);
var has = __webpack_require__(14);
var setDesc = __webpack_require__(5).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(13)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function setMeta(it) {
  setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {} // weak collections IDs
    } });
};
var fastKey = function fastKey(it, create) {
  // return primitive with prefix
  if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : babelHelpers['typeof'](it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
    // return object ID
  }return it[META].i;
};
var getWeak = function getWeak(it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
    // return hash weak collections IDs
  }return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function onFreeze(it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);
var core = __webpack_require__(1);
var LIBRARY = __webpack_require__(56);
var wksExt = __webpack_require__(57);
var defineProperty = __webpack_require__(5).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(187);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(191);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(83);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3["default"])(superClass)));
  }

  subClass.prototype = (0, _create2["default"])(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2["default"] ? (0, _setPrototypeOf2["default"])(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHANNEL = undefined;

var _defineProperty2 = __webpack_require__(27);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _propTypes = __webpack_require__(9);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Same value used by react-jss
var CHANNEL = exports.CHANNEL = '__THEMING__';

var themeListener = {
  contextTypes: (0, _defineProperty3['default'])({}, CHANNEL, _propTypes2['default'].object),
  initial: function initial(context) {
    if (!context[CHANNEL]) {
      return null;
    }

    return context[CHANNEL].getState();
  },
  subscribe: function subscribe(context, cb) {
    if (!context[CHANNEL]) {
      return null;
    }

    return context[CHANNEL].subscribe(cb);
  },
  unsubscribe: function unsubscribe(context, subscriptionId) {
    if (context[CHANNEL]) {
      context[CHANNEL].unsubscribe(subscriptionId);
    }
  }
};

exports['default'] = themeListener;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withData = exports.DataProvider = undefined;

var _DataProvider = __webpack_require__(101);

var _DataProvider2 = _interopRequireDefault(_DataProvider);

var _withData = __webpack_require__(105);

var _withData2 = _interopRequireDefault(_withData);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.DataProvider = _DataProvider2["default"];
exports.withData = _withData2["default"];

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (true) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(63);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (true) {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = __webpack_require__(9);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports['default'] = _propTypes2['default'].shape({
  query: _propTypes2['default'].func.isRequired,
  on: _propTypes2['default'].func.isRequired,
  cache: _propTypes2['default'].object.isRequired,
  schema: _propTypes2['default'].object.isRequired
});

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = createGenerateClassName;

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var generatorCounter = 0;

// Returns a function which generates unique class names based on counters.
// When new generator function is created, rule counter is reset.
// We need to reset the rule counter for SSR for each request.
//
// It's inspired by
// https://github.com/cssinjs/jss/blob/4e6a05dd3f7b6572fdd3ab216861d9e446c20331/src/utils/createGenerateClassName.js
function createGenerateClassName() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$dangerouslyU = options.dangerouslyUseGlobalCSS,
      dangerouslyUseGlobalCSS = _options$dangerouslyU === undefined ? false : _options$dangerouslyU,
      _options$productionPr = options.productionPrefix,
      productionPrefix = _options$productionPr === undefined ? 'jss' : _options$productionPr;

  var escapeRegex = /([[\].#*$><+~=|^:(),"'`\s])/g;
  var ruleCounter = 0;

  // - HMR can lead to many class name generators being instantiated,
  // so the warning is only triggered in production.
  // - We expect a class name generator to be instantiated per new request on the server,
  // so the warning is only triggered client side.
  // - You can get away with having multiple class name generators
  // by modifying the `productionPrefix`.
  if (false) {
    generatorCounter += 1;

    if (generatorCounter > 2) {
      // eslint-disable-next-line no-console
      console.error(['Material-UI: we have detected more than needed creation of the class name generator.', 'You should only use one class name generator on the client side.', 'If you do otherwise, you take the risk to have conflicting class names in production.'].join('\n'));
    }
  }

  return function (rule, styleSheet) {
    ruleCounter += 1;
     true ? (0, _warning2['default'])(ruleCounter < 1e10, ['Material-UI: you might have a memory leak.', 'The ruleCounter is not supposed to grow that much.'].join('')) : void 0;

    // Code branch the whole block at the expense of more code.
    if (dangerouslyUseGlobalCSS) {
      if (styleSheet && styleSheet.options.classNamePrefix) {
        var prefix = styleSheet.options.classNamePrefix;
        // Sanitize the string as will be used to prefix the generated class name.
        prefix = prefix.replace(escapeRegex, '-');

        if (prefix.match(/^Mui/)) {
          return prefix + '-' + rule.key;
        }

        if (true) {
          return prefix + '-' + rule.key + '-' + ruleCounter;
        }
      }

      if (false) {
        return '' + productionPrefix + ruleCounter;
      }

      return rule.key + '-' + ruleCounter;
    }

    if (false) {
      return '' + productionPrefix + ruleCounter;
    }

    if (styleSheet && styleSheet.options.classNamePrefix) {
      var _prefix = styleSheet.options.classNamePrefix;
      // Sanitize the string as will be used to prefix the generated class name.
      _prefix = _prefix.replace(escapeRegex, '-');

      return _prefix + '-' + rule.key + '-' + ruleCounter;
    }

    return rule.key + '-' + ruleCounter;
  };
}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = !__webpack_require__(6) && !__webpack_require__(13)(function () {
  return Object.defineProperty(__webpack_require__(71)('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(8);
var document = __webpack_require__(4).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = __webpack_require__(14);
var toIObject = __webpack_require__(16);
var arrayIndexOf = __webpack_require__(113)(false);
var IE_PROTO = __webpack_require__(44)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(125), __esModule: true };

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(2);
var core = __webpack_require__(1);
var fails = __webpack_require__(13);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () {
    fn(1);
  }), 'Object', exp);
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jssGlobal = __webpack_require__(136);

var _jssGlobal2 = _interopRequireDefault(_jssGlobal);

var _jssNested = __webpack_require__(159);

var _jssNested2 = _interopRequireDefault(_jssNested);

var _jssCamelCase = __webpack_require__(160);

var _jssCamelCase2 = _interopRequireDefault(_jssCamelCase);

var _jssDefaultUnit = __webpack_require__(161);

var _jssDefaultUnit2 = _interopRequireDefault(_jssDefaultUnit);

var _jssVendorPrefixer = __webpack_require__(163);

var _jssVendorPrefixer2 = _interopRequireDefault(_jssVendorPrefixer);

var _jssPropsSort = __webpack_require__(168);

var _jssPropsSort2 = _interopRequireDefault(_jssPropsSort);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Subset of jss-preset-default with only the plugins the Material-UI
// components are using.
function jssPreset() {
  return {
    plugins: [(0, _jssGlobal2['default'])(), (0, _jssNested2['default'])(), (0, _jssCamelCase2['default'])(), (0, _jssDefaultUnit2['default'])(), (0, _jssVendorPrefixer2['default'])(), (0, _jssPropsSort2['default'])()]
  };
}

exports['default'] = jssPreset;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.createGenerateClassName = exports.sheets = exports.RuleList = exports.SheetsManager = exports.SheetsRegistry = exports.toCssValue = exports.getDynamicStyles = undefined;

var _getDynamicStyles = __webpack_require__(137);

Object.defineProperty(exports, 'getDynamicStyles', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_getDynamicStyles)['default'];
  }
});

var _toCssValue = __webpack_require__(29);

Object.defineProperty(exports, 'toCssValue', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_toCssValue)['default'];
  }
});

var _SheetsRegistry = __webpack_require__(77);

Object.defineProperty(exports, 'SheetsRegistry', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SheetsRegistry)['default'];
  }
});

var _SheetsManager = __webpack_require__(138);

Object.defineProperty(exports, 'SheetsManager', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SheetsManager)['default'];
  }
});

var _RuleList = __webpack_require__(21);

Object.defineProperty(exports, 'RuleList', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_RuleList)['default'];
  }
});

var _sheets = __webpack_require__(49);

Object.defineProperty(exports, 'sheets', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_sheets)['default'];
  }
});

var _createGenerateClassName = __webpack_require__(80);

Object.defineProperty(exports, 'createGenerateClassName', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createGenerateClassName)['default'];
  }
});

var _Jss = __webpack_require__(146);

var _Jss2 = _interopRequireDefault(_Jss);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

/**
 * Creates a new instance of Jss.
 */
var create = exports.create = function create(options) {
  return new _Jss2['default'](options);
};

/**
 * A global Jss instance.
 */
exports['default'] = create();

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Sheets registry to access them all at one place.
 */
var SheetsRegistry = function () {
  function SheetsRegistry() {
    _classCallCheck(this, SheetsRegistry);

    this.registry = [];
  }

  _createClass(SheetsRegistry, [{
    key: 'add',

    /**
     * Register a Style Sheet.
     */
    value: function add(sheet) {
      var registry = this.registry;
      var index = sheet.options.index;

      if (registry.indexOf(sheet) !== -1) return;

      if (registry.length === 0 || index >= this.index) {
        registry.push(sheet);
        return;
      }

      // Find a position.
      for (var i = 0; i < registry.length; i++) {
        if (registry[i].options.index > index) {
          registry.splice(i, 0, sheet);
          return;
        }
      }
    }

    /**
     * Reset the registry.
     */

  }, {
    key: 'reset',
    value: function reset() {
      this.registry = [];
    }

    /**
     * Remove a Style Sheet.
     */

  }, {
    key: 'remove',
    value: function remove(sheet) {
      var index = this.registry.indexOf(sheet);
      this.registry.splice(index, 1);
    }

    /**
     * Convert all attached sheets to a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      return this.registry.filter(function (sheet) {
        return sheet.attached;
      }).map(function (sheet) {
        return sheet.toString(options);
      }).join('\n');
    }
  }, {
    key: 'index',

    /**
     * Current highest index number.
     */
    get: function get() {
      return this.registry.length === 0 ? 0 : this.registry[this.registry.length - 1].options.index;
    }
  }]);

  return SheetsRegistry;
}();

exports['default'] = SheetsRegistry;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _symbolObservable = __webpack_require__(140);

var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

exports['default'] = function (value) {
  return value && value[_symbolObservable2['default']] && value === value[_symbolObservable2['default']]();
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = linkRule;
/**
 * Link rule with CSSStyleRule and nested rules with corresponding nested cssRules if both exists.
 */
function linkRule(rule, cssRule) {
  rule.renderable = cssRule;
  if (rule.rules && cssRule.cssRules) rule.rules.link(cssRule.cssRules);
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

var _StyleSheet = __webpack_require__(81);

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _moduleId = __webpack_require__(145);

var _moduleId2 = _interopRequireDefault(_moduleId);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var maxRules = 1e10;

var env = "development";

/**
 * Returns a function which generates unique class names based on counters.
 * When new generator function is created, rule counter is reseted.
 * We need to reset the rule counter for SSR for each request.
 */

exports['default'] = function () {
  var ruleCounter = 0;
  var defaultPrefix = env === 'production' ? 'c' : '';

  return function (rule, sheet) {
    ruleCounter += 1;

    if (ruleCounter > maxRules) {
      (0, _warning2['default'])(false, '[JSS] You might have a memory leak. Rule counter is at %s.', ruleCounter);
    }

    var prefix = defaultPrefix;
    var jssId = '';

    if (sheet) {
      prefix = sheet.options.classNamePrefix || defaultPrefix;
      if (sheet.options.jss.id != null) jssId += sheet.options.jss.id;
    }

    if (env === 'production') {
      return '' + prefix + _moduleId2['default'] + jssId + ruleCounter;
    }

    return prefix + rule.key + '-' + _moduleId2['default'] + (jssId && '-' + jssId) + '-' + ruleCounter;
  };
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _linkRule = __webpack_require__(79);

var _linkRule2 = _interopRequireDefault(_linkRule);

var _RuleList = __webpack_require__(21);

var _RuleList2 = _interopRequireDefault(_RuleList);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var StyleSheet = function () {
  function StyleSheet(styles, options) {
    _classCallCheck(this, StyleSheet);

    this.attached = false;
    this.deployed = false;
    this.linked = false;
    this.classes = {};
    this.options = _extends({}, options, {
      sheet: this,
      parent: this,
      classes: this.classes
    });
    this.renderer = new options.Renderer(this);
    this.rules = new _RuleList2['default'](this.options);

    for (var name in styles) {
      this.rules.add(name, styles[name]);
    }

    this.rules.process();
  }

  /**
   * Attach renderable to the render tree.
   */

  _createClass(StyleSheet, [{
    key: 'attach',
    value: function attach() {
      if (this.attached) return this;
      if (!this.deployed) this.deploy();
      this.renderer.attach();
      if (!this.linked && this.options.link) this.link();
      this.attached = true;
      return this;
    }

    /**
     * Remove renderable from render tree.
     */

  }, {
    key: 'detach',
    value: function detach() {
      if (!this.attached) return this;
      this.renderer.detach();
      this.attached = false;
      return this;
    }

    /**
     * Add a rule to the current stylesheet.
     * Will insert a rule also after the stylesheet has been rendered first time.
     */

  }, {
    key: 'addRule',
    value: function addRule(name, decl, options) {
      var queue = this.queue;

      // Plugins can create rules.
      // In order to preserve the right order, we need to queue all `.addRule` calls,
      // which happen after the first `rules.add()` call.

      if (this.attached && !queue) this.queue = [];

      var rule = this.rules.add(name, decl, options);
      this.options.jss.plugins.onProcessRule(rule);

      if (this.attached) {
        if (!this.deployed) return rule;
        // Don't insert rule directly if there is no stringified version yet.
        // It will be inserted all together when .attach is called.
        if (queue) queue.push(rule);else {
          this.insertRule(rule);
          if (this.queue) {
            this.queue.forEach(this.insertRule, this);
            this.queue = undefined;
          }
        }
        return rule;
      }

      // We can't add rules to a detached style node.
      // We will redeploy the sheet once user will attach it.
      this.deployed = false;

      return rule;
    }

    /**
     * Insert rule into the StyleSheet
     */

  }, {
    key: 'insertRule',
    value: function insertRule(rule) {
      var renderable = this.renderer.insertRule(rule);
      if (renderable && this.options.link) (0, _linkRule2['default'])(rule, renderable);
    }

    /**
     * Create and add rules.
     * Will render also after Style Sheet was rendered the first time.
     */

  }, {
    key: 'addRules',
    value: function addRules(styles, options) {
      var added = [];
      for (var name in styles) {
        added.push(this.addRule(name, styles[name], options));
      }
      return added;
    }

    /**
     * Get a rule by name.
     */

  }, {
    key: 'getRule',
    value: function getRule(name) {
      return this.rules.get(name);
    }

    /**
     * Delete a rule by name.
     * Returns `true`: if rule has been deleted from the DOM.
     */

  }, {
    key: 'deleteRule',
    value: function deleteRule(name) {
      var rule = this.rules.get(name);

      if (!rule) return false;

      this.rules.remove(rule);

      if (this.attached && rule.renderable) {
        return this.renderer.deleteRule(rule.renderable);
      }

      return true;
    }

    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.rules.indexOf(rule);
    }

    /**
     * Deploy pure CSS string to a renderable.
     */

  }, {
    key: 'deploy',
    value: function deploy() {
      this.renderer.deploy();
      this.deployed = true;
      return this;
    }

    /**
     * Link renderable CSS rules from sheet with their corresponding models.
     */

  }, {
    key: 'link',
    value: function link() {
      var cssRules = this.renderer.getRules();

      // Is undefined when VirtualRenderer is used.
      if (cssRules) this.rules.link(cssRules);
      this.linked = true;
      return this;
    }

    /**
     * Update the function values with a new data.
     */

  }, {
    key: 'update',
    value: function update(name, data) {
      this.rules.update(name, data);
      return this;
    }

    /**
     * Convert rules to a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString(options) {
      return this.rules.toString(options);
    }
  }]);

  return StyleSheet;
}();

exports['default'] = StyleSheet;

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(14);
var toObject = __webpack_require__(20);
var IE_PROTO = __webpack_require__(44)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  }return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(172);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(180);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2["default"] === "function" && babelHelpers["typeof"](_iterator2["default"]) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
} : function (obj) {
  return obj && typeof _symbol2["default"] === "function" && obj.constructor === _symbol2["default"] && obj !== _symbol2["default"].prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
};

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports["default"] = typeof _symbol2["default"] === "function" && _typeof(_iterator2["default"]) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2["default"] === "function" && obj.constructor === _symbol2["default"] && obj !== _symbol2["default"].prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $at = __webpack_require__(174)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(55)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0; // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(10);

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(178);
var global = __webpack_require__(4);
var hide = __webpack_require__(10);
var Iterators = __webpack_require__(22);
var TO_STRING_TAG = __webpack_require__(3)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' + 'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' + 'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' + 'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' + 'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (done, value) {
  return { value: value, done: !!done };
};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.2.2 IsArray(argument)
var cof = __webpack_require__(40);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(72);
var hiddenKeys = __webpack_require__(46).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var pIE = __webpack_require__(25);
var createDesc = __webpack_require__(23);
var toIObject = __webpack_require__(16);
var toPrimitive = __webpack_require__(38);
var has = __webpack_require__(14);
var IE8_DOM_DEFINE = __webpack_require__(70);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(6) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) {/* empty */}
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hide = __webpack_require__(10);
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];else hide(target, key, src[key]);
  }return target;
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
    throw TypeError(name + ': incorrect invocation!');
  }return it;
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(40);
var TAG = __webpack_require__(3)('toStringTag');
// ES3 wrong here
var ARG = cof(function () {
  return arguments;
}()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function tryGet(it, key) {
  try {
    return it[key];
  } catch (e) {/* empty */}
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
  // @@toStringTag case
  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
  // builtinTag case
  : ARG ? cof(O)
  // ES3 arguments fallback
  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(8);
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var getDisplayName = function getDisplayName(Component) {
  if (typeof Component === 'string') {
    return Component;
  }

  if (!Component) {
    return undefined;
  }

  return Component.displayName || Component.name || 'Component';
};

exports['default'] = getDisplayName;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _getDisplayName = __webpack_require__(96);

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var wrapDisplayName = function wrapDisplayName(BaseComponent, hocName) {
  return hocName + '(' + (0, _getDisplayName2['default'])(BaseComponent) + ')';
};

exports['default'] = wrapDisplayName;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Namespaces to avoid conflicts on the context.
 */
var jss = exports.jss = '64a55d578f856d258dc345b094a2a2b3';
var sheetsRegistry = exports.sheetsRegistry = 'd4bd0baacbc52bbd48bbb9eb24344ecd';
var managers = exports.managers = 'b768b78919504fba9de2c03545c5cd3a';
var sheetOptions = exports.sheetOptions = '6fc570d6bd61383819d0f9e7407c452d';

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(11);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactDom = __webpack_require__(100);

var _reactOrbitjs = __webpack_require__(62);

var _locationsList = __webpack_require__(107);

var _locationsList2 = babelHelpers.interopRequireDefault(_locationsList);

var store = window.interceptClient.store;
console.log(store);
(0, _reactDom.render)(_react2['default'].createElement(
  _reactOrbitjs.DataProvider,
  { dataStore: store },
  _react2['default'].createElement(_locationsList2['default'], null)
), document.getElementById('locationsListRoot'));

/***/ }),
/* 100 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _react = __webpack_require__(11);

var _propTypes = __webpack_require__(9);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _dataStoreShape = __webpack_require__(67);

var _dataStoreShape2 = _interopRequireDefault(_dataStoreShape);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : babelHelpers["typeof"](call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : babelHelpers["typeof"](superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var DataProvider = function (_Component) {
  _inherits(DataProvider, _Component);

  function DataProvider(props, context) {
    _classCallCheck(this, DataProvider);

    var _this = _possibleConstructorReturn(this, (DataProvider.__proto__ || Object.getPrototypeOf(DataProvider)).call(this, props, context));

    _this.dataStore = props.dataStore;
    return _this;
  }

  _createClass(DataProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return { dataStore: this.dataStore };
    }
  }, {
    key: "render",
    value: function render() {
      return _react.Children.only(this.props.children);
    }
  }]);

  return DataProvider;
}(_react.Component);

DataProvider.propTypes = {
  dataStore: _dataStoreShape2["default"].isRequired,
  children: _propTypes2["default"].element.isRequired
};

DataProvider.childContextTypes = {
  dataStore: _dataStoreShape2["default"].isRequired
};

exports["default"] = DataProvider;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(63);
var invariant = __webpack_require__(64);
var warning = __webpack_require__(65);
var assign = __webpack_require__(103);

var ReactPropTypesSecret = __webpack_require__(66);
var checkPropTypes = __webpack_require__(104);

module.exports = function (isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
        } else if ("development" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (!manualPropTypeCallCache[cacheKey] &&
          // Avoid spamming the console because they are often not actionable except for lib authors
          manualPropTypeWarningCount < 3) {
            warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
       true ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(false, 'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received %s at index %s.', getPostfixForTypeWarning(checker), i);
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue === 'undefined' ? 'undefined' : babelHelpers['typeof'](propValue)) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue === 'undefined' ? 'undefined' : babelHelpers['typeof'](propValue);
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  var invariant = __webpack_require__(64);
  var warning = __webpack_require__(65);
  var ReactPropTypesSecret = __webpack_require__(66);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, babelHelpers['typeof'](typeSpecs[typeSpecName]));
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error === 'undefined' ? 'undefined' : babelHelpers['typeof'](error));
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

exports["default"] = withData;

var _react = __webpack_require__(11);

var _dataStoreShape = __webpack_require__(67);

var _dataStoreShape2 = _interopRequireDefault(_dataStoreShape);

var _shallowEqual = __webpack_require__(106);

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _hoistNonReactStatics = __webpack_require__(36);

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && ((typeof call === "undefined" ? "undefined" : babelHelpers["typeof"](call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : babelHelpers["typeof"](superClass)));
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var defaultMapRecordsToProps = {};
var defaultMergeProps = function defaultMergeProps(recordProps, parentProps) {
  return _extends({}, parentProps, recordProps);
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

var errorObject = { value: null };

function tryCatch(fn, ctx) {
  try {
    return fn.apply(ctx);
  } catch (e) {
    errorObject.value = e;
    return errorObject;
  }
}

function withData(mapRecordsToProps, mergeProps) {
  var shouldSubscribe = Boolean(mapRecordsToProps);

  var mapRecords = mapRecordsToProps || defaultMapRecordsToProps;
  var finalMergeProps = mergeProps || defaultMergeProps;

  return function wrapWithConnect(WrappedComponent) {
    var componentDisplayName = "WithData(" + getDisplayName(WrappedComponent) + ")";

    function computeMergedProps(stateProps, parentProps) {
      return finalMergeProps(stateProps, parentProps);
    }

    var WithData = function (_Component) {
      _inherits(WithData, _Component);

      _createClass(WithData, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate() {
          return this.haveOwnPropsChanged || this.hasDataStoreChanged;
        }
      }]);

      function WithData(props, context) {
        _classCallCheck(this, WithData);

        var _this = _possibleConstructorReturn(this, (WithData.__proto__ || Object.getPrototypeOf(WithData)).call(this, props, context));

        _initialiseProps.call(_this);

        _this.dataStore = props.dataStore || context.dataStore;

        if (!_this.dataStore) {
          throw new Error("Could not find \"dataStore\" in either the context or " + ("props of \"" + componentDisplayName + "\". ") + "Either wrap the root component in a <DataProvider>, " + ("or explicitly pass \"dataStore\" as a prop to \"" + componentDisplayName + "\"."));
        }

        // const storeState = this.dataStore.getState()
        // this.state = {storeState}
        _this.clearCache();
        return _this;
      }

      _createClass(WithData, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          this.trySubscribe();
        }
      }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
          if (!(0, _shallowEqual2["default"])(nextProps, this.props)) {
            this.haveOwnPropsChanged = true;
          }
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.tryUnsubscribe();
          this.clearCache();
        }
      }, {
        key: "render",
        value: function render() {
          var haveOwnPropsChanged = this.haveOwnPropsChanged,
              hasDataStoreChanged = this.hasDataStoreChanged,
              haveRecordPropsBeenPrecalculated = this.haveRecordPropsBeenPrecalculated,
              recordPropsPrecalculationError = this.recordPropsPrecalculationError,
              renderedElement = this.renderedElement;

          this.haveOwnPropsChanged = false;
          this.hasDataStoreChanged = false;
          this.haveRecordPropsBeenPrecalculated = false;
          this.recordPropsPrecalculationError = null;

          if (recordPropsPrecalculationError) {
            throw recordPropsPrecalculationError;
          }

          var shouldUpdateRecordProps = true;
          if (renderedElement) {
            shouldUpdateRecordProps = hasDataStoreChanged || haveOwnPropsChanged && this.doRecordPropsDependOnOwnProps;
          }

          var haveRecordPropsChanged = false;
          if (haveRecordPropsBeenPrecalculated) {
            haveRecordPropsChanged = true;
          } else if (shouldUpdateRecordProps) {
            haveRecordPropsChanged = this.updateRecordPropsIfNeeded();
          }

          var haveMergedPropsChanged = true;
          if (haveRecordPropsChanged || haveOwnPropsChanged) {
            haveMergedPropsChanged = this.updateMergedPropsIfNeeded();
          } else {
            haveMergedPropsChanged = false;
          }

          if (!haveMergedPropsChanged && renderedElement) {
            return renderedElement;
          }

          this.renderedElement = (0, _react.createElement)(WrappedComponent, this.mergedProps);

          return this.renderedElement;
        }
      }]);

      return WithData;
    }(_react.Component);

    var _initialiseProps = function _initialiseProps() {
      var _this2 = this;

      this.computeRecordProps = function (dataStore, props) {
        var recordQueries = _this2.getRecordQueries(dataStore, props);

        var recordProps = {
          queryStore: function queryStore() {
            return dataStore.query.apply(dataStore, arguments);
          },
          updateStore: function updateStore() {
            return dataStore.update.apply(dataStore, arguments);
          }
        };

        Object.keys(recordQueries).forEach(function (prop) {
          try {
            recordProps[prop] = dataStore.cache.query(recordQueries[prop]);
          } catch (error) {
            console.warn(error.message);
            recordProps[prop] = undefined;
          }
        });

        return recordProps;
      };

      this.getRecordQueries = function (dataStore, props) {
        if (!_this2.mapRecordsIsConfigured || _this2.doRecordPropsDependOnOwnProps && _this2.haveOwnPropsChanged) {
          return _this2.configureMapRecords(dataStore, props);
        }

        return _this2.mapRecordsGivenOwnProps(props);
      };

      this.mapRecordsGivenOwnProps = function (props) {
        return _this2.doRecordPropsDependOnOwnProps ? mapRecords(props) : mapRecords;
      };

      this.configureMapRecords = function (dataStore, props) {
        _this2.doRecordPropsDependOnOwnProps = typeof mapRecords === "function" && mapRecords.length > 0;
        _this2.mapRecordsIsConfigured = true;

        var recordQueries = _this2.mapRecordsGivenOwnProps(props);

        // Iterate all queries, to make a list of models to listen for
        Object.keys(recordQueries).forEach(function (prop) {
          var expression = recordQueries[prop](dataStore.queryBuilder).expression;

          switch (expression.op) {
            case "findRecord":
              _this2.subscribedModels.push(expression.record.type);
              break;

            case "findRecords":
              _this2.subscribedModels.push(expression.type);
              break;

            case "findRelatedRecord":
            case "findRelatedRecords":
              _this2.subscribedModels.push(expression.record.type);
              _this2.subscribedModels.push(_this2.dataStore.schema.models[expression.record.type].relationships[expression.relationship].model);
          }
        });

        _this2.subscribedModels = _this2.subscribedModels.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });

        return recordQueries;
      };

      this.updateRecordPropsIfNeeded = function () {
        var nextRecordProps = _this2.computeRecordProps(_this2.dataStore, _this2.props);

        if (_this2.recordProps && (0, _shallowEqual2["default"])(nextRecordProps, _this2.recordProps)) {
          return false;
        }

        _this2.recordProps = nextRecordProps;
        return true;
      };

      this.updateMergedPropsIfNeeded = function () {
        var nextMergedProps = computeMergedProps(_this2.recordProps, _this2.props);
        if (_this2.mergedProps && (0, _shallowEqual2["default"])(nextMergedProps, _this2.mergedProps)) {
          return false;
        }

        _this2.mergedProps = nextMergedProps;
        return true;
      };

      this.trySubscribe = function () {
        if (shouldSubscribe && !_this2.isListening) {
          _this2.isListening = true;
          _this2.dataStore.on("transform", _this2.handleTransform);
        }
      };

      this.tryUnsubscribe = function () {
        if (_this2.isListening) {
          _this2.isListening = null;
          _this2.dataStore.off("transform", _this2.handleTransform);
        }
      };

      this.clearCache = function () {
        _this2.recordProps = null;
        _this2.mergedProps = null;
        _this2.haveOwnPropsChanged = true;
        _this2.hasDataStoreChanged = true;
        _this2.haveRecordPropsBeenPrecalculated = false;
        _this2.recordPropsPrecalculationError = null;
        _this2.renderedElement = null;
        _this2.mapRecordsIsConfigured = false;
        _this2.subscribedModels = [];
      };

      this.handleTransform = function (transform) {
        if (!_this2.isListening) {
          return;
        }

        // Iterate all transforms, to see if any of those matches a model in the list of queries
        var operationModels = [];
        transform.operations.forEach(function (operation) {
          switch (operation.op) {
            case "addRecord":
            case "removeRecord":
            case "replaceRecord":
            case "replaceKey":
            case "replaceAttribute":
              operationModels.push(operation.record.type);
              break;

            case "addToRelatedRecords":
            case "removeFromRelatedRecords":
            case "replaceRelatedRecord":
              // Add both record and relatedRecord to operationModels, because
              // it can modify both its relationships and inverse relationships.
              operationModels.push(operation.record.type);
              operationModels.push(operation.relatedRecord.type);
              break;

            case "replaceRelatedRecords":
              operationModels.push(operation.record.type);
              operation.relatedRecords.forEach(function (relatedRecord) {
                operationModels.push(relatedRecord.type);
              });
              break;

            default:
              console.warn("This transform operation is not supported in react-orbitjs.");
          }
        });

        operationModels.some(function (model) {
          if (_this2.subscribedModels.indexOf(model) !== -1) {
            _this2.hasDataStoreChanged = true;
            return true;
          }
        });

        _this2.forceUpdate();
      };
    };

    WithData.displayName = componentDisplayName;
    WithData.WrappedComponent = WrappedComponent;
    WithData.contextTypes = {
      dataStore: _dataStoreShape2["default"]
    };
    WithData.propTypes = {
      dataStore: _dataStoreShape2["default"]
    };

    return (0, _hoistNonReactStatics2["default"])(WithData, WrappedComponent);
  };
}

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = shallowEqual;
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(11);

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactOrbitjs = __webpack_require__(62);

var _propTypes = __webpack_require__(9);

var _propTypes2 = babelHelpers.interopRequireDefault(_propTypes);

var _styles = __webpack_require__(108);

var styles = function styles(theme) {
  return {
    card: {
      minWidth: 275
    },
    title: {
      marginBottom: 16,
      fontSize: 14,
      color: theme.palette.text.secondary
    },
    pos: {
      marginBottom: 12,
      color: theme.palette.text.secondary
    }
  };
};

var LocationsList = function (_Component) {
  babelHelpers.inherits(LocationsList, _Component);

  function LocationsList() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, LocationsList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = LocationsList.__proto__ || Object.getPrototypeOf(LocationsList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(LocationsList, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      interceptClient.store.query(function (q) {
        return q.findRecords('node--location');
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var locations = this.props.locations.map(function (location) {
        return _react2['default'].createElement(
          'p',
          { key: location.id },
          location.attributes.title
        );
      });
      return _react2['default'].createElement(
        'div',
        { className: 'locationsList' },
        locations
      );
    }
  }]);
  return LocationsList;
}(_react.Component);

var mapRecordsToProps = function mapRecordsToProps(ownProps) {
  return {
    locations: function locations(q) {
      return q.findRecords("node--location").sort('title');
    }
  };
};

LocationsList.propTypes = {
  locations: _propTypes2['default'].object.isRequired
};

exports['default'] = LocationsList = (0, _reactOrbitjs.withData)(mapRecordsToProps)((0, _styles.withStyles)(styles)(LocationsList));

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createGenerateClassName = __webpack_require__(68);

Object.defineProperty(exports, 'createGenerateClassName', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createGenerateClassName)['default'];
  }
});

var _createMuiTheme = __webpack_require__(37);

Object.defineProperty(exports, 'createMuiTheme', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createMuiTheme)['default'];
  }
});

var _jssPreset = __webpack_require__(75);

Object.defineProperty(exports, 'jssPreset', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_jssPreset)['default'];
  }
});

var _MuiThemeProvider = __webpack_require__(169);

Object.defineProperty(exports, 'MuiThemeProvider', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MuiThemeProvider)['default'];
  }
});

var _withStyles = __webpack_require__(196);

Object.defineProperty(exports, 'withStyles', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_withStyles)['default'];
  }
});

var _withTheme = __webpack_require__(222);

Object.defineProperty(exports, 'withTheme', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_withTheme)['default'];
  }
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(110), __esModule: true };

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(111);
module.exports = __webpack_require__(1).Object.assign;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(2);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(112) });

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)

var getKeys = __webpack_require__(19);
var gOPS = __webpack_require__(47);
var pIE = __webpack_require__(25);
var toObject = __webpack_require__(20);
var IObject = __webpack_require__(39);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(13)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(16);
var toLength = __webpack_require__(42);
var toAbsoluteIndex = __webpack_require__(114);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toInteger = __webpack_require__(43);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = __webpack_require__(17);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports['default'] = createTypography;

var _deepmerge = __webpack_require__(26);

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// < 1kb payload overhead when lodash/merge is > 3kb.

function round(value) {
  return Math.round(value * 1e5) / 1e5;
}

function createTypography(palette, typography) {
  var _ref = typeof typography === 'function' ? typography(palette) : typography,
      _ref$fontFamily = _ref.fontFamily,
      fontFamily = _ref$fontFamily === undefined ? '"Roboto", "Helvetica", "Arial", sans-serif' : _ref$fontFamily,
      _ref$fontSize = _ref.fontSize,
      fontSize = _ref$fontSize === undefined ? 14 : _ref$fontSize,
      _ref$fontWeightLight = _ref.fontWeightLight,
      fontWeightLight = _ref$fontWeightLight === undefined ? 300 : _ref$fontWeightLight,
      _ref$fontWeightRegula = _ref.fontWeightRegular,
      fontWeightRegular = _ref$fontWeightRegula === undefined ? 400 : _ref$fontWeightRegula,
      _ref$fontWeightMedium = _ref.fontWeightMedium,
      fontWeightMedium = _ref$fontWeightMedium === undefined ? 500 : _ref$fontWeightMedium,
      _ref$htmlFontSize = _ref.htmlFontSize,
      htmlFontSize = _ref$htmlFontSize === undefined ? 16 : _ref$htmlFontSize,
      other = (0, _objectWithoutProperties3['default'])(_ref, ['fontFamily', 'fontSize', 'fontWeightLight', 'fontWeightRegular', 'fontWeightMedium', 'htmlFontSize']);

  function pxToRem(value) {
    return value / htmlFontSize + 'rem';
  }

  return (0, _deepmerge2['default'])({
    pxToRem: pxToRem,
    round: round,
    fontFamily: fontFamily,
    fontSize: fontSize,
    fontWeightLight: fontWeightLight,
    fontWeightRegular: fontWeightRegular,
    fontWeightMedium: fontWeightMedium,
    display4: {
      fontSize: pxToRem(112),
      fontWeight: fontWeightLight,
      fontFamily: fontFamily,
      letterSpacing: '-.04em',
      lineHeight: round(128 / 112) + 'em',
      marginLeft: '-.06em',
      color: palette.text.secondary
    },
    display3: {
      fontSize: pxToRem(56),
      fontWeight: fontWeightRegular,
      fontFamily: fontFamily,
      letterSpacing: '-.02em',
      lineHeight: round(73 / 56) + 'em',
      marginLeft: '-.04em',
      color: palette.text.secondary
    },
    display2: {
      fontSize: pxToRem(45),
      fontWeight: fontWeightRegular,
      fontFamily: fontFamily,
      lineHeight: round(48 / 45) + 'em',
      marginLeft: '-.04em',
      color: palette.text.secondary
    },
    display1: {
      fontSize: pxToRem(34),
      fontWeight: fontWeightRegular,
      fontFamily: fontFamily,
      lineHeight: round(41 / 34) + 'em',
      marginLeft: '-.04em',
      color: palette.text.secondary
    },
    headline: {
      fontSize: pxToRem(24),
      fontWeight: fontWeightRegular,
      fontFamily: fontFamily,
      lineHeight: round(32.5 / 24) + 'em',
      color: palette.text.primary
    },
    title: {
      fontSize: pxToRem(21),
      fontWeight: fontWeightMedium,
      fontFamily: fontFamily,
      lineHeight: round(24.5 / 21) + 'em',
      color: palette.text.primary
    },
    subheading: {
      fontSize: pxToRem(16),
      fontWeight: fontWeightRegular,
      fontFamily: fontFamily,
      lineHeight: round(24 / 16) + 'em',
      color: palette.text.primary
    },
    body2: {
      fontSize: pxToRem(14),
      fontWeight: fontWeightMedium,
      fontFamily: fontFamily,
      lineHeight: round(24 / 14) + 'em',
      color: palette.text.primary
    },
    body1: {
      fontSize: pxToRem(14),
      fontWeight: fontWeightRegular,
      fontFamily: fontFamily,
      lineHeight: round(20.5 / 14) + 'em',
      color: palette.text.primary
    },
    caption: {
      fontSize: pxToRem(12),
      fontWeight: fontWeightRegular,
      fontFamily: fontFamily,
      lineHeight: round(16.5 / 12) + 'em',
      color: palette.text.secondary
    },
    button: {
      fontSize: pxToRem(fontSize),
      textTransform: 'uppercase',
      fontWeight: fontWeightMedium,
      fontFamily: fontFamily
    }
  }, other, {
    clone: false // No need to clone deep
  });
}

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keys = undefined;

var _extends2 = __webpack_require__(7);

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = __webpack_require__(17);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports['default'] = createBreakpoints;

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Sorted ASC by size. That's important.
// It can't be configured as it's used statically for propTypes.
var keys = exports.keys = ['xs', 'sm', 'md', 'lg', 'xl'];

// Keep in mind that @media is inclusive by the CSS specification.
function createBreakpoints(breakpoints) {
  var _breakpoints$values = breakpoints.values,
      values = _breakpoints$values === undefined ? {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
  } : _breakpoints$values,
      _breakpoints$unit = breakpoints.unit,
      unit = _breakpoints$unit === undefined ? 'px' : _breakpoints$unit,
      _breakpoints$step = breakpoints.step,
      step = _breakpoints$step === undefined ? 5 : _breakpoints$step,
      other = (0, _objectWithoutProperties3['default'])(breakpoints, ['values', 'unit', 'step']);

  function up(key) {
    var value = typeof values[key] === 'number' ? values[key] : key;
    return '@media (min-width:' + value + unit + ')';
  }

  function down(key) {
    var endIndex = keys.indexOf(key) + 1;
    var upperbound = values[keys[endIndex]];

    if (endIndex === keys.length) {
      // xl down applies to all sizes
      return up('xs');
    }

    var value = typeof upperbound === 'number' && endIndex > 0 ? upperbound : key;
    return '@media (max-width:' + (value - step / 100) + unit + ')';
  }

  function between(start, end) {
    var endIndex = keys.indexOf(end) + 1;

    if (endIndex === keys.length) {
      return up(start);
    }

    return '@media (min-width:' + values[start] + unit + ') and ' + ('(max-width:' + (values[keys[endIndex]] - step / 100) + unit + ')');
  }

  function only(key) {
    return between(key, key);
  }

  function width(key) {
    return values[key];
  }

  return (0, _extends3['default'])({
    keys: keys,
    values: values,
    up: up,
    down: down,
    between: between,
    only: only,
    width: width
  }, other);
}

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dark = exports.light = undefined;

var _extends2 = __webpack_require__(7);

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = __webpack_require__(17);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports['default'] = createPalette;

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

var _deepmerge = __webpack_require__(26);

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _indigo = __webpack_require__(118);

var _indigo2 = _interopRequireDefault(_indigo);

var _pink = __webpack_require__(119);

var _pink2 = _interopRequireDefault(_pink);

var _grey = __webpack_require__(120);

var _grey2 = _interopRequireDefault(_grey);

var _red = __webpack_require__(121);

var _red2 = _interopRequireDefault(_red);

var _common = __webpack_require__(122);

var _common2 = _interopRequireDefault(_common);

var _colorManipulator = __webpack_require__(123);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// < 1kb payload overhead when lodash/merge is > 3kb.
var light = exports.light = {
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: 'rgba(0, 0, 0, 0.87)',
    // Secondary text.
    secondary: 'rgba(0, 0, 0, 0.54)',
    // Disabled text have even lower visual prominence.
    disabled: 'rgba(0, 0, 0, 0.38)',
    // Text hints.
    hint: 'rgba(0, 0, 0, 0.38)'
  },
  // The color used to divide different elements.
  divider: 'rgba(0, 0, 0, 0.12)',
  // The background colors used to style the surfaces.
  // Consistency between these values is important.
  background: {
    paper: _common2['default'].white,
    default: _grey2['default'][50],
    appBar: _grey2['default'][100],
    chip: _grey2['default'][300],
    avatar: _grey2['default'][400]
  },
  // The colors used to style the action elements.
  action: {
    // The color of an active action like an icon button.
    active: 'rgba(0, 0, 0, 0.54)',
    // The color of an hovered action.
    hover: 'rgba(0, 0, 0, 0.14)',
    // The color of a selected action.
    selected: 'rgba(0, 0, 0, 0.08)',
    // The color of a disabled action.
    disabled: 'rgba(0, 0, 0, 0.26)',
    // The background color of a disabled action.
    disabledBackground: 'rgba(0, 0, 0, 0.12)'
  }
};

var dark = exports.dark = {
  text: {
    primary: _common2['default'].fullWhite,
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    hint: 'rgba(255, 255, 255, 0.5)',
    icon: 'rgba(255, 255, 255, 0.5)'
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  background: {
    paper: _grey2['default'][800],
    default: '#303030',
    appBar: _grey2['default'][900],
    chip: _grey2['default'][700],
    avatar: _grey2['default'][600]
  },
  action: {
    active: _common2['default'].fullWhite,
    hover: 'rgba(255, 255, 255, 0.14)',
    selected: 'rgba(255, 255, 255, 0.8)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)'
  }
};

function addLightOrDark(intent, direction, shade, tonalOffset) {
  if (!intent[direction]) {
    if (intent.hasOwnProperty(shade)) {
      intent[direction] = intent[shade];
    } else if (direction === 'light') {
      intent.light = (0, _colorManipulator.lighten)(intent.main, tonalOffset);
    } else if (direction === 'dark') {
      intent.dark = (0, _colorManipulator.darken)(intent.main, tonalOffset * 1.5);
    }
  }
}

function createPalette(palette) {
  var _palette$primary = palette.primary,
      primary = _palette$primary === undefined ? {
    light: _indigo2['default'][300],
    main: _indigo2['default'][500],
    dark: _indigo2['default'][700]
  } : _palette$primary,
      _palette$secondary = palette.secondary,
      secondary = _palette$secondary === undefined ? {
    light: _pink2['default'].A200,
    main: _pink2['default'].A400,
    dark: _pink2['default'].A700
  } : _palette$secondary,
      _palette$error = palette.error,
      error = _palette$error === undefined ? {
    main: _red2['default'][500]
  } : _palette$error,
      _palette$type = palette.type,
      type = _palette$type === undefined ? 'light' : _palette$type,
      _palette$contrastThre = palette.contrastThreshold,
      contrastThreshold = _palette$contrastThre === undefined ? 3 : _palette$contrastThre,
      _palette$tonalOffset = palette.tonalOffset,
      tonalOffset = _palette$tonalOffset === undefined ? 0.2 : _palette$tonalOffset,
      other = (0, _objectWithoutProperties3['default'])(palette, ['primary', 'secondary', 'error', 'type', 'contrastThreshold', 'tonalOffset']);

  function getContrastText(background) {
    // Use the same logic as
    // Bootstrap: https://github.com/twbs/bootstrap/blob/1d6e3710dd447de1a200f29e8fa521f8a0908f70/scss/_functions.scss#L59
    // and material-components-web https://github.com/material-components/material-components-web/blob/ac46b8863c4dab9fc22c4c662dc6bd1b65dd652f/packages/mdc-theme/_functions.scss#L54
    var contrastText = (0, _colorManipulator.getContrastRatio)(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;

    if (true) {
      var contrast = (0, _colorManipulator.getContrastRatio)(background, contrastText);
       true ? (0, _warning2['default'])(contrast >= 3, ['Material-UI: the contrast ratio of ' + contrast + ':1 for ' + contrastText + ' on ' + background, 'falls below the WACG recommended absolute minimum contrast ratio of 3:1.', 'https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast'].join('\n')) : void 0;
    }

    return contrastText;
  }

  function augmentColor(color, mainShade, lightShade, darkShade) {
    if (!color.main && color[mainShade]) {
      color.main = color[mainShade];
    }
    addLightOrDark(color, 'light', lightShade, tonalOffset);
    addLightOrDark(color, 'dark', darkShade, tonalOffset);
    if (!color.contrastText) {
      color.contrastText = getContrastText(color.main);
    }
  }

  augmentColor(primary, 500, 300, 700);
  augmentColor(secondary, 'A400', 'A200', 'A700');
  augmentColor(error, 500, 300, 700);

  var types = { dark: dark, light: light };

   true ? (0, _warning2['default'])(types[type], 'Material-UI: the palette type `' + type + '` is not supported.') : void 0;

  var paletteOutput = (0, _deepmerge2['default'])((0, _extends3['default'])({
    // A collection of common colors.
    common: _common2['default'],
    // The palette type, can be light or dark.
    type: type,
    // The colors used to represent primary interface elements for a user.
    primary: primary,
    // The colors used to represent secondary interface elements for a user.
    secondary: secondary,
    // The colors used to represent interface elements that the user should be made aware of.
    error: error,
    // The grey color.
    grey: _grey2['default'],
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: contrastThreshold,
    // Take a background color and return the color of the text to maximize the contrast.
    getContrastText: getContrastText,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: tonalOffset,
    // The light and dark type object.
    types: types
  }, types[type]), other, {
    clone: false // No need to clone deep
  });

  return paletteOutput;
}

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var indigo = {
  50: '#e8eaf6',
  100: '#c5cae9',
  200: '#9fa8da',
  300: '#7986cb',
  400: '#5c6bc0',
  500: '#3f51b5',
  600: '#3949ab',
  700: '#303f9f',
  800: '#283593',
  900: '#1a237e',
  A100: '#8c9eff',
  A200: '#536dfe',
  A400: '#3d5afe',
  A700: '#304ffe'
};

exports['default'] = indigo;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var pink = {
  50: '#fce4ec',
  100: '#f8bbd0',
  200: '#f48fb1',
  300: '#f06292',
  400: '#ec407a',
  500: '#e91e63',
  600: '#d81b60',
  700: '#c2185b',
  800: '#ad1457',
  900: '#880e4f',
  A100: '#ff80ab',
  A200: '#ff4081',
  A400: '#f50057',
  A700: '#c51162'
};

exports['default'] = pink;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var grey = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#d5d5d5',
  A200: '#aaaaaa',
  A400: '#303030',
  A700: '#616161'
};

exports['default'] = grey;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var red = {
  50: '#ffebee',
  100: '#ffcdd2',
  200: '#ef9a9a',
  300: '#e57373',
  400: '#ef5350',
  500: '#f44336',
  600: '#e53935',
  700: '#d32f2f',
  800: '#c62828',
  900: '#b71c1c',
  A100: '#ff8a80',
  A200: '#ff5252',
  A400: '#ff1744',
  A700: '#d50000'
};

exports['default'] = red;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var common = {
  transparent: 'transparent',
  black: '#000',
  fullBlack: 'rgba(0, 0, 0, 1)',
  white: '#fff',
  fullWhite: 'rgba(255, 255, 255, 1)'
};

exports['default'] = common;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertHexToRGB = convertHexToRGB;
exports.decomposeColor = decomposeColor;
exports.recomposeColor = recomposeColor;
exports.getContrastRatio = getContrastRatio;
exports.getLuminance = getLuminance;
exports.emphasize = emphasize;
exports.fade = fade;
exports.darken = darken;
exports.lighten = lighten;

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * @param {number} value The value to be clamped
 * @param {number} min The lower boundary of the output range
 * @param {number} max The upper boundary of the output range
 * @returns {number} A number in the range [min, max]
 */
function clamp(value) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

   true ? (0, _warning2['default'])(value >= min && value <= max, 'Material-UI: the value provided ' + value + ' is out of range [' + min + ', ' + max + '].') : void 0;

  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

/**
 * Converts a color from CSS hex format to CSS rgb format.
 *
 *  @param {string} color - Hex color, i.e. #nnn or #nnnnnn
 *  @returns {string} A CSS rgb color string
 */
//  weak
/* eslint-disable no-use-before-define */

function convertHexToRGB(color) {
  color = color.substr(1);

  var re = new RegExp('.{1,' + color.length / 3 + '}', 'g');
  var colors = color.match(re);

  if (colors && colors[0].length === 1) {
    colors = colors.map(function (n) {
      return n + n;
    });
  }

  return colors ? 'rgb(' + colors.map(function (n) {
    return parseInt(n, 16);
  }).join(', ') + ')' : '';
}

/**
 * Returns an object with the type and values of a color.
 *
 * Note: Does not support rgb % values.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {object} - A MUI color object: {type: string, values: number[]}
 */
function decomposeColor(color) {
  if (color.charAt(0) === '#') {
    return decomposeColor(convertHexToRGB(color));
  }

  var marker = color.indexOf('(');
  var type = color.substring(0, marker);
  var values = color.substring(marker + 1, color.length - 1).split(',');
  values = values.map(function (value) {
    return parseFloat(value);
  });

  return { type: type, values: values };
}

/**
 * Converts a color object with type and values to a string.
 *
 * @param {object} color - Decomposed color
 * @param {string} color.type - One of: 'rgb', 'rgba', 'hsl', 'hsla'
 * @param {array} color.values - [n,n,n] or [n,n,n,n]
 * @returns {string} A CSS color string
 */
function recomposeColor(color) {
  var type = color.type;
  var values = color.values;

  if (type.indexOf('rgb') > -1) {
    // Only convert the first 3 values to int (i.e. not alpha)
    values = values.map(function (n, i) {
      return i < 3 ? parseInt(n, 10) : n;
    });
  }

  if (type.indexOf('hsl') > -1) {
    values[1] = values[1] + '%';
    values[2] = values[2] + '%';
  }

  return color.type + '(' + values.join(', ') + ')';
}

/**
 * Calculates the contrast ratio between two colors.
 *
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param {string} foreground - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {string} background - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {number} A contrast ratio value in the range 0 - 21.
 */
function getContrastRatio(foreground, background) {
  var lumA = getLuminance(foreground);
  var lumB = getLuminance(background);
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}

/**
 * The relative brightness of any point in a color space,
 * normalized to 0 for darkest black and 1 for lightest white.
 *
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @returns {number} The relative brightness of the color in the range 0 - 1
 */
function getLuminance(color) {
  var decomposedColor = decomposeColor(color);

  if (decomposedColor.type.indexOf('rgb') > -1) {
    var rgb = decomposedColor.values.map(function (val) {
      val /= 255; // normalized
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    // Truncate at 3 digits
    return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
  } else if (decomposedColor.type.indexOf('hsl') > -1) {
    return decomposedColor.values[2] / 100;
  }

  throw new Error('Material-UI: unsupported `' + color + '` color.');
}

/**
 * Darken or lighten a colour, depending on its luminance.
 * Light colors are darkened, dark colors are lightened.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {number} coefficient=0.15 - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */
function emphasize(color) {
  var coefficient = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.15;

  return getLuminance(color) > 0.5 ? darken(color, coefficient) : lighten(color, coefficient);
}

/**
 * Set the absolute transparency of a color.
 * Any existing alpha values are overwritten.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {number} value - value to set the alpha channel to in the range 0 -1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */
function fade(color, value) {
   true ? (0, _warning2['default'])(color, 'Material-UI: missing color argument in fade(' + color + ', ' + value + ').') : void 0;

  if (!color) return color;

  color = decomposeColor(color);
  value = clamp(value);

  if (color.type === 'rgb' || color.type === 'hsl') {
    color.type += 'a';
  }
  color.values[3] = value;

  return recomposeColor(color);
}

/**
 * Darkens a color.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {number} coefficient - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */
function darken(color, coefficient) {
   true ? (0, _warning2['default'])(color, 'Material-UI: missing color argument in darken(' + color + ', ' + coefficient + ').') : void 0;

  if (!color) return color;

  color = decomposeColor(color);
  coefficient = clamp(coefficient);

  if (color.type.indexOf('hsl') > -1) {
    color.values[2] *= 1 - coefficient;
  } else if (color.type.indexOf('rgb') > -1) {
    for (var i = 0; i < 3; i += 1) {
      color.values[i] *= 1 - coefficient;
    }
  }
  return recomposeColor(color);
}

/**
 * Lightens a color.
 *
 * @param {string} color - CSS color, i.e. one of: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla()
 * @param {number} coefficient - multiplier in the range 0 - 1
 * @returns {string} A CSS color string. Hex input values are returned as rgb
 */
function lighten(color, coefficient) {
   true ? (0, _warning2['default'])(color, 'Material-UI: missing color argument in lighten(' + color + ', ' + coefficient + ').') : void 0;

  if (!color) return color;

  color = decomposeColor(color);
  coefficient = clamp(coefficient);

  if (color.type.indexOf('hsl') > -1) {
    color.values[2] += (100 - color.values[2]) * coefficient;
  } else if (color.type.indexOf('rgb') > -1) {
    for (var i = 0; i < 3; i += 1) {
      color.values[i] += (255 - color.values[i]) * coefficient;
    }
  }

  return recomposeColor(color);
}

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__(27);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = __webpack_require__(7);

var _extends4 = _interopRequireDefault(_extends3);

exports['default'] = createMixins;

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function createMixins(breakpoints, spacing, mixins) {
  var _toolbar;

  return (0, _extends4['default'])({
    gutters: function gutters(styles) {
      return (0, _extends4['default'])({
        paddingLeft: spacing.unit * 2,
        paddingRight: spacing.unit * 2
      }, styles, (0, _defineProperty3['default'])({}, breakpoints.up('sm'), (0, _extends4['default'])({
        paddingLeft: spacing.unit * 3,
        paddingRight: spacing.unit * 3
      }, styles[breakpoints.up('sm')])));
    },
    toolbar: (_toolbar = {
      minHeight: 56
    }, (0, _defineProperty3['default'])(_toolbar, breakpoints.up('xs') + ' and (orientation: landscape)', {
      minHeight: 48
    }), (0, _defineProperty3['default'])(_toolbar, breakpoints.up('sm'), {
      minHeight: 64
    }), _toolbar)
  }, mixins);
}

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(126);
var $Object = __webpack_require__(1).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(2);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(6), 'Object', { defineProperty: __webpack_require__(5).f });

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var shadowKeyUmbraOpacity = 0.2;
var shadowKeyPenumbraOpacity = 0.14;
var shadowAmbientShadowOpacity = 0.12;

function createShadow() {
  return [(arguments.length <= 0 ? undefined : arguments[0]) + 'px ' + (arguments.length <= 1 ? undefined : arguments[1]) + 'px ' + (arguments.length <= 2 ? undefined : arguments[2]) + 'px ' + (arguments.length <= 3 ? undefined : arguments[3]) + 'px rgba(0, 0, 0, ' + shadowKeyUmbraOpacity + ')', (arguments.length <= 4 ? undefined : arguments[4]) + 'px ' + (arguments.length <= 5 ? undefined : arguments[5]) + 'px ' + (arguments.length <= 6 ? undefined : arguments[6]) + 'px ' + (arguments.length <= 7 ? undefined : arguments[7]) + 'px rgba(0, 0, 0, ' + shadowKeyPenumbraOpacity + ')', (arguments.length <= 8 ? undefined : arguments[8]) + 'px ' + (arguments.length <= 9 ? undefined : arguments[9]) + 'px ' + (arguments.length <= 10 ? undefined : arguments[10]) + 'px ' + (arguments.length <= 11 ? undefined : arguments[11]) + 'px rgba(0, 0, 0, ' + shadowAmbientShadowOpacity + ')'].join(',');
}

var shadows = ['none', createShadow(0, 1, 3, 0, 0, 1, 1, 0, 0, 2, 1, -1), createShadow(0, 1, 5, 0, 0, 2, 2, 0, 0, 3, 1, -2), createShadow(0, 1, 8, 0, 0, 3, 4, 0, 0, 3, 3, -2), createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];

exports['default'] = shadows;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNumber = exports.isString = exports.formatMs = exports.duration = exports.easing = undefined;

var _keys = __webpack_require__(28);

var _keys2 = _interopRequireDefault(_keys);

var _objectWithoutProperties2 = __webpack_require__(17);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _isNan = __webpack_require__(131);

var _isNan2 = _interopRequireDefault(_isNan);

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// Follow https://material.google.com/motion/duration-easing.html#duration-easing-natural-easing-curves
// to learn the context in which each easing should be used.
var easing = exports.easing = {
  // This is the most common easing curve.
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
};

// Follow https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
// to learn when use what timing

/* eslint-disable no-param-reassign */

var duration = exports.duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195
};

var formatMs = exports.formatMs = function formatMs(milliseconds) {
  return Math.round(milliseconds) + 'ms';
};
var isString = exports.isString = function isString(value) {
  return typeof value === 'string';
};
var isNumber = exports.isNumber = function isNumber(value) {
  return !(0, _isNan2['default'])(parseFloat(value));
};

/**
 * @param {string|Array} props
 * @param {object} param
 * @param {string} param.prop
 * @param {number} param.duration
 * @param {string} param.easing
 * @param {number} param.delay
 */
exports['default'] = {
  easing: easing,
  duration: duration,
  create: function create() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['all'];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$duration = options.duration,
        durationOption = _options$duration === undefined ? duration.standard : _options$duration,
        _options$easing = options.easing,
        easingOption = _options$easing === undefined ? easing.easeInOut : _options$easing,
        _options$delay = options.delay,
        delay = _options$delay === undefined ? 0 : _options$delay,
        other = (0, _objectWithoutProperties3['default'])(options, ['duration', 'easing', 'delay']);

     true ? (0, _warning2['default'])(isString(props) || Array.isArray(props), 'Material-UI: argument "props" must be a string or Array') : void 0;
     true ? (0, _warning2['default'])(isNumber(durationOption), 'Material-UI: argument "duration" must be a number but found ' + durationOption) : void 0;
     true ? (0, _warning2['default'])(isString(easingOption), 'Material-UI: argument "easing" must be a string') : void 0;
     true ? (0, _warning2['default'])(isNumber(delay), 'Material-UI: argument "delay" must be a string') : void 0;
     true ? (0, _warning2['default'])((0, _keys2['default'])(other).length === 0, 'Material-UI: unrecognized argument(s) [' + (0, _keys2['default'])(other).join(',') + ']') : void 0;

    return (Array.isArray(props) ? props : [props]).map(function (animatedProp) {
      return animatedProp + ' ' + formatMs(durationOption) + ' ' + easingOption + ' ' + formatMs(delay);
    }).join(',');
  },
  getAutoHeightDuration: function getAutoHeightDuration(height) {
    if (!height) {
      return 0;
    }

    var constant = height / 36;

    // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
    return Math.round((4 + 15 * Math.pow(constant, 0.25) + constant / 5) * 10);
  }
};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(130);
module.exports = __webpack_require__(1).Object.keys;

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(20);
var $keys = __webpack_require__(19);

__webpack_require__(74)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(132), __esModule: true };

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(133);
module.exports = __webpack_require__(1).Number.isNaN;

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(2);

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// We need to centralize the zIndex definitions as they work
// like global values in the browser.
var zIndex = {
  mobileStepper: 1000,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
};

exports["default"] = zIndex;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  // All components align to an 8dp square baseline grid for mobile, tablet, and desktop.
  // https://material.io/guidelines/layout/metrics-keylines.html#metrics-keylines-baseline-grids
  unit: 8
};

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

exports['default'] = jssGlobal;

var _jss = __webpack_require__(76);

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var propKey = '@global';
var prefixKey = '@global ';

var GlobalContainerRule = function () {
  function GlobalContainerRule(key, styles, options) {
    _classCallCheck(this, GlobalContainerRule);

    this.type = 'global';

    this.key = key;
    this.options = options;
    this.rules = new _jss.RuleList(_extends({}, options, {
      parent: this
    }));

    for (var selector in styles) {
      this.rules.add(selector, styles[selector], { selector: selector });
    }

    this.rules.process();
  }

  /**
   * Get a rule.
   */

  _createClass(GlobalContainerRule, [{
    key: 'getRule',
    value: function getRule(name) {
      return this.rules.get(name);
    }

    /**
     * Create and register rule, run plugins.
     */

  }, {
    key: 'addRule',
    value: function addRule(name, style, options) {
      var rule = this.rules.add(name, style, options);
      this.options.jss.plugins.onProcessRule(rule);
      return rule;
    }

    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.rules.indexOf(rule);
    }

    /**
     * Generates a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString() {
      return this.rules.toString();
    }
  }]);

  return GlobalContainerRule;
}();

var GlobalPrefixedRule = function () {
  function GlobalPrefixedRule(name, style, options) {
    _classCallCheck(this, GlobalPrefixedRule);

    this.name = name;
    this.options = options;
    var selector = name.substr(prefixKey.length);
    this.rule = options.jss.createRule(selector, style, _extends({}, options, {
      parent: this,
      selector: selector
    }));
  }

  _createClass(GlobalPrefixedRule, [{
    key: 'toString',
    value: function toString(options) {
      return this.rule.toString(options);
    }
  }]);

  return GlobalPrefixedRule;
}();

var separatorRegExp = /\s*,\s*/g;

function addScope(selector, scope) {
  var parts = selector.split(separatorRegExp);
  var scoped = '';
  for (var i = 0; i < parts.length; i++) {
    scoped += scope + ' ' + parts[i].trim();
    if (parts[i + 1]) scoped += ', ';
  }
  return scoped;
}

function handleNestedGlobalContainerRule(rule) {
  var options = rule.options,
      style = rule.style;

  var rules = style[propKey];

  if (!rules) return;

  for (var name in rules) {
    options.sheet.addRule(name, rules[name], _extends({}, options, {
      selector: addScope(name, rule.selector)
    }));
  }

  delete style[propKey];
}

function handlePrefixedGlobalRule(rule) {
  var options = rule.options,
      style = rule.style;

  for (var prop in style) {
    if (prop.substr(0, propKey.length) !== propKey) continue;

    var selector = addScope(prop.substr(propKey.length), rule.selector);
    options.sheet.addRule(selector, style[prop], _extends({}, options, {
      selector: selector
    }));
    delete style[prop];
  }
}

/**
 * Convert nested rules to separate, remove them from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
function jssGlobal() {
  function onCreateRule(name, styles, options) {
    if (name === propKey) {
      return new GlobalContainerRule(name, styles, options);
    }

    if (name[0] === '@' && name.substr(0, prefixKey.length) === prefixKey) {
      return new GlobalPrefixedRule(name, styles, options);
    }

    var parent = options.parent;

    if (parent) {
      if (parent.type === 'global' || parent.options.parent.type === 'global') {
        options.global = true;
      }
    }

    if (options.global) options.selector = name;

    return null;
  }

  function onProcessRule(rule) {
    if (rule.type !== 'style') return;

    handleNestedGlobalContainerRule(rule);
    handlePrefixedGlobalRule(rule);
  }

  return { onCreateRule: onCreateRule, onProcessRule: onProcessRule };
}

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && babelHelpers["typeof"](Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
};

/**
 * Extracts a styles object with only props that contain function values.
 */
exports['default'] = function (styles) {
  // eslint-disable-next-line no-shadow
  function extract(styles) {
    var to = null;

    for (var key in styles) {
      var value = styles[key];
      var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

      if (type === 'function') {
        if (!to) to = {};
        to[key] = value;
      } else if (type === 'object' && value !== null && !Array.isArray(value)) {
        var extracted = extract(value);
        if (extracted) {
          if (!to) to = {};
          to[key] = extracted;
        }
      }
    }

    return to;
  }

  return extract(styles);
};

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * SheetsManager is like a WeakMap which is designed to count StyleSheet
 * instances and attach/detach automatically.
 */
var SheetsManager = function () {
  function SheetsManager() {
    _classCallCheck(this, SheetsManager);

    this.sheets = [];
    this.refs = [];
    this.keys = [];
  }

  _createClass(SheetsManager, [{
    key: 'get',
    value: function get(key) {
      var index = this.keys.indexOf(key);
      return this.sheets[index];
    }
  }, {
    key: 'add',
    value: function add(key, sheet) {
      var sheets = this.sheets,
          refs = this.refs,
          keys = this.keys;

      var index = sheets.indexOf(sheet);

      if (index !== -1) return index;

      sheets.push(sheet);
      refs.push(0);
      keys.push(key);

      return sheets.length - 1;
    }
  }, {
    key: 'manage',
    value: function manage(key) {
      var index = this.keys.indexOf(key);
      var sheet = this.sheets[index];
      if (this.refs[index] === 0) sheet.attach();
      this.refs[index]++;
      if (!this.keys[index]) this.keys.splice(index, 0, key);
      return sheet;
    }
  }, {
    key: 'unmanage',
    value: function unmanage(key) {
      var index = this.keys.indexOf(key);
      if (index === -1) {
        // eslint-ignore-next-line no-console
        (0, _warning2['default'])(false, 'SheetsManager: can\'t find sheet to unmanage');
        return;
      }
      if (this.refs[index] > 0) {
        this.refs[index]--;
        if (this.refs[index] === 0) this.sheets[index].detach();
      }
    }
  }, {
    key: 'size',
    get: function get() {
      return this.keys.length;
    }
  }]);

  return SheetsManager;
}();

exports['default'] = SheetsManager;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && babelHelpers["typeof"](Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
};

exports['default'] = cloneStyle;

var _isObservable = __webpack_require__(78);

var _isObservable2 = _interopRequireDefault(_isObservable);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var isArray = Array.isArray;
function cloneStyle(style) {
  // Support empty values in case user ends up with them by accident.
  if (style == null) return style;

  // Support string value for SimpleRule.
  var typeOfStyle = typeof style === 'undefined' ? 'undefined' : _typeof(style);

  if (typeOfStyle === 'string' || typeOfStyle === 'number' || typeOfStyle === 'function') {
    return style;
  }

  // Support array for FontFaceRule.
  if (isArray(style)) return style.map(cloneStyle);

  // Support Observable styles.  Observables are immutable, so we don't need to
  // copy them.
  if ((0, _isObservable2['default'])(style)) return style;

  var newStyle = {};
  for (var name in style) {
    var value = style[name];
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      newStyle[name] = cloneStyle(value);
      continue;
    }
    newStyle[name] = value;
  }

  return newStyle;
}

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(141);

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(143);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var root; /* global window */

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(31), __webpack_require__(142)(module)))

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var CSS = global.CSS;

var env = "development";

var escapeRegex = /([[\].#*$><+~=|^:(),"'`])/g;

exports['default'] = function (str) {
  // We don't need to escape it in production, because we are not using user's
  // input for selectors, we are generating a valid selector.
  if (env === 'production') return str;

  if (!CSS || !CSS.escape) {
    return str.replace(escapeRegex, '\\$1');
  }

  return CSS.escape(str);
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(31)))

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ns = '2f1acc6c3a606b082e5eef5e54414ffb';
if (global[ns] == null) global[ns] = 0;

// Bundle may contain multiple JSS versions at the same time. In order to identify
// the current version with just one short number and use it for classes generation
// we use a counter. Also it is more accurate, because user can manually reevaluate
// the module.
exports['default'] = global[ns]++;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(31)))

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && babelHelpers["typeof"](Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _isInBrowser = __webpack_require__(32);

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _StyleSheet = __webpack_require__(81);

var _StyleSheet2 = _interopRequireDefault(_StyleSheet);

var _PluginsRegistry = __webpack_require__(147);

var _PluginsRegistry2 = _interopRequireDefault(_PluginsRegistry);

var _rules = __webpack_require__(148);

var _rules2 = _interopRequireDefault(_rules);

var _observables = __webpack_require__(154);

var _observables2 = _interopRequireDefault(_observables);

var _functions = __webpack_require__(155);

var _functions2 = _interopRequireDefault(_functions);

var _sheets = __webpack_require__(49);

var _sheets2 = _interopRequireDefault(_sheets);

var _StyleRule = __webpack_require__(18);

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _createGenerateClassName = __webpack_require__(80);

var _createGenerateClassName2 = _interopRequireDefault(_createGenerateClassName);

var _createRule2 = __webpack_require__(30);

var _createRule3 = _interopRequireDefault(_createRule2);

var _DomRenderer = __webpack_require__(157);

var _DomRenderer2 = _interopRequireDefault(_DomRenderer);

var _VirtualRenderer = __webpack_require__(158);

var _VirtualRenderer2 = _interopRequireDefault(_VirtualRenderer);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var defaultPlugins = _rules2['default'].concat([_observables2['default'], _functions2['default']]);

var instanceCounter = 0;

var Jss = function () {
  function Jss(options) {
    _classCallCheck(this, Jss);

    this.id = instanceCounter++;
    this.version = "9.5.1";
    this.plugins = new _PluginsRegistry2['default']();
    this.options = {
      createGenerateClassName: _createGenerateClassName2['default'],
      Renderer: _isInBrowser2['default'] ? _DomRenderer2['default'] : _VirtualRenderer2['default'],
      plugins: []
    };
    this.generateClassName = (0, _createGenerateClassName2['default'])();

    // eslint-disable-next-line prefer-spread
    this.use.apply(this, defaultPlugins);
    this.setup(options);
  }

  _createClass(Jss, [{
    key: 'setup',
    value: function setup() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.createGenerateClassName) {
        this.options.createGenerateClassName = options.createGenerateClassName;
        // $FlowFixMe
        this.generateClassName = options.createGenerateClassName();
      }

      if (options.insertionPoint != null) this.options.insertionPoint = options.insertionPoint;
      if (options.virtual || options.Renderer) {
        this.options.Renderer = options.Renderer || (options.virtual ? _VirtualRenderer2['default'] : _DomRenderer2['default']);
      }

      // eslint-disable-next-line prefer-spread
      if (options.plugins) this.use.apply(this, options.plugins);

      return this;
    }

    /**
     * Create a Style Sheet.
     */

  }, {
    key: 'createStyleSheet',
    value: function createStyleSheet(styles) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var index = options.index;
      if (typeof index !== 'number') {
        index = _sheets2['default'].index === 0 ? 0 : _sheets2['default'].index + 1;
      }
      var sheet = new _StyleSheet2['default'](styles, _extends({}, options, {
        jss: this,
        generateClassName: options.generateClassName || this.generateClassName,
        insertionPoint: this.options.insertionPoint,
        Renderer: this.options.Renderer,
        index: index
      }));
      this.plugins.onProcessSheet(sheet);

      return sheet;
    }

    /**
     * Detach the Style Sheet and remove it from the registry.
     */

  }, {
    key: 'removeStyleSheet',
    value: function removeStyleSheet(sheet) {
      sheet.detach();
      _sheets2['default'].remove(sheet);
      return this;
    }

    /**
     * Create a rule without a Style Sheet.
     */

  }, {
    key: 'createRule',
    value: function createRule(name) {
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // Enable rule without name for inline styles.
      if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
        options = style;
        style = name;
        name = undefined;
      }

      // Cast from RuleFactoryOptions to RuleOptions
      // https://stackoverflow.com/questions/41328728/force-casting-in-flow
      var ruleOptions = options;

      ruleOptions.jss = this;
      ruleOptions.Renderer = this.options.Renderer;
      if (!ruleOptions.generateClassName) ruleOptions.generateClassName = this.generateClassName;
      if (!ruleOptions.classes) ruleOptions.classes = {};
      var rule = (0, _createRule3['default'])(name, style, ruleOptions);

      if (!ruleOptions.selector && rule instanceof _StyleRule2['default']) {
        rule.selector = '.' + ruleOptions.generateClassName(rule);
      }

      this.plugins.onProcessRule(rule);

      return rule;
    }

    /**
     * Register plugin. Passed function will be invoked with a rule instance.
     */

  }, {
    key: 'use',
    value: function use() {
      var _this = this;

      for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      plugins.forEach(function (plugin) {
        // Avoids applying same plugin twice, at least based on ref.
        if (_this.options.plugins.indexOf(plugin) === -1) {
          _this.options.plugins.push(plugin);
          _this.plugins.use(plugin);
        }
      });

      return this;
    }
  }]);

  return Jss;
}();

exports['default'] = Jss;

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var PluginsRegistry = function () {
  function PluginsRegistry() {
    _classCallCheck(this, PluginsRegistry);

    this.hooks = {
      onCreateRule: [],
      onProcessRule: [],
      onProcessStyle: [],
      onProcessSheet: [],
      onChangeValue: [],
      onUpdate: []

      /**
       * Call `onCreateRule` hooks and return an object if returned by a hook.
       */
    };
  }

  _createClass(PluginsRegistry, [{
    key: 'onCreateRule',
    value: function onCreateRule(name, decl, options) {
      for (var i = 0; i < this.hooks.onCreateRule.length; i++) {
        var rule = this.hooks.onCreateRule[i](name, decl, options);
        if (rule) return rule;
      }
      return null;
    }

    /**
     * Call `onProcessRule` hooks.
     */

  }, {
    key: 'onProcessRule',
    value: function onProcessRule(rule) {
      if (rule.isProcessed) return;
      var sheet = rule.options.sheet;

      for (var i = 0; i < this.hooks.onProcessRule.length; i++) {
        this.hooks.onProcessRule[i](rule, sheet);
      }

      // $FlowFixMe
      if (rule.style) this.onProcessStyle(rule.style, rule, sheet);

      rule.isProcessed = true;
    }

    /**
     * Call `onProcessStyle` hooks.
     */

  }, {
    key: 'onProcessStyle',
    value: function onProcessStyle(style, rule, sheet) {
      var nextStyle = style;

      for (var i = 0; i < this.hooks.onProcessStyle.length; i++) {
        nextStyle = this.hooks.onProcessStyle[i](nextStyle, rule, sheet);
        // $FlowFixMe
        rule.style = nextStyle;
      }
    }

    /**
     * Call `onProcessSheet` hooks.
     */

  }, {
    key: 'onProcessSheet',
    value: function onProcessSheet(sheet) {
      for (var i = 0; i < this.hooks.onProcessSheet.length; i++) {
        this.hooks.onProcessSheet[i](sheet);
      }
    }

    /**
     * Call `onUpdate` hooks.
     */

  }, {
    key: 'onUpdate',
    value: function onUpdate(data, rule, sheet) {
      for (var i = 0; i < this.hooks.onUpdate.length; i++) {
        this.hooks.onUpdate[i](data, rule, sheet);
      }
    }

    /**
     * Call `onChangeValue` hooks.
     */

  }, {
    key: 'onChangeValue',
    value: function onChangeValue(value, prop, rule) {
      var processedValue = value;
      for (var i = 0; i < this.hooks.onChangeValue.length; i++) {
        processedValue = this.hooks.onChangeValue[i](processedValue, prop, rule);
      }
      return processedValue;
    }

    /**
     * Register a plugin.
     * If function is passed, it is a shortcut for `{onProcessRule}`.
     */

  }, {
    key: 'use',
    value: function use(plugin) {
      for (var name in plugin) {
        if (this.hooks[name]) this.hooks[name].push(plugin[name]);else (0, _warning2['default'])(false, '[JSS] Unknown hook "%s".', name);
      }
    }
  }]);

  return PluginsRegistry;
}();

exports['default'] = PluginsRegistry;

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SimpleRule = __webpack_require__(149);

var _SimpleRule2 = _interopRequireDefault(_SimpleRule);

var _KeyframesRule = __webpack_require__(150);

var _KeyframesRule2 = _interopRequireDefault(_KeyframesRule);

var _ConditionalRule = __webpack_require__(151);

var _ConditionalRule2 = _interopRequireDefault(_ConditionalRule);

var _FontFaceRule = __webpack_require__(152);

var _FontFaceRule2 = _interopRequireDefault(_FontFaceRule);

var _ViewportRule = __webpack_require__(153);

var _ViewportRule2 = _interopRequireDefault(_ViewportRule);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var classes = {
  '@charset': _SimpleRule2['default'],
  '@import': _SimpleRule2['default'],
  '@namespace': _SimpleRule2['default'],
  '@keyframes': _KeyframesRule2['default'],
  '@media': _ConditionalRule2['default'],
  '@supports': _ConditionalRule2['default'],
  '@font-face': _FontFaceRule2['default'],
  '@viewport': _ViewportRule2['default'],
  '@-ms-viewport': _ViewportRule2['default']

  /**
   * Generate plugins which will register all rules.
   */
};
exports['default'] = Object.keys(classes).map(function (key) {
  // https://jsperf.com/indexof-vs-substr-vs-regex-at-the-beginning-3
  var re = new RegExp('^' + key);
  var onCreateRule = function onCreateRule(name, decl, options) {
    return re.test(name) ? new classes[key](name, decl, options) : null;
  };
  return { onCreateRule: onCreateRule };
});

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var SimpleRule = function () {
  function SimpleRule(key, value, options) {
    _classCallCheck(this, SimpleRule);

    this.type = 'simple';
    this.isProcessed = false;

    this.key = key;
    this.value = value;
    this.options = options;
  }

  /**
   * Generates a CSS string.
   */
  // eslint-disable-next-line no-unused-vars


  _createClass(SimpleRule, [{
    key: 'toString',
    value: function toString(options) {
      if (Array.isArray(this.value)) {
        var str = '';
        for (var index = 0; index < this.value.length; index++) {
          str += this.key + ' ' + this.value[index] + ';';
          if (this.value[index + 1]) str += '\n';
        }
        return str;
      }

      return this.key + ' ' + this.value + ';';
    }
  }]);

  return SimpleRule;
}();

exports['default'] = SimpleRule;

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _RuleList = __webpack_require__(21);

var _RuleList2 = _interopRequireDefault(_RuleList);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Rule for @keyframes
 */
var KeyframesRule = function () {
  function KeyframesRule(key, frames, options) {
    _classCallCheck(this, KeyframesRule);

    this.type = 'keyframes';
    this.isProcessed = false;

    this.key = key;
    this.options = options;
    this.rules = new _RuleList2['default'](_extends({}, options, { parent: this }));

    for (var name in frames) {
      this.rules.add(name, frames[name], _extends({}, this.options, {
        parent: this,
        selector: name
      }));
    }

    this.rules.process();
  }

  /**
   * Generates a CSS string.
   */

  _createClass(KeyframesRule, [{
    key: 'toString',
    value: function toString() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { indent: 1 };

      var inner = this.rules.toString(options);
      if (inner) inner += '\n';
      return this.key + ' {\n' + inner + '}';
    }
  }]);

  return KeyframesRule;
}();

exports['default'] = KeyframesRule;

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _RuleList = __webpack_require__(21);

var _RuleList2 = _interopRequireDefault(_RuleList);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Conditional rule for @media, @supports
 */
var ConditionalRule = function () {
  function ConditionalRule(key, styles, options) {
    _classCallCheck(this, ConditionalRule);

    this.type = 'conditional';
    this.isProcessed = false;

    this.key = key;
    this.options = options;
    this.rules = new _RuleList2['default'](_extends({}, options, { parent: this }));

    for (var name in styles) {
      this.rules.add(name, styles[name]);
    }

    this.rules.process();
  }

  /**
   * Get a rule.
   */

  _createClass(ConditionalRule, [{
    key: 'getRule',
    value: function getRule(name) {
      return this.rules.get(name);
    }

    /**
     * Get index of a rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(rule) {
      return this.rules.indexOf(rule);
    }

    /**
     * Create and register rule, run plugins.
     */

  }, {
    key: 'addRule',
    value: function addRule(name, style, options) {
      var rule = this.rules.add(name, style, options);
      this.options.jss.plugins.onProcessRule(rule);
      return rule;
    }

    /**
     * Generates a CSS string.
     */

  }, {
    key: 'toString',
    value: function toString() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { indent: 1 };

      var inner = this.rules.toString(options);
      return inner ? this.key + ' {\n' + inner + '\n}' : '';
    }
  }]);

  return ConditionalRule;
}();

exports['default'] = ConditionalRule;

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _toCss = __webpack_require__(48);

var _toCss2 = _interopRequireDefault(_toCss);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var FontFaceRule = function () {
  function FontFaceRule(key, style, options) {
    _classCallCheck(this, FontFaceRule);

    this.type = 'font-face';
    this.isProcessed = false;

    this.key = key;
    this.style = style;
    this.options = options;
  }

  /**
   * Generates a CSS string.
   */

  _createClass(FontFaceRule, [{
    key: 'toString',
    value: function toString(options) {
      if (Array.isArray(this.style)) {
        var str = '';
        for (var index = 0; index < this.style.length; index++) {
          str += (0, _toCss2['default'])(this.key, this.style[index]);
          if (this.style[index + 1]) str += '\n';
        }
        return str;
      }

      return (0, _toCss2['default'])(this.key, this.style, options);
    }
  }]);

  return FontFaceRule;
}();

exports['default'] = FontFaceRule;

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _toCss = __webpack_require__(48);

var _toCss2 = _interopRequireDefault(_toCss);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var ViewportRule = function () {
  function ViewportRule(key, style, options) {
    _classCallCheck(this, ViewportRule);

    this.type = 'viewport';
    this.isProcessed = false;

    this.key = key;
    this.style = style;
    this.options = options;
  }

  /**
   * Generates a CSS string.
   */

  _createClass(ViewportRule, [{
    key: 'toString',
    value: function toString(options) {
      return (0, _toCss2['default'])(this.key, this.style, options);
    }
  }]);

  return ViewportRule;
}();

exports['default'] = ViewportRule;

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StyleRule = __webpack_require__(18);

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _createRule = __webpack_require__(30);

var _createRule2 = _interopRequireDefault(_createRule);

var _isObservable = __webpack_require__(78);

var _isObservable2 = _interopRequireDefault(_isObservable);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

exports['default'] = {
  onCreateRule: function onCreateRule(name, decl, options) {
    if (!(0, _isObservable2['default'])(decl)) return null;

    // Cast `decl` to `Observable`, since it passed the type guard.
    var style$ = decl;

    var rule = (0, _createRule2['default'])(name, {}, options);

    // TODO
    // Call `stream.subscribe()` returns a subscription, which should be explicitly
    // unsubscribed from when we know this sheet is no longer needed.
    style$.subscribe(function (style) {
      for (var prop in style) {
        rule.prop(prop, style[prop]);
      }
    });

    return rule;
  },
  onProcessRule: function onProcessRule(rule) {
    if (!(rule instanceof _StyleRule2['default'])) return;
    var styleRule = rule;
    var style = styleRule.style;

    var _loop = function _loop(prop) {
      var value = style[prop];
      if (!(0, _isObservable2['default'])(value)) return 'continue';
      delete style[prop];
      value.subscribe({
        next: function next(nextValue) {
          styleRule.prop(prop, nextValue);
        }
      });
    };

    for (var prop in style) {
      var _ret = _loop(prop);

      if (_ret === 'continue') continue;
    }
  }
};

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RuleList = __webpack_require__(21);

var _RuleList2 = _interopRequireDefault(_RuleList);

var _StyleRule = __webpack_require__(18);

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _kebabCase = __webpack_require__(156);

var _kebabCase2 = _interopRequireDefault(_kebabCase);

var _createRule = __webpack_require__(30);

var _createRule2 = _interopRequireDefault(_createRule);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

// A symbol replacement.
var now = Date.now();
var fnValuesNs = 'fnValues' + now;
var fnStyleNs = 'fnStyle' + ++now;

exports['default'] = {
  onCreateRule: function onCreateRule(name, decl, options) {
    if (typeof decl !== 'function') return null;
    var rule = (0, _createRule2['default'])(name, {}, options);
    rule[fnStyleNs] = decl;
    return rule;
  },
  onProcessStyle: function onProcessStyle(style, rule) {
    var fn = {};
    for (var prop in style) {
      var value = style[prop];
      if (typeof value !== 'function') continue;
      delete style[prop];
      fn[(0, _kebabCase2['default'])(prop)] = value;
    }
    rule = rule;
    rule[fnValuesNs] = fn;
    return style;
  },
  onUpdate: function onUpdate(data, rule) {
    // It is a rules container like for e.g. ConditionalRule.
    if (rule.rules instanceof _RuleList2['default']) {
      rule.rules.update(data);
      return;
    }
    if (!(rule instanceof _StyleRule2['default'])) return;

    rule = rule;

    // If we have a fn values map, it is a rule with function values.
    if (rule[fnValuesNs]) {
      for (var prop in rule[fnValuesNs]) {
        rule.prop(prop, rule[fnValuesNs][prop](data));
      }
    }

    rule = rule;

    var fnStyle = rule[fnStyleNs];

    // If we have a style function, the entire rule is dynamic and style object
    // will be returned from that function.
    if (fnStyle) {
      var style = fnStyle(data);
      for (var _prop in style) {
        rule.prop(_prop, style[_prop]);
      }
    }
  }
};

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var regExp = /([A-Z])/g;
var replace = function replace(str) {
  return "-" + str.toLowerCase();
};

exports["default"] = function (str) {
  return str.replace(regExp, replace);
};

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

var _sheets = __webpack_require__(49);

var _sheets2 = _interopRequireDefault(_sheets);

var _StyleRule = __webpack_require__(18);

var _StyleRule2 = _interopRequireDefault(_StyleRule);

var _toCssValue = __webpack_require__(29);

var _toCssValue2 = _interopRequireDefault(_toCssValue);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * Get a style property.
 */
function getStyle(cssRule, prop) {
  try {
    return cssRule.style.getPropertyValue(prop);
  } catch (err) {
    // IE may throw if property is unknown.
    return '';
  }
}

/**
 * Set a style property.
 */
function setStyle(cssRule, prop, value) {
  try {
    var cssValue = value;

    if (Array.isArray(value)) {
      cssValue = (0, _toCssValue2['default'])(value, true);

      if (value[value.length - 1] === '!important') {
        cssRule.style.setProperty(prop, cssValue, 'important');
        return true;
      }
    }

    cssRule.style.setProperty(prop, cssValue);
  } catch (err) {
    // IE may throw if property is unknown.
    return false;
  }
  return true;
}

var CSSRuleTypes = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7

  /**
   * Get the CSS Rule key.
   */

};var getKey = function () {
  var extractKey = function extractKey(cssText) {
    var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return cssText.substr(from, cssText.indexOf('{') - 1);
  };

  return function (cssRule) {
    if (cssRule.type === CSSRuleTypes.STYLE_RULE) return cssRule.selectorText;
    if (cssRule.type === CSSRuleTypes.KEYFRAMES_RULE) {
      var name = cssRule.name;

      if (name) return '@keyframes ' + name;

      // There is no rule.name in the following browsers:
      // - IE 9
      // - Safari 7.1.8
      // - Mobile Safari 9.0.0
      var cssText = cssRule.cssText;

      return '@' + extractKey(cssText, cssText.indexOf('keyframes'));
    }

    // Conditionals.
    return extractKey(cssRule.cssText);
  };
}();

/**
 * Set the selector.
 */
function setSelector(cssRule, selectorText) {
  cssRule.selectorText = selectorText;

  // Return false if setter was not successful.
  // Currently works in chrome only.
  return cssRule.selectorText === selectorText;
}

/**
 * Gets the `head` element upon the first call and caches it.
 */
var getHead = function () {
  var head = void 0;
  return function () {
    if (!head) head = document.head || document.getElementsByTagName('head')[0];
    return head;
  };
}();

/**
 * Gets a map of rule keys, where the property is an unescaped key and value
 * is a potentially escaped one.
 * It is used to identify CSS rules and the corresponding JSS rules. As an identifier
 * for CSSStyleRule we normally use `selectorText`. Though if original selector text
 * contains escaped code points e.g. `:not(#\\20)`, CSSOM will compile it to `:not(# )`
 * and so CSS rule's `selectorText` won't match JSS rule selector.
 *
 * https://www.w3.org/International/questions/qa-escapes#cssescapes
 */
var getUnescapedKeysMap = function () {
  var style = void 0;
  var isAttached = false;

  return function (rules) {
    var map = {};
    // https://github.com/facebook/flow/issues/2696
    if (!style) style = document.createElement('style');
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (!(rule instanceof _StyleRule2['default'])) continue;
      var selector = rule.selector;
      // Only unescape selector over CSSOM if it contains a back slash.

      if (selector && selector.indexOf('\\') !== -1) {
        // Lazilly attach when needed.
        if (!isAttached) {
          getHead().appendChild(style);
          isAttached = true;
        }
        style.textContent = selector + ' {}';
        var _style = style,
            sheet = _style.sheet;

        if (sheet) {
          var cssRules = sheet.cssRules;

          if (cssRules) map[cssRules[0].selectorText] = rule.key;
        }
      }
    }
    if (isAttached) {
      getHead().removeChild(style);
      isAttached = false;
    }
    return map;
  };
}();

/**
 * Find attached sheet with an index higher than the passed one.
 */
function findHigherSheet(registry, options) {
  for (var i = 0; i < registry.length; i++) {
    var sheet = registry[i];
    if (sheet.attached && sheet.options.index > options.index && sheet.options.insertionPoint === options.insertionPoint) {
      return sheet;
    }
  }
  return null;
}

/**
 * Find attached sheet with the highest index.
 */
function findHighestSheet(registry, options) {
  for (var i = registry.length - 1; i >= 0; i--) {
    var sheet = registry[i];
    if (sheet.attached && sheet.options.insertionPoint === options.insertionPoint) {
      return sheet;
    }
  }
  return null;
}

/**
 * Find a comment with "jss" inside.
 */
function findCommentNode(text) {
  var head = getHead();
  for (var i = 0; i < head.childNodes.length; i++) {
    var node = head.childNodes[i];
    if (node.nodeType === 8 && node.nodeValue.trim() === text) {
      return node;
    }
  }
  return null;
}

/**
 * Find a node before which we can insert the sheet.
 */
function findPrevNode(options) {
  var registry = _sheets2['default'].registry;

  if (registry.length > 0) {
    // Try to insert before the next higher sheet.
    var sheet = findHigherSheet(registry, options);
    if (sheet) return sheet.renderer.element;

    // Otherwise insert after the last attached.
    sheet = findHighestSheet(registry, options);
    if (sheet) return sheet.renderer.element.nextElementSibling;
  }

  // Try to find a comment placeholder if registry is empty.
  var insertionPoint = options.insertionPoint;

  if (insertionPoint && typeof insertionPoint === 'string') {
    var comment = findCommentNode(insertionPoint);
    if (comment) return comment.nextSibling;
    // If user specifies an insertion point and it can't be found in the document -
    // bad specificity issues may appear.
    (0, _warning2['default'])(insertionPoint === 'jss', '[JSS] Insertion point "%s" not found.', insertionPoint);
  }

  return null;
}

/**
 * Insert style element into the DOM.
 */
function insertStyle(style, options) {
  var insertionPoint = options.insertionPoint;

  var prevNode = findPrevNode(options);

  if (prevNode) {
    var parentNode = prevNode.parentNode;

    if (parentNode) parentNode.insertBefore(style, prevNode);
    return;
  }

  // Works with iframes and any node types.
  if (insertionPoint && typeof insertionPoint.nodeType === 'number') {
    // https://stackoverflow.com/questions/41328728/force-casting-in-flow
    var insertionPointElement = insertionPoint;
    var _parentNode = insertionPointElement.parentNode;

    if (_parentNode) _parentNode.insertBefore(style, insertionPointElement.nextSibling);else (0, _warning2['default'])(false, '[JSS] Insertion point is not in the DOM.');
    return;
  }

  getHead().insertBefore(style, prevNode);
}

var DomRenderer = function () {
  function DomRenderer(sheet) {
    _classCallCheck(this, DomRenderer);

    this.getStyle = getStyle;
    this.setStyle = setStyle;
    this.setSelector = setSelector;
    this.getKey = getKey;
    this.getUnescapedKeysMap = getUnescapedKeysMap;
    this.hasInsertedRules = false;

    // There is no sheet when the renderer is used from a standalone StyleRule.
    if (sheet) _sheets2['default'].add(sheet);

    this.sheet = sheet;

    var _ref = this.sheet ? this.sheet.options : {},
        media = _ref.media,
        meta = _ref.meta,
        element = _ref.element;

    this.element = element || document.createElement('style');
    this.element.type = 'text/css';
    this.element.setAttribute('data-jss', '');
    if (media) this.element.setAttribute('media', media);
    if (meta) this.element.setAttribute('data-meta', meta);
    // eslint-disable-next-line no-underscore-dangle
    var nonce = global.__webpack_nonce__;
    if (nonce) this.element.setAttribute('nonce', nonce);
  }

  /**
   * Insert style element into render tree.
   */

  // HTMLStyleElement needs fixing https://github.com/facebook/flow/issues/2696


  _createClass(DomRenderer, [{
    key: 'attach',
    value: function attach() {
      // In the case the element node is external and it is already in the DOM.
      if (this.element.parentNode || !this.sheet) return;

      // When rules are inserted using `insertRule` API, after `sheet.detach().attach()`
      // browsers remove those rules.
      // TODO figure out if its a bug and if it is known.
      // Workaround is to redeploy the sheet before attaching as a string.
      if (this.hasInsertedRules) {
        this.deploy();
        this.hasInsertedRules = false;
      }

      insertStyle(this.element, this.sheet.options);
    }

    /**
     * Remove style element from render tree.
     */

  }, {
    key: 'detach',
    value: function detach() {
      this.element.parentNode.removeChild(this.element);
    }

    /**
     * Inject CSS string into element.
     */

  }, {
    key: 'deploy',
    value: function deploy() {
      if (!this.sheet) return;
      this.element.textContent = '\n' + this.sheet.toString() + '\n';
    }

    /**
     * Insert a rule into element.
     */

  }, {
    key: 'insertRule',
    value: function insertRule(rule, index) {
      var sheet = this.element.sheet;
      var cssRules = sheet.cssRules;

      var str = rule.toString();
      if (!index) index = cssRules.length;

      if (!str) return false;

      try {
        sheet.insertRule(str, index);
      } catch (err) {
        (0, _warning2['default'])(false, '[JSS] Can not insert an unsupported rule \n\r%s', rule);
        return false;
      }
      this.hasInsertedRules = true;

      return cssRules[index];
    }

    /**
     * Delete a rule.
     */

  }, {
    key: 'deleteRule',
    value: function deleteRule(cssRule) {
      var sheet = this.element.sheet;

      var index = this.indexOf(cssRule);
      if (index === -1) return false;
      sheet.deleteRule(index);
      return true;
    }

    /**
     * Get index of a CSS Rule.
     */

  }, {
    key: 'indexOf',
    value: function indexOf(cssRule) {
      var cssRules = this.element.sheet.cssRules;

      for (var _index = 0; _index < cssRules.length; _index++) {
        if (cssRule === cssRules[_index]) return _index;
      }
      return -1;
    }

    /**
     * Generate a new CSS rule and replace the existing one.
     */

  }, {
    key: 'replaceRule',
    value: function replaceRule(cssRule, rule) {
      var index = this.indexOf(cssRule);
      var newCssRule = this.insertRule(rule, index);
      this.element.sheet.deleteRule(index);
      return newCssRule;
    }

    /**
     * Get all rules elements.
     */

  }, {
    key: 'getRules',
    value: function getRules() {
      return this.element.sheet.cssRules;
    }
  }]);

  return DomRenderer;
}();

exports['default'] = DomRenderer;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(31)))

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/* eslint-disable class-methods-use-this */

/**
 * Rendering backend to do nothing in nodejs.
 */
var VirtualRenderer = function () {
  function VirtualRenderer() {
    _classCallCheck(this, VirtualRenderer);
  }

  _createClass(VirtualRenderer, [{
    key: 'setStyle',
    value: function setStyle() {
      return true;
    }
  }, {
    key: 'getStyle',
    value: function getStyle() {
      return '';
    }
  }, {
    key: 'setSelector',
    value: function setSelector() {
      return true;
    }
  }, {
    key: 'getKey',
    value: function getKey() {
      return '';
    }
  }, {
    key: 'attach',
    value: function attach() {}
  }, {
    key: 'detach',
    value: function detach() {}
  }, {
    key: 'deploy',
    value: function deploy() {}
  }, {
    key: 'insertRule',
    value: function insertRule() {
      return false;
    }
  }, {
    key: 'deleteRule',
    value: function deleteRule() {
      return true;
    }
  }, {
    key: 'replaceRule',
    value: function replaceRule() {
      return false;
    }
  }, {
    key: 'getRules',
    value: function getRules() {}
  }, {
    key: 'indexOf',
    value: function indexOf() {
      return -1;
    }
  }]);

  return VirtualRenderer;
}();

exports['default'] = VirtualRenderer;

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

exports['default'] = jssNested;

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var separatorRegExp = /\s*,\s*/g;
var parentRegExp = /&/g;
var refRegExp = /\$([\w-]+)/g;

/**
 * Convert nested rules to separate, remove them from original styles.
 *
 * @param {Rule} rule
 * @api public
 */
function jssNested() {
  // Get a function to be used for $ref replacement.
  function getReplaceRef(container) {
    return function (match, key) {
      var rule = container.getRule(key);
      if (rule) return rule.selector;
      (0, _warning2['default'])(false, '[JSS] Could not find the referenced rule %s in %s.', key, container.options.meta || container);
      return key;
    };
  }

  var hasAnd = function hasAnd(str) {
    return str.indexOf('&') !== -1;
  };

  function replaceParentRefs(nestedProp, parentProp) {
    var parentSelectors = parentProp.split(separatorRegExp);
    var nestedSelectors = nestedProp.split(separatorRegExp);

    var result = '';

    for (var i = 0; i < parentSelectors.length; i++) {
      var parent = parentSelectors[i];

      for (var j = 0; j < nestedSelectors.length; j++) {
        var nested = nestedSelectors[j];
        if (result) result += ', ';
        // Replace all & by the parent or prefix & with the parent.
        result += hasAnd(nested) ? nested.replace(parentRegExp, parent) : parent + ' ' + nested;
      }
    }

    return result;
  }

  function getOptions(rule, container, options) {
    // Options has been already created, now we only increase index.
    if (options) return _extends({}, options, { index: options.index + 1 });

    var nestingLevel = rule.options.nestingLevel;

    nestingLevel = nestingLevel === undefined ? 1 : nestingLevel + 1;

    return _extends({}, rule.options, {
      nestingLevel: nestingLevel,
      index: container.indexOf(rule) + 1
    });
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style;
    var container = rule.options.parent;
    var options = void 0;
    var replaceRef = void 0;
    for (var prop in style) {
      var isNested = hasAnd(prop);
      var isNestedConditional = prop[0] === '@';

      if (!isNested && !isNestedConditional) continue;

      options = getOptions(rule, container, options);

      if (isNested) {
        var selector = replaceParentRefs(prop, rule.selector
        // Lazily create the ref replacer function just once for
        // all nested rules within the sheet.
        );if (!replaceRef) replaceRef = getReplaceRef(container
        // Replace all $refs.
        );selector = selector.replace(refRegExp, replaceRef);

        container.addRule(selector, style[prop], _extends({}, options, { selector: selector }));
      } else if (isNestedConditional) {
        container
        // Place conditional right after the parent rule to ensure right ordering.
        .addRule(prop, null, options).addRule(rule.key, style[prop], { selector: rule.selector });
      }

      delete style[prop];
    }

    return style;
  }

  return { onProcessStyle: onProcessStyle };
}

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = camelCase;
var regExp = /([A-Z])/g;

/**
 * Replace a string passed from String#replace.
 * @param {String} str
 * @return {String}
 */
function replace(str) {
  return "-" + str.toLowerCase();
}

/**
 * Convert camel cased property names to dash separated.
 *
 * @param {Object} style
 * @return {Object}
 */
function convertCase(style) {
  var converted = {};

  for (var prop in style) {
    converted[prop.replace(regExp, replace)] = style[prop];
  }

  if (style.fallbacks) {
    if (Array.isArray(style.fallbacks)) converted.fallbacks = style.fallbacks.map(convertCase);else converted.fallbacks = convertCase(style.fallbacks);
  }

  return converted;
}

/**
 * Allow camel cased property names by converting them back to dasherized.
 *
 * @param {Rule} rule
 */
function camelCase() {
  function onProcessStyle(style) {
    if (Array.isArray(style)) {
      // Handle rules like @font-face, which can have multiple styles in an array
      for (var index = 0; index < style.length; index++) {
        style[index] = convertCase(style[index]);
      }
      return style;
    }

    return convertCase(style);
  }

  return { onProcessStyle: onProcessStyle };
}

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && babelHelpers["typeof"](Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : babelHelpers["typeof"](obj);
};

exports['default'] = defaultUnit;

var _defaultUnits = __webpack_require__(162);

var _defaultUnits2 = _interopRequireDefault(_defaultUnits);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

/**
 * Clones the object and adds a camel cased property version.
 */
function addCamelCasedVersion(obj) {
  var regExp = /(-[a-z])/g;
  var replace = function replace(str) {
    return str[1].toUpperCase();
  };
  var newObj = {};
  for (var key in obj) {
    newObj[key] = obj[key];
    newObj[key.replace(regExp, replace)] = obj[key];
  }
  return newObj;
}

var units = addCamelCasedVersion(_defaultUnits2['default']);

/**
 * Recursive deep style passing function
 *
 * @param {String} current property
 * @param {(Object|Array|Number|String)} property value
 * @param {Object} options
 * @return {(Object|Array|Number|String)} resulting value
 */
function iterate(prop, value, options) {
  if (!value) return value;

  var convertedValue = value;

  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  if (type === 'object' && Array.isArray(value)) type = 'array';

  switch (type) {
    case 'object':
      if (prop === 'fallbacks') {
        for (var innerProp in value) {
          value[innerProp] = iterate(innerProp, value[innerProp], options);
        }
        break;
      }
      for (var _innerProp in value) {
        value[_innerProp] = iterate(prop + '-' + _innerProp, value[_innerProp], options);
      }
      break;
    case 'array':
      for (var i = 0; i < value.length; i++) {
        value[i] = iterate(prop, value[i], options);
      }
      break;
    case 'number':
      if (value !== 0) {
        convertedValue = value + (options[prop] || units[prop] || '');
      }
      break;
    default:
      break;
  }

  return convertedValue;
}

/**
 * Add unit to numeric values.
 */
function defaultUnit() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var camelCasedOptions = addCamelCasedVersion(options);

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style;

    for (var prop in style) {
      style[prop] = iterate(prop, style[prop], camelCasedOptions);
    }

    return style;
  }

  function onChangeValue(value, prop) {
    return iterate(prop, value, camelCasedOptions);
  }

  return { onProcessStyle: onProcessStyle, onChangeValue: onChangeValue };
}

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Generated jss-default-unit CSS property units
 *
 * @type object
 */
exports['default'] = {
  'animation-delay': 'ms',
  'animation-duration': 'ms',
  'background-position': 'px',
  'background-position-x': 'px',
  'background-position-y': 'px',
  'background-size': 'px',
  border: 'px',
  'border-bottom': 'px',
  'border-bottom-left-radius': 'px',
  'border-bottom-right-radius': 'px',
  'border-bottom-width': 'px',
  'border-left': 'px',
  'border-left-width': 'px',
  'border-radius': 'px',
  'border-right': 'px',
  'border-right-width': 'px',
  'border-spacing': 'px',
  'border-top': 'px',
  'border-top-left-radius': 'px',
  'border-top-right-radius': 'px',
  'border-top-width': 'px',
  'border-width': 'px',
  'border-after-width': 'px',
  'border-before-width': 'px',
  'border-end-width': 'px',
  'border-horizontal-spacing': 'px',
  'border-start-width': 'px',
  'border-vertical-spacing': 'px',
  bottom: 'px',
  'box-shadow': 'px',
  'column-gap': 'px',
  'column-rule': 'px',
  'column-rule-width': 'px',
  'column-width': 'px',
  'flex-basis': 'px',
  'font-size': 'px',
  'font-size-delta': 'px',
  height: 'px',
  left: 'px',
  'letter-spacing': 'px',
  'logical-height': 'px',
  'logical-width': 'px',
  margin: 'px',
  'margin-after': 'px',
  'margin-before': 'px',
  'margin-bottom': 'px',
  'margin-left': 'px',
  'margin-right': 'px',
  'margin-top': 'px',
  'max-height': 'px',
  'max-width': 'px',
  'margin-end': 'px',
  'margin-start': 'px',
  'mask-position-x': 'px',
  'mask-position-y': 'px',
  'mask-size': 'px',
  'max-logical-height': 'px',
  'max-logical-width': 'px',
  'min-height': 'px',
  'min-width': 'px',
  'min-logical-height': 'px',
  'min-logical-width': 'px',
  motion: 'px',
  'motion-offset': 'px',
  outline: 'px',
  'outline-offset': 'px',
  'outline-width': 'px',
  padding: 'px',
  'padding-bottom': 'px',
  'padding-left': 'px',
  'padding-right': 'px',
  'padding-top': 'px',
  'padding-after': 'px',
  'padding-before': 'px',
  'padding-end': 'px',
  'padding-start': 'px',
  'perspective-origin-x': '%',
  'perspective-origin-y': '%',
  perspective: 'px',
  right: 'px',
  'shape-margin': 'px',
  size: 'px',
  'text-indent': 'px',
  'text-stroke': 'px',
  'text-stroke-width': 'px',
  top: 'px',
  'transform-origin': '%',
  'transform-origin-x': '%',
  'transform-origin-y': '%',
  'transform-origin-z': '%',
  'transition-delay': 'ms',
  'transition-duration': 'ms',
  'vertical-align': 'px',
  width: 'px',
  'word-spacing': 'px',
  // Not existing properties.
  // Used to avoid issues with jss-expand intergration.
  'box-shadow-x': 'px',
  'box-shadow-y': 'px',
  'box-shadow-blur': 'px',
  'box-shadow-spread': 'px',
  'font-line-height': 'px',
  'text-shadow-x': 'px',
  'text-shadow-y': 'px',
  'text-shadow-blur': 'px'
};

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = jssVendorPrefixer;

var _cssVendor = __webpack_require__(164);

var vendor = _interopRequireWildcard(_cssVendor);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj['default'] = obj;return newObj;
  }
}

/**
 * Add vendor prefix to a property name when needed.
 *
 * @param {Rule} rule
 * @api public
 */
function jssVendorPrefixer() {
  function onProcessRule(rule) {
    if (rule.type === 'keyframes') {
      rule.key = '@' + vendor.prefix.css + rule.key.substr(1);
    }
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style;

    for (var prop in style) {
      var value = style[prop];

      var changeProp = false;
      var supportedProp = vendor.supportedProperty(prop);
      if (supportedProp && supportedProp !== prop) changeProp = true;

      var changeValue = false;
      var supportedValue = vendor.supportedValue(supportedProp, value);
      if (supportedValue && supportedValue !== value) changeValue = true;

      if (changeProp || changeValue) {
        if (changeProp) delete style[prop];
        style[supportedProp || prop] = supportedValue || value;
      }
    }

    return style;
  }

  function onChangeValue(value, prop) {
    return vendor.supportedValue(prop, value);
  }

  return { onProcessRule: onProcessRule, onProcessStyle: onProcessStyle, onChangeValue: onChangeValue };
}

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedValue = exports.supportedProperty = exports.prefix = undefined;

var _prefix = __webpack_require__(50);

var _prefix2 = _interopRequireDefault(_prefix);

var _supportedProperty = __webpack_require__(165);

var _supportedProperty2 = _interopRequireDefault(_supportedProperty);

var _supportedValue = __webpack_require__(167);

var _supportedValue2 = _interopRequireDefault(_supportedValue);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

exports['default'] = {
  prefix: _prefix2['default'],
  supportedProperty: _supportedProperty2['default'],
  supportedValue: _supportedValue2['default']
}; /**
    * CSS Vendor prefix detection and property feature testing.
    *
    * @copyright Oleg Slobodskoi 2015
    * @website https://github.com/jsstyles/css-vendor
    * @license MIT
    */

exports.prefix = _prefix2['default'];
exports.supportedProperty = _supportedProperty2['default'];
exports.supportedValue = _supportedValue2['default'];

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = supportedProperty;

var _isInBrowser = __webpack_require__(32);

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _prefix = __webpack_require__(50);

var _prefix2 = _interopRequireDefault(_prefix);

var _camelize = __webpack_require__(166);

var _camelize2 = _interopRequireDefault(_camelize);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var el = void 0;
var cache = {};

if (_isInBrowser2['default']) {
  el = document.createElement('p');

  /**
   * We test every property on vendor prefix requirement.
   * Once tested, result is cached. It gives us up to 70% perf boost.
   * http://jsperf.com/element-style-object-access-vs-plain-object
   *
   * Prefill cache with known css properties to reduce amount of
   * properties we need to feature test at runtime.
   * http://davidwalsh.name/vendor-prefix
   */
  var computed = window.getComputedStyle(document.documentElement, '');
  for (var key in computed) {
    if (!isNaN(key)) cache[computed[key]] = computed[key];
  }
}

/**
 * Test if a property is supported, returns supported property with vendor
 * prefix if required. Returns `false` if not supported.
 *
 * @param {String} prop dash separated
 * @return {String|Boolean}
 * @api public
 */
function supportedProperty(prop) {
  // For server-side rendering.
  if (!el) return prop;

  // We have not tested this prop yet, lets do the test.
  if (cache[prop] != null) return cache[prop];

  // Camelization is required because we can't test using
  // css syntax for e.g. in FF.
  // Test if property is supported as it is.
  if ((0, _camelize2['default'])(prop) in el.style) {
    cache[prop] = prop;
  }
  // Test if property is supported with vendor prefix.
  else if (_prefix2['default'].js + (0, _camelize2['default'])('-' + prop) in el.style) {
      cache[prop] = _prefix2['default'].css + prop;
    } else {
      cache[prop] = false;
    }

  return cache[prop];
}

/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = camelize;
var regExp = /[-\s]+(.)?/g;

/**
 * Convert dash separated strings to camel cased.
 *
 * @param {String} str
 * @return {String}
 */
function camelize(str) {
  return str.replace(regExp, toUpper);
}

function toUpper(match, c) {
  return c ? c.toUpperCase() : '';
}

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = supportedValue;

var _isInBrowser = __webpack_require__(32);

var _isInBrowser2 = _interopRequireDefault(_isInBrowser);

var _prefix = __webpack_require__(50);

var _prefix2 = _interopRequireDefault(_prefix);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

var cache = {};
var el = void 0;

if (_isInBrowser2['default']) el = document.createElement('p');

/**
 * Returns prefixed value if needed. Returns `false` if value is not supported.
 *
 * @param {String} property
 * @param {String} value
 * @return {String|Boolean}
 * @api public
 */
function supportedValue(property, value) {
  // For server-side rendering.
  if (!el) return value;

  // It is a string or a number as a string like '1'.
  // We want only prefixable values here.
  if (typeof value !== 'string' || !isNaN(parseInt(value, 10))) return value;

  var cacheKey = property + value;

  if (cache[cacheKey] != null) return cache[cacheKey];

  // IE can even throw an error in some cases, for e.g. style.content = 'bar'
  try {
    // Test value as it is.
    el.style[property] = value;
  } catch (err) {
    cache[cacheKey] = false;
    return false;
  }

  // Value is supported as it is.
  if (el.style[property] !== '') {
    cache[cacheKey] = value;
  } else {
    // Test value with vendor prefix.
    value = _prefix2['default'].css + value;

    // Hardcode test to convert "flex" to "-ms-flexbox" for IE10.
    if (value === '-ms-flex') value = '-ms-flexbox';

    el.style[property] = value;

    // Value is supported with vendor prefix.
    if (el.style[property] !== '') cache[cacheKey] = value;
  }

  if (!cache[cacheKey]) cache[cacheKey] = false;

  // Reset style value.
  el.style[property] = '';

  return cache[cacheKey];
}

/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = jssPropsSort;
/**
 * Sort props by length.
 */
function jssPropsSort() {
  function sort(prop0, prop1) {
    return prop0.length - prop1.length;
  }

  function onProcessStyle(style, rule) {
    if (rule.type !== 'style') return style;

    var newStyle = {};
    var props = Object.keys(style).sort(sort);
    for (var prop in props) {
      newStyle[props[prop]] = style[props[prop]];
    }
    return newStyle;
  }

  return { onProcessStyle: onProcessStyle };
}

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(7);

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = __webpack_require__(27);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getPrototypeOf = __webpack_require__(51);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(52);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(53);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(54);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(60);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(11);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(9);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

var _brcast = __webpack_require__(194);

var _brcast2 = _interopRequireDefault(_brcast);

var _themeListener = __webpack_require__(61);

var _themeListener2 = _interopRequireDefault(_themeListener);

var _exactProp = __webpack_require__(195);

var _exactProp2 = _interopRequireDefault(_exactProp);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * This component takes a `theme` property.
 * It makes the `theme` available down the React tree thanks to React context.
 * This component should preferably be used at **the root of your component tree**.
 */
var MuiThemeProvider = function (_React$Component) {
  (0, _inherits3['default'])(MuiThemeProvider, _React$Component);

  function MuiThemeProvider(props, context) {
    (0, _classCallCheck3['default'])(this, MuiThemeProvider);

    // Get the outer theme from the context, can be null
    var _this = (0, _possibleConstructorReturn3['default'])(this, (MuiThemeProvider.__proto__ || (0, _getPrototypeOf2['default'])(MuiThemeProvider)).call(this, props, context));

    _this.broadcast = (0, _brcast2['default'])();
    _this.unsubscribeId = null;
    _this.outerTheme = null;
    _this.outerTheme = _themeListener2['default'].initial(context);
    // Propagate the theme so it can be accessed by the children
    _this.broadcast.setState(_this.mergeOuterLocalTheme(_this.props.theme));
    return _this;
  }

  (0, _createClass3['default'])(MuiThemeProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _ref;

      return _ref = {}, (0, _defineProperty3['default'])(_ref, _themeListener.CHANNEL, this.broadcast), (0, _defineProperty3['default'])(_ref, 'muiThemeProviderOptions', {
        sheetsManager: this.props.sheetsManager,
        disableStylesGeneration: this.props.disableStylesGeneration
      }), _ref;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // Subscribe on the outer theme, if present
      this.unsubscribeId = _themeListener2['default'].subscribe(this.context, function (outerTheme) {
        _this2.outerTheme = outerTheme;
        // Forward the parent theme update to the children
        _this2.broadcast.setState(_this2.mergeOuterLocalTheme(_this2.props.theme));
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      // Propagate a local theme update
      if (this.props.theme !== nextProps.theme) {
        this.broadcast.setState(this.mergeOuterLocalTheme(nextProps.theme));
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.unsubscribeId !== null) {
        _themeListener2['default'].unsubscribe(this.context, this.unsubscribeId);
      }
    }
    // We are not using the React state in order to avoid unnecessary rerender.

  }, {
    key: 'mergeOuterLocalTheme',

    // Simple merge between the outer theme and the local theme
    value: function mergeOuterLocalTheme(localTheme) {
      // To support composition of theme.
      if (typeof localTheme === 'function') {
         true ? (0, _warning2['default'])(this.outerTheme, ['Material-UI: you are providing a theme function property ' + 'to the MuiThemeProvider component:', '<MuiThemeProvider theme={outerTheme => outerTheme} />', '', 'However, no outer theme is present.', 'Make sure a theme is already injected higher in the React tree ' + 'or provide a theme object.'].join('\n')) : void 0;
        return localTheme(this.outerTheme);
      }

      if (!this.outerTheme) {
        return localTheme;
      }

      return (0, _extends3['default'])({}, this.outerTheme, localTheme);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);
  return MuiThemeProvider;
}(_react2['default'].Component);

MuiThemeProvider.propTypes =  true ? {
  /**
   * You can only provide a single element with react@15, a node with react@16.
   */
  children: _propTypes2['default'].node.isRequired,
  /**
   * You can disable the generation of the styles with this option.
   * It can be useful when traversing the React tree outside of the HTML
   * rendering step on the server.
   * Let's say you are using react-apollo to extract all
   * the queries made by the interface server side.
   * You can significantly speed up the traversal with this property.
   */
  disableStylesGeneration: _propTypes2['default'].bool,
  /**
   * The sheetsManager is used to deduplicate style sheet injection in the page.
   * It's deduplicating using the (theme, styles) couple.
   * On the server, you should provide a new instance for each request.
   */
  sheetsManager: _propTypes2['default'].object,
  /**
   * A theme object.
   */
  theme: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].func]).isRequired
} : {};

MuiThemeProvider.propTypes =  true ? (0, _exactProp2['default'])(MuiThemeProvider.propTypes, 'MuiThemeProvider') : {};

MuiThemeProvider.defaultProps = {
  disableStylesGeneration: false,
  sheetsManager: null
};

MuiThemeProvider.childContextTypes = (0, _extends3['default'])({}, _themeListener2['default'].contextTypes, {
  muiThemeProviderOptions: _propTypes2['default'].object
});

MuiThemeProvider.contextTypes = _themeListener2['default'].contextTypes;

exports['default'] = MuiThemeProvider;

/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(171);
module.exports = __webpack_require__(1).Object.getPrototypeOf;

/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(20);
var $getPrototypeOf = __webpack_require__(82);

__webpack_require__(74)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(173), __esModule: true };

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(84);
__webpack_require__(86);
module.exports = __webpack_require__(57).f('iterator');

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toInteger = __webpack_require__(43);
var defined = __webpack_require__(41);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var create = __webpack_require__(33);
var descriptor = __webpack_require__(23);
var setToStringTag = __webpack_require__(34);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(10)(IteratorPrototype, __webpack_require__(3)('iterator'), function () {
  return this;
});

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dP = __webpack_require__(5);
var anObject = __webpack_require__(12);
var getKeys = __webpack_require__(19);

module.exports = __webpack_require__(6) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) {
    dP.f(O, P = keys[i++], Properties[P]);
  }return O;
};

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var document = __webpack_require__(4).document;
module.exports = document && document.documentElement;

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var addToUnscopables = __webpack_require__(179);
var step = __webpack_require__(87);
var Iterators = __webpack_require__(22);
var toIObject = __webpack_require__(16);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(55)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0; // next index
  this._k = kind; // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {/* empty */};

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(181), __esModule: true };

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(182);
__webpack_require__(91);
__webpack_require__(185);
__webpack_require__(186);
module.exports = __webpack_require__(1).Symbol;

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim

var global = __webpack_require__(4);
var has = __webpack_require__(14);
var DESCRIPTORS = __webpack_require__(6);
var $export = __webpack_require__(2);
var redefine = __webpack_require__(85);
var META = __webpack_require__(58).KEY;
var $fails = __webpack_require__(13);
var shared = __webpack_require__(45);
var setToStringTag = __webpack_require__(34);
var uid = __webpack_require__(24);
var wks = __webpack_require__(3);
var wksExt = __webpack_require__(57);
var wksDefine = __webpack_require__(59);
var enumKeys = __webpack_require__(183);
var isArray = __webpack_require__(88);
var anObject = __webpack_require__(12);
var isObject = __webpack_require__(8);
var toIObject = __webpack_require__(16);
var toPrimitive = __webpack_require__(38);
var createDesc = __webpack_require__(23);
var _create = __webpack_require__(33);
var gOPNExt = __webpack_require__(184);
var $GOPD = __webpack_require__(90);
var $DP = __webpack_require__(5);
var $keys = __webpack_require__(19);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function get() {
      return dP(this, 'a', { value: 7 }).a;
    }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function wrap(tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && babelHelpers['typeof']($Symbol.iterator) == 'symbol' ? function (it) {
  return (typeof it === 'undefined' ? 'undefined' : babelHelpers['typeof'](it)) == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    }return setSymbolDesc(it, key, D);
  }return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) {
    $defineProperty(it, key = keys[i++], P[key]);
  }return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  }return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  }return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function _Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function $set(value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(89).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(25).f = $propertyIsEnumerable;
  __webpack_require__(47).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(56)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols =
// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), j = 0; es6Symbols.length > j;) {
  wks(es6Symbols[j++]);
}for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) {
  wksDefine(wellKnownSymbols[k++]);
}$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function _for(key) {
    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) {
      if (SymbolRegistry[key] === sym) return key;
    }
  },
  useSetter: function useSetter() {
    setter = true;
  },
  useSimple: function useSimple() {
    setter = false;
  }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }$replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function replacer(key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(10)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(19);
var gOPS = __webpack_require__(47);
var pIE = __webpack_require__(25);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) {
      if (isEnum.call(it, key = symbols[i++])) result.push(key);
    }
  }return result;
};

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(16);
var gOPN = __webpack_require__(89).f;
var toString = {}.toString;

var windowNames = (typeof window === 'undefined' ? 'undefined' : babelHelpers['typeof'](window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function getWindowNames(it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(59)('asyncIterator');

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(59)('observable');

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(188), __esModule: true };

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(189);
module.exports = __webpack_require__(1).Object.setPrototypeOf;

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(2);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(190).set });

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(8);
var anObject = __webpack_require__(12);
var check = function check(O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
  function (test, buggy, set) {
    try {
      set = __webpack_require__(15)(Function.call, __webpack_require__(90).f(Object.prototype, '__proto__').set, 2);
      set(test, []);
      buggy = !(test instanceof Array);
    } catch (e) {
      buggy = true;
    }
    return function setPrototypeOf(O, proto) {
      check(O, proto);
      if (buggy) O.__proto__ = proto;else set(O, proto);
      return O;
    };
  }({}, false) : undefined),
  check: check
};

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(192), __esModule: true };

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(193);
var $Object = __webpack_require__(1).Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};

/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $export = __webpack_require__(2);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(33) });

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function createBroadcast(initialState) {
  var listeners = {};
  var id = 1;
  var _state = initialState;

  function getState() {
    return _state;
  }

  function setState(state) {
    _state = state;
    var keys = Object.keys(listeners);
    var i = 0;
    var len = keys.length;
    for (; i < len; i++) {
      // if a listener gets unsubscribed during setState we just skip it
      if (listeners[keys[i]]) {
        listeners[keys[i]](state);
      }
    }
  }

  // subscribe to changes and return the subscriptionId
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener must be a function.');
    }
    var currentId = id;
    listeners[currentId] = listener;
    id += 1;
    return currentId;
  }

  // remove subscription by removing the listener function
  function unsubscribe(id) {
    listeners[id] = undefined;
  }

  return { getState: getState, setState: setState, subscribe: subscribe, unsubscribe: unsubscribe };
}

exports['default'] = createBroadcast;

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.specialProperty = undefined;

var _defineProperty2 = __webpack_require__(27);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = __webpack_require__(28);

var _keys2 = _interopRequireDefault(_keys);

var _extends3 = __webpack_require__(7);

var _extends4 = _interopRequireDefault(_extends3);

exports['default'] = exactProp;

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// This module is based on https://github.com/airbnb/prop-types-exact repository.
// However, in order to reduce the number of dependencies and to remove some extra safe checks
// the module was forked.

var specialProperty = exports.specialProperty = 'exact-prop: \u200B';

function exactProp(propTypes, componentNameInError) {
  return (0, _extends4['default'])({}, propTypes, (0, _defineProperty3['default'])({}, specialProperty, function (props) {
    var unknownProps = (0, _keys2['default'])(props).filter(function (prop) {
      return !propTypes.hasOwnProperty(prop);
    });
    if (unknownProps.length > 0) {
      return new TypeError(componentNameInError + ': unknown props found: ' + unknownProps.join(', ') + '. Please remove the unknown properties.');
    }
    return null;
  }));
}

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sheetsManager = undefined;

var _keys = __webpack_require__(28);

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = __webpack_require__(7);

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = __webpack_require__(51);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(52);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(53);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(54);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(60);

var _inherits3 = _interopRequireDefault(_inherits2);

var _objectWithoutProperties2 = __webpack_require__(17);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _map = __webpack_require__(197);

var _map2 = _interopRequireDefault(_map);

var _minSafeInteger = __webpack_require__(216);

var _minSafeInteger2 = _interopRequireDefault(_minSafeInteger);

var _react = __webpack_require__(11);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(9);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

var _hoistNonReactStatics = __webpack_require__(36);

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _getDisplayName = __webpack_require__(96);

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _wrapDisplayName = __webpack_require__(97);

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

var _contextTypes = __webpack_require__(219);

var _contextTypes2 = _interopRequireDefault(_contextTypes);

var _jss = __webpack_require__(76);

var _ns = __webpack_require__(98);

var ns = _interopRequireWildcard(_ns);

var _jssPreset = __webpack_require__(75);

var _jssPreset2 = _interopRequireDefault(_jssPreset);

var _createMuiTheme = __webpack_require__(37);

var _createMuiTheme2 = _interopRequireDefault(_createMuiTheme);

var _themeListener = __webpack_require__(61);

var _themeListener2 = _interopRequireDefault(_themeListener);

var _createGenerateClassName = __webpack_require__(68);

var _createGenerateClassName2 = _interopRequireDefault(_createGenerateClassName);

var _getStylesCreator = __webpack_require__(221);

var _getStylesCreator2 = _interopRequireDefault(_getStylesCreator);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj['default'] = obj;return newObj;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// New JSS instance.
var jss = (0, _jss.create)((0, _jssPreset2['default'])());

// Use a singleton or the provided one by the context.
var generateClassName = (0, _createGenerateClassName2['default'])();

// Global index counter to preserve source order.
// As we create the style sheet during componentWillMount lifecycle,
// children are handled after the parents, so the order of style elements would
// be parent->child. It is a problem though when a parent passes a className
// which needs to override any childs styles. StyleSheet of the child has a higher
// specificity, because of the source order.
// So our solution is to render sheets them in the reverse order child->sheet, so
// that parent has a higher specificity.
var indexCounter = _minSafeInteger2['default'];

var sheetsManager = exports.sheetsManager = new _map2['default']();

// We use the same empty object to ref count the styles that don't need a theme object.
var noopTheme = {};

// In order to have self-supporting components, we rely on default theme when not provided.
var defaultTheme = void 0;

function getDefaultTheme() {
  if (defaultTheme) {
    return defaultTheme;
  }

  defaultTheme = (0, _createMuiTheme2['default'])();
  return defaultTheme;
}

// Link a style sheet with a component.
// It does not modify the component passed to it;
// instead, it returns a new component, with a `classes` property.
var withStyles = function withStyles(stylesOrCreator) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (Component) {
    var _options$withTheme = options.withTheme,
        withTheme = _options$withTheme === undefined ? false : _options$withTheme,
        _options$flip = options.flip,
        flip = _options$flip === undefined ? null : _options$flip,
        name = options.name,
        styleSheetOptions = (0, _objectWithoutProperties3['default'])(options, ['withTheme', 'flip', 'name']);

    var stylesCreator = (0, _getStylesCreator2['default'])(stylesOrCreator);
    var listenToTheme = stylesCreator.themingEnabled || withTheme || typeof name === 'string';

    indexCounter += 1;
    stylesCreator.options.index = indexCounter;

     true ? (0, _warning2['default'])(indexCounter < 0, ['Material-UI: you might have a memory leak.', 'The indexCounter is not supposed to grow that much.'].join(' ')) : void 0;

    var WithStyles = function (_React$Component) {
      (0, _inherits3['default'])(WithStyles, _React$Component);

      function WithStyles(props, context) {
        (0, _classCallCheck3['default'])(this, WithStyles);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (WithStyles.__proto__ || (0, _getPrototypeOf2['default'])(WithStyles)).call(this, props, context));

        _this.state = {};
        _this.disableStylesGeneration = false;
        _this.jss = null;
        _this.sheetOptions = null;
        _this.sheetsManager = sheetsManager;
        _this.stylesCreatorSaved = null;
        _this.theme = null;
        _this.unsubscribeId = null;

        _this.jss = _this.context[ns.jss] || jss;

        var muiThemeProviderOptions = _this.context.muiThemeProviderOptions;

        if (muiThemeProviderOptions) {
          if (muiThemeProviderOptions.sheetsManager) {
            _this.sheetsManager = muiThemeProviderOptions.sheetsManager;
          }

          _this.disableStylesGeneration = muiThemeProviderOptions.disableStylesGeneration;
        }

        // Attach the stylesCreator to the instance of the component as in the context
        // of react-hot-loader the hooks can be executed in a different closure context:
        // https://github.com/gaearon/react-hot-loader/blob/master/src/patch.dev.js#L107
        _this.stylesCreatorSaved = stylesCreator;
        _this.sheetOptions = (0, _extends3['default'])({
          generateClassName: generateClassName
        }, _this.context[ns.sheetOptions]);
        // We use || as the function call is lazy evaluated.
        _this.theme = listenToTheme ? _themeListener2['default'].initial(context) || getDefaultTheme() : noopTheme;
        return _this;
      }

      (0, _createClass3['default'])(WithStyles, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this.attach(this.theme);
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          if (!listenToTheme) {
            return;
          }

          this.unsubscribeId = _themeListener2['default'].subscribe(this.context, function (theme) {
            var oldTheme = _this2.theme;
            _this2.theme = theme;
            _this2.attach(_this2.theme);

            // Rerender the component so the underlying component gets the theme update.
            // By theme update we mean receiving and applying the new class names.
            _this2.setState({}, function () {
              _this2.detach(oldTheme);
            });
          });
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps() {
          // react-hot-loader specific logic
          if (this.stylesCreatorSaved === stylesCreator || "development" === 'production') {
            return;
          }

          this.detach(this.theme);
          this.stylesCreatorSaved = stylesCreator;
          this.attach(this.theme);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.detach(this.theme);

          if (this.unsubscribeId !== null) {
            _themeListener2['default'].unsubscribe(this.context, this.unsubscribeId);
          }
        }
      }, {
        key: 'attach',
        value: function attach(theme) {
          if (this.disableStylesGeneration) {
            return;
          }

          var stylesCreatorSaved = this.stylesCreatorSaved;
          var sheetManager = this.sheetsManager.get(stylesCreatorSaved);

          if (!sheetManager) {
            sheetManager = new _map2['default']();
            this.sheetsManager.set(stylesCreatorSaved, sheetManager);
          }

          var sheetManagerTheme = sheetManager.get(theme);

          if (!sheetManagerTheme) {
            sheetManagerTheme = {
              refs: 0,
              sheet: null
            };
            sheetManager.set(theme, sheetManagerTheme);
          }

          if (sheetManagerTheme.refs === 0) {
            var styles = stylesCreatorSaved.create(theme, name);
            var meta = name;

            if ("development" !== 'production' && !meta) {
              meta = (0, _getDisplayName2['default'])(Component);
            }

            var sheet = this.jss.createStyleSheet(styles, (0, _extends3['default'])({
              meta: meta,
              classNamePrefix: meta,
              flip: typeof flip === 'boolean' ? flip : theme.direction === 'rtl',
              link: false
            }, this.sheetOptions, stylesCreatorSaved.options, {
              name: name
            }, styleSheetOptions));

            sheetManagerTheme.sheet = sheet;
            sheet.attach();

            var sheetsRegistry = this.context[ns.sheetsRegistry];
            if (sheetsRegistry) {
              sheetsRegistry.add(sheet);
            }
          }

          sheetManagerTheme.refs += 1;
        }
      }, {
        key: 'detach',
        value: function detach(theme) {
          if (this.disableStylesGeneration) {
            return;
          }

          var stylesCreatorSaved = this.stylesCreatorSaved;
          var sheetManager = this.sheetsManager.get(stylesCreatorSaved);
          var sheetManagerTheme = sheetManager.get(theme);

          sheetManagerTheme.refs -= 1;

          if (sheetManagerTheme.refs === 0) {
            sheetManager['delete'](theme);
            this.jss.removeStyleSheet(sheetManagerTheme.sheet);
            var sheetsRegistry = this.context[ns.sheetsRegistry];
            if (sheetsRegistry) {
              sheetsRegistry.remove(sheetManagerTheme.sheet);
            }
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var _this3 = this;

          var _props = this.props,
              classesProp = _props.classes,
              innerRef = _props.innerRef,
              other = (0, _objectWithoutProperties3['default'])(_props, ['classes', 'innerRef']);

          var classes = void 0;
          var renderedClasses = {};

          if (!this.disableStylesGeneration) {
            var sheetManager = this.sheetsManager.get(this.stylesCreatorSaved);
            var sheetsManagerTheme = sheetManager.get(this.theme);
            renderedClasses = sheetsManagerTheme.sheet.classes;
          }

          if (classesProp) {
            classes = (0, _extends3['default'])({}, renderedClasses, (0, _keys2['default'])(classesProp).reduce(function (accumulator, key) {
               true ? (0, _warning2['default'])(renderedClasses[key] || _this3.disableStylesGeneration, ['Material-UI: the key `' + key + '` ' + ('provided to the classes property is not implemented in ' + (0, _getDisplayName2['default'])(Component) + '.'), 'You can only override one of the following: ' + (0, _keys2['default'])(renderedClasses).join(',')].join('\n')) : void 0;

               true ? (0, _warning2['default'])(!classesProp[key] || typeof classesProp[key] === 'string', ['Material-UI: the key `' + key + '` ' + ('provided to the classes property is not valid for ' + (0, _getDisplayName2['default'])(Component) + '.'), 'You need to provide a non empty string instead of: ' + classesProp[key] + '.'].join('\n')) : void 0;

              if (classesProp[key]) {
                accumulator[key] = renderedClasses[key] + ' ' + classesProp[key];
              }

              return accumulator;
            }, {}));
          } else {
            classes = renderedClasses;
          }

          var more = {};

          // Provide the theme to the wrapped component.
          // So we don't have to use the `withTheme()` Higher-order Component.
          if (withTheme) {
            more.theme = this.theme;
          }

          return _react2['default'].createElement(Component, (0, _extends3['default'])({ classes: classes }, more, other, { ref: innerRef }));
        }
      }]);
      return WithStyles;
    }(_react2['default'].Component);

    WithStyles.propTypes =  true ? {
      /**
       * Useful to extend the style applied to components.
       */
      classes: _propTypes2['default'].object,
      /**
       * Use that property to pass a ref callback to the decorated component.
       */
      innerRef: _propTypes2['default'].func
    } : {};

    WithStyles.contextTypes = (0, _extends3['default'])({
      muiThemeProviderOptions: _propTypes2['default'].object
    }, _contextTypes2['default'], listenToTheme ? _themeListener2['default'].contextTypes : {});

    if (true) {
      WithStyles.displayName = (0, _wrapDisplayName2['default'])(Component, 'WithStyles');
    }

    (0, _hoistNonReactStatics2['default'])(WithStyles, Component);

    if (true) {
      // Exposed for test purposes.
      WithStyles.Naked = Component;
      WithStyles.options = options;
    }

    return WithStyles;
  };
};

exports['default'] = withStyles;

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(198), __esModule: true };

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(91);
__webpack_require__(84);
__webpack_require__(86);
__webpack_require__(199);
__webpack_require__(209);
__webpack_require__(212);
__webpack_require__(214);
module.exports = __webpack_require__(1).Map;

/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var strong = __webpack_require__(200);
var validate = __webpack_require__(95);
var MAP = 'Map';

// 23.1 Map Objects
module.exports = __webpack_require__(205)(MAP, function (get) {
  return function Map() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var dP = __webpack_require__(5).f;
var create = __webpack_require__(33);
var redefineAll = __webpack_require__(92);
var ctx = __webpack_require__(15);
var anInstance = __webpack_require__(93);
var forOf = __webpack_require__(35);
var $iterDefine = __webpack_require__(55);
var step = __webpack_require__(87);
var setSpecies = __webpack_require__(204);
var DESCRIPTORS = __webpack_require__(6);
var fastKey = __webpack_require__(58).fastKey;
var validate = __webpack_require__(95);
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function getEntry(that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function getConstructor(wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME; // collection type
      that._i = create(null); // index
      that._f = undefined; // first entry
      that._l = undefined; // last entry
      that[SIZE] = 0; // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function _delete(key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        }return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) {
            entry = entry.p;
          }
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function get() {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function def(that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
      // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key, // <- key
        v: value, // <- value
        p: prev = that._l, // <- previous entry
        n: undefined, // <- next entry
        r: false // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    }return that;
  },
  getEntry: getEntry,
  setStrong: function setStrong(C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind; // kind
      this._l = undefined; // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) {
        entry = entry.p;
      } // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// call something on iterator step with safe closing on error
var anObject = __webpack_require__(12);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// check on default Array iterator
var Iterators = __webpack_require__(22);
var ITERATOR = __webpack_require__(3)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(94);
var ITERATOR = __webpack_require__(3)('iterator');
var Iterators = __webpack_require__(22);
module.exports = __webpack_require__(1).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
};

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);
var core = __webpack_require__(1);
var dP = __webpack_require__(5);
var DESCRIPTORS = __webpack_require__(6);
var SPECIES = __webpack_require__(3)('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function get() {
      return this;
    }
  });
};

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(4);
var $export = __webpack_require__(2);
var meta = __webpack_require__(58);
var fails = __webpack_require__(13);
var hide = __webpack_require__(10);
var redefineAll = __webpack_require__(92);
var forOf = __webpack_require__(35);
var anInstance = __webpack_require__(93);
var isObject = __webpack_require__(8);
var setToStringTag = __webpack_require__(34);
var dP = __webpack_require__(5).f;
var each = __webpack_require__(206)(0);
var DESCRIPTORS = __webpack_require__(6);

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
        anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP(C.prototype, 'size', {
      get: function get() {
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(15);
var IObject = __webpack_require__(39);
var toObject = __webpack_require__(20);
var toLength = __webpack_require__(42);
var asc = __webpack_require__(207);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res; // map
          else if (res) switch (TYPE) {
              case 3:
                return true; // some
              case 5:
                return val; // find
              case 6:
                return index; // findIndex
              case 2:
                result.push(val); // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(208);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isObject = __webpack_require__(8);
var isArray = __webpack_require__(88);
var SPECIES = __webpack_require__(3)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }return C === undefined ? Array : C;
};

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export = __webpack_require__(2);

$export($export.P + $export.R, 'Map', { toJSON: __webpack_require__(210)('Map') });

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var classof = __webpack_require__(94);
var from = __webpack_require__(211);
module.exports = function (NAME) {
  return function toJSON() {
    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return from(this);
  };
};

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var forOf = __webpack_require__(35);

module.exports = function (iter, ITERATOR) {
  var result = [];
  forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
__webpack_require__(213)('Map');

/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/

var $export = __webpack_require__(2);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { of: function of() {
      var length = arguments.length;
      var A = new Array(length);
      while (length--) {
        A[length] = arguments[length];
      }return new this(A);
    } });
};

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
__webpack_require__(215)('Map');

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/

var $export = __webpack_require__(2);
var aFunction = __webpack_require__(69);
var ctx = __webpack_require__(15);
var forOf = __webpack_require__(35);

module.exports = function (COLLECTION) {
  $export($export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
      var mapFn = arguments[1];
      var mapping, A, n, cb;
      aFunction(this);
      mapping = mapFn !== undefined;
      if (mapping) aFunction(mapFn);
      if (source == undefined) return new this();
      A = [];
      if (mapping) {
        n = 0;
        cb = ctx(mapFn, arguments[2], 2);
        forOf(source, false, function (nextItem) {
          A.push(cb(nextItem, n++));
        });
      } else {
        forOf(source, false, A.push, A);
      }
      return new this(A);
    } });
};

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = { "default": __webpack_require__(217), __esModule: true };

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(218);
module.exports = -0x1fffffffffffff;

/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = __webpack_require__(2);

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ns$jss$ns$sheetOptio;

var _propTypes = __webpack_require__(9);

var _ns = __webpack_require__(98);

var ns = _interopRequireWildcard(_ns);

var _propTypes2 = __webpack_require__(220);

var _propTypes3 = _interopRequireDefault(_propTypes2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { 'default': obj };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj['default'] = obj;return newObj;
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }return obj;
}

exports['default'] = (_ns$jss$ns$sheetOptio = {}, _defineProperty(_ns$jss$ns$sheetOptio, ns.jss, _propTypes3['default'].jss), _defineProperty(_ns$jss$ns$sheetOptio, ns.sheetOptions, _propTypes.object), _defineProperty(_ns$jss$ns$sheetOptio, ns.sheetsRegistry, _propTypes3['default'].registry), _defineProperty(_ns$jss$ns$sheetOptio, ns.managers, _propTypes.object), _ns$jss$ns$sheetOptio);

/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = __webpack_require__(9);

exports['default'] = {
  jss: (0, _propTypes.shape)({
    options: (0, _propTypes.shape)({
      createGenerateClassName: _propTypes.func.isRequired
    }).isRequired,
    createStyleSheet: _propTypes.func.isRequired,
    removeStyleSheet: _propTypes.func.isRequired
  }),
  registry: (0, _propTypes.shape)({
    add: _propTypes.func.isRequired,
    toString: _propTypes.func.isRequired
  })
};

/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = __webpack_require__(28);

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = __webpack_require__(7);

var _extends3 = _interopRequireDefault(_extends2);

var _warning = __webpack_require__(0);

var _warning2 = _interopRequireDefault(_warning);

var _deepmerge = __webpack_require__(26);

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// < 1kb payload overhead when lodash/merge is > 3kb.

function getStylesCreator(stylesOrCreator) {
  var themingEnabled = typeof stylesOrCreator === 'function';

  function create(theme, name) {
    var styles = themingEnabled ? stylesOrCreator(theme) : stylesOrCreator;

    if (!theme.overrides || !name || !theme.overrides[name]) {
      return styles;
    }

    var overrides = theme.overrides[name];
    var stylesWithOverrides = (0, _extends3['default'])({}, styles);

    (0, _keys2['default'])(overrides).forEach(function (key) {
       true ? (0, _warning2['default'])(stylesWithOverrides[key], ['Material-UI: you are trying to override a style that does not exist.', 'Fix the `' + key + '` key of `theme.overrides.' + name + '`.'].join('\n')) : void 0;
      stylesWithOverrides[key] = (0, _deepmerge2['default'])(stylesWithOverrides[key], overrides[key]);
    });

    return stylesWithOverrides;
  }

  return {
    create: create,
    options: {},
    themingEnabled: themingEnabled
  };
}

exports['default'] = getStylesCreator;

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(7);

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = __webpack_require__(51);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(52);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(53);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(54);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(60);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(11);

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = __webpack_require__(36);

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _wrapDisplayName = __webpack_require__(97);

var _wrapDisplayName2 = _interopRequireDefault(_wrapDisplayName);

var _createMuiTheme = __webpack_require__(37);

var _createMuiTheme2 = _interopRequireDefault(_createMuiTheme);

var _themeListener = __webpack_require__(61);

var _themeListener2 = _interopRequireDefault(_themeListener);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var defaultTheme = void 0;

function getDefaultTheme() {
  if (defaultTheme) {
    return defaultTheme;
  }

  defaultTheme = (0, _createMuiTheme2['default'])();
  return defaultTheme;
}

// Provide the theme object as a property to the input component.
var withTheme = function withTheme() {
  return function (Component) {
    var WithTheme = function (_React$Component) {
      (0, _inherits3['default'])(WithTheme, _React$Component);

      function WithTheme(props, context) {
        (0, _classCallCheck3['default'])(this, WithTheme);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (WithTheme.__proto__ || (0, _getPrototypeOf2['default'])(WithTheme)).call(this, props, context));

        _this.state = {};
        _this.unsubscribeId = null;

        _this.state = {
          // We use || as the function call is lazy evaluated.
          theme: _themeListener2['default'].initial(context) || getDefaultTheme()
        };
        return _this;
      }

      (0, _createClass3['default'])(WithTheme, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          this.unsubscribeId = _themeListener2['default'].subscribe(this.context, function (theme) {
            _this2.setState({ theme: theme });
          });
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          if (this.unsubscribeId !== null) {
            _themeListener2['default'].unsubscribe(this.context, this.unsubscribeId);
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2['default'].createElement(Component, (0, _extends3['default'])({ theme: this.state.theme }, this.props));
        }
      }]);
      return WithTheme;
    }(_react2['default'].Component);

    WithTheme.contextTypes = _themeListener2['default'].contextTypes;

    if (true) {
      WithTheme.displayName = (0, _wrapDisplayName2['default'])(Component, 'WithTheme');
    }

    (0, _hoistNonReactStatics2['default'])(WithTheme, Component);

    if (true) {
      // Exposed for test purposes.
      WithTheme.Naked = Component;
    }

    return WithTheme;
  };
};

exports['default'] = withTheme;

/***/ })
/******/ ]);