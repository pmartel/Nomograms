// define Vector and it's behavior
// We could have 2D, 3D or nD vectors.  For now work on 2D

/*
Copyright (c) 2016 Philip Martel
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
*/
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
