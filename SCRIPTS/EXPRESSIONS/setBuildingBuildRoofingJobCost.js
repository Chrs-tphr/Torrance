function setBuildingBuildRoofingJobCost(){
	if(publicUser && matches(AInfo["Permit Scope"],"Residential Reroof") && !matches(AInfo["Roofing Squares"],null,"")){
		if(AInfo["Roofing Squares"] == "25 Squares and Under"){editEstimatedJobValue(3000);}
		if(AInfo["Roofing Squares"] == "26 to 50 Squares"){editEstimatedJobValue(6000);}
		if(AInfo["Roofing Squares"] == "51 to 75 Squares"){editEstimatedJobValue(9000);}
		if(AInfo["Roofing Squares"] == "76 to 100 Squares"){editEstimatedJobValue(12000);}
	}
}