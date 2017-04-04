function processLineInfo(){
	// at this point 2 of the variables should have numeric values and the third should be blank
	var uVal = document.getElementById("uVal").value;
	var vVal = document.getElementById("vVal").value;
	var wVal = document.getElementById("wVal").value;
	var empties = 3, skipIt = false;
	var pObj=[], idx=0;
	
	if( uVal.length > 0) {
		uVal = Number(uVal);
		//if(Number.isNaN(uVal)){skipIt = true;}
		if(uVal !== uVal){skipIt = true;} // this acts like Number.isNan() but works with Internet Explorer
		pObj[idx++]={o:uObj,v:uVal,target:1}; // use a bitmap to select the variable being solved for
		empties--;
	}
	if( vVal.length > 0) {
		vVal = Number(vVal);
		//if(Number.isNaN(vVal)){skipIt = true;}
		if(vVal !== vVal){skipIt = true;}
		pObj[idx++]={o:vObj,v:vVal,target:2};
		empties--;
	}
	if( wVal.length > 0) {
		wVal = Number(wVal);
		//if(Number.isNaN(wVal)){skipIt = true;}
		if(wVal !== wVal){skipIt = true;}
		pObj[idx++]={o:wObj,v:wVal,target:4};
		empties--;
	}
	if (skipIt || (empties != 1)){
		window.alert("Please enter two numbers and a blank in the 3 boxes");
		return;
	}
	
	// find the selected points on the two scales 
	var p0 = new Vector(), p1 = new Vector();
	p0.x = pObj[0].o.x(pObj[0].v); p0.y = pObj[0].o.y(pObj[0].v);
	p1.x = pObj[1].o.x(pObj[1].v); p1.y = pObj[1].o.y(pObj[1].v);
	//save original p0, p1 for solution
	var p0Scaled = scaleToSVG(p0), p1Scaled = scaleToSVG(p1);
	
	//drawToBounds(); make this in-line to avoid extra globals
	// there's probably a better way
	// note "boundingBox" is defined in the script on the main HTML page
	var x0 = p0Scaled.x, y0 =p0Scaled.y;
	var x1 = p1Scaled.x, y1 = p1Scaled.y;
	var dx = x1-x0, dy = y1-y0;
	var x, y;
	
	if(dx == 0){
		// vertical line
		p0Scaled.y = boundingBox.t;
		pScaled1.y = boundingBox.b;
	} else if (dy == 0){
		// horizontal line
		p0Scaled.x = boundingBox.l;
		p1Scaled.x = boundingBox.r;
	} else {  // other line
		var x0 = p0Scaled.x, y0 = p0Scaled.y; 
		var x1 = p1Scaled.x, y1= p1Scaled.y; //so we can change p0, p1
		var x, y;
		
		// fix p0
		y = (boundingBox.l - x0)*dy/dx + y0;
		if(y < boundingBox.t){
			p0Scaled.y = boundingBox.t;
			p0Scaled.x = dx/dy*(boundingBox.t-y0) +x0;
		}
		else if(y>boundingBox.b){
			p0Scaled.y = boundingBox.b;
			p0Scaled.x = dx/dy*(boundingBox.b-y0) +x0;
		} else{
			p0Scaled.x = boundingBox.l;
			p0Scaled.y = dy/dx*(boundingBox.l-x0)+y0;
		}		
		
		// fix p1
		y = (boundingBox.r - x1)*dy/dx + y1;
		if(y < boundingBox.t){
			p1Scaled.y = boundingBox.t;
			p1Scaled.x = dx/dy*(boundingBox.t-y1) +x1;
		}
		else if(y>boundingBox.b){
			p1Scaled.y = boundingBox.b;
			p1Scaled.x = dx/dy*(boundingBox.b-y1) +x1;
		} else{
			p1Scaled.x = boundingBox.r;
			p1Scaled.y = dy/dx*(boundingBox.r-x1)+y1;
		}
	}
	// draw isopleth
	sText = sBase+'<line x1="'+p0Scaled.x+'" y1="'+p0Scaled.y+'" x2="'+p1Scaled.x+'" y2="'+p1Scaled.y+'" style="stroke:red;stroke-width:1" />';
	// close up the SVG element and display
	sText += "</svg>";
	document.getElementById('home').innerHTML = sText;
	
	var solutionString = "";
	if(document.getElementById("solveIt").checked){
		//need to select the variable to be solved and pass its object
		var xObj;
		switch ( 7 - pObj[0].target - pObj[1].target){
			case 1:
				xObj = uObj;
				break;
			case 2:
				xObj = vObj;
				break;
			case 4:
				xObj = wObj;
				break;
			default:
				xObj = undefined;
		}
		var solutionString = getSolution(p0,p1,xObj);
		//document.getElementById("solution").innerHTML="solution!";		
	}
	else{
		SolutionString = "";
	}
	document.getElementById("solution").innerHTML= solutionString;
	
	//debugger;
}

/* Find the intersection of the curve specified in xObj and the line specified by p0 and p1
 * The approach is to treat (p1 - p0) and (xObj - p0) as vectors and take the cross product.
 * Ignore the vector nature of the cross product.  It's numeric value will be 0 at the intersection.
 * This approach isn't optimized, and right now, I'm not trying to handle multiple solutions.
 */
function getSolution(p0, p1, xObj ){
	var vLine = p1.sub(p0), vCurve;
	var pCurve = new Vector();
	var n, val;
	var	crossVal, oldCross; //cross products
	var crossAbs, minAbs={n:undefined, z:undefined, f:undefined}; // absolute values
	
	if (xObj == undefined){
		return "error specifying unknown";
	}
	// determine rough crossing
	val = xObj.majorTics[0];
	oldCross = getCross( val, xObj, p0, vLine);
	if (oldCross == 0){
		return xObj.title.t + " = " + val;
	}
	minAbs.n = 0; minAbs.z = val; minAbs.f = Math.abs(oldCross);
	for( n=1; n < xObj.majorTics.length; n++){
		val = xObj.majorTics[n];
		crossVal =  getCross( val, xObj, p0, vLine);
		if (crossVal == 0){
			return xObj.title.t + " = " + val;
		}
		crossAbs = Math.abs(crossVal);
		if (crossAbs < minAbs.f){
			minAbs.n=n; minAbs.z = val; minAbs.f = crossAbs;
		}
		if (crossVal * oldCross <0){ //we crossed 
		
		}
		
	}
	debugger;
}

function getCross( val, xObj, p0, vLine){
	var vCurve = new Vector(xObj.x(val),xObj.y(val))
	vCurve = vCurve.sub(p0);
	return vCurve.cross(vLine);
	
}
/*
// extend the line through (p0, p1) to the bounding box
function drawToBounds(p0,p1){
	var x0 = p0.x, y0 =p0.y;
	var x1 = p1.x, y1 = p1.y;
	var dx = x1-x0, dy = y1-y0;
	var x, y;
	
	if(dx == 0){
		// vertical line
		p0.y = boundingBox.t;
		p1.y = boundingBox.b;
		return;
	}
	if (dy == 0){
		// horizontal line
		p0.x = boundingBox.l;
		p1.x = boundingBox.r;
		return;
	}
		var x0 = p0.x, y0 = p0.y; 
		var x1 = p1.x, y1= p1.y; //so we can change p0, p1
		var x, y;
		
		y = (boundingBox.l - x0)*dy/dx + y0;
		if(y < boundingBox.t){
			p0.y = boundingBox.t;
			p0.x = dx/dy*(boundingBox.t-y0) +x0;
		}
		else if(y>boundingBox.b){
			p0.y = boundingBox.b;
			p0.x = dx/dy*(boundingBox.b-y0) +x0;
		} else{
			p0.x = boundingBox.l;
			p0.y = dy/dx*(boundingBox.l-x0)+y0;
		}
		
}
*/