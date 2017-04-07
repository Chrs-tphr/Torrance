aa.print("Enter addParkAssetStaffAssignments.js");
aa.print("");

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

var standardChoiceName = "PARK_ASSET_ASSIGNMENTS";

var standardChoices = {
    "019A" : "McMastersRoute",
    "P001" : "AltaLomaRoute",
    "P002" : "ColumbiaRoute",
    "P003" : "VictorRoute",
    "P004" : "AltaLomaRoute",
    "P005" : "McMastersRoute",
    "P006" : "ElNidoRoute",
    "P007" : "DowntownRoute",
    "P008" : "LagoSecoRoute",
    "P009" : "ElNidoRoute",
    "P010" : "TorranceRoute",
    "P011" : "McMastersRoute",
    "P012" : "TorranceRoute",
    "P013" : "McMastersRoute",
    "P014" : "VictorRoute",
    "P015" : "ElNidoRoute",
    "P016" : "LagoSecoRoute",
    "P017" : "AltaLomaRoute",
    "P018" : "LagoSecoRoute",
    "P019" : "McMastersRoute",
    "P020" : "LagoSecoRoute",
    "P021" : "McMastersRoute",
    "P022" : "VictorRoute",
    "P023" : "ColumbiaRoute",
    "P024" : "McMastersRoute",
    "P025" : "LagoSecoRoute",
    "P026" : "SeaAireRoute",
    "P027" : "ElNidoRoute",
    "P028" : "TorranceRoute",
    "P029" : "TorranceRoute",
    "P030" : "VictorRoute",
    "P031" : "AltaLomaRoute",
    "P032" : "WilsonRoute",
    "P034" : "PreserveRoute",
    "P035" : "ColumbiaRoute",
    "P036" : "DowntownRoute",
    "P038" : "AltaLomaRoute",
    "P043" : "VictorRoute",
    "P050" : "LagoSecoRoute",
    "P099" : "DowntownRoute",
    "P100" : "DowntownRoute",
    "P102" : "AltaLomaRoute",
    "P110" : "CivicCenterRoute",
    "P147" : "LagoSecoRoute",
    "P149" : "DowntownRoute",
    "P167" : "AltaLomaRoute",
    "P168" : "DowntownRoute",
    "P169" : "DowntownRoute",
    "P170" : "PreserveRoute",
    "P52" : "DowntownRoute",
};

for (standardChoice in standardChoices) {
    addLookup(standardChoiceName, standardChoice, standardChoices[standardChoice]);
}

aa.print("");
aa.print("Exit addParkAssetStaffAssignments.js");
