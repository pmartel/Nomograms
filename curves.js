/* common code for svg curves for nomograms 
 * Phil Martel
 */
// import 'Vectors'; doesn't work currently
 
// Specify the svg to fill the a good part of the page (so far no obvious way to do "all")
// This runs when the scrip is loaded

// these worked before I was using <!DOCTYPE html>
//dWidth = document.body.clientWidth*0.85;	
//dHeight = screen.availHeight*0.7;

// it took a while to find these.
var dWidth = window.innerWidth * 0.85;
var dHeight = window.innerHeight * 0.8;

var scale0 = {}, scale100 = {}, scaleDelta ={};
var scale0 = new Vector( dWidth*0.1, dHeight*0.9);
var scale100 = new Vector( dWidth*0.9, dHeight*0.1);
var scaleDelta = scale100.sub(scale0);

var home = document.getElementById("home");

// prototype for Curve object
var Curve = function(){
	o = {};
	o.title = {x:0,y:0,t:""}; // curve title info
	o.domain=[]; //points we'll be plotting
	o.scale=[]; // labelled points
	o.majorTicPoints=[];
	o.majorTics=[];
	o.minorTics=[];
	o.x; // parametric function for x values of curve
	o.y; // parametric function for y values of curve
	return o;
}


function drawCurve(o){ //debugger;
	var t = '';
	var i;
	var p;
	
	// draw curve
	p = new Vector(o.x(o.domain[0]),o.y(o.domain[0]));
	p = scaleToSVG(p);
	// move to the beginning, start path
	t = '<path d="M '+p.x+' '+p.y;
	for(i=1;i<o.domain.length;i++){
	   p.x = o.x(o.domain[i]);
	   p.y = o.y(o.domain[i]);
	   p = scaleToSVG(p);
	   t += ' L '+p.x+' '+p.y;
	}
	//close path
	t += '" stroke="black" fill="none" />\n';
		
	// draw major tics and find scale positions
	// assume scale positions are a subset of major tics
	// the major tics and minor tics are also paths
	t += drawTics(o,"majorTics");
	// draw minor tics
    t += drawTics(o,"minorTics",i);
	// add scale text
	t += addScaleText(o);
	// add label
	p.x = o.title.x; p.y = o.title.y;
	p = scaleToSVG(p);
	t += '<text  font-size="20" font-family="Verdana" x="'+p.x+'" y="'+p.y+'">'+
		o.title.t+'</text>\n';
	return t; 
}

// draw the tics for the curve associated with object o specified by type
function drawTics(o, type ){ 
	var t1 ="";
	var arr;
	var ticLen, i, temp;
	var p0= new Vector(), p1= new Vector(), p2= new Vector();
	var doScale = false;
    var ticInfo = {};
	
	if (type == 'majorTics'){
		arr = o.majorTics;
		ticLen =1;
		doScale = true;
	}
	else if (type == 'minorTics'){
		arr = o.minorTics;
		ticLen =0.5;
	} else {
		//error.  should not happen 
	}
 	t1 = '<path d="';
	for( i=0;i<(arr.length-1);i++){
		// get a ticLen long vector at right angles to the curve at p0
		ticInfo = drawATic(o, arr, i, i+1, ticLen, type);
		t1 += ticInfo.t;
		if(doScale){
			o.majorTicPoints[i] = ticInfo;
		}
	}
	ticInfo = drawATic(o, arr, i, i-1, ticLen, type);
    t1 += ticInfo.t;
	if(doScale){
		o.majorTicPoints[i] = ticInfo;
	}
//close path
	t1 += '" stroke="black" fill="none" />\n'
	return t1;
}

function drawATic(o, arr, i1, i2, ticLen, type){
	var ticInfo ={};
	var p0= new Vector(), p1= new Vector(), p2= new Vector();
	var temp, j;
	
	p0.x = o.x(arr[i1]); p0.y = o.y(arr[i1]);
	p1.x = o.x(arr[i2]); p1.y = o.y(arr[i2]);
	p1 = p0.sub(p1);
	p1 = p1.scale(ticLen/p1.len()); // this is a vector ticLen long
	 // this makes an orthogonal vector to the original p1
	 temp = p1.x; p1.x = p1.y; p1.y=-temp;
	p2 = p1;
	p1 = p0.add(p1);
	p1 = scaleToSVG(p1);
	p2 = p0.sub(p2);
	p2 = scaleToSVG(p2);
	ticInfo.p1 =p1;
	ticInfo.p2 = p2;
	if(type == 'minor'){ // skip if it's also a major tic (possible double line)
		temp = arr[i1];
		j = o.majorTics.indexOf(temp);
		if( j > -1){
			ticInfo.t ='';
			return ticInfo;
		}
	}
	ticInfo.t = ' M '+p1.x +' '+p1.y+' L '+p2.x+' '+p2.y;

	return ticInfo;
}

function addScaleText(o){
	var i, j, v;
	var t3 = "";
	var p= new Vector();
	
	for(i=0;i<o.scale.length;i++){
		v = o.scale[i];
		j = o.majorTics.indexOf(v);
		if(j == -1){ // scale point does not match major tic.  Should not happen.
			continue;
		}
		if (j<o.majorTics.length-1){
			p = o.majorTicPoints[j].p2;
			p.x += 0.3;
		    p.y += 0.3;
		} else {
			p = o.majorTicPoints[j].p1;
			p.x += 0.3;
		    p.y += 0.3;			
		}
		t3 += '<text  font-size="12" font-family="Verdana" x="'+p.x+'" y="'+p.y+'">'+
		v+'</text>\n';
		
	}
	return t3;
}

// this takes a Vectort object and scales it from the "paper" 100 x 100 square to the svg space
function scaleToSVG(p){
	var pS = { x:scale0.x + scaleDelta.x *p.x/100, y:scale0.y + scaleDelta.y *p.y/100};
	return pS;
}
