var FACEBOOK_BUTTON = !1,
    SHARE_SCORE_BUTTON = !1,
    GAME_URL = "",
    FB_PICTURE = "",
    FB_APP_ID = "",
    audioEnabled = AUDIOENABLED,
    musicEnabled = MUSICENABLED,
    widthGame = 0,
    heightGame = 0,
    real_widthGame = 0,
    real_heightGame = 0,
    lowres = null,
    device_portrait_orientated = null,
    centertop = 0,
    Path = null,
    virtualGamepad = !1,
    bookmarkBalloon = !1,
    scorePw = "p@cM@k3r",
    languages = GAME_LANGUAGES,
    local = {},
    gameName = GAME_NAME_1 + " " + GAME_NAME_2,
    gameUrl = GAME_URL,
    fbPic = FB_PICTURE,
    scoreUrl = SCORE_URL,
    game = {
        data: {
            score: 0,
            lives: 0,
            text: "",
            title: "",
            level: 1,
            running: !0,
            playerName: "",
            radarEntities: [],
            showAds: !0,
            PLAYER_OBJECT: 1,
            ENEMY_OBJECT: 2
        },
        onload: function() {
            setupScreenSize();
            var a = getScreenSize("w"),
                a = getScreenSize("h") / a;
            real_widthGame = widthGame;
            real_heightGame = heightGame;
            device_portrait_orientated = devicePortraitOriented();
            if (me.device.isMobile)
                if (navigator.isCocoonJS) device_portrait_orientated ? (me.video.init("screen", me.video.CANVAS, widthGame, parseInt(widthGame * a, 10), !0, "auto"), real_heightGame = parseInt(widthGame * a, 10)) : (me.video.init("screen", me.video.CANVAS,
                    parseInt(heightGame / a, 10), heightGame, !0, "auto"), real_widthGame = parseInt(heightGame / a, 10)), me.sys.interpolation = !1, me.sys.scalingInterpolation = !1;
                else {
                    me.event.subscribe(me.event.WINDOW_ONRESIZE, function(a) {
                        me.device.isFullscreen ? document.getElementById("screen").style.marginTop = "0px" : (centertop = (window.innerHeight - window.innerWidth / widthGame * heightGame) / 2, 0 < centertop ? document.getElementById("screen").style.marginTop = centertop.toString() + "px" : document.getElementById("screen").style.marginTop = "0px")
                    });
                    centertop = (window.innerHeight - window.innerWidth / widthGame * heightGame) / 2;
                    0 < centertop && (document.getElementById("screen").style.marginTop = centertop.toString() + "px");
                    if (!me.video.init("screen", me.video.CANVAS, widthGame, heightGame, !0, "auto", !0)) {
                        alert("Your browser does not support HTML5 canvas.");
                        return
                    }
                    me.sys.scalingInterpolation = SCALE_INTERPOLATION_MOBILE;
                    me.sys.interpolation = !1;
                    setTimeout(checkOrientation(), 1E3)
                } else {
                me.event.subscribe(me.event.WINDOW_ONRESIZE, function(a) {
                    me.device.isFullscreen ? document.getElementById("screen").style.marginTop =
                        "0px" : (centertop = (window.innerHeight - window.innerWidth / widthGame * heightGame) / 2, 0 < centertop ? document.getElementById("screen").style.marginTop = centertop.toString() + "px" : document.getElementById("screen").style.marginTop = "0px")
                });
                centertop = (window.innerHeight - window.innerWidth / widthGame * heightGame) / 2;
                0 < centertop && (document.getElementById("screen").style.marginTop = centertop.toString() + "px");
                if (!me.video.init("screen", me.video.CANVAS, widthGame, heightGame, !0, "auto", !0)) {
                    alert("Your browser does not support HTML5 canvas.");
                    return
                }
                me.sys.scalingInterpolation = SCALE_INTERPOLATION_DESKTOP;
                me.sys.interpolation = !1
            }
            if ("#debug" === document.location.hash) window.onReady(function() {
                me.plugin.register(debugPanel, "debug")
            });
            if ("#mute" === document.location.hash) window.onReady(function() {
                me.audio.muteAll();
                audioEnabled = !1
            });
            me.device.wp ? audioEnabled = !1 : me.audio.init("mp3,ogg");
            "undefined" !== typeof amazon && (ANDROID_RATING_URL = AMAZON_RATING_URL);
            me.device.wp || (game.resources = game.resources.concat(game.resourcesSFX));
            game.resources = me.device.isMobile ?
                game.resources.concat(game.resourcesGFX_mobile) : game.resources.concat(game.resourcesGFX_desktop);
            for (a = 0; a < LEVELS_FILES.length; a++) game.resources = game.resources.concat([{
                name: "level" + (a + 1),
                type: "tmx",
                src: "data/map/" + LEVELS_FILES[a]
            }]);
            for (a = 0; a < ENEMIES_FILES.length; a++) game.resources = game.resources.concat([{
                name: ENEMIES_FILES[a].slice(0, -4),
                type: "image",
                src: "data/img/sprite/" + ENEMIES_FILES[a]
            }]);
            me.state.set(me.state.LOADING, new CustomLoadingScreen);
            me.loader.onload = this.loaded.bind(this);
            me.loader.preload(game.resources);
            me.state.change(me.state.LOADING)
        },
        loaded: function() {
            me.state.set(me.state.MENU, new game.MenuScreen);
            me.state.set(me.state.GAMEOVER, new game.GameOverScreen);
            me.state.set(me.state.READY, new game.YouDidItScreen);
            me.state.set(me.state.PLAY, new game.PlayScreen);
            me.state.set(me.state.USER + 1, new game.ChooseScreen);
            me.state.set(me.state.USER + 2, new game.HowToPlayScreen);
            me.state.set(me.state.USER + 3, new game.InfoScreen);
            me.state.set(me.state.USER + 4, new game.NameInputScreen);
            me.state.set(me.state.USER + 6, new game.FullAdScreen);
            me.state.set(me.state.SCORE, new game.ScoreScreen);
            me.pool.register("Player", game.PlayerEntity);
            me.pool.register("Enemy", game.EnemyEntity);
            me.pool.register("dot", game.dotEntity, !0);
            me.pool.register("pill", game.pillEntity, !0);
            me.pool.register("exit", game.ExitEntity, !0);
            me.pool.register("teleport", game.teleportEntity);
            me.input.bindKey(me.input.KEY.LEFT, "left");
            me.input.bindKey(me.input.KEY.RIGHT, "right");
            me.input.bindKey(me.input.KEY.UP, "up");
            me.input.bindKey(me.input.KEY.DOWN, "down");
            me.input.bindKey(me.input.KEY.P,
                "pause", !0);
            me.input.bindKey(me.input.KEY.SPACE, "fire", !1);
            me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.SPACE);
            me.save.add({
                showAds: !0
            });
            game.data.showAds = me.save.showAds;
            var a = (navigator.userLanguage ? navigator.userLanguage : navigator.language ? navigator.language : "english").substring(0, 2); - 1 == languages.indexOf(a) && (a = languages[0]);
            me.loader.load({
                name: "local",
                type: "json",
                src: "data/local/" + a + ".json"
            }, function() {
                local = me.loader.getJSON("local");
                me.state.change(me.state.MENU)
            })
        }
    };

function checkOrientation() {
    GAME_WIDTH < GAME_HEIGHT != window.innerWidth < window.innerHeight ? (centertop = (window.innerHeight - 320) / 2, 0 < centertop && (document.getElementById("block_land_" + device_portrait_orientated).style.paddingTop = centertop.toString() + "px"), document.getElementById("block_land_" + device_portrait_orientated).style.display = "block") : document.getElementById("block_land_" + device_portrait_orientated).style.display = "none";
    setTimeout(checkOrientation, 100)
}

function devicePortraitOriented() {
    return GAME_WIDTH < GAME_HEIGHT ? !0 : !1
}

function setupScreenSize() {
    widthGame = GAME_WIDTH;
    heightGame = GAME_HEIGHT;
    lowres = !0
}

function getScreenSize(a) {
    var b = window.innerWidth,
        d = window.innerHeight;
    if (devicePortraitOriented) {
        if (b > d) var e = b,
            b = d,
            d = e
    } else b < d && (e = b, b = d, d = e);
    return "h" == a ? d : b
}
Array.prototype.compare = function(a) {
    if (!a || this.length != a.length) return !1;
    for (var b = 0, d = this.length; b < d; b++)
        if (this[b] instanceof Array && a[b] instanceof Array) {
            if (!this[b].compare(a[b])) return !1
        } else if (this[b] != a[b]) return !1;
    return !0
};
Date.now || (Date.now = function() {
    return (new Date).getTime()
});

function trace(a) {
    console.info(a)
}
game.resourcesGFX_mobile = [{
    name: "help_img",
    type: "image",
    src: "data/img/gui/help_mobile.png"
}];
game.resourcesGFX_desktop = [{
    name: "help_img",
    type: "image",
    src: "data/img/gui/help_desktop.png"
}];
game.resources = [{
    name: "gui_bg",
    type: "image",
    src: "data/img/gui/gui_bg.jpg"
}, {
    name: "cover",
    type: "image",
    src: "data/img/gui/cover.png"
}, {
    name: "title",
    type: "image",
    src: "data/img/gui/title.png"
}, {
    name: "bitmap_font",
    type: "image",
    src: "data/img/font/16x16_font.png"
}, {
    name: "menu_button",
    type: "image",
    src: "data/img/gui/menu_button.png"
}, {
    name: "small_button",
    type: "image",
    src: "data/img/gui/small_button.png"
}, {
    name: "level_button_lock",
    type: "image",
    src: "data/img/gui/level_button_lock.png"
}, {
    name: "audio_off_button",
    type: "image",
    src: "data/img/gui/audio_off_button.png"
}, {
    name: "audio_on_button",
    type: "image",
    src: "data/img/gui/audio_on_button.png"
}, {
    name: "fullscreen_off_button",
    type: "image",
    src: "data/img/gui/fullscreen_off_button.png"
}, {
    name: "fullscreen_on_button",
    type: "image",
    src: "data/img/gui/fullscreen_on_button.png"
}, {
    name: "info_button",
    type: "image",
    src: "data/img/gui/info_button.png"
}, {
    name: "hiscore_button",
    type: "image",
    src: "data/img/gui/hiscore_button.png"
}, {
    name: "home_button",
    type: "image",
    src: "data/img/gui/home_button.png"
}, {
    name: "restart_button",
    type: "image",
    src: "data/img/gui/restart_button.png"
}, {
    name: "continue_button",
    type: "image",
    src: "data/img/gui/continue_button.png"
}, {
    name: "butt_up",
    type: "image",
    src: "data/img/gui/butt_up.png"
}, {
    name: "butt_down",
    type: "image",
    src: "data/img/gui/butt_down.png"
}, {
    name: "butt_right",
    type: "image",
    src: "data/img/gui/butt_right.png"
}, {
    name: "butt_left",
    type: "image",
    src: "data/img/gui/butt_left.png"
}, {
    name: "butt_x",
    type: "image",
    src: "data/img/gui/butt_x.png"
}, {
    name: "butt_pause",
    type: "image",
    src: "data/img/gui/butt_pause.png"
}, {
    name: "player",
    type: "image",
    src: "data/img/sprite/player.png"
}, {
    name: "tiles",
    type: "image",
    src: "data/img/map/tiles.png"
}, {
    name: "metatiles",
    type: "image",
    src: "data/img/map/metatiles.png"
}, {
    name: "dots",
    type: "image",
    src: "data/img/sprite/dots.png"
}, {
    name: "pills",
    type: "image",
    src: "data/img/sprite/pills.png"
}, {
    name: "head",
    type: "image",
    src: "data/img/gui/head.png"
}, {
    name: "arrows",
    type: "image",
    src: "data/img/gui/arrows.png"
}];
game.resourcesSFX = [{
    name: "menu",
    type: "audio",
    src: "data/bgm/",
    channel: 1
}, {
    name: "soundtrack",
    type: "audio",
    src: "data/bgm/",
    channel: 1
}, {
    name: "click",
    type: "audio",
    src: "data/sfx/",
    channel: 1
}, {
    name: "victory",
    type: "audio",
    src: "data/sfx/",
    channel: 4
}, {
    name: "dead",
    type: "audio",
    src: "data/sfx/",
    channel: 4
}, {
    name: "dot",
    type: "audio",
    src: "data/sfx/",
    channel: 3
}, {
    name: "growl",
    type: "audio",
    src: "data/sfx/",
    channel: 4
}, {
    name: "powerup",
    type: "audio",
    src: "data/sfx/",
    channel: 4
}, {
    name: "powerdown",
    type: "audio",
    src: "data/sfx/",
    channel: 4
}, {
    name: "killenemy",
    type: "audio",
    src: "data/sfx/",
    channel: 4
}];

function entityManager(a, b) {
    if (a.direction == a.wantedDirection) switch (a.direction) {
        case 2:
            a.renderable.isCurrentAnimation("down" + a.mode) || a.renderable.setCurrentAnimation("down" + a.mode);
            break;
        case 8:
            a.renderable.isCurrentAnimation("up" + a.mode) || a.renderable.setCurrentAnimation("up" + a.mode);
            break;
        case 1:
            a.renderable.isCurrentAnimation("left" + a.mode) || a.renderable.setCurrentAnimation("left" + a.mode);
            break;
        case 4:
            a.renderable.isCurrentAnimation("right" + a.mode) || a.renderable.setCurrentAnimation("right" +
                a.mode)
    }
    0 != b && (a.wantedDirection = b);
    a.pos.x + a.width > Path.cols * Path.tilewidth ? (a.body.vel.x = 0, a.pos.x = 32 * Math.floor((a.pos.x + 16) / 32)) : 0 > a.pos.x && (a.body.vel.x = 0, a.pos.x = 32 * Math.floor((a.pos.x + 16) / 32));
    a.pos.y + a.height > Path.rows * Path.tileheight ? (a.body.vel.y = 0, a.pos.y = 32 * Math.floor((a.pos.y + 16) / 32)) : 0 > a.pos.y && (a.body.vel.y = 0, a.pos.y = 32 * Math.floor((a.pos.y + 16) / 32));
    var d = getTile(a),
        e = Math.abs(32 * Math.floor((a.pos.x + 16) / 32) - a.pos.x),
        f = Math.abs(32 * Math.floor((a.pos.y + 16) / 32) - a.pos.y),
        g = a.velocity;
    8 ==
        (d & a.direction) ? (a.body.vel.y = game.data.playerIsHunter ? -a.powerupVelocity : -a.velocity, a.pos.x = 32 * Math.floor((a.pos.x + 16) / 32), a.body.vel.x = 0) : 2 == (d & a.direction) ? (a.body.vel.y = game.data.playerIsHunter ? a.powerupVelocity : a.velocity, a.pos.x = 32 * Math.floor((a.pos.x + 16) / 32), a.body.vel.x = 0) : 4 == (d & a.direction) ? (a.body.vel.x = game.data.playerIsHunter ? a.powerupVelocity : a.velocity, a.pos.y = 32 * Math.floor((a.pos.y + 16) / 32), a.body.vel.y = 0) : 1 == (d & a.direction) ? (a.body.vel.x = game.data.playerIsHunter ? -a.powerupVelocity :
            -a.velocity, a.pos.y = 32 * Math.floor((a.pos.y + 16) / 32), a.body.vel.y = 0) : e < g && f < g && (a.body.vel.x = 0, a.body.vel.y = 0, a.pos.x = 32 * Math.floor((a.pos.x + 16) / 32), a.pos.y = 32 * Math.floor((a.pos.y + 16) / 32));
    var k = getAheadTile(a);
    8 == (d & a.wantedDirection) && e < g ? (a.body.vel.y = game.data.playerIsHunter ? -a.powerupVelocity : -a.velocity, a.direction = a.wantedDirection, a.pos.x = 32 * Math.floor((a.pos.x + 16) / 32), a.body.vel.x = 0) : 2 == (d & a.wantedDirection) && e < g ? (a.body.vel.y = game.data.playerIsHunter ? a.powerupVelocity : a.velocity, a.direction =
        a.wantedDirection, a.pos.x = 32 * Math.floor((a.pos.x + 16) / 32), a.body.vel.x = 0) : 4 == (d & a.wantedDirection) && f < g ? (a.body.vel.x = game.data.playerIsHunter ? a.powerupVelocity : a.velocity, a.direction = a.wantedDirection, a.pos.y = 32 * Math.floor((a.pos.y + 16) / 32), a.body.vel.y = 0) : 1 == (d & a.wantedDirection) && f < g && (a.body.vel.x = game.data.playerIsHunter ? -a.powerupVelocity : -a.velocity, a.direction = a.wantedDirection, a.pos.y = 32 * Math.floor((a.pos.y + 16) / 32), a.body.vel.y = 0);
    return [d, k]
}

function getTile(a) {
    a = Path.getTileId(a.pos.x + a.width / 2, a.pos.y + a.height / 2);
    return null != a ? parseInt(Path.tilesets.getTilesetByGid(a).getTileProperties(a - 1 + "1").direction, 2) : 0
}

function getAheadTile(a) {
    var b = 0,
        d = 0;
    switch (a.direction) {
        case 8:
            b = a.width / 2;
            d = -1;
            break;
        case 4:
            b = a.width + 1;
            d = a.height / 2;
            break;
        case 2:
            b = a.width / 2;
            d = a.height + 1;
            break;
        case 1:
            b = -1, d = a.height / 2
    }
    if (a.pos.y + d > heightGame || a.pos.x + b > widthGame || 0 > a.pos.y + d || 0 > a.pos.x + b) return 0;
    a = Path.getTileId(a.pos.x + b, a.pos.y + d);
    return null != a ? parseInt(Path.tilesets.getTilesetByGid(a).getTileProperties(a - 1 + "1").direction, 2) : 0
}

function getBacksideTile(a) {
    var b = 0,
        d = 0;
    switch (a.direction) {
        case 8:
            b = a.width / 2;
            d = a.height;
            break;
        case 4:
            b = 0;
            d = a.height / 2;
            break;
        case 2:
            b = a.width / 2;
            d = 0;
            break;
        case 1:
            b = a.width, d = a.height / 2
    }
    a = Path.getTileId(a.pos.x + b, a.pos.y + d);
    return null != a ? parseInt(Path.tilesets.getTilesetByGid(a).getTileProperties(a - 1 + "1").direction, 2) : 0
}

function registerToRadarAndCollisions(a) {
    var b = Path.cols,
        d = Path.rows;
    if ("undefined" == typeof game.data.collisionArray)
        for (game.data.collisionArray = [], c = 0; c < b; c++)
            for (game.data.collisionArray[c] = [], r = 0; r < d; r++) game.data.collisionArray[c].push(0);
    else if (0 == game.data.radarEntities.length)
        for (c = 0; c < b; c++)
            for (r = 0; r < d; r++) game.data.collisionArray[c][r] = 0;
    game.data.radarEntities.push(a);
    b = Math.floor((a.pos.x + 16) / 32);
    d = Math.floor((a.pos.y + 16) / 32);
    game.data.collisionArray[b][d] = a.type;
    a.currentTileId = b * d +
        d;
    a.currentTilePos = [b, d];
    a.previousTileId = a.currentTileId;
    a.previousTilePos = [b, d]
}

function removeFromRadar(a) {
    a = game.data.radarEntities.indexOf(a);
    game.data.radarEntities.splice(a, 1)
}

function updateCollisionArray(a) {
    var b = Math.floor((a.pos.x + 16) / 32),
        d = Math.floor((a.pos.y + 16) / 32);
    a.currentTileId = b * d + d;
    a.currentTilePos = [b, d];
    a.previousTileId != a.currentTileId && (game.data.collisionArray[a.previousTilePos[0]][a.previousTilePos[1]] = 0, game.data.collisionArray[b][d] = a.type, a.previousTileId = a.currentTileId, a.previousTilePos = [b, d])
}

function getCurrentCollisionArray(a) {
    return game.data.collisionArray[Math.floor((a.pos.x + 16) / 32)][Math.floor((a.pos.y + 16) / 32)]
}

function getAheadCollisionArray(a) {
    var b = Math.floor((a.pos.x + 16) / 32),
        d = Math.floor((a.pos.y + 16) / 32),
        e = 0,
        f = 0;
    switch (a.direction) {
        case 8:
            e = 0;
            f = -1;
            break;
        case 4:
            e = 1;
            f = 0;
            break;
        case 2:
            e = 0;
            f = 1;
            break;
        case 1:
            e = -1, f = 0
    }
    return b + e >= Path.cols || d + f >= Path.rows || 0 > b + e || 0 > d + f ? 0 : game.data.collisionArray[b + e][d + f]
}
1;
game.PlayerEntity = me.Entity.extend({
    init: function(a, b, d) {
        Path = me.game.currentLevel.getLayerByName("Path");
        this.image = me.loader.getImage("player");
        d.image = this.image;
        d.spritewidth = 32;
        d.spriteheight = 32;
        d.width = d.spritewidth;
        d.height = d.spriteheight;
        this._super(me.Entity, "init", [a, b, d]);
        this.renderable.addAnimation("up_stand", PLAYER_ANIMATION_NORMAL_UP_STAND, 60);
        this.renderable.addAnimation("down_stand", PLAYER_ANIMATION_NORMAL_DOWN_STAND, 60);
        this.renderable.addAnimation("right_stand", PLAYER_ANIMATION_NORMAL_RIGHT_STAND,
            60);
        this.renderable.addAnimation("left_stand", PLAYER_ANIMATION_NORMAL_LEFT_STAND, 60);
        this.renderable.addAnimation("up", PLAYER_ANIMATION_NORMAL_UP_WALK, 60);
        this.renderable.addAnimation("down", PLAYER_ANIMATION_NORMAL_DOWN_WALK, 60);
        this.renderable.addAnimation("right", PLAYER_ANIMATION_NORMAL_RIGHT_WALK, 60);
        this.renderable.addAnimation("left", PLAYER_ANIMATION_NORMAL_LEFT_WALK, 60);
        this.renderable.addAnimation("up_stand_hunter", PLAYER_ANIMATION_POWER_UP_UP_STAND, 60);
        this.renderable.addAnimation("down_stand_hunter",
            PLAYER_ANIMATION_POWER_UP_DOWN_STAND, 60);
        this.renderable.addAnimation("right_stand_hunter", PLAYER_ANIMATION_POWER_UP_RIGHT_STAND, 60);
        this.renderable.addAnimation("left_stand_hunter", PLAYER_ANIMATION_POWER_UP_LEFT_STAND, 60);
        this.renderable.addAnimation("up_hunter", PLAYER_ANIMATION_POWER_UP_UP_WALK, 60);
        this.renderable.addAnimation("down_hunter", PLAYER_ANIMATION_POWER_UP_DOWN_WALK, 60);
        this.renderable.addAnimation("right_hunter", PLAYER_ANIMATION_POWER_UP_RIGHT_WALK, 60);
        this.renderable.addAnimation("left_hunter",
            PLAYER_ANIMATION_POWER_UP_LEFT_WALK, 60);
        this.renderable.addAnimation("victory", PLAYER_ANIMATION_VICTORY, 60);
        this.renderable.addAnimation("die", PLAYER_ANIMATION_DYING, 60);
        game.data.player = this;
        this.collidable = !1;
        this.name = "player";
        this.state = "ready";
        game.data.running = !0;
        this.type = game.data.PLAYER_OBJECT;
        me.game.viewport.follow(this, me.game.viewport.AXIS.BOTH);
        this.body.gravity = 0;
        this.body.setVelocity(999, 999);
        this.body.vel.x = 0;
        this.body.vel.y = 0;
        this.alwaysUpdate = !0;
        this.directions = [8, 4, 2, 1];
        a = getTile(this);
        do this.direction = this.directions[Math.floor(4 * Math.random())]; while (0 == (this.direction & a) && 0 != a);
        this.wantedDirection = this.direction;
        switch (this.direction) {
            case 8:
                this.renderable.setCurrentAnimation("up_stand");
                break;
            case 4:
                this.renderable.setCurrentAnimation("right_stand");
                break;
            case 2:
                this.renderable.setCurrentAnimation("down_stand");
                break;
            case 1:
                this.renderable.setCurrentAnimation("left_stand")
        }
        registerToRadarAndCollisions(this);
        me.game.world.addChild(new arrows(this), 999);
        this.velocity = null !=
            d.velocity ? parseInt(d.velocity) : PLAYER_VELOCITY / MAX_FPS;
        this.powerupVelocity = null != d.powerup_velocity ? parseInt(d.powerup_velocity) : PLAYER_VELOCITY_ON_POWER_UP / MAX_FPS;
        game.data.playerIsHunter = !1;
        game.data.hunterTimer = 0;
        this.mode = "";
        this.teleportTrigger = "allowed"
    },
    update: function(a) {
        if (me.input.isKeyPressed("pause")) {
            var b = me.video.renderer.getWidth(),
                d = me.video.renderer.getHeight(),
                e = new butt_continue_pause(b / 2 - 50, d / 2 + 30);
            me.game.world.addChild(e, 999);
            var f = new butt_home_pause(b / 2 + 50, d / 2 + 30);
            me.game.world.addChild(f,
                999);
            me.sys.resumeOnFocus = !1;
            me.audio.muteAll();
            game.data.text = "pause";
            me.state.pause();
            var g = setInterval(function() {
                me.input.isKeyPressed("pause") && (clearInterval(g), audioEnabled && me.audio.unmuteAll(), me.sys.resumeOnFocus = !0, me.state.resume(), game.data.text = "", me.game.world.removeChild(f), me.game.world.removeChild(e), me.input.triggerKeyEvent(me.input.KEY.P, !1))
            }, 10)
        }
        switch (this.state) {
            case "ready":
                var k = this;
                me.sys.resumeOnFocus = !1;
                this.handler = me.event.subscribe(me.event.KEYDOWN, function(a, b, d) {
                    if ("up" ===
                        a || "down" === a || "left" === a || "right" === a) musicEnabled && me.audio.playTrack("soundtrack"), game.data.text = "", k.renderable && (k.renderable.alpha = 1), me.sys.resumeOnFocus = !0, me.state.resume(), k.renderable && (k.state = "play"), me.event.unsubscribe(k.handler)
                });
                game.data.text = "getready";
                me.state.pause();
                this.state = "wait";
                break;
            case "done":
                this.renderable.isCurrentAnimation("victory") || (this.body.vel.x = 0, this.body.vel.y = 0, game.data.running = !1, audioEnabled && me.audio.play("victory"), musicEnabled && me.audio.stopTrack("soundtrack"),
                    this.renderable.setCurrentAnimation("victory", function() {
                        me.state.change(me.state.READY)
                    }.bind(this)), this.renderable.setAnimationFrame(1));
                break;
            case "play":
                b = me.input.isKeyPressed("up") ? 8 : me.input.isKeyPressed("down") ? 2 : me.input.isKeyPressed("right") ? 4 : me.input.isKeyPressed("left") ? 1 : 0;
                entityManager(this, b);
                b = Math.floor((this.pos.x + 16) / 32);
                d = Math.floor((this.pos.y + 16) / 32);
                if (PLAYER_USES_TELEPORT && "undefined" !== typeof game.data.teleportArray) {
                    var h = game.data.teleportArray[b][d];
                    if (0 !== h) {
                        var l = Math.abs(32 *
                                Math.floor((this.pos.x + 16) / 32) - this.pos.x),
                            p = Math.abs(32 * Math.floor((this.pos.y + 16) / 32) - this.pos.y);
                        4 > l && 4 > p && "allowed" === this.teleportTrigger && (this.teleportTrigger = "denied", l = game.data.teleportList[h.destination], this.pos.x = l[0], this.pos.y = l[1])
                    } else this.teleportTrigger = "allowed"
                }
                h = game.data.dotArray[b][d];
                0 !== h && ("pill" === h.name ? (game.data.playerIsHunter = !0, game.data.hunterTimer = me.timer.getTime() + POWER_UP_DURATION, this.mode = "_hunter", game.data.score += PILL_POINTS, 0 < PILL_ANIMATION_PICKUP.length ?
                    h.setCurrentAnimation("pick", function() {
                        me.game.world.removeChild(h);
                        return !1
                    }.bind(this)) : me.game.world.removeChild(h), audioEnabled && me.audio.play("powerup")) : (game.data.score += DOT_POINTS, 0 < DOT_ANIMATION_PICKUP.length ? h.setCurrentAnimation("pick", function() {
                    me.game.world.removeChild(h);
                    return !1
                }.bind(this)) : me.game.world.removeChild(h), audioEnabled && me.audio.play("dot")), game.data.dotArray[b][d] = 0, game.data.dotCounter -= 1, 0 === game.data.dotCounter && (this.state = "done"));
                game.data.playerIsHunter && game.data.hunterTimer <
                    me.timer.getTime() && (game.data.playerIsHunter = !1, this.mode = "", audioEnabled && me.audio.play("powerdown"));
                if (0 === this.body.vel.x && 0 === this.body.vel.y) switch (this.direction) {
                    case 2:
                        this.renderable.isCurrentAnimation("down_stand" + this.mode) || this.renderable.setCurrentAnimation("down_stand" + this.mode);
                        break;
                    case 8:
                        this.renderable.isCurrentAnimation("up_stand" + this.mode) || this.renderable.setCurrentAnimation("up_stand" + this.mode);
                        break;
                    case 1:
                        this.renderable.isCurrentAnimation("left_stand" + this.mode) || this.renderable.setCurrentAnimation("left_stand" +
                            this.mode);
                        break;
                    case 4:
                        this.renderable.isCurrentAnimation("right_stand" + this.mode) || this.renderable.setCurrentAnimation("right_stand" + this.mode)
                }
                updateCollisionArray(this);
                break;
            case "die":
                game.data.running = !1, this.body.vel.x = 0, this.body.vel.y = 0, this.renderable.isCurrentAnimation("die") || this.renderable.setCurrentAnimation("die"), musicEnabled && me.audio.stopTrack("soundtrack"), 0 < game.data.lives ? setTimeout(function() {
                    ADS_ON_DEATH ? navigator.isCocoonJS ? (ads.interstitialAlreadyDownloaded && (Cocoon.Ad.showInterstitial(),
                        console.info("mostra fullscreen")), me.state.change(me.state.PLAY)) : me.state.change(me.state.USER + 6) : me.state.change(me.state.PLAY)
                }, 3E3) : setTimeout(function() {
                    game.data.targets = 0;
                    me.state.change(me.state.GAMEOVER)
                }, 3E3), game.data.lives -= 1, this.state = "wait"
        }
        this.body.update();
        this._super(me.Entity, "update", [a]);
        return !0
    }
});
game.ExitEntity = me.Entity.extend({
    init: function(a, b, d) {
        this._super(me.Entity, "init", [a, b, d]);
        this.layers = me.game.currentLevel.getLayers();
        this.alwaysUpdate = !0;
        this.name = "exit";
        this.type = 0;
        this.c = Math.floor((a + 1) / 64);
        this.r = Math.floor((b + 1) / 64);
        this.w = Math.floor((d.width + 1) / 64);
        this.h = Math.floor((d.height + 1) / 64);
        this.Ground_switch = me.game.currentLevel.getLayerByName("Grnd_switch");
        this.Collision_switch = me.game.currentLevel.getLayerByName("Coll_switch");
        this.Ground = me.game.currentLevel.getLayerByName("Ground");
        this.Collision = me.game.currentLevel.getLayerByName("Collision")
    },
    update: function(a) {
        if (0 == game.data.surviviorsCounter) {
            game.data.surviviorsCounter = -1;
            registerToRadarAndCollisions(this);
            for (a = this.c; a < this.c + this.w; a++)
                for (var b = this.r; b < this.r + this.h; b++) {
                    var d = this.Ground_switch.getTileId(64 * a + 1, 64 * b + 1);
                    null != d && (console.info(d), this.Ground.clearTile(a, b), this.Ground.setTile(a, b, d));
                    d = this.Collision_switch.getTileId(64 * a + 1, 64 * b + 1);
                    null != d && (this.Collision.clearTile(a, b), this.Collision.setTile(a,
                        b, d))
                }
            me.game.repaint()
        }
    }
});
var debug = me.Renderable.extend({
        init: function(a) {
            this.self = a;
            this.image = me.loader.getImage("head");
            this._super(me.Renderable, "init", [0, 0, 10, 10]);
            this.floating = !0;
            this.sprite_size = 16
        },
        draw: function(a) {
            var b = 0,
                d = 0,
                e = Path.cols,
                f = Path.rows;
            for (c = 0; c < e; c++)
                for (r = 0; r < f; r++) game.data.collisionArray[c][r] === game.data.PLAYER_OBJECT && (b = 32 * c, d = 32 * r);
            a.drawImage(this.image, 0, 0, this.sprite_size, this.sprite_size, b, d, this.sprite_size, this.sprite_size)
        }
    }),
    arrows = me.Renderable.extend({
        init: function(a) {
            this.self = a;
            this.image = me.loader.getImage("arrows");
            this._super(me.Renderable, "init", [0, 0, 10, 10]);
            this.floating = !0;
            this.sprite_size = 128;
            this.sinistra = real_widthGame / 2 - widthGame / 2;
            this.destra = real_widthGame / 2 + widthGame / 2 - this.sprite_size;
            this.alto = real_heightGame / 2 - heightGame / 2;
            this.basso = real_heightGame / 2 + heightGame / 2 - this.sprite_size;
            this.centerH = real_widthGame / 2 - this.sprite_size / 2;
            this.centerV = real_heightGame / 2 - this.sprite_size / 2
        },
        draw: function(a) {
            if (this.self.direction != this.self.wantedDirection) switch (this.self.wantedDirection) {
                case 8:
                    a.drawImage(this.image,
                        0, 0, this.sprite_size, this.sprite_size, this.centerH, this.alto, this.sprite_size, this.sprite_size);
                    break;
                case 4:
                    a.drawImage(this.image, this.sprite_size, 0, this.sprite_size, this.sprite_size, this.destra, this.centerV, this.sprite_size, this.sprite_size);
                    break;
                case 2:
                    a.drawImage(this.image, 2 * this.sprite_size, 0, this.sprite_size, this.sprite_size, this.centerH, this.basso, this.sprite_size, this.sprite_size);
                    break;
                case 1:
                    a.drawImage(this.image, 3 * this.sprite_size, 0, this.sprite_size, this.sprite_size, this.sinistra, this.centerV,
                        this.sprite_size, this.sprite_size)
            }
        }
    }),
    butt_home_pause = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "home_button",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings])
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            me.input.triggerKeyEvent(me.input.KEY.P, !0);
            audioEnabled &&
                me.audio.stopTrack("soundtrack");
            me.state.change(me.state.MENU);
            return !0
        }
    }),
    butt_continue_pause = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "continue_button",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings])
        },
        onClick: function() {
            me.input.triggerKeyEvent(me.input.KEY.P, !0);
            audioEnabled && me.audio.play("click");
            return !0
        }
    }),
    butt_submit_score_pause = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "butt_submit_score",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings])
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            me.input.triggerKeyEvent(me.input.KEY.P, !0);
            audioEnabled && me.audio.stopTrack("soundtrack");
            me.state.change(me.state.USER + 4);
            return !0
        }
    });
game.HUD = game.HUD || {};
game.HUD.Container = me.Container.extend({
    init: function() {
        this._super(me.Container, "init");
        this.isPersistent = !0;
        this.collidable = !1;
        this.z = Infinity;
        this.name = "HUD";
        this.w = me.video.renderer.getWidth();
        this.h = me.video.renderer.getHeight();
        "upper" === HUD_POSITION ? (this.addChild(new game.HUD.ScoreItem(me.video.renderer.getWidth() - 10, 10)), this.addChild(new game.HUD.LivesItem_graphic(10, 10)), this.addChild(new butt_pause(me.video.renderer.getWidth() / 2, 0))) : (this.addChild(new game.HUD.ScoreItem(me.video.renderer.getWidth() -
            10, me.video.renderer.getHeight() - 20)), this.addChild(new game.HUD.LivesItem_graphic(10, me.video.renderer.getHeight() - 20)), this.addChild(new butt_pause(me.video.renderer.getWidth() / 2 - 40, me.video.renderer.getHeight() - 20)));
        this.addChild(new game.HUD.TextItem);
        me.video.renderer.getHeight();
        me.device.isMobile && (virtualGamepad ? me.game.world.addChild(new tap, 999) : me.game.world.addChild(new swipe, 999))
    }
});
game.HUD.RadarItem = me.Renderable.extend({
    init: function(a, b, d) {
        this._super(me.Renderable, "init", [a, b, 10, 10]);
        this.floating = !0;
        this.image = me.loader.getImage("radar");
        this.block_size = 4;
        this.radarUnitSize = d;
        this.radar_size = Path.cols * this.radarUnitSize;
        this.blink = 0
    },
    draw: function(a) {
        a.drawImage(this.image, 4, 0, this.block_size, this.block_size, 0, 0, this.radar_size, this.radar_size);
        device_portrait_orientated ? a.drawImage(this.image, 0, 0, this.block_size, this.block_size, this.radar_size, 0, widthGame, this.radar_size) :
            a.drawImage(this.image, 0, 0, this.block_size, this.block_size, 0, this.radar_size, this.radar_size, heightGame);
        this.blink += 1;
        9 < this.blink && (this.blink = 0);
        for (var b = 0; b < game.data.radarEntities.length; b++) {
            var d = Math.floor(game.data.radarEntities[b].pos.x / (64 / this.radarUnitSize)),
                e = Math.floor(game.data.radarEntities[b].pos.y / (64 / this.radarUnitSize));
            if ("player" == game.data.radarEntities[b].name) var f = 8,
                g = 0;
            "survivor" == game.data.radarEntities[b].name && (f = 12, g = 0);
            "enemy" == game.data.radarEntities[b].name && (f =
                16, g = 0);
            "exit" == game.data.radarEntities[b].name && (f = 8, g = 6);
            this.blink >= g && a.drawImage(this.image, f, 0, this.block_size, this.block_size, d, e, this.block_size, this.block_size)
        }
    }
});
game.HUD.ScoreItem = me.Renderable.extend({
    init: function(a, b) {
        this._super(me.Renderable, "init", [a, b, 10, 10]);
        this.font = new me.BitmapFont("bitmap_font", lowres ? 16 : 32);
        this.font.set("right");
        this.score = -1;
        this.floating = !0
    },
    update: function() {
        return this.score !== game.data.score ? (this.score = game.data.score, !0) : !1
    },
    draw: function(a) {
        a.getContext();
        this.font.draw(a, game.data.score, this.pos.x, this.pos.y)
    }
});
game.HUD.LivesItem_textual = me.Renderable.extend({
    init: function(a, b) {
        this._super(me.Renderable, "init", [a, b, 10, 10]);
        this.font = new me.BitmapFont("bitmap_font", lowres ? 16 : 32);
        this.font.set("left");
        this.score = -1;
        this.floating = !0
    },
    update: function() {
        return this.lives !== game.data.lives ? (this.lives = game.data.lives, !0) : !1
    },
    draw: function(a) {
        a.getContext();
        this.font.draw(a, "P:" + (0 <= game.data.lives ? game.data.lives : 0), this.pos.x, this.pos.y)
    }
});
game.HUD.LivesItem_graphic = me.Renderable.extend({
    init: function(a, b) {
        this._super(me.Renderable, "init", [a, b, 10, 10]);
        this.lives = -1;
        this.floating = !0;
        this.image = me.loader.getImage("head")
    },
    update: function() {
        return this.lives !== game.data.lives ? (this.lives = game.data.lives, !0) : !1
    },
    draw: function(a) {
        for (var b = 0; b < game.data.lives; b++) a.drawImage(this.image, 5 + b * this.image.width, 5)
    }
});
game.HUD.TextItem = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, "init", [0, 0, 10, 10]);
        this.font = prepareFont(parseInt(widthGame / 24));
        this.font2 = prepareFont(parseInt(widthGame / 16));
        this.lives = -1;
        this.floating = !0;
        this.dj = me.loader.getImage("headDJ")
    },
    update: function() {
        return this.lives !== game.data.lives ? (this.lives = game.data.lives, !0) : !1
    },
    draw: function(a) {
        a = a.getContext();
        if ("getready" == game.data.text) {
            var b = local.level + " " + (game.data.levelNumberShift * me.levelDirector.levelCount() + game.data.level).toString();
            drawText(a, b, me.game.viewport.width / 2, me.game.viewport.height / 2 - 50, 460, this.font.font, this.font.shadow);
            b = me.device.isMobile ? local.start_mobile : local.start_desktop;
            drawText(a, b, me.game.viewport.width / 2, me.game.viewport.height / 2, 460, this.font2.font, this.font2.shadow);
            null != me.game.currentLevel.Title && (b = local.fire_to_start, drawText(a, b, me.game.viewport.width / 2, me.game.viewport.height / 2 + 50, 460, this.font2.font, this.font2.shadow))
        }
        "pause" == game.data.text && (b = local.pause, drawText(a, b, me.game.viewport.width /
            2, me.game.viewport.height / 2 - 50, 460, this.font2.font, this.font2.shadow))
    }
});
var butt_pause = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {};
            settings.image = me.loader.getImage("butt_pause");
            settings.spritewidth = settings.image.width;
            settings.spriteheight = settings.image.height;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b, settings]);
            me.input.registerPointerEvent("pointerdown", this, this.onStartEvent.bind(this));
            me.input.registerPointerEvent("pointerup", this, this.onEndEvent.bind(this))
        },
        onStartEvent: function(a) {
            me.input.triggerKeyEvent(me.input.KEY.P, !0)
        },
        onEndEvent: function(a) {
            me.input.triggerKeyEvent(me.input.KEY.P, !1)
        },
        destroy: function() {
            me.input.releasePointerEvent("pointerdown", this);
            me.input.releasePointerEvent("pointerup", this)
        }
    }),
    swipe = me.Renderable.extend({
        init: function() {
            this._super(me.Renderable, "init", [0, 0, 10, 10]);
            me.input.registerPointerEvent("pointerdown", new me.Rect(0, 0, widthGame, heightGame), this.onStartEvent.bind(this), !0);
            me.input.registerPointerEvent("pointerup", new me.Rect(0, 0, widthGame, heightGame), this.onEndEvent.bind(this), !0);
            me.input.registerPointerEvent("pointermove", new me.Rect(0, 0, widthGame,
                heightGame), this.onMoveEvent.bind(this), !0);
            this.startPos = new me.Vector2d
        },
        draw: function(a) {},
        onStartEvent: function(a) {
            a = a.changedTouches[0];
            this.startPos = me.input.globalToLocal(a.pageX, a.pageY);
            me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1);
            me.input.triggerKeyEvent(me.input.KEY.LEFT, !1);
            me.input.triggerKeyEvent(me.input.KEY.UP, !1);
            me.input.triggerKeyEvent(me.input.KEY.DOWN, !1)
        },
        onEndEvent: function(a) {
            a = a.changedTouches[0];
            var b = me.input.globalToLocal(a.pageX, a.pageY);
            a = this.startPos.x - b.x;
            b = this.startPos.y -
                b.y;
            if (10 < Math.abs(a) || 10 < Math.abs(b)) Math.abs(a) > Math.abs(b) ? 0 < a ? me.input.triggerKeyEvent(me.input.KEY.LEFT, !0) : me.input.triggerKeyEvent(me.input.KEY.RIGHT, !0) : 0 < b ? me.input.triggerKeyEvent(me.input.KEY.UP, !0) : me.input.triggerKeyEvent(me.input.KEY.DOWN, !0)
        },
        onMoveEvent: function(a) {
            a = a.changedTouches[0];
            a = me.input.globalToLocal(a.pageX, a.pageY);
            var b = this.startPos.x - a.x,
                d = this.startPos.y - a.y;
            if (10 < Math.abs(b) || 10 < Math.abs(d)) me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1), me.input.triggerKeyEvent(me.input.KEY.LEFT, !1), me.input.triggerKeyEvent(me.input.KEY.UP, !1), me.input.triggerKeyEvent(me.input.KEY.DOWN, !1), Math.abs(b) > Math.abs(d) ? 0 < b ? me.input.triggerKeyEvent(me.input.KEY.LEFT, !0) : me.input.triggerKeyEvent(me.input.KEY.RIGHT, !0) : 0 < d ? me.input.triggerKeyEvent(me.input.KEY.UP, !0) : me.input.triggerKeyEvent(me.input.KEY.DOWN, !0), this.startPos = a
        },
        destroy: function() {
            me.input.releasePointerEvent("pointerdown", this);
            me.input.releasePointerEvent("pointerup", this);
            me.input.releasePointerEvent("pointermove", this)
        }
    }),
    tap =
    me.Renderable.extend({
        init: function() {
            this.image = me.loader.getImage("arrows");
            this.parent(new me.Vector2d(0, 0), 10, 10);
            this.floating = !0;
            this.sprite_size = 128;
            me.input.registerPointerEvent("pointerdown", new me.Rect(0, 0, widthGame, heightGame), this.onStartEvent.bind(this), !0);
            me.input.registerPointerEvent("pointerup", new me.Rect(0, 0, widthGame, heightGame), this.onEndEvent.bind(this), !0)
        },
        onStartEvent: function(a) {
            a = a.changedTouches[0];
            var b = me.input.globalToLocal(a.pageX, a.pageY);
            a = widthGame / 2 - b.x;
            b = heightGame /
                2 - b.y;
            Math.abs(a) > Math.abs(b) ? 0 < a ? me.input.triggerKeyEvent(me.input.KEY.LEFT, !0) : me.input.triggerKeyEvent(me.input.KEY.RIGHT, !0) : 0 < b ? me.input.triggerKeyEvent(me.input.KEY.UP, !0) : me.input.triggerKeyEvent(me.input.KEY.DOWN, !0)
        },
        onEndEvent: function(a) {
            me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1);
            me.input.triggerKeyEvent(me.input.KEY.LEFT, !1);
            me.input.triggerKeyEvent(me.input.KEY.UP, !1);
            me.input.triggerKeyEvent(me.input.KEY.DOWN, !1)
        },
        draw: function(a) {
            me.input.isKeyPressed("up") ? a.drawImage(this.image,
                    0, 0, this.sprite_size, this.sprite_size, widthGame / 2 - this.sprite_size / 2, 0, this.sprite_size, this.sprite_size) : me.input.isKeyPressed("down") ? a.drawImage(this.image, 2 * this.sprite_size, 0, this.sprite_size, this.sprite_size, widthGame / 2 - this.sprite_size / 2, heightGame - this.sprite_size, this.sprite_size, this.sprite_size) : me.input.isKeyPressed("right") ? a.drawImage(this.image, this.sprite_size, 0, this.sprite_size, this.sprite_size, widthGame - this.sprite_size, heightGame / 2 - this.sprite_size / 2, this.sprite_size, this.sprite_size) :
                me.input.isKeyPressed("left") && a.drawImage(this.image, 3 * this.sprite_size, 0, this.sprite_size, this.sprite_size, 0, heightGame / 2 - this.sprite_size / 2, this.sprite_size, this.sprite_size)
        },
        destroy: function() {
            me.input.releasePointerEvent("pointerdown", this);
            me.input.releasePointerEvent("pointerup", this)
        }
    }),
    butt_a = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "butt_a",
                spritewidth: 50,
                spriteheight: 150
            };
            this.parent(a - 25, b - 100, settings);
            this.moveCallback = this.onMoveEvent.bind(this);
            me.event.subscribe("pointermove",
                this.moveCallback);
            me.input.registerPointerEvent("pointerdown", this, this.onStartEvent.bind(this));
            me.input.registerPointerEvent("pointerup", this, this.onEndEvent.bind(this));
            this.x = a;
            this.y = b - 100;
            this.butt_a = me.loader.getImage("butt_a");
            this.butt_a_dw = me.loader.getImage("butt_a_dw")
        },
        onMoveEvent: function(a) {
            a = a.changedTouches[0];
            a = me.input.globalToLocal(a.pageX, a.pageY);
            if (320 < a.x) {
                if (a.y < this.y || a.y > this.y + 150) me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1), me.input.triggerKeyEvent(me.input.KEY.LEFT, !1), this.image = this.butt_a, me.input.triggerKeyEvent(me.input.KEY.SPACE, !1);
                if (a.x > this.x + 150 || a.x < this.x) me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1), me.input.triggerKeyEvent(me.input.KEY.LEFT, !1), this.image = this.butt_a, me.input.triggerKeyEvent(me.input.KEY.SPACE, !1)
            }
        },
        onStartEvent: function(a) {
            me.input.triggerKeyEvent(me.input.KEY.SPACE, !0);
            this.image = this.butt_a_dw
        },
        onEndEvent: function(a) {
            me.input.triggerKeyEvent(me.input.KEY.SPACE, !1);
            this.image = this.butt_a
        },
        destroy: function() {
            me.event.unsubscribe("pointermove",
                this.moveCallback);
            me.input.releasePointerEvent("pointerdown", this);
            me.input.releasePointerEvent("pointerup", this)
        }
    }),
    butt_dxsx = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "butt_dxsx",
                spritewidth: 120,
                spriteheight: 150
            };
            this.parent(a, b - 100, settings);
            this.moveCallback = this.onMoveEvent.bind(this);
            me.event.subscribe("pointermove", this.moveCallback);
            me.input.registerPointerEvent("pointerdown", this, this.onStartEvent.bind(this));
            me.input.registerPointerEvent("pointerup", this, this.onEndEvent.bind(this));
            this.x = a;
            this.y = b - 100;
            this.width = settings.spritewidth;
            this.height = settings.spriteheight;
            this.tap = !1;
            this.image_xx = me.loader.getImage("butt_dxsx");
            this.image_sx = me.loader.getImage("butt_dxsx_sx");
            this.image_dx = me.loader.getImage("butt_dxsx_dx")
        },
        onMoveEvent: function(a) {
            if (this.tap && (a = a.changedTouches[0], a = me.input.globalToLocal(a.pageX, a.pageY), 320 > a.x)) {
                a.x > this.x + this.width / 2 ? (me.input.triggerKeyEvent(me.input.KEY.RIGHT, !0), me.input.triggerKeyEvent(me.input.KEY.LEFT, !1), this.image = this.image_dx) :
                    (me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1), me.input.triggerKeyEvent(me.input.KEY.LEFT, !0), this.image = this.image_sx);
                if (a.y < this.y || a.y > this.y + this.height) me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1), me.input.triggerKeyEvent(me.input.KEY.LEFT, !1), this.image = this.image_xx;
                if (a.x > this.x + this.width || a.x < this.x) me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1), me.input.triggerKeyEvent(me.input.KEY.LEFT, !1), this.image = this.image_xx
            }
        },
        onStartEvent: function(a) {
            a.gameX > this.x + this.width / 2 ? (me.input.triggerKeyEvent(me.input.KEY.RIGHT, !0), me.input.triggerKeyEvent(me.input.KEY.LEFT, !1), this.image = this.image_dx) : (me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1), me.input.triggerKeyEvent(me.input.KEY.LEFT, !0), this.image = this.image_sx);
            this.tap = !0
        },
        onEndEvent: function(a) {
            me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1);
            me.input.triggerKeyEvent(me.input.KEY.LEFT, !1);
            this.tap = !1;
            this.image = this.image_xx
        },
        destroy: function() {
            me.event.unsubscribe("pointermove", this.moveCallback);
            me.input.releasePointerEvent("pointerdown", this);
            me.input.releasePointerEvent("pointerup",
                this)
        }
    }),
    tapswipe = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "bg"
            };
            settings.spritewidth = me.video.getWidth();
            settings.spriteheight = me.video.getHeight();
            this.parent(0, 0, settings);
            this.moveCallback = this.onMoveEvent.bind(this);
            me.event.subscribe("pointermove", this.moveCallback);
            me.input.registerPointerEvent("pointerdown", this, this.onStartEvent.bind(this));
            me.input.registerPointerEvent("pointerup", this, this.onEndEvent.bind(this));
            this.x = a;
            this.y = b;
            this.width = settings.spritewidth;
            this.height =
                settings.spriteheight;
            this.image_xx = me.loader.getImage("butt_dxsx");
            this.image_sx = me.loader.getImage("butt_dxsx_sx");
            this.image_dx = me.loader.getImage("butt_dxsx_dx");
            this.butt_up_off = me.loader.getImage("butt_up_off");
            this.image_up = me.loader.getImage("butt_up_on");
            this.tap = [];
            this.currentPos = [];
            this.startPos = [];
            this.directionalTouch = !1
        },
        draw: function(a) {
            for (var b = 0; b < this.tap.length; b++) this.tap[b] && (this.image != this.image_xx && this.image != this.image_sx && this.image != this.image_dx || "move" != this.tap[b] ?
                this.image == this.image_up && a.drawImage(this.image, this.startPos[b].x - 25, this.startPos[b].y - 75) : a.drawImage(this.image, this.startPos[b].x - 60, this.startPos[b].y - 125))
        },
        onMoveEvent: function(a) {
            for (var b = 0; b < a.changedTouches.length; b++) {
                var d = a.changedTouches[b],
                    e = d.identifier,
                    d = me.input.globalToLocal(d.pageX, d.pageY);
                this.currentPos[e] = d;
                if (this.directionalTouch == e || !1 == this.directionalTouch) 6 < d.x - this.startPos[e].x ? (me.input.triggerKeyEvent(me.input.KEY.RIGHT, !0), me.input.triggerKeyEvent(me.input.KEY.LEFT, !1), this.image = this.image_dx, this.tap[e] = "move", this.directionalTouch = e) : -6 > d.x - this.startPos[e].x ? (me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1), me.input.triggerKeyEvent(me.input.KEY.LEFT, !0), this.image = this.image_sx, this.tap[e] = "move", this.directionalTouch = e) : (me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1), me.input.triggerKeyEvent(me.input.KEY.LEFT, !1), this.image = this.image_xx)
            }
        },
        onStartEvent: function(a) {
            for (var b = 0; b < a.changedTouches.length; b++) {
                var d = a.changedTouches[b],
                    e = d.identifier,
                    d = me.input.globalToLocal(d.pageX,
                        d.pageY);
                me.input.triggerKeyEvent(me.input.KEY.SPACE, !1);
                this.startPos[e] = d;
                this.tap[e] = !0
            }
        },
        onEndEvent: function(a) {
            for (var b = 0; b < a.changedTouches.length; b++) {
                var d = a.changedTouches[b],
                    e = d.identifier;
                me.input.globalToLocal(d.pageX, d.pageY);
                "move" != this.tap[e] ? (me.input.triggerKeyEvent(me.input.KEY.SPACE, !0), this.image = "") : me.input.triggerKeyEvent(me.input.KEY.SPACE, !1);
                me.input.triggerKeyEvent(me.input.KEY.RIGHT, !1);
                me.input.triggerKeyEvent(me.input.KEY.LEFT, !1);
                this.tap[e] = !1;
                this.directionalTouch ==
                    e && (this.directionalTouch = !1);
                this.image = ""
            }
        },
        destroy: function() {
            me.event.unsubscribe("pointermove", this.moveCallback);
            me.input.releasePointerEvent("pointerdown", this);
            me.input.releasePointerEvent("pointerup", this)
        }
    });
game.EnemyEntity = me.Entity.extend({
    init: function(a, b, d) {
        Path = me.game.currentLevel.getLayerByName("Path");
        this.enemyType = d.type;
        this.image = me.loader.getImage(this.enemyType);
        d.image = this.image;
        d.spritewidth = 32;
        d.spriteheight = 32;
        d.width = d.spritewidth;
        d.height = d.spriteheight;
        this.initialX = a;
        this.initialY = b;
        this._super(me.Entity, "init", [a, b, d]);
        this.behavior = null != d.behavior ? d.behavior : "random";
        this.respawnTimer = null != d.delay ? me.timer.getTime() + parseInt(d.delay) : 0;
        this.renderable.addAnimation("up", ENEMY_ANIMATION_NORMAL_UP_WALK,
            60);
        this.renderable.addAnimation("down", ENEMY_ANIMATION_NORMAL_DOWN_WALK, 60);
        this.renderable.addAnimation("right", ENEMY_ANIMATION_NORMAL_RIGHT_WALK, 60);
        this.renderable.addAnimation("left", ENEMY_ANIMATION_NORMAL_LEFT_WALK, 60);
        this.renderable.addAnimation("up_attack", ENEMY_ANIMATION_ATTACK_UP_WALK, 60);
        this.renderable.addAnimation("down_attack", ENEMY_ANIMATION_ATTACK_DOWN_WALK, 60);
        this.renderable.addAnimation("right_attack", ENEMY_ANIMATION_ATTACK_RIGHT_WALK, 60);
        this.renderable.addAnimation("left_attack",
            ENEMY_ANIMATION_ATTACK_LEFT_WALK, 60);
        this.renderable.addAnimation("up_bite", ENEMY_ANIMATION_BITE_UP_WALK, 60);
        this.renderable.addAnimation("down_bite", ENEMY_ANIMATION_BITE_DOWN_WALK, 60);
        this.renderable.addAnimation("right_bite", ENEMY_ANIMATION_BITE_RIGHT_WALK, 60);
        this.renderable.addAnimation("left_bite", ENEMY_ANIMATION_BITE_LEFT_WALK, 60);
        this.renderable.addAnimation("up_scared", ENEMY_ANIMATION_SCARED_UP_WALK, 60);
        this.renderable.addAnimation("down_scared", ENEMY_ANIMATION_SCARED_DOWN_WALK, 60);
        this.renderable.addAnimation("right_scared",
            ENEMY_ANIMATION_SCARED_RIGHT_WALK, 60);
        this.renderable.addAnimation("left_scared", ENEMY_ANIMATION_SCARED_LEFT_WALK, 60);
        this.renderable.addAnimation("up_transition", ENEMY_ANIMATION_ENDING_UP_WALK, 60);
        this.renderable.addAnimation("down_transition", ENEMY_ANIMATION_ENDING_DOWN_WALK, 60);
        this.renderable.addAnimation("right_transition", ENEMY_ANIMATION_ENDING_RIGHT_WALK, 60);
        this.renderable.addAnimation("left_transition", ENEMY_ANIMATION_ENDING_LEFT_WALK, 60);
        this.collidable = !1;
        this.name = "enemy";
        this.type = game.data.ENEMY_OBJECT;
        this.body.gravity = 0;
        this.body.setVelocity(999, 999);
        this.alwaysUpdate = !1;
        this.directions = [8, 4, 2, 1];
        this.wantedDirection = 0;
        a = getTile(this);
        do this.direction = this.directions[Math.floor(4 * Math.random())]; while (0 == (this.direction & a) && 0 != a);
        switch (this.direction) {
            case 8:
                this.renderable.setCurrentAnimation("up");
                break;
            case 4:
                this.renderable.setCurrentAnimation("right");
                break;
            case 2:
                this.renderable.setCurrentAnimation("down");
                break;
            case 1:
                this.renderable.setCurrentAnimation("left")
        }
        this.initialDirection =
            this.direction;
        this.state = "idle";
        this.aiTimer = 0;
        this.aiMinTime = 500;
        this.aiMaxTime = 1E3;
        registerToRadarAndCollisions(this);
        this.nextTileType = this.currentTileType = 0;
        this.attack = !1;
        this.velocity = null != d.velocity ? parseInt(d.velocity) : ENEMY_VELOCITY / MAX_FPS;
        this.powerupVelocity = null != d.powerup_velocity ? parseInt(d.powerup_velocity) : ENEMY_VELOCITY_ON__POWER_UP / MAX_FPS;
        this.mode = ""
    },
    update: function(a) {
        switch (this.state) {
            case "idle":
                this.respawnTimer < me.timer.getTime() && (this.state = "running");
                break;
            case "running":
                if (game.data.running) {
                    game.data.playerIsHunter ?
                        game.data.hunterTimer - me.timer.getTime() < ENDING_POWER_UP_ALERT ? this.mode = "_transition" : this.mode = "_scared" : this.mode = "";
                    var b = 0,
                        d = getTile(this);
                    if (this.aiTimer < me.timer.getTime() || 0 == this.body.vel.x && 0 == this.body.vel.y)
                        if (this.aiTimer = me.timer.getTime() + this.aiMinTime + Math.random() * (this.aiMaxTime - this.aiMinTime), "random" == this.behavior)
                            for (b = this.directions[Math.floor(4 * Math.random())]; 0 == (b & d) && 0 != d;) b = this.directions[Math.floor(4 * Math.random())];
                        else if (0.5 < Math.random() ? ((this.pos.y + 16) / 32 > (game.data.player.pos.y +
                            16) / 32 && (b = 8), (this.pos.y + 16) / 32 < (game.data.player.pos.y + 16) / 32 && (b = 2)) : ((this.pos.x + 16) / 32 > (game.data.player.pos.x + 16) / 32 && (b = 1), (this.pos.x + 16) / 32 < (game.data.player.pos.x + 16) / 32 && (b = 4)), 0 == (b & d) && 0 == this.body.vel.x && 0 == this.body.vel.y)
                        for (b = this.directions[Math.floor(4 * Math.random())]; 0 == (b & d) && 0 != d;) b = this.directions[Math.floor(4 * Math.random())];
                    if (ENEMIES_USE_TELEPORT) {
                        var d = Math.floor((this.pos.x + 16) / 32),
                            e = Math.floor((this.pos.y + 16) / 32);
                        if ("undefined" !== typeof game.data.teleportArray)
                            if (d = game.data.teleportArray[d][e],
                                0 !== d) {
                                var e = Math.abs(32 * Math.floor((this.pos.x + 16) / 32) - this.pos.x),
                                    f = Math.abs(32 * Math.floor((this.pos.y + 16) / 32) - this.pos.y);
                                4 > e && 4 > f && (console.info("cell destination: " + d.destination, "cell id: " + d.id, "this pos: " + game.data.teleportList[d.id], "destination pos: " + game.data.teleportList[d.destination], "trigger: " + this.teleportTrigger), "allowed" === this.teleportTrigger && (this.teleportTrigger = "denied", d = d.destination, e = game.data.teleportList[d], this.pos.x = e[0], this.pos.y = e[1], console.info(d, e, game.data.teleportList)))
                            } else this.teleportTrigger =
                                "allowed"
                    }
                    getAheadCollisionArray(this) == game.data.PLAYER_OBJECT ? this.attack || game.data.playerIsHunter || (this.attack = !0, audioEnabled && me.audio.play("growl"), this.mode = "_attack", this.renderable.isCurrentAnimation("up") && this.renderable.setCurrentAnimation("up_attack"), this.renderable.isCurrentAnimation("down") && this.renderable.setCurrentAnimation("down_attack"), this.renderable.isCurrentAnimation("left") && this.renderable.setCurrentAnimation("left_attack"), this.renderable.isCurrentAnimation("right") &&
                        this.renderable.setCurrentAnimation("right_attack")) : this.attack = !1;
                    if (getCurrentCollisionArray(this) === game.data.PLAYER_OBJECT && 32 > this.pos.distance(game.data.player.pos))
                        if (game.data.playerIsHunter) {
                            if (POWER_UP_KILLS_ENEMIES) {
                                game.data.score += ENEMY_POINTS;
                                me.game.world.addChild(new game.EnemyPointsEntity(this.pos.x, this.pos.y, ENEMY_POINTS), 999);
                                if ("respawn" === ON_DEAD_ENEMY_ACTION) switch (this.pos.x = this.initialX, this.pos.y = this.initialY, this.respawnTimer = me.timer.getTime() + ENEMY_RESPAWN_TIME, this.body.vel.x =
                                    0, this.body.vel.y = 0, this.state = "idle", this.mode = "", this.direction = this.initialDirection, this.direction) {
                                    case 8:
                                        this.renderable.setCurrentAnimation("up");
                                        break;
                                    case 4:
                                        this.renderable.setCurrentAnimation("right");
                                        break;
                                    case 2:
                                        this.renderable.setCurrentAnimation("down");
                                        break;
                                    case 1:
                                        this.renderable.setCurrentAnimation("left")
                                } else me.game.world.removeChild(this);
                                audioEnabled && me.audio.play("killenemy")
                            }
                        } else(this.renderable.isCurrentAnimation("up") || this.renderable.isCurrentAnimation("up_attack")) &&
                            this.renderable.setCurrentAnimation("up_bite"), (this.renderable.isCurrentAnimation("down") || this.renderable.isCurrentAnimation("down_attack")) && this.renderable.setCurrentAnimation("down_bite"), (this.renderable.isCurrentAnimation("left") || this.renderable.isCurrentAnimation("left_attack")) && this.renderable.setCurrentAnimation("left_bite"), (this.renderable.isCurrentAnimation("right") || this.renderable.isCurrentAnimation("right_attack")) && this.renderable.setCurrentAnimation("right_bite"), audioEnabled &&
                            me.audio.play("dead"), game.data.player.state = "die";
                    entityManager(this, b);
                    this.body.update()
                } else this.body.vel.x = 0, this.body.vel.y = 0
        }
        this._super(me.Entity, "update", [a]);
        return !0
    }
});
game.EnemyPointsEntity = me.Renderable.extend({
    init: function(a, b, d) {
        this._super(me.Renderable, "init", [a, b, 10, 10]);
        this.font = new me.BitmapFont("bitmap_font", 16);
        this.font.set("center");
        this.value = d;
        this.life = 0
    },
    update: function() {
        20 > this.life ? (this.pos.y -= 1, this.life++) : me.game.world.removeChild(this);
        return !0
    },
    draw: function(a) {
        this.font.draw(a, this.value, this.pos.x, this.pos.y)
    }
});
game.dotEntity = me.AnimationSheet.extend({
    init: function(a, b, d) {
        Path = me.game.currentLevel.getLayerByName("Path");
        this.image = me.loader.getImage("dots");
        d.image = this.image;
        d.spritewidth = 32;
        d.spriteheight = 32;
        d.width = d.spritewidth;
        d.height = d.spriteheight;
        this._super(me.AnimationSheet, "init", [a, b, {
            image: this.image,
            spritewidth: 32,
            spriteheight: 32
        }]);
        this.addAnimation("idle", DOT_ANIMATION_LOOP, 80);
        this.addAnimation("pick", DOT_ANIMATION_PICKUP, 80);
        this.setCurrentAnimation("idle");
        this.setAnimationFrame(Math.floor(Math.random() *
            DOT_ANIMATION_LOOP.length));
        this.state = "idle";
        this.name = "dot";
        this.alwaysUpdate = !1;
        addToDotsArray(this)
    }
});
game.pillEntity = me.AnimationSheet.extend({
    init: function(a, b, d) {
        Path = me.game.currentLevel.getLayerByName("Path");
        this.image = me.loader.getImage("pills");
        d.image = this.image;
        d.spritewidth = 32;
        d.spriteheight = 32;
        d.width = d.spritewidth;
        d.height = d.spriteheight;
        this._super(me.AnimationSheet, "init", [a, b, {
            image: this.image,
            spritewidth: 32,
            spriteheight: 32
        }]);
        this.addAnimation("idle", PILL_ANIMATION_LOOP, 80);
        this.addAnimation("pick", PILL_ANIMATION_PICKUP, 80);
        this.setCurrentAnimation("idle");
        this.setAnimationFrame(Math.floor(Math.random() *
            PILL_ANIMATION_LOOP.length));
        this.state = "idle";
        this.name = "pill";
        this.alwaysUpdate = !1;
        addToDotsArray(this)
    }
});

function addToDotsArray(a) {
    var b = Path.cols,
        d = Path.rows;
    if (0 === game.data.dotCounter)
        for ("undefined" == typeof game.data.dotArray ? game.data.dotArray = [] : game.data.dotArray.length = 0, c = 0; c < b; c++)
            for (game.data.dotArray[c] = [], r = 0; r < d; r++) game.data.dotArray[c].push(0);
    game.data.dotArray[Math.floor((a.pos.x + 16) / 32)][Math.floor((a.pos.y + 16) / 32)] = a;
    game.data.dotCounter += 1
}
game.teleportEntity = me.Renderable.extend({
    init: function(a, b, d) {
        Path = me.game.currentLevel.getLayerByName("Path");
        this._super(me.Renderable, "init", [a, b, 32, 32]);
        this.name = "teleport";
        null != d.id ? this.id = parseInt(d.id) : alert("You must assign 'id' property to teleport entity");
        null != d.destination ? this.destination = parseInt(d.destination) : alert("You must assign 'send_to' property to teleport entity");
        addToTeleportArray(this)
    }
});

function addToTeleportArray(a) {
    var b = Path.cols,
        d = Path.rows;
    if (0 == game.data.teleportCounter) {
        "undefined" == typeof game.data.teleportArray ? game.data.teleportArray = [] : game.data.teleportArray.length = 0;
        for (c = 0; c < b; c++)
            for (game.data.teleportArray[c] = [], r = 0; r < d; r++) game.data.teleportArray[c].push(0);
        "undefined" == typeof game.data.teleportList ? game.data.teleportList = [] : game.data.teleportList.length = 0
    }
    game.data.teleportArray[Math.floor((a.pos.x + 16) / 32)][Math.floor((a.pos.y + 16) / 32)] = a;
    game.data.teleportList[a.id] = [a.pos.x, a.pos.y];
    game.data.teleportCounter += 1
}
var ProgressBar = me.Renderable.extend({
        init: function(a, b, d) {
            me.Renderable.prototype.init.apply(this, [a.x, a.y, b, d]);
            this.invalidate = !1;
            this.barHeight = 4;
            this.progress = 0
        },
        onProgressUpdate: function(a) {
            this.progress = Math.floor(a * this.width);
            this.invalidate = !0
        },
        update: function() {
            return !0 === this.invalidate ? (this.invalidate = !1, !0) : !1
        },
        draw: function(a) {
            a = a.getContext();
            a.fillStyle = "black";
            a.fillRect(0, this.height / 2 - this.barHeight / 2 + GAME_NAME_1_SIZE + GAME_NAME_2_SIZE + 10, this.width, this.barHeight);
            a.fillStyle =
                LOADING_BAR_COLOR;
            a.fillRect(2, this.height / 2 - this.barHeight / 2 + GAME_NAME_1_SIZE + GAME_NAME_2_SIZE + 10, this.progress, this.barHeight)
        }
    }),
    TextLogo = me.Renderable.extend({
        init: function(a, b) {
            this._super(me.Renderable, "init", [0, 0, a, b]);
            this.logo1 = new me.Font("arial, helvetica, sans-serif", GAME_NAME_1_SIZE, GAME_NAME_1_COLOR, "middle");
            this.logo2 = new me.Font("arial, helvetica, sans-serif", GAME_NAME_2_SIZE, GAME_NAME_2_COLOR, "middle");
            this.logo2.bold()
        },
        draw: function(a) {
            a = a.getContext();
            var b = this.logo1.measureText(a,
                    GAME_NAME_1).width,
                d = this.logo2.measureText(a, GAME_NAME_2).width,
                b = (this.width - b) / 2,
                d = (this.width - d) / 2,
                e = this.height / 2,
                f = this.height / 2 + this.logo1.measureText(a, GAME_NAME_1).height;
            this.logo1.draw(a, GAME_NAME_1, b, e);
            this.logo2.draw(a, GAME_NAME_2, d, f)
        }
    }),
    CustomLoadingScreen = me.ScreenObject.extend({
        onResetEvent: function() {
            me.game.reset();
            me.game.world.addChild(new me.ColorLayer("background", LOADING_BG_COLOR, 0));
            var a = new ProgressBar(new me.Vector2d, me.video.renderer.getWidth(), me.video.renderer.getHeight());
            this.handle = me.event.subscribe(me.event.LOADER_PROGRESS, a.onProgressUpdate.bind(a));
            me.game.world.addChild(a, 1);
            me.game.world.addChild(new TextLogo(me.video.renderer.getWidth(), me.video.renderer.getHeight()), 1)
        },
        onDestroyEvent: function() {
            this.handle && (me.event.unsubscribe(this.handle), this.handle = null);
            "fgl" == platform && fgl.brandingEnabled && me.video.getWrapper().removeChild(this.branding)
        }
    });
game.MenuScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.video.renderer.getWidth();
        this.h = me.video.renderer.getHeight();
        var a = me.loader.getImage("gui_bg");
        this.background = new me.Sprite(this.w / 2 - a.width / 2, this.h / 2 - a.height / 2, a);
        me.game.world.addChild(this.background, 1);
        me.game.world.addChild(new maintitle(0.5 * this.w, 0.18 * this.h), 30);
        me.game.world.addChild(new cover(0.5 * this.w, 0.5 * this.h - 20), 30);
        a = 40;
        MORE_GAMES_BUTTON && (me.game.world.addChild(new menu_playmoregames(0.5 * this.w, this.h -
            a), 40), a += 60);
        HOW_TO_PLAY_BUTTON && (me.game.world.addChild(new menu_howtoplay(0.5 * this.w, this.h - a, 20), 40), a += 60);
        me.game.world.addChild(new menu_play(0.5 * this.w, this.h - a, 40), 40);
        var a = [
                [26, 26],
                [this.w - 26, 26],
                [26, 76],
                [this.w - 26, 76],
                [26, 126],
                [this.w - 26, 126]
            ],
            b = 0;
        TOGGLE_AUDIO_BUTTON && (me.game.world.addChild(new menu_audio(a[b][0], a[b][1]), 40), b++);
        INFORMATION_BUTTON && (me.game.world.addChild(new menu_info(a[b][0], a[b][1], "info_button"), 40), b++);
        FULLSCREEN_BUTTON && me.device.hasFullscreenSupport && !me.device.isMobile &&
            (me.game.world.addChild(new menu_fullscreen(a[b][0], a[b][1]), 40), b++);
        HISCORE_BUTTON && (me.game.world.addChild(new menu_hiscore(a[b][0], a[b][1], "hiscore_button"), 40), b++);
        FACEBOOK_BUTTON && me.game.world.addChild(new menu_facebook(a[b][0], a[b][1], "facebook_button"), 40);
        bookmarkBalloon && me.game.world.addChild(new bookmarkBalloonEntity(this.w / 2, 30), 40);
        audioEnabled && musicEnabled && null == me.audio.getCurrentTrack() && me.audio.playTrack("menu", 0.5)
    }
});
var generic_big_button = me.GUI_Object.extend({
        init: function(a, b, d) {
            var e = {};
            this.image = me.loader.getImage("menu_button");
            e.image = this.image;
            e.spritewidth = this.image.width;
            e.spriteheight = this.image.height;
            this.x = a - e.spritewidth / 2;
            this.y = b - e.spriteheight / 2;
            this.textx = a;
            this.texty = b;
            this.font = prepareFont(d);
            e.width = e.spritewidth;
            e.height = e.spriteheight;
            this._super(me.GUI_Object, "init", [a - e.spritewidth / 2, b - e.spriteheight / 2, e])
        }
    }),
    generic_small_button = me.GUI_Object.extend({
        init: function(a, b, d) {
            var e = {};
            this.image = "" != d ? me.loader.getImage(d) : me.loader.getImage("small_button");
            e.image = this.image;
            e.spritewidth = this.image.width;
            e.spriteheight = this.image.height;
            this.x = a - e.spritewidth / 2;
            this.y = b - e.spriteheight / 2;
            e.width = e.spritewidth;
            e.height = e.spriteheight;
            this._super(me.GUI_Object, "init", [a - e.spritewidth / 2, b - e.spriteheight / 2, e])
        }
    }),
    button_credits = me.GUI_Object.extend({
        init: function(a, b) {
            game.data.creditsSystem = !0;
            settings = {
                image: "credits_button",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth /
                2;
            this.y = b - settings.spriteheight / 2;
            this.textx = a;
            this.texty = b + 8;
            this.font = prepareFont(20);
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings]);
            var d = (new Date).getTime();
            try {
                if (me.save.add({
                        credits: 3
                    }), me.save.add({
                        lastplayed: d
                    }), game.data.credits = parseInt(me.save.credits), 864E5 < d - me.save.lastplayed) {
                    var e = 9 - game.data.credits;
                    3 < e && (e = 3);
                    0 < e && (addCredits(e), Alert(local.you_earned_credits.replace("#", e)));
                    me.save.lastplayed = d
                }
            } catch (f) {
                console.info("Error on local storage: " +
                    f.message + "\n\n"), game.data.credits = 3
            }!1 == game.data.showAds && 10 > game.data.credits && (game.data.showAds = !0)
        },
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            text = game.data.credits.toString();
            drawText(a, text, this.textx, this.texty, 200, this.font.font, this.font.shadow)
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            me.state.change(me.state.USER + 5);
            return !0
        }
    });

function addCredits(a) {
    game.data.credits += a;
    try {
        me.save.credits = game.data.credits
    } catch (b) {
        console.info("Error on local storage: " + b.message + "\n\n")
    }
}
var menu_play = generic_big_button.extend({
        init: function(a, b, d) {
            this._super(generic_big_button, "init", [a, b, d])
        },
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            game.data.targets = 0;
            game.data.numberOfBonus = 0;
            game.data.collectedBonus = 0;
            text = local.play;
            drawText(a, text, this.textx, this.texty, 200, this.font.font, this.font.shadow)
        },
        onClick: function() {
            0 < game.data.credits || "undefined" === typeof game.data.creditsSystem ? (game.data.score = 0, game.data.lives = 2, game.data.text = "", game.data.title =
                "", game.data.level = 1, game.data.running = !0, game.data.levelNumberShift = 0, USE_SELECT_LEVEL_SCREEN ? me.state.change(me.state.USER + 1) : (game.data.level = 1, me.state.change(me.state.PLAY), audioEnabled && me.audio.stopTrack("menu")), audioEnabled && me.audio.play("click")) : me.state.change(me.state.USER + 5);
            return !0
        }
    }),
    menu_howtoplay = generic_big_button.extend({
        init: function(a, b, d) {
            this._super(generic_big_button, "init", [a, b, d])
        },
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            text = local.how_to_play;
            drawText(a, text, this.textx, this.texty, 200, this.font.font, this.font.shadow)
        },
        onClick: function() {
            me.state.change(me.state.USER + 2);
            audioEnabled && me.audio.play("click");
            return !0
        }
    }),
    menu_playmoregames = me.GUI_Object.extend({
        init: function(a, b) {
            var d = {};
            this.image = me.loader.getImage("menu_button");
            d.image = this.image;
            d.spritewidth = this.image.width;
            d.spriteheight = this.image.height;
            this.x = a - d.spritewidth / 2;
            this.y = b - d.spriteheight / 2;
            this.textx = a;
            this.texty = b;
            this.font = prepareFont(20);
            d.width = d.spritewidth;
            d.height =
                d.spriteheight;
            this._super(me.GUI_Object, "init", [a - d.spritewidth / 2, b - d.spriteheight / 2, d]);
            "ludei" == platform ? (this.role = "rate", 0.5 < Math.random() && (this.role = "moregames"), 0 == game.data.credits && (this.role = "rate")) : this.role = "moregames"
        },
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            drawText(a, "facebook" == this.role ? local.facebook_connect : "moregames" == this.role ? local.play_more_games : "buy" == this.role ? local.buy_more_credits : local.rate_this_game, this.textx, this.texty, 250, this.font.font,
                this.font.shadow)
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            if ("facebook" == this.role) socialService.login(function(a, b) {
                b ? console.error("login error: " + b.message) : a ? console.log("login suceeded") : console.log("login cancelled")
            });
            else if ("moregames" == this.role) {
                var a = (new Date).getTime();
                try {
                    if (me.save.add({
                            lastmoregames: 0
                        }), 216E5 < a - me.save.lastmoregames) {
                        var b = 10 - game.data.credits;
                        1 < b && (b = 1);
                        0 < b && (addCredits(b), Alert(local.you_earned_credits.replace("#", b)));
                        me.save.lastmoregames = a
                    }
                } catch (d) {
                    console.info("Error on local storage: " +
                        d.message + "\n\n")
                }
                navigator.isCocoonJS ? Cocoon.App.openURL(MORE_GAMES_URL) : "web" == platform ? document.location.assign(MORE_GAMES_URL) : "fgl" == platform && fgl.showMoreGames()
            } else if ("buy" == this.role) Cocoon.Store.purchaseProduct("50_credits_pack");
            else {
                a = (new Date).getTime();
                try {
                    me.save.add({
                        lastrated: 0
                    }), 6048E5 < a - me.save.lastrated && (b = 99 - game.data.credits, 5 < b && (b = 5), 0 < b && (addCredits(b), Alert(local.you_earned_credits.replace("#", b))), me.save.lastrated = a)
                } catch (e) {
                    console.info("Error on local storage: " +
                        e.message + "\n\n")
                }
                /ios/.test(navigator.userAgent) ? Cocoon.App.openURL(IOS_RATING_URL) : /android/.test(navigator.userAgent) && Cocoon.App.openURL(ANDROID_RATING_URL)
            }
            return !0
        }
    }),
    menu_info = generic_small_button.extend({
        onClick: function() {
            audioEnabled && me.audio.play("click");
            me.state.change(me.state.USER + 3);
            return !0
        }
    }),
    menu_prefs = generic_small_button.extend({
        onClick: function() {
            audioEnabled && me.audio.play("click");
            me.state.change(me.state.USER + 7);
            return !0
        }
    }),
    menu_hiscore = generic_small_button.extend({
        onClick: function() {
            audioEnabled &&
                me.audio.play("click");
            "fgl" == platform ? fgl.displayScoreboard() : me.state.change(me.state.SCORE);
            return !0
        }
    }),
    menu_audio = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {};
            settings.image = audioEnabled ? "audio_on_button" : "audio_off_button";
            settings.spritewidth = 48;
            settings.spriteheight = 48;
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight /
                2, settings
            ]);
            this.image_on = me.loader.getImage("audio_on_button");
            this.image_off = me.loader.getImage("audio_off_button")
        },
        onClick: function() {
            me.device.wp || (audioEnabled ? (this.image = this.image_off, me.audio.muteAll(), audioEnabled = !1) : (this.image = this.image_on, me.audio.unmuteAll(), me.audio.play("click"), audioEnabled = !0));
            return !0
        }
    }),
    menu_fullscreen = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {};
            settings.image = audioEnabled ? "fullscreen_on_button" : "fullscreen_off_button";
            settings.spritewidth = 48;
            settings.spriteheight =
                48;
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings]);
            this.image_on = me.loader.getImage("fullscreen_on_button");
            this.image_off = me.loader.getImage("fullscreen_off_button")
        },
        draw: function(a) {
            a = a.getContext();
            this.image = me.device.isFullscreen ? this.image_off : this.image_on;
            a.drawImage(this.image, this.x, this.y)
        },
        onClick: function() {
            me.device.isFullscreen ?
                (audioEnabled && me.audio.play("click"), me.device.exitFullscreen()) : (audioEnabled && me.audio.play("click"), me.device.requestFullscreen());
            return !0
        }
    }),
    menu_facebook = generic_small_button.extend({
        draw: function(a) {
            a = a.getContext();
            var b = (new Date).getTime();
            me.save.add({
                lastshared: 0
            });
            var d = "undefined" == typeof me.save.lastshared ? b : me.save.lastshared;
            a.save();
            432E5 > b - d ? (a.globalAlpha = 0.4, this.isClickable = !1) : (a.globalAlpha = 1, this.isClickable = !0);
            a.drawImage(this.image, this.x, this.y);
            a.restore()
        },
        onClick: function() {
            audioEnabled &&
                me.audio.play("click");
            var a = local.facebook_share;
            if (navigator.isCocoonJS) {
                var b = new Cocoon.Social.Message(a, fbPic, gameUrl, gameName, FB_CAPTION);
                socialService.isLoggedIn() ? socialService.publishMessageWithDialog(b, function(a) {
                    a ? console.error("Error publishing message: " + a.message) : add_facebook_credits()
                }) : socialService.login(function(a, e) {
                    e ? console.error("login error: " + e.message) : a ? (console.log("login suceeded"), socialService.publishMessageWithDialog(b, function(a) {
                        a ? console.error("Error publishing message: " +
                            a.message) : add_facebook_credits()
                    })) : console.log("login cancelled")
                })
            } else FB.ui({
                method: "feed",
                link: gameUrl,
                picture: fbPic,
                caption: FB_CAPTION,
                name: gameName,
                description: a
            }, function(a) {
                a && !a.error_code ? add_facebook_credits() : console.info("Error while posting." + a.error_code)
            });
            return !0
        }
    });

function add_facebook_credits() {
    var a = (new Date).getTime();
    try {
        var b = 10 - game.data.credits;
        3 < b && (b = 3);
        0 < b && (addCredits(b), Alert(local.you_earned_credits.replace("#", b)), me.save.add({
            lastshared: 0
        }), me.save.lastshared = a)
    } catch (d) {
        console.info("Error on local storage: " + d.message + "\n\n")
    }
}
var menu_back = generic_big_button.extend({
        init: function(a, b, d) {
            this._super(generic_big_button, "init", [a, b, d])
        },
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            text = local.back;
            drawText(a, text, this.textx, this.texty, 200, this.font.font, this.font.shadow)
        },
        onClick: function() {
            me.state.change(me.state.MENU);
            audioEnabled && me.audio.play("click");
            return !0
        }
    }),
    maintitle = me.Renderable.extend({
        init: function(a, b) {
            this.image = me.loader.getImage("title");
            this.x = a - this.image.width / 2;
            this.y = b - this.image.height /
                2;
            this._super(me.Renderable, "init", [0, 0, 1, 1])
        },
        draw: function(a) {
            var b = a.getContext(),
                b = a.getContext();
            b.drawImage(this.image, this.x, this.y)
        }
    }),
    cover = me.Renderable.extend({
        init: function(a, b) {
            this.image = me.loader.getImage("cover");
            this.x = a - this.image.width / 2;
            this.y = b - this.image.height / 2;
            this._super(me.Renderable, "init", [0, 0, 1, 1])
        },
        draw: function(a) {
            var b = a.getContext(),
                b = a.getContext();
            b.drawImage(this.image, this.x, this.y)
        }
    }),
    bookmarkBalloonEntity = me.Renderable.extend({
        init: function(a, b) {
            this.image =
                me.loader.getImage("bookmarkballoon");
            settings.image = this.image;
            this.x = a - this.image.width / 2;
            this.y = b;
            this._super(me.Renderable, "init", [0, 0, 1, 1]);
            this.font = new me.Font("arial, helvetica, sans-serif", 16, "black", "left")
        },
        draw: function(a) {
            var b = a.getContext(),
                b = a.getContext();
            b.drawImage(this.image, this.x, this.y);
            drawText(b, local.add_to_home, this.x + 85, this.y + 25, 170, this.font)
        }
    }),
    fullversionEntity = me.Renderable.extend({
        init: function(a, b, d) {
            this.image = d ? me.loader.getImage("fullversion_mobile") : me.loader.getImage("fullversion");
            this.x = a;
            this.y = b;
            this._super(me.Renderable, "init", [0, 0, 1, 1])
        },
        draw: function(a) {
            var b = a.getContext(),
                b = a.getContext();
            b.drawImage(this.image, this.x, this.y)
        }
    }),
    Alert = function(a) {
        setTimeout(function() {
            me.game.world.addChild(new CustomAlert(a), 999)
        }, 1E3)
    },
    CustomAlert = me.GUI_Object.extend({
        init: function(a) {
            settings = {};
            this.text = a;
            this.w = me.video.renderer.getWidth();
            this.h = me.video.renderer.getHeight();
            this.image = me.loader.getImage("alert");
            settings.image = this.image;
            this.x = this.w / 2 - this.image.width / 2;
            this.y = this.h / 2 - this.image.height / 2;
            this.font = new me.Font("arial, helvetica, sans-serif", 18, "black", "center");
            settings.spritewidth = this.image.width;
            settings.spriteheight = this.image.height;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [this.x, this.y, settings])
        },
        onClick: function() {
            me.game.world.removeChild(this, !0);
            me.game.repaint()
        },
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            drawText(a, this.text, this.x + this.image.width /
                2, this.y + this.image.height / 2 - 40, 250, this.font)
        }
    });

function prepareFont(a, b) {
    "undefined" == typeof b && (b = "#ffffff");
    var d = new me.Font("arial, helvetica, sans-serif", a, b, "center"),
        e = new me.Font("arial, helvetica, sans-serif", a, "black", "center");
    d.textBaseline = "middle";
    e.textBaseline = "middle";
    d.bold();
    e.bold();
    return {
        font: d,
        shadow: e
    }
}

function drawText(a, b, d, e, f, g, k) {
    b = b.split("\n");
    var h = "";
    for (index = 0; index < b.length; ++index) {
        var l = b[index],
            p = g.measureText(a, l).width,
            p = Math.ceil(p / f);
        chWidth = l.length / p;
        for (var m = 0, q = 1; q < p; q++) {
            for (var n = 0;
                " " != l.charAt(parseInt(m + chWidth - n));) n++;
            m = parseInt(m + chWidth - n);
            l = l.replaceAt(m, "\n");
            if (q == p - 1 && (n = l.substr(m + 1, l.length), g.measureText(a, n).width > f)) {
                for (n = 0;
                    " " != l.charAt(m + chWidth - n);) n++;
                m = m + chWidth - n;
                l = l.replaceAt(m, "\n")
            }
        }
        h = h + l + "\n"
    }
    k && (k.draw(a, h, d - 1, e - 1), k.draw(a, h, d + 1, e - 1), k.draw(a,
        h, d - 1, e + 1), k.draw(a, h, d + 1, e + 1));
    g.draw(a, h, d, e)
}
String.prototype.replaceAt = function(a, b) {
    return this.substr(0, a) + b + this.substr(a + b.length)
};
var helpPage = 1;
game.HowToPlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.video.renderer.getWidth();
        this.h = me.video.renderer.getHeight();
        var a = me.loader.getImage("gui_bg");
        this.background = new me.Sprite(this.w / 2 - a.width / 2, this.h / 2 - a.height / 2, a);
        me.game.world.addChild(this.background, 1);
        a = me.loader.getImage("butt_left").width;
        me.game.world.addChild(new menu_left(a / 2 + 20, this.h - 40, "butt_left"), 4);
        me.game.world.addChild(new menu_right(this.w - a / 2 - 20, this.h - 40, "butt_right"), 4);
        lowres ? me.game.world.addChild(new helpImage(this.w,
            0), 10) : me.game.world.addChild(new helpImage(this.w, 60), 10);
        me.game.world.addChild(new helpText(this.w / 2, this.h / 2), 10);
        helpPage = 1
    }
});
var helpImage = me.Entity.extend({
        init: function(a, b) {
            settings = {};
            settings.image = me.loader.getImage("help_img");
            settings.spritewidth = 400;
            settings.spriteheight = 180;
            game.data.helpPages = settings.image.height / 180;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.Entity, "init", [a / 2 - settings.width / 2, b, settings]);
            this.renderable.addAnimation("1", [0]);
            this.renderable.addAnimation("2", [1]);
            this.renderable.addAnimation("3", [2]);
            this.renderable.addAnimation("4", [3]);
            this.renderable.addAnimation("5", [4])
        },
        update: function(a) {
            switch (helpPage) {
                case 1:
                    this.renderable.setCurrentAnimation("1");
                    break;
                case 2:
                    this.renderable.setCurrentAnimation("2");
                    break;
                case 3:
                    this.renderable.setCurrentAnimation("3");
                    break;
                case 4:
                    this.renderable.setCurrentAnimation("4");
                    break;
                case 5:
                    this.renderable.setCurrentAnimation("5")
            }
            this._super(me.Entity, "update", [a]);
            return !0
        }
    }),
    helpText = me.Renderable.extend({
        init: function(a, b) {
            this._super(me.Renderable, "init", [a, b, 10, 10]);
            this.font = lowres ? prepareFont(16, "white") : prepareFont(20,
                "white");
            this.font.font.lineHeight = 1.2;
            this.font.shadow.lineHeight = 1.2
        },
        draw: function(a) {
            a = a.getContext();
            switch (helpPage) {
                case 1:
                    var b = me.device.isMobile ? local.howToPlay_mobile.p1 : local.howToPlay_desktop.p1;
                    break;
                case 2:
                    b = me.device.isMobile ? local.howToPlay_mobile.p2 : local.howToPlay_desktop.p2;
                    break;
                case 3:
                    b = me.device.isMobile ? local.howToPlay_mobile.p3 : local.howToPlay_desktop.p3;
                    break;
                case 4:
                    b = me.device.isMobile ? local.howToPlay_mobile.p4 : local.howToPlay_desktop.p4;
                    break;
                case 5:
                    b = me.device.isMobile ?
                        local.howToPlay_mobile.p5 : local.howToPlay_desktop.p5
            }
            drawText(a, b, this.pos.x, this.pos.y, widthGame - 20, this.font.font, this.font.shadow)
        }
    }),
    menu_left = generic_small_button.extend({
        onClick: function() {
            1 < helpPage ? helpPage -= 1 : me.state.change(me.state.MENU);
            audioEnabled && me.audio.play("click");
            return !0
        }
    }),
    menu_right = generic_small_button.extend({
        onClick: function() {
            helpPage < game.data.helpPages ? helpPage += 1 : me.state.change(me.state.MENU);
            audioEnabled && me.audio.play("click");
            return !0
        }
    });
game.HowToCreditsScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.video.renderer.getWidth();
        this.h = me.video.renderer.getHeight();
        var a = me.loader.getImage("gui_bg");
        this.background = new me.Sprite(this.w / 2 - a.width / 2, this.h / 2 - a.height / 2, a);
        me.game.world.addChild(this.background, 1);
        me.game.world.addChild(new menu_back(this.w / 2, this.h - 40, 20), 4);
        me.game.world.addChild(new HowToCreditsText(this.w / 2, 20), 10);
        "ludei" == platform && (a = !1 == me.device.iOS ? 0.82 : 0.75, 9 < game.data.credits && (a = 0.5), me.game.world.addChild(new buy_credits(this.w /
            2, (this.h - 60) * a, 26), 40))
    }
});
var HowToCreditsText = me.Renderable.extend({
        init: function(a, b) {
            this._super(me.Renderable, "init", [a, b, 10, 10]);
            lowres ? (this.fontA = prepareFont(12, "white"), this.fontB = prepareFont(14, "white"), this.fontC = prepareFont(20), this.h1 = 15, this.h2 = 35, this.h3 = 30) : (this.fontA = prepareFont(16, "white"), this.fontB = prepareFont(22, "white"), this.fontC = prepareFont(30), this.h1 = 25, this.h2 = 40, this.h3 = 50);
            this.h = me.video.renderer.getHeight() - 60
        },
        draw: function(a) {
            a = a.getContext();
            var b = "",
                b = 0 < game.data.credits ? local.howToCredits.title_def :
                local.howToCredits.title_no_credits;
            drawText(a, b, this.pos.x, 0.05 * this.h, widthGame - 20, this.fontC.font, this.fontC.shadow);
            if ("ludei" == platform && 10 > game.data.credits || "web" == platform) {
                var d = 0.15;
                0 == game.data.credits && (b = local.howToCredits.back_tomorrow, drawText(a, b, this.pos.x, this.h * d, widthGame - 20, this.fontB.font, this.fontB.shadow));
                b = local.howToCredits.back_tomorrow_info;
                drawText(a, b, this.pos.x, this.h * d + this.h1, widthGame - 20, this.fontA.font, this.fontA.shadow);
                d = 0.3;
                b = local.howToCredits.facebook_share;
                drawText(a, b, this.pos.x, this.h * d, widthGame - 20, this.fontB.font, this.fontB.shadow);
                b = local.howToCredits.facebook_share_info;
                drawText(a, b, this.pos.x, this.h * d + this.h1, widthGame - 20, this.fontA.font, this.fontA.shadow);
                d = 0.41;
                b = local.howToCredits.facebook_score;
                drawText(a, b, this.pos.x, this.h * d, widthGame - 20, this.fontB.font, this.fontB.shadow);
                b = local.howToCredits.facebook_score_info;
                drawText(a, b, this.pos.x, this.h * d + this.h1, widthGame - 20, this.fontA.font, this.fontA.shadow);
                d = 0.52;
                b = local.howToCredits.more_games;
                drawText(a, b, this.pos.x, this.h * d, widthGame - 20, this.fontB.font, this.fontB.shadow);
                b = local.howToCredits.more_games_info;
                drawText(a, b, this.pos.x, this.h * d + this.h3, widthGame - 20, this.fontA.font, this.fontA.shadow)
            }
            "ludei" == platform && (!1 == me.device.iOS && 10 > game.data.credits ? (d = 0.67, b = local.howToCredits.rate, drawText(a, b, this.pos.x, this.h * d, widthGame - 20, this.fontB.font, this.fontB.shadow), b = local.howToCredits.rate_info, drawText(a, b, this.pos.x, this.h * d + this.h1, widthGame - 20, this.fontA.font, this.fontA.shadow),
                d = 0.82) : d = 0.75, 9 < game.data.credits && (d = 0.5), b = local.howToCredits.buy_info, drawText(a, b, this.pos.x, this.h * d + this.h2, widthGame - 20, this.fontA.font, this.fontA.shadow))
        }
    }),
    buy_credits = generic_big_button.extend({
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            drawText(a, local.howToCredits.buy, this.textx, this.texty, 250, this.font.font, this.font.shadow)
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            buyCredits();
            return !0
        }
    });
game.InfoScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.video.renderer.getWidth();
        this.h = me.video.renderer.getHeight();
        var a = me.loader.getImage("gui_bg");
        this.background = new me.Sprite(this.w / 2 - a.width / 2, this.h / 2 - a.height / 2, a);
        me.game.world.addChild(this.background, 1);
        me.game.world.addChild(new menu_back(this.w / 2, this.h - 40, 20), 4);
        me.game.world.addChild(new infoText(this.w / 2, 20), 10);
        helpPage = 1
    }
});
var infoText = me.Renderable.extend({
    init: function(a, b) {
        this._super(me.Renderable, "init", [a, b, 10, 10]);
        lowres ? (this.fontA = prepareFont(12, "white"), this.fontB = prepareFont(18, "white")) : (this.fontA = prepareFont(16, "white"), this.fontB = prepareFont(22, "white"));
        this.fontA.font.lineHeight = 1.2;
        this.fontA.shadow.lineHeight = 1.2;
        this.h = me.video.renderer.getHeight() - 60
    },
    draw: function(a) {
        a = a.getContext();
        var b = 0.05;
        text = local.info.title1;
        drawText(a, text, this.pos.x, this.h * b, widthGame - 20, this.fontB.font, this.fontB.shadow);
        text = local.info.text1;
        drawText(a, text, this.pos.x, this.h * b + 25, widthGame - 20, this.fontA.font, this.fontA.shadow);
        b = 0.2;
        text = local.info.title2;
        drawText(a, text, this.pos.x, this.h * b, widthGame - 20, this.fontB.font, this.fontB.shadow);
        text = local.info.text2;
        drawText(a, text, this.pos.x, this.h * b + 25, widthGame - 20, this.fontA.font, this.fontA.shadow);
        b = 0.35;
        text = local.info.title3;
        drawText(a, text, this.pos.x, this.h * b, widthGame - 20, this.fontB.font, this.fontB.shadow);
        text = local.info.text3;
        drawText(a, text, this.pos.x, this.h *
            b + 25, widthGame - 20, this.fontA.font, this.fontA.shadow);
        b = 0.55;
        text = local.info.title4;
        drawText(a, text, this.pos.x, this.h * b, widthGame - 20, this.fontB.font, this.fontB.shadow);
        text = local.info.text4;
        drawText(a, text, this.pos.x, this.h * b + 25, widthGame - 20, this.fontA.font, this.fontA.shadow);
        b = 0.7;
        text = local.info.title5;
        drawText(a, text, this.pos.x, this.h * b, widthGame - 20, this.fontB.font, this.fontB.shadow);
        text = local.info.text5;
        drawText(a, text, this.pos.x, this.h * b + 25, widthGame - 20, this.fontA.font, this.fontA.shadow);
        b = 0.85;
        text = local.info.title6;
        drawText(a, text, this.pos.x, this.h * b, widthGame - 20, this.fontB.font, this.fontB.shadow);
        text = local.info.text6;
        drawText(a, text, this.pos.x, this.h * b + 25, widthGame - 20, this.fontA.font, this.fontA.shadow)
    }
});
game.NameInputScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.video.renderer.getWidth();
        this.h = me.video.renderer.getHeight();
        var a = me.loader.getImage("gui_bg");
        this.background = new me.Sprite(this.w / 2 - a.width / 2, this.h / 2 - a.height / 2, a);
        me.game.world.addChild(this.background, 1);
        me.game.world.addChild(new nameInputTitle(this.w / 2, 20), 10);
        if (device_portrait_orientated) var a = 5,
            b = this.h / 8,
            d = "A;B;C;D;E;F;G;H;I;J;K;L;M;N;O;P;Q;R;S;T;U;V;W;X;Y;Z; ;.;&;OK".split(";");
        else a = 8, b = this.h / 5, d = "A;B;C;D;E;F;G;H;I;J;K;L;M;N;O;P;Q;R;S;T;U;V;W;X;Y;Z; ;.;,;!;&;OK".split(";");
        var e = 0,
            f = Math.ceil(d.length / a);
        this.h2 = this.h - b;
        for (var g = 1; g <= f; g++)
            for (var k = 1; k <= a && !(e >= d.length); k++) me.game.world.addChild(new key(this.w / (a + 1) * k, b + this.h2 / (f + 1) * g, d[e]), 99), e++
    }
});
var nameInputTitle = me.Renderable.extend({
        init: function(a, b) {
            this._super(me.Renderable, "init", [a, b, 10, 10]);
            this.h = me.video.renderer.getHeight();
            lowres ? (this.playerNameY = 60, this.font = prepareFont(20), this.font2 = prepareFont(14)) : (this.playerNameY = this.h / 4, this.font = prepareFont(30), this.font2 = prepareFont(20))
        },
        draw: function(a) {
            a = a.getContext();
            drawText(a, local.input_nickname, this.pos.x, this.pos.y, 460, this.font2.font, this.font2.shadow);
            drawText(a, game.data.playerName, this.pos.x, this.playerNameY, widthGame -
                20, this.font.font, this.font.shadow)
        }
    }),
    key = me.GUI_Object.extend({
        init: function(a, b, d) {
            settings = {
                image: "small_button",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            this.textx = a;
            this.texty = b;
            this.key = d;
            this.font = new me.BitmapFont("bitmap_font", 16);
            this.font.textBaseline = "middle";
            this.font.textAlign = "center";
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings]);
            this.submitted = !1
        },
        draw: function(a) {
            a.getContext().drawImage(this.image,
                this.x, this.y);
            this.font.draw(a, this.key, this.textx, this.texty)
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            if ("&" == this.key) game.data.playerName = game.data.playerName.substring(0, game.data.playerName.length - 1);
            else if ("OK" != this.key || this.submitted) 20 > game.data.playerName.length && (game.data.playerName += this.key);
            else if ("" != game.data.playerName) {
                this.submitted = !0;
                var a = game.data.playerName,
                    b = game.data.score,
                    d = hex_md5(b + a + scorePw),
                    a = "playerName=" + a + "&playerScore=" + b + "&magic=" + d,
                    e = makeHttpObject();
                e.open("GET", scoreUrl + "?" + a, !0);
                e.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                e.onreadystatechange = function() {
                    4 == e.readyState && 200 == e.status && (clearTimeout(f), me.state.change(me.state.SCORE))
                };
                var f = setTimeout(function() {
                    e.abort();
                    me.state.change(me.state.MENU)
                }, 5E3);
                e.send()
            }
            return !0
        }
    });

function makeHttpObject() {
    try {
        return new XMLHttpRequest
    } catch (a) {}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP")
    } catch (b) {}
    try {
        return new ActiveXObject("Microsoft.XMLHTTP")
    } catch (d) {}
    throw Error("Could not create HTTP request object.");
}
var scoretable = "",
    scroll = 0;
game.ScoreScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.video.renderer.getWidth();
        this.h = me.video.renderer.getHeight();
        var a = me.loader.getImage("gui_bg");
        this.background = new me.Sprite(this.w / 2 - a.width / 2, this.h / 2 - a.height / 2, a);
        me.game.world.addChild(this.background, 1);
        me.game.world.addChild(new menu_done(this.w / 2, this.h - 40, 20), 4);
        me.game.world.addChild(new button_score_up(this.w - 26, 26), 4);
        me.game.world.addChild(new button_score_down(this.w - 26, this.h - 100), 4);
        var a = "magic=getScore&t=" +
            (new Date).getTime(),
            b = makeHttpObject();
        b.open("GET", scoreUrl + "?" + a, !0);
        b.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var d = this;
        b.onreadystatechange = function() {
            4 == b.readyState && 200 == b.status && (clearTimeout(e), scoretable = JSON.parse(b.responseText), me.game.world.addChild(new scoreText(d.w / 2, 30), 10))
        };
        var e = setTimeout(function() {
            console.info(b.responseText);
            b.abort();
            me.state.change(me.state.MENU)
        }, 5E3);
        b.send()
    }
});
var scoreText = me.Renderable.extend({
        init: function(a, b) {
            this._super(me.Renderable, "init", [a, b, 10, 10]);
            lowres ? (this.font = prepareFont(24), this.fontB = prepareFont(18)) : (this.font = prepareFont(30), this.fontB = prepareFont(20));
            this.numbOfLines = parseInt((me.video.renderer.getHeight() - 120) / 25)
        },
        draw: function(a) {
            a = a.getContext();
            var b = local.score.hi_score;
            drawText(a, b, this.pos.x, this.pos.y, 460, this.font.font, this.font.shadow);
            var d = 1.5;
            for (i = scroll; i < scroll + this.numbOfLines && i != scoretable.length; i++) b = scoretable[i].score +
                " : " + scoretable[i].name, drawText(a, b, this.pos.x, this.pos.y + 25 * d, 460, this.fontB.font, this.fontB.shadow), d++;
            0 == scoretable.length && drawText(a, local.score.no_score_yet, this.pos.x, this.pos.y + 300, 460, this.fontB.font, this.fontB.shadow)
        }
    }),
    button_score_up = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "butt_up",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings])
        },
        draw: function(a) {
            a = a.getContext();
            a.save();
            0 == scroll && (a.globalAlpha = 0.4);
            a.drawImage(this.image, this.x, this.y);
            a.restore()
        },
        onClick: function() {
            0 < scroll && (audioEnabled && me.audio.play("click"), scroll--);
            return !0
        }
    }),
    button_score_down = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "butt_down",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings]);
            this.numbOfLines =
                parseInt((me.video.renderer.getHeight() - 120) / 25)
        },
        draw: function(a) {
            a = a.getContext();
            a.save();
            if (scoretable.length < this.numbOfLines || scroll >= scoretable.length - this.numbOfLines) a.globalAlpha = 0.4;
            a.drawImage(this.image, this.x, this.y);
            a.restore()
        },
        onClick: function() {
            scroll < scoretable.length - this.numbOfLines && (audioEnabled && me.audio.play("click"), scroll++);
            return !0
        }
    }),
    menu_done = generic_big_button.extend({
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            drawText(a, local.score.done,
                this.textx, this.texty, 460, this.font.font, this.font.shadow)
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            me.state.change(me.state.MENU);
            return !0
        }
    });
game.ChooseScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.video.renderer.getWidth();
        this.h = me.video.renderer.getHeight();
        var a = me.loader.getImage("gui_bg");
        this.background = new me.Sprite(this.w / 2 - a.width / 2, this.h / 2 - a.height / 2, a);
        me.game.world.addChild(this.background, 1);
        me.game.world.addChild(new choose_title(this.w / 2, 40), 99);
        "fgl" == platform ? (a = fgl.isPremium() ? me.levelDirector.levelCount() - 1 : 8, fgl.unlockEnabled && !fgl.isPremium() && me.game.world.addChild(new butt_unlock_game(this.w /
            2, this.h - 150, 20), 4)) : a = me.levelDirector.levelCount();
        try {
            me.save.add({
                level: 1
            });
            var b = parseInt(me.save.level)
        } catch (d) {
            console.info("Error on local storage: " + d.message + "\n\n"), b = game.data.level
        }
        me.game.world.addChild(new button_levels_up(this.w - 26, 70), 4);
        me.game.world.addChild(new button_levels_down(this.w - 26, this.h - 100), 4);
        me.game.world.addChild(new menu_back(this.w / 2, this.h - 40, 20), 4);
        lowres ? (game.data.spazioTop = 95, game.data.spazioBottom = 75) : (game.data.spazioTop = 140, game.data.spazioBottom = 100);
        game.data.spaziov = me.video.renderer.getHeight() - (game.data.spazioTop + game.data.spazioBottom + 48);
        game.data.maxPerPage = 4;
        game.data.scroll = 0;
        game.data.spacing = parseInt(game.data.spaziov / (game.data.maxPerPage - 1));
        var e = lowres ? 4 : "ludei" != platform ? 4 : 5,
            f = Math.ceil(a / e);
        game.data.row = f;
        for (var g = 1, k = 0; k < f; k++)
            for (var h = 1; h <= e && !(g <= b ? me.game.world.addChild(new button_level(-20 + this.w / (e + 1) * h, game.data.spazioTop + game.data.spacing * k, g, !1), 99) : me.game.world.addChild(new button_level(-20 + this.w / (e + 1) * h, game.data.spazioTop +
                    game.data.spacing * k, g, !0), 99), g++, g > a); h++);
    }
});
var button_level = me.GUI_Object.extend({
        init: function(a, b, d, e) {
            settings = {
                image: "small_button"
            };
            this.imageLocked = me.loader.getImage("level_button_lock");
            settings.spritewidth = 48;
            settings.spriteheight = 48;
            this.spritewidth = settings.spritewidth;
            this.spriteheight = settings.spriteheight;
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            this.textx = a;
            this.texty = b;
            this.level = d;
            this.locked = e;
            this.texty = b + 2;
            this.font = prepareFont(26, "white");
            this._super(me.GUI_Object, "init", [a - settings.spritewidth /
                2, b - settings.spriteheight / 2, settings
            ])
        },
        draw: function(a) {
            a = a.getContext();
            this.pos.y = this.y + game.data.scroll * game.data.spacing;
            this.y + game.data.scroll * game.data.spacing >= game.data.spazioTop - this.spriteheight / 2 && this.y + game.data.scroll * game.data.spacing <= me.video.renderer.getHeight() - game.data.spazioBottom && (a.drawImage(this.image, this.x, this.y + game.data.scroll * game.data.spacing), drawText(a, this.level.toString(), this.textx, this.texty + game.data.scroll * game.data.spacing, 200, this.font.font, this.font.shadow),
                this.locked && a.drawImage(this.imageLocked, this.x, this.y + game.data.scroll * game.data.spacing))
        },
        onClick: function() {
            this.locked || (audioEnabled && me.audio.play("click"), audioEnabled && me.audio.stopTrack("menu"), game.data.level = this.level, "fgl" != platform && addCredits(-1), me.state.change(me.state.PLAY));
            return !0
        }
    }),
    choose_title = me.Renderable.extend({
        init: function(a, b) {
            this.x = a;
            this.y = b;
            this.font = lowres ? prepareFont(20) : prepareFont(30);
            this.font.textBaseline = "middle";
            this.font.textAlign = "center";
            this._super(me.Renderable,
                "init", [this.x, this.y, 10, 10])
        },
        draw: function(a) {
            a = a.getContext();
            text = local.choose_level;
            drawText(a, text, this.x, this.y, 460, this.font.font, this.font.shadow)
        }
    }),
    button_levels_up = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "butt_up",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings])
        },
        draw: function(a) {
            a = a.getContext();
            a.save();
            0 == +game.data.scroll &&
                (a.globalAlpha = 0.4);
            a.drawImage(this.image, this.x, this.y);
            a.restore()
        },
        onClick: function() {
            0 > game.data.scroll && (audioEnabled && me.audio.play("click"), game.data.scroll += 1);
            return !0
        }
    }),
    button_levels_down = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "butt_down",
                spritewidth: 48,
                spriteheight: 48
            };
            this.spritewidth = settings.spritewidth;
            this.spriteheight = settings.spriteheight;
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth /
                2, b - settings.spriteheight / 2, settings
            ]);
            this.numbOfLines = parseInt((me.video.renderer.getHeight() - 90) / 20)
        },
        draw: function(a) {
            a = a.getContext();
            a.save();
            game.data.spazioTop + (game.data.row + game.data.scroll - 1) * game.data.spacing + this.spriteheight / 2 <= me.video.renderer.getHeight() - game.data.spazioBottom && (a.globalAlpha = 0.4);
            a.drawImage(this.image, this.x, this.y);
            a.restore()
        },
        onClick: function() {
            game.data.spazioTop + (game.data.row + game.data.scroll - 1) * game.data.spacing + this.spriteheight / 2 <= me.video.renderer.getHeight() -
                game.data.spazioBottom || (audioEnabled && me.audio.play("click"), game.data.scroll -= 1);
            return !0
        }
    }),
    menu_back = generic_big_button.extend({
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            text = local.back;
            drawText(a, text, this.textx, this.texty, 200, this.font.font, this.font.shadow)
        },
        onClick: function() {
            me.state.change(me.state.MENU);
            me.audio.play("click");
            return !0
        }
    }),
    butt_unlock_game = generic_big_button.extend({
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            text =
                local.unlock_game;
            drawText(a, text, this.textx, this.texty, 200, this.font.font, this.font.shadow)
        },
        onClick: function() {
            fgl.inApp.initiateUnlockFunction(function() {
                me.state.change(me.state.USER + 1)
            }, function() {});
            audioEnabled && me.audio.play("click");
            return !0
        }
    });

function line(a, b, d) {
    a.beginPath();
    a.moveTo(0, b);
    a.lineTo(480, b);
    a.strokeStyle = d;
    a.stroke()
}
game.GameOverScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.video.renderer.getWidth();
        this.h = me.video.renderer.getHeight();
        me.game.world.addChild(new(me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, "init", [0, 0, 10, 10]);
                this.font = prepareFont(30);
                this.font2 = prepareFont(20)
            },
            draw: function(a) {
                a = a.getContext();
                var d = local.game_over;
                drawText(a, d, me.game.viewport.width / 2, me.game.viewport.height / 4, widthGame, this.font.font, this.font.shadow);
                d = local.final_score;
                drawText(a,
                    d, me.game.viewport.width / 2, me.game.viewport.height / 2.5, widthGame, this.font2.font, this.font2.shadow);
                drawText(a, game.data.score.toString(), me.game.viewport.width / 2, me.game.viewport.height / 2.5 + 40, widthGame, this.font.font, this.font.shadow)
            }
        })), 2);
        var a = 120;
        SUBMIT_SCORE_BUTTON && (me.game.world.addChild(new butt_submit_score(0.5 * this.w, this.h - a, 20), 40), a += 60);
        SHARE_SCORE_BUTTON && me.game.world.addChild(new butt_fb_submit_score(0.5 * this.w, this.h - a, 20), 40);
        me.game.world.addChild(new butt_main_menu(0.5 * this.w,
            this.h - 40, 20), 40)
    }
});
var butt_main_menu = generic_big_button.extend({
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            text = local.main_menu;
            drawText(a, text, this.textx, this.texty, 200, this.font.font, this.font.shadow)
        },
        onClick: function() {
            me.state.change(me.state.MENU);
            audioEnabled && me.audio.play("click");
            return !0
        }
    }),
    butt_submit_score = generic_big_button.extend({
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            text = local.submit_score;
            drawText(a, text, this.textx, this.texty, 200, this.font.font,
                this.font.shadow)
        },
        onClick: function() {
            "fgl" == platform ? (fgl.submitScore(game.data.score), me.state.change(me.state.MENU)) : me.state.change(me.state.USER + 4);
            audioEnabled && me.audio.play("click");
            return !0
        }
    }),
    butt_fb_submit_score = generic_big_button.extend({
        draw: function(a) {
            a = a.getContext();
            a.drawImage(this.image, this.x, this.y);
            text = local.share_score;
            drawText(a, text, this.textx, this.texty, 200, this.font.font, this.font.shadow)
        },
        onClick: function() {
            var a = local.facebook_score,
                a = a.replace("#i", game.data.score),
                a = a.replace("#s", gameName);
            if (navigator.isCocoonJS) {
                var b = new Cocoon.Social.Message(a, fbPic, gameUrl, gameName, "a game by FFX.IT");
                socialService.isLoggedIn() ? socialService.publishMessageWithDialog(b, function(a) {
                    a ? console.error("Error publishing message: " + a.message) : (10 > game.data.credits && addCredits(1), Alert(local.you_earned_credits.replace("#", "1")))
                }) : socialService.login(function(a, e) {
                    e ? console.error("login error: " + e.message) : a ? (console.log("login suceeded"), socialService.publishMessageWithDialog(b,
                        function(a) {
                            a ? console.error("Error publishing message: " + a.message) : (10 > game.data.credits && addCredits(1), Alert(local.you_earned_credits.replace("#", "1")))
                        })) : console.log("login cancelled")
                })
            } else FB.ui({
                method: "feed",
                link: gameUrl,
                picture: fbPic,
                caption: "a game by ffx.it",
                name: gameName,
                description: a
            }, function(a) {
                a && !a.error_code ? (addCredits(1), Alert(local.you_earned_credits.replace("#", "1"))) : console.info("Error while posting.")
            });
            audioEnabled && me.audio.play("click");
            return !0
        }
    });
game.YouDidItScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.game.viewport.width;
        this.h = me.game.viewport.height;
        var a = this;
        navigator.isCocoonJS ? ads.interstitialAlreadyDownloaded && (Cocoon.Ad.showInterstitial(), console.info("mostra fullscreen")) : "fgl" == platform && (fgl.isPremium() || fgl.showAd());
        me.game.world.addChild(new(me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, "init", [0, 0, 100, 100]);
                this.font = prepareFont(30)
            },
            draw: function(b) {
                b = b.getContext();
                drawText(b, local.you_did_it,
                    a.w / 2, a.h / 2 - 100, 460, this.font.font, this.font.shadow)
            }
        })), 2);
        me.game.world.addChild(new(me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, "init", [0, 0, 100, 100]);
                this.font = prepareFont(20)
            }
        })), 2);
        me.game.world.addChild(new menu_home(this.w / 2 - 70, this.h / 2 - 20), 4);
        me.game.world.addChild(new menu_restart(this.w / 2, this.h / 2 - 20), 4);
        me.game.world.addChild(new menu_continue(this.w / 2 + 70, this.h / 2 - 20), 4)
    }
});
var stellina = me.GUI_Object.extend({
        init: function(a, b, d) {
            settings = {};
            settings.image = d ? "stellinaSmile" : "stellinaVuota";
            settings.spritewidth = 60;
            settings.spriteheight = 57;
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings])
        }
    }),
    menu_home = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "home_button",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings])
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            me.state.change(me.state.MENU);
            return !0
        }
    }),
    menu_restart = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "restart_button",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a - settings.spritewidth / 2;
            this.y = b - settings.spriteheight /
                2;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings])
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            game.data.targets = 0;
            game.data.numberOfBonus = 0;
            navigator.isCocoonJS ? me.state.change(me.state.PLAY) : me.state.change(me.state.USER + 6);
            return !0
        }
    }),
    menu_continue = me.GUI_Object.extend({
        init: function(a, b) {
            settings = {
                image: "continue_button",
                spritewidth: 48,
                spriteheight: 48
            };
            this.x = a -
                settings.spritewidth / 2;
            this.y = b - settings.spriteheight / 2;
            settings.width = settings.spritewidth;
            settings.height = settings.spriteheight;
            this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings])
        },
        onClick: function() {
            audioEnabled && me.audio.play("click");
            game.data.level++;
            try {
                game.data.level > me.save.level && (me.save.level = game.data.level)
            } catch (a) {
                console.info("Error on local storage: " + a.message + "\n\n")
            }
            game.data.targets = 0;
            game.data.numberOfBonus = 0;
            game.data.comboBonus =
                0;
            !navigator.isCocoonJS && ADS_ON_NEW_LEVEL ? me.state.change(me.state.USER + 6) : me.state.change(me.state.PLAY);
            return !0
        }
    });
game.FullAdScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        this.w = me.game.viewport.width;
        this.h = me.game.viewport.height;
        var a = me.video.renderer.getHeight() / window.innerHeight,
            b = me.video.renderer.getWidth() / window.innerWidth,
            a = a < b ? b : a,
            b = (window.innerHeight - me.video.renderer.getHeight() / a) / 2,
            d = document.createElement("div");
        d.innerHTML = me.device.isMobile ? '<iframe src="' + BETWEEN_LEVELS_ADS_MOBILE + '" width="100%" height="100%" frameborder="0" ></iframe>' : '<iframe src="' + BETWEEN_LEVELS_ADS_DESKTOP +
            '" width="100%" height="100%" frameborder="0" ></iframe>';
        d.style.position = "absolute";
        d.style.zIndex = "999";
        d.style.top = b + 30 / a + "px";
        d.style.margin = "0";
        d.style.padding = "0";
        d.style.width = window.innerWidth + "px";
        d.style.height = window.innerHeight + "px";
        d.style.background = "white";
        d.id = "fullads";
        document.body.appendChild(d);
        me.game.world.addChild(new x_button(this.w - 15, 15), 40)
    },
    onDestroyEvent: function() {
        var a = document.getElementById("fullads");
        document.body.removeChild(a)
    }
});
var x_button = me.GUI_Object.extend({
    init: function(a, b) {
        settings = {
            image: "butt_x",
            spritewidth: 30,
            spriteheight: 30
        };
        this.x = a;
        this.y = b;
        settings.width = settings.spritewidth;
        settings.height = settings.spriteheight;
        this._super(me.GUI_Object, "init", [a - settings.spritewidth / 2, b - settings.spriteheight / 2, settings]);
        me.sys.pauseOnBlur = !1
    },
    onClick: function() {
        setTimeout(function() {
            me.state.change(me.state.PLAY);
            me.sys.pauseOnBlur = !0
        }, 300);
        return !0
    }
});
game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        var a = me.CanvasRenderer.getContext();
        me.CanvasRenderer.clearSurface(a, "#000000");
        game.data.radarEntities.length = 0;
        delete game.data.collisionArray;
        game.data.dotCounter = 0;
        game.data.teleportCounter = 0;
        delete game.data.teleportArray;
        delete game.data.teleportList;
        me.sys.fps = MAX_FPS;
        game.data.level > me.levelDirector.levelCount() && (game.data.level = 1, game.data.levelNumberShift++);
        me.levelDirector.loadLevel("level" + game.data.level.toString());
        this.HUD =
            new game.HUD.Container;
        me.game.world.addChild(this.HUD);
        Path.alpha = 0;
        IN_GAME_ADS && (navigator.isCocoonJS ? Cocoon.Ad.showBanner() : (a = document.getElementById("ads"), a.style.zIndex = "999", a.style.display = "block"))
    },
    onDestroyEvent: function() {
        me.game.world.removeChild(this.HUD);
        me.sys.fps = 60;
        if (IN_GAME_ADS)
            if (navigator.isCocoonJS) Cocoon.Ad.hideBanner();
            else {
                var a = document.getElementById("ads");
                a.style.zIndex = "-999";
                a.style.display = "none"
            }
    }
});