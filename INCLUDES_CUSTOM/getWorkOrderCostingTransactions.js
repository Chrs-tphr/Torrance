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