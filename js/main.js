createGeoData()
.then(generateIndex)
.then(generateMap)
.then(generateTiles)
.then(geoData => addPath(geoData, "gpx/runinlyon_10km.gpx"))
.then(geoData => displayPath(geoData,0))
.then(movePOV)
.then(setGeneralListeners)
.then(setListeners)
.then(setListenersUpdate)
.then(geoData => {
	moveMapMode(geoData);
	return geoData;
})
.then(console.log)
.catch(console.error);

function createGeoData() {
	return new Promise((resolve, reject) => {
		let geoData = {
			map: undefined,
			paths: [],
			layersControl: undefined,
			savedState: {
				paths: [],
				undo: false,
				upload: false
			},
			layers: [],
			markersColor: [],
			tempMarkers: [],
			focus: undefined,
            mode: "movemap"
		};
		resolve(geoData);
		reject("Error when initializing the global variable");
	});
}

function generateIndex(geoData) {
	document.getElementById("mapid").setAttribute("style","height:"+ ($(document).height() * 5/6) +"px");
	document.getElementById("mapid").style.zIndex=0;
	document.getElementById("features").style.width= ($(document).width() * 1/30) +"px";
	document.getElementById("features").innerHTML = document.getElementById("features").innerHTML = `<button type="button" id="moveMap" alt="DeplacerCarte" title="Déplacer Carte" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-content=""><i class="fas fa-arrows-alt"></i></button>
					<button type="button" id="movePoint" alt="DeplacerPoint" title="Déplacer Point" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-content=""><i class="fas fa-hand-pointer"></i></button>
					<button type="button" id="undo" alt="Annuler" title="Annuler" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-content=""><i class="fas fa-undo"></i></button>
					<button type="button" id="redo" alt="Désannuler" title="Désannuler" class="btn btn-dark btn-xs btn-block"><i class="fas fa-redo" data-toggle="popover" data-placement="left" data-content=""></i></button>
					<button type="button" id="addPoint" alt="Ajouter un point" title="Ajouter un point" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-content=""><i class="fas fa-plus"></i></button>
					<button type="button" id="deletePoint" alt="Supprimer un point" title="Supprimer un point" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-content=""><i class="fas fa-minus"></i></button>
					<button type="button" id="link" alt="Lier" title="Lier" class="btn btn-dark btn-xs btn-block" data-target="#modalLink" data-toggle="popover" data-placement="left" data-content=""><i class="fas fa-link"></i></button>
					<button type="button" id="unlink" alt="Délier" title="Délier" class="btn btn-dark btn-xs btn-block"><i class="fas fa-unlink" data-toggle="popover" data-placement="left" data-content=""></i></button>
					<div class="form-group">
					    <input type="text" class="form-control" id="samplingFactor" placeholder="Insérez" data-toggle="popover" data-placement="left" data-content="">
					    <button type="button" id="reSample" alt="reSample" title="Rééchantillonner" class="btn btn-dark btn-xs btn-block"><i class="fas fa-divide"></i></button>
					</div>

					<button id="print" type="button" alt="Imprimer" Title="Imprimer" onclick="window.print()" value="Imprimer" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-content=""><i class="fas fa-print"></i></button>
					<button id="saveButton" type="button" alt="Télécharger" title="Télécharger" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-content=""><i class="fas fa-file-download"></i></button>
					<button id="infos" type="button" data-toggle="collapse" data-target="#traceInfos" alt="Ouvre une fenêtre avec plus d'informations sur la trace" title="Ouvre une fenêtre avec plus d'informations sur la trace" class="btn btn-dark btn-xs btn-block" data-toggle="popover" data-placement="left" data-content=""><i class="fas fa-info-circle"></i></button>
				</div>`;
	document.getElementById("features").style.zIndex=1;
	document.getElementById("workPlan").innerHTML +=
		`<div class="modal fade" id="modalLink" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
 			<div class="modal-dialog" role="document">
    			<div class="modal-content">
      				<div class="modal-header">
      					<h4 class="modal-title">Lier</h4>
        				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      				</div>
      				<div class="modal-body">
        				<p><b>Choississez les deux traces à lier :</b><p>
        					<div class="row-sm">
	        					<div class="col-6-sm">
	        						<label for="trace1">Première trace : </label>
	        						<select id="t1" name="Trace1" size=1>
	        						</select>
	        						<div>
	        							<input type="radio" id="start1" name="firstTrace" value="d">Début</input>
	        							<input type="radio" id="end1" name="firstTrace" value="f" checked>Fin</input>
	        						</div>
	        					</div>
	        					<div class="col-6-sm">
	        						<label for="trace2">Deuxième trace : </label>
	        						<select id="t2" name="Trace2" size=1>
	        						</select>
	        						<div>
	        							<input type="radio" id="start2" name="secondTrace" value="d" checked>Début</input>
	        							<input type="radio" id="end2" name="secondTrace" value="f">Fin</input>
	        						</div>
	        					</div>
        					</div><br />
        					<label for="traceName"><b>Entrez le nom de la nouvelle trace : </b></label><br />
        					<input type="text" id="traceName" placeholder="Entrez le nom de la nouvelle trace (Max. 50 caractères)" maxlength="50" rows="1" cols="50" size="50"></input>
        					<div class="modal-footer">
        						<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>
        						<input type="button" class="btn btn-primary" id="buttonLink" value="Soumettre"></button>
     						</div>
      				</div>
    			</div>
  			</div>
		</div>`;

		let titles = [];
    	Array.from($('[data-toggle="popover"]')).forEach(button => {
        	titles.push(button.title);
    	});
		$('[data-toggle="popover"]').popover();
    	Array.from($('[data-toggle="popover"]')).forEach( (button, i) => {
       	 button.title = titles[i];
   		});
		$('[data-toggle="popover"]').popover('disable');

	return geoData;
}

// Open the help window
// Return : none
function help(){
	window.open('html/aide.html', "Aide pour le site Improve my GPX", 'width = 400, height = 800, left = 1000');
}

function generateMap(geoData) {
	geoData.map = L.map('mapid').setView([0,0], 0);
	geoData.layersControl = L.control.layers(null, null, {position: "topleft"}).addTo(geoData.map);
	L.control.scale({imperial: false}).addTo(geoData.map);
	return geoData;
}

function generateTiles(geoData) {
	geoData.layersControl.addBaseLayer(L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(geoData.map), "Epurée");
	geoData.layersControl.addBaseLayer(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}), "Détaillée");
	geoData.layersControl.addBaseLayer(L.tileLayer(' http://{s}.tile.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png'), "OpenRiverboatMap");

	return geoData;
}

function addPath(geoData, file) {
    return Promise.resolve($.ajax(file)).then(gpx => {
		let index = geoData.paths.length;
		let indexFile = file.lastIndexOf("/");
		let filename = file.substr(indexFile+1);
		geoData.paths[index] = toGeoJSON.gpx(gpx);
		geoData.paths[index].file = filename;
		geoData.paths[index].shown = true;
		//geoData.markersColor = [blackMarker, blueMarker, redMarker, greenMarker, purpleMarker, yellowMarker];
		geoData.focus = index;
		savePaths(geoData);
		geoData.savedState.upload = true;
		checkElevation(geoData);
        return geoData;
	});
}

function checkElevation(geoData){
	var listCoord;
	let compt;
	let tabPromises;
	let thereIsElevation;
	let point;
	for(let j=0; j<geoData.paths.length; j++){
		tabPromises = [];
		thereIsElevation = true;
		point = 0;
		while(thereIsElevation && (point!==geoData.paths[j].features[0].geometry.coordinates.length-1)){
			if(geoData.paths[j].features[0].geometry.coordinates[point][2] == undefined)
				thereIsElevation = false;
			point++;
		}
		if(!thereIsElevation){
			listCoord = "";
			compt = 0;
			for (let i=0; i<geoData.paths[j].features[0].geometry.coordinates.length; i++){
				listCoord += geoData.paths[j].features[0].geometry.coordinates[i][1] + "," + geoData.paths[j].features[0].geometry.coordinates[i][0] + ",";
				if (!((i!=geoData.paths[j].features[0].geometry.coordinates.length-1) && (i%50!=0) || (i==0))){
					listCoord = listCoord.substring(0, listCoord.length-1);
					let link = "http://dev.virtualearth.net/REST/v1/Elevation/List?points="+listCoord+"&key=AuhAPaqRM0jgPmFRoNzjuOoB8te9aven3EH_L6sj2pFjDSxyvJ796hueyskwz4Aa";
					tabPromises.push($.getJSON(link, function(data) {}));
					listCoord = "";
				}
			}
			Promise.all(tabPromises).then(function(values) {
				values.forEach(function(element){
					for(let k=0; k<element.resourceSets[0].resources[0].elevations.length; k++){
						let x = compt*50+k;
						geoData.paths[j].features[0].geometry.coordinates[x].push(element.resourceSets[0].resources[0].elevations[k]);
					}
					compt++;
				});
				return geoData;
			}).then(generateGraph);
		}

	}
	return geoData;
}

// MAP FUNCTIONS //

function movePOV(geoData) {
	if (geoData.focus !== undefined) {
		geoData.map.fitBounds(geoData.layers[geoData.focus].getBounds());
	}
	generateGraph(geoData);
	return geoData;
}

// Param : geoData + number -> quantity of data to delete
// Return : nothing
function reSample(geoData, number){
	number = Number(number);
	if(Number.isInteger(number) && number > 0 && number < (geoData.paths[geoData.focus].features[0].geometry.coordinates.length-2)){
		if (typeof(Worker) === undefined) {
			let tolerence = 0.00001;
			let tabDistance = [];
			let totalDistance = calculateDistance(geoData.paths[geoData.focus]);
			while(number>0){
				tabDistance = [];
				for (let i=0; i<geoData.paths[geoData.focus].features[0].geometry.coordinates.length-2; i++){
					tabDistance.push(DistanceBetween2Points(geoData.paths[geoData.focus].features[0].geometry.coordinates[i],geoData.paths[geoData.focus].features[0].geometry.coordinates[i+1]));
				}
				if(tabDistance.min() < totalDistance*tolerence){
					geoData.paths[geoData.focus].features[0].geometry.coordinates.splice(tabDistance.indexOf(tabDistance.min()),1);
					number--;
				} else {
					tolerence += 0.0000002;
				}
			}
			geoData.map.removeLayer(geoData.layers[geoData.focus]);
			displayPath(geoData, geoData.focus);
			document.getElementById("tutorialButton").dispatchEvent(new Event("samplingFactor"));
			savePaths(geoData);
			generateGraph(geoData);
			infoTrace(geoData);

		} else {
			let w = new Worker("js/resample.js", {type:'module'});
			w.onmessage = event => {
				geoData.paths[geoData.focus] = event.data;
				w.terminate();
				w = undefined;
				redisplayPath(geoData, geoData.focus);
				document.getElementById("tutorialButton").dispatchEvent(new Event("samplingFactor"));
				savePaths(geoData);
				generateGraph(geoData);
				infoTrace(geoData);
			}
			w.postMessage(number);
			w.postMessage(geoData.paths[geoData.focus]);
		}
	} else {
		alert("Veuillez mettre un nombre entier supérieur à 0, et compris entre 1 et " + (geoData.paths[geoData.focus].features[0].geometry.coordinates.length-3) + "! SVP.");
	}
}

function keySample(geoData, keyCode) {
	if (keyCode === 13) {
		reSample(geoData, document.getElementById("samplingFactor").value);
	}
}

function displayPath(geoData, index, display = true) {
	let polyline = getPolyline(geoData, index);

	geoData.layers[index] = polyline;
	geoData.layersControl.addOverlay(polyline, geoData.paths[index].file);
	if(display){
		geoData.map.addLayer(polyline);
		setFocusClass(geoData);
	}
	setListenersUpdate(geoData)

	return geoData;
}

function redisplayPath(geoData, index) {
	geoData.layersControl.removeLayer(geoData.layers[index]);
	geoData.map.removeLayer(geoData.layers[index]);

	displayPath(geoData, index);
}

function getPolyline(geoData, index) {
	let color;
	let mean = getElevationMean(geoData);
	if (mean<600){
		color = "#0000FF";
	} else if (mean >= 600 && mean <1200) {
		color = "#007FFF";
	} else if (mean >= 1200 && mean < 1800){
		color = "#00FFFF";
	} else if (mean >= 1800 && mean < 2400){
		color = "#00FF7F";
	} else if (mean >= 2400 && mean < 3000){
		color = "#00FF00";
	} else if (mean >= 3000 && mean < 3600){
		color = "#7FFF00";
	} else if (mean >= 3600 && mean < 4200){
		color = "#FFFF00";
	} else if (mean >= 4200 && mean < 4800){
		color = "#FF7F00";
	} else if (mean >= 4800 && mean < 5400) {
		color = "#FF0000";
	} else {
		color = "#000000";
	}

	let latlngs = [];
	geoData.paths[index].features[0].geometry.coordinates.forEach(coord => {
		let point = [
			coord[1],
			coord[0],
			coord[2]
		];
		latlngs.push(point);
	});
	return L.polyline(latlngs, {color: color});
}

function generateGraph(geoData) {
	if (document.getElementById("toHide").className === "collapse"){
			$('#toHide').collapse('toggle');
	}

	RGraph.reset(document.getElementById('cvs'));
	if (geoData.focus !== undefined) {
		let w2 = new Worker("js/chart.js", {type:'module'});
		document.getElementById("graph").setAttribute("style", "height:"+ ($(document).height() * 2/7) +"px; width: 100%; z-Index: 2; padding-left: 5%");
		w2.onmessage = event => {
			w2.terminate();
			w2 = undefined;
			document.getElementById("cvs").setAttribute("width", $(document).width() / 1.11);
			document.getElementById("cvs").setAttribute("height", $(document).height()/4);
			if (newMarker == undefined){
				var newMarker = new L.marker([-100,-10000]);
				var lay = new L.layerGroup([newMarker]).addTo(geoData.map);
			}

			document.getElementById("cvs").addEventListener("mouseout", () => {
				newMarker.setLatLng([-100,-10000]);
			});

			var line = new RGraph.Line({
	            id: 'cvs',
	            data: event.data[1],
	            options: {
									backgroundGridDashed: true,
									tooltips: function (event) {
										let x = geoData.paths[geoData.focus].features[0].geometry.coordinates[event][1];
										let y = geoData.paths[geoData.focus].features[0].geometry.coordinates[event][0];
										newMarker.setLatLng([x,y]);
										geoData.map.panTo(new L.LatLng(x,y));
									},
	                linewidth: 3,
								 	numxticks: event.data[0].length/10,
	                ylabels: true,
									unitsPost: 'm',
									crosshairs: true,
									crosshairsSnap: true,
	                textAccessible: true,
	            }
	        }).draw();
		}

		w2.postMessage(geoData.paths[geoData.focus]);
	}

	return geoData;
}

// Delete a row in the trace table
// Param : id -> index of the row you want to delete
// Return : none
function deleteTrace(geoData, id, conf = true) {
	if (!conf || confirm("Voulez vous vraiment supprimer ce fichier ?")) {
		geoData.layersControl.removeLayer(geoData.layers[id]);
		geoData.map.removeLayer(geoData.layers[id]);
		geoData.layers.splice(id, 1);
		geoData.paths.splice(id, 1);
		if (geoData.focus === id) {
			resetFocus(geoData);
			setFocusClass(geoData);
	   		movePOV(geoData);
	   	} else if (geoData.focus > id) {
	   		geoData.focus--;
	   	}
		setListenersUpdate(geoData);
	}
}

function setGeneralListeners(geoData) {
	// General
	document.getElementById("workPlan").addEventListener("contextmenu", evt => evt.preventDefault());
	document.getElementById("tutorialButton").addEventListener("click", evt => launchTutorial(geoData));

	return geoData;
}


function setListeners(geoData) {
	// Files import
    document.getElementById("importButton").addEventListener("click", () => upload(geoData));
	document.getElementById("hiddenButton").addEventListener("change", () => hiddenUpload(geoData));

	// Mode buttons
	document.getElementById("moveMap").addEventListener("click", () => moveMapMode(geoData));
	document.getElementById("movePoint").addEventListener("click", () => movePointMode(geoData));
	document.getElementById("reSample").addEventListener("click", () => reSample(geoData,document.getElementById("samplingFactor").value));
	document.getElementById("samplingFactor").addEventListener("keyup", e => keySample(geoData, e.keyCode));
	document.getElementById("saveButton").addEventListener("click", () => giveUserGpx(geoData));
	document.getElementById("addPoint").addEventListener("click", () => addPointMode(geoData));
	document.getElementById("deletePoint").addEventListener("click", () => deletePointMode(geoData));
	document.getElementById("link").addEventListener("click", () => linkMode(geoData));
	document.getElementById("buttonLink").addEventListener("click", () => linkTrace(geoData));
	document.getElementById("infos").addEventListener("click", () => infoTrace(geoData));
	document.getElementById("undo").addEventListener("click", () => undoMode(geoData));
	document.getElementById("redo").addEventListener("click", () => redoMode(geoData));

    return geoData;
}

function setListenersUpdate(geoData) {
	document.querySelectorAll(".leaflet-control-layers-overlays > label > div > input").forEach(input => {
		input.addEventListener("change", evt => {
			if (evt.target.checked) {
				geoData.focus = getIndexFile(evt.target);
			} else {
				resetFocus(geoData);
			}
			setFocusClass(geoData);
			movePOV(geoData);
		});
	});
	document.querySelectorAll(".leaflet-control-layers-overlays > label > div > span").forEach(span => {
		span.addEventListener("contextmenu", evt => {
			evt.preventDefault();
			deleteTrace(geoData, getIndexFile(evt.target));
		});
	});

	document.getElementById("unlink").addEventListener("click", () => unlinkMode(geoData));
	return geoData;
}

function getIndexFile(element) {
	let index = undefined;
	let i = 0;
	let clickables = Array.from(document.querySelectorAll(".leaflet-control-layers-overlays > label > div > *"));
	while (index === undefined && i < clickables.length) {
		if (element._leaflet_id === clickables[i]._leaflet_id) {
			index = i % 2 === 0 ? i / 2 : (i-1) / 2;
		}
		i++;
	}

	return index;
}

// Change geoData.focus to the first checked file
// Param : geoData
function resetFocus(geoData) {
	geoData.focus = undefined;
	let i = 0;
	let inputs = document.querySelectorAll(".leaflet-control-layers-overlays > label > div > input");
	while (geoData.focus === undefined && i < geoData.paths.length) {
		if (inputs[i].checked) {
			geoData.focus = i;
		}
		i++;
	}
}

function setFocusClass(geoData) {
	let lines = document.querySelectorAll(".leaflet-control-layers-overlays > label");
	lines.forEach(input => {
		input.classList.remove('focus');
	});
	if (geoData.focus !== undefined) {
		lines[geoData.focus].classList.add("focus");
	}
}
