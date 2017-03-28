/*------------------------------------------------------------------------------------------------------/
| Program	: INCLUDES_CUSTOM.js
| Event		: N/A
| Agency	: Torrance
| Version	: 03.23.2017.12:19.pst
|
| Usage		: Custom Script Include.  Insert custom EMSE Function below and they will be available to all master scripts
|
| Notes		: createRefLicProf - override to default the state if one is not provided
|
|			: createRefContactsFromCapContactsAndLink - testing new ability to link public users to new ref contacts
|			: 20151112 added info to logdebug statement for tracing renewal fees
|			: 10/27/2016 - Added functions(getAssignedStaff,assignCapToStaff) and updated(assignCapToDept,assignStaffDeptToCAP)
|			: 11/10/2016 - Deployed assign dept and staff updates to Dev for testing
|			: 12/22/2016 - Updated assignCapToDept() to correct break error and added additional debugging, 
|			: 12/22/2016 - Updated addConditionalAssessmentsForWaterValves() and addConditionalAssessmentsForHydrants() to set Status to "Scheduled"
|			: 01/12/2017 - Updated assignCapToDept() to set assigned to staff to null when the department is assigned.
|			: 03/23/2017 - Added validateWorkOrderAssetAndCosting() and getWorkOrderCostingTransactions() for validating on Status Update before.
|			: 03/28/2017 - Updated sendSRContactNotificationEmail() to normalize template naming conventions, add support for passing additional template parameters
|
/------------------------------------------------------------------------------------------------------*/

function createRefLicProf(rlpId, rlpType, pContactType) {
    //Creates/updates a reference licensed prof from a Contact
    //06SSP-00074, modified for 06SSP-00238
    var updating = false;
    var capContResult = aa.people.getCapContactByCapID(capId);
    if (capContResult.getSuccess())
    { conArr = capContResult.getOutput(); }
    else {
        logDebug("**ERROR: getting cap contact: " + capAddResult.getErrorMessage());
        return false;
    }

    if (!conArr.length) {
        logDebug("**WARNING: No contact available");
        return false;
    }


    var newLic = getRefLicenseProf(rlpId)

    if (newLic) {
        updating = true;
        logDebug("Updating existing Ref Lic Prof : " + rlpId);
    }
    else
        var newLic = aa.licenseScript.createLicenseScriptModel();

    //get contact record
    if (pContactType == null)
        var cont = conArr[0]; //if no contact type specified, use first contact
    else {
        var contFound = false;
        for (yy in conArr) {
            if (pContactType.equals(conArr[yy].getCapContactModel().getPeople().getContactType())) {
                cont = conArr[yy];
                contFound = true;
                break;
            }
        }
        if (!contFound) {
            logDebug("**WARNING: No Contact found of type: " + pContactType);
            return false;
        }
    }

    peop = cont.getPeople();
    addr = peop.getCompactAddress();

    newLic.setContactFirstName(cont.getFirstName());
    //newLic.setContactMiddleName(cont.getMiddleName());  //method not available
    newLic.setContactLastName(cont.getLastName());
    newLic.setBusinessName(peop.getBusinessName());
    newLic.setAddress1(addr.getAddressLine1());
    newLic.setAddress2(addr.getAddressLine2());
    newLic.setAddress3(addr.getAddressLine3());
    newLic.setCity(addr.getCity());
    newLic.setState(addr.getState());
    newLic.setZip(addr.getZip());
    newLic.setPhone1(peop.getPhone1());
    newLic.setPhone2(peop.getPhone2());
    newLic.setEMailAddress(peop.getEmail());
    newLic.setFax(peop.getFax());

    newLic.setAgencyCode(aa.getServiceProviderCode());
    newLic.setAuditDate(sysDate);
    newLic.setAuditID(currentUserID);
    newLic.setAuditStatus("A");

    if (AInfo["Insurance Co"]) newLic.setInsuranceCo(AInfo["Insurance Co"]);
    if (AInfo["Insurance Amount"]) newLic.setInsuranceAmount(parseFloat(AInfo["Insurance Amount"]));
    if (AInfo["Insurance Exp Date"]) newLic.setInsuranceExpDate(aa.date.parseDate(AInfo["Insurance Exp Date"]));
    if (AInfo["Policy #"]) newLic.setPolicy(AInfo["Policy #"]);

    if (AInfo["Business License #"]) newLic.setBusinessLicense(AInfo["Business License #"]);
    if (AInfo["Business License Exp Date"]) newLic.setBusinessLicExpDate(aa.date.parseDate(AInfo["Business License Exp Date"]));

    newLic.setLicenseType(rlpType);

    if (addr.getState() != null)
        newLic.setLicState(addr.getState());
    else
        newLic.setLicState("AK"); //default the state if none was provided

    newLic.setStateLicense(rlpId);

    if (updating)
        myResult = aa.licenseScript.editRefLicenseProf(newLic);
    else
        myResult = aa.licenseScript.createRefLicenseProf(newLic);

    if (myResult.getSuccess()) {
        logDebug("Successfully added/updated License No. " + rlpId + ", Type: " + rlpType);
        logMessage("Successfully added/updated License No. " + rlpId + ", Type: " + rlpType);
        return true;
    }
    else {
        logDebug("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage());
        logMessage("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage());
        return false;
    }

    function createRefLicProf(rlpId, rlpType, pContactType) {
        //Creates/updates a reference licensed prof from a Contact
        //06SSP-00074, modified for 06SSP-00238
        var updating = false;
        var capContResult = aa.people.getCapContactByCapID(capId);
        if (capContResult.getSuccess())
        { conArr = capContResult.getOutput(); }
        else {
            logDebug("**ERROR: getting cap contact: " + capAddResult.getErrorMessage());
            return false;
        }

        if (!conArr.length) {
            logDebug("**WARNING: No contact available");
            return false;
        }


        var newLic = getRefLicenseProf(rlpId)

        if (newLic) {
            updating = true;
            logDebug("Updating existing Ref Lic Prof : " + rlpId);
        }
        else
            var newLic = aa.licenseScript.createLicenseScriptModel();

        //get contact record
        if (pContactType == null)
            var cont = conArr[0]; //if no contact type specified, use first contact
        else {
            var contFound = false;
            for (yy in conArr) {
                if (pContactType.equals(conArr[yy].getCapContactModel().getPeople().getContactType())) {
                    cont = conArr[yy];
                    contFound = true;
                    break;
                }
            }
            if (!contFound) {
                logDebug("**WARNING: No Contact found of type: " + pContactType);
                return false;
            }
        }

        peop = cont.getPeople();
        addr = peop.getCompactAddress();

        newLic.setContactFirstName(cont.getFirstName());
        //newLic.setContactMiddleName(cont.getMiddleName());  //method not available
        newLic.setContactLastName(cont.getLastName());
        newLic.setBusinessName(peop.getBusinessName());
        newLic.setAddress1(addr.getAddressLine1());
        newLic.setAddress2(addr.getAddressLine2());
        newLic.setAddress3(addr.getAddressLine3());
        newLic.setCity(addr.getCity());
        newLic.setState(addr.getState());
        newLic.setZip(addr.getZip());
        newLic.setPhone1(peop.getPhone1());
        newLic.setPhone2(peop.getPhone2());
        newLic.setEMailAddress(peop.getEmail());
        newLic.setFax(peop.getFax());

        newLic.setAgencyCode(aa.getServiceProviderCode());
        newLic.setAuditDate(sysDate);
        newLic.setAuditID(currentUserID);
        newLic.setAuditStatus("A");

        if (AInfo["Insurance Co"]) newLic.setInsuranceCo(AInfo["Insurance Co"]);
        if (AInfo["Insurance Amount"]) newLic.setInsuranceAmount(parseFloat(AInfo["Insurance Amount"]));
        if (AInfo["Insurance Exp Date"]) newLic.setInsuranceExpDate(aa.date.parseDate(AInfo["Insurance Exp Date"]));
        if (AInfo["Policy #"]) newLic.setPolicy(AInfo["Policy #"]);

        if (AInfo["Business License #"]) newLic.setBusinessLicense(AInfo["Business License #"]);
        if (AInfo["Business License Exp Date"]) newLic.setBusinessLicExpDate(aa.date.parseDate(AInfo["Business License Exp Date"]));

        newLic.setLicenseType(rlpType);

        if (addr.getState() != null)
            newLic.setLicState(addr.getState());
        else
            newLic.setLicState("AK"); //default the state if none was provided

        newLic.setStateLicense(rlpId);

        if (updating)
            myResult = aa.licenseScript.editRefLicenseProf(newLic);
        else
            myResult = aa.licenseScript.createRefLicenseProf(newLic);

        if (myResult.getSuccess()) {
            logDebug("Successfully added/updated License No. " + rlpId + ", Type: " + rlpType);
            logMessage("Successfully added/updated License No. " + rlpId + ", Type: " + rlpType);
            return true;
        }
        else {
            logDebug("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage());
            logMessage("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage());
            return false;
        }
    }
}

function createLicenseParent(grp, typ, stype, cat, desc){// creates the new application and returns the capID object
    var appCreateResult = aa.cap.createApp(grp, typ, stype, cat, desc);
    logDebug("creating cap " + grp + "/" + typ + "/" + stype + "/" + cat);
    if (appCreateResult.getSuccess()) {
        var newId = appCreateResult.getOutput();
        logDebug("cap " + grp + "/" + typ + "/" + stype + "/" + cat + " created successfully ");

        // create Detail Record
        capModel = aa.cap.newCapScriptModel().getOutput();
        capDetailModel = capModel.getCapModel().getCapDetailModel();
        capDetailModel.setCapID(newId);
        aa.cap.createCapDetail(capDetailModel);

        var newObj = aa.cap.getCap(newId).getOutput(); //Cap object
        var result = aa.cap.createAppHierarchy(newId, capId);
        if (result.getSuccess())
            logDebug("Parent application successfully linked");
        else
            logDebug("Could not link applications");

        // Copy Parcels

        var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
        if (capParcelResult.getSuccess()) {
            var Parcels = capParcelResult.getOutput().toArray();
            for (zz in Parcels) {
                logDebug("adding parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
                var newCapParcel = aa.parcel.getCapParcelModel().getOutput();
                newCapParcel.setParcelModel(Parcels[zz]);
                newCapParcel.setCapIDModel(newId);
                newCapParcel.setL1ParcelNo(Parcels[zz].getParcelNumber());
                newCapParcel.setParcelNo(Parcels[zz].getParcelNumber());
                aa.parcel.createCapParcel(newCapParcel);
            }
        }

        // Copy Contacts
        var capPeoples = getPeople(capId);
        if (capPeoples != null && capPeoples.length > 0) {
            for (loopk in capPeoples) {
                sourcePeopleModel = capPeoples[loopk];
                sourcePeopleModel.getCapContactModel().setCapID(newId);
                aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
                logDebug("added contact");
            }
        }

        // Copy Addresses
        capAddressResult = aa.address.getAddressByCapId(capId);
        if (capAddressResult.getSuccess()) {
            Address = capAddressResult.getOutput();
            for (yy in Address) {
                newAddress = Address[yy];
                newAddress.setCapID(newId);
                aa.address.createAddress(newAddress);
                logDebug("added address");
            }
        }

        return newId;
    }
    else {
        logDebug("**ERROR: adding parent App: " + appCreateResult.getErrorMessage());
    }
}

function copyContactsWithAddresses(sourceCapId, targetCapId){

    var capPeoples = getPeople(capId);
    if (capPeoples != null && capPeoples.length > 0) {
        aa.print("Found " + capPeoples.length + " peoples on the source");
        for (loopk in capPeoples) {
            sourcePeopleModel = capPeoples[loopk];
            sourcePeopleModel.getCapContactModel().setCapID(targetCapId);
            aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
            logDebug("added contact");
        }
    }
    else {
        aa.print("No peoples on source");
    }
}

function getPeople(capId){
    capPeopleArr = null;
    var s_result = aa.people.getCapContactByCapID(capId);
    if (s_result.getSuccess()) {
        capPeopleArr = s_result.getOutput();
        if (capPeopleArr != null || capPeopleArr.length > 0) {
            for (loopk in capPeopleArr) {
                var capContactScriptModel = capPeopleArr[loopk];
                var capContactModel = capContactScriptModel.getCapContactModel();
                var peopleModel = capContactScriptModel.getPeople();
                var contactAddressrs = aa.address.getContactAddressListByCapContact(capContactModel);
                if (contactAddressrs.getSuccess()) {
                    var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
                    peopleModel.setContactAddressList(contactAddressModelArr);
                }
            }
        }

        else {
            aa.print("WARNING: no People on this CAP:" + capId);
            capPeopleArr = null;
        }
    }
    else {
        aa.print("ERROR: Failed to People: " + s_result.getErrorMessage());
        capPeopleArr = null;
    }
    return capPeopleArr;
}

function convertContactAddressModelArr(contactAddressScriptModelArr) {
    var contactAddressModelArr = null;
    if (contactAddressScriptModelArr != null && contactAddressScriptModelArr.length > 0) {
        logDebug(contactAddressScriptModelArr.length + " addresses");
        contactAddressModelArr = aa.util.newArrayList();
        for (loopk in contactAddressScriptModelArr) {
            contactAddressModelArr.add(contactAddressScriptModelArr[loopk].getContactAddressModel());
        }
    }
    return contactAddressModelArr;
}

function changeApplicantToLicenseHolder(licCapId) {

    var conToChange = null;
    consResult = aa.people.getCapContactByCapID(licCapId);
    if (consResult.getSuccess()) {
        cons = consResult.getOutput();
        for (thisCon in cons) {
            if (cons[thisCon].getCapContactModel().getPeople().getContactType() == "Applicant") {
                conToChange = cons[thisCon].getCapContactModel();
                p = conToChange.getPeople();
                contactAddressListResult = aa.address.getContactAddressListByCapContact(conToChange);
                if (contactAddressListResult.getSuccess())
                    contactAddressList = contactAddressListResult.getOutput();
                convertedContactAddressList = convertContactAddressModelArr(contactAddressList);
                p.setContactType("License Holder");
                p.setContactAddressList(convertedContactAddressList);
                conToChange.setPeople(p);
                aa.people.editCapContactWithAttribute(conToChange);
            }
        }
    }
}

function changeApplicantToPermitHolder(licCapId) {

    var conToChange = null;
    consResult = aa.people.getCapContactByCapID(licCapId);
    if (consResult.getSuccess()) {
        cons = consResult.getOutput();
        for (thisCon in cons) {
            if (cons[thisCon].getCapContactModel().getPeople().getContactType() == "Applicant") {
                conToChange = cons[thisCon].getCapContactModel();
                p = conToChange.getPeople();
                contactAddressListResult = aa.address.getContactAddressListByCapContact(conToChange);
                if (contactAddressListResult.getSuccess())
                    contactAddressList = contactAddressListResult.getOutput();
                convertedContactAddressList = convertContactAddressModelArr(contactAddressList);
                p.setContactType("Permit Holder");
                p.setContactAddressList(convertedContactAddressList);
                conToChange.setPeople(p);
                aa.people.editCapContactWithAttribute(conToChange);
            }
        }
    }
}

function getQtrExpirationDate() {

    t = new Date();
    m = t.getMonth() + 1;
    if (m > 0 && m < 4) return "03/31/" + t.getFullYear();
    if (m > 3 && m < 7) return "06/31/" + t.getFullYear();
    if (m > 6 && m < 10) return "09/31/" + t.getFullYear();
    if (m > 9 && m <= 12) return "12/31/" + t.getFullYear();
}

function addDocConditions(condString) {

    if (condString != null && condString != "") {
        conArr = condString.split(",");
        for (eachC in conArr) {
            thisCon = conArr[eachC];
            if (!appHasCondition("License Required Documents", null, thisCon, null)) {
                addStdCondition("License Required Documents", thisCon);
            }
        }
    }
}

function updateDocConditions(condString) {

    existConArr = getCapConditions("License Required Documents");
    if (condString != null && condString != "")
        conArr = condString.split(",");
    else
        conArr = new Array();

    // delete any conditions not needed
    for (indexC in existConArr) {
        thisExistC = existConArr[indexC];
        if (thisExistC.objType == "Record" && thisExistC.status == "Applied") {
            if (!exists(thisExistC.description, conArr)) {
                removeCapCondition("License Required Documents", thisExistC.description);
            }
        }
    }

    // add needed conditions
    for (eachC in conArr) {
        thisCon = conArr[eachC];
        if (!appHasCondition("License Required Documents", null, thisCon, null)) {
            addStdCondition("License Required Documents", thisCon);
        }
    }
}

function getCapConditions(pType, pStatus, pDesc, pImpact){// optional capID

    var resultArray = new Array();


    if (arguments.length > 4)
        var itemCap = arguments[4]; // use cap ID specified in args
    else
        var itemCap = capId;

    if (pType == null)
        var condResult = aa.capCondition.getCapConditions(itemCap);
    else
        var condResult = aa.capCondition.getCapConditions(itemCap, pType);

    if (condResult.getSuccess())
        var capConds = condResult.getOutput();
    else {
        var capConds = new Array();
        logDebug("**WARNING: getting cap conditions: " + condResult.getErrorMessage());
    }

    var cStatus;
    var cDesc;
    var cImpact;

    for (cc in capConds) {
        var thisCond = capConds[cc];
        var cStatus = thisCond.getConditionStatus();
        var cDesc = thisCond.getConditionDescription();
        var cImpact = thisCond.getImpactCode();
        var cType = thisCond.getConditionType();
        var cComment = thisCond.getConditionComment();

        if (cStatus == null)
            cStatus = " ";
        if (cDesc == null)
            cDesc = " ";
        if (cImpact == null)
            cImpact = " ";
        //Look for matching condition

        if ((pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
            var r = new condMatchObj;
            r.objType = "Record";
            r.object = thisCond;
            r.status = cStatus;
            r.type = cType;
            r.impact = cImpact;
            r.description = cDesc;
            r.comment = cComment;
            resultArray.push(r);
        }
    }
    return resultArray
}

function getProration(){

    if (arguments.length > 0) {
        bDate = arguments[0];
        if (bDate != null && bDate != "")
            t = new Date(arguments[0]);
        else
            return 1;
    }
    else
        t = new Date();
    firstOfYear = new Date("01/01/" + t.getFullYear());
    firstInterval = new Date("03/15/" + t.getFullYear());
    secondInterval = new Date("06/15/" + t.getFullYear());
    if (t >= firstOfYear && t <= firstInterval) return 1;
    if (t > firstInterval && t <= secondInterval) return .75;
    thirdInterval = new Date("09/15/" + t.getFullYear());
    if (t > secondInterval && t <= thirdInterval) return .50;
    fourthInterval = new Date("12/15/" + t.getFullYear());
    if (t > thirdInterval && t <= fourthInterval) return .25
    return 1;
}

function getFeeDefBySicInComment(fsched, SICCode){

    var arrFeesResult = aa.finance.getFeeItemList(null, fsched, null);
    if (arrFeesResult.getSuccess()) {
        var arrFees = arrFeesResult.getOutput();
        for (xx in arrFees) {
            var rft = arrFees[xx].getrFreeItem();
            var comments = rft.getComments();
            if (comments != null && comments != "" && comments.indexOf(SICCode) > 0) {
                var f = new FeeDef();
                f.feeCode = arrFees[xx].getFeeCod();
                f.feeDesc = arrFees[xx].getFeeDes();
                f.formula = arrFees[xx].getFormula();
                f.comments = comments;
                return f;
            }

        } // for xx
    }
    else {
        logDebug("Error getting fee schedule " + arrFeesResult.getErrorMessage());
        return null;
    }
    return null;
}

function FeeDef(){ // Fee Definition object
    this.formula = null;
    this.feeUnit = null;
    this.feeDesc = null;
    this.feeCode = null;
    this.comments = null;
}

function getASIFieldValue(fieldname){
    var asiList;
    asiList = aa.appSpecificInfo.getAppSpecificInfoByCap(cap.getCapModel());

    if (asiList.getSuccess()) {
        var asiGroups = asiList.getOutput();
        var iterGroup = asiGroups.iterator();
        while (iterGroup.hasNext()) {
            var asiGroup = iterGroup.next();
            var asiFields = asiGroup.getFields();
            var iterField = asiFields.iterator();
            while (iterField.hasNext()) {
                var asiField = iterField.next();
                if (fieldname == asiField.getFieldLabel()) {
                    return asiField.getChecklistComment();
                }
            }
        }
    }

    return 0;
}

function minmax(inta, intb, mmflag){
    //Outputs the higher of two integers if mmflag is 1, and the lower if it is 2
    //Optional argument to divide and round the output by a specified increment.
    //Example with Standard arguments:
    //minmax(0,1,1) returns 1, minmax(0,1,2) returns 0)
    //
    //Example with optional argument:
    //minmax(0,845,1,100) returns 9, minmax(352,1000,2,10) returns 36)
    var incr = 1;
    if (arguments.length == 4) incr = arguments[3];

    var wrkVal = 0;

    if (mmflag == 1) {
        if (inta >= intb) {
            if (incr > 1)
                wrkVal = inta;
            else
                return inta;
        }
        else {
            if (incr > 1)
                wrkVal = intb;
            else
                return intb;
        }
    }
    if (mmflag == 2) {
        if (inta >= intb) {
            if (incr > 1)
                wrkVal = intb;
            else
                return intb;
        }
        else {
            if (incr > 1)
                wrkVal = inta;
            else
                return inta;
        }
    }
    if (incr > 1) {
        var retQty = parseInt(wrkVal / incr);
        if (retQty < (wrkVal / incr)) retQty = retQty + 1;
        return retQty;
    }
}

function getSubGrpFeeAmt(subGrp){
    //Check for a specific status to use, optional argument 1
    var spStatus = "";
    if (arguments.length >= 2) { spStatus = arguments[1] };

    //Check for a specific FeeCode to exclude, optional argument 2
    var excludedFeeCode = "";
    if (arguments.length == 3) { excludedFeeCode = arguments[2] };

    if (spStatus != "") {
        logDebug("Getting total fees for Sub Group: " + subGrp + "; Having a status of: " + spStatus)
        var runFeeTot = 0
        var feeA = loadFees()
        for (x in feeA) {
            thisFee = feeA[x];
            if (thisFee.subGroup != null) {
                var thisFeeSubGrp = thisFee.subGroup
                var thisFeeSubGrpAry = thisFeeSubGrp.split(",")
                if (IsStrInArry(subGrp, thisFeeSubGrpAry) && (thisFee.status == spStatus)) {
                    //Check to see if fee should be excluded, if not then count it.
                    if (excludedFeeCode == thisFee.code) {
                        logDebug("Fee " + thisFee.code + " found with sub group: " + thisFee.subGroup + "; Amount: " + thisFee.amount + "; Status: " + thisFee.status);
                        logDebug("Fee " + thisFee.code + " is excluded from the Running Total: " + runFeeTot);
                    }
                    //excludedFeeCode is not specified, so count all
                    else {
                        logDebug("Fee " + thisFee.code + " found with sub group: " + thisFee.subGroup + "; Amount: " + thisFee.amount + "; Status: " + thisFee.status);
                        runFeeTot = runFeeTot + thisFee.amount;
                        logDebug("Fee: " + thisFee.code + " added to the running total. Running Total: " + runFeeTot);
                    }
                }
            }
        }
    }
    else {
        logDebug("Getting total fees for Sub Group: " + subGrp + "; Having a status of INVOICED or NEW.")
        var runFeeTot = 0
        var feeA = loadFees()
        for (x in feeA) {
            thisFee = feeA[x];
            if (thisFee.subGroup != null) {
                var thisFeeSubGrp = thisFee.subGroup
                var thisFeeSubGrpAry = thisFeeSubGrp.split(",")
                if (IsStrInArry(subGrp, thisFeeSubGrpAry) && (thisFee.status == "INVOICED" || thisFee.status == "NEW")) {
                    if (excludedFeeCode == thisFee.code) {
                        logDebug("Fee " + thisFee.code + " found with sub group: " + thisFee.subGroup + "; Amount: " + thisFee.amount + "; Status: " + thisFee.status);
                        logDebug("Fee " + thisFee.code + " is excluded from the Running Total: " + runFeeTot);
                    }
                    //excludedFeeCode is not specified, so count all
                    else {
                        logDebug("Fee " + thisFee.code + " found with sub group: " + thisFee.subGroup + "; Amount: " + thisFee.amount + "; Status: " + thisFee.status);
                        runFeeTot = runFeeTot + thisFee.amount;
                        logDebug("Fee: " + thisFee.code + " added to the running total. Running Total: " + runFeeTot);
                    }
                }
            }
        }
    }
    logDebug("Final returned amount: " + runFeeTot);
    return (runFeeTot);
}

function updateFeeFromASI(ASIField, FeeCode, FeeSchedule){
    var ASIField;
    var FeeCode;
    var FeeSchedule;
    logDebug("updateFeeFromASI Function: ASI Field = " + ASIField + "; Fee Code = " + FeeCode + "; Fee Schedule: " + FeeSchedule);
    if (arguments.length >= 3) {
        ASIField = arguments[0]; // ASI Field to get the value from
        FeeCode = arguments[1]; // Fee code to update
        FeeSchedule = arguments[2]; // Fee Scheulde for Fee Code
    }
    else {
        logDebug("Not enought arguments passed to the function: updateFeeFromASI");
    }
    var prorate = false;
    var proRation = 1;
    if (arguments.length >= 4) {
        proRation = arguments[3];
        if (proRation != null && proRation != "") {
            proRation = parseFloat(proRation);
            logDebug("proration factor is " + proRation);
        }
    }
    var tmpASIQty = proRation * getAppSpecific(ASIField)

    //Check to see if the ASI Field has a value. If so, then check to see if the fee exists.
    if ((tmpASIQty != null) && (tmpASIQty > 0)) {
        logDebug("ASI Field: " + ASIField + " was found and has a positive value. Attempting to update fee information.");
        //If fee already exist and the amount is different than the ASIQty, void or remove it before adding the new qty.
        if (feeExists(FeeCode) && (tmpASIQty != getFeeQty(FeeCode))) {
            logDebug("Existing fee found with quanity: " + getFeeQty(FeeCode) + ". New Quantity is: " + tmpASIQty);
            voidRemoveFees(FeeCode)
            //Add the new fee from ASI quanity.
            updateFee(FeeCode, FeeSchedule, "STANDARD", tmpASIQty, "N", "Y");
            logDebug("Fee information has been modified.");
        }
        else if (feeExists(FeeCode) && (tmpASIQty == getFeeQty(FeeCode))) {
            logDebug("Existing fee found with quanity: " + getFeeQty(FeeCode) + ". New Quantity is: " + tmpASIQty + ". No changes are being made to fee.");
        }
        //No existing fee is found, add the new fee
        if (feeExists(FeeCode) != true) {
            updateFee(FeeCode, FeeSchedule, "STANDARD", tmpASIQty, "N", "Y");
            logDebug("Fee information has been modified.");
        }
    }
    //ASI Field doesn't exist or has a value <= 0.
    else {
        logDebug("ASI Field: " + ASIField + " is not found or has a value <= 0.")
        //Check to see if a fee for the ASI item exists. No fee should be present, but check anyways.
        if (feeExists(FeeCode)) {
            //Fee is found and should be voided or removed.
            voidRemoveFees(FeeCode)
        }

    }
}

function updateFee(fcode, fsched, fperiod, fqty, finvoice, pDuplicate, pFeeSeq){
    // Updates an assessed fee with a new Qty.  If not found, adds it; else if invoiced fee found, adds another with adjusted qty.
    // optional param pDuplicate -if "N", won't add another if invoiced fee exists (SR5085)
    // Script will return fee sequence number if new fee is added otherwise it will return null (SR5112)
    // Optional param pSeqNumber, Will attempt to update the specified Fee Sequence Number or Add new (SR5112)
    // 12/22/2008 - DQ - Correct Invoice loop to accumulate instead of reset each iteration

    // If optional argument is blank, use default logic (i.e. allow duplicate fee if invoiced fee is found)
    if (pDuplicate == null || pDuplicate.length == 0)
        pDuplicate = "Y";
    else
        pDuplicate = pDuplicate.toUpperCase();

    var invFeeFound = false;
    var adjustedQty = fqty;
    var feeSeq = null;
    feeUpdated = false;

    if (pFeeSeq == null)
        getFeeResult = aa.finance.getFeeItemByFeeCode(capId, fcode, fperiod);
    else
        getFeeResult = aa.finance.getFeeItemByPK(capId, pFeeSeq);


    if (getFeeResult.getSuccess()) {
        if (pFeeSeq == null)
            var feeList = getFeeResult.getOutput();
        else {
            var feeList = new Array();
            feeList[0] = getFeeResult.getOutput();
        }
        for (feeNum in feeList)
            if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
                if (pDuplicate == "Y") {
                    logDebug("Invoiced fee " + fcode + " found, subtracting invoiced amount from update qty.");
                    adjustedQty = adjustedQty - feeList[feeNum].getFeeUnit();
                    invFeeFound = true;
                }
                else {
                    invFeeFound = true;
                    logDebug("Invoiced fee " + fcode + " found.  Not updating this fee. Not assessing new fee " + fcode);
                }
            }

        for (feeNum in feeList)
            if (feeList[feeNum].getFeeitemStatus().equals("NEW") && !feeUpdated)  // update this fee item
            {
                var feeSeq = feeList[feeNum].getFeeSeqNbr();
                var editResult = aa.finance.editFeeItemUnit(capId, fqty, feeSeq);
                feeUpdated = true;
                if (editResult.getSuccess()) {
                    logDebug("Updated Qty on Existing Fee Item: " + fcode + " to Qty: " + fqty);
                    if (finvoice == "Y") {
                        feeSeqList.push(feeSeq);
                        paymentPeriodList.push(fperiod);
                    }
                }
                else
                { logDebug("**ERROR: updating qty on fee item (" + fcode + "): " + editResult.getErrorMessage()); break }
            }
    }
    else
    { logDebug("**ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage()) }

    // Add fee if no fee has been updated OR invoiced fee already exists and duplicates are allowed
    if (!feeUpdated && adjustedQty != 0 && (!invFeeFound || invFeeFound && pDuplicate == "Y"))
        feeSeq = addFee(fcode, fsched, fperiod, adjustedQty, finvoice);
    else
        feeSeq = null;

    return feeSeq;
}

function voidRemoveAllFees(){
    var feeSeqArray = new Array();
    var invoiceNbrArray = new Array();
    var feeAllocationArray = new Array();
    var itemCap = capId;
    if (arguments.length > 1)
        itemCap = arguments[1];

    // for each fee found
    //      if the fee is "NEW" remove it
    //      if the fee is "INVOICED" void it and invoice the void
    //

    var targetFees = loadFees(itemCap);

    for (tFeeNum in targetFees) {
        targetFee = targetFees[tFeeNum];
        //   if (targetFee.status == "INVOICED") {
        //      var editResult = aa.finance.voidFeeItem(itemCap, targetFee.sequence);
        //     if (editResult.getSuccess())
        //          logDebug("Voided existing Fee Item: " + targetFee.code);
        //      else
        //      { logDebug("**ERROR: voiding fee item (" + targetFee.code + "): " + editResult.getErrorMessage()); return false; }
        //      var feeSeqArray = new Array();
        //      var paymentPeriodArray = new Array();
        //      feeSeqArray.push(targetFee.sequence);
        //      paymentPeriodArray.push(targetFee.period);
        //      var invoiceResult_L = aa.finance.createInvoice(itemCap, feeSeqArray, paymentPeriodArray);
        //      if (!invoiceResult_L.getSuccess()) {
        //          logDebug("**ERROR: Invoicing the fee items voided " + thisFee.code + " was not successful.  Reason: " + invoiceResult_L.getErrorMessage());
        //          return false;
        //      }
        //      break;  // done with this payment
        //  }
        if (targetFee.status == "NEW") {
            // delete the fee
            var editResult = aa.finance.removeFeeItem(itemCap, targetFee.sequence);

            if (editResult.getSuccess())
                logDebug("Removed existing Fee Item: " + targetFee.code);
            else
            { logDebug("**ERROR: removing fee item (" + targetFee.code + "): " + editResult.getErrorMessage()); return false; }

            break;  // done with this payment
        }
    }  // each  fee
}

function voidRemoveFees(vFeeCode){
    var feeSeqArray = new Array();
    var invoiceNbrArray = new Array();
    var feeAllocationArray = new Array();
    var itemCap = capId;
    if (arguments.length > 1)
        itemCap = arguments[1];

    // for each fee found
    //      if the fee is "NEW" remove it
    //      if the fee is "INVOICED" void it and invoice the void
    //

    var targetFees = loadFees(itemCap);

    for (tFeeNum in targetFees) {
        targetFee = targetFees[tFeeNum];

        if (targetFee.code.equals(vFeeCode)) {

            // only remove invoiced or new fees, however at this stage all AE fees should be invoiced.

            //        if (targetFee.status == "INVOICED") {
            //            var editResult = aa.finance.voidFeeItem(itemCap, targetFee.sequence);

            //                if (editResult.getSuccess())
            //                    logDebug("Voided existing Fee Item: " + targetFee.code);
            //                else
            //                { logDebug("**ERROR: voiding fee item (" + targetFee.code + "): " + editResult.getErrorMessage()); return false; }
            //
            //                var feeSeqArray = new Array();
            //                var paymentPeriodArray = new Array();
            //
            //                feeSeqArray.push(targetFee.sequence);
            //                paymentPeriodArray.push(targetFee.period);
            //                var invoiceResult_L = aa.finance.createInvoice(itemCap, feeSeqArray, paymentPeriodArray);
            //
            //                if (!invoiceResult_L.getSuccess()) {
            //                    logDebug("**ERROR: Invoicing the fee items voided " + thisFee.code + " was not successful.  Reason: " + invoiceResult_L.getErrorMessage());
            //                    return false;
            //                }
            //
            //               break;  // done with this payment
            //           }



            if (targetFee.status == "NEW") {
                // delete the fee
                var editResult = aa.finance.removeFeeItem(itemCap, targetFee.sequence);

                if (editResult.getSuccess())
                    logDebug("Removed existing Fee Item: " + targetFee.code);
                else
                { logDebug("**ERROR: removing fee item (" + targetFee.code + "): " + editResult.getErrorMessage()); return false; }

                break;  // done with this payment
            }

        } // each matching fee
    }  // each  fee
}

function getFeeQty(FeeCode){
    var feeA = loadFees(capId);
    var tmpFeeTotQty = 0;

    for (x in feeA) {
        thisFee = feeA[x];

        if (thisFee.code == FeeCode && (thisFee.status == "INVOICED" || thisFee.status == "NEW")) {
            tmpFeeTotQty = tmpFeeTotQty + thisFee.unit;
        }
    }
    return tmpFeeTotQty;
}

function invoiceAllFees(){

    var feeFound = false;
    var fperiod = "STANDARD";
    getFeeResult = aa.finance.getFeeItemByCapID(capId);
    if (getFeeResult.getSuccess()) {
        var feeList = getFeeResult.getOutput();
        for (feeNum in feeList) {
            if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
                var feeSeq = feeList[feeNum].getFeeSeqNbr();
                if (!exists(feeSeq, feeSeqList)) {
                    feeSeqList.push(feeSeq);
                    paymentPeriodList.push(fperiod);
                    feeFound = true;
                }
            }
        }
    }
    else
    { logDebug("**ERROR: getting fee items " + getFeeResult.getErrorMessage()) }
    return feeFound;
}

function editNameOfLicenseHolder(licCapId, newName){

    var conToChange = null;
    consResult = aa.people.getCapContactByCapID(licCapId);
    if (consResult.getSuccess()) {
        cons = consResult.getOutput();
        for (thisCon in cons) {
            if (cons[thisCon].getCapContactModel().getPeople().getContactType() == "License Holder") {
                conToChange = cons[thisCon].getCapContactModel();
                p = conToChange.getPeople();
                //p.setTradeName(newName);
                p.setBusinessName(newName);
                contactAddressListResult = aa.address.getContactAddressListByCapContact(conToChange);
                if (contactAddressListResult.getSuccess())
                    contactAddressList = contactAddressListResult.getOutput();
                convertedContactAddressList = convertContactAddressModelArr(contactAddressList);
                p.setContactAddressList(convertedContactAddressList);
                conToChange.setPeople(p);
                aa.people.editCapContactWithAttribute(conToChange);
            }
        }
        for (thisCon in cons) {
            if (cons[thisCon].getCapContactModel().getPeople().getContactType() == "Permit Holder") {
                conToChange = cons[thisCon].getCapContactModel();
                p = conToChange.getPeople();
                //p.setTradeName(newName);
                p.setBusinessName(newName);
                contactAddressListResult = aa.address.getContactAddressListByCapContact(conToChange);
                if (contactAddressListResult.getSuccess())
                    contactAddressList = contactAddressListResult.getOutput();
                convertedContactAddressList = convertContactAddressModelArr(contactAddressList);
                p.setContactAddressList(convertedContactAddressList);
                conToChange.setPeople(p);
                aa.people.editCapContactWithAttribute(conToChange);
            }
        }
    }
}

function editMailingAddressOfLicenseHolder(licCapId, addr1, addr2, city, state, zip){

    var conToChange = null;
    consResult = aa.people.getCapContactByCapID(licCapId);
    if (consResult.getSuccess()) {
        cons = consResult.getOutput();
        for (thisCon in cons) {
            if (cons[thisCon].getCapContactModel().getPeople().getContactType() == "License Holder") {
                conToChange = cons[thisCon].getCapContactModel();
                p = conToChange.getPeople();
                contactAddressListResult = aa.address.getContactAddressListByCapContact(conToChange);
                if (contactAddressListResult.getSuccess()) {
                    contactAddressList = contactAddressListResult.getOutput();
                    for (var x in contactAddressList) {
                        cal = contactAddressList[x];
                        addrType = cal.getAddressType();
                        if (addrType == "Mailing") {
                            contactAddressID = cal.getAddressID();
                            cResult = aa.address.getContactAddressByPK(cal.getContactAddressModel());
                            if (cResult.getSuccess()) {
                                casm = cResult.getOutput();
                                casm.setAddressLine1(addr1);
                                casm.setAddressLine2(addr2);
                                casm.setCity(city);
                                casm.setState(state);
                                casm.setZip(zip);

                                aa.address.editContactAddress(casm.getContactAddressModel());
                            }
                        }
                    }
                    convertedContactAddressList = convertContactAddressModelArr(contactAddressList);
                    p.setContactAddressList(convertedContactAddressList);
                    conToChange.setPeople(p);
                    aa.people.editCapContactWithAttribute(conToChange);
                }
            }
        }
        for (thisCon in cons) {
            if (cons[thisCon].getCapContactModel().getPeople().getContactType() == "Permit Holder") {
                conToChange = cons[thisCon].getCapContactModel();
                p = conToChange.getPeople();
                contactAddressListResult = aa.address.getContactAddressListByCapContact(conToChange);
                if (contactAddressListResult.getSuccess()) {
                    contactAddressList = contactAddressListResult.getOutput();
                    for (var x in contactAddressList) {
                        cal = contactAddressList[x];
                        addrType = cal.getAddressType();
                        if (addrType == "Mailing") {
                            contactAddressID = cal.getAddressID();
                            cResult = aa.address.getContactAddressByPK(cal.getContactAddressModel());
                            if (cResult.getSuccess()) {
                                casm = cResult.getOutput();
                                casm.setAddressLine1(addr1);
                                casm.setAddressLine2(addr2);
                                casm.setCity(city);
                                casm.setState(state);
                                casm.setZip(zip);

                                aa.address.editContactAddress(casm.getContactAddressModel());
                            }
                        }
                    }
                    convertedContactAddressList = convertContactAddressModelArr(contactAddressList);
                    p.setContactAddressList(convertedContactAddressList);
                    conToChange.setPeople(p);
                    aa.people.editCapContactWithAttribute(conToChange);
                }
            }
        }
    }
}

function updateLicRenewalFees(parentLicId){
    // called from CRCA - updates
    actCode = getAppSpecific("Activity Code", parentLicId);
    logDebug("Includes_custom updateLicRenewalFees Activity Code = " + actCode);
    feeDriverString = lookup("FEE_DRIVER", actCode);
    if (feeDriverString && feeDriverString != "") {
        feeDriverPieces = feeDriverString.split(";");
        for (pIndex in feeDriverPieces) {
            driver = feeDriverPieces[pIndex];
            pieces = driver.split("=");
            feeItem = pieces[0];
            feeCode = pieces[1];
            switch ("" + feeItem) {
                case "EXEMPT":
                    removeAllFees(capId);
                    break;
                case "BASE":
                    if (feeCode && feeCode != "" && feeCode != "NONE") {
                        updateFee(feeCode, "LIC_GENERAL", "STANDARD", 1, "N", "N");
                    }
                    break;
                case "PERPERSON":
                    if (feeCode && feeCode != "" && feeCode != "NONE") {
                        var numPersons = getAppSpecific("Number of Persons Working in Torrance");
                        if (numPersons && numPersons != "") {
                            if (feeCode == "BLIT") {
                                var busInTor = getAppSpecific("Business Located in Torrance", parentLicId);
                                if (busInTor && busInTor != "" && busInTor.substring(0, 1).toUpperCase() == "Y")
                                    updateFee("LIC_001", "LIC_GENERAL", "STANDARD", parseInt(numPersons), "N", "N");
                            }
                            else {
                                updateFee(feeCode, "LIC_GENERAL", "STANDARD", parseInt(numPersons), "N", "N");
                            }
                        }
                    }
                    break;
                case "PERUNIT":
                    if (feeCode && feeCode != "" && feeCode != "NONE") {
                        var numUnits = getAppSpecific("Units");
                        if (numUnits && numUnits != "") {
                            updateFee(feeCode, "LIC_GENERAL", "STANDARD", parseInt(numUnits), "N", "N");
                        }
                    }
                    break;
                case "VENDING":
                    assessVendingMachineFees(false, "update", null, parentLicId);
                    break;
                case "COMMERCIAL":
                    SqFt = getAppSpecific("Square Footage", parentLicId);
                    if (SqFt && SqFt != "")
                        updateFee("LIC_9999", "LIC_GENERAL", "STANDARD", parseFloat(SqFt), "N", "N");
                    break;
                default:
                    logDebug("Unknown fee driver");
            }
        }
    }
}

function updateLicApplicationFees(){
    var actCode = getAppSpecific("Activity Code");
    var bsd = getAppSpecific("Business Start Date");
    logDebug("Activity Code = " + actCode);
    feeDriverString = lookup("FEE_DRIVER", actCode);
    if (feeDriverString && feeDriverString != "") {
        feeDriverPieces = feeDriverString.split(";");
        for (pIndex in feeDriverPieces) {
            driver = feeDriverPieces[pIndex];
            pieces = driver.split("=");
            feeItem = pieces[0];
            feeCode = pieces[1];
            switch ("" + feeItem) {
                case "EXEMPT":
                    removeAllFees(capId);
                    break;
                case "BASE":
                    if (feeCode && feeCode != "" && feeCode != "NONE") {
                        updateFee(feeCode, "LIC_GENERAL", "STANDARD", getProration(bsd), "N", "N");
                    }
                    break;
                case "PERPERSON":
                    if (feeCode && feeCode != "" && feeCode != "NONE") {
                        if (feeCode == "BLIT") {
                            var busInTor = getAppSpecific("Business Located in Torrance");
                            if (busInTor && busInTor != "" && busInTor.substring(0, 1).toUpperCase() == "Y")
                                updateFeeFromASI("Number of Persons Working in Torrance", "LIC_001", "LIC_GENERAL", getProration(bsd));
                        }
                        else {
                            updateFeeFromASI("Number of Persons Working in Torrance", "LIC_001", "LIC_GENERAL", getProration(bsd));
                        }
                    }
                    break;
                case "PERUNIT":
                    if (feeCode && feeCode != "" && feeCode != "NONE") {
                        updateFeeFromASI("Units", feeCode, "LIC_GENERAL", getProration(bsd));
                    }
                    break;
                case "VENDING":
                    assessVendingMachineFees(true);
                    break;
                case "COMMERCIAL":
                    updateFeeFromASI("Square Footage", "LIC_9999", "LIC_GENERAL", getProration(bsd));
                    break;
                default:
                    logDebug("Unknown fee driver");
            }
        }
    }
}

function comparePeopleTOR(peop){
    /*  this function will be passed as a parameter to the createRefContactsFromCapContactsAndLink function.
    takes a single peopleModel as a parameter, and will return the sequence number of the first G6Contact result
    returns null if there are no matches
  
    customization for Torrance uses the following algorithm:
    
    1.  Match on SSN/FEIN if either exist
    
    This function can use attributes if desired   */
    if (peop.getSocialSecurityNumber() || peop.getFein()) {
        var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
        qryPeople.setSocialSecurityNumber(peop.getSocialSecurityNumber());
        qryPeople.setFein(peop.getFein());
        var r = aa.people.getPeopleByPeopleModel(qryPeople);
        if (!r.getSuccess()) { logDebug("WARNING: error searching for people : " + r.getErrorMessage()); return false; }
        var peopResult = r.getOutput();
        if (peopResult.length > 0) {
            logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber());
            return peopResult[0].getContactSeqNumber();
        }
    }
    logDebug("ComparePeople did not find a match");
    return false;
}

function hasIssuedDanceEndorsement(licId){

    childArr = getChildren("Licenses/Business/Endorsement/Dance", licId);
    if (childArr && childArr.length > 0) {
        for (cIndex in childArr) {
            childId = childArr[cIndex];
            childStatus = getAppStatus(childId);
            if (childStatus == "Issued")
                return true;
        }
    }
    return false;
}

function hasIssuedEntEndorsement(licId){

    childArr = getChildren("Licenses/Business/Endorsement/Entertainment", licId);
    if (childArr && childArr.length > 0) {
        for (cIndex in childArr) {
            childId = childArr[cIndex];
            childStatus = getAppStatus(childId);
            if (childStatus == "Issued")
                return true;
        }
    }
    return false;
}

function getAppStatus(capId){
    // gets the application status given a capId object

    capResult = aa.cap.getCap(capId);
    if (capResult.getSuccess()) {
        tempCap = capResult.getOutput();
        return tempCap.getCapStatus();
    }
    else {
        logDebug("Could not get application status " + capResult.getErrorMessage());
        return null;
    }
}

function setPrimaryAddressNot(itemCap){
    var capAddressResult = aa.address.getAddressWithAttributeByCapId(itemCap);
    var copied = 0;
    if (capAddressResult.getSuccess()) {
        Address = capAddressResult.getOutput();
        for (yy in Address) {
            addr = Address[yy];
            if (addr.getPrimaryFlag() == "Y") {
                addr.setPrimaryFlag("N");
                aa.address.editAddressWithAPOAttribute(itemCap, addr);
            }
        }
    }
}

function closeWorkflow(){
    // closes all tasks of a workflow. DOES NOT handleDisposition.
    var taskArray = new Array();

    var workflowResult = aa.workflow.getTasks(capId);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else {
        return false;
    }

    var fTask;
    var stepnumber;
    var wftask;

    for (i in wfObj) {
        fTask = wfObj[i];
        wftask = fTask.getTaskDescription();
        stepnumber = fTask.getStepNumber();
        completeFlag = fTask.getCompleteFlag();
        processID = fTask.getProcessID();
        aa.workflow.adjustTask(capId, stepnumber, processID, "N", completeFlag, null, null);
    }
}

function assessVendingMachineFees(){// parameters: applyProration (true/false), add/update, renewalCapId, licCapId)

    var applyProration = false;
    var renewalProcess = false;
    var renewalProcessType = "add";
    var renCap = capId; // default to current record 
    var licCap = capId; // default to current record
    if (arguments.length > 0) {
        applyProration = arguments[0];
        if (applyProration == "true") applyProration = true;
    }
    if (arguments.length > 1) {
        renewalProcess = true;
        renewalProcessType = arguments[1];
    }
    if (arguments.length > 2) {
        logDebug("Using renewal cap specified in arguments");
        renCap = arguments[2];
    }
    if (arguments.length > 3) {
        logDebug("Using license cap specified in arguments");
        licCap = arguments[3];
    }


    var machineTable = loadASITable("VENDING MACHINES", licCap);
    if (machineTable == null || machineTable == undefined || machineTable.length < 1) {
        logDebug("No data in vending machine ASIT");
        return;
    }
    else {
        logDebug("Accessing Vending Machine fees");
        var proRation = 1;
        if (applyProration)
            proRation = getProration(getAppSpecific("Business Start Date"), licCap);

        for (eachRow in machineTable) {
            machineRow = machineTable[eachRow];
            machineType = machineRow["Machine Type"].fieldValue;
            numMachines = machineRow["Number of Machines"].fieldValue;
            if (numMachines != null && parseInt(numMachines) > 0) {
                switch ("" + machineType) {
                    case "1":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_001", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_001", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_001", "VENDING", "STANDARD", proRation * numMachines, "N");
                        break;
                    case "2":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_002", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_002", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_002", "VENDING", "STANDARD", 1 * numMachines, "N");
                        break;
                    case "3":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_003", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_003", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_003", "VENDING", "STANDARD", 1 * numMachines, "N");
                        break;
                    case "4":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_004", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_004", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_004", "VENDING", "STANDARD", proRation * numMachines, "N"); break;
                    case "5":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_005", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_005", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_005", "VENDING", "STANDARD", proRation * numMachines, "N"); break;
                    case "6":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_006", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_006", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_006", "VENDING", "STANDARD", proRation * numMachines, "N"); break;
                    case "7":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_007", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_007", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_007", "VENDING", "STANDARD", proRation * numMachines, "N"); break;
                    case "8":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_006", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_006", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_006", "VENDING", "STANDARD", proRation * numMachines, "N");
                        break;
                    case "9":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_009", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_009", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_009", "VENDING", "STANDARD", proRation * numMachines, "N");
                        break;
                    case "10":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_010", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_010", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_010", "VENDING", "STANDARD", proRation * numMachines, "N");
                        break;
                    case "11":
                        if (renewalProcess) {
                            if (renewalProcessType == "add")
                                addFee("VEND_011", "VENDING", "STANDARD", 1, "N", renewalCapId);
                            else
                                updateFee("VEND_011", "VENDING", "STANDARD", 1, "N", "N");
                        }
                        else
                            updateFee("VEND_011", "VENDING", "STANDARD", proRation * numMachines, "N");
                        break;
                    default:
                        logDebug("Unknown vending machine type");
                        break;
                }
            }
        }
    }
}

function createRefLicProfTOR(rlpId, rlpType, pContactType, newExpDate){
    //Creates/updates a reference licensed prof from a Contact
    //06SSP-00074, modified for 06SSP-00238
    var updating = false;
    var capContResult = aa.people.getCapContactByCapID(capId);
    if (capContResult.getSuccess())
    { conArr = capContResult.getOutput(); }
    else {
        logDebug("**ERROR: getting cap contact: " + capAddResult.getErrorMessage());
        return false;
    }
    if (!conArr.length) {
        logDebug("**WARNING: No contact available");
        return false;
    }

    var newLic = getRefLicenseProf(rlpId)
    if (newLic) {
        updating = true;
        logDebug("Updating existing Ref Lic Prof : " + rlpId);
    }
    else
        var newLic = aa.licenseScript.createLicenseScriptModel();

    //get contact record
    if (pContactType == null)
        var cont = conArr[0]; //if no contact type specified, use first contact
    else {
        var contFound = false;
        for (yy in conArr) {
            if (pContactType.equals(conArr[yy].getCapContactModel().getPeople().getContactType())) {
                cont = conArr[yy];
                contFound = true;
                break;
            }
        }
        if (!contFound) {
            logDebug("**WARNING: No Contact found of type: " + pContactType);
            return false;
        }
    }

    peop = cont.getPeople();
    //addr = peop.getCompactAddress();

    newLic.setContactFirstName(cont.getFirstName());
    //newLic.setContactMiddleName(cont.getMiddleName());  //method not available
    newLic.setContactLastName(cont.getLastName());
    newLic.setBusinessName(peop.getBusinessName());
    //set the address to the primary address on the record
    var capAddressResult = aa.address.getAddressByCapId(capId);
    var addr = null;
    if (capAddressResult.getSuccess()) {
        Address = capAddressResult.getOutput();
        for (yy in Address) {
            if ("Y" == Address[yy].getPrimaryFlag()) {
                addr = Address[yy];
                break;
            }
        }
        if (addr == null) { addr = Address[0]; }
    }
    else { logMessage("**ERROR: Failed to get addresses: " + capAddressResult.getErrorMessage()); }
    if (addr != null) {
        var addrLine1 = null;
        addrLine1 = addr.getHouseNumberStart();
        addrLine1 += (addr.getStreetDirection() != null ? " " + addr.getStreetDirection() : "");
        addrLine1 += (addr.getStreetName() != null ? " " + addr.getStreetName() : "");
        addrLine1 += (addr.getStreetSuffix() != null ? " " + addr.getStreetSuffix() : "");
        addrLine1 += (addr.getUnitType() != null ? " " + addr.getUnitType() : "");
        addrLine1 += (addr.getUnitStart() != null ? " " + addr.getUnitStart() : "");
    }
    newLic.setAddress1(addrLine1);
    newLic.setCity(addr.getCity());
    newLic.setState(addr.getState());
    newLic.setZip(addr.getZip());
    newLic.setPhone3(peop.getPhone3()); // get the business phone of the applicant
    //newLic.setPhone2(peop.getPhone2());
    //newLic.setEMailAddress(peop.getEmail());
    //newLic.setFax(peop.getFax());

    newLic.setAgencyCode(aa.getServiceProviderCode());
    newLic.setAuditDate(sysDate);
    newLic.setAuditID(currentUserID);
    newLic.setAuditStatus("A");

    newLic.setBusinessLicense("Active");
    newLic.setBusinessLicExpDate(aa.date.parseDate(newExpDate));
    newLic.setLicenseType(rlpType); // should be 'Business'

    if (addr.getState() != null)
        newLic.setLicState(addr.getState());
    else
        newLic.setLicState("CA"); //default the state if none was provided

    newLic.setStateLicense(rlpId);

    if (updating)
        myResult = aa.licenseScript.editRefLicenseProf(newLic);
    else
        myResult = aa.licenseScript.createRefLicenseProf(newLic);

    if (myResult.getSuccess()) {
        logDebug("Successfully added/updated License No. " + rlpId + ", Type: " + rlpType);
        logMessage("Successfully added/updated License No. " + rlpId + ", Type: " + rlpType);
        return true;
    }
    else {
        logDebug("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage());
        logMessage("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage());
        return false;
    }
}

function getCapContactAddressList(conSeq){
    var capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
        capPeopleArr = capContactResult.getOutput();
        if (capPeopleArr != null || capPeopleArr.length > 0) {
            for (loopk in capPeopleArr) {
                var capContactScriptModel = capPeopleArr[loopk];
                var capContactModel = capContactScriptModel.getCapContactModel();
                var peopleModel = capContactScriptModel.getPeople();
                var thisConSeq = peopleModel.getContactSeqNumber()
                if (String(thisConSeq) == String(conSeq)) {
                    var contactAddressrs = aa.address.getContactAddressListByCapContact(capContactModel);
                    if (contactAddressrs.getSuccess()) {
                        var contactAddrScriptModelArr = contactAddressrs.getOutput();
                        logDebug("Found " + contactAddrScriptModelArr.length + " addresses");
                        var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
                        return contactAddressModelArr;
                    }
                    else {
                        logDebug("No success getting the contact addresses");
                    }
                }
            } // end for loop
        }
        else { logDebug("WARNING: no People on this CAP:" + capId); }
    }
    else { logDebug("ERROR: Failed to People: " + capContactResult.getErrorMessage()); }
    return null;
}

function convertContactAddressModelArr(contactAddressScriptModelArr){
    var contactAddressModelArr = null;
    if (contactAddressScriptModelArr != null && contactAddressScriptModelArr.length > 0) {
        contactAddressModelArr = aa.util.newArrayList();
        for (loopk in contactAddressScriptModelArr) {
            contactAddressModelArr.add(contactAddressScriptModelArr[loopk].getContactAddressModel());
        }
    }
    return contactAddressModelArr;
}

function createRefContactsFromCapContactsAndLink(pCapId, contactTypeArray, ignoreAttributeArray, replaceCapContact, overwriteRefContact, refContactExists){
    // contactTypeArray is either null (all), or an array or contact types to process
    //
    // ignoreAttributeArray is either null (none), or an array of attributes to ignore when creating a REF contact
    //
    // replaceCapContact not implemented yet
    //
    // overwriteRefContact -- if true, will refresh linked ref contact with CAP contact data
    //
    // refContactExists is a function for REF contact comparisons.
    //
    // Version 2.0 Update:   This function will now check for the presence of a standard choice "REF_CONTACT_CREATION_RULES". 
    // This setting will determine if the reference contact will be created, as well as the contact type that the reference contact will 
    // be created with.  If this setting is configured, the contactTypeArray parameter will be ignored.   The "Default" in this standard
    // choice determines the default action of all contact types.   Other types can be configured separately.   
    // Each contact type can be set to "I" (create ref as individual), "O" (create ref as organization), 
    // "F" (follow the indiv/org flag on the cap contact), "D" (Do not create a ref contact), and "U" (create ref using transaction contact type).

    var standardChoiceForBusinessRules = "REF_CONTACT_CREATION_RULES";

    var ingoreArray = new Array();
    if (arguments.length > 1) ignoreArray = arguments[1];

    var defaultContactFlag = lookup(standardChoiceForBusinessRules, "Default");
    logDebug("Getting two datasets");
    var c = aa.people.getCapContactByCapID(pCapId).getOutput();
    var cCopy = aa.people.getCapContactByCapID(pCapId).getOutput();  // must have two working datasets

    for (var i in c) {
        var ruleForRefContactType = "U"; // default behavior is create the ref contact using transaction contact type
        var con = c[i];
        logDebug("con : " + con);
        var p = con.getPeople();
        var contactFlagForType = lookup(standardChoiceForBusinessRules, p.getContactType());
        if (!defaultContactFlag && !contactFlagForType) { // standard choice not used for rules, check the array passed
            if (contactTypeArray && !exists(p.getContactType(), contactTypeArray))
                continue;  // not in the contact type list.  Move along.
        }
        if (!contactFlagForType && defaultContactFlag) { // explicit contact type not used, use the default
            ruleForRefContactType = defaultContactFlag;
        }
        if (contactFlagForType) {// explicit contact type is indicated
            ruleForRefContactType = contactFlagForType;
        }
        if (ruleForRefContactType.equals("D"))
            continue;

        var refContactType = "";
        switch (ruleForRefContactType) {
            case "LH":
                refContactType = "License Holder"; break;
            case "U":
                refContactType = p.getContactType(); break;
            case "I":
                refContactType = "Individual"; break;
            case "O":
                refContactType = "Organization"; break;
            case "F":
                if (p.getContactTypeFlag() && p.getContactTypeFlag().equals("organization"))
                    refContactType = "Organization";
                else
                    refContactType = "Individual";
                break;
        }

        var refContactNum = con.getCapContactModel().getRefContactNumber();
        capContactModel = con.getCapContactModel();

        if (refContactNum) {  // This is a reference contact.   Let's refresh or overwrite as requested in parms.
            overwriteRefContact = true;
            if (overwriteRefContact) {
                logDebug("Overwriting reference contact");
                contactAddressList = getCapContactAddressList(p.getContactSeqNumber());
                if (contactAddressList) { p.setContactAddressList(contactAddressList); }
                p.setContactSeqNumber(refContactNum);  // set the ref seq# to refresh
                p.setContactType(refContactType);
                var a = p.getAttributes();
                if (a) {
                    var ai = a.iterator();
                    while (ai.hasNext()) {
                        var xx = ai.next();
                        xx.setContactNo(refContactNum);
                    }
                }
                var r = aa.people.editPeopleWithAttribute(p, p.getAttributes());
                if (!r.getSuccess())
                    logDebug("WARNING: couldn't refresh reference people : " + r.getErrorMessage());
                else
                    logDebug("Successfully refreshed ref contact #" + refContactNum + " with CAP contact data");
            }
            if (replaceCapContact) { // To Be Implemented later.   Is there a use case?  
            }
        }
        else { // user entered the contact freehand.   Let's create or link to ref contact.
            var ccmSeq = p.getContactSeqNumber();
            logDebug("Contact seq number is " + ccmSeq);
            contactAddressList = getCapContactAddressList(ccmSeq);
            var existingContact = refContactExists(p);  // Call the custom function to see if the REF contact exists
            logDebug("existing Contact : " + existingContact);
            var p = cCopy[i].getPeople();  // get a fresh version, had to mangle the first for the search
            if (existingContact) { // we found a match with our custom function.  Use this one.
                refPeopleId = existingContact;
            }
            else { // did not find a match, let's create one
                logDebug("Creating new reference contact");
                var a = p.getAttributes();
                if (a) {
                    var ai = a.iterator();
                    while (ai.hasNext()) {
                        var xx = ai.next();
                        if (ignoreAttributeArray && exists(xx.getAttributeName().toUpperCase(), ignoreAttributeArray))
                            ai.remove();
                    }
                }
                logDebug("Setting contact type to " + refContactType);
                p.setContactType(refContactType);
                var r = aa.people.createPeopleWithAttribute(p, a);
                if (!r.getSuccess())
                { logDebug("WARNING: couldn't create reference people : " + r.getErrorMessage()); continue; }
                // createPeople is nice and updates the sequence number to the ref seq
                var p = cCopy[i].getPeople();
                var refPeopleId = p.getContactSeqNumber();
                logDebug("Successfully created reference contact #" + refPeopleId);
                // Need to link to an existing public user.
                var getUserResult = aa.publicUser.getPublicUserByEmail(con.getEmail())
                if (getUserResult.getSuccess() && getUserResult.getOutput()) {
                    var userModel = getUserResult.getOutput();
                    logDebug("createRefContactsFromCapContactsAndLink: Found an existing public user: " + userModel.getUserID());
                    if (refPeopleId) {
                        logDebug("createRefContactsFromCapContactsAndLink: Linking this public user with new reference contact : " + refPeopleId);
                        aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), refPeopleId);
                    }
                }
            }

            // now that we have the reference Id, we can link back to reference
            logDebug("Linking cap contact back to reference");
            var ccmResult = aa.people.getCapContactByPK(pCapId, ccmSeq);
            if (ccmResult.getSuccess()) {
                ccm = ccmResult.getOutput();
                ccm = ccm.getCapContactModel();
                if (contactAddressList) {
                    p = ccm.getPeople();
                    p.setContactAddressList(contactAddressList);
                    ccm.setPeople(p);
                }
                else { logDebug("contactAddressList is null"); }
                ccm.setRefContactNumber(refPeopleId);
                r = aa.people.editCapContact(ccm);
                if (!r.getSuccess())
                { logDebug("WARNING: error updating cap contact model : " + r.getErrorMessage()); }
                else
                { logDebug("Successfully linked ref contact " + refPeopleId + " to cap contact " + ccmSeq); }
            }

        }  // end if user hand entered contact 
    }  // end for each CAP contact
}

function feeTotalByStatus(feeStatus){
    var statusArray = new Array();
    if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++)
            statusArray.push(arguments[i]);
    }

    var feeTotal = 0;
    var feeResult = aa.fee.getFeeItems(capId);
    if (feeResult.getSuccess()) {
        var feeObjArr = feeResult.getOutput();
        for (ff in feeObjArr) {
            feeStatus = "" + feeObjArr[ff].getFeeitemStatus();
            if (exists(feeStatus, statusArray))
                feeTotal += feeObjArr[ff].getFee();

        }

    }
    else {
        logDebug("Error getting fee items: " + feeResult.getErrorMessage());
    }
    return feeTotal;
}

function validASI(s){
    return (s != "" && s != null)
}

function numBanners(a, b){
    var aBanner = parseFloat(a);
    var bBanner = parseFloat(b);
    logDebug(aBanner + ': ' + bBanner)
    var totalBanners = 0;
    if (aBanner != null && aBanner > 0) { totalBanners++; }
    if (aBanner != null && bBanner > 0) { totalBanners++; }

    return totalBanners;
}

function permitLimitOnAddrMet(){
    var existingRecs = getRelatedCapsByAddress("Planning/Administrative Actions/Home Occupation Permit/NA");
    return (existingRecs != null && existingRecs.length > 2)
}

function closeSubTasks(ltcapidstr){
    if (typeof (ltcapidstr) == "string") {
        var ltresult = aa.cap.getCapID(ltcapidstr);
        if (ltresult.getSuccess())
            ltCapId = ltresult.getOutput();
        else
        { logMessage("**ERROR: Failed to get cap ID: " + ltcapidstr + " error: " + ltresult.getErrorMessage()); return false; }
    }
    else
        ltCapId = ltcapidstr;

    var workflowResult = aa.workflow.getTasks(ltCapId);
    if (workflowResult.getSuccess())
        wfObj = workflowResult.getOutput();
    else
    { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }

    for (i in wfObj) {
        currTask = wfObj[i];
        var review = "";
        var desc = currTask.getTaskDescription() + "";

        switch (desc) {
            case "Planning Final":
                review = "Planning Review"; break;
            case "Engineering Permit Final":
                review = "Engineering Permit Review"; break;
            case "Fire Final":
                review = "Fire Review"; break;
            case "Environmental/Zoning Final":
                review = "Environmental/Zoning Review"; break;
            case "Engineering Plan Check Final":
                review = "Engineering Plan Check"; break;
            case "Grading Final":
                review = "Grading Review"; break;
            case "Waste Management Final":
                review = "Waste Management Plan"; break;
            case "Water Resources Final":
                review = "Water Resources Review"; break;
        }
        if (review != "") {
            var deactivatedFinalTask = false;
            for (j in wfObj) {
                revTask = wfObj[j];
                if (!deactivatedFinalTask && revTask.getTaskDescription().equals(review) && !revTask.getDisposition().equals("Conditions Required") && !revTask.getDisposition().equals("Approved with Conditions")) {
                    aa.workflow.adjustTask(ltCapId, currTask.getStepNumber(), currTask.getProcessID(), "N", "N", null, null);
                    deactivatedFinalTask = true;
                }
            }
        }
    }
}

function openCorrRevTasks(ltcapidstr){
    if (typeof (ltcapidstr) == "string") {
        var ltresult = aa.cap.getCapID(ltcapidstr);
        if (ltresult.getSuccess())
            ltCapId = ltresult.getOutput();
        else
        { logMessage("**ERROR: Failed to get cap ID: " + ltcapidstr + " error: " + ltresult.getErrorMessage()); return false; }
    }
    else
        ltCapId = ltcapidstr;

    var workflowResult = aa.workflow.getTasks(ltCapId);
    if (workflowResult.getSuccess())
        wfObj = workflowResult.getOutput();
    else
    { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
    var nReviews = 0;
    var dueDate = null;
    var assignDate = null;
    for (i in wfObj) {
        currTask = wfObj[i];
        if (currTask.getTaskDescription().equals("Application Submittal")) { assignDate = currTask.getAssignmentDate(); dueDate = currTask.getDueDate(); }

        if ((currTask.getTaskDescription().indexOf("Review") > 0 || currTask.getTaskDescription().equals("Engineering Plan Check")) && currTask.getDisposition().equals("Corrections Needed")) {
            aa.workflow.adjustTask(ltCapId, currTask.getStepNumber(), currTask.getProcessID(), "Y", "N", currTask.getAssignmentDate(), currTask.getDueDate());
            nReviews++;
        }
    }
    if (nReviews > 0) {
        aa.workflow.adjustTask(ltCapId, "Application Submittal", "N", "Y", assignDate, dueDate)
    }
}

function isNoChangeStatus(ltcapidstr, task, status){
    if (typeof (ltcapidstr) == "string") {
        var ltresult = aa.cap.getCapID(ltcapidstr);
        if (ltresult.getSuccess())
            ltCapId = ltresult.getOutput();
        else
        { logMessage("**ERROR: Failed to get cap ID: " + ltcapidstr + " error: " + ltresult.getErrorMessage()); return false; }
    }
    else
        ltCapId = ltcapidstr;

    var taskObj = aa.workflow.getTask(ltCapId, task);
    if (!taskObj.getSuccess()) { logMessage("*** Error retreiving task: " + task); return false; }
    var statusObj = aa.workflow.getTaskStatus(taskObj.getOutput(), status)
    if (!taskObj.getSuccess()) { logMessage("*** Error retreiving status: " + status); return false; }

    return (statusObj.getOutput().getResultAction().equals("U"))
}

function calcSignValuation(){
    var signTbl = loadASITable("SIGN INFORMATION")
    var val = 0;

    for (i in signTbl) {
        var area = 0;
        var multiplier = "";
        var sgnSubtype = "";
        if (signTbl[i]["Sign Subtype"].fieldValue != null) sgnSubtype = signTbl[i]["Sign Subtype"].fieldValue;
        else sgnSubtype = "*NO SUBTYPE SELECTED*";

        if (signTbl[i]["Type of Sign"].fieldValue.equals("Pole")) area = parseFloat(signTbl[i]["Sign Height (ft)"].fieldValue);
        else area = parseFloat(signTbl[i]["Sign Area (sq ft)"].fieldValue);

        multiplier = lookup("signValuationLookup", sgnSubtype)
        if (typeof multiplier === 'string' && !multiplier.equals("undefined")) { val += area * parseFloat(multiplier) }
        else logDebug("Sign Subtype - " + sgnSubtype + " not in signValuationLookup");
    }
    logDebug("New Sign Valuation: " + val.toFixed(2))
    return val.toFixed(2);
}

function editJobValue(newJobValue){
    var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput();
    if (valobj.length) {
        estValue = valobj[0].getEstimatedValue();
        calcValue = valobj[0].getCalculatedValue();
        feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
        editResult = aa.finance.editBValuatnValue(capId, valobj[0].getValuationPeriod(), newJobValue, feeFactor);
        if (editResult.getSuccess())
            logDebug("Modified job value");
        else logDebug("Error editing job value " + editResult.getErrorMessage());
    }
}

function isSubWorkflowOpen(thisProcessID){// optional capId
    var itemCap = capId;
    if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

    var workflowResult = aa.workflow.getTasks(itemCap);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
    { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }

    for (i in wfObj) {
        var fTaskSM = wfObj[i];
        if (fTaskSM.getProcessCode() == thisProcessID && isTaskActive(fTaskSM.getTaskDescription())) {
            logDebug("isSubWorkflowOpen: found an open task process code: " + thisProcessID + " , Step# " + fTaskSM.getStepNumber(), 3);
            return true;
        }
    }
    return false;
}

function assignCapIspector(assignId){// option CapId 
    var itemCap = capId
    if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

    var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
    if (!cdScriptObjResult.getSuccess())
    { logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()); return false; }

    var cdScriptObj = cdScriptObjResult.getOutput();

    if (!cdScriptObj)
    { logDebug("**ERROR: No cap detail script object"); return false; }

    cd = cdScriptObj.getCapDetailModel();

    //iNameResult  = aa.person.getUser(assignId);

    //if (!iNameResult.getSuccess())
    //{ logDebug("**ERROR retrieving  user model " + assignId + " : " + iNameResult.getErrorMessage()) ; return false ; }

    cd.setInspectorId(assignId);

    cdWrite = aa.cap.editCapDetail(cd)

    if (cdWrite.getSuccess())
    { logDebug("Assigned CAP to " + assignId); return true; }
    else
    { logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()); return false; }
}

function assignInspectorToCAP(){
    var mask = "" + capId.getCustomID().substr(0, 3);
    var useType = "" + getASIFieldValue("Type of Use");
    var workType = "" + getASIFieldValue("Type of Work");
    var gisLayer = "bad data";
    logDebug("Mask: " + mask);
    logDebug("UseType: " + useType);
    logDebug("WorkType: " + workType);
    switch (mask) {
        case "BLD":
            if (workType && workType.equals("Retaining Wall")) {
                gisLayer = "Grading Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential") && workType && workType.equals("Solar Panels")) {
                gisLayer = "Electrical Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential")) {
                gisLayer = "Building Inspection Areas- Residential";
                break;
            }
            gisLayer = "Building Inspection Areas- Commercial";
            break;
        case "ELE":
            var tempPowerPole = "" + getASIFieldValue("Temporary Power Pole");
            if (tempPowerPole && !tempPowerPole.equals("0") && !tempPowerPole.equals("null")) {
                gisLayer = "Electrical Inspection Areas";
                break;
            }
            if (useType && !useType.equals("Single Family Residential") && workType && workType.equals("Retaining Wall")) {
                logDebug("No inspector defined for a " + mask + " record with a Type of Work: Retaining Wall");
                break;
            }
            if (useType && useType.equals("Single Family Residential") && workType && workType.equals("Alteration") || workType.equals("Solar Panels") || workType.equals("Repair")) {
                gisLayer = "Electrical Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential") && workType && workType.equals("New")) {
                gisLayer = "Electrical Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential")) {
                gisLayer = "Building Inspection Areas- Residential";
                break;
            }
            gisLayer = "Electrical Inspection Areas";
            break;
        case "PLM":
            var bldSwr = parseFloat("" + getASIFieldValue("Building Sewer"));
            var swrAdd = parseFloat("" + getASIFieldValue("Sewers Added"));
            var altRepair = parseFloat("" + getASIFieldValue("Alter or Repair Existing Sewer"));
            if (bldSwr > 0 || swrAdd > 0 || altRepair > 0) {
                gisLayer = "Mechanical and Plumbing Inspection Areas";
                break;
            }
            if (useType && !useType.equals("Single Family Residential") && workType && workType.equals("Retaining Wall")) {
                logDebug("No inspector defined for a " + mask + " record with a Type of Work: Retaining Wall");
                break;
            }
            if (useType && useType.equals("Single Family Residential") && workType && workType.equals("Solar Panels")) {
                gisLayer = "Electrical Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential") && workType && workType.equals("Alteration") || workType.equals("Repair")) {
                gisLayer = "Mechanical and Plumbing Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential") && workType && workType.equals("New")) {
                gisLayer = "Mechanical and Plumbing Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential")) {
                gisLayer = "Building Inspection Areas- Residential";
                break;
            }
            gisLayer = "Mechanical and Plumbing Inspection Areas";
            break;
        case "MEC":
            if (useType && !useType.equals("Single Family Residential") && workType && workType.equals("Retaining Wall")) {
                logDebug("No inspector defined for a " + mask + " record with a Type of Work: Retaining Wall");
                break;
            }
            if (useType && useType.equals("Single Family Residential") && workType && workType.equals("Solar Panels")) {
                gisLayer = "Electrical Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential") && workType && workType.equals("Alteration") || workType.equals("Repair")) {
                gisLayer = "Mechanical and Plumbing Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential") && workType && workType.equals("New")) {
                gisLayer = "Mechanical and Plumbing Inspection Areas";
                break;
            }
            if (useType && useType.equals("Single Family Residential")) {
                gisLayer = "Building Inspection Areas- Residential";
                break;
            }
            gisLayer = "Mechanical and Plumbing Inspection Areas";
            break;
        case "GRD":
            gisLayer = "Grading Inspection Areas";
            break;
        case "UTL":
            gisLayer = "Building Inspection Areas- Residential";
            break;
        case "INS":
            logDebug("Manual inspector assignment.");
            break;
        case "SGN":
            gisLayer = "Building Inspection Areas- Commercial";
            break;
        case "CON":
            gisLayer = "Public Works Inspection Areas";
            break;
        case "REF":
            gisLayer = "Public Works Inspection Areas";
            break;
        case "FPP":
            gisLayer = "Fire Inspection Areas";
            break;
        case "FHC":
            gisLayer = "Fire Inspection Areas";
            break;
        case "FNC":
            gisLayer = "Fire Inspection Areas";
            break;
        case "TUP":
            gisLayer = "Fire Inspection Areas";
            break;
        case "COM":
//scl added the decision point 7/12/2016 for Bld/Env
            var comType = "" + getASIFieldValue("Bldg Complaint"); 
            logDebug("comType: " + comType);
            if (comType && comType.equals("Yes")) {
                gisLayer = "Grading Inspection Areas";
                break;
            }
            gisLayer = "Environmental Inspection Areas";
            break;
        default:
            logDebug("No inspector assignment rule for " + mask + " records.");
            break;
    }

    if (gisLayer.equals("bad data")) { return false; }
    logDebug("GIS Layer: " + gisLayer);
    var inspIndex = "" + getGISInfo("TORRANCE", gisLayer, "AAUserID");
    logDebug("InspIndex: " + inspIndex);
    if (inspIndex.equals("false") || inspIndex.equals("undefined")) { return false; }

    var inspector = "" + lookup("GISInspectorLookup", inspIndex);
    logDebug("Inspector: " + inspector);
    if (inspector.equals("") || inspector.equals("undefined")) { logDebug("**Inspector ID not found in GISInspectorLookup."); return false; }

    if (!assignCapIspector(inspector.toUpperCase())) { logDebug("***Assigning inspector:" + inspector + " failed") }

    return true;
}

function externalLP_CA(licNum, rlpType, doPopulateRef, doPopulateTrx, itemCap){
    /*
    Version: 3.2

    Usage:

    licNum      :  Valid CA license number.   Non-alpha, max 8 characters.  If null, function will use the LPs on the supplied CAP ID
    rlpType     :  License professional type to use when validating and creating new LPs
    doPopulateRef   :  If true, will create/refresh a reference LP of this number/type
    doPopulateTrx   :  If true, will copy create/refreshed reference LPs to the supplied Cap ID.   doPopulateRef must be true for this to work
    itemCap     :  If supplied, licenses on the CAP will be validated.  Also will be refreshed if doPopulateRef and doPopulateTrx are true

    returns: non-null string of status codes for invalid licenses

    examples:

    appsubmitbefore   (will validate the LP entered, if any, and cancel the event if the LP is inactive, cancelled, expired, etc.)
    ===============
    true ^ cslbMessage = "";
    CAELienseNumber ^ cslbMessage = externalLP_CA(CAELienseNumber,CAELienseType,false,false,null);
    cslbMessage.length > 0 ^ cancel = true ; showMessage = true ; comment(cslbMessage)

    appsubmitafter  (update all CONTRACTOR LPs on the CAP and REFERENCE with data from CSLB.  Link the CAP LPs to REFERENCE.   Pop up a message if any are inactive...)
    ==============
    true ^  cslbMessage = externalLP_CA(null,"CONTRACTOR",true,true,capId)
    cslbMessage.length > 0 ^ showMessage = true ; comment(cslbMessage);

    Note;  Custom LP Template Field Mappings can be edited in the script below
    */

    var returnMessage = "";

    var workArray = new Array();
    if (licNum)
        workArray.push(String(licNum));

    if (itemCap) {
        var capLicenseResult = aa.licenseScript.getLicenseProf(itemCap);
        if (capLicenseResult.getSuccess()) {
            var capLicenseArr = capLicenseResult.getOutput();
        }
        else
        { logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }

        if (capLicenseArr == null || !capLicenseArr.length)
        { logDebug("**WARNING: no licensed professionals on this CAP"); }
        //else
        //{
        //for (var thisLic in capLicenseArr)
        //  if (capLicenseArr[thisLic].getLicenseType() == rlpType)
        //    workArray.push(capLicenseArr[thisLic]);
        //}
    }
    else
        doPopulateTrx = false; // can't do this without a CAP;

    for (var thisLic = 0; thisLic < workArray.length; thisLic++) {
        var licNum = workArray[thisLic];
        var licObj = null;
        var isObject = false;

        if (typeof (licNum) == "object")  // is this one an object or string?
        {
            licObj = licNum;
            licNum = licObj.getLicenseNbr();
            isObject = true;
        }

        // Make the call to the California State License Board

        var document;
        var root;
        var aURLArgList = "https://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + licNum;
        var vOutObj = aa.httpClient.get(aURLArgList);
        var isError = false;
        if (vOutObj.getSuccess()) {
            var vOut = vOutObj.getOutput();
            var sr = aa.proxyInvoker.newInstance("java.io.StringBufferInputStream", new Array(vOut)).getOutput();
            var saxBuilder = aa.proxyInvoker.newInstance("org.jdom.input.SAXBuilder").getOutput();
            document = saxBuilder.build(sr);
            root = document.getRootElement();
            errorNode = root.getChild("Error");
        }
        else {
            isError = true;
        }
        if (isError) {
            logDebug("The CSLB web service is currently unavailable");
            continue;
        }
        else if (errorNode) {
            logDebug("Error for license " + licNum + " : " + errorNode.getText().replace(/\+/g, " "));
            returnMessage += "License " + licNum + " : " + errorNode.getText().replace(/\+/g, " ") + " ";
            continue;
        }

        var lpBiz = root.getChild("BusinessInfo");
        var lpStatus = root.getChild("PrimaryStatus");
        var lpClass = root.getChild("Classifications");
        var lpBonds = root.getChild("ContractorBond");
        var lpWC = root.getChild("WorkersComp");

        // Primary Status
        // 3 = expired, 10 = good, 11 = inactive, 1 = canceled.   We will ignore all but 10 and return text.
        var stas = lpStatus.getChildren();
        for (var i = 0; i < stas.size(); i++) {
            var sta = stas.get(i);

            if (sta.getAttribute("Code").getValue() != "10")
                returnMessage += "License:" + licNum + ", " + sta.getAttribute("Desc").getValue() + " ";
        }

        if (doPopulateRef)  // refresh or create a reference LP
        {
            var updating = false;

            // check to see if the licnese already exists...if not, create.

            var newLic = getRefLicenseProf(licNum)

            if (newLic) {
                updating = true;
                logDebug("Updating existing Ref Lic Prof : " + licNum);
            }
            else {
                var newLic = aa.licenseScript.createLicenseScriptModel();
            }

            if (isObject)  // update the reference LP with data from the transactional, if we have some.
            {
                if (licObj.getAddress1()) newLic.setAddress1(licObj.getAddress1());
                if (licObj.getAddress2()) newLic.setAddress2(licObj.getAddress2());
                if (licObj.getAddress3()) newLic.setAddress3(licObj.getAddress3());
                if (licObj.getAgencyCode()) newLic.setAgencyCode(licObj.getAgencyCode());
                if (licObj.getBusinessLicense()) newLic.setBusinessLicense(licObj.getBusinessLicense());
                if (licObj.getBusinessName()) newLic.setBusinessName(licObj.getBusinessName());
                if (licObj.getBusName2()) newLic.setBusinessName2(licObj.getBusName2());
                if (licObj.getCity()) newLic.setCity(licObj.getCity());
                if (licObj.getCityCode()) newLic.setCityCode(licObj.getCityCode());
                if (licObj.getContactFirstName()) newLic.setContactFirstName(licObj.getContactFirstName());
                if (licObj.getContactLastName()) newLic.setContactLastName(licObj.getContactLastName());
                if (licObj.getContactMiddleName()) newLic.setContactMiddleName(licObj.getContactMiddleName());
                if (licObj.getCountryCode()) newLic.setContryCode(licObj.getCountryCode());
                if (licObj.getEmail()) newLic.setEMailAddress(licObj.getEmail());
                if (licObj.getCountry()) newLic.setCountry(licObj.getCountry());
                if (licObj.getEinSs()) newLic.setEinSs(licObj.getEinSs());
                if (licObj.getFax()) newLic.setFax(licObj.getFax());
                if (licObj.getFaxCountryCode()) newLic.setFaxCountryCode(licObj.getFaxCountryCode());
                if (licObj.getHoldCode()) newLic.setHoldCode(licObj.getHoldCode());
                if (licObj.getHoldDesc()) newLic.setHoldDesc(licObj.getHoldDesc());
                if (licObj.getLicenseExpirDate()) newLic.setLicenseExpirationDate(licObj.getLicenseExpirDate());
                if (licObj.getLastRenewalDate()) newLic.setLicenseLastRenewalDate(licObj.getLastRenewalDate());
                if (licObj.getLicesnseOrigIssueDate()) newLic.setLicOrigIssDate(licObj.getLicesnseOrigIssueDate());
                if (licObj.getPhone1()) newLic.setPhone1(licObj.getPhone1());
                if (licObj.getPhone1CountryCode()) newLic.setPhone1CountryCode(licObj.getPhone1CountryCode());
                if (licObj.getPhone2()) newLic.setPhone2(licObj.getPhone2());
                if (licObj.getPhone2CountryCode()) newLic.setPhone2CountryCode(licObj.getPhone2CountryCode());
                if (licObj.getSelfIns()) newLic.setSelfIns(licObj.getSelfIns());
                if (licObj.getState()) newLic.setState(licObj.getState());
                if (licObj.getSuffixName()) newLic.setSuffixName(licObj.getSuffixName());
                if (licObj.getZip()) newLic.setZip(licObj.getZip());
            }

            // Now set data from the CSLB

            if (lpBiz.getChild("Name").getText() != "") newLic.setBusinessName(unescape(lpBiz.getChild("Name").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("Addr1").getText() != "") newLic.setAddress1(unescape(lpBiz.getChild("Addr1").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("Addr2").getText() != "") newLic.setAddress2(unescape(lpBiz.getChild("Addr2").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("City").getText() != "") newLic.setCity(unescape(lpBiz.getChild("City").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("State").getText() != "") newLic.setState(unescape(lpBiz.getChild("State").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("Zip").getText() != "") newLic.setZip(unescape(lpBiz.getChild("Zip").getText()).replace(/\+/g, " "));
            if (lpBiz.getChild("BusinessPhoneNum").getText() != "") newLic.setPhone1(unescape(stripNN(lpBiz.getChild("BusinessPhoneNum").getText()).replace(/\+/g, " ")));
            newLic.setAgencyCode(aa.getServiceProviderCode());
            newLic.setAuditDate(sysDate);
            newLic.setAuditID(currentUserID);
            newLic.setAuditStatus("A");
            newLic.setLicenseType(rlpType);
            newLic.setLicState("CA");  // hardcode CA
            newLic.setStateLicense(licNum);

            if (lpBiz.getChild("IssueDt").getText()) newLic.setLicenseIssueDate(aa.date.parseDate(lpBiz.getChild("IssueDt").getText()));
            if (lpBiz.getChild("ExpireDt").getText()) newLic.setLicenseExpirationDate(aa.date.parseDate(lpBiz.getChild("ExpireDt").getText()));
            if (lpBiz.getChild("ReissueDt").getText()) newLic.setLicenseLastRenewalDate(aa.date.parseDate(lpBiz.getChild("ReissueDt").getText()));

            var wcs = root.getChild("WorkersComp").getChildren();

            for (var j = 0; j < wcs.size(); j++) {
                wc = wcs.get(j);

                if (wc.getAttribute("PolicyNo").getValue()) newLic.setWcPolicyNo(wc.getAttribute("PolicyNo").getValue());
                if (wc.getAttribute("InsCoCde").getValue()) newLic.setWcInsCoCode(unescape(wc.getAttribute("InsCoCde").getValue()));
                if (wc.getAttribute("WCEffDt").getValue()) newLic.setWcEffDate(aa.date.parseDate(wc.getAttribute("WCEffDt").getValue()))
                if (wc.getAttribute("WCExpDt").getValue()) newLic.setWcExpDate(aa.date.parseDate(wc.getAttribute("WCExpDt").getValue()))
                if (wc.getAttribute("WCCancDt").getValue()) newLic.setWcCancDate(aa.date.parseDate(wc.getAttribute("WCCancDt").getValue()))
                if (wc.getAttribute("Exempt").getValue() == "E") newLic.setWcExempt("Y"); else newLic.setWcExempt("N");

                break; // only use first
            }

            //
            // Do the refresh/create and get the sequence number
            //
            if (updating) {
                var myResult = aa.licenseScript.editRefLicenseProf(newLic);
                var licSeqNbr = newLic.getLicSeqNbr();
            }
            else {
                var myResult = aa.licenseScript.createRefLicenseProf(newLic);

                if (!myResult.getSuccess()) {
                    logDebug("**WARNING: can't create ref lic prof: " + myResult.getErrorMessage());
                    continue;
                }

                var licSeqNbr = myResult.getOutput()
            }

            logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " Sequence Number " + licSeqNbr);

            /////
            /////  Attribute Data -- first copy from the transactional LP if it exists
            /////


            if (isObject)  // update the reference LP with attributes from the transactional, if we have some.
            {
                var attrArray = licObj.getAttributes();

                if (attrArray) {
                    for (var k in attrArray) {
                        var attr = attrArray[k];
                        editRefLicProfAttribute(licNum, attr.getAttributeName(), attr.getAttributeValue());
                    }
                }
            }

            /////
            /////  Attribute Data
            /////
            /////  NOTE!  Agencies may have to configure template data below based on their configuration.  Please note all edits
            /////

            var cbs = root.getChild("Classifications").getChildren();
            for (var m = 0; m < cbs.size(); m++) {
                cb = cbs.get(m);

                if (m == 0) {
                    editRefLicProfAttribute(licNum, "CLASS CODE 1", cb.getAttribute("Code").getValue());
                    editRefLicProfAttribute(licNum, "CLASS DESC 1", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
                }

                if (m == 1) {
                    editRefLicProfAttribute(licNum, "CLASS CODE 2", cb.getAttribute("Code").getValue());
                    editRefLicProfAttribute(licNum, "CLASS DESC 2", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
                }
                if (m == 2) {
                    editRefLicProfAttribute(licNum, "CLASS CODE 3", cb.getAttribute("Code").getValue());
                    editRefLicProfAttribute(licNum, "CLASS DESC 3", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
                }

                if (m == 3) {
                    editRefLicProfAttribute(licNum, "CLASS CODE 4", cb.getAttribute("Code").getValue());
                    editRefLicProfAttribute(licNum, "CLASS DESC 4", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
                }
            }

            // dlh add in Status

            var stas = lpStatus.getChildren();
            for (var i = 0; i < stas.size(); i++) {
                var sta = stas.get(i);

                if (sta.getAttribute("Desc").getValue()) editRefLicProfAttribute(licNum, "STATUS", unescape(sta.getAttribute("Desc").getValue()));

                break; // only use first
            }

            //  do this again for WC  

            var wcs = root.getChild("WorkersComp").getChildren();
            for (var j = 0; j < wcs.size(); j++) {
                wc = wcs.get(j);

                if (wc.getAttribute("PolicyNo").getValue()) editRefLicProfAttribute(licNum, "WC POLICY NO", unescape(wc.getAttribute("PolicyNo").getValue()));

                if (wc.getAttribute("InsCoCde").getValue()) editRefLicProfAttribute(licNum, "WC CO CODE", unescape(wc.getAttribute("InsCoCde").getValue()));

                if (wc.getAttribute("InsCoName").getValue()) editRefLicProfAttribute(licNum, "WC CO NAME", unescape(wc.getAttribute("InsCoName").getValue()).replace(/\+/g, " "));

                if (wc.getAttribute("WCEffDt").getValue()) editRefLicProfAttribute(licNum, "WC EFF DATE", unescape(wc.getAttribute("WCEffDt").getValue()));

                if (wc.getAttribute("WCExpDt").getValue()) editRefLicProfAttribute(licNum, "WC EXP DATE", unescape(wc.getAttribute("WCExpDt").getValue()));

                if (wc.getAttribute("WCCancDt").getValue()) editRefLicProfAttribute(licNum, "WC CAN DATE", unescape(wc.getAttribute("WCCancDt").getValue()));

                if (wc.getAttribute("Exempt").getValue() == "E")
                    editRefLicProfAttribute(licNum, "WC EXEMPT", "Y");
                else
                    editRefLicProfAttribute(licNum, "WC EXEMPT", "N");

                break; // only use first
            }

            // end dlh change update attribute WC data 

            var bos = root.getChild("ContractorBond").getChildren();

            for (var n = 0; n < bos.size(); n++) {
                var bo = bos.get(n);
                if (bo.getAttribute("BondAmt").getValue()) editRefLicProfAttribute(licNum, "BOND AMOUNT", unescape(bo.getAttribute("BondAmt").getValue()));
                if (bo.getAttribute("BondCancDt").getValue()) editRefLicProfAttribute(licNum, "BOND EXPIRATION", unescape(bo.getAttribute("BondCancDt").getValue()));

                // Currently unused but could be loaded into custom attributes.
                if (bo.getAttribute("SuretyTp").getValue()) editRefLicProfAttribute(licNum, "BOND SURETYP", unescape(bo.getAttribute("SuretyTp").getValue()));

                if (bo.getAttribute("InsCoCde").getValue()) editRefLicProfAttribute(licNum, "BOND INSOCDE", unescape(bo.getAttribute("InsCoCde").getValue()).replace(/\+/g, " "));

                if (bo.getAttribute("InsCoName").getValue()) editRefLicProfAttribute(licNum, "BOND ICONAME", unescape(bo.getAttribute("InsCoName").getValue()).replace(/\+/g, " "));

                if (bo.getAttribute("BondNo").getValue()) editRefLicProfAttribute(licNum, "BOND NO", unescape(bo.getAttribute("BondNo").getValue()));

                if (bo.getAttribute("BondEffDt").getValue()) editRefLicProfAttribute(licNum, "BOND EFFDATE", unescape(bo.getAttribute("BondEffDt").getValue()));

                /*
                aa.print("Bond Surety Type       : " + unescape(bo.getAttribute("SuretyTp").getValue()))
                aa.print("Bond Code              : " + unescape(bo.getAttribute("InsCoCde").getValue()))
                aa.print("Bond Insurance Company : " + unescape(bo.getAttribute("InsCoName").getValue()).replace(/\+/g," "))
                aa.print("Bond Number            : " + unescape(bo.getAttribute("BondNo").getValue()))
                aa.print("Bond Amount            : " + unescape(bo.getAttribute("BondAmt").getValue()))
                aa.print("Bond Effective Date    : " + unescape(bo.getAttribute("BondEffDt").getValue()))
                aa.print("Bond Cancel Date       : " + unescape(bo.getAttribute("BondCancDt").getValue()))
                */
                break; // only use first bond
            }

            if (doPopulateTrx) {
                var lpsmResult = aa.licenseScript.getRefLicenseProfBySeqNbr(servProvCode, licSeqNbr)
                if (!lpsmResult.getSuccess())
                { logDebug("**WARNING error retrieving the LP just created " + lpsmResult.getErrorMessage()); }

                var lpsm = lpsmResult.getOutput();

                // Remove from CAP

                var isPrimary = false;

                for (var currLic in capLicenseArr) {
                    var thisLP = capLicenseArr[currLic];
                    if (thisLP.getLicenseType() == rlpType && thisLP.getLicenseNbr() == licNum) {
                        logDebug("Removing license: " + thisLP.getLicenseNbr() + " from CAP.  We will link the new reference LP");
                        if (thisLP.getPrintFlag() == "Y") {
                            logDebug("...remove primary status...");
                            isPrimary = true;
                            thisLP.setPrintFlag("N");
                            aa.licenseProfessional.editLicensedProfessional(thisLP);
                        }
                        var remCapResult = aa.licenseProfessional.removeLicensedProfessional(thisLP);
                        if (capLicenseResult.getSuccess()) {
                            logDebug("...Success.");
                        }
                        else
                        { logDebug("**WARNING removing lic prof: " + remCapResult.getErrorMessage()); }
                    }
                }

                // add the LP to the CAP
                var asCapResult = aa.licenseScript.associateLpWithCap(itemCap, lpsm)
                if (!asCapResult.getSuccess())
                { logDebug("**WARNING error associating CAP to LP: " + asCapResult.getErrorMessage()) }
                else
                { logDebug("Associated the CAP to the new LP") }

                // Now make the LP primary again
                if (isPrimary) {
                    var capLps = getLicenseProfessional(itemCap);

                    for (var thisCapLpNum in capLps) {
                        if (capLps[thisCapLpNum].getLicenseNbr().equals(licNum)) {
                            var thisCapLp = capLps[thisCapLpNum];
                            thisCapLp.setPrintFlag("Y");
                            aa.licenseProfessional.editLicensedProfessional(thisCapLp);
                            logDebug("Updated primary flag on Cap LP : " + licNum);

                            // adding this return will cause the test script to work without error, even though this is the last statement executed
                            //if (returnMessage.length > 0) return returnMessage;
                            //else return null;

                        }
                    }
                }
            } // do populate on the CAP
        } // do populate on the REF
    } // for each license

    if (returnMessage.length > 0) return returnMessage;
    else return null;
}

function getLPLicNum(pCapId){
    //Function find licensed professionals number
    var newLicNum = null;
    var licProf = aa.licenseProfessional.getLicensedProfessionalsByCapID(pCapId).getOutput();
    if (licProf != null)
        for (x in licProf) {
            newLicNum = licProf[x].getLicenseNbr();
            // logDebug("Found " + licProf[x].getLicenseNbr());
            return newLicNum;
        }
    else
    // logDebug("No licensed professional on source");
        return null;
}

function autoAssignInpectionsToCAPInspector(iName){
    if ((iName + "").length <= 0) { logDebug("No inspector on record"); return false; }
    var itemCap = capId;
    var inspResultObj = aa.inspection.getInspections(itemCap);
    if (inspResultObj.getSuccess()) {
        var inspList = inspResultObj.getOutput();
        for (xx in inspList) {
            logDebug("Inspection: " + inspList[xx].getIdNumber() + " Inspector: " + inspList[xx].getInspector().getUserID())

            if (!inspList[xx].getInspector().getUserID()) {
                assignInspection(parseInt(inspList[xx].getIdNumber()), iName);
            }
            if (inspList[xx].getInspector().getUserID() == "SELECTRONIVR") {
                assignInspection(parseInt(inspList[xx].getIdNumber()), iName);
            }
        }
    }
    return true;
    logDubug("***** could not get insp List [autoAssignInspectors()] ****")
    return false;
}

function assignInspection(iNumber, iName){
    // optional capId
    // updates the inspection and assigns to a new user
    // requires the inspection id and the user name
    // V2 8/3/2011.  If user name not found, looks for the department instead
    //

    var itemCap = capId
    if (arguments.length > 2)
        itemCap = arguments[2]; // use cap ID specified in args

    iObjResult = aa.inspection.getInspection(itemCap, iNumber);
    if (!iObjResult.getSuccess())
    { logDebug("**WARNING retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage()); return false; }

    iObj = iObjResult.getOutput();

    iInspector = aa.person.getUser(iName).getOutput();

    if (!iInspector) // must be a department name?
    {
        var dpt = aa.people.getDepartmentList(null).getOutput();
        for (var thisdpt in dpt) {
            var m = dpt[thisdpt]
            if (iName.equals(m.getDeptName())) {
                iNameResult = aa.person.getUser(null, null, null, null, m.getAgencyCode(), m.getBureauCode(), m.getDivisionCode(), m.getSectionCode(), m.getGroupCode(), m.getOfficeCode());

                if (!iNameResult.getSuccess())
                { logDebug("**WARNING retrieving department user model " + iName + " : " + iNameResult.getErrorMessage()); return false; }

                iInspector = iNameResult.getOutput();
            }
        }
    }

    if (!iInspector)
    { logDebug("**WARNING could not find inspector or department: " + iName + ", no assignment was made"); return false; }
    logDebug("assigning inspection " + iNumber + " to " + iName);

    iObj.setInspector(iInspector);

    aa.inspection.editInspection(iObj)
}

/*  add removeZeroFee:  here is the function to remove all zero fees from a 
record. I do not remember the payment period you are using but this function 
would need to be modified if you are using something other than "FINAL". 
"FINAL" and "STANDARD" are the two most common values.*/

function removeZeroFees(){
    var feeArr = loadFees();
    for (x in feeArr) {
        thisFee = feeArr[x];
        if (thisFee.status == "NEW" && thisFee.amount == 0) {
            removeFee(thisFee.code, "STANDARD");
        }
    }
}

function createPublicUserFromContact(){// optional: Contact Type, default Applicant
    // added 20141126 per Accela Support on 14acc-12056 to correct bug in Master Script
    var contactType = "Applicant";
    var contact;
    var refContactNum;
    var userModel;
    if (arguments.length > 0) contactType = arguments[0]; // use contact type specified

    var capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
        var Contacts = capContactResult.getOutput();
        for (yy in Contacts) {
            if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
                contact = Contacts[yy];
        }
    }
    if (!contact)
    { logDebug("Couldn't create public user for " + contactType + ", no such contact"); return false; }

    if (!contact.getEmail())
    { logDebug("Couldn't create public user for " + contactType + ", no email address"); return false; }

    if (!contact.getPeople() && ("organization").equals(contact.getPeople().getContactTypeFlag()))
    { logDebug("Couldn't create public user for " + contactType + ", the contact is an organization"); return false; }

    // get the reference contact ID.   We will use to connect to the new public user
    refContactNum = contact.getCapContactModel().getRefContactNumber();

    // check to see if public user exists already based on email address
    var getUserResult = aa.publicUser.getPublicUserByEmail(contact.getEmail())
    if (getUserResult.getSuccess() && getUserResult.getOutput()) {
        userModel = getUserResult.getOutput();
        logDebug("CreatePublicUserFromContact: Found an existing public user: " + userModel.getUserID());
    }

    if (!userModel) // create one
    {
        logDebug("CreatePublicUserFromContact: creating new user based on email address: " + contact.getEmail());
        var publicUser = aa.publicUser.getPublicUserModel();
        publicUser.setFirstName(contact.getFirstName());
        publicUser.setLastName(contact.getLastName());
        publicUser.setEmail(contact.getEmail());
        publicUser.setUserID(contact.getEmail());
        publicUser.setPassword("e8248cbe79a288ffec75d7300ad2e07172f487f6"); //password : 1111111111
        publicUser.setAuditID("PublicUser");
        publicUser.setAuditStatus("A");
        publicUser.setCellPhone(contact.getCapContactModel().getPeople().getPhone2());

        var result = aa.publicUser.createPublicUser(publicUser);
        if (result.getSuccess()) {

            logDebug("Created public user " + contact.getEmail() + "  sucessfully.");
            var userSeqNum = result.getOutput();
            var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()

            // create for agency
            aa.publicUser.createPublicUserForAgency(userModel);

            // activate for agency
            var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
            userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(servProvCode, userSeqNum, "ADMIN");
            // reset password
            var resetPasswordResult = aa.publicUser.resetPassword(contact.getEmail());
            if (resetPasswordResult.getSuccess()) {
                var resetPassword = resetPasswordResult.getOutput();
                userModel.setPassword(resetPassword);
                logDebug("Reset password for " + contact.getEmail() + "  sucessfully.");
            } else {
                logDebug("**ERROR: Reset password for  " + contact.getEmail() + "  failure:" + resetPasswordResult.getErrorMessage());
            }
            // send Activate email
            aa.publicUser.sendActivateEmail(userModel, true, true);
            // send another email
            aa.publicUser.sendPasswordEmail(userModel);
        }
        else {
            logDebug("**Warning creating public user " + contact.getEmail() + "  failure: " + result.getErrorMessage()); return null;
        }
    }
    //  Now that we have a public user let's connect to the reference contact   
    if (refContactNum) {
        logDebug("CreatePublicUserFromContact: Linking this public user with reference contact : " + refContactNum);
        aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), refContactNum);
    }
    return userModel; // send back the new or existing public user
}

function updateASIFromAsset(attrField, asiField){//attrField: field name of attribute to get value from, asiField: field name of ASI field to update.
    var attrValueArray = [];
    var attrArrayLocation = [];
    assetObj = aa.asset.getAssetListByWorkOrder(capId, null);
    if(assetObj.getSuccess()){
        assetList = assetObj.getOutput();
        for(a in assetList){
            thisAssetMaster = assetList[a].getAssetDataModel().getAssetMaster();
            attrObj = aa.asset.getAssetData(thisAssetMaster.getG1AssetSequenceNumber());
            dataList = attrObj.getSuccess() ? attrObj.getOutput().getDataAttributes().toArray() : null;
            if(dataList != null){
                logDebug("List of Attributes and Values:")
                for(d in dataList){
                    logDebug("   "+dataList[d].getG1AttributeName()+": "+dataList[d].getG1AttributeValue());
                    // var attrName = dataList[d].getG1AttributeName();
                    // if(attrName == attrField){
                    if(attrField == dataList[d].getG1AttributeName()){
                        // var attrValue = dataList[d].getG1AttributeValue();
                        // attrValueArray.push(attrValue);
                        attrValueArray.push(dataList[d].getG1AttributeValue());
                    }
                }
            }
        }
        editAppSpecific(asiField, attrValueArray[0]);
        logDebug("***SUCCESS***");
    }
    else{logDebug("**ERROR: Could not get asset list")};
}

function updateAssetFromASI(attrField, asiField){//attrField: field name of attribute to get value from, asiField: field name of ASI field to update.
  var asiFieldValue = getAppSpecific(asiField);
  logDebug(asiFieldValue);
  assetObj = aa.asset.getAssetListByWorkOrder(capId, null);
  if(assetObj.getSuccess()){
    assetList = assetObj.getOutput();
    for(a in assetList){
      thisAsset = assetList[a].getAssetDataModel();
      thisAssetMaster = thisAsset.getAssetMaster();
      attrObj = aa.asset.getAssetData(thisAssetMaster.getG1AssetSequenceNumber());
      dataList = attrObj.getSuccess() ? attrObj.getOutput().getDataAttributes() : null;
      if(dataList != null){
        for(d=0;d<dataList.size();d++){
          thisAttrib = dataList.get(d);
          logDebug("   Existing data:"+thisAttrib.getG1AttributeName()+": "+thisAttrib.getG1AttributeValue());
          if(attrField == thisAttrib.getG1AttributeName()){
            thisAttrib.setG1AttributeValue(asiFieldValue);
            logDebug("   The asset: "+attrObj+" Has new data:"+thisAttrib.getG1AttributeName()+": "+thisAttrib.getG1AttributeValue());
          }
        }
      }
      thisAsset.setDataAttributes(dataList);
      logDebug("Updating Asset Data List: " + aa.asset.editAsset(thisAsset).getSuccess());
    }
  }
  else{
    logDebug("**ERROR: Could not get asset list");
  }
}

function addConditionalAssessmentsForPlaygrounds(){
	var assetObj = aa.asset.getAssetListByWorkOrder(capId, null), 
		assetList, thisAsset, thisAssetMaster, thisAssetType, attrObj, dataList, thisAttrib, woParkAssets = [], servProvCode = aa.getServiceProviderCode();
	
	// get park asset ID on Work Order
	if (assetObj.getSuccess()){
		assetList = assetObj.getOutput();
		
		for (a in assetList){
			thisAsset = assetList[a].getAssetDataModel();
			thisAssetMaster = thisAsset.getAssetMaster();

			if (thisAssetMaster.getG1AssetGroup() == 'Parks' && thisAssetMaster.getG1AssetType() == 'Park') {
				// store park id 
				woParkAssets.push(thisAssetMaster.getG1AssetGroup() + "/" + thisAssetMaster.getG1AssetType() + "/" + thisAssetMaster.getG1AssetID());
				logDebug(woParkAssets[0]);
			}
		}
	}
	
	// query all playground assets
	var playGroundAssetSeqNbrs = [];
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();
	var selectString = "select * from gasset_master where serv_prov_code = ? and g1_asset_type = ?"; 
	var sStmt = conn.prepareStatement(selectString);
	sStmt.setString(1, servProvCode);
	sStmt.setString(2, 'Playground');
	var rSet = sStmt.executeQuery();

	while (rSet.next()) {
		playGroundAssetSeqNbrs.push( rSet.getLong('G1_ASSET_SEQ_NBR'));
	}
	sStmt.close();
	conn.close();
	
	// loop through playground assets and get parents
	for (var i=0; i<playGroundAssetSeqNbrs.length; i++){
		var playgroundAsset = aa.asset.getAssetData(playGroundAssetSeqNbrs[i]);
		if (playgroundAsset.getSuccess()){
			var playgroundAssetMaster = playgroundAsset.getOutput().getAssetDataModel().getAssetMaster();
			var playGroundParent = playgroundAssetMaster.getParentAsset();
			if (playGroundParent != null){
				var parkAssetID = null;
				for (var j=0; j<woParkAssets.length; j++){
					if (playGroundParent.localeCompare(woParkAssets[j]) == 0) {
						parkAssetID = woParkAssets[j];
						break;
					}					
				} 
				
				// see if parent match found
				if (parkAssetID == null)
					continue;
				else
					logDebug(parkAssetID + ' found');
				
				// create asset condition assessment
				var assetCAModel = aa.proxyInvoker.newInstance("com.accela.ams.conditionassessment.AssetConditionAssessmentModel").getOutput();
				var nowDate = aa.util.now();
				var pDate = aa.date.getCurrentDate()
				var hour = pDate.getHourOfDay();
				if (hour > 12)
				{
				 hour -= 12;
				}
				if (hour < 10)
				{
				 hour = "0" + hour;
				}
				var min = pDate.getMinute();
				if (min < 10)
				{
				 min = "0" + min;
				}
				var nowTime = hour + ":" + min;
				
				logDebug('playground has parent asset: ' + playGroundParent);
				logDebug('create CA for playground asset');
				
				assetCAModel.setServProvCode(servProvCode);
				assetCAModel.setConditionAssessment("PARK PLAYGROUND ASSESSMENT");
				assetCAModel.setRecDate(nowDate);
				assetCAModel.setRecFulName("ADMIN");
				assetCAModel.setRecStatus("A");
				assetCAModel.setAssetSeq(playgroundAssetMaster.getG1AssetSequenceNumber());
				assetCAModel.setAssetID(playgroundAssetMaster.getG1AssetID());
				assetCAModel.setAssetType(playgroundAssetMaster.getG1AssetType());
				assetCAModel.setAssetGroup(playgroundAssetMaster.getG1AssetGroup());
				// assetCAModel.setClassType(playgroundAssetMaster.getG1ClassType());
				// assetCAModel.setComments("Automatically created by system.");
				assetCAModel.setScheduledDate(nowDate);// check for required info
				assetCAModel.setScheduledTime(nowTime);// check for required info
				assetCAModel.setStatus("Scheduled");
				
				var capAssigedUserId = getAssignedStaff();//get workorder assigned to staff and pass userid in below
				var systemUserObj = aa.person.getUser(capAssigedUserId);
				if (systemUserObj.getSuccess())
				{
					assetCAModel.setInspector(systemUserObj.getOutput());
				}
				// set department 
				// var assetCAAttributeModel = aa.proxyInvoker.newInstance("com.accela.ams.conditionassessment.AssetCAAttributeModel").getOutput();
				// assetCAAttributeModel.setAssetCAID(assetCAModel.getAssetCAID());
				// assetCAAttributeModel.setRecDate(nowDate);
				// assetCAAttributeModel.setRecStatus("A");
				// assetCAAttributeModel.setRecFulName("ADMIN");
				// assetCAAttributeModel.setServProvCode(servProvCode);
				// assetCAAttributeModel.setAttributeName("Department");
				// assetCAAttributeModel.setAttributeValue("Parks");
				// var assetCAAttributeList = aa.util.newArrayList();
				// assetCAAttributeList.add(assetCAAttributeModel);
				// assetCAModel.setCAAttributes(assetCAAttributeList);

				var assetCAModelResult = aa.assetCA.createAssetCA(assetCAModel);
				if(assetCAModelResult.getSuccess())
				{
					logDebug('created asset CA');
					assetCAModel.setAssetCAID(assetCAModelResult.getOutput());
				} else {
					logDebug('failed to create asset CA: ' + assetCAModelResult.getErrorType() + ' ' + assetCAModelResult.getErrorMessage());
				}
				
				// attach the CA to the asset
				var assetCAWorkOrderModel = aa.proxyInvoker.newInstance("com.accela.ams.conditionassessment.AssetCAWorkOrderModel").getOutput();
				assetCAWorkOrderModel.setCapID(capId);
				assetCAWorkOrderModel.setRecDate(nowDate);
				assetCAWorkOrderModel.setRecStatus("A");
				assetCAWorkOrderModel.setRecFulName("ADMIN");
				assetCAWorkOrderModel.setServProvCode(servProvCode);
				assetCAWorkOrderModel.setAssetCAID(assetCAModel.getAssetCAID());
				assetCAWorkOrderModel.setCapID1(capId.getID1());
				assetCAWorkOrderModel.setCapID2(capId.getID2());
				assetCAWorkOrderModel.setCapID3(capId.getID3());
				var workOrderAssetCAModel = aa.assetCA.createAssetCAWorkOrder(assetCAWorkOrderModel);
				if (workOrderAssetCAModel.getSuccess()) {
					logDebug('attached assessment to WO');
				} else {
					logDebug('unable to attach assessment to WO: ' + workOrderAssetCAModel.getErrorMessage());
				}
			} else {
				logDebug('playground does not have parent');
			}
		}
	}
}

function verifyDrawingAttachedToWO() {
	return verifyAttachmentWithWO("As-Built");
}

function verifyContractorFormAttachedToWO(){
	return verifyAttachmentWithWO("Contractor Form");
}

function verifyAttachmentWithWO(docCategory){
	logDebug("verifying attached: " + docCategory);
	logDebug("capId: " + capId);
	logDebug("currentUserId: " + currentUserID);

	var docListResult, docList, foundFlag = false;
	
	docListResult = aa.document.getCapDocumentList(capId, currentUserID);
	if	(docListResult.getSuccess()){
		docList = docListResult.getOutput();
		
		if (docList != null) {
			// look for drawing in doc list
			for (var i=0; i<docList.length; i++){
				var doc = docList[i];
				if (doc.getDocCategory() === docCategory){
					foundFlag = true;
					break;
				}
			}
		}
		
		// cancel transaction if no docList or no drawings attached
		if (!foundFlag) {
			logDebug(docCategory + " attachment not found.");
		}
		
		return true;
	} else {
		// documents not found
		logDebug('Failed to get documents for capID ' + capId);
		logDebug(docListResult.getErrorType() + ': ' + docListResult.getErrorMessage());
	}
	
	return foundFlag;
}

function autoCreateWOForServiceRequest() {
	logDebug("Service request type: " + appTypeArray[1]);
	var woRecType, group = "", type = "", subtype = "", category = "", appName = capName, 		fullRecordName = "", lookupValueArr, requestCategory;
	
	// lookup SR type and evaluate any ASI criteria to determine WO
	// lookupValueArr = ( "" + lookup("ServRequest_to_WorkOrder", appTypeString) ).split("^");
        // if (eval(lookupValueArr[0])) {
		// woRecType = lookupValueArr[1].trim().split("/");
	// }
	requestCategory = "" + getAppSpecific("Request Category");
	woRecType = lookup("ServRequest_to_WorkOrder", appTypeString + "_" + requestCategory);
	
	// if nothing is found, try just the appTypeString
	if (!woRecType)
		woRecType = lookup("ServRequest_to_WorkOrder", appTypeString);
	
	if (!woRecType){
		logDebug( "Could not find a valid Workorder Record Type defined for " + appTypeString + " and Request Category = " + requestCategory );
		return false;
	}
	
	woRecType = woRecType.trim().split("/");
	// determine appropriate WO app to create
	//woRecType = ( "" + lookup("ServRequest_to_WorkOrder", key) ).split("/");
	// if (woRecType.length != 4) {
		// if (appMatch("ServiceRequest/Fire Hazard/NA/NA")){
			// var hazardType = getAppSpecific("Hazard Type");
			// if (hazardType === "FHC") {
				// woRecType = ("Fire/Complaints/Fire Hazard/NA").split("/");
			// } else if (hazardType === "FNC") {
				// woRecType = ("Fire/Complaints/NPDES/NA").split("/");
			// }
		// } else if (appMatch("ServiceRequest/Parking/Vehicle Issue/NA")){
			// var reqCategory = getAppSpecific("Request Category");
			// if (reqCategory === "On Property"){
				// woRecType = ("Enforcement/COM - Complaint/NA/NA").split("/");
			// }
		// } else {
			// logDebug( "Could not find a valid Workorder Record Type defined for " + appTypeString );
		// }		
	// }  
	
	group = woRecType[0];
	type = woRecType[1];
	subtype = woRecType[2];
	category = woRecType[3];
	
	fullRecordName = woRecType[0] + "/" + woRecType[1] + "/" + woRecType[2] + "/" + woRecType[3] + ": " + appName;
	
	if (!!group && !!type && !!subtype && !!category) {
		var woCapId = createChild(group, type, subtype, category, appName, capId);
		if (!!woCapId){
			logDebug("New WO record created: " + fullRecordName);
			copyAppSpecific(woCapId);
			aa.cap.copyCapDetailInfo(capId, woCapId);
			aa.cap.copyCapWorkDesInfo(capId, woCapId);
			var woCap = aa.cap.getCap(woCapId).getOutput();
			var srCap = aa.cap.getCap(capId).getOutput();
			aa.cap.copyComments(srCap, woCap);
			aa.cap.copyOwner(srCap, woCap);
			aa.asset.cloneAssets(srCap.getCapModel(), woCapId);
			return true;
		} 
	} 
	
	logDebug("Unable to create WO for " + appTypeString);
	return false;
}

function createWorkorderForCA(assetCAPK) {
	var assetCARequest = aa.assetCA.getAssetCAByPK(assetCAPK.getAssetCAID());
	if (assetCARequest.getSuccess()){
		var assetCA = assetCARequest.getOutput();
		
		// verify assessment completed
		// logDebug("Status: " + assetCA.getStatus());
		if (assetCA.getAssetGroup() == "Parks" && assetCA.getAssetType() == "Playground" && assetCA.getStatus() == "Completed"){
			// query CA attributes
			var caAttributes = {};
			var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
			var ds = initialContext.lookup("java:/AA");
			var conn = ds.getConnection();
			var selectString = "select ATTRIBUTE_NAME, ATTRIBUTE_VALUE from GASSET_CA_ATTR where SERV_PROV_CODE = ? and CONDITION_ASSESSMENT_ID = ?"; 
			var sStmt = conn.prepareStatement(selectString);
			sStmt.setString(1, servProvCode);
			sStmt.setLong(2, assetCAPK.getAssetCAID());
			var rSet = sStmt.executeQuery();

			while (rSet.next()) {
				caAttributes[rSet.getString('ATTRIBUTE_NAME')] = rSet.getString('ATTRIBUTE_VALUE');
			}
			sStmt.close();
			conn.close();
			
			var desc = "";
			logDebug("Attributes:");
			for (key in caAttributes) {
				if (caAttributes[key] == 'Fail'){
					logDebug("	" + key + ": " + caAttributes[key]);
					desc += key + ": " + caAttributes[key] + ", ";
				}
			}
			
			// create playground repair workorder
			var woCapId = createCap("AMS/Parks/Playground/Repair", "Playground Repair: " + assetCA.getAssetID());
			logDebug("CapId: " + woCapId);
			updateWorkDesc(desc, woCapId);
			logDebug("Work order created and description set.");
			
			// get playground asset
			var assetRequest = aa.asset.getAssetData(assetCA.getAssetSeq());
			if (assetRequest.getSuccess()){
				var asset = assetRequest.getOutput();
				if (asset != null) {
					// attach playground asset
					var woAssetModelRequest = aa.proxyInvoker.newInstance("com.accela.ams.workorder.WorkOrderAssetModel");
					if (woAssetModelRequest.getSuccess()){
						woAssetModel = woAssetModelRequest.getOutput();
						woAssetModel.setAssetPK(asset.getAssetPK());
						woAssetModel.setCapID(woCapId);
						aa.asset.createWorkOrderAsset(woAssetModel);
						logDebug("Asset attached to work order");
					} else {
						logDebug("Error: " + woAssetModelRequest.getErrorType() + " " + woAssetModelRequest.getErrorMessage());
					}
				}
			}
		}
	} else {
		logDebug("Error: " + assetCARequest.getErrorMessage());
	}
}

// function assignStaffDeptToCAP() {
	// //logDebug("Debugging assignStaffDeptToServiceRequest()...");
	// try {
		// var appTypeArray = appTypeString.split('/'), gisLayerName = "";
		// if (appMatch("ServiceRequest/Street Tree/NA/NA")) 
			// gisLayerName = "Streetscape Assignment Areas";
		// if (appMatch("ServiceRequest/Park Condition/NA/NA") || appMatch("AMS/Parks/*/*")){
			// gisLayerName = "Park Assignment Areas";
			// // check that GIS objects are attached
			// var gisResult = aa.gis.getCapGISObjects(capId);
			// if (gisResult.getSuccess()){
				// var gisObjs = gisResult.getOutput();
				// if (!gisObjs || gisObjs.length == 0){
					// // attach asset GIS object
					// var assetGISResult = aa.gis.getAssetGISObject(capId);
					// if (assetGISResult.getSuccess()){
						// var assetGISObj = assetGISResult.getOutput()[0];
						// var serviceId = assetGISObj.getGisServiceId();
						// var typeId = assetGISObj.getGisTypeId();
						// var gisId = assetGISObj.getGISObjects()[0].getGisId();
						// logDebug("Asset GIS found.");
						// logDebug("Service: " + serviceId);
						// logDebug("Type: " + typeId);
						// logDebug("GISID: " + gisId);
						// aa.gis.addCapGISObject(capId, serviceId, typeId, gisId, true);
					// } else
						// logDebug("Asset GIS not found.");
				// }
			// } else {
				// logDebug("Unable to verify asset GIS object attached.");
			// }
		// }
		// if (!!gisLayerName) {
			// logDebug("GIS Layer for staff assignment: " + gisLayerName);
			// var userSeqId = getGISInfo("TORRANCE", gisLayerName, "AAUserID");
			// if (!userSeqId) {
				// logDebug("AAUserID not found.");
			// } else {
				// var userId = lookup("GISInspectorLookup", userSeqId);
				// if (!userId) {
					// logDebug("UserID not found in GISInspectorLookup.");
				// } else {
					// logDebug("Assigning service request to " + userId);
					// assignCap(userId);
				// }
			// }
		// } 
	// } catch (err) {
		// logDebug("Error: " + err.message);
	// }
// }

function tryCapIdsGetByAddr(){
	try {
		// this can fail - error thrown in line 2400, INCLUDES_ACCELA_FUNCTIONS.js 
		return capIdsGetByAddr();
	} catch (error){
		return false;
	}
}

function updateParksWOApplicationName(){
	try {
		var woAssetResult = aa.asset.getRecordAssetsByRecordId(capId), newAppName = "";
		if (woAssetResult.getSuccess()){
			var assets = woAssetResult.getOutput();
			for (var i=0;i<assets.length;i++){
				var woAsset = assets[i];
				var assetSeqNmbr = woAsset.getAssetPK().getG1AssetSequenceNumber();
				var assetResult = aa.asset.getAssetData(assetSeqNmbr);
				if (assetResult.getSuccess()){
					var asset = assetResult.getOutput();
					var assetMaster = asset.getAssetMasterModel();
					var assetName = assetMaster.getG1AssetName();
					logDebug("Park Name: " + assetName);
					if (!newAppName) newAppName += assetName;
					else newAppName += ", " + assetName;
				} else {
					logDebug("ERROR: " + assetResult.getErrorType() + assetResult.getErrorMessage());
				}
			}
			if (!!newAppName){
				logDebug("New app name: " + newAppName);
				if (editAppName(newAppName)) logDebug("App renamed successfully.");
				else logDebug("Failed to rename app.");
			}
		} else {
			logDebug("ERROR: " + woAssetResult.getErrorType() + woAssetResult.getErrorMessage());
		}
	} catch (error){
		logDebug("Javascript ERROR: " + error.message);
	}
}

function addConditionalAssessmentsForWaterValves(){
	var assetObj = aa.asset.getAssetListByWorkOrder(capId, null), 
		assetList, thisAsset, thisAssetMaster, thisAssetType, attrObj, dataList, thisAttrib, woAssets = [], servProvCode = aa.getServiceProviderCode();
	
	// get park asset ID on Work Order
	if (assetObj.getSuccess()){
		assetList = assetObj.getOutput();
		
		for (a in assetList){
			thisAsset = assetList[a].getAssetDataModel();
			thisAssetMaster = thisAsset.getAssetMaster();

			if (thisAssetMaster.getG1AssetGroup() == 'Water' && (thisAssetMaster.getG1AssetType().indexOf('Valve') > -1 || thisAssetMaster.getG1AssetType().indexOf('valve') > -1)) {
				// store park id 
				woAssets.push(thisAssetMaster.getG1AssetGroup() + "/" + thisAssetMaster.getG1AssetType() + "/" + thisAssetMaster.getG1AssetID());
				logDebug(woAssets[0]);
				
				// create asset condition assessment
				var assetCAModel = aa.proxyInvoker.newInstance("com.accela.ams.conditionassessment.AssetConditionAssessmentModel").getOutput();
				var nowDate = aa.util.now();
				var pDate = aa.date.getCurrentDate()
				var hour = pDate.getHourOfDay();
				if (hour > 12)
				{
				 hour -= 12;
				}
				if (hour < 10)
				{
				 hour = "0" + hour;
				}
				var min = pDate.getMinute();
				if (min < 10)
				{
				 min = "0" + min;
				}
				var nowTime = hour + ":" + min;
				
				logDebug('create CA for valve asset');
				
				assetCAModel.setServProvCode(servProvCode);
				assetCAModel.setConditionAssessment("TRI-ANNUAL WATER VALVE INSPECT");
				assetCAModel.setRecDate(nowDate);
				assetCAModel.setRecFulName("ADMIN");
				assetCAModel.setRecStatus("A");
				assetCAModel.setAssetSeq(thisAssetMaster.getG1AssetSequenceNumber());
				assetCAModel.setAssetID(thisAssetMaster.getG1AssetID());
				assetCAModel.setAssetType(thisAssetMaster.getG1AssetType());
				assetCAModel.setAssetGroup(thisAssetMaster.getG1AssetGroup());
				assetCAModel.setScheduledDate(nowDate);
				assetCAModel.setStatus("Scheduled");
				var systemUserObj = aa.person.getUser("ADMIN");
				if (systemUserObj.getSuccess())
				{
					assetCAModel.setInspector(systemUserObj.getOutput());
				}

				var assetCAModelResult = aa.assetCA.createAssetCA(assetCAModel);
				if(assetCAModelResult.getSuccess())
				{
					logDebug('created asset CA');
					assetCAModel.setAssetCAID(assetCAModelResult.getOutput());
				} else {
					logDebug('failed to create asset CA: ' + assetCAModelResult.getErrorType() + ' ' + assetCAModelResult.getErrorMessage());
				}
				
				// attach the CA to the asset
				var assetCAWorkOrderModel = aa.proxyInvoker.newInstance("com.accela.ams.conditionassessment.AssetCAWorkOrderModel").getOutput();
				assetCAWorkOrderModel.setCapID(capId);
				assetCAWorkOrderModel.setRecDate(nowDate);
				assetCAWorkOrderModel.setRecStatus("A");
				assetCAWorkOrderModel.setRecFulName("ADMIN");
				assetCAWorkOrderModel.setServProvCode(servProvCode);
				assetCAWorkOrderModel.setAssetCAID(assetCAModel.getAssetCAID());
				assetCAWorkOrderModel.setCapID1(capId.getID1());
				assetCAWorkOrderModel.setCapID2(capId.getID2());
				assetCAWorkOrderModel.setCapID3(capId.getID3());
				var workOrderAssetCAModel = aa.assetCA.createAssetCAWorkOrder(assetCAWorkOrderModel);
				if (workOrderAssetCAModel.getSuccess()) {
					logDebug('attached assessment to WO');
				} else {
					logDebug('unable to attach assessment to WO: ' + workOrderAssetCAModel.getErrorMessage());
				}
			}
		}
	}
}

function addConditionalAssessmentsForHydrants(){
	var assetObj = aa.asset.getAssetListByWorkOrder(capId, null), 
		assetList, thisAsset, thisAssetMaster, thisAssetType, attrObj, dataList, thisAttrib, woAssets = [], servProvCode = aa.getServiceProviderCode();
	
	// get park asset ID on Work Order
	if (assetObj.getSuccess()){
		assetList = assetObj.getOutput();
		
		for (a in assetList){
			thisAsset = assetList[a].getAssetDataModel();
			thisAssetMaster = thisAsset.getAssetMaster();

			if (thisAssetMaster.getG1AssetGroup() == 'Water' && thisAssetMaster.getG1AssetType() == 'Hydrants') {
				// store park id 
				woAssets.push(thisAssetMaster.getG1AssetGroup() + "/" + thisAssetMaster.getG1AssetType() + "/" + thisAssetMaster.getG1AssetID());
				logDebug(woAssets[0]);
				
				// create asset condition assessment
				var assetCAModel = aa.proxyInvoker.newInstance("com.accela.ams.conditionassessment.AssetConditionAssessmentModel").getOutput();
				var nowDate = aa.util.now();
				var pDate = aa.date.getCurrentDate()
				var hour = pDate.getHourOfDay();
				if (hour > 12)
				{
				 hour -= 12;
				}
				if (hour < 10)
				{
				 hour = "0" + hour;
				}
				var min = pDate.getMinute();
				if (min < 10)
				{
				 min = "0" + min;
				}
				var nowTime = hour + ":" + min;
				
				logDebug('create CA for hydrant asset');
				
				assetCAModel.setServProvCode(servProvCode);
				assetCAModel.setConditionAssessment("BI-ANNUAL FIRE HYDRANT INSPECT");
				assetCAModel.setRecDate(nowDate);
				assetCAModel.setRecFulName("ADMIN");
				assetCAModel.setRecStatus("A");
				assetCAModel.setAssetSeq(thisAssetMaster.getG1AssetSequenceNumber());
				assetCAModel.setAssetID(thisAssetMaster.getG1AssetID());
				assetCAModel.setAssetType(thisAssetMaster.getG1AssetType());
				assetCAModel.setAssetGroup(thisAssetMaster.getG1AssetGroup());
				assetCAModel.setScheduledDate(nowDate);
				assetCAModel.setStatus("Scheduled");
				var systemUserObj = aa.person.getUser("ADMIN");
				if (systemUserObj.getSuccess())
				{
					assetCAModel.setInspector(systemUserObj.getOutput());
				}

				var assetCAModelResult = aa.assetCA.createAssetCA(assetCAModel);
				if(assetCAModelResult.getSuccess())
				{
					logDebug('created asset CA');
					assetCAModel.setAssetCAID(assetCAModelResult.getOutput());
				} else {
					logDebug('failed to create asset CA: ' + assetCAModelResult.getErrorType() + ' ' + assetCAModelResult.getErrorMessage());
				}
				
				// attach the CA to the asset
				var assetCAWorkOrderModel = aa.proxyInvoker.newInstance("com.accela.ams.conditionassessment.AssetCAWorkOrderModel").getOutput();
				assetCAWorkOrderModel.setCapID(capId);
				assetCAWorkOrderModel.setRecDate(nowDate);
				assetCAWorkOrderModel.setRecStatus("A");
				assetCAWorkOrderModel.setRecFulName("ADMIN");
				assetCAWorkOrderModel.setServProvCode(servProvCode);
				assetCAWorkOrderModel.setAssetCAID(assetCAModel.getAssetCAID());
				assetCAWorkOrderModel.setCapID1(capId.getID1());
				assetCAWorkOrderModel.setCapID2(capId.getID2());
				assetCAWorkOrderModel.setCapID3(capId.getID3());
				var workOrderAssetCAModel = aa.assetCA.createAssetCAWorkOrder(assetCAWorkOrderModel);
				if (workOrderAssetCAModel.getSuccess()) {
					logDebug('attached assessment to WO');
				} else {
					logDebug('unable to attach assessment to WO: ' + workOrderAssetCAModel.getErrorMessage());
				}
			}
		}
	}
}

function assignStaffDeptToCAP(){
	var dept, staffId, gisLayerName, requestCategory;
	try{
		requestCategory = getAppSpecific("Request Category");
		if (appMatch("ServiceRequest/Animal Control/NA/NA")){
//			assignCapToStaff("ANIMALCONTROL");
			assignCapToStaff("TRAFFICPD");
		} else if (appMatch("ServiceRequest/Business Assistance/NA/NA")){
			if ("" + requestCategory != "Business License Info")
				assignCapToStaff("ECODEVO");
			else assignCapToDept("Licensing", capId);
		} else if (appMatch("ServiceRequest/Business Sign Issues/NA/NA")){
			gisLayerName = "Environmental Inspection Areas";
		} else if (appMatch("ServiceRequest/Construction Issue/NA/NA")){
			gisLayerName = "Building Inspection Areas - Residential";
		} else if (appMatch("ServiceRequest/Fire Hazard (non emergency)/NA/NA")){
//			assignCapToDept("Fire Support Staff", capId);
			if (requestCategory == "NPDES-On Property")
				assignCapToDept("Environmental Office", capId);
			else if (requestCategory == "NPDES-Public Right-of-Way")
			        gisLayerName = "Fire Inspection Areas";
			else if (requestCategory == "FireHaz-Fire Prevention")
				gisLayerName = "Fire Inspection Areas";
			else if (requestCategory == "FireHaz-Environmental")
				assignCapToDept("Environmental Office", capId);
			else assignCapToDept("Fire Support Staff", capId);
		} else if (appMatch("ServiceRequest/Handicap Accommodation Service/NA/NA")){
			assignCapToStaff("RISKMGT");
		} else if (appMatch("ServiceRequest/Internal Communications/NA/NA")){
			if (requestCategory == "Network")
				assignCapToDept("Data Communications", capId);
			else if (requestCategory == "Telephone")
				assignCapToDept("Telecommunications", capId);
			else if (requestCategory == "Cell Phone/Radio")
				assignCapToDept("Wireless Communications", capId);
			else assignCapToStaff("CITADMIN");
		} else if (appMatch("ServiceRequest/Medians/NA/NA")){
			gisLayerName = "Streetscape Assignment Areas";
		} else if (appMatch("ServiceRequest/Noise/NA/NA")){
			if ("" + requestCategory == "Police Issue")
				assignCapToStaff("COMMUNITYAFFAIRS");
//			else gisLayerName = "Environmental Inspection Areas";
                        else assignCapToDept("Environmental Office", capId);
		} else if (appMatch("ServiceRequest/Park Condition/NA/NA") || appMatch("AMS/Parks/*/*")){
			gisLayerName = "Park Assignment Areas";
			// check that GIS objects are attached
			var gisResult = aa.gis.getCapGISObjects(capId);
			if (gisResult.getSuccess()){
				var gisObjs = gisResult.getOutput();
				if (!gisObjs || gisObjs.length == 0){
					// attach asset GIS object
					var assetGISResult = aa.gis.getAssetGISObject(capId);
					if (assetGISResult.getSuccess()){
						var assetGISObj = assetGISResult.getOutput()[0];
						var serviceId = assetGISObj.getGisServiceId();
						var typeId = assetGISObj.getGisTypeId();
						var gisId = assetGISObj.getGISObjects()[0].getGisId();
						logDebug("Asset GIS found.");
						logDebug("Service: " + serviceId);
						logDebug("Type: " + typeId);
						logDebug("GISID: " + gisId);
						aa.gis.addCapGISObject(capId, serviceId, typeId, gisId, true);
					} else
						logDebug("Asset GIS not found.");
				}
			} else {
				logDebug("Unable to verify asset GIS object attached.");
			}
		} else if (appMatch("ServiceRequest/Parking OR Vehicle Issue/NA/NA")){
			if (!requestCategory || "" + requestCategory == "On Property")
//				gisLayerName = "Environmental Inspection Areas";
                                assignCapToDept("Environmental Office", capId);
			else if (requestCategory == "In Street (non-emergency)")
				assignCapToStaff("TRAFFICPD");
			else if (requestCategory == "Painted Curb Request")
				assignCapToStaff("TRAFFICENG");
		} else if (appMatch("ServiceRequest/Police Question(non emergency)/NA/NA")){
			assignCapToStaff("COMMUNITYAFFAIRS");
		} else if (appMatch("ServiceRequest/Property Maintenance/NA/NA")){
//			gisLayerName = "Environmental Inspection Areas";
                        assignCapToDept("Environmental Office", capId);
		} else if (appMatch("ServiceRequest/Fire Community Outreach Request/NA/NA")){
			assignCapToDept("Fire Support Staff", capId);
		} else if (appMatch("ServiceRequest/Recreation Programs/NA/NA")){
                         assignCapToStaff("AORPE");
// Changed by TY			assignCapToStaff("RECREATION");
		} else if (appMatch("ServiceRequest/Recycling/NA/NA")){
			if (!requestCategory || requestCategory == "Request Container")
				assignCapToDept("Public Works", capId);
			else if (requestCategory == "Missed Pickup")
				assignCapToDept("Sewer-Storm Drains", capId);
			else assignCapToStaff("RECYCLING");
		} else if (appMatch("ServiceRequest/Refuse OR Trash Pickup/NA/NA")){
			assignCapToDept("Public Works", capId);
		} else if (appMatch("ServiceRequest/Sewer/NA/NA")){
			assignCapToStaff("MWOOLSEY");
			//Changed by TY on 10-13-2016 assignCapToDept("Sewer-Storm Drains", capId);
		} else if (appMatch("ServiceRequest/Sidewalk Curb Gutter/NA/NA")){
			if (!requestCategory)
				assignCapToDept("Public Works", capId);
			else if (requestCategory == "Ramping/Grinding")
				assignCapToStaff("RAMPGRIND");
			else assignCapToStaff("CONCRETECREW");
		} else if (appMatch("ServiceRequest/Spills Discharge(nonemergency)/NA/NA")){
//			assignCapToDept("Fire Support Staff", capId);
			if (requestCategory == "NPDES-On Property")
				assignCapToDept("Environmental Office", capId);
			else if (requestCategory == "NPDES-Public Right-of-Way")
				gisLayerName = "Fire Inspection Areas";
			else if (requestCategory == "FireHaz-Fire Prevention")
				gisLayerName = "Fire Inspection Areas";
			else if (requestCategory == "FireHaz-Environmental")
				assignCapToDept("Environmental Office", capId);
			else assignCapToDept("Fire Support Staff", capId);
		} else if (appMatch("ServiceRequest/Standing Water/NA/NA")){
//			assignCapToDept("Sewer-Storm Drains", capId);
                        assignCapToStaff("CONCRETECREW");
		} else if (appMatch("ServiceRequest/Street Repair/NA/NA")){
			if (!requestCategory)
				assignCapToDept("Street Maintenance", capId);
			else if (requestCategory == "Pothole" || requestCategory == "Other Damage")
				assignCapToStaff("STREETMAINT");
			else if (requestCategory == "Slurry Request")
				assignCapToStaff("RAMPGRIND");
				//Change made by TY - assignCapToDept("PW Engineering", capId);
			else if (requestCategory == "Striping/Markings")
				assignCapToDept("Traffic Signs and Signals", capId);
		} else if (appMatch("ServiceRequest/Street Tree/NA/NA")){
			gisLayerName = "Streetscape Assignment Areas";
		} else if (appMatch("ServiceRequest/Traffic Congestion/NA/NA")){
			assignCapToStaff("TRAFFICENG");
		} else if (appMatch("ServiceRequest/Traffic Signs Signals/NA/NA")){
			if (!requestCategory)
				assignCapToDept("Public Works", capId);
			else if (requestCategory == "Request New Sign")
				assignCapToStaff("TRAFFICENG");
			else assignCapToStaff("TRAFFICLIGHTING");
		} else if (appMatch("ServiceRequest/Transit Buses/NA/NA")){
			assignCapToDept("Transit", capId);
		} else if (appMatch("ServiceRequest/Unpermitted Construction/NA/NA")){
			gisLayerName = "Building Inspection Areas - Residential";
		} else if (appMatch("ServiceRequest/Utilities/NA/NA")){
			if (!requestCategory || requestCategory == "Utility Question")
				assignCapToDept("City Manager Office", capId);
			else if (requestCategory == "Water")
				assignCapToDept("Water Operations", capId);
		} else if (appMatch("ServiceRequest/Water Conservation/NA/NA")){
			assignCapToDept("Water Operations", capId);
		} else if (appMatch("ServiceRequest/Zoning Development Information/NA/NA")){
			assignCapToDept("Planning", capId);
		} else if (appMatch("ServiceRequest/Illegal Business Use/NA/NA")){
//			gisLayerName = "Environmental Inspection Areas";
                        assignCapToDept("Environmental Office", capId);
		} else if (appMatch("ServiceRequest/Park Backflow/NA/NA")){
			assignCapToDept("Water Operations", capId);
		} else if (appMatch("ServiceRequest/Sumps and Ditches/NA/NA")){
			assignCapToStaff("STREETMAINT");
		} else if (appMatch("ServiceRequest/Water Quality Inquiry/NA/NA")){
			assignCapToDept("Water Operations", capId);
		} else if (appMatch("ServiceRequest/Street Sweeping/NA/NA")){
			assignCapToDept("Sewer-Storm Drains", capId);
		}
				
		if (!!gisLayerName) {
			logDebug("GIS Layer for staff assignment: " + gisLayerName);
			var userSeqId = getGISInfo("TORRANCE", gisLayerName, "AAUserID");
			if (!userSeqId) {
				logDebug("AAUserID not found.");
			} else {
				var userId = lookup("GISInspectorLookup", userSeqId);
				if (!userId) {
					logDebug("UserID not found in GISInspectorLookup.");
				} else {
					var lookupUserId = userId.toUpperCase();
					logDebug("Assigning ServiceRequest to " + lookupUserId);
					assignCapToStaff(lookupUserId);
				}
			}
		} 
	} catch (err) {
		logDebug("Error: " + err.message);
	}
}

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

function explore(obj){
	logDebug("Exploring " + obj.getClass());
	for (x in obj){
		if (typeof x === 'function'){
			logDebug(x + "()");
		} else {
			logDebug(x + " = " + obj[x]); 
		}
	}
}

/*--Start functions for SR notifications--*/
function addParameter(pamaremeters, key, value)
{
  if(key != null)
  {
    if(value == null)
    {
      value = "";
    }
    
    pamaremeters.put(key, value);
  }
}

function sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile){
    var itemCap = capId;
    if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args
    var id1 = itemCap.ID1;
    var id2 = itemCap.ID2;
    var id3 = itemCap.ID3;
    var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);
    if (!matches(emailTo,null,"",undefined)) {
        var result = null;
        result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
        if(result.getSuccess()){
            logDebug("Sent email successfully!");
            return true;
        }else{
            logDebug("Failed to send mail. - " + result.getErrorType());
            return false;
        }
    }else{
        logDebug("No email address found for logged in user");
        return false;
    }
}

function sendSRContactNotificationEmail(notificationTemplateName, fromEmail) {
    aa.print("Enter sendSRContactNotificationEmail()");
    aa.print("");

    //send param defined notification template to all contacts on record with email address

    //Template Parameters populated by this script:

    //$$SRID$$ - cap custom id
    //$$PERMITNAME$$ - cap special text
    //$$FILEDATE$$ - cap file date
    //$$SRALIAS$$ - cap type[1]
    //$$SPECIALTEXT$$ - cap model special text
    //$$DISPLAYADDRESS$$ - primary cap address display address
    //$$CONTACTNAME$$ - 'Reporting Party' contact last name + ', ' + contact first name
    //$$APPLICANT$$ - Each cap contact's first name + " " + last name, runs in a loop when sending email to each cap contact

    //var contactType = "Complainant"
    var contactType = "Reporting Party"
    var _fileDateObj = cap.getFileDate();
    var _fileDate = "" + _fileDateObj.getMonth() + "/" + _fileDateObj.getDayOfMonth() + "/" + _fileDateObj.getYear();

    var hashTable = aa.util.newHashtable();
    
    //notification template hashTable
    hashTable.put("$$SRID$$", capId.getCustomID() || "");
    hashTable.put("$$PERMITNAME$$", cap.getSpecialText() || "");
    hashTable.put("$$FILEDATE$$", _fileDate || "");
    hashTable.put("$$SRALIAS$$", cap.getCapType().toString().split("/")[1] || "");
    
    var _capModel = cap.getCapModel();
        
    hashTable.put("$$SPECIALTEXT$$", _capModel.specialText || "");    

    var capAddressResult = aa.address.getAddressByCapId(capId);
    if (capAddressResult.getSuccess()) {
        var capAddresses = capAddressResult.getOutput();
        for (capAddress in capAddresses) {
            capAddress = capAddresses[capAddress];
            if (capAddress.primaryFlag == "Y") {
                hashTable.put("$$DISPLAYADDRESS$$", capAddress.displayAddress || "");
            }
        }
    }

    var capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
        var capContacts = capContactResult.getOutput();
        for (capContact in capContacts) {
            capContact = capContacts[capContact];
            if (capContact.capContactModel != null && capContact.capContactModel.contactType == contactType) {
                var contactName = capContact.lastName + ", " + capContact.firstName;
                hashTable.put("$$CONTACTNAME$$", contactName || "");
            }
        }
    }

    //aa.print("hashTable: " + objectMapper.writeValueAsString(hashTable));
    //aa.print("");

    //Send a customized notification to each contact with an email address
    var contacts = getContactArray();
    for (contact in contacts) {
        contact = contacts[contact];
        toEmail = contact["email"];
        applicant = (contact["firstName"] + " " + contact["lastName"]) || "";
        if (toEmail != "" && toEmail != null && toEmail != "undefined") {

            //Update the hashTable with contact-specific information
            hashTable.put("$$APPLICANT$$", applicant);
            aa.print("hashTable: " + objectMapper.writeValueAsString(hashTable));
            aa.print("");

            //Send the email
            sendNotification(
                fromEmail,
                toEmail,
                "",
                notificationTemplateName,
                hashTable,
                null
            );
        }
    }

    aa.print("");
    aa.print("Exit sendSRContactNotificationEmail()");
}
/*--End functions for SR notifications--*/

function getAssignedStaff(){
	var cdScriptObjResult = aa.cap.getCapDetail(capId);
	var cdScriptObj = cdScriptObjResult.getOutput();
	var cd = cdScriptObj.getCapDetailModel();
	var currentAssignedStaff = cd.getAsgnStaff();
	logDebug("CAP Assigned to: "+currentAssignedStaff);
	return currentAssignedStaff;
}

function assignCapToStaff(assignId){ // optional CapId
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args
	var cAssgndStaff = getAssignedStaff();//get current assigned to staff to compare below
	if(assignId == cAssgndStaff){ logDebug("New Staff is same as current staff, not updating Assigned To"); return false; }//prevents update if no change
	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess()){ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()); return false; }
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj){ logDebug("**ERROR: No cap detail script object"); return false; }
	cd = cdScriptObj.getCapDetailModel();
	iNameResult  = aa.person.getUser(assignId);
	if (!iNameResult.getSuccess()){ logDebug("**ERROR retrieving  user model " + assignId + " : " + iNameResult.getErrorMessage()); return false; }
	iName = iNameResult.getOutput();
	cd.setAsgnDept(iName.getDeptOfUser());
	cd.setAsgnStaff(assignId);
	cdWrite = aa.cap.editCapDetail(cd)
	if (cdWrite.getSuccess()){ logDebug("Assigned CAP to " + assignId); }
	else { logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()); return false; }
}

function getWorkOrderCostingTransactions(id1, id2, id3) {
    aa.print("Enter getWorkOrderCostingTransactions()");

    //aa.print("id1:"+ id1 + " id2:" + id2 + " id3:" + id3);

    var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
    var datastore = initialContext.lookup("java:/AA");
    var connection = datastore.getConnection();

    var sqlString = "";

    sqlString += "SELECT * ";
    sqlString += "FROM GWORK_ORDER_COSTING ";
    sqlString += "WHERE ";
    sqlString += "    SERV_PROV_CODE = ? ";
    sqlString += "        AND ";
    sqlString += "    B1_PER_ID1 = ? ";
    sqlString += "        AND ";
    sqlString += "    B1_PER_ID2 = ? ";
    sqlString += "        AND ";
    sqlString += "    B1_PER_ID3 = ? ";

    //aa.print(sqlString);

    var workOrderCostingTransactions = [];

    var sqlStatement = connection.prepareStatement(sqlString);

    sqlStatement.setString(1, aa.getServiceProviderCode());
    sqlStatement.setString(2, id1);
    sqlStatement.setString(3, id2);
    sqlStatement.setString(4, id3);

    var recordset = sqlStatement.executeQuery();

    while (recordset.next()) {
        var COST_SEQ_NBR = recordset.getLong("COST_SEQ_NBR");
        workOrderCostingTransactions.push({ COST_SEQ_NBR: COST_SEQ_NBR });
    }

    sqlStatement.close();
    connection.close();

    var objectMapper = new org.codehaus.jackson.map.ObjectMapper();
    //aa.print(objectMapper.writeValueAsString(workOrderCostingTransactions));

    aa.print("Exit getWorkOrderCostingTransactions()");
    return workOrderCostingTransactions;
}

function validateWorkOrderAssetAndCosting() {
    aa.print("Enter validateWorkOrderAssetAndCosting.js");

    //aa.print("capId: " + capId);

    //aa.print("cap: " + cap);

    var targetStatus = "Field Complete";
    var updatedStatus = appStatus;

    if (targetStatus == updatedStatus) {
        aa.print("Begin if(){}");

        var capModel = cap.getCapModel();
        //aa.print("capModel:" + capModel);

        var assetList = capModel.getAssetList();
        //aa.print("assetList.length: " + assetList.toArray().length);

        var workOrderCostingTransactions = getWorkOrderCostingTransactions(capId.ID1, capId.ID2, capId.ID3)
        //aa.print("workOrderCostingTransactions: " + workOrderCostingTransactions.length);

        if (assetList.length < 1 || workOrderCostingTransactions.length < 1) {
            aa.print("Begin cancelling transaction");

            aa.print("ScriptReturnCode: " + aa.env.getValue("ScriptReturnCode"));
            aa.env.setValue("ScriptReturnCode", 1);
            aa.print("ScriptReturnCode: " + aa.env.getValue("ScriptReturnCode"));

            aa.print("ScriptReturnMessage: " + aa.env.getValue("ScriptReturnMessage"));
            aa.env.setValue("ScriptReturnMessage", "This record must have one asset record and one costing record before status can be set to '" + targetStatus + "'");
            aa.print("ScriptReturnMessage: " + aa.env.getValue("ScriptReturnMessage"));

            aa.print("cancel: " + cancel);
            cancel = true;
            aa.print("cancel: " + cancel);

            aa.print("End cancelling transaction");
        }

        aa.print("End if(){}");
    }

    aa.print("Exit validateWorkOrderAssetAndCosting.js");
}

