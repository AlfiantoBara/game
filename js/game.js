setGame("1200x600");
game.folder = "assets";
//file gambar yang dipakai dalam game
var gambar = {
	logo:"logo.png",
	startBtn:"tombolStart.png",
	cover:"cover.jpg",
	playBtn:"btn-play.png",
	maxBtn:"maxBtn.png",
	minBtn:"minBtn.png",
	idle:"Idlechar.png",
	run:"Runchar.png",
	jump:"jumpchar.png", 
	fall:"fallchar.png",
	hit:"hitchar.png",
	tileset:"terrain.png",
	bg:"pink.png",
	item1:"melon.png",
	musuh1Idle:"enemy1run.png",
	musuh1Run:"enemy1idle.png",
	musuh1Hit:"enemy1hit.png",
	bendera:"flag.png",
	clue:"clue.png"
}
//file suara yang dipakai dalam game
var suara = {
}

//load gambar dan suara lalu jalankan startScreen
loading(gambar, suara, startScreen);

function startScreen(){	
	hapusLayar("#67d2d6");
	tampilkanGambar(dataGambar.logo, 600, 250);
	var startBtn = tombol(dataGambar.startBtn, 600, 350);
	if (tekan(startBtn)){
		jalankan(halamanCover);
	}
}

function tampilkanGambar(gambar, x, y, skala = 1) {
    var ctx = canvas.getContext("2d");
    var w = gambar.width * skala;
    var h = gambar.height * skala;
    ctx.drawImage(gambar, x - w / 2, y - h / 2, w, h);
}

function halamanCover(){
	hapusLayar("#67d2d6");
	tampilkanGambar(dataGambar.cover, 600, 320, 0.8);
	tampilkanGambar(dataGambar.clue, 500, 320, 0.5);
	var playBtn = tombol(dataGambar.playBtn, 1100, 500);
	if (tekan(playBtn)){
		setAwal();
		if (!waktuMulai) waktuMulai = Date.now(); // hanya set sekali
		jalankan(gameLoop);
	}	
	resizeBtn(1150,50);
}

// Data spawn untuk setiap map
var spawnPoints = {
    1: {x: 100, y: 200}, 
    2: {x: 50, y: 150},
    3: {x: 200, y: 400},
    4: {x: 300, y: 100},
	5: {x: 300, y: 100},
};
var durasiCountdown = 600; // 60 detik hitung mundur
var waktuMulai = null;
function setAwal(){
    var spawn = spawnPoints[game.level];
    if (spawn) {
        // set game.charX dan game.charY SEBELUM panggil setPlatform
        game.charX = Math.floor(spawn.x / 32);
        game.charY = Math.floor(spawn.y / 32);
    } else {
        // default kalau spawnPoint belum di-set
        game.charX = 1;
        game.charY = 5;
    }

    // --- disini baru buat hero ---
    game.hero = setSprite(dataGambar.idle, 32, 32);
    game.skalaSprite = 2;
    game.hero.animDiam = dataGambar.idle;
    game.hero.animLompat = dataGambar.jump;
    game.hero.animJalan = dataGambar.run;
    game.hero.animJatuh = dataGambar.fall;
    game.hero.animMati = dataGambar.hit;

    // --- lalu set Platform ---
    setPlatform(this["map_"+game.level], dataGambar.tileset, 32, game.hero);

    game.gameOver = ulangiPermainan;
    //setPlatformItem(1, dataGambar.item1);

    var musuh1 = {};
    musuh1.animDiam = dataGambar.musuh1Idle;
    musuh1.animJalan = dataGambar.musuh1Run;
    musuh1.animMati = dataGambar.musuh1Hit;
    setPlatformEnemy(1, musuh1);

    setPlatformTrigger(1, dataGambar.bendera);
}


function ulangiPermainan(){
	game.aktif = true;
	setAwal();
	jalankan(gameLoop);
}

function gameLoop(deltaTime){
	hapusLayar();
	let speed = 250 * deltaTime; // 200 pixels per detik
let jumpSpeed = 530 * deltaTime;
let gravity = 11.5 * deltaTime;

if (game.kanan){
    gerakLevel(game.hero, speed, 0);
} else if (game.kiri){
    gerakLevel(game.hero, -speed, 0);
}

if (game.atas){
    gerakLevel(game.hero, 0, -jumpSpeed);
} else {
    game.gravitasi = gravity;
}

	latar(dataGambar.bg, 0.1, 0);
	buatLevel();
	cekItem();
	//teks(game.score, 40, 60);
		if (waktuMulai) {
		var detikTerlewat = Math.floor((Date.now() - waktuMulai) / 1000);
		var sisa = durasiCountdown - detikTerlewat;
		if (sisa < 0) sisa = 0;

		// Tampilkan countdown di tengah atas
		teks("time: " + sisa + " detik", 600, 40, "center");

		// Jika waktu habis, hentikan permainan
		if (sisa <= 0) {
			game.aktif = false;
			hapusLayar("#000"); // hapus layar agar tidak freeze
			teks("Waktu Habis!", 600, 100, "center");
			setTimeout(startScreen, 2000); // kembali ke start setelah 2 detik
			return;
		}
	}

}

function cekItem(){
	if (game.itemID > 0){
		tambahScore(10);
		game.itemID = 0;
	}
	if (game.triggerID == 1){
		game.triggerID = 0;
		game.aktif = false;
		game.level++;
		setTimeout(ulangiPermainan, 0);
	}
}