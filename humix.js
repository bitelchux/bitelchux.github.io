function clickDeleteButtons() {
	console.log("don");

    const deleteButtons = document.querySelectorAll('i[aria-label="Delete Video"]');
    let index = 0;

    function clickNext() {
		var confirm = document.querySelectorAll("button[class*='card-button-cancel']");
		if (confirm.length>0)
			confirm[0].click();
        if (index < deleteButtons.length) {
            deleteButtons[index].click();
            index++;
			  
            setTimeout(clickNext, 1000); // Espera 1 segundo antes de hacer clic en el siguiente
        }
    }
	

    clickNext();
}

clickDeleteButtons();
