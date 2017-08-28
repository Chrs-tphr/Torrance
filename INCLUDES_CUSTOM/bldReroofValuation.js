function bldReroofValuation(){
	var reroofValuation;
	if(AInfo["Roofing Squares"] == "25 Squares and Under"){
		reroofValuation = 2900;
	}else if(AInfo["Roofing Squares"] == "26 to 50 Squares"){
		reroofValuation = 6100;
	}else if(AInfo["Roofing Squares"] == "51 to 75 Squares"){
		reroofValuation = 7100;
	}else if(AInfo["Roofing Squares"] == "76 to 100 Squares"){
		reroofValuation = 8900;
	}else{
		reroofValuation = 8900;
	}
	return reroofValuation;
}