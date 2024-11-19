const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};
function randi(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
for (var i=0;i<100;i++){
	console.log("click");
	var delayres = await delay(randi(2,10)*1000);
	var xpath = "//div[text()='Follow']";
	var btn = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	btn.scrollIntoView();
	btn.click();
	
}
