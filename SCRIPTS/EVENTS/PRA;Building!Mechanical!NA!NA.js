/*===================================================================
// Standard Choices Item Name:  PRA:Building/Mechanical/NA/NA
===================================================================*/

/*===================================================================
// ID: ACA00010
// Name: Issue FAU AC Change Out Permit
// Developer: Chris Godwin
// Developer Agency: Woolpert
// Script Description: When an online payment is received and the permit balance is $0, update workflow and issue the permit.
// Status: 

000 - publicUser && blanceDue <= 0 ^ closeTask("Application Submittal","Received Online",null,"Updated via Script"); updateAppStatus("Received Online","Updated via Script"); closeTask("Permit Issuance","Issued",null,"Updated via Script"); updateAppStatus("Issued","Updated via Script");

===================================================================*/

