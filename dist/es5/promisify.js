!function(t,o){"object"==typeof exports&&"undefined"!=typeof module?module.exports=o():"function"==typeof define&&define.amd?define(o):((t=t||self).promisify=t.promisify||{},t.promisify.js=o())}(this,function(){"use strict";function u(t){return(u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function y(r,e){return p("Function",r),function(){for(var t=arguments.length,o=new Array(t),n=0;n<t;n++)o[n]=arguments[n];return function(t,o,i){var n=this;return new Promise(function(e,c){o.push(function(t){if(t)return c(t);for(var o=arguments.length,n=new Array(1<o?o-1:0),r=1;r<o;r++)n[r-1]=arguments[r];return e(i&&i.multiArgs?n:n[0])}),t.apply(n,o)})}.call(this,r,o,e)}}var r,p=(r="promisify",function(t,o){var n=Object.prototype.toString.call(o);if("Function"===t?"function"!=typeof o:"[object ".concat(t,"]")!==n)throw new TypeError("".concat(r,": expected [").concat(t,"] but got ").concat(n))}),a=Symbol("promisified");return y.all=function(n,r){p("Object",n);var t=r||{},e=t.suffix,c=t.exclude,i=t.include,o=t.proto;if(e="string"==typeof e?e:"Async",c=Array.isArray(c)?c:void 0,i=Array.isArray(i)?i:void 0,Object.getOwnPropertyNames(n).forEach(function(t){if(function(o,t,n){return"function"==typeof o&&!0!==o[a]&&(!n||n.some(function(t){return t===o.name}))&&(!t||t.every(function(t){return t!==o.name}))}(n[t],c,i)){for(var o="".concat(t).concat(e);o in n;){if(!0===n[o][a])return;o="".concat(o,"Promisified")}n[o]=y(n[t],r),n[o][a]=!0}}),o){var f=Object.getPrototypeOf(n);f&&!function(t){return!(!t||"object"!==u(t)&&"function"!=typeof t||!Object.prototype.hasOwnProperty.call(t,"constructor")||"function"!=typeof t.constructor||!Function.prototype.toString.call(t.constructor).includes("[native code]"))}(f)&&y.all(f,r)}return n},y});
