const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};
function randi(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min);
}



var botongo="Me gusta";
var maxretries=0;
while (maxretries<100){
	console.log("intento "+maxretries);
	
	var xpath = "//div[text()='Enviar invitaciones']";
	var btn = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	btn.click();

	btn=null;
	maxretries=0;
	while (btn==null && maxretries++<=100){
		delayres = await delay(1000);
		xpath = "//div[text()='Elegir reacciones']";
		btn = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	}
	btn.click();


	btn=null;
	maxretries=0;
	while (btn==null && maxretries++<=100){
		delayres = await delay(1000);
		xpath = "//div[contains(text(),'"+botongo+"')]";
		btn = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	}
	btn.click();
	
	
	btn=null;
	maxretries=0;
	while (btn==null && maxretries++<=100){
		delayres = await delay(1000);
		xpath = "//div[contains(text(),'Enviar invitaciones (')]";
		btn = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	}
	btn.click();
	delayres = await delay(randi(15,33)*1000);
}
