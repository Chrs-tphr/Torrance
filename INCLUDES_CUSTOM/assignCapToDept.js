function assignCapToDept(deptName, capId){//update to compare existing department to new department and break if matches
	logDebug("Getting list of department names");
	var deptResult = aa.people.getDepartmentList(null);
	if (deptResult.getSuccess()){
		logDebug("Department names found, validating department");
		var depts = deptResult.getOutput(), deptFound = false, dept = null;
		for (var i=0;i<depts.length;i++){
			if (depts[i].getDeptName() == deptName){
				logDebug("Department " + deptName + " found.");
				deptFound = true;
				dept = depts[i];
				
				// get the cap detail
				var capDetailResult = aa.cap.getCapDetail(capId);
				if (capDetailResult.getSuccess()){
					var capDetailModel = capDetailResult.getOutput().getCapDetailModel();
					var cAsgnedDept = capDetailModel.getAsgnDept();//gets current assigned to department to compare below
					logDebug("Found current department assigned to: "+cAsgnedDept+". Comparing with department to be assigned");
					if (cAsgnedDept == dept.toString()){
						logDebug("New department and current department are the same, canceling update");
						break;//returns debug message and cancels update
					}
					capDetailModel.setAsgnStaff(null);
					capDetailModel.setAsgnDept(dept.toString());
					
					// write changes to cap detail
					var capDetailEditResult = aa.cap.editCapDetail(capDetailModel);
					if (capDetailEditResult.getSuccess()){
						logDebug("Successfully removed assigned staff and updated department to " + deptName);
					} else {
						logDebug("ERROR: Unable to write department to cap detail. " + capDetailEditResult.getErrorType() + " " + capDetailEditResult.getErrorMessage());
					}
				} else {
					logDebug("ERROR: Unable to get cap detail. " + capDetailResult.getErrorType() + " " + capDetailResult.getErrorMessage());
					aa.print("ERROR: Unable to get cap detail. " + capDetailResult.getErrorType() + " " + capDetailResult.getErrorMessage());
				}
				
				break;
			}
		}
		if (!deptFound) logDebug("Department " + deptName + " not found.");
	} else {
		logDebug("ERROR: Unable to get department list. " + deptResult.getErrorType() + " " + deptResult.getErrorMessage());
	}
}