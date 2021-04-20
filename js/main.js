"use strict";

	exit.onclick = function(event) {
		console.log("awd");
		document.getElementById("rules").style.display = "none";
	}

	header.onclick = function(event) {
		document.getElementById("rules").style.display = "block";
	}


	exitInforamtion.onclick = function ( event ) {
		document.getElementById("informationPlanet").style.display = "none";
	}


	let scene, camera, renderer, controls;

	/*
		radius ( в километрах / 10 )


					Расстояние км от солнца     Угловая скорость
		Меркурий    57 910 006				    0.0045
		Венера      108 199 995                 0.6155 
		Земля 		149 599 951 				0.2624
		Марс 		227 939 920 				0.2551
		Юпитер 		778 330 257 				0.6331
		Сатурн 		1 429 400 028 				0.5886
		Уран 		2 870 989 228 				0.2301
		Нептун 		4 504 299 579				0.3913


	*/

	const defaultSpeedPlanet = [
		THREE.Math.degToRad(0.0045),
		THREE.Math.degToRad(0.6155),
		THREE.Math.degToRad(0.2624),
		THREE.Math.degToRad(0.2551),
		THREE.Math.degToRad(0.6331),
		THREE.Math.degToRad(0.5886),
		THREE.Math.degToRad(0.2301),
		THREE.Math.degToRad(0.3913)
	];

	let spheres = [];

	let planet = {
		calculationPosition : function(){
			this.positionX = this.realPositionInSolarSystem - this.startPosition;
		},

		rotationPlanet : function(){
			this.delta = this.clock.getDelta(); // getDelta() - возвращает интервал в долях секунды
			for(let i = 1; i < spheres.length; i++) {
				if( spheres[i].geometry.name === this.name ){
					spheres[i].position.x = Math.cos(this.angle) * this.positionX;
					spheres[i].position.z = Math.sin(this.angle) * this.positionX;
					this.angle += this.angularSpeed * this.delta; 

				}
			}
		},

		setPosition: function(x, y, z){
			this.positionX = x;
			this.positionY = y;
			this.positionZ = z;
		}
	}

	let planets = {
		sun : {
			radius : 695.990 / 10,
			texture : undefined,
			positionX : 0,
			positionY : 0,
			positionZ : 0,
			informatin : [
				"Солнце",
				"Одна из звёзд нашей Галактики (Млечный Путь) и единственная звезда Солнечной системы. Вокруг Солнца обращаются другие объекты этой системы: планеты и их спутники, карликовые планеты и их спутники, астероиды, метеороиды, кометы и космическая пыль.По спектральной классификации Солнце относится к типу G2V (жёлтый карлик). Средняя плотность Солнца составляет 1,4 г/см³ (в 1,4 раза больше, чем у воды). Эффективная температура поверхности Солнца — 5780 кельвин[7]. Поэтому Солнце светит почти белым светом, но прямой свет Солнца у поверхности нашей планеты приобретает некоторый жёлтый оттенок из-за более сильного рассеяния и поглощения коротковолновой части спектра атмосферой Земли (при ясном небе, вместе с голубым рассеянным светом от неба, солнечный свет вновь даёт белое освещение)."
			]
		},

		mercury : {
			startPosition : 695.990 / 10,
			realPositionInSolarSystem : -57.910 / 10,
			radius : 2.440 / 10,
			name : "mercury",
			texture : undefined,
			delta : 0,
			positionX : undefined,
			positionY : 0,
			clock : new THREE.Clock(),
			angularSpeed : THREE.Math.degToRad(0.0045), 
			angle : 0,
			positionZ : 0,
			informatin : [
				"Меркурий",
				"Ближайшая к Солнцу планета Солнечной системы, наименьшая из планет земной группы. Названа в честь древнеримского бога торговли — быстрого Меркурия, поскольку она движется по небу быстрее других планет. Период обращения вокруг Солнца занимает всего 87,97 дней, самый короткий из всех планет Солнечной системы. Видимое расстояние Меркурия от Солнца, если смотреть с Земли, никогда не превышает 28°. Эта близость к Солнцу означает, что планету можно увидеть только после захода солнца или до восхода солнца, обычно в сумерках. Планета телескопически отображает полный диапазон фаз, подобно Венере и Луне, когда она движется по своей внутренней орбите относительно Земли, которая повторяется в течение её синодического периода — примерно каждые 116 дней."
			]
		},

		venus : {
			startPosition : 695.990 / 10,
			realPositionInSolarSystem : -108.199 / 10,
			radius : 6.052 / 10,
			name : "venus",
			texture : undefined,
			delta : 0,
			positionX : undefined,
			positionY : 0,
			clock : new THREE.Clock(),
			angularSpeed : THREE.Math.degToRad(0.6155 ), 
			angle : 0,
			positionZ : 0,
			informatin : [
				"Венера",
				"Вторая по удалённости от Солнца планета Солнечной системы, наряду с Меркурием, Землёй и Марсом принадлежащая к семейству планет земной группы. Названа в честь древнеримской богини любви Венеры[6]. По ряду характеристик — например, по массе и размерам — Венера считается «сестрой» Земли. Венерианский год составляет 224,7 земных суток. Она имеет самый длинный период вращения вокруг своей оси (около 243 земных суток, в среднем 243,0212 ± 0,00006 сут[8]) среди всех планет Солнечной системы и вращается в направлении, противоположном направлению вращения большинства планет. Венера не имеет естественных спутников. Это третий по яркости объект на небе Земли, после Солнца и Луны. Планета достигает видимой звёздной величины −4,6m, так что её яркости достаточно, чтобы отбрасывать тени ночью. Изредка Венера видна невооружённым глазом и в светлое время суток."
			]
		},

		earth : {
			startPosition : 695.990 / 10,
			realPositionInSolarSystem : -149.599 / 10,
			radius : 6.371 / 10,
			name : "earth",
			texture : undefined,
			delta : 0,
			positionX : undefined,
			positionY : 0,
			clock : new THREE.Clock(),
			angularSpeed : THREE.Math.degToRad(0.2624), 
			angle : 0,
			positionZ : 0,
			informatin : [
				"Земля",
				"Третья по удалённости от Солнца планета Солнечной системы. Самая плотная, пятая по диаметру и массе среди всех планет и крупнейшая среди планет земной группы, в которую входят также Меркурий, Венера и Марс.Иногда упоминается как Мир, Голубая планета[16][17][18], иногда Терра (от лат. Terra). Единственное известное человеку на данный момент тело Солнечной системы в частности и Вселенной вообще, населённое живыми организмами.Научные данные указывают на то, что Земля образовалась из солнечной туманности около 4,54 миллиарда лет назад[19] и вскоре после этого приобрела свой единственный естественный спутник — Луну. Предположительно жизнь появилась на Земле примерно 4,25 млрд лет назад[20], то есть вскоре после её возникновения. С тех пор биосфера Земли значительно изменила атмосферу и прочие абиотические факторы, обусловив количественный рост аэробных организмов, а также формирование озонового слоя, который вместе с магнитным полем Земли ослабляет вредную для жизни солнечную радиацию[21], тем самым сохраняя условия существования жизни на Земле."
			]
		},

		mars : {
			startPosition : 695.990 / 10,
			realPositionInSolarSystem : -227.939 / 10,
			radius : 3.390 / 10,
			name : "mars",
			texture : undefined,
			delta : 0,
			positionX : undefined,
			positionY : 0,
			clock : new THREE.Clock(),
			angularSpeed : THREE.Math.degToRad(0.2551), 
			angle : 0,
			positionZ : 0,
			informatin : [
				"Марс",
				"Четвёртая по удалённости от Солнца и седьмая по размерам планета Солнечной системы; масса планеты составляет 10,7 % массы Земли. Названа в честь Марса — древнеримского бога войны, соответствующего древнегреческому Аресу. Иногда Марс называют «красной планетой» из-за красноватого оттенка поверхности, придаваемого ей минералом маггемитом — γ-оксидом железа(III).Марс — планета земной группы с разреженной атмосферой (давление у поверхности в 160 раз меньше земного). Особенностями поверхностного рельефа Марса можно считать ударные кратеры наподобие лунных, а также вулканы, долины, пустыни и полярные ледниковые шапки наподобие земных."
			]
		},


		jupiter : {
			startPosition : 695.990 / 10,
			realPositionInSolarSystem : -778.330 / 10,
			radius : 69.911 / 10,
			name : "jupiter",
			texture : undefined,
			delta : 0,
			positionX : undefined,
			positionY : 0,
			clock : new THREE.Clock(),
			angularSpeed : THREE.Math.degToRad(0.6331), 
			angle : 0,
			positionZ : 0,
			informatin : [
				"Юпитер",
				"Крупнейшая планета Солнечной системы, пятая по удалённости от Солнца. Наряду с Сатурном, Ураном и Нептуном, Юпитер классифицируется как газовый гигант. Планета была известна людям с глубокой древности, что нашло своё отражение в мифологии и религиозных верованиях различных культур: месопотамской, вавилонской, греческой и других. Современное название Юпитера происходит от имени древнеримского верховного бога-громовержца.Ряд атмосферных явлений на Юпитере: штормы, молнии, полярные сияния, — имеет масштабы, на порядки превосходящие земные. Примечательным образованием в атмосфере является Большое красное пятно — гигантский шторм, известный с XVII века"
			]
		},

		saturn : {
			startPosition : 695.990 / 10,
			realPositionInSolarSystem : -1429.400 / 10,
			radius : 58.232 / 10,
			name : "saturn",
			texture : undefined,
			delta : 0,
			positionX : undefined,
			positionY : 0,
			clock : new THREE.Clock(),
			angularSpeed : THREE.Math.degToRad(0.5886), 
			angle : 0,
			positionZ : 0,
			informatin : [
				"Сатурн",
				"Шестая планета от Солнца и вторая по размерам планета в Солнечной системе после Юпитера. Сатурн, а также Юпитер, Уран и Нептун, классифицируются как газовые гиганты. Сатурн назван в честь римского бога земледелия. Символ Сатурна — серп (Юникод: ♄). В основном Сатурн состоит из водорода, с примесями гелия и следами воды, метана, аммиака и тяжёлых элементов. Внутренняя область представляет собой относительно небольшое ядро из железа, никеля и льда, покрытое тонким слоем металлического водорода и газообразным внешним слоем. Внешняя атмосфера планеты кажется из космоса спокойной и однородной, хотя иногда на ней появляются долговременные образования. Скорость ветра на Сатурне может достигать местами 1800 км/ч, что значительно больше, чем на Юпитере"
			]
		},


		uran : {
			startPosition : 695.990 / 10,
			realPositionInSolarSystem : -2870.989 / 10,
			radius : 25.362,
			name : "uran",
			texture : undefined,
			delta : 0,
			positionX : undefined,
			positionY : 0,
			clock : new THREE.Clock(),
			angularSpeed : THREE.Math.degToRad(0.2301), 
			angle : 0,
			positionZ : 0,
			informatin : [
				"Уран",
				"Планета Солнечной системы, седьмая по удалённости от Солнца, третья по диаметру и четвёртая по массе. Была открыта в 1781 году английским астрономом Уильямом Гершелем и названа в честь греческого бога неба Урана. Уран стал первой планетой, обнаруженной в Новое время и при помощи телескопа[11]. Его открыл Уильям Гершель 13 марта 1781 года[12], тем самым впервые со времён античности расширив границы Солнечной системы в глазах человека. Несмотря на то, что порой Уран различим невооружённым глазом, более ранние наблюдатели принимали его за тусклую звезду. В отличие от газовых гигантов — Сатурна и Юпитера, состоящих в основном из водорода и гелия, в недрах Урана и схожего с ним Нептуна отсутствует металлический водород, но зато много льда в его высокотемпературных модификациях. По этой причине специалисты выделили эти две планеты в отдельную категорию «ледяных гигантов»"
			]
		},

		
		neptun : {
			startPosition : 695.990 / 10,
			realPositionInSolarSystem : -4504.299 / 10,
			radius : 24.622 / 10,
			name : "neptun",
			texture : undefined,
			delta : 0,
			positionX : undefined,
			positionY : 0,
			clock : new THREE.Clock(),
			angularSpeed : THREE.Math.degToRad(0.3913), 
			angle : 0,
			positionZ : 0,
			informatin : [
				"Нептун",
				"Восьмая и самая дальняя от Земли планета Солнечной системы. По диаметру находится на четвёртом месте, а по массе — на третьем. Масса Нептуна в 17,2 раза, а диаметр экватора в 3,9 раза больше земных[10]. Планета была названа в честь римского бога морей. Её астрономический символ Neptune symbol.svg — стилизованная версия трезубца Нептуна. Обнаруженный 23 сентября 1846 года[1], Нептун стал первой планетой, открытой благодаря математическим расчётам. Обнаружение непредвиденных изменений в орбите Урана породило гипотезу о неизвестной планете, гравитационным возмущающим влиянием которой они и обусловлены."
			]
		}
	};


	for ( let key in planets) {
		planets[key].__proto__ = planet
	}

	planets[Symbol.iterator] = function() {
		return {
			current: this.mercury,
    		last: this.neptun,

    		next(){
    			if (this.current <= this.last) {
			        return { done: false, value: this.current++ };
		      	} else {
		        	return { done: true };
		      	}
    		}
		}


	}

	// загружаем текстуры планет 
	function setDefaultSetting(){
		for ( let key in planets) {
			if ( key !== "sun") {
				planets[key].calculationPosition();
			}
			switch ( key ) {
				case "earth" : {
					planets[key].texture = new THREE.TextureLoader().load( 'image/2k_earth_daymap.jpg');
					break;
				}
				case "jupiter" : {
					planets[key].texture = new THREE.TextureLoader().load( 'image/2k_jupiter.jpg');
					break;
				}
				case "mars" : {
					planets[key].texture = new THREE.TextureLoader().load( 'image/2k_mars.jpg');
					break;
				}
				case "mercury" : {
					planets[key].texture = new THREE.TextureLoader().load( 'image/2k_mercury.jpg');
					break;
				}
				case "neptun" : {
					planets[key].texture = new THREE.TextureLoader().load( 'image/2k_neptune.jpg');
					break;
				}
				case "saturn" : {
					planets[key].texture = new THREE.TextureLoader().load( 'image/2k_saturn.jpg');
					break;
				}
				case "sun" : {
					planets[key].texture = new THREE.TextureLoader().load( 'image/2k_sun.jpg');
					break;
				}
				case "uran" : {
					planets[key].texture = new THREE.TextureLoader().load( 'image/2k_uranus.jpg');
					break;
				}
				case "venus" : {
					planets[key].texture = new THREE.TextureLoader().load( 'image/2k_venus_surface.jpg');
					break;
				}
			}
		}
	}



	function init(){
		setDefaultSetting();
	
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
		let texture = new THREE.TextureLoader().load( 'image/2k_stars.jpg' );


		scene.background = texture;  
		renderer = new THREE.WebGLRenderer();


		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );


		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.dampingFactor = 0.005;
		controls.minDistance = 0;
		controls.maxDistance = 1000;

		camera.position.set( 0, 0, 100 );
		controls.update();



		// настройка обзора расположение камеры 
		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 300;
	}



	/* 
		widthSegments, heightSegments — количество горизонтальных и вертикальных сегментов 
	*/


	function createSphere( radius, namePlanet, texture, positionX, positionY, positionZ, widthSegments = 32, heightSegments = 32 ){


		let geometry   = new THREE.SphereGeometry( radius, 32, 32);
		let material  = new THREE.MeshBasicMaterial({
			color: 0xfefcff,
			map : texture
		});

		geometry.name = namePlanet;

		let planet = new THREE.Mesh(geometry, material);

		planet.position.x = positionX;
		planet.position.y = positionY;
		planet.position.z = positionZ;


		spheres.push(planet);
			
		addOnSceneSphere();
	}

	function addOnSceneSphere(){
		for ( let val in spheres ){
			scene.add(spheres[val]);
		}
	}
	

	function start(){
		init();

		for ( let key in planets) {
			createSphere( planets[key].radius, key, planets[key].texture, planets[key].positionX, planets[key].positionY, planets[key].positionZ);
		}

		animate();
	}

	
	start();

	document.addEventListener( 'mousedown', onDocumentMouseDown );




	function onDocumentMouseDown( event ) {
		let raycaster = new THREE.Raycaster();
		let mouse = new THREE.Vector3();

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1; 

		raycaster.setFromCamera( mouse, camera );
		let intersects = raycaster.intersectObjects( scene.children );


		for ( let i = 0; i < intersects.length; i++ ) {
			showInformationOnPlanet(intersects[ i ].object.geometry.name);
			approximationPlanetOnClick(intersects[ i ].object.geometry.name);
		}
	}


	// по клику на планету она приближается по второму клику они отдаляется 
	function approximationPlanetOnClick ( planet ) {
		for ( let pl of spheres ) {
			if ( planet ===  pl.geometry.name) {
				console.log( planet );
			}
		}
		console.log(spheres[5]);
		spheres[5].position.z = 200;
	}




	function showInformationOnPlanet(planet){
		for ( let pl in planets ) {
			if( pl === planet) {
				let header = document.getElementById("headerInf");
				let text = document.getElementById("text");
				document.getElementById("informationPlanet").style.display = "block";
				header.innerHTML = planets[pl].informatin[0]; 				
				text.innerHTML = planets[pl].informatin[1]; 				
			}
		}
	}

	change.onclick = function(){
		let val = document.getElementById("changeSpeedPlanet").value;
		if ( isFinite(val) && +val !== 0 ){
			for ( let pl in planets) {
				if( pl !== "sun"){
					planets[pl].angularSpeed *= val;
				}
			}
		} else if (parseInt(val) == 0) {
			console.log("2");
			let i = 0;
			for ( let pl in planets) {
				if( pl !== "sun"){
					planets[pl].angularSpeed = defaultSpeedPlanet[i];
					i++;
				}	
			}
		} else if (val.length === 0) {
			document.getElementById("error").style.display = "block";
			setTimeout(() =>{
				document.getElementById("error").style.display = "none";
			}, 2000);
		} else {
			document.getElementById("error").style.display = "block";
			setTimeout(() =>{
				document.getElementById("error").style.display = "none";
			}, 2000);
		}
	}


	function animate() {
		requestAnimationFrame( animate );
		for ( let planet of spheres ) {
			if(planet.geometry.parameters.radius < 5){
				planet.rotation.y += .01;
			} else {
				planet.rotation.y += .001;
			}
		}


		for ( let pl in planets) {
			if( pl !== "sun"){
				planets[pl].rotationPlanet();
			}
		}
		controls.update();
		renderer.render( scene, camera );
	}
