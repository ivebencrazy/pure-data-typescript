(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var state = {
        currentPatch: [],
        mode: "interactive",
    };
    // UI CONSTANTS
    var OBJECT_HEIGHT = 18;
    var PORTLET_HEIGHT = 3;
    var PORTLET_WIDTH = 8;
    // Canvas Setup
    var canvas = document.getElementById("pd");
    var context = canvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    var bsr = context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;
    var PIXEL_RATIO = dpr / bsr;
    canvas.width = window.innerWidth * PIXEL_RATIO;
    canvas.height = window.innerHeight * PIXEL_RATIO;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    context.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

    var body = document.getElementsByTagName("body")[0];
    var ContextMenu = /** @class */ (function () {
        function ContextMenu() {
            var _this = this;
            this.ref = null;
            this.listeners = [];
            this.removeMenu = function () {
                if (_this.ref) {
                    body.removeChild(_this.ref);
                    _this.ref = null;
                }
                if (_this.listeners) {
                    _this.listeners.forEach(function (listener) { return removeEventListener("click", listener); });
                }
            };
            body.addEventListener("click", this.removeMenu);
        }
        ContextMenu.prototype.render = function (xPos, yPos, items) {
            var _this = this;
            var menu = this.ref || document.createElement("div");
            menu.className = "context-menu";
            menu.style.top = yPos + "px";
            menu.style.left = xPos + "px";
            var menuItems = items.map(function (_a, i) {
                var name = _a.name;
                return "<li class=\"context-" + i + "\">" + name + "</li>";
            }).join("");
            menu.innerHTML = "<ul>" + menuItems + "</ul>";
            if (!this.ref) {
                body.appendChild(menu);
                items.forEach(function (_a, i) {
                    var method = _a.method;
                    var ref = document.getElementsByClassName("context-" + i)[0];
                    if (ref)
                        _this.listeners.push(ref.addEventListener("click", method));
                });
            }
            this.ref = menu;
        };
        return ContextMenu;
    }());

    /**
     * @class PDArray
     * @description Array of Numbers
     *
     * @example
     */
    var PDArray = /** @class */ (function () {
        function PDArray(_a) {
            var name = _a[0], size = _a[1], format = _a[2], saveFlag = _a[3];
            this.chunkType = "X";
            this.elementType = "array";
            this.data = [];
            this.name = String(name);
            this.size = Number(size);
            this.format = String(format);
            this.saveFlag = Boolean(saveFlag);
        }
        PDArray.prototype.addData = function (data) {
            this.data = this.data.concat(data.map(Number));
        };
        // TODO: This currently breaks for two reasons:
        // - Need to format small numbers: 9.41753e-06
        // - #A is often split into multiple lines. Not sure why yet. Probably Dimensions or size constraint.
        PDArray.prototype.toString = function () {
            var meta = "#X array " + this.name + " " + this.size + " " + this.format + " " + (this.saveFlag ? 1 : 0) + ";\r\n";
            var data = "#A " + this.data.join(" ");
            return meta + data;
        };
        return PDArray;
    }());

    /**
     * @class PDCanvas
     * @description Defines window properties
     *
     * @example
     */
    // TODO: Doesn't support initial path canvas declaration (different 1-off format)
    var PDCanvas = /** @class */ (function () {
        function PDCanvas(_a) {
            var xPos = _a[0], yPos = _a[1], xSize = _a[2], ySize = _a[3], name = _a[4], openOnLoad = _a[5];
            this.chunkType = "N";
            this.elementType = "canvas";
            this.isSubPatch = isNaN(parseInt(name, 10));
            this.name = this.isSubPatch ? name : null;
            this.xPos = Number(xPos);
            this.yPos = Number(yPos);
            this.xSize = Number(xSize);
            this.ySize = Number(ySize);
            this.openOnLoad = Boolean(openOnLoad);
        }
        PDCanvas.prototype.toString = function () {
            return "#N canvas " + this.xPos + " " + this.yPos + " " + this.xSize + " " + this.ySize + " " + this.name + " " + this.openOnLoad;
        };
        return PDCanvas;
    }());

    /**
     * @class PDConnect
     * @description Wires GUI-elements
     * Objects are virtually numbered in order of appearance in the file,
     * starting from zero. Inlets and outlets of the objects are numbered likewise.
     *
     * @example
     *  #X obj 30 27 midiin;
     *  #X obj 26 59 midiout;
     *  #X connect 0 0 1 0;
     *  #X connect 0 1 1 1;
     */
    var PDConnect = /** @class */ (function () {
        function PDConnect(_a) {
            var source = _a[0], outlet = _a[1], target = _a[2], inlet = _a[3];
            this.chunkType = "X";
            this.elementType = "connect";
            this.inlet = Number(inlet);
            this.outlet = Number(outlet);
            this.source = Number(source);
            this.target = Number(target);
        }
        PDConnect.prototype.toString = function () {
            return "#X connect " + this.source + " " + this.outlet + " " + this.target + " " + this.inlet;
        };
        return PDConnect;
    }());

    /**
     * @class PDCoords
     * @description Visual ranges of a frameset (window)
     * A coords statement must always be preceded with a canvas statement which also holds the graph name.
     * starting from zero. Inlets and outlets of the objects are numbered likewise.
     *
     * @example
     *  #X obj 30 27 midiin;
     *  #X obj 26 59 midiout;
     *  #X connect 0 0 1 0;
     *  #X connect 0 1 1 1;
     */
    var PDCoords = /** @class */ (function () {
        function PDCoords(_a) {
            var xFrom = _a[0], yTo = _a[1], xTo = _a[2], yFrom = _a[3], width = _a[4], height = _a[5], graphOnParent = _a[6];
            this.chunkType = "X";
            this.elementType = "coords";
            this.xFrom = Number(xFrom);
            this.xTo = Number(xTo);
            this.yFrom = Number(yFrom);
            this.yTo = Number(yTo);
            this.width = Number(width);
            this.height = Number(height);
            this.graphOnParent = Boolean(graphOnParent);
        }
        PDCoords.prototype.toString = function () {
            return "#X coords " + this.xFrom + " " + this.yTo + " " + this.xTo + " " + this.yFrom +
                (" " + this.width + " " + this.height + " " + (this.graphOnParent ? 1 : 0));
        };
        return PDCoords;
    }());

    // Initialize draw settings
    context.lineWidth = "1";
    context.fillStyle = "black";
    context.font = "10pt monaco";
    context.fillText("Drop file to start", window.innerWidth / 2.2, window.innerHeight / 2.8);
    // Determine the longest visual length item to render
    function getDisplayLength(drawText, inlets, outlets) {
        var textLength = drawText.length * 6 + 5;
        var inletLength = inlets.length * 20;
        var outletLength = outlets.length * 20;
        return Math.max(textLength, inletLength, outletLength);
    }
    function inlets(length, xPos, yPos, inlets, outlets) {
        var inletY = yPos;
        var outletY = yPos + OBJECT_HEIGHT - PORTLET_HEIGHT;
        var actualLength = Math.max(length, 20) - PORTLET_WIDTH;
        var inletDistance = actualLength / Math.max(1, inlets.length - 2);
        var outletDistance = actualLength / Math.max(1, outlets.length - 2);
        inlets.forEach(function (type, index) {
            var nextInletLocation = xPos + index * inletDistance;
            if (type === "signal") {
                context.fillRect(nextInletLocation, inletY, PORTLET_WIDTH, PORTLET_HEIGHT);
            }
            else {
                context.strokeRect(nextInletLocation, inletY, PORTLET_WIDTH, PORTLET_HEIGHT);
            }
        });
        outlets.forEach(function (type, index) {
            var nextOutletLocation = xPos + index * outletDistance;
            if (type === "signal") {
                context.fillRect(nextOutletLocation, outletY, PORTLET_WIDTH, PORTLET_HEIGHT);
            }
            else {
                context.strokeRect(nextOutletLocation, outletY, PORTLET_WIDTH, PORTLET_HEIGHT);
            }
        });
    }
    // Colors are 0-63, multiplied to separate, then added into big int
    // This func turns them into rgba(0-256, 0-256, 0-256)
    function parseColor(str) {
        var num = Number(str).toString(2).slice(1).padStart(18, "0");
        var r = parseInt(num.slice(0, 6), 2) * 4;
        var g = parseInt(num.slice(6, 12), 2) * 4;
        var b = Math.max(0, parseInt(num.slice(12), 2) * 4) || 256;
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
    function rectOutline(xPos, yPos, length) {
        context.strokeRect(xPos, yPos, Math.max(length, 20), OBJECT_HEIGHT);
    }
    function text(xPos, yPos, text, size) {
        context.fillStyle = "black";
        context.font = size ? size + "pt monaco" : "7pt monaco";
        context.fillText(text, xPos + 2, yPos + OBJECT_HEIGHT - 6);
    }

    /**
     * @class PDFloatatom
     * @description Defines a number box
     * When the value of [upper_limit] minus the value of [lower_limit] is less than one,
     * or the [width] attribute is set to one, PureData resets these values both to zero.
     * Floatatom and symbolatom are the only elements that uses "-" characters to indicate
     * that no value has been assigned to its attributes [label], [receive] and [send].
     *
     *
     * @example
     *  #X floatatom 32 26 5 0 0 0 - - -;
     */
    var PDFloatatom = /** @class */ (function () {
        function PDFloatatom(_a) {
            var xPos = _a[0], yPos = _a[1], width = _a[2], lowerLimit = _a[3], upperLimit = _a[4], labelPos = _a[5], label = _a[6], receive = _a[7], send = _a[8];
            this.chunkType = "X";
            this.elementType = "floatatom";
            this.color = "black";
            this.inlets = ["control"];
            this.outlets = ["signal"];
            this.lowerLimit = Number(lowerLimit);
            this.label = String(label);
            this.labelPos = Number(labelPos);
            this.receive = String(receive);
            this.send = String(send);
            this.upperLimit = Number(upperLimit);
            this.width = Number(width);
            this.xPos = Number(xPos);
            this.yPos = Number(yPos);
        }
        PDFloatatom.prototype.render = function () {
            var displayText = this.label.replace(/\\/g, "");
            var length = getDisplayLength(displayText, this.inlets, this.outlets);
            context.strokeStyle = this.color;
            drawOutline(this.xPos, this.yPos, length);
            text(this.xPos, this.yPos, displayText);
            inlets(length, this.xPos, this.yPos, this.inlets, this.outlets);
        };
        PDFloatatom.prototype.toString = function () {
            var str = "#X floatatom " + this.xPos + " " + this.yPos + " " + this.width +
                (" " + this.lowerLimit + " " + this.upperLimit + " " + this.labelPos);
            str += (this.label || "-");
            str += (this.receive || "-");
            str += (this.send || "-");
            return str;
        };
        return PDFloatatom;
    }());
    // Number box has a custom shaped outline
    function drawOutline(xPos, yPos, length) {
        context.beginPath();
        context.moveTo(xPos, yPos);
        context.lineTo(xPos + length, yPos);
        context.lineTo(xPos + length + 5, yPos + 5);
        context.lineTo(xPos + length + 5, yPos + OBJECT_HEIGHT);
        context.lineTo(xPos, yPos + OBJECT_HEIGHT);
        context.lineTo(xPos, yPos);
        context.stroke();
    }

    /**
     * @class PDMsg
     * @description Defines a message
     *
     * @example
     *  #X msg 61 48 read audio.wav;
     */
    var PDMsg = /** @class */ (function () {
        function PDMsg(_a) {
            var xPos = _a[0], yPos = _a[1], params = _a.slice(2);
            this.chunkType = "X";
            this.elementType = "msg";
            this.color = "black";
            this.inlets = ["control"];
            this.outlets = ["signal"];
            this.xPos = Number(xPos);
            this.yPos = Number(yPos);
            this.text = params.join(" ");
        }
        PDMsg.prototype.render = function () {
            var displayText = this.text.replace(/\\/g, "");
            var length = getDisplayLength(displayText, this.inlets, this.outlets);
            context.strokeStyle = this.color;
            drawMsgOutline(this.xPos, this.yPos, length);
            text(this.xPos, this.yPos, displayText);
            inlets(length, this.xPos, this.yPos, this.inlets, this.outlets);
        };
        PDMsg.prototype.toString = function () {
            return "#X msg " + this.xPos + " " + this.yPos + " " + this.text;
        };
        return PDMsg;
    }());
    // Message box has a custom shaped outline
    function drawMsgOutline(xPos, yPos, length) {
        context.beginPath();
        context.moveTo(xPos, yPos);
        context.lineTo(xPos + length + 5, yPos);
        context.lineTo(xPos + length, yPos + (OBJECT_HEIGHT / 4));
        context.lineTo(xPos + length, yPos + (OBJECT_HEIGHT * 3 / 4));
        context.lineTo(xPos + length + 5, yPos + OBJECT_HEIGHT);
        context.lineTo(xPos, yPos + OBJECT_HEIGHT);
        context.lineTo(xPos, yPos);
        context.stroke();
    }

    /**
     * @class PDtext
     * @description Defines a message
     *
     * @example
     *  #X text 61 48 read audio.wav;
     */
    var PDText = /** @class */ (function () {
        function PDText(_a) {
            var xPos = _a[0], yPos = _a[1], params = _a.slice(2);
            this.chunkType = "X";
            this.elementType = "text";
            this.xPos = Number(xPos);
            this.yPos = Number(yPos);
            this.text = params.join(" ");
        }
        PDText.prototype.render = function () {
            var displayText = this.text.replace(/\\/g, "");
            context.strokeStyle = "black";
            text(this.xPos, this.yPos, displayText);
        };
        PDText.prototype.toString = function () {
            return "#X text " + this.xPos + " " + this.yPos + " " + this.text;
        };
        return PDText;
    }());

    var ctrl = "control";
    var generics = {
        "%": [[ctrl, ctrl], [ctrl], function (_a) {
                var a = _a[0], b = _a[1];
                return a % b;
            }],
        "*": [[ctrl, ctrl], [ctrl], function (_a) {
                var a = _a[0], b = _a[1];
                return a * b;
            }],
        "+": [[ctrl, ctrl], [ctrl], function (_a) {
                var a = _a[0], b = _a[1];
                return a + b;
            }],
        "-": [[ctrl, ctrl], [ctrl], function (_a) {
                var a = _a[0], b = _a[1];
                return a - b;
            }],
        "/": [[ctrl, ctrl], [ctrl], function (_a) {
                var a = _a[0], b = _a[1];
                return a / b;
            }],
        "abs": [[ctrl], [ctrl], Math.abs],
        "atan": [[ctrl], [ctrl], Math.atan],
        "atan2": [[ctrl, ctrl], [ctrl], Math.atan2],
        "cos": [[ctrl], [ctrl], Math.cos],
        "dbtopow": [[ctrl], [ctrl], function (a) { return a <= 0 ? 0 : Math.exp(Math.LN10 * (a - 100) / 10); }],
        "dbtorms": [[ctrl], [ctrl], function (a) { return a <= 0 ? 0 : Math.exp(Math.LN10 * (a - 100) / 20); }],
        "del": [[ctrl, ctrl], [ctrl], function () { return; }],
        "delay": [[ctrl, ctrl], [ctrl], function () { return; }],
        "exp": [[ctrl], [ctrl], Math.exp],
        "ftom": [[ctrl], [ctrl], function () { return; }],
        "inlet": [[], [ctrl], function () { return; }],
        "key": [[], [ctrl], function () { return; }],
        "keyup": [[], [ctrl], function () { return; }],
        "loadbang": [[], [ctrl], function () { return; }],
        "log": [[ctrl], [ctrl], Math.log],
        "max": [[ctrl, ctrl], [ctrl], Math.max],
        "metro": [[ctrl], [ctrl], function () { return; }],
        "min": [[ctrl, ctrl], [ctrl], Math.min],
        "mod": [[ctrl, ctrl], [ctrl], function (_a) {
                var a = _a[0], b = _a[1];
                return a % b;
            }],
        "mtof": [[ctrl], [ctrl], function () { return; }],
        "outlet": [[ctrl], [], function () { return; }],
        "pow": [[ctrl, ctrl], [ctrl], Math.pow],
        "powtodb": [[ctrl], [ctrl], function (a) { return a <= 0 ? 0 : 10 * Math.log(a) / Math.LN10 + 100; }],
        "print": [[ctrl], [], function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                console.log(args);
            }],
        "r": [[ctrl], [], function () { return; }],
        "receive": [[ctrl], [], function () { return; }],
        "rmstodb": [[ctrl], [ctrl], function (a) { return a <= 0 ? 0 : 20 * Math.log(a) / Math.LN10 + 100; }],
        "s": [[ctrl], [], function () { return; }],
        "send": [[ctrl], [], function () { return; }],
        "sin": [[ctrl], [ctrl], Math.sin],
        "spigot": [[ctrl, ctrl], [ctrl]],
        "sqrt": [[ctrl], [ctrl], Math.sqrt],
        "tan": [[ctrl], [ctrl], Math.tan],
        "wrap": [[ctrl], [], function (a) { return a - Math.floor(a); }],
    };

    /**
     * @class PDObject
     * @description An object
     *
     *
     * @example
     *  #X obj 30 27 midiin;
     *  #X obj 26 59 midiout;
     */
    var PDObj = /** @class */ (function () {
        function PDObj(_a) {
            var xPos = _a[0], yPos = _a[1], name = _a[2], params = _a.slice(3);
            this.chunkType = "X";
            this.elementType = "obj";
            this.color = "black";
            this.inlets = [];
            this.outlets = [];
            this.length = 0;
            this.xPos = Number(xPos);
            this.yPos = Number(yPos);
            this.name = String(name || "");
            this.params = params;
        }
        PDObj.prototype.render = function () {
            if (generics[this.name]) {
                this.inlets = generics[this.name][0];
                this.outlets = generics[this.name][1];
                this.behavior = generics[this.name][2];
            }
            this.displayText = this.name.replace(/\\/g, "");
            this.length = getDisplayLength(this.displayText, this.inlets, this.outlets);
            context.strokeStyle = this.color;
            rectOutline(this.xPos, this.yPos, this.length);
            text(this.xPos, this.yPos, this.displayText);
            inlets(this.length, this.xPos, this.yPos, this.inlets, this.outlets);
        };
        PDObj.prototype.toString = function () {
            return "#X msg " + this.xPos + " " + this.yPos + " " + this.name + " " + this.params.join(" ");
        };
        return PDObj;
    }());

    /**
     * @class PDObject
     * @description An object
     *
     *
     * @example
     *  #X obj 30 27 midiin;
     *  #X obj 26 59 midiout;
     */
    var PDObjCnv = /** @class */ (function (_super) {
        __extends(PDObjCnv, _super);
        function PDObjCnv(params) {
            var _this = _super.call(this, params) || this;
            _this.chunkType = "X";
            _this.elementType = "obj";
            _this.objectType = "cnv";
            _this.color = "black";
            _this.inlets = [];
            _this.outlets = [];
            _this.width = Number(params[4]);
            _this.height = Number(params[5]);
            _this.label = params[8] !== "empty" ? _this.params[8] : "";
            _this.xLabelOffset = Number(params[9]);
            _this.yLabelOffset = Number(params[10]) + 30;
            _this.fontSize = Number(params[12]) - 8;
            _this.bgColor = params[13];
            _this.labelColor = params[14];
            return _this;
        }
        PDObjCnv.prototype.render = function () {
            context.fillStyle = parseColor(this.bgColor);
            context.fillRect(this.xPos, this.yPos, this.width, this.height);
            text(this.xPos + this.xLabelOffset, this.yPos + this.yLabelOffset, this.label, this.fontSize);
        };
        PDObjCnv.prototype.toString = function () {
            return "#X msg " + this.xPos + " " + this.yPos + " " + this.name + " " + this.params.join(" ");
        };
        return PDObjCnv;
    }(PDObj));

    var objects = {
        cnv: PDObjCnv,
    };

    /**
     * Utilities for parsing to and from*.pd files
     * It goes to and from text files to javascript classes
     * Based on unoffiicial spec: http://puredata.info/docs/developer/PdFileFormat
     * @param text *.pd file text
     */
    var prev = null;
    var subPatchName = null;
    function deserializeFromFile(text) {
        return text
            .split(/;\r?\n/)
            .filter(Boolean)
            .map(function (line) {
            var _a = line.substring(1).split(/\s+/), chunk = _a[0], element = _a[1], params = _a.slice(2);
            // Ignore subPatches for now
            if (subPatchName) {
                var endsGraph = subPatchName === "(subpatch)" && params[2] === "graph";
                var endsSubPatch = element === "restore" && subPatchName === params[3];
                if (!endsGraph && !endsSubPatch)
                    return;
                subPatchName = null;
            }
            if (prev && chunk === "A") {
                // Special case; array's "element" type is included in prev line
                prev.addData([element].concat(params));
                return;
            }
            prev = null;
            if (chunk === "N" && element === "canvas") {
                var canvas = new PDCanvas(params);
                if (canvas.isSubPatch)
                    subPatchName = canvas.name;
                return canvas;
            }
            if (chunk === "X") {
                switch (element) {
                    case "array":
                        prev = new PDArray(params);
                        return prev;
                    case "connect": return new PDConnect(params);
                    case "coords": return new PDCoords(params);
                    case "floatatom": return new PDFloatatom(params);
                    case "msg": return new PDMsg(params);
                    case "text": return new PDText(params);
                    case "obj": {
                        var objectType = params[2];
                        if (objects[objectType])
                            return new objects[objectType](params);
                        else
                            return new PDObj(params);
                    }
                    default: return { chunk: chunk, element: element, params: params };
                }
            }
            throw new Error("invalid syntax, " + line);
        }).filter(Boolean);
    }
    function serializeToFile(elements) {
        return elements.map(function (el) { return el.chunkType
            ? el.toString()
            : ["#", el.chunk, el.element].concat(el.params).join(" "); }).join(";\r\n") + ";\r\n";
    }

    function downloadPatch(patch) {
        if (patch != null) {
            var patchText = serializeToFile(patch);
            var blob = new Blob([patchText], { type: "application/octet-stream" });
            var blobURL = window.URL.createObjectURL(blob);
            var tempLink = document.createElement("a");
            tempLink.style.display = "none";
            tempLink.href = blobURL;
            tempLink.setAttribute("download", "patch.pd");
            if (typeof tempLink.download === "undefined") {
                tempLink.setAttribute("target", "_blank");
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
        }
    }
    var loadPatch = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files; // Array of all files
        var file = files[0];
        return new Promise(function (resolve) {
            if (file && file.name.match(/\.pd$/)) {
                var reader = new FileReader();
                reader.onload = function (e2) {
                    resolve(e2.target.result);
                };
                reader.readAsBinaryString(file); // start reading the file data.
            }
        });
    };

    function renderPatch(patch) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        patch.forEach(function (item) {
            if (item instanceof PDMsg
                || item instanceof PDFloatatom
                || item instanceof PDText
                || item instanceof PDObj)
                item.render();
        });
    }

    document.addEventListener("DOMContentLoaded", function initialize() {
        listenForHeaderChanges();
        listenForCanvasChanges();
    });
    function listenForHeaderChanges() {
        var modeCheckbox = document.getElementById("mode");
        modeCheckbox.checked = state.mode === "edit";
        modeCheckbox.addEventListener("click", function toggleMode() {
            state.mode = state.mode === "edit" ? "interactive" : "edit";
        });
        var exportButton = document.getElementById("export");
        exportButton.addEventListener("click", function () { return downloadPatch(state.currentPatch); });
    }
    function listenForCanvasChanges() {
        var _this = this;
        var patchCanvas = document.getElementById("pd");
        // When dragging a file over canvas, update UI
        patchCanvas.addEventListener("dragover", function (e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        });
        // When dropping a file over canvas, render it as a patch
        patchCanvas.addEventListener("drop", function (e) { return __awaiter(_this, void 0, void 0, function () {
            var patchText, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = String;
                        return [4 /*yield*/, loadPatch(e)];
                    case 1:
                        patchText = _a.apply(void 0, [_b.sent()]);
                        state.currentPatch = deserializeFromFile(patchText);
                        renderPatch(state.currentPatch);
                        return [2 /*return*/];
                }
            });
        }); });
        // On right-click on canvas, render custom contextmenu
        var menu = new ContextMenu();
        patchCanvas.addEventListener("contextmenu", function (e) {
            e.stopPropagation();
            e.preventDefault();
            menu.render(e.pageX, e.pageY, [
                { name: "Properties", method: function () { console.log("Properties"); } },
                { name: "Object ⌘1", method: function () { console.log("Object ⌘1"); } },
                { name: "Message ⌘2", method: function () { console.log("Message ⌘2"); } },
                { name: "Number ⌘3", method: function () { console.log("Number ⌘3"); } },
                { name: "Symbol ⌘4", method: function () { console.log("Symbol ⌘4"); } },
                { name: "Comment ⌘5", method: function () { console.log("Comment ⌘5"); } },
            ]);
        });
    }

}());
//# sourceMappingURL=index.js.map