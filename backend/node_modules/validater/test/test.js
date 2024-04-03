var validater = require('../index')();

var origin = {a: 0};
var rules, validRet;

console.log(1);
rules = {
    a: {
        type: 'number',
        rule: function(v){return v > 0;},
        msg: '必须大于0'
    }
};
validRet = validater(origin, rules);
if(validRet.ok){
    console.log('校验通过' + JSON.stringify(validRet.param));
}else{
    console.log('校验不通过 - ' + validRet.errorName + ':' + validRet.errorMsg);
}

console.log(2);
rules = {
    b: {
        type: 'number',
        rule: function(v){return v > 0;},
        msg: 'b参数必须大于0',
    }
};
validRet = validater(origin, rules);
if(validRet.ok){
    console.log('校验通过' + JSON.stringify(validRet.param));
}else{
    console.log('校验不通过 - ' + validRet.errorName + ':' + validRet.errorMsg);
}

console.log(3);

rules = {
    a: {
        type: 'number',
        rule: /^[1]$/,
        msg: '只能为1'
    }
};
validRet = validater(origin, rules);
if(validRet.ok){
    console.log('校验通过' + JSON.stringify(validRet.param));
}else{
    console.log('校验不通过 - ' + validRet.errorName + ':' + validRet.errorMsg);
}

console.log(4);

rules = {
    a: {
        type: 'number',
        rule: /^[0]$/,
        msg: '只能为0'
    }
};
validRet = validater(origin, rules);
if(validRet.ok){
    console.log('校验通过' + JSON.stringify(validRet.param));
}else{
    console.log('校验不通过 - ' + validRet.errorName + ':' + validRet.errorMsg);
}

console.log(5);

rules = {
    a: {
        type: 'number',
        rule: {
            rule: /^[0]$/,
            msg: '只能为0'
        },
        msg: '只能为0',
    }
};
validRet = validater(origin, rules);
if(validRet.ok){
    console.log('校验通过' + JSON.stringify(validRet.param));
}else{
    console.log('校验不通过 - ' + validRet.errorName + ':' + validRet.errorMsg);
}

console.log(6);

rules = {
    a: {
        type: 'number',
        rule: {
            rule: (v) => v == 0,
            msg: '只能为0'
        },
        msg: '只能为0',
    }
};
validRet = validater(origin, rules);
if(validRet.ok){
    console.log('校验通过' + JSON.stringify(validRet.param));
}else{
    console.log('校验不通过 - ' + validRet.errorName + ':' + validRet.errorMsg);
}

console.log(7);

rules = {
    a: {
        type: 'number',
        rule: [
            {
                rule: (v) => v > 0,
                msg: '必须大于0'
            },
            {
                rule: (v) => v < 3,
                msg: '必须小于3'
            },
            {
                rule: (v) => v == 2,
                msg: '只能为2'
            },
            {
                rule: (v) => v == 1,
                msg: '只能为1'
            }
        ],
        msg: '只能为0',
    }
};
validRet = validater(origin, rules);
if(validRet.ok){
    console.log('校验通过' + JSON.stringify(validRet.param));
}else{
    console.log('校验不通过 - ' + validRet.errorName + ':' + validRet.errorMsg);
}