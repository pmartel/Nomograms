function processLineInfo(){
	// at this point 2 of the variables should have numeric values and the third should be blank
	var uVal = document.getElementById("uVal").value;
	var vVal = document.getElementById("vVal").value;
	var wVal = document.getElementById("wVal").value;
	var empties = 3, skipIt = false;
	var p=[], idx=0;
	
	if( uVal.length > 0) {
		uVal = Number(uVal);
		if(Number.isNaN(uVal)){skipIt = true;}
		p[idx++]={o:uObj,v:uVal};
		empties--;
	}
	if( vVal.length > 0) {
		vVal = Number(vVal);
		if(Number.isNaN(vVal)){skipIt = true;}
		p[idx++]={o:vObj,v:vVal};
		empties--;
	}
	if( wVal.length > 0) {
		wVal = Number(wVal);
		if(Number.isNaN(wVal)){skipIt = true;}
		p[idx++]={o:wObj,v:wVal};
		empties--;
	}
	if (skipIt || (empties != 1)){
		window.alert("Please enter two numbers and a blank in the 3 boxes");
		return;
	}
	// test putting "+" om points
	var p0 = new Vector(), p1 = new Vector();
	p0.x = p[0].o.x(p[0].v); p0.y = p[0].o.y(p[0].v);
	p1.x = p[1].o.x(p[1].v); p1.y = p[1].o.y(p[1].v);
	p0 = scaleToSVG(p0); p1 = scaleToSVG(p1);
	sText = sBase+'<line x1="'+p0.x+'" y1="'+p0.y+'" x2="'+p1.x+'" y2="'+p1.y+'" style="stroke:red;stroke-width:1" />';
	sText += "</svg>";
	document.getElementById('home').innerHTML = sText;
	//debugger;
}