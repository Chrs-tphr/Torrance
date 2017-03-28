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

    var objectMapper = new org.codehaus.jackson.map.ObjectMapper();

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