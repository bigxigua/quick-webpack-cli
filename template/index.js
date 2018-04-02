//##1
//使用 memoize缓存函数
//因为纯函数相同输入必有相同输出。
const memoize = function (f) {
	let caches = {};
	return function () {
		var arg = arguments[0];
		caches[arg] = caches[arg] || f.apply(f, arguments)
		return caches[arg];
	}
}

const handler = memoize(function (a) {return a*a});
// console.log(handler(4))	

//##2
//使用compose组合函数
//调用方式类似 compose(fn1, fn2, ...)('第一个参数函数的参数');
//前一个函数的返回值作为后一个函数的参数。最后返回最后一个参数的返回值。目的是制造一个单一的数据流。更直观的体现数据的变化
//实现同步compose方法
const compose = function () {
	var argumentsArr = Array.prototype.slice.call(arguments);
	return function (args) {
		if(argumentsArr.length == 0) return args;
		if(argumentsArr.length == 1) return argumentsArr[0](args);
		var prev = argumentsArr[0], next = argumentsArr[1];
		argumentsArr.splice(0,2);
		return arguments.callee(next(prev(args)))
	}	
}
//兼容异步数据获取的compose方法
const asyncCompose = function () {
	//参数必须是promise形式的
	var argumentsArr = Array.prototype.slice.call(arguments);
	return function (args) {
		console.log('fuck')
		if(argumentsArr.length == 0) return args;
		if(argumentsArr.length == 1) return argumentsArr[0](args);
		var prev = argumentsArr[0], next = argumentsArr[1], curCalleeHandle = arguments.callee.bind();
		argumentsArr.splice(0,2);
		return prev(args).then(function (d) {
			//数据的验证缺失
			console.log(d, '----------')
			curCalleeHandle(next(d));
		}).catch(function (err) {
			throw Error('some thing error', err)
		})
	}
}
var toUpperCase = function (str) {
	return str.toUpperCase();
}
var addSomeString = function (str) {
	return str + 'fuck'
}
var addLine = function (str) {
	return str + '-------'
}
var changeToArray = function (str) {
	return str.split('')
}

var promise1 = function (arg) {
	return new Promise(function(resolve, reject) {
  	setTimeout(resolve, 100, arg);
	})
};
var promise2 = function (arg) {
	return new Promise(function(resolve, reject) {
  	setTimeout(resolve, 100, arg);
	})
};
// var composeHandle = compose(toUpperCase, addLine, addSomeString, changeToArray);
// console.log(composeHandle('hello'))

var composeHandle = asyncCompose(promise1, promise2);
composeHandle('hello').then(function (d) {
	console.log(d)
})