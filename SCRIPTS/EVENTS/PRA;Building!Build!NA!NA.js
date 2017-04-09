/*===================================================================
// Standard Choices Item Name:  PRA:Building/Build/NA/NA
===================================================================*/

/*===================================================================
// ID: ACA00010
// Name: Issue Re-Roof Permit
// Developer: Chris Godwin
// Developer Agency: Woolpert
// Script Description: When an online payment is received and the permit balance is $0, update workflow and issue the permit.
// Status: 

010 - true ^ var buildPlanningFinalNotReq = false;
020 - matches({Permit Scope},"Residential Reroof") && publicUser && balanceDue <= 0 ^ loopTask("Application Submittal","Received Online",null,"Updated via Script"); updateAppStatus("Received Online","Updated via Script"); closeTask("Permit Issuance","Issued",null,"Updated via Script"); updateAppStatus("Issued","Updated via Script"); editAppSpecific("Expiration Date",dateAdd(null,0)); buildPlanningFinalNotReq = true;
030 - buildPlanningFinalNotReq && matches({Planning Case Number},null,"") ^ setTask("Planning Final","N","N","BLD_BLD_SUB");

===================================================================*/

