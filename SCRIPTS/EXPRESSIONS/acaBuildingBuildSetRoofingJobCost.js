var toPrecision = function (value){
	var multiplier = 10000;
	return Math.round(value * multiplier) / multiplier;
};

function addDate(iDate, nDays){
	if(isNaN(nDays)){
		throw ("Day is a invalid number!");
	}
	return expression.addDate(iDate, parseInt(nDays));
}

function diffDate(iDate1, iDate2){
	return expression.diffDate(iDate1, iDate2);
}

function parseDate(dateString){
	return expression.parseDate(dateString);
}

function formatDate(dateString, pattern){
	if(dateString == null || dateString == ''){
		return '';
	}
	return expression.formatDate(dateString, pattern);
}

function getAdditionalInfo(capId){
	var bvaluatnScriptModel = null;
	var s_result = aa.cap.getBValuatn4AddtInfo(capId);
	if(s_result.getSuccess()){
		bvaluatnScriptModel = s_result.getOutput();
		if(bvaluatnScriptModel == null){
			bvaluatnScriptModel = null;
		}
	}else{
		bvaluatnScriptModel = null;
	}
	return bvaluatnScriptModel;
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();

var aa = expression.getScriptRoot();

var jobValue = expression.getValue("CAP::jobValue").value;
var numRoofingSquares = expression.getValue("ASI::BUILDING INFORMATION::Roofing Squares").value;

var applicantJobValue = 0;
var capIdObj = aa.cap.getCapID("" + expression.getValue("CAP::capModel*altID").value);
if(capIdObj.getSuccess()){
	var capId = capIdObj.getOutput();
	var additionalInfo = getAdditionalInfo(capId);
	if(numRoofingSquares == "25 Squares and Under"){additionalInfo.setEstimatedValue(3000);}
	if(numRoofingSquares == "26 to 50 Squares"){additionalInfo.setEstimatedValue(6000);}
	if(numRoofingSquares == "51 to 75 Squares"){additionalInfo.setEstimatedValue(9000);}
	if(numRoofingSquares == "76 to 100 Squares"){additionalInfo.setEstimatedValue(12000);}
}





if(variable0.value == "25 Squares and Under"){additionalInfo.setEstimatedValue(3000);}
if(numRoofingSquares == "26 to 50 Squares"){additionalInfo.setEstimatedValue(6000);}
if(numRoofingSquares == "51 to 75 Squares"){additionalInfo.setEstimatedValue(9000);}
if(numRoofingSquares == "76 to 100 Squares"){additionalInfo.setEstimatedValue(12000);}




















function editEstimatedJobValue(jobValue){// option CapId
	var itemCap = capId
		if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args
		var bValScriptObjResult = aa.cap.getBValuatn4AddtInfo(itemCap);
	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!bValScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + bValScriptObjResult.getErrorMessage());
		return false;
	}
	var bValScriptObj = bValScriptObjResult.getOutput();
	if (!bValScriptObj) {
		logDebug("**ERROR: No valuation detail script object");
		return false;
	}
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
		return false;
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return false;
	}
	bValScriptObj.setEstimatedValue(parseFloat(jobValue));
	var vedtResults = aa.cap.editAddtInfo(cdScriptObj, bValScriptObj);
	if (!vedtResults.getSuccess()) {
		logDebug("**Error updating the job value in additional information" + edtResults.getErrorMessage());
	}
	if (vedtResults !== null && vedtResults.getSuccess() === true) {
		logDebug("Updated the estimated job value to " + jobValue);
	}
}