/**
 * Created by babybreath on 2016/9/21.
 */

'use strict';

// 默认配置
// require 参数必选
// convert 执行类型转换
// msg 错误提示
// requireMsg 不能为空提示
const defaultOptions = {
    require: true,
    convert: true,
    msg: '参数格式不正确',
    requireMsg: '参数不能为空'
};

// 类型转换
const doConvert = {
    'string': function (param) {
        return String(param);
    },
    'number': function (param) {
        return Number(param);
    },
    'boolean': function (param) {
        return Boolean(param);
    }
};

// 如果没有rule属性，直接返回参数
// 否则，判断rule属性类型
//   数组：顺序执行校验
//   非数组：执行校验
function valid(name, value, rule, result) {
    if (rule.rule) {
        if (Array.isArray(rule.rule)) {
            for (let i in rule.rule) {
                doValid(value, rule.rule[i], result);
                if (result.ok) {
                    continue;
                } else {
                    return result;
                }
            }
        } else if (rule.rule.rule) {
            return doValid(value, rule.rule, result);
        } else {
            return doValid(value, rule, result);
        }
    } else {
        return result;
    }
}

// 执行具体的校验方法
// 正则：执行test方法
// 方法：执行此方法
// 其他：忽略校验
function doValid(value, r, result) {
    if (isRegExp(r.rule)) {
        if (r.rule.test(value)) {
            return result;
        } else {
            result.ok = false;
            result.errorMsg = r.msg;
            return result;
        }
    } else if (isFunction(r.rule)) {
        if (r.rule(value)) {
            return result;
        } else {
            result.ok = false;
            result.errorMsg = r.msg;
            return result;
        }
    } else {
        return result;
    }
}

// 对外暴露方法
function Validater(options) {
    const CONFIG = Object.assign({}, defaultOptions, options);
    let validater = function (origin, rules) {
        let param = {};
        let result = {
            ok: true
        };
        let rule = null;
        for (var i in rules) {
            rule = Object.assign({}, CONFIG, rules[i]);
            // 检查参数是否存在
            if (!Object.prototype.hasOwnProperty.call(origin, i)) {
                // 必选的参数不存在则校验不通过
                if (rule.require) {
                    result.ok = false;
                    result.errorName = i;
                    result.errorMsg = rule.requireMsg;
                    return result;
                } else {
                    continue;
                }
            } else {
                // 检查是否要类型转换
                if (rule.convert) {
                    // 如果不指定，默认转换为string类型
                    if (!doConvert[rule.type]) {
                        param[i] = doConvert['string'](origin[i]);
                    } else {
                        param[i] = doConvert[rule.type](origin[i]);
                        if (rule.type === 'number' && isNaN(param[i])) {
                            result.ok = false;
                            result.errorName = i;
                            result.errorMsg = '必须为数字';
                            return result;
                        }
                    }
                } else {
                    param[i] = origin[i];
                }
                valid(i, param[i], rule, result);
                if (result.ok) {
                    delete result.errorMsg;
                    continue;
                } else {
                    // 如果有指定默认值，使用此默认值
                    if (Object.prototype.hasOwnProperty.call(rule, 'defaultValue')) {
                        param[i] = rule.defaultValue;
                        result.ok = true;
                        delete result.errorMsg;
                        continue;
                    } else {
                        result.errorName = i;
                        result.errorMsg = result.errorMsg || rule.msg;
                        return result;
                    }

                }

            }

        }
        result.param = param;
        return result;

    };
    return validater;
}

function isRegExp(o) {
    return Object.prototype.toString.call(o) === '[object RegExp]';
}

function isFunction(o) {
    return Object.prototype.toString.call(o) === '[object Function]';
}

module.exports = Validater;