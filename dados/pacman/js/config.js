/////////////////////////////////////////////////////
/////////////////////// General /////////////////////
/////////////////////////////////////////////////////

var GAME_WIDTH					= 320;
var GAME_HEIGHT					= 480;
var SCALE_INTERPOLATION_DESKTOP	= true;
var SCALE_INTERPOLATION_MOBILE	= true;
var MAX_FPS						= 30;
var AUDIOENABLED 				= true;			// true or false it turns on/off the whole audio system
var MUSICENABLED 				= true; 		// true or false it turns on/off only the background music
var BETWEEN_LEVELS_ADS_DESKTOP	= "ad.html";
var BETWEEN_LEVELS_ADS_MOBILE	= "http://ad.leadboltmobile.net/show_app_wall?section_id=879611447";
var ADS_ON_NEW_LEVEL			= false;
var ADS_ON_DEATH				= false;
var IN_GAME_ADS					= false;		// true or false. it turns on/off the banner inside the game


/////////////////////////////////////////////////////
////////////////// Loading screen ///////////////////
/////////////////////////////////////////////////////

var GAME_NAME_1 			= "The Incredible";	// game name
var GAME_NAME_1_SIZE		= 30;			// game name font size
var GAME_NAME_1_COLOR		= "#ff0000";	// game name color expressed in hex value
var GAME_NAME_2 			= "Pac Maker";	// game name subtitle
var GAME_NAME_2_SIZE		= 60;			// game name subtitle font size
var GAME_NAME_2_COLOR		= "#FFFF00";	// game name subtitle color expressed in hex value
var LOADING_BG_COLOR		= "#310d3a";	// loading screen backgorund color expressed in hex value
var LOADING_BAR_COLOR 		= "#ff0000";	// loading bar progress color expressed in hex value

/////////////////////////////////////////////////////
///////////////////////// GUI ///////////////////////
/////////////////////////////////////////////////////
var GAME_LANGUAGES		= ["en","it"];	// add your additional languages here. For esample "ru","es", etc...

////////////////// Main menu screen ///////////////// 
var TOGGLE_AUDIO_BUTTON	= true;			// true or false
var FULLSCREEN_BUTTON	= true;			// true or false
var INFORMATION_BUTTON	= true;			// true or false
var HISCORE_BUTTON		= true;			// true or false
var FACEBOOK_BUTTON		= true;			// true or false
var HOW_TO_PLAY_BUTTON	= true;			// true or false
var MORE_GAMES_BUTTON	= true;			// true or false

//////////////////// Save Score ///////////////////// 
var SCORE_URL 			= "http://ffx.it/games/pac-maker/saveScore.php";		//your url to the server side file that will receive the data.

//////////////////// Apps Stores /////////////////////
var IOS_RATING_URL		= "https://itunes.apple.com/us/app/pac-maker/id#########";
var ANDROID_RATING_URL	= "market://details?id=it.ffx.pac-maker";

////////////////// More Games Button ////////////////
var MORE_GAMES_URL			= "http://ffx.it/";		// url of your website


///////////////// Select level screen ///////////////
var USE_SELECT_LEVEL_SCREEN	= true;					// true or false. Enable or disable the select level screen


////////////////// Game Over screen ///////////////// 
var SUBMIT_SCORE_BUTTON	= true;

/////////////////////////////////////////////////////
///////////////////////// GAME //////////////////////
/////////////////////////////////////////////////////

var PLAYER_VELOCITY				= 120;			// Default player velocity. This value may be overwritten by editor settings
var ENEMY_VELOCITY				= 120;			// Default enemies velocity

var PLAYER_VELOCITY_ON_POWER_UP	= 180;			// Player velocity on power up . This value may be overwritten by editor settings
var ENEMY_VELOCITY_ON__POWER_UP	= 60;			// Enemiesr velocity on player power up. This value may be overwritten by editor settings


var DOT_POINTS					= 100;			// Integer number. The points given by collecting a dot
var PILL_POINTS					= 200;			// Integer number. The points given by collecting a power up pill
var ENEMY_POINTS				= 500;			// Integer number. The points given by killing an enemies during power up

var HUD_POSITION				= "upper";		// upper or lower. the position of the HUD on screen

var POWER_UP_DURATION			= 10000;		// duration in milliseconds of power-up when player eats a pill 
var ENDING_POWER_UP_ALERT		= 2000;			// duration in milliseconds. when powerup time is ending the enemy can play a specific animation to warning the player
var POWER_UP_KILLS_ENEMIES		= true			// true or false. set the ability of killing enemies on power up time

var ON_DEAD_ENEMY_ACTION		= "respawn";	// respawn or remove. what happen when enemy deads. it can be respawned on it's original position od removed at all.
var ENEMY_RESPAWN_TIME			= 6000;			// time the enemy waits after respawn before starting again. time expressed in milliseconds

var PLAYER_USES_TELEPORT		= true			// true or false. Allow or disallow player from using teleport objects placed over the map
var ENEMIES_USE_TELEPORT		= false			// true or false. Allow or disallow enemies from using teleport objects placed over the map


/// Player animations

var PLAYER_ANIMATION_NORMAL_UP_STAND		= [7];
var PLAYER_ANIMATION_NORMAL_DOWN_STAND		= [15];
var PLAYER_ANIMATION_NORMAL_RIGHT_STAND		= [3];
var PLAYER_ANIMATION_NORMAL_LEFT_STAND		= [11];

var PLAYER_ANIMATION_NORMAL_UP_WALK			= [4,5,6,7,6,5];
var PLAYER_ANIMATION_NORMAL_DOWN_WALK		= [12,13,14,15,14,13];
var PLAYER_ANIMATION_NORMAL_RIGHT_WALK		= [0,1,2,3,2,1];
var PLAYER_ANIMATION_NORMAL_LEFT_WALK		= [8,9,10,11,10,9,];

var PLAYER_ANIMATION_POWER_UP_UP_STAND		= [23];
var PLAYER_ANIMATION_POWER_UP_DOWN_STAND	= [31];
var PLAYER_ANIMATION_POWER_UP_RIGHT_STAND	= [19];
var PLAYER_ANIMATION_POWER_UP_LEFT_STAND	= [27];

var PLAYER_ANIMATION_POWER_UP_UP_WALK		= [20,21,22,23,22,21];
var PLAYER_ANIMATION_POWER_UP_DOWN_WALK		= [28,29,30,31,30,29];
var PLAYER_ANIMATION_POWER_UP_RIGHT_WALK	= [16,17,18,19,18,17];
var PLAYER_ANIMATION_POWER_UP_LEFT_WALK		= [24,25,26,27,26,25];

var PLAYER_ANIMATION_VICTORY				= [7,3,15,11,7,3,15,11,7,3,15,11];

var PLAYER_ANIMATION_DYING					= [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15];


// Enemies animations

var ENEMY_ANIMATION_NORMAL_UP_WALK			= [4,5,6,7];
var ENEMY_ANIMATION_NORMAL_DOWN_WALK		= [12,13,14,15];
var ENEMY_ANIMATION_NORMAL_RIGHT_WALK		= [0,1,2,3];
var ENEMY_ANIMATION_NORMAL_LEFT_WALK		= [8,9,10,11];

var ENEMY_ANIMATION_ATTACK_UP_WALK			= [20,21,22,23];
var ENEMY_ANIMATION_ATTACK_DOWN_WALK		= [28,29,30,31];
var ENEMY_ANIMATION_ATTACK_RIGHT_WALK		= [16,17,18,19];
var ENEMY_ANIMATION_ATTACK_LEFT_WALK		= [24,25,26,27];

var ENEMY_ANIMATION_BITE_UP_WALK			= [20,21,22,23];
var ENEMY_ANIMATION_BITE_DOWN_WALK			= [28,29,30,31];
var ENEMY_ANIMATION_BITE_RIGHT_WALK			= [16,17,18,19];
var ENEMY_ANIMATION_BITE_LEFT_WALK			= [24,25,26,27];

var ENEMY_ANIMATION_SCARED_UP_WALK			= [36,37,38,39];
var ENEMY_ANIMATION_SCARED_DOWN_WALK		= [44,45,46,47];
var ENEMY_ANIMATION_SCARED_RIGHT_WALK		= [32,33,34,35];
var ENEMY_ANIMATION_SCARED_LEFT_WALK		= [40,41,42,43];

var ENEMY_ANIMATION_ENDING_UP_WALK			= [36,37,6,7];
var ENEMY_ANIMATION_ENDING_DOWN_WALK		= [44,45,14,15];
var ENEMY_ANIMATION_ENDING_RIGHT_WALK		= [32,33,2,3];
var ENEMY_ANIMATION_ENDING_LEFT_WALK		= [40,41,10,11];

// Dots animations
//var DOT_ANIMATION_LOOP						= [0,1,2,3,4,5];
//var DOT_ANIMATION_PICKUP					= [6,7,8,7,6];
var DOT_ANIMATION_LOOP						= [9];
var DOT_ANIMATION_PICKUP					= [];



// Pills animation
//var PILL_ANIMATION_LOOP						= [4,5,6,7];
var PILL_ANIMATION_LOOP						= [0];
var PILL_ANIMATION_PICKUP					= [];


// Levels files
var LEVELS_FILES =[
	"portrait_level_1.json",
	"portrait_level_2.json",
	"portrait_level_3.json",
	"portrait_level_1.json",
	"portrait_level_2.json",
	"portrait_level_3.json",
	"portrait_level_1.json",
	"portrait_level_2.json",
	"portrait_level_3.json",
	"portrait_level_1.json",
	"portrait_level_2.json",
	"portrait_level_3.json",
	"portrait_level_1.json",
	"portrait_level_2.json",
	"portrait_level_3.json",
	"portrait_level_1.json",
	"portrait_level_2.json",
	"portrait_level_3.json",
	"portrait_level_1.json",
	"portrait_level_2.json",
	"portrait_level_3.json",
	"portrait_level_1.json",
	"portrait_level_2.json",
	"portrait_level_3.json"
	];

// Enemies files
var ENEMIES_FILES =[
	"yellow_enemy.png",
	"magenta_enemy.png",
	"red_enemy.png",
	"green_enemy.png"
	];


