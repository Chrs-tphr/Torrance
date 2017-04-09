function sendSRContactNotificationEmail(notificationTemplateName){
	//sendNotification params
	var fromEmail = "";
	var notificationTemplateName = "";
	
	//notification template params
	var params = aa.util.newHashtable();
	addParameter(params, "$SRID$", capId.getCustomID());
	addParameter(params, "$PERMITNAME$", capName);
	addParameter(params, "$$fileDate$$", fileDate);
	addParameter(params, "$$SRAlias$$", appTypeArray[1]);
	
	//gets contacts from record and sends email to all with email address
	conArr = new Array();
	conArr = getContactArray();
	for (c in conArr) {
		if (conArr[c]["email"] != "" && conArr[c]["email"] != null && conArr[c]["email"] != "undefined") {
			
			//contact specific notification template params 
			addParameter(params, "$$Applicant$$", conArr[c]["firstName"] + " " + conArr[c]["lastName"]);
			
			//sending notification to contact with email address
			sendNotification(fromEmail, conArr[c]["email"], "", notificationTemplateName, params, null);
		}
	}
}