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