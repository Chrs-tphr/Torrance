/*------------------------------------------------------------------------------------------------------/
| Usage   : Expression Builder Script that will validate a contractors Business License and Class Code based on cap type
|
| Client  : Torrance
| Action# : N/A
|
| Notes   : Building ALL ACA
/------------------------------------------------------------------------------------------------------*/

var isConValid = false;
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

//message formatting
var msgStyle = "<style>.validMsg, .nValidMsg {	\
	margin: 10px 0px; \
	padding:12px;	\
}	\
.validMsg {	\
	color: #4F8A10;	\
	background-color: #DFF2BF;	\
}	\
.nValidMsg {	\
	color: #D8000C;	\
	background-color: #FFBABA;	\
}	\
.validMsg i, .nValidMsg i {	\
	margin:10px 22px;	\
	font-size:2em;	\
	vertical-align:middle;	\
}</style>";

// add message style
msg=msgStyle;

//check cap type
var thisCapType=expression.getValue("CAP::capType").value;
var thisCapTypeArray = thisCapType.split("/");
var runEB = false;
var reqCCode = [];

if(thisCapTypeArray[0] == "Building"){
	if(thisCapTypeArray[1] == "Build"){
		reqCCode = ["A","C39"];
		runEB = true;
	}
	if(thisCapTypeArray[1] == "Electrical"){
		reqCCode = ["A","C10"];
		runEB = true;
	}
	if(thisCapTypeArray[1] == "Mechanical"){
		reqCCode = ["A","C20"];
		runEB = true;
	}
	if(thisCapTypeArray[1] == "Plumbing"){
		reqCCode = ["A","C36"];
		runEB = true;
	}
}
var reqCCodeMsg = "";
for(n=0; n < reqCCode.length; n++){
	n == 0 ? reqCCodeMsg += reqCCode[n] : reqCCodeMsg += " or "+reqCCode[n];
}

if(runEB){
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
				var bLExpDate = contractorLic.getExpDate();
				if(bLExpDate){
					var b1ExpDate = bLExpDate.getMonth() + "/" + bLExpDate.getDayOfMonth() + "/" + bLExpDate.getYear();
					var today = new Date();
					if(new Date(b1ExpDate) > today){
						isConValid = true;

						//if ACA check Class Code
						conHasCCode = false;
						var licSeqNum = licObj.getLicSeqNbr();
						var attributeType = licObj.getLicenseType();

						var peopAttrResult = aa.people.getPeopleAttributeByPeople(licSeqNum, attributeType);

						if(peopAttrResult.getSuccess()){
							var peopAttrArray = peopAttrResult.getOutput();
							for(i in peopAttrArray){
								if(matches(peopAttrArray[i].getAttributeName(),"CLASS CODE 1","CLASS CODE 2","CLASS CODE 3","CLASS CODE 4")){
									var lpClassCode = peopAttrArray[i].getAttributeValue();//.replace("-","");
									if(exists(lpClassCode,reqCCode)){
										conHasCCode = true;
										break;
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	//contractor is valid
	if(isConValid && conHasCCode){
		msg += "<div class=\"validMsg\">The selected Contractor has a valid City of Torrance Business license and the required Classification Codes "+reqCCodeMsg+"</div>";
		variable0.message=msg;
		expression.setReturn(variable0);
	}

	//block submit
	if(isConValid && !conHasCCode){
		msg += "<div class=\"nValidMsg\"><span style=\"color:#4F8A10\">The selected Contractor has a valid City of Torrance Business license</span> but does not have the required Classification Codes "+reqCCodeMsg+"</div>";
		variable0.message=msg;
		expression.setReturn(variable0);
		
		variable1.blockSubmit=true;
		expression.setReturn(variable1);
	}
	if(!isConValid && conHasCCode){
		msg += "<div class=\"nValidMsg\"><span style=\"color:#4F8A10\">The selected Contractor has the required Classification Codes "+reqCCodeMsg+",</span> but does not have a valid City of Torrance Business license. </div>";
		variable0.message=msg;
		expression.setReturn(variable0);
		
		variable1.blockSubmit=true;
		expression.setReturn(variable1);
	}
	if(!isConValid && !conHasCCode){
		msg += "<div class=\"nValidMsg\">The selected Contractor does not have a valid City of Torrance Business license and the required Classification Codes "+reqCCodeMsg+"</div>";
		variable0.message=msg;
		expression.setReturn(variable0);
		
		variable1.blockSubmit=true;
		expression.setReturn(variable1);
	}
}

