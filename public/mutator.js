function Mutator(target, application){
	this.log = [];
	this.target_type = target;
	this.application = application;
}

var equiv_target = function(a,b){
	return a === typeof b;
}

Mutator.prototype.pass = function(target){
	var _scope = this;
	if(!equiv_target(this.target_type, target))
		return target;
	Object.keys(this.application).forEach(function(e){
		var l = {};
		l['target'] = e;
		l['pre'] = target[e];
		console.log(l);
		target = _scope.application[e](target, e);
		l['post'] = target[e];
		_scope.log.push(l);
	});
	return target;
};
