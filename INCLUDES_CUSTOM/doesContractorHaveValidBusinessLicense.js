function doesContractorHaveValidBusinessLicense(capId){
		var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
		if(capLicenseResult.getSuccess()){
			var capLicenseArr = capLicenseResult.getOutput();
			if(capLicenseArr !== null){
				if(capLicenseArr.length > 0){
					licProfScriptModel = capLicenseArr[0];
					licModel = licProfScriptModel.getLicenseProfessionalModel();
					
					//lp info
					var lpBusinessLicense = licProfScriptModel.getBusinessLicense();
										
					if(lpBusinessLicense){
						//get business license record
						var licenseCapIdModel = aa.cap.getCapID(lpBusinessLicense).getOutput();
						var contractorLic = aa.expiration.getLicensesByCapID(licenseCapIdModel).getOutput();
						var bLExpStatus = contractorLic.getExpStatus();
						logDebug("Found Business License: "+lpBusinessLicense+", with expiration status of: "+bLExpStatus);
						if(matches(bLExpStatus,"Active","About to Expire")){
							return true;
						}else{
							return false;
						}
					}else{
						logDebug("No Business License attached to contractor");
						return false;
					}
				}
			}else{
				logDebug("No LP's on record");
				return false;
			}
		}
		return false;
	}