

var tags = [];
var groups = [];
var tags_groups = [];
groups.push("face");
groups.push("env");
tags.push("face_orgasm");
tags.push("face_seductive");
tags.push("face_pouting");
tags.push("face_ahegao");
tags.push("style_mirror_selfie");
tags.push("style_fantasy");
tags.push("style_cyberpunk");
tags.push("style_skin_detail");
tags.push("env_bar");
tags.push("env_bathroom");
tags.push("env_beach");
tags.push("env_bedroom");
tags.push("env_bus");
tags.push("env_cafe");
tags.push("env_car");
tags.push("env_changing_room");
tags.push("env_club");
tags.push("env_gym");
tags.push("env_hot_tub");
tags.push("env_kitchen");
tags.push("env_lake");
tags.push("env_mountains");
tags.push("env_office");
tags.push("env_party");
tags.push("env_pool");
tags.push("env_restaurant");
tags.push("env_sauna");
tags.push("env_shower");
tags.push("env_snow");
tags.push("env_street");
tags.push("env_strip_club");
tags.push("env_train");
tags.push("env_underwater");
tags.push("env_yacht");
tags.push("env_street");
tags.push("view_front");
tags.push("view_side");
tags.push("view_back");
tags.push("view_close");
tags.push("studio_DaW3Apu1wPIpFWhGx8Te");//steamy overhead view
tags.push("studio_kgNUO9N60FADovE4WeKl");//full-body view
tags.push("action_yoga");
tags.push("action_squatting");
tags.push("action_eating");
tags.push("action_jumping");
tags.push("action_exercise");
tags.push("action_t_pose");
tags.push("action_bathing");
tags.push("action_plank");
tags.push("action_massage");
tags.push("action_bending_over");
tags.push("action_spreading_legs");
tags.push("action_cumshot");
tags.push("action_on_back");
tags.push("action_straddling");
tags.push("studio_qJilxAwv7qTG9smUEygK");//begging
tags.push("studio_JW3o2XrT48EOiQG8KYUO");//blowjob
tags.push("clothes_nude_default");
tags.push("clothes_60s");
tags.push("clothes_70s");
tags.push("clothes_80s");
tags.push("clothes_90s");
tags.push("clothes_angel");
tags.push("clothes_apron");
tags.push("clothes_bathrobe");
tags.push("clothes_bdsm");
tags.push("clothes_beach_volleyball");
tags.push("clothes_bikini");
tags.push("clothes_blouse");
tags.push("clothes_boots");
tags.push("clothes_bra");
tags.push("clothes_casual");
tags.push("clothes_cheerleader");
tags.push("clothes_corset");
tags.push("clothes_cosplay");
tags.push("clothes_crop_top");
tags.push("clothes_devil");
tags.push("clothes_dress");
tags.push("clothes_face_mask");
tags.push("clothes_fantasy_armor");
tags.push("clothes_fur");
tags.push("clothes_geisha");
tags.push("clothes_goth");
tags.push("clothes_halloween_outfit");
tags.push("clothes_high_heels");
tags.push("clothes_high_socks");
tags.push("clothes_hip_hop");
tags.push("clothes_jumpsuit");
tags.push("clothes_latex");
tags.push("clothes_leather");
tags.push("clothes_lingerie");
tags.push("clothes_long_skirt");
tags.push("clothes_maid");
tags.push("clothes_micromini");
tags.push("clothes_microkini");
tags.push("clothes_military");
tags.push("clothes_mini_skirt");
tags.push("clothes_ninja");
tags.push("clothes_nun");
tags.push("clothes_nurse");
tags.push("clothes_one_piece_swimsuit");
tags.push("clothes_panties");
tags.push("clothes_pantyhose");
tags.push("clothes_push_up_bra");
tags.push("clothes_santa");
tags.push("clothes_sci_fi");
tags.push("clothes_secretary");
tags.push("clothes_shirt");
tags.push("clothes_short_shorts");
tags.push("clothes_steampunk");
tags.push("clothes_stylish");
tags.push("clothes_suit");
tags.push("clothes_sundress");
tags.push("clothes_superhero");
tags.push("clothes_sweater");
tags.push("clothes_tank_top");
tags.push("clothes_teacher");
tags.push("clothes_thigh_socks");
tags.push("clothes_thong");
tags.push("clothes_towel");
tags.push("clothes_traditional");
tags.push("clothes_tribal");
tags.push("clothes_tunic");
tags.push("clothes_underwear");
tags.push("clothes_vampire");
tags.push("clothes_victorian");
tags.push("clothes_waitress");
tags.push("clothes_witch");
tags.push("clothes_yoga_pants");
//////////clothes mods
tags.push("clothes_cleavage");
tags.push("clothes_partially_nude");
tags.push("clothes_topless");
tags.push("clothes_transparent");
tags.push("tags_beer");
tags.push("tags_diamond_jewelry");
tags.push("tags_gold_jewelry");
tags.push("tags_jewelry");
tags.push("tags_pearl_jewelry");
tags.push("tags_wine");







var group = groups[Math.floor(Math.random() * groups.length)]
console.log(group);
tags_groups = [];
for (var o = 0; o < tags.length; o++) {
	if (tags[o].startsWith(group)) {
		tags_groups.push(tags[o])
	}
}
var tag = tags_groups[Math.floor(Math.random() * tags_groups.length)];
selectTag(tag);

/*
function selectTag(cual) {

	var divs = document.querySelectorAll('div');
	for (var i = 0; i < divs.length; i++) {
		
		if (divs[i].className.indexOf("PPChip") >= 1 && divs[i].dataset.tagid == cual) {
			console.log(divs[i].dataset.tagid + "==" + cual);
			divs[i].click();
			break;
		}
	}

}
function getTagsAndClean(){
	var tags="|"
	var divs = document.querySelectorAll('div');
	for (var i = 0; i < divs.length; i++) {
		if (divs[i].className == 'relative flex justify-center items-center px-4 py-2 rounded-md bg-green-500 hover:bg-red-700 mr-2 mb-2 select-none cursor-pointer hover:opacity-30 animate__animated animate__bounceIn animate__faster text-white hover:text-transparent') {
			tags=tags+"|" + (divs[i].innerText);
			divs[i].querySelectorAll('img').click();
		}
	}
	return tags;
}
*/
function CleanTags() {
	
	var divs = document.querySelectorAll('img');
	for (var i = 0; i < divs.length; i++) {
		if (divs[i].alt == 'Clear Tags') {
		
			divs[i].click();
		}
	}
	
}
function getTags() {
	var tags = modelo;
	var divs = document.querySelectorAll('div');
	for (var i = 0; i < divs.length; i++) {
		if (divs[i].className.startsWith('relative flex justify-center items-center px-4 py-2 rounded-md bg-green-500 hover:bg-red-700 mr-2 mb-2 select-none cursor-pointer hover:opacity-30 animate__animated animate__bounceIn animate__faster text-white hover:text-transparent')) {
			tags = tags + "|" + (divs[i].innerText);
		}
	}
	return tags;
}
function selectTag(cual,randi) {
	if (randi != 0) {


		var randix = Math.floor(Math.random() * 100);
		if (randix > randi)
			return "";
	}
	var divs = document.querySelectorAll('div');
	for (var i = 0; i < divs.length; i++) {

		if (divs[i].className.indexOf("PPChip") >= 1 && divs[i].dataset.tagid == cual) {
			console.log(divs[i].dataset.tagid + "==" + cual);

			divs[i].click();
			break;
		}
	}

}
function savetomydatabase(photourl, tags) {
	if (lasturl != photourl) {
		fetch("https://zapier.juegosboom.com/pornpen/?url=" + encodeURI(photourl) + "&tags=" + encodeURI(tags.replace(" ", "").replace("-", "")))
			.then(function (response) {
				return response.json();
			})
			.then(function (myJson) {
				console.log(myJson);
			});
		lasturl = photourl;
	}
}
function myloop() {
	console.log(paso + ' iteracion');
	if (paso == 9) {
		//CleanTags();
		
		var i = 1;
		/*
		setTimeout(() => {
			selectTag(basetags[0], 0);
		
		}, (i++) * 300);
		setTimeout(() => {
			selectTag(basetags[1], 0);
	
		}, (i++) * 300);
		*/
		if (lasttag1 != "") selectTag(lasttag1, 0);
		setTimeout(() => {
			lasttag1 = tags[Math.floor(Math.random() * tags.length)];
			selectTag(lasttag1, 200);
		}, (i++) * 250);
		setTimeout(() => {
			if (lasttag2 != "") selectTag(lasttag2, 0);
		}, (i++) * 250);
		setTimeout(() => {
			lasttag2 = tags2[Math.floor(Math.random() * tags2.length)];
			selectTag(lasttag2, 200);
		}, (i++) * 250);

		paso = 10;
		//document.getElementsByClassName("GradientButton")[0].click();
		//console.log(paso + 'click en tag 1');
	}
	else if (paso == 10) { 
		paso = 11;
		document.getElementsByClassName("GradientButton")[0].click();
		console.log(paso+'click en generar');
	}
	else if (paso == 11) {
		var divs = document.querySelectorAll('div');
		for (var i = 0; i < divs.length; i++) {
			if (divs[i].className == 'text-white text-center underline m-auto relative') {
				photourl = divs[i].querySelectorAll('img')[0].src;
				console.log(paso + "foto generada" + "->" + photourl + "->" + divs[i].innerHTML);
				savetomydatabase(photourl, getTags());
				paso = pasoinit;
			}
		}
	}
	else if (paso == 12) {
		var botones = document.querySelectorAll('button');
		for (var i = 0; i < botones.length; i++) {
			if (botones[i].className == 'text-white py-2 px-4 rounded-lg mr-2') {
				botones[i].click();
				console.log(paso + "abre dialogo");
				paso = 13;

			}
		}
	}
	else if (paso == 13) {
		
		var divs = document.querySelectorAll('div');
		for (var i = 0; i < divs.length; i++) {
			if (divs[i].innerHTML == '<div class="">Panchita</div>') {
				divs[i].click();
				console.log(paso + "graba en carpeta");
				paso = 14;
			}
		}
	}
	else if (paso == 14) {
		
		var botonesx = document.querySelectorAll('button');
		for (var i = 0; i < botonesx.length; i++) {
			if (botonesx[i].ariaLabel == 'Close') {
				botonesx[i].click();
				console.log(paso + "dialogo cerrado");
				savetomydatabase(photourl, getTags());
				paso = pasoinit;
			}
		}
	}
}
var photourl = "";
var lasturl = "";
const intervalID = setInterval(myloop, 2000);
var paso = 9;
var pasoinit = paso;
var basetags = [];
var tags = [];
var tags2 = [];
var lasttag1 = "";
var lasttag2 = "";
basetags.push("tags_huge_boobs");
basetags.push("tags_mexican");
tags2.push("view_front");
tags2.push("view_side");
tags2.push("view_back");
tags2.push("view_close");
tags2.push("studio_DaW3Apu1wPIpFWhGx8Te");//steamy overhead view
tags2.push("studio_kgNUO9N60FADovE4WeKl");//full-body view
tags2.push("studio_kgNUO9N60FADovE4WeKl");//full-body view
/*
tags2.push("clothes_bikini");
tags2.push("clothes_lingerie");
tags2.push("clothes_casual");
tags2.push("clothes_cosplay");
tags2.push("clothes_stylish");
tags2.push("clothes_micromini");

tags2.push("clothes_towel");
tags2.push("clothes_high_heels");
tags2.push("clothes_superhero");

//tags2.push("clothes_nude_default");
*/

tags = [];
tags.push("clothes_bikini");

tags.push("clothes_long_skirt");

tags.push("clothes_micromini");
tags.push("clothes_microkini");

tags.push("clothes_one_piece_swimsuit");


tags.push("clothes_shirt");
tags.push("clothes_short_shorts");

tags.push("clothes_stylish");

tags.push("clothes_sundress");

var modelo = "0Pancha";
