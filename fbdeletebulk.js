/*
aplica en https://www.facebook.com/100070533128641/allactivity?activity_history=false&category_key=MANAGEPOSTSPHOTOSANDVIDEOS&manage_mode=false&should_load_landing_page=false
*/


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(2000).then(() => {
  console.log("Executed after 2 seconds");
});

async function runAfterDelay() {

	document.querySelector("[aria-label='Opciones de acciones']").childNodes[0].click();
	await delay(2000);
	document.querySelectorAll("[role='menuitem']")[1].click();
	await delay(2000);
	document.querySelector("[aria-label='Mover a la papelera']").childNodes[0].click();
	await delay(2000);

}
setInterval(runAfterDelay, 2000);


