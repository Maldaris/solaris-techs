var item = { 'name' : 'Widget' , value : 10 };

var mut = new Mutator((typeof item), {
  value : function(target, e){
    target[e] += 1;
    return target;
  }
});

item = mut.pass(item);
console.log(mut.log);
