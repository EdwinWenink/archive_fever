function changeValue(elementName, newValue){
	console.log(newValue);
	console.log(elementName);
	document.getElementsByName(elementName)[0].value=newValue;
};
