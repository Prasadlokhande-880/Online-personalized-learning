# validater
一种参数校验方式

# usage

``` js
  var validater = require('validater')([options]);

  var origin = {a: 1};
  var rules = {
    a: {
      type: 'number',
      rule: function(v){return v > 0;},
      msg: 'must above 0',
    }
  };

  var validRet = validater(origin, rules);
  var param;
  if(validRet.ok){
    param = validRet.param;
  }else{
    console.log('参数不正确 - ' + validRet.errorName + ':' + validRet.errorMsg);
  }
```

## options
- `require`: 参数是否不能为空 (default: true)
- `convert`: 参数是否进行转换 (default: true)
- `msg`: 默认的提示语句 (default: '参数格式不正确')
- `requireMsg`: 默认的参数不能为空提示语句 (default: '参数不能为空')

## rules
以参数名称为key的对象,值为校验规则,如下
- `type`: 参赛的类型,convert为true时按此类型转换 'string'/'number'/'boolean' (default:'string')
- `msg`: 校验失败提示语句
- `rule`: 校验规则 可以为函数或正则表达式 函数返回true则校验通过 正则调用test方法返回true则校验通过
可以为数组用于支持多重校验 如 [{rule: ...,msg: '校验失败1'}, {rule: ...,msg: '校验失败2'}]
- `require`: 此参数是否不能为空 (default: options.require)
- `convert`: 此参数是否进行转换 (default: options.convert)
- `defaultValue`: 参数校验失败使用的默认值



