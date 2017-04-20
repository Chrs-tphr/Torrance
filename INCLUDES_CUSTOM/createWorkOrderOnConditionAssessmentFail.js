function createWorkOrderOnConditionAssessmentFail(assetCAID) {
    aa.print("Enter createWorkOrderOnConditionAssessmentFail()");
    
    //Create 1 WO for each CA with 1 or many failures 
    //Attach the asset from the CA to the WO
    //Populate the WO description with the attribute and values that qualify for a failure. 

    //What information needs to be copied from the CA to the WO?
    //Asset, Address, record detail.

    var objectMapper = new org.codehaus.jackson.map.ObjectMapper();

    var getAssetCAByPKScriptResult = aa.assetCA.getAssetCAByPK(assetCAID);
    if (getAssetCAByPKScriptResult.getSuccess()) {

        var assetCAScriptModel = getAssetCAByPKScriptResult.getOutput();
        //aa.print("type: '" + type + "'");
        //aa.print("assetCAScriptModel:" + assetCAScriptModel);
        //printObject(assetCAScriptModel, "");
        //aa.print(objectMapper.writeValueAsString(assetCAScriptModel));
        
        var assetSeq = assetCAScriptModel.assetSeq;
        aa.print("assetSeq: " + assetSeq);

        var assetID = assetCAScriptModel.assetID;
        aa.print("assetID: " + assetID);

        var assetScriptModel = null;
        var refAddressModel = null

        var getAssetDataScriptResult = aa.asset.getAssetData(assetSeq);
        if (getAssetDataScriptResult.getSuccess()) {

            assetScriptModel = getAssetDataScriptResult.getOutput();
            //aa.print("assetScriptModel: " + assetScriptModel);
            //aa.print(objectMapper.writeValueAsString(assetScriptModel));

            var assetMasterModel = assetScriptModel.assetMasterModel;
            if (assetMasterModel != null) {
                refAddressModel = assetMasterModel.refAddressModel;
                //aa.print("refAddressModel: " + refAddressModel);
                //aa.print(objectMapper.writeValueAsString(refAddressModel));
            }

        } else {
            aa.print("Error: " + getAssetDataScriptResult.getErrorType() + " " + getAssetDataScriptResult.getErrorMessage());
        }        

        var type = assetCAScriptModel.conditionAssessment;        

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

            if (attributes.HydrantBuryCondition_Text == "Rusted" || attributes.HydrantBuryCondition_Text == "Too Low") {
                var description = "Hydrant Bury Condition: " + attributes.HydrantBuryCondition_Text;
                var woCapId = createCap("AMS/Water Operations/Hydrants/Replace", "Fire Hydrant Replace: " + assetCAScriptModel.assetID);
                setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, woCapId, description);
            } else if (attributes.HydrantCondition == "Failed") {
                var description = "Hydrant Condition: " + attributes.HydrantCondition;
                var woCapId = createCap("AMS/Water Operations/Hydrants/Replace", "Fire Hydrant Replace: " + assetCAScriptModel.assetID);
                setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, woCapId, description);
            } else if (attributes.HydrantIsOperable == "N") {
                var description = "Hydrant Is Operable: " + attributes.HydrantIsOperable;
                var woCapId = createCap("AMS/Water Operations/Hydrants/Replace", "Fire Hydrant Replace: " + assetCAScriptModel.assetID);
                setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, woCapId, description);
            } else if (attributes.HydrantMaintenanceReqd == "Y") {
                var description = "Hydrant Maintenance Required: " + attributes.HydrantMaintenanceReqd;
                var woCapId = createCap("AMS/Water Operations/Hydrants/Repair", "Fire Hydrant Repair: " + assetCAScriptModel.assetID);
                setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, woCapId, description);
            } else if (attributes.HydrantStemCondition == "Bent" || attributes.HydrantStemCondition == "Defective") {
                var description = "Hydrant Stem Condition: " + attributes.HydrantStemCondition;
                var woCapId = createCap("AMS/Water Operations/Hydrants/Replace", "Fire Hydrant Replace: " + assetCAScriptModel.assetID);
                setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, woCapId, description);
            }
        }

        if (type == "TRI-ANNUAL WATER VALVE INSPECT") {

            //aa.print(type == 'TRI-ANNUAL WATER VALVE INSPECT');

            if (attributes.ValveCondition == "Failed" || attributes.ValveCondition == "Poor") {
                var description = "Valve Condition: " + attributes.ValveCondition;
                var woCapId = createCap("AMS/Water Operations/Water Valves/Replace", "Water Valve Replace: " + assetCAScriptModel.assetID);
                setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, woCapId, description);
            } else if (attributes.ValveIsOperable == "N") {
                var description = "Valve Is Operable: " + attributes.ValveIsOperable;
                var woCapId = createCap("AMS/Water Operations/Water Valves/Replace", "Water Valve Replace: " + assetCAScriptModel.assetID);
                setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, woCapId, description);
            } else if (attributes.ValveNutCondition == "Broken") {                
                var description = "Valve Nut Condition: " + attributes.ValveNutCondition;
                var woCapId = createCap("AMS/Water Operations/Water Valves/Repair", "Water Valve Repair: " + assetCAScriptModel.assetID);
                setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, woCapId, description);
            } else if (attributes.ValveIsPavedOver == "Y") {
                var description = "Valve Is Paved Over: " + attributes.ValveIsPavedOver;
                var woCapId = createCap("AMS/Water Operations/Water Valves/Repair", "Water Valve Repair: " + assetCAScriptModel.assetID);
                setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, woCapId, description);
            }
        }
    }
    
    aa.print("Exit createWorkOrderOnConditionAssessmentFail()");
}

function setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress(assetCAScriptModel, assetScriptModel, refAddressModel, workOrderCapId, description) {
    aa.print("Enter setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress()");

    var objectMapper = new org.codehaus.jackson.map.ObjectMapper();

    //aa.print("assetCAScriptModel: " + assetCAScriptModel);
    //aa.print("assetScriptModel: " + assetScriptModel);
    //aa.print("refAddressModel: " + refAddressModel);
    //aa.print("workOrderCapId: " + workOrderCapId);
    //aa.print("description: " + description);

    var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");

    if (woAssetModelRequest.getSuccess()) {

        var woAssetModel = woAssetModelRequest.getOutput();
        woAssetModel.setAssetPK(assetScriptModel.getAssetPK());
        woAssetModel.setCapID(workOrderCapId);

        aa.print("Begin calling aa.asset.createWorkOrderAsset()");
        aa.asset.createWorkOrderAsset(woAssetModel);
        aa.print("End calling aa.asset.createWorkOrderAsset()");
        
        aa.print("Begin calling updateWorkDesc()");
        updateWorkDesc(description, workOrderCapId); //INCLUDES_ACCELA_FUNCTIONS.js
        aa.print("End calling updateWorkDesc()");
        
        var assetCAWorkOrderModel = aa.proxyInvoker.newInstance("com.accela.ams.conditionassessment.AssetCAWorkOrderModel", null).getOutput();
        assetCAWorkOrderModel.setServProvCode(assetCAScriptModel.getServiceProviderCode());
        assetCAWorkOrderModel.setCapID(workOrderCapId);
        assetCAWorkOrderModel.setCapID1(workOrderCapId.ID1);
        assetCAWorkOrderModel.setCapID2(workOrderCapId.ID2);
        assetCAWorkOrderModel.setCapID3(workOrderCapId.ID3);
        assetCAWorkOrderModel.setAssetCAID(assetCAScriptModel.assetCAModel.assetCAID);
        assetCAWorkOrderModel.setRecDate(assetCAScriptModel.getRecDate());
        assetCAWorkOrderModel.setRecFulName(assetCAScriptModel.getRecFulName());
        assetCAWorkOrderModel.setRecStatus(assetCAScriptModel.getRecStatus());
        //aa.print(objectMapper.writeValueAsString(assetCAWorkOrderModel));

        aa.print("Begin calling aa.assetCA.createAssetCAWorkOrder()");
        aa.assetCA.createAssetCAWorkOrder(assetCAWorkOrderModel);
        aa.print("End calling aa.assetCA.createAssetCAWorkOrder()");

        if (refAddressModel != null) {

            var capScriptModel = aa.cap.getCap(workOrderCapId).getOutput();
            aa.print("capScriptModel: " + capScriptModel);

            var capModel = capScriptModel.getCapModel();
            aa.print("capModel: " + capModel);

            aa.print("Begin calling aa.address.createAddressWithRefAddressModel()");
            aa.address.createAddressWithRefAddressModel(workOrderCapId, refAddressModel);
            aa.print("End calling aa.address.createAddressWithRefAddressModel()");
        }

    } else {
        aa.print("Error: " + woAssetModelRequest.getErrorType() + " " + woAssetModelRequest.getErrorMessage());
    }

    aa.print("Exit setConditionAssessmentWorkOrderAssetAndDescriptionAndAddress()");
}