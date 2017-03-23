function validateWorkOrderAssetAndCosting(){
  aa.print("Enter validateWorkOrderAssetAndCosting.js");

  //aa.print("capId: " + capId);

  //aa.print("cap: " + cap);

  var targetStatus = "Field Complete";
  var updatedStatus = appStatus;

  if(targetStatus == updatedStatus){
    aa.print("Begin if(){}");

    var capModel = cap.getCapModel();  
    //aa.print("capModel:" + capModel);

    var assetList = capModel.getAssetList();
    //aa.print("assetList.length: " + assetList.toArray().length);

    var workOrderCostingTransactions = getWorkOrderCostingTransactions(capId.ID1, capId.ID2, capId.ID3)
    //aa.print("workOrderCostingTransactions: " + workOrderCostingTransactions.length);

    if(assetList.length < 100 || workOrderCostingTransactions.length < 100){
      aa.print("Begin cancelling transaction");	
      aa.env.setValue("ScriptReturnCode", "1"); 
      aa.env.setValue("ScriptReturnMessage", "This record must have one asset record and one costing record before status can be set to '" + targetStatus + "'"); 
      cancel = true;
      aa.print("End cancelling transaction");	
    }
	
    aa.print("End if(){}");
  }

  aa.print("Exit validateWorkOrderAssetAndCosting.js");
}