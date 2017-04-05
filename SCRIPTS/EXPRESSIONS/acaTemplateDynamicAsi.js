//ACA BASE ASI DYNAMIC SETTINGS SCRIPT

var toPrecision=function(value){
  var multiplier=10000;
  return Math.round(value*multiplier)/multiplier;
}
function addDate(iDate, nDays){ 
	if(isNaN(nDays)){
		throw("Day is a invalid number!");
	}
	return expression.addDate(iDate,parseInt(nDays));
}

function diffDate(iDate1,iDate2){
	return expression.diffDate(iDate1,iDate2);
}

function parseDate(dateString){
	return expression.parseDate(dateString);
}

function formatDate(dateString,pattern){ 
	if(dateString==null||dateString==''){
		return '';
	}
	return expression.formatDate(dateString,pattern);
}

var servProvCode=expression.getValue("$$servProvCode$$").value;

//INSERT ALL getField------------------------------------------------------------------------------

//END getField-------------------------------------------------------------------------------------

var totalRowCount = expression.getTotalRowCount();

//INSERT resetField ONLINE PERMIT SELECTION{resetField}--------------------------------------------

//END resetField ONLINE PERMIT SELECTION-----------------------------------------------------------



//INSERT 1 PERMIT SCOPE CODE{adjustDisplay adjustRequired adjustReadOnly adjustValue updateAsi}----

//END 1 PERMIT SCOPE-------------------------------------------------------------------------------



//INSERT 2 PERMIT SCOPE CODE{adjustDisplay adjustRequired adjustReadOnly adjustValue updateAsi}----

//END 2 PERMIT SCOPE-------------------------------------------------------------------------------



//INSERT 3 PERMIT SCOPE CODE{adjustDisplay adjustRequired adjustReadOnly adjustValue updateAsi}----

//END 3 PERMIT SCOPE-------------------------------------------------------------------------------




//INSERT 4 PERMIT SCOPE CODE{adjustDisplay adjustRequired adjustReadOnly adjustValue updateAsi}----

//END 4 PERMIT SCOPE-------------------------------------------------------------------------------
