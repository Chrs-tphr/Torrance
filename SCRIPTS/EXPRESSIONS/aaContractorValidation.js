/*------------------------------------------------------------------------------------------------------/
| Usage   : Expression Builder Script that will validate a contractors Business License
|
| Client  : Torrance
| Action# : N/A
|
| Notes   : Building ALL
/------------------------------------------------------------------------------------------------------*/

var isConValid = true;
var conHasCCode;
var bLResults = "";
var msg = "";
var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("LP::professionalModel*businessLicense");
var variable1=expression.getValue("LP::FORM");
var returnMessage = "";

// get the EMSE biz object
var aa = expression.getScriptRoot();
// get includes scripts
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM"));
function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";
}

// License Number that the user entered or selected
var capLpLicNum = expression.getValue("LP::professionalModel*licensenbr").value;

// Get ref LP

var licObj = getRefLicenseProf(capLpLicNum);

if(licObj){
	// Get business license number
	var refLpBusLicNum = licObj.getBusinessLicense();
	if(!matches(refLpBusLicNum,null,"")){
		var licenseCapIdModel = aa.cap.getCapID(refLpBusLicNum).getOutput();
		var contractorLic = aa.expiration.getLicensesByCapID(licenseCapIdModel).getOutput();
		var bLExpStatus = contractorLic.getExpStatus();
		if(bLExpStatus == "Active" || bLExpStatus == "About to Expire"){
			msg += "City of Torrance Business License is "+bLExpStatus+". ";
			var bLExpDate = contractorLic.getExpDate();
			if(bLExpDate){
				var b1ExpDate = bLExpDate.getMonth() + "/" + bLExpDate.getDayOfMonth() + "/" + bLExpDate.getYear();
				var today = new Date();
				if(new Date(b1ExpDate) > today){
					msg += "Expiring: "+b1ExpDate+". ";
				}else{
					msg += "But Expired: "+b1ExpDate+". ";
					isConValid = false;
				}
			}else{
				isConValid = false;
			}
		}else{
			isConValid = false;
			msg += "City of Torrance Business License is "+bLExpStatus+". ";
		}
	}else{
		isConValid = false;
		msg += "Contractor does not have a business license number on file. ";
	}
}else{
	isConValid = false;
	msg += "Contractor does NOT have a City of Torrance Business License. ";
}

//update for Class Code Requirements
if(conHasCCode == false){
	msg += "Contractor does not have the required Classification. "
	isConValid = false;
}

//display message
variable0.message=msg;
expression.setReturn(variable0);

//block submit
if(!isConValid){
	variable1.blockSubmit=true;
	expression.setReturn(variable1);
}