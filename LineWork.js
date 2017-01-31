function processLineInfo(){
	// at this point 2 of the variables should have numeric values and the third should be blank
	var uVal = document.getElementById("uVal").value;
	var vVal = document.getElementById("vVal").value;
	var wVal = document.getElementById("wVal").value;
	var empties = 3, skipIt = false;
	var p=[], idx=0;
	
	if( uVal.length > 0) {
		uVal = Number(uVal);
		//if(Number.isNaN(uVal)){skipIt = true;}
		if(uVal !== uVal){skipIt = true;} // this acts like Number.isNan() but works with Internet Explorer
		p[idx++]={o:uObj,v:uVal};
		empties--;
	}
	if( vVal.length > 0) {
		vVal = Number(vVal);
		//if(Number.isNaN(vVal)){skipIt = true;}
		if(vVal !== vVal){skipIt = true;}
		p[idx++]={o:vObj,v:vVal};
		empties--;
	}
	if( wVal.length > 0) {
		wVal = Number(wVal);
		//if(Number.isNaN(wVal)){skipIt = true;}
		if(wVal !== wVal){skipIt = true;}
		p[idx++]={o:wObj,v:wVal};
		empties--;
	}
	if (skipIt || (empties != 1)){
		window.alert("Please enter two numbers and a blank in the 3 boxes");
		return;
	}
	var p0 = new Vector(), p1 = new Vector();
	p0.x = p[0].o.x(p[0].v); p0.y = p[0].o.y(p[0].v);
	p1.x = p[1].o.x(p[1].v); p1.y = p[1].o.y(p[1].v);
	p0 = scaleToSVG(p0); p1 = scaleToSVG(p1);
	
	//drawToBounds(); make this in-line to avoid extra globals
	// there's probably a better way
	var x0 = p0.x, y0 =p0.y;
	var x1 = p1.x, y1 = p1.y;
	var dx = x1-x0, dy = y1-y0;
	var x, y;
	
	if(dx == 0){
		// vertical line
		p0.y = boundingBox.t;
		p1.y = boundingBox.b;
	} else if (dy == 0){
		// horizontal line
		p0.x = boundingBox.l;
		p1.x = boundingBox.r;
	} else {  // other line
		var x0 = p0.x, y0 = p0.y; 
		var x1 = p1.x, y1= p1.y; //so we can change p0, p1
		var x, y;
		
		// fix p0
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
		
		// fix p1
		y = (boundingBox.r - x1)*dy/dx + y1;
		if(y < boundingBox.t){
			p1.y = boundingBox.t;
			p1.x = dx/dy*(boundingBox.t-y1) +x1;
		}
		else if(y>boundingBox.b){
			p1.y = boundingBox.b;
			p1.x = dx/dy*(boundingBox.b-y1) +x1;
		} else{
			p1.x = boundingBox.r;
			p1.y = dy/dx*(boundingBox.r-x1)+y1;
		}
	}
	
	sText = sBase+'<line x1="'+p0.x+'" y1="'+p0.y+'" x2="'+p1.x+'" y2="'+p1.y+'" style="stroke:red;stroke-width:1" />';
	sText += "</svg>";
	document.getElementById('home').innerHTML = sText;
	//debugger;
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