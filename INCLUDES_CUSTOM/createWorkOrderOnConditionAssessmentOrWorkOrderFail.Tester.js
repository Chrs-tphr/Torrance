aa.print("Enter createWorkOrderOnConditionAssessmentOrWorkOrderFail.Tester.js");
aa.print("");

//The documentation says the IN parameter is:
//IN: AssetConditionAssessmentModel 

//THIS IS WRONG!!!

//The actual IN parameter is:
//IN: AssetCAPK (AssetConditionAssessmentPK)

var SCRIPT_VERSION = 3.0;
var documentOnly = false;

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
    return emseScript.getScriptText() + "";
}

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM"));

//function logDebug(debugString) {
//    aa.print(debugString);
//}

//function logMessage(messageString) {
//    aa.print(messageString);
//}

//var assetCAPK = aa.env.getValue("AssetCAPK");
//var assetCAID = assetCAPK.getAssetCAID();
var assetCAID = 201; //201 200 145 144 143 142 (BI-ANNUAL FIRE HYDRANT INSPECT)
//var assetCAID = 199; //193 192 191 190 189 (TRI-ANNUAL WATER VALVE INSPECT)

createWorkOrderOnConditionAssessmentOrWorkOrderFail(assetCAID);

function createWorkOrderOnConditionAssessmentOrWorkOrderFail(assetCAID) {
    aa.print("Enter createWorkOrderOnConditionAssessmentOrWorkOrderFail()");
    
    //Create 1 WO for each CA with 1 or many failures 
    //Attach the asset from the CA to the WO
    //Populate the WO description with the attribute and values that qualify for a failure. 

    //What information needs to be copied from the CA to the WO?
    //Asset, Address, record detail.

    var objectMapper = new org.codehaus.jackson.map.ObjectMapper();

    var getAssetCAByPKScriptResult = aa.assetCA.getAssetCAByPK(assetCAID);
    if (getAssetCAByPKScriptResult.getSuccess()) {

        var assetCAScriptModel = getAssetCAByPKScriptResult.getOutput();

        var assetSeq = assetCAScriptModel.assetSeq;
        aa.print("assetSeq: " + assetSeq);

        var assetID = assetCAScriptModel.assetID;
        aa.print("assetID: " + assetID);

        var assetScriptModel = null;

        var getAssetDataScriptResult = aa.asset.getAssetData(assetSeq);
        //aa.print(getAssetDataScriptResult);
        if (getAssetDataScriptResult.getSuccess()) {
            assetScriptModel = getAssetDataScriptResult.getOutput();            
        }

        aa.print("assetScriptModel: " + assetScriptModel);

        var type = assetCAScriptModel.conditionAssessment;
        //aa.print("type: '" + type + "'");
        //aa.print("assetCAScriptModel:" + assetCAScriptModel);
        //printObject(assetCAScriptModel, "");
        //aa.print(objectMapper.writeValueAsString(assetCAScriptModel));
        //aa.print(assetCAScriptModel.getCAAttributes());

        // query CA attributes
        var attributes = {};
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var dataStore = initialContext.lookup("java:/AA");
        var connection = dataStore.getConnection();

        var sqlString = "SELECT ATTRIBUTE_NAME, ATTRIBUTE_VALUE FROM GASSET_CA_ATTR WHERE SERV_PROV_CODE = ? AND CONDITION_ASSESSMENT_ID = ?";
        //aa.print("sqlString: " + sqlString);

        var sqlStatement = connection.prepareStatement(sqlString);
        sqlStatement.setString(1, assetCAScriptModel.getServiceProviderCode());
        sqlStatement.setLong(2, assetCAID);

        var recordSet = sqlStatement.executeQuery();

        while (recordSet.next()) {
            attributes[recordSet.getString('ATTRIBUTE_NAME')] = recordSet.getString('ATTRIBUTE_VALUE');
        }

        sqlStatement.close();
        connection.close();

        //aa.print(objectMapper.writeValueAsString(attributes));

        //BI-ANNUAL FIRE HYDRANT INSPECT:

        //{
        //    "HydrantBuryCondition_Text": "Rusted",
        //    "HydrantCondition": "Failed",
        //    "HydrantFlowGPM": "100",
        //    "HydrantFollowUpNeeded": null,
        //    "HydrantHardOperation": null,
        //    "HydrantIsCorroded": null,
        //    "HydrantIsOperable": "N",
        //    "HydrantLocationDesc": null,
        //    "HydrantMaintenanceReqd": "Y",
        //    "HydrantNumberCaps": null,
        //    "HydrantPacking": null,
        //    "HydrantPaint": null,
        //    "HydrantPressure": null,
        //    "HydrantSpoolType": null,
        //    "HydrantStemCondition": "Bent",
        //    "HydrantValveControlled": null
        //}

        //TRI-ANNUAL WATER VALVE INSPECT:

        //{
        //    "ValveCapReplaced": "Y",
        //    "ValveChamberCondition": "OK",
        //    "ValveCondition": "Failed",
        //    "ValveCurbMarkings": "OK",
        //    "ValveDepthToNut": "12",
        //    "ValveFinalTorque": "100",
        //    "ValveGroundSurface": "Brick",
        //    "ValveIsCorroded": "N",
        //    "ValveIsOperable": "N",
        //    "ValveIsPavedOver": "Y",
        //    "ValveMaintenanceReqd": null,
        //    "ValveNutCondition": "Broken",
        //    "ValveSlipChamberCondition": "OK",
        //    "ValveTurnHard": "N",
        //    "ValveTurnsOff": "35",
        //    "ValveTurnsOn": "35"
        //}

        //aa.print("type='" + type + "'");        
        
        if (type == "BI-ANNUAL FIRE HYDRANT INSPECT") {

            //aa.print(type == 'BI-ANNUAL FIRE HYDRANT INSPECT');

            if (attributes.HydrantBuryCondition_Text == "Rusted" || attributes.HydrantBuryCondition_Text == "Too Low") {

                aa.print("attributes.HydrantBuryCondition_Text: " + attributes.HydrantBuryCondition_Text);

                var woCapId = createCap("AMS/Water Operations/Hydrants/Replace", "Fire Hydrant Replace: " + assetCAScriptModel.assetID);
                aa.print("CapId: " + woCapId);

                var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
                if (woAssetModelRequest.getSuccess()) {
                    var woAssetModel = woAssetModelRequest.getOutput();
                    woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
                    woAssetModel.setCapID(woCapId);
                    aa.asset.createWorkOrderAsset(woAssetModel);
                    aa.print("Asset attached to work order");
                }

            } else if (attributes.HydrantCondition == "Failed") {

                aa.print("attributes.HydrantCondition: " + attributes.HydrantCondition);

                var woCapId = createCap("AMS/Water Operations/Hydrants/Replace", "Fire Hydrant Replace: " + assetCAScriptModel.assetID);
                aa.print("CapId: " + woCapId);

                var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
                if (woAssetModelRequest.getSuccess()) {
                    var woAssetModel = woAssetModelRequest.getOutput();
                    woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
                    woAssetModel.setCapID(woCapId);
                    aa.asset.createWorkOrderAsset(woAssetModel);
                    aa.print("Asset attached to work order");
                }


            } else if (attributes.HydrantIsOperable == "N") {

                aa.print("attributes.HydrantIsOperable: " + attributes.HydrantIsOperable);

                var woCapId = createCap("AMS/Water Operations/Hydrants/Replace", "Fire Hydrant Replace: " + assetCAScriptModel.assetID);
                aa.print("CapId: " + woCapId);

                var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
                if (woAssetModelRequest.getSuccess()) {
                    var woAssetModel = woAssetModelRequest.getOutput();
                    woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
                    woAssetModel.setCapID(woCapId);
                    aa.asset.createWorkOrderAsset(woAssetModel);
                    aa.print("Asset attached to work order");
                }

            } else if (attributes.HydrantMaintenanceReqd == "Y") {

                aa.print("attributes.HydrantMaintenanceReqd: " + attributes.HydrantMaintenanceReqd);

                var woCapId = createCap("AMS/Water Operations/Hydrants/Repair", "Fire Hydrant Repair: " + assetCAScriptModel.assetID);
                aa.print("CapId: " + woCapId);

                var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
                if (woAssetModelRequest.getSuccess()) {
                    var woAssetModel = woAssetModelRequest.getOutput();
                    woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
                    woAssetModel.setCapID(woCapId);
                    aa.asset.createWorkOrderAsset(woAssetModel);
                    aa.print("Asset attached to work order");
                }

            } else if (attributes.HydrantStemCondition == "Bent" || attributes.HydrantStemCondition == "Defective") {

                aa.print("attributes.HydrantStemCondition: " + attributes.HydrantStemCondition);

                var woCapId = createCap("AMS/Water Operations/Hydrants/Replace", "Fire Hydrant Replace: " + assetCAScriptModel.assetID);
                aa.print("CapId: " + woCapId);

                var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
                if (woAssetModelRequest.getSuccess()) {
                    var woAssetModel = woAssetModelRequest.getOutput();
                    woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
                    woAssetModel.setCapID(woCapId);
                    aa.asset.createWorkOrderAsset(woAssetModel);
                    aa.print("Asset attached to work order");
                }
            }
        }

        if (type == "TRI-ANNUAL WATER VALVE INSPECT") {

            //aa.print(type == 'TRI-ANNUAL WATER VALVE INSPECT');

            if (attributes.ValveCondition == "Failed" || attributes.ValveCondition == "Poor") {

                aa.print("attributes.ValveCondition: " + attributes.ValveCondition);

                var woCapId = createCap("AMS/Water Operations/Water Valves/Replace", "Water Valve Replace: " + assetCAScriptModel.assetID);
                aa.print("CapId: " + woCapId);

                var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
                if (woAssetModelRequest.getSuccess()) {
                    var woAssetModel = woAssetModelRequest.getOutput();
                    woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
                    woAssetModel.setCapID(woCapId);
                    aa.asset.createWorkOrderAsset(woAssetModel);
                    aa.print("Asset attached to work order");
                }

            } else if (attributes.ValveIsOperable == "N") {

                aa.print("attributes.ValveIsOperable: " + attributes.ValveIsOperable);

                var woCapId = createCap("AMS/Water Operations/Water Valves/Replace", "Water Valve Replace: " + assetCAScriptModel.assetID);
                aa.print("CapId: " + woCapId);

                var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
                if (woAssetModelRequest.getSuccess()) {
                    var woAssetModel = woAssetModelRequest.getOutput();
                    woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
                    woAssetModel.setCapID(woCapId);
                    aa.asset.createWorkOrderAsset(woAssetModel);
                    aa.print("Asset attached to work order");
                }

            } else if (attributes.ValveNutCondition == "Broken") {
                aa.print("attributes.ValveNutCondition: " + attributes.ValveNutCondition);

                var woCapId = createCap("AMS/Water Operations/Water Valves/Repair", "Water Valve Repair: " + assetCAScriptModel.assetID);
                aa.print("CapId: " + woCapId);

                var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
                if (woAssetModelRequest.getSuccess()) {
                    var woAssetModel = woAssetModelRequest.getOutput();
                    woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
                    woAssetModel.setCapID(woCapId);
                    aa.asset.createWorkOrderAsset(woAssetModel);
                    aa.print("Asset attached to work order");
                }

            } else if (attributes.ValveIsPavedOver == "Y") {

                aa.print("attributes.ValveIsPavedOver: " + attributes.ValveIsPavedOver);

                var woCapId = createCap("AMS/Water Operations/Water Valves/Repair", "Water Valve Repair: " + assetCAScriptModel.assetID);
                aa.print("CapId: " + woCapId);

                var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
                if (woAssetModelRequest.getSuccess()) {
                    var woAssetModel = woAssetModelRequest.getOutput();
                    woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
                    woAssetModel.setCapID(woCapId);
                    aa.asset.createWorkOrderAsset(woAssetModel);
                    aa.print("Asset attached to work order");
                }
            }
        }
    }
    
    aa.print("Exit createWorkOrderOnConditionAssessmentOrWorkOrderFail()");
}

function printObject(item, tabs){

	try{
	
		if(typeof(item.getClass) != "undefined"){
			aa.print(item.getClass());
		}
	
		tabs = tabs + "\t";
		
		var properties = [];

		for (property in item){
			properties.push(property);	
		}
		
		properties.sort();
		
		for(var i = 0; i < properties.length; i++){
					    
			var name = properties[i];
			var property = item[name];
			aa.print(tabs + name + ": " + typeof(property));
			
			//if(name !== "class" && typeof(property) == "object"){
			//	printObject(property, tabs);
			//}		
		}

		aa.print("\n");	
		
	}catch(exception){
		aa.print(exception);		
	}
}

aa.print("");
aa.print("Exit createWorkOrderOnConditionAssessmentOrWorkOrderFail.Tester.js");