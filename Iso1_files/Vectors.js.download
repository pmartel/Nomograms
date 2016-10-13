// define Vector and it's behavior
// We could have 2D, 3D or nD vectors.  For now work on 2D

var Vector = function(x, y){
	this.x = x;
	this.y = y;
}

Vector.prototype.toString = function(){
   return '('+this.x+', '+this.y+')';
}

// it doesn't look like there's a way to overlay operators like "+"
/*Vector.prototype."+" = function(a,b){
	return Vector(a.x+b.x,a.y+b.y);
}
*/
Vector.prototype.add = function(b){
   return new Vector(this.x + b.x, this.y+b.y);
}
Vector.prototype.sub = function(b){
   return new Vector(this.x - b.x, this.y - b.y);
}

Vector.prototype.scale = function(c){
   return new Vector(this.x * c, this.y *c);
}

Vector.prototype.dot = function(b){
   return (this.x * b.x + this.y * b.y);
}

Vector.prototype.len = function(){
   return Math.sqrt(this.dot(this));
}
