(function ($) {
    $.fn.validate = function () {
        var inputs;
        var result = {
            val: 0,
            log: []
        };
        var is_not_target = this.data('validate') === undefined;

        if (is_not_target) {
            inputs = this.find('[data-validate]');
        } else {
            inputs = [this];
        }

        $.each(inputs, function(i, v) {
            ValidatorFuncs.reset_state(this);
            ValidatorFuncs.validate(this, result);
        });
        return result.val == 0;
    }

    var ValidatorFuncs = {
        required: function(val){
            if (Array.isArray(val)) {
                return val.length > 0 ? val : false;
            } else {
                return Utils.isValue(val) ? val.trim() : false;
            }
        },
        length: function(val, len){
            if (Array.isArray(val)) {return val.length === parseInt(len);}
            if (!Utils.isValue(len) || isNaN(len) || len <= 0) {
                return false;
            }
            return val.trim().length === parseInt(len);
        },
        minlength: function(val, len){
            if (Array.isArray(val)) {return val.length >= parseInt(len);}
            if (!Utils.isValue(len) || isNaN(len) || len <= 0) {
                return false;
            }
            return val.trim().length >= parseInt(len);
        },
        maxlength: function(val, len){
            if (Array.isArray(val)) {return val.length <= parseInt(len);}
            if (!Utils.isValue(len) || isNaN(len) || len <= 0) {
                return false;
            }
            return val.trim().length <= parseInt(len);
        },
        min: function(val, min_value){
            if (!Utils.isValue(min_value) || isNaN(min_value)) {
                return false;
            }
            if (!this.number(val)) {
                return false;
            }
            if (isNaN(val)) {
                return false;
            }
            return Number(val) >= Number(min_value);
        },
        max: function(val, max_value){
            if (!Utils.isValue(max_value) || isNaN(max_value)) {
                return false;
            }
            if (!this.number(val)) {
                return false;
            }
            if (isNaN(val)) {
                return false;
            }
            return Number(val) <= Number(max_value);
        },
        email: function(val){
            return /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(val);
        },
        domain: function(val){
            return /^((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(val);
        },
        url: function(val){
            return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(val);
        },
        date: function(val, format, locale){
            if (Utils.isNull(format)) {
                return String(new Date(val)).toLowerCase() !== "invalid date";
            } else {
                return String(val.toDate(format, locale)).toLowerCase() !== "invalid date";
            }
        },
        number: function(val){
            return !isNaN(val);
        },
        integer: function(val){
            return Utils.isInt(val);
        },
        float: function(val){
            return Utils.isFloat(val);
        },
        digits: function(val){
            return /^\d+$/.test(val);
        },
        hexcolor: function(val){
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
        },
        color: function(val){
            if (!Utils.isValue(val)) return false;
            return Colors.color(val, Colors.PALETTES.STANDARD) !== false;
        },
        pattern: function(val, pat){
            if (!Utils.isValue(val)) return false;
            if (!Utils.isValue(pat)) return false;
            var reg = new RegExp(pat);
            return reg.test(val);
        },
        compare: function(val, val2){
            return val === val2;
        },
        not: function(val, not_this){
            return val !== not_this;
        },
        notequals: function(val, val2){
            if (Utils.isNull(val)) return false;
            if (Utils.isNull(val2)) return false;
            return val.trim() !== val2.trim();
        },
        equals: function(val, val2){
            if (Utils.isNull(val)) return false;
            if (Utils.isNull(val2)) return false;
            return val.trim() === val2.trim();
        },
        custom: function(val, func){
            if (Utils.isFunc(func) === false) {
                return false;
            }
            return Utils.exec(func, [val]);
        },
    
        is_control: function(el){
            return el.parent().hasClass("input")
                || el.parent().hasClass("select")
                || el.parent().hasClass("textarea")
                || el.parent().hasClass("checkbox")
                || el.parent().hasClass("switch")
                || el.parent().hasClass("radio")
                || el.parent().hasClass("spinner")
                ;
        },
    
        reset_state: function(el){
            var input = $(el);
            var is_control = ValidatorFuncs.is_control(input);
    
            if (is_control) {
                input.parent().removeClass("is-invalid is-valid");
            } else {
                input.removeClass("is-invalid is-valid");
            }
        },
    
        set_valid_state: function(el){
            var input = $(el);
            var is_control = ValidatorFuncs.is_control(input);
    
            if (is_control) {
                input.parent().addClass("is-valid");
            } else {
                input.addClass("is-valid");
            }
        },
    
        set_invalid_state: function(el){
            var input = $(el);
            var is_control = ValidatorFuncs.is_control(input);
    
            if (is_control) {
                input.parent().addClass("is-invalid");
            } else {
                input.addClass("is-invalid");
            }
        },
    
        reset: function(form){
            var that = this;
            $.each($(form).find("[data-validate]"), function(){
                that.reset_state(this);
            });
    
            return this;
        },
    
        validate: function(el, result, cb_ok, cb_error, required_mode){
            var this_result = true;
            var input = $(el);
            var funcs = input.data('validate') !== undefined ? String(input.data('validate')).split(" ").map(function(s){return s.trim();}) : [];
            var errors = [];

            if (funcs.length === 0) {
                return true;
            }
    
            this.reset_state(input);
    
            if (input.attr('type') && input.attr('type').toLowerCase() === "checkbox") {
                if (funcs.indexOf('required') === -1) {
                    this_result = true;
                } else {
                    this_result = input.is(":checked");
                }
    
                if (this_result === false) {
                    errors.push('required');
                }
    
                if (result !== undefined) {
                    result.val += this_result ? 0 : 1;
                }
            } else if (input.attr('type') && input.attr('type').toLowerCase() === "radio") {
                if (input.attr('name') === undefined) {
                    this_result = true;
                }
    
                var radio_selector = 'input[name=' + input.attr('name') + ']:checked';
                this_result = $(radio_selector).length > 0;
    
                if (result !== undefined) {
                    result.val += this_result ? 0 : 1;
                }
            } else {
                $.each(funcs, function(){
                    if (this_result === false) return;
                    var rule = this.split("=");
                    var f, a, b;
    
                    f = rule[0]; rule.shift();
                    a = rule.join("=");
                    
                    if (f == 'validate') return;

                    if (['compare', 'equals', 'notequals'].indexOf(f) > -1) {
                        a = input[0].form.elements[a].value;
                    }
    
                    if (f === 'date') {
                        a = input.attr("data-value-format");
                        b = input.attr("data-value-locale");
                    }
    
                    if (Utils.isFunc(ValidatorFuncs[f]) === false)  {
                        this_result = true;
                    } else {
                        if (required_mode === true || f === "required") {
                            this_result = ValidatorFuncs[f](input.val(), a, b);
                        } else {
                            if (input.val().trim() !== "") {
                                this_result = ValidatorFuncs[f](input.val(), a, b);
                            } else {
                                this_result = true;
                            }
                        }
                    }
    
                    if (this_result === false) {
                        errors.push(f);
                    }
    
                    if (result !== undefined) {
                        result.val += this_result ? 0 : 1;
                    }
                });
            }
    
            if (this_result === false) {
                this.set_invalid_state(input);
    
                if (result !== undefined) {
                    result.log.push({
                        input: input[0],
                        name: input.attr("name"),
                        value: input.val(),
                        funcs: funcs,
                        errors: errors
                    });
                }
    
                if (cb_error !== undefined) Utils.exec(cb_error, [input, input.val()], input[0]);
    
            } else {
                this.set_valid_state(input);
    
                if (cb_ok !== undefined) Utils.exec(cb_ok, [input, input.val()], input[0]);
            }
    
            return this_result;
        }
    };

    var Utils = {
        isUrl: function (val) {
            return /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/.test(val);
        },
    
        isTag: function(val){
            return /^<\/?[\w\s="/.':;#-\/\?]+>/gi.test(val);
        },
    
        isColor: function (val) {
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
        },
    
        isEmbedObject: function(val){
            var embed = ["iframe", "object", "embed", "video"];
            var result = false;
            embed.forEach(function(v, i){
                'use strict';
                if (typeof val === "string" && val.toLowerCase() === v) {
                    result = true;
                } else if (val.nodeType !== undefined && val.tagName.toLowerCase() === v) {
                    result = true;
                }
            });
            return result;
        },
    
        isVideoUrl: function(val){
            return /youtu\.be|youtube|vimeo/gi.test(val);
        },
    
        isDate: function(val, format){
            var result;
    
            if (typeof val === "object" && Utils.isFunc(val['getMonth'])) {
                return true;
            }
    
            if (Utils.isValue(format)) {
                result = String(val).toDate(format);
            } else {
                result = String(new Date(val));
            }
    
            return result !== "Invalid Date";
        },
    
        isDateObject: function(v){
            return typeof v === 'object' && v['getMonth'] !== undefined;
        },
    
        isInt: function(n){
            return !isNaN(n) && +n % 1 === 0;
        },
    
        isFloat: function(n){
            return !isNaN(n) && +n % 1 !== 0;
        },
    
        isTouchDevice: function() {
            return (('ontouchstart' in window)
                || (navigator.MaxTouchPoints > 0)
                || (navigator.msMaxTouchPoints > 0));
        },
    
        isFunc: function(f){
            return Utils.isType(f, 'function');
        },
    
        isObject: function(o){
            return Utils.isType(o, 'object')
        },
    
        isArray: function(a){
            return Array.isArray(a);
        },
    
        isType: function(o, t){
            if (o === undefined || o === null) {
                return false;
            }
    
            if (typeof o === t) {
                return o;
            }
    
            if (Utils.isTag(o) || Utils.isUrl(o)) {
                return false;
            }
    
            if (typeof window[o] === t) {
                return window[o];
            }
    
            if (typeof o === 'string' && o.indexOf(".") === -1) {
                return false;
            }
    
            if (typeof o === 'string' && o.indexOf(" ") !== -1) {
                return false;
            }
    
            if (typeof o === 'string' && o.indexOf("(") !== -1) {
                return false;
            }
    
            if (typeof o === 'string' && o.indexOf("[") !== -1) {
                return false;
            }
    
            if (typeof o === "number" && t.toLowerCase() !== "number") {
                return false;
            }
    
            var ns = o.split(".");
            var i, context = window;
    
            for(i = 0; i < ns.length; i++) {
                context = context[ns[i]];
            }
    
            return typeof context === t ? context : false;
        },
    
        isMetroObject: function(el, type){
            var $el = $(el), el_obj = $el.data(type);
            if ($el.length === 0) {
                console.log(type + ' ' + el + ' not found!');
                return false;
            }
    
            if (el_obj === undefined) {
                console.log('Element not contain role '+ type +'! Please add attribute data-role="'+type+'" to element ' + el);
                return false;
            }
    
            return true;
        },
    
        isJQuery: function(el){
            return (typeof jQuery !== "undefined" && el instanceof jQuery);
        },
    
        isM4Q: function(el){
            return (typeof m4q !== "undefined" && el instanceof m4q);
        },
    
        isQ: function(el){
            return Utils.isJQuery(el) || Utils.isM4Q(el);
        },
    
        embedObject: function(val){
            return "<div class='embed-container'>" + $(val)[0].outerHTML + "</div>";
        },
    
        embedUrl: function(val){
            if (val.indexOf("youtu.be") !== -1) {
                val = "https://www.youtube.com/embed/" + val.split("/").pop();
            }
            return "<div class='embed-container'><iframe src='"+val+"'></iframe></div>";
        },
    
        secondsToTime: function(secs) {
            var hours = Math.floor(secs / (60 * 60));
    
            var divisor_for_minutes = secs % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);
    
            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);
    
            return {
                "h": hours,
                "m": minutes,
                "s": seconds
            };
        },
    
        hex2rgba: function(hex, alpha){
            var c;
            alpha = isNaN(alpha) ? 1 : alpha;
            if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                c= hex.substring(1).split('');
                if(c.length=== 3){
                    c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c= '0x'+c.join('');
                return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
            }
            throw new Error('Hex2rgba error. Bad Hex value');
        },
    
        random: function(from, to){
            return Math.floor(Math.random()*(to-from+1)+from);
        },
    
        uniqueId: function () {
            "use strict";
            var d = new Date().getTime();
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        },
    
        elementId: function(prefix){
            return prefix+"-"+(new Date()).getTime()+Utils.random(1, 1000);
        },
    
        secondsToFormattedString: function(time){
            var sec_num = parseInt(time, 10);
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);
    
            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
    
            return [hours, minutes, seconds].join(":");
        },
    
        callback: function(f, args, context){
            return Utils.exec(f, args, context);
        },
    
        func: function(f){
            return new Function("a", f);
        },
    
        exec: function(f, args, context){
            var result;
            if (f === undefined || f === null) {return false;}
            var func = Utils.isFunc(f);
            if (func === false) {
                func = Utils.func(f);
            }
    
            try {
                result = func.apply(context, args);
            } catch (err) {
                result = null;
                if (METRO_THROWS === true) {
                    throw err;
                }
            }
            return result;
        },
    
        isOutsider: function(element) {
            var el = $(element);
            var rect;
            var clone = el.clone();
    
            clone.removeAttr("data-role").css({
                visibility: "hidden",
                position: "absolute",
                display: "block"
            });
            el.parent().append(clone);
    
            rect = clone[0].getBoundingClientRect();
            clone.remove();
    
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
    
        inViewport: function(el){
            var rect = Utils.rect(el);
    
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },
    
        rect: function(el){
            if (typeof jQuery === "function" && el instanceof jQuery) {
                el = el[0];
            }
    
            return el.getBoundingClientRect();
        },
    
        getCursorPosition: function(el, e){
            var a = Utils.rect(el);
            return {
                x: Utils.pageXY(e).x - a.left - window.pageXOffset,
                y: Utils.pageXY(e).y - a.top - window.pageYOffset
            };
        },
    
        getCursorPositionX: function(el, e){
            return Utils.getCursorPosition(el, e).x;
        },
    
        getCursorPositionY: function(el, e){
            return Utils.getCursorPosition(el, e).y;
        },
    
        objectLength: function(obj){
            return Object.keys(obj).length;
        },
    
        percent: function(total, part, round_value){
            if (total === 0) {
                return 0;
            }
            var result = part * 100 / total;
            return round_value === true ? Math.round(result) : Math.round(result * 100) / 100;
        },
    
        camelCase: function(str){
            return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        },
    
        dashedName: function(str){
            return str.replace(/([A-Z])/g, function(u) { return "-" + u.toLowerCase(); });
        },
    
        objectShift: function(obj){
            var min = 0;
            Object.keys(obj).forEach(function(i){
                if (min === 0) {
                    min = i;
                } else {
                    if (min > i) {
                        min = i;
                    }
                }
            });
            delete obj[min];
    
            return obj;
        },
    
        objectDelete: function(obj, key){
            if (obj[key] !== undefined) delete obj[key];
        },
    
        arrayDeleteByMultipleKeys: function(arr, keys){
            keys.forEach(function(ind){
                delete arr[ind];
            });
            return arr.filter(function(item){
                return item !== undefined;
            })
        },
    
        arrayDelete: function(arr, val){
            if (arr.indexOf(val) > -1) arr.splice(arr.indexOf(val), 1);
        },
    
        arrayDeleteByKey: function(arr, key){
            arr.splice(key, 1);
        },
    
        nvl: function(data, other){
            return data === undefined || data === null ? other : data;
        },
    
        objectClone: function(obj){
            var copy = {};
            for(var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    copy[key] = obj[key];
                }
            }
            return copy;
        },
    
        detectIE: function() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf('MSIE ');
            if (msie > 0) {
                // IE 10 or older => return version number
                return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            }
    
            var trident = ua.indexOf('Trident/');
            if (trident > 0) {
                // IE 11 => return version number
                var rv = ua.indexOf('rv:');
                return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            }
    
            var edge = ua.indexOf('Edge/');
            if (edge > 0) {
                // Edge (IE 12+) => return version number
                return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            }
    
            // other browser
            return false;
        },
    
        detectChrome: function(){
            return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        },
    
        md5: function(s){
            return hex_md5(s);
        },
    
        encodeURI: function(str){
            return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
        },
    
        pageHeight: function(){
            var body = document.body,
                html = document.documentElement;
    
            return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        },
    
        cleanPreCode: function(selector){
            var els = Array.prototype.slice.call(document.querySelectorAll(selector), 0);
    
            els.forEach(function(el){
                var txt = el.textContent
                    .replace(/^[\r\n]+/, "")	// strip leading newline
                    .replace(/\s+$/g, "");
    
                if (/^\S/gm.test(txt)) {
                    el.textContent = txt;
                    return;
                }
    
                var mat, str, re = /^[\t ]+/gm, len, min = 1e3;
    
                while (mat = re.exec(txt)) {
                    len = mat[0].length;
    
                    if (len < min) {
                        min = len;
                        str = mat[0];
                    }
                }
    
                if (min === 1e3)
                    return;
    
                el.textContent = txt.replace(new RegExp("^" + str, 'gm'), "");
            });
        },
    
        coords: function(element){
            var el = $(element)[0];
            var box = el.getBoundingClientRect();
    
            return {
                top: box.top + window.pageYOffset,
                left: box.left + window.pageXOffset
            };
        },
    
        positionXY: function(e, t){
            switch (t) {
                case 'client': return Utils.clientXY(e);
                case 'screen': return Utils.screenXY(e);
                case 'page': return Utils.pageXY(e);
                default: return {x: 0, y: 0}
            }
        },
    
        clientXY: function(e){
            return {
                x: e.changedTouches ? e.changedTouches[0].clientX : e.clientX,
                y: e.changedTouches ? e.changedTouches[0].clientY : e.clientY
            };
        },
    
        screenXY: function(e){
            return {
                x: e.changedTouches ? e.changedTouches[0].screenX : e.screenX,
                y: e.changedTouches ? e.changedTouches[0].screenY : e.screenY
            };
        },
    
        pageXY: function(e){
            return {
                x: e.changedTouches ? e.changedTouches[0].pageX : e.pageX,
                y: e.changedTouches ? e.changedTouches[0].pageY : e.pageY
            };
        },
    
        isRightMouse: function(e){
            return "which" in e ? e.which === 3 : "button" in e ? e.button === 2 : undefined;
        },
    
        hiddenElementSize: function(el, includeMargin){
            var clone = $(el).clone();
            clone.removeAttr("data-role").css({
                visibility: "hidden",
                position: "absolute",
                display: "block"
            });
            $("body").append(clone);
    
            if (includeMargin === undefined) {
                includeMargin = false;
            }
    
            var width = clone.outerWidth(includeMargin);
            var height = clone.outerHeight(includeMargin);
            clone.remove();
            return {
                width: width,
                height: height
            }
        },
    
        getStyle: function(element, pseudo){
            var el = $(element)[0];
            return window.getComputedStyle(el, pseudo);
        },
    
        getStyleOne: function(el, property){
            return Utils.getStyle(el).getPropertyValue(property);
        },
    
        getTransformMatrix: function(el, returnArray){
            var computedMatrix = Utils.getStyleOne(el, "transform");
            var a = computedMatrix
                .replace("matrix(", '')
                .slice(0, -1)
                .split(',');
            return returnArray !== true ? {
                a: a[0],
                b: a[1],
                c: a[2],
                d: a[3],
                tx: a[4],
                ty: a[5]
            } : a;
        },
    
        computedRgbToHex: function(rgb){
            var a = rgb.replace(/[^\d,]/g, '').split(',');
            var result = "#", i;
    
            for(i = 0; i < 3; i++) {
                var h = parseInt(a[i]).toString(16);
                result += h.length === 1 ? "0" + h : h;
            }
    
            return result;
        },
    
        computedRgbToRgba: function(rgb, alpha){
            var a = rgb.replace(/[^\d,]/g, '').split(',');
            if (alpha === undefined) {
                alpha = 1;
            }
            a.push(alpha);
            return "rgba("+a.join(",")+")";
        },
    
        computedRgbToArray: function(rgb){
            return rgb.replace(/[^\d,]/g, '').split(',');
        },
    
        hexColorToArray: function(hex){
            var c;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                c= hex.substring(1).split('');
                if(c.length === 3){
                    c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c= '0x'+c.join('');
                return [(c>>16)&255, (c>>8)&255, c&255];
            }
            return [0,0,0];
        },
    
        hexColorToRgbA: function(hex, alpha){
            var c;
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                c= hex.substring(1).split('');
                if(c.length === 3){
                    c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c= '0x'+c.join('');
                return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255, alpha ? alpha : 1].join(',')+')';
            }
            return 'rgba(0,0,0,1)';
        },
    
        getInlineStyles: function(element){
            var i, l, styles = {}, el = $(element)[0];
            for (i = 0, l = el.style.length; i < l; i++) {
                var s = el.style[i];
                styles[s] = el.style[s];
            }
    
            return styles;
        },
    
        updateURIParameter: function(uri, key, value) {
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            }
            else {
                return uri + separator + key + "=" + value;
            }
        },
    
        getURIParameter: function(url, name){
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
    
        strToArray: function(str, delimiter, type, format){
            var a;
    
            if (!Utils.isValue(delimiter)) {
                delimiter = ",";
            }
    
            if (!Utils.isValue(type)) {
                type = "string";
            }
    
            a = (""+str).split(delimiter);
    
            return a.map(function(s){
                var result;
    
                switch (type) {
                    case "int":
                    case "integer": result = parseInt(s); break;
                    case "number":
                    case "float": result = parseFloat(s); break;
                    case "date": result = !Utils.isValue(format) ? new Date(s) : s.toDate(format); break;
                    default: result = s.trim();
                }
    
                return result;
            })
        },
    
        aspectRatioH: function(width, a){
            if (a === "16/9") return width * 9 / 16;
            if (a === "21/9") return width * 9 / 21;
            if (a === "4/3") return width * 3 / 4;
        },
    
        aspectRatioW: function(height, a){
            if (a === "16/9") return height * 16 / 9;
            if (a === "21/9") return height * 21 / 9;
            if (a === "4/3") return height * 4 / 3;
        },
    
        valueInObject: function(obj, value){
            return Object.values(obj).indexOf(value) > -1;
        },
    
        keyInObject: function(obj, key){
            return Object.keys(obj).indexOf(key) > -1;
        },
    
        inObject: function(obj, key, val){
            return obj[key] !== undefined && obj[key] === val;
        },
    
        newCssSheet: function(media){
            var style = document.createElement("style");
    
            if (media !== undefined) {
                style.setAttribute("media", media);
            }
    
            style.appendChild(document.createTextNode(""));
    
            document.head.appendChild(style);
    
            return style.sheet;
        },
    
        addCssRule: function(sheet, selector, rules, index){
            if("insertRule" in sheet) {
                sheet.insertRule(selector + "{" + rules + "}", index);
            }
            else if("addRule" in sheet) {
                sheet.addRule(selector, rules, index);
            }
        },
    
        media: function(query){
            return window.matchMedia(query).matches
        },
    
        isValue: function(val){
            return val !== undefined && val !== null && val !== "";
        },
    
        isNull: function(val){
            return val === undefined || val === null;
        },
    
        isNegative: function(val){
            return parseFloat(val) < 0;
        },
    
        isPositive: function(val){
            return parseFloat(val) > 0;
        },
    
        isZero: function(val){
            return (parseFloat(val.toFixed(2))) === 0.00;
        },
    
        between: function(val, bottom, top, equals){
            return equals === true ? val >= bottom && val <= top : val > bottom && val < top;
        },
    
        parseMoney: function(val){
            return Number(parseFloat(val.replace(/[^0-9-.]/g, '')));
        },
    
        parseCard: function(val){
            return val.replace(/[^0-9]/g, '');
        },
    
        parsePhone: function(val){
            return Utils.parseCard(val);
        },
    
        isVisible: function(element){
            var el = $(element)[0];
            return Utils.getStyleOne(el, "display") !== "none" && Utils.getStyleOne(el, "visibility") !== "hidden" && el.offsetParent !== null;
        },
    
        parseNumber: function(val, thousand, decimal){
            return val.replace(new RegExp('\\'+thousand, "g"), "").replace(new RegExp('\\'+decimal, 'g'), ".");
        },
    
        nearest: function(val, precision, down){
            val /= precision;
            val = Math[down === true ? 'floor' : 'ceil'](val) * precision;
            return val;
        },
    
        bool: function(value){
            switch(value){
                case true:
                case "true":
                case 1:
                case "1":
                case "on":
                case "yes":
                    return true;
                default:
                    return false;
            }
        },
    
        copy: function(element){
            var body = document.body, range, sel;
            var el = $(element)[0];
    
            if (document.createRange && window.getSelection) {
                range = document.createRange();
                sel = window.getSelection();
                sel.removeAllRanges();
                try {
                    range.selectNodeContents(el);
                    sel.addRange(range);
                } catch (e) {
                    range.selectNode(el);
                    sel.addRange(range);
                }
            } else if (body.createTextRange) {
                range = body.createTextRange();
                range.moveToElementText(el);
                range.select();
            }
    
            document.execCommand("Copy");
    
            if (window.getSelection) {
                if (window.getSelection().empty) {  // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) {  // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) {  // IE?
                document.selection.empty();
            }
        },
    
        isLocalhost: function(){
            return window.location.hostname === 'localhost' ||
                window.location.hostname === '[::1]' ||
                window.location.hostname.match(
                    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
                );
        },
    
        formData: function(f){
            var form = $(f)[0];
            var i, j, q = {};
    
            if (!form || form.nodeName !== "FORM") {
                return;
            }
    
            for (i = form.elements.length - 1; i >= 0; i = i - 1) {
                if (form.elements[i].name === "") {
                    continue;
                }
                switch (form.elements[i].nodeName) {
                    case 'INPUT':
                        switch (form.elements[i].type) {
                            case 'text':
                            case 'hidden':
                            case 'password':
                            case 'button':
                            case 'reset':
                            case 'submit':
                                q[form.elements[i].name] = form.elements[i].value;
                                break;
                            case 'checkbox':
                            case 'radio':
                                if (form.elements[i].checked) {
                                    q[form.elements[i].name] = form.elements[i].value;
                                }
                                break;
                        }
                        break;
                    case 'file':
                        break;
                    case 'TEXTAREA':
                        q[form.elements[i].name] = form.elements[i].value;
                        break;
                    case 'SELECT':
                        switch (form.elements[i].type) {
                            case 'select-one':
                                q[form.elements[i].name] = form.elements[i].value;
                                break;
                            case 'select-multiple':
                                q[form.elements[i].name] = [];
                                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                    if (form.elements[i].options[j].selected) {
                                        q[form.elements[i].name].push(form.elements[i].options[j].value);
                                    }
                                }
                                break;
                        }
                        break;
                    case 'BUTTON':
                        switch (form.elements[i].type) {
                            case 'reset':
                            case 'submit':
                            case 'button':
                                q[form.elements[i].name] = form.elements[i].value;
                                break;
                        }
                        break;
                }
            }
            return q;
        }
    };

    
}(jQuery));