function getParkAssetStaffAssignment(permitId1, permitId2, permitId3) {
    aa.print("Enter getParkAssetStaffAssignment()");

    //Declare the return variable, this function will return a string, null, or undefined
    var parkAssetStaffAssignment = null;

    //Declare the namespace object
    var scope = {};

    var objectMapper = new org.codehaus.jackson.map.ObjectMapper();

    //Retrieve the CapIDModel object
    scope.capId = aa.cap.getCapID(permitId1, permitId2, permitId3).getOutput();
    //printObject(scope.capId, "");
    //aa.print("scope.capId:" + scope.capId);
    //aa.print(objectMapper.writeValueAsString(scope.capId));

    //Retrieve the CapScriptModel object
    scope.cap = aa.cap.getCap(scope.capId).getOutput();
    //aa.print("scope.cap: " + scope.cap);

    //Retrieve the CapModel object
    scope.capModel = scope.cap.getCapModel();
    //aa.print("scope.capModel: " + scope.capModel);

    //Retrieve the AssetMasetModel array
    scope.assets = scope.capModel.getAssetList().toArray();
    //aa.print("scope.assets:" + scope.assets);

    //We only care about the first AssetMasterModel item in the array
    if (scope.assets.length > 0) {

        //Sample Asset ID values (master asset & linked assets):

        //"P001"
        //"P001 SF1"
        //"P001 SC1"
        //"P001 PG1"
        //"P001 PA1"
        //"P001 PB1"

        var asset = scope.assets[0];
        //aa.print("asset: " + asset);
        //aa.print(objectMapper.writeValueAsString(asset));

        var assetId = asset.g1AssetID;
        //aa.print("assetId: " + assetId);
        assetId = "PP001 SF1";
        aa.print("assetId: " + assetId);

        var assetIdArray = assetId.split(" ");
        if (assetIdArray.length > 0) {

            var standardChoiceValue = assetIdArray[0];
            aa.print("standardChoiceValue: " + standardChoiceValue);

            var standardChoiceName = "PARK_ASSET_ASSIGNMENTS";
            
            var getBizDomainScriptResult = aa.bizDomain.getBizDomain(standardChoiceName);
            var bizDomainScriptModels = getBizDomainScriptResult.getOutput().toArray();

            var standardChoices = {};

            for (bizDomainScriptModel in bizDomainScriptModels) {
                bizDomainScriptModel = bizDomainScriptModels[bizDomainScriptModel];
                standardChoices[bizDomainScriptModel.bizdomainValue] = bizDomainScriptModel.description;
            }

            parkAssetStaffAssignment = standardChoices[standardChoiceValue];
            //aa.print("parkAssetStaffAssignment:" + parkAssetStaffAssignment);
            //aa.print("typeof(parkAssetStaffAssignment): " + typeof(parkAssetStaffAssignment));
        }
    }

    //for (standardChoice in standardChoices) {
    //    aa.print(standardChoice + ": " + standardChoices[standardChoice]);
    //}

    aa.print("Exit getParkAssetStaffAssignment() with " + parkAssetStaffAssignment);
    return parkAssetStaffAssignment;
}