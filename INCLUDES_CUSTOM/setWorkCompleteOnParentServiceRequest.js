function setWorkCompleteOnParentServiceRequest() {
	try {
	var parentCapId = getParent();
	if (!parentCapId || !appMatch("ServiceRequest/*/*/*", parentCapId)) {
		logDebug("WO does not have a parent service request.");
	} else {
		if (capStatus == "Closed" || wfTask == "Closed") {
			logDebug("Updating parent record " + parentCapId.getCustomID() + " workflow task.");
			// set workflow status on parent record
			var comment = "WO " + capId.getCustomID() + " has been closed.";
			updateTask("Corrective Work", "Work Complete", comment, null, "SR_COMPLAINT_WO", parentCapId);
			
			// 8/12/2016 - Added code to close task. BD
			// deactivate 'Corrective Work' task
			var deactivateTaskResult = aa.workflow.adjustTask(parentCapId, "Corrective Work", "N", "Y", null, null);
			if (deactivateTaskResult.getSuccess())
				logDebug("'Corrective Work' task completed.");
			else
				logDebug("Error: Unable to deactivate 'Corrective Work' task.");
			
			// activate 'Final Notification' task
			var workflowTaskResult = aa.workflow.adjustTask(parentCapId, "Final Notification", "Y", "N", null, null);
			if (workflowTaskResult.getSuccess())
				logDebug("'Final Notification' task activated.");
			else
				logDebug("Error: Unable to activate 'Final Notification' task.");
		}
	}
	} catch (error) {
		logDebug("Javascript error: " + error.message);
	}
}