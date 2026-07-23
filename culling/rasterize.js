/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog4/triangles.json"; // triangles file loc
const INPUT_ELLIPSOIDS_URL = "https://ncsucgclass.github.io/prog4/ellipsoids.json"; // ellipsoids file loc
var defaultEye = vec3.fromValues(0.5, 0.5, -0.5); // default eye position in world space
var defaultCenter = vec3.fromValues(0.5, 0.5, 0.5); // default view direction in world space
var defaultUp = vec3.fromValues(0, 1, 0); // default view up vector
var lightAmbient = vec3.fromValues(1, 1, 1); // default light ambient emission
var lightDiffuse = vec3.fromValues(1, 1, 1); // default light diffuse emission
var lightSpecular = vec3.fromValues(1, 1, 1); // default light specular emission
var lightPosition = vec3.fromValues(-0.5, 1.5, -0.5); // default light position
var rotateTheta = Math.PI / 50; // how much to rotate models by with each key press

/* webgl and geometry data */
var gl = null; // the all powerful gl object. It's all here folks!
var inputTriangles = []; // the triangle data as loaded from input files
var inputRoom = {};
var portals = {}
var numTriangleSets = 0; // how many triangle sets in input scene
var inputEllipsoids = []; // the ellipsoid data as loaded from input files
var numEllipsoids = 0; // how many ellipsoids in the input scene
var vertexBuffers = []; // this contains vertex coordinate lists by set, in triples
var normalBuffers = []; // this contains normal component lists by set, in triples
var uvBuffers = [];
var triSetSizes = []; // this contains the size of each triangle set
var triangleBuffers = []; // lists of indices into vertexBuffers by set, in triples
var viewDelta = 0; // how much to displace view with each key press
var textureVar = null;
var textures = []; // store all texture information
var blendingBool = false;
var custom = false;
var actualIteration = 0;
var currIteration = 0;
const intervalTick = 150;
var currentFrustum = {
	eye: Eye,
	topRightRay: vec3.fromValues(1, 1, -1),
	topLeftRay: vec3.fromValues(1, 1, 1),
	bottomLeftRay: vec3.fromValues(1, -1, 1),
	bottomRightRay: vec3.fromValues(1, -1, -1),
}

var cullingMode = "none";
var currentRoom = 0;
var notSeen = [];

// This holds a map from room number to different portals
// Format -> {roomNum: [{otherRoomNum: [portal1, portal2]}]}
/**portalN -> {
			points: [
				vec3.fromValues(3, 0, 0),
				vec3.fromValues(3, 0, 1),
				vec3.fromValues(4, 0, 0),
				vec3.fromValues(4, 0, 1),
				vec3.fromValues(3, 1, 0),
				vec3.fromValues(3, 1, 1),
				vec3.fromValues(4, 1, 0),
				vec3.fromValues(4, 1, 1),

			], directionOfPortal: vec3.fromValues(-1, 0, 0)
		} 
*/

/* shader parameter locations */
var vPosAttribLoc; // where to put position for vertex shader
var vNormAttribLoc; // where to put normals for vertex shader
var mMatrixULoc; // where to put model matrix for vertex shader
var vUVAttribLoc; // where to put uv information for vertex shader
var pvmMatrixULoc; // where to put project model view matrix for vertex shader
var ambientULoc; // where to put ambient reflecivity for fragment shader
var diffuseULoc; // where to put diffuse reflecivity for fragment shader
var specularULoc; // where to put specular reflecivity for fragment shader
var alphaULoc; // where to put alpha for fragment shader
var blendingModeULoc;
var shininessULoc; // where to put specular exponent for fragment shader
var textureULoc;

/* interaction variables */
var Eye = vec3.clone(defaultEye); // eye position in world space
var Center = vec3.clone(defaultCenter); // view direction in world space
var Up = vec3.clone(defaultUp); // view up vector in world space
var viewRight = vec3.create();

// ASSIGNMENT HELPER FUNCTIONS

/**
 * This function returns the room
 */
function getRooms() {
	let tempRoom = {
		"rooms": [["s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s"],
		["s", 0, 0, 0, 0, 0, "s", 1, 1, 1, 1, 1, "s"],
		["s", 0, 0, 0, 0, 0, "p", 1, 1, 1, 1, 1, "s"],
		["s", 0, 0, 0, 0, 0, "s", 1, 1, 1, 1, 1, "s"],
		["s", 0, 0, 0, 0, 0, "p", 1, 1, 1, 1, 1, "s"],
		["s", 0, 0, 0, 0, 0, "s", 1, 1, 1, 1, 1, "s"],
		["s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s"]],
		"furniture": [[0, 0, 0, "sphere", 0], [1, 4, 4, "triangleset", 0]]
	}

	let customTempRoom = {
		"rooms": [["s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s"],
		["s", 0, 0, "p", 3, 3, "s", 1, 1, "s", 2, 2, "s"],
		["s", 0, 0, "s", 3, 3, "p", 1, 1, "s", 2, 2, "s"],
		["s", 0, 0, "s", 3, 3, "s", 1, 1, "p", 2, 2, "s"],
		["s", 0, 0, "s", 3, 3, "p", 1, 1, "s", 2, 2, "s"],
		["s", 0, 0, "p", 3, 3, "s", 1, 1, "s", 2, 2, "s"],
		["s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s"]],
		"furniture": [[0, 0, 0, "sphere", 0], [1, 4, 4, "triangleset", 0]]
	}

	return custom ? customTempRoom : tempRoom;
}

/**
 * Gets json resource from url
 * @param {String} url url to the json resource
 * @param {String} descr description of the resource
 * @author Benjamin Watson
 * @author Ethan Patten eppatten
 */
function getJSONFile(url, descr) {
	let tempRoom = {
		"rooms": [["s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s"],
		["s", 0, 0, 0, 0, 0, "s", 1, 1, 1, 1, 1, "s"],
		["s", 0, 0, 0, 0, 0, "p", 1, 1, 1, 1, 1, "s"],
		["s", 0, 0, 0, 0, 0, "s", 1, 1, 1, 1, 1, "s"],
		["s", 0, 0, 0, 0, 0, "p", 1, 1, 1, 1, 1, "s"],
		["s", 0, 0, 0, 0, 0, "s", 1, 1, 1, 1, 1, "s"],
		["s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s", "s"]],
		"furniture": [[0, 0, 0, "sphere", 0], [1, 4, 4, "triangleset", 0]]
	}
	console.log(roomToTriangles(tempRoom));
	return roomToTriangles(tempRoom);
	try {
		if ((typeof (url) !== "string") || (typeof (descr) !== "string"))
			throw "getJSONFile: parameter not a string";
		else {
			var httpReq = new XMLHttpRequest(); // a new http request
			httpReq.open("GET", url, false); // init the request
			httpReq.send(null); // send the request
			var startTime = Date.now();
			while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
				if ((Date.now() - startTime) > 3000)
					break;
			} // until its loaded or we time out after three seconds
			if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
				throw "Unable to open " + descr + " file!";
			else
				return JSON.parse(httpReq.response);
		} // end if good params
	} // end try    

	catch (e) {
		console.log(e);
		return (String.null);
	}

} // end get input json file

/**
 * This function acts as the controls for when keys are pressed. 
 * @param {KeyboardEvent} event the event when a keyboard button is presseds
 * @author Benjamin Watson
 * @author Ethan Patten eppatten
 */
function handleKeyDown(event) {

	const modelEnum = { TRIANGLES: "triangles", ELLIPSOID: "ellipsoid" }; // enumerated model type
	const dirEnum = { NEGATIVE: -1, POSITIVE: 1 }; // enumerated rotation direction

	function highlightModel(modelType, whichModel) {
		if (handleKeyDown.modelOn != null)
			handleKeyDown.modelOn.on = false;
		handleKeyDown.whichOn = whichModel;
		if (modelType == modelEnum.TRIANGLES)
			handleKeyDown.modelOn = inputTriangles[whichModel];
		else
			handleKeyDown.modelOn = inputEllipsoids[whichModel];
		handleKeyDown.modelOn.on = true;
	} // end highlight model

	function translateModel(offset) {
		if (handleKeyDown.modelOn != null)
			vec3.add(handleKeyDown.modelOn.translation, handleKeyDown.modelOn.translation, offset);
	} // end translate model

	function rotateModel(axis, direction) {
		if (handleKeyDown.modelOn != null) {
			var newRotation = mat4.create();

			mat4.fromRotation(newRotation, direction * rotateTheta, axis); // get a rotation matrix around passed axis
			vec3.transformMat4(handleKeyDown.modelOn.xAxis, handleKeyDown.modelOn.xAxis, newRotation); // rotate model x axis tip
			vec3.transformMat4(handleKeyDown.modelOn.yAxis, handleKeyDown.modelOn.yAxis, newRotation); // rotate model y axis tip
		} // end if there is a highlighted model
	} // end rotate model

	// set up needed view params
	var lookAt = vec3.create(), temp = vec3.create(); // lookat, right & temp vectors
	lookAt = vec3.normalize(lookAt, vec3.subtract(temp, Center, Eye)); // get lookat vector
	viewRight = vec3.normalize(viewRight, vec3.cross(temp, lookAt, Up)); // get view right vector

	// highlight static variables
	handleKeyDown.whichOn = handleKeyDown.whichOn == undefined ? -1 : handleKeyDown.whichOn; // nothing selected initially
	handleKeyDown.modelOn = handleKeyDown.modelOn == undefined ? null : handleKeyDown.modelOn; // nothing selected initially

	switch (event.code) {

		// model selection
		case "Space":
			if (handleKeyDown.modelOn != null)
				handleKeyDown.modelOn.on = false; // turn off highlighted model
			handleKeyDown.modelOn = null; // no highlighted model
			handleKeyDown.whichOn = -1; // nothing highlighted
			break;
		case "ArrowRight": // select next triangle set
			highlightModel(modelEnum.TRIANGLES, (handleKeyDown.whichOn + 1) % numTriangleSets);
			break;
		case "ArrowLeft": // select previous triangle set
			highlightModel(modelEnum.TRIANGLES, (handleKeyDown.whichOn > 0) ? handleKeyDown.whichOn - 1 : numTriangleSets - 1);
			break;
		case "ArrowUp": // select next ellipsoid
			highlightModel(modelEnum.ELLIPSOID, (handleKeyDown.whichOn + 1) % numEllipsoids);
			break;
		case "ArrowDown": // select previous ellipsoid
			highlightModel(modelEnum.ELLIPSOID, (handleKeyDown.whichOn > 0) ? handleKeyDown.whichOn - 1 : numEllipsoids - 1);
			break;
		case "KeyM": // Reset view to look at the entire structure from one side
			// Example: View from the right side of the structure
			Eye = vec3.set(Eye, 2.0, 0.0, 0.0); // Camera position to the right
			Center = vec3.set(Center, 0.0, 0.0, 0.0); // Looking at the center of the structure
			Up = vec3.set(Up, 0.0, 1.0, 0.0); // Keep the camera upright
			window.requestAnimationFrame(renderModels); // Trigger a rerender
			break;
		// view change
		case "KeyD": // translate view left, rotate left with shift
			Center = vec3.add(Center, Center, vec3.scale(temp, viewRight, viewDelta));
			if (!event.getModifierState("Shift"))
				Eye = vec3.add(Eye, Eye, vec3.scale(temp, viewRight, viewDelta));
			break;
		case "KeyA": // translate view right, rotate right with shift
			Center = vec3.add(Center, Center, vec3.scale(temp, viewRight, -viewDelta));
			if (!event.getModifierState("Shift"))
				Eye = vec3.add(Eye, Eye, vec3.scale(temp, viewRight, -viewDelta));
			break;
		case "KeyS": // translate view backward, rotate up with shift
			if (event.getModifierState("Shift")) {
				Center = vec3.add(Center, Center, vec3.scale(temp, Up, viewDelta));
				Up = vec3.cross(Up, viewRight, vec3.subtract(lookAt, Center, Eye)); /* global side effect */
			} else {
				Eye = vec3.add(Eye, Eye, vec3.scale(temp, lookAt, -viewDelta));
				Center = vec3.add(Center, Center, vec3.scale(temp, lookAt, -viewDelta));
			} // end if shift not pressed
			break;
		case "KeyW": // translate view forward, rotate down with shift
			if (event.getModifierState("Shift")) {
				Center = vec3.add(Center, Center, vec3.scale(temp, Up, -viewDelta));
				Up = vec3.cross(Up, viewRight, vec3.subtract(lookAt, Center, Eye)); /* global side effect */
			} else {
				Eye = vec3.add(Eye, Eye, vec3.scale(temp, lookAt, viewDelta));
				Center = vec3.add(Center, Center, vec3.scale(temp, lookAt, viewDelta));
			} // end if shift not pressed
			break;
		case "KeyQ": // translate view up, rotate counterclockwise with shift
			if (event.getModifierState("Shift"))
				Up = vec3.normalize(Up, vec3.add(Up, Up, vec3.scale(temp, viewRight, -viewDelta)));
			else {
				Eye = vec3.add(Eye, Eye, vec3.scale(temp, Up, viewDelta));
				Center = vec3.add(Center, Center, vec3.scale(temp, Up, viewDelta));
			} // end if shift not pressed
			break;
		case "KeyE": // translate view down, rotate clockwise with shift
			if (event.getModifierState("Shift"))
				Up = vec3.normalize(Up, vec3.add(Up, Up, vec3.scale(temp, viewRight, viewDelta)));
			else {
				Eye = vec3.add(Eye, Eye, vec3.scale(temp, Up, -viewDelta));
				Center = vec3.add(Center, Center, vec3.scale(temp, Up, -viewDelta));
			} // end if shift not pressed
			break;
		case "Escape": // reset view to default
			Eye = vec3.copy(Eye, defaultEye);
			Center = vec3.copy(Center, defaultCenter);
			Up = vec3.copy(Up, defaultUp);
			break;

		// model transformation
		case "KeyK": // translate left, rotate left with shift
			if (event.getModifierState("Shift"))
				rotateModel(Up, dirEnum.NEGATIVE);
			else
				translateModel(vec3.scale(temp, viewRight, viewDelta));
			break;
		case "Semicolon": // translate right, rotate right with shift
			if (event.getModifierState("Shift"))
				rotateModel(Up, dirEnum.POSITIVE);
			else
				translateModel(vec3.scale(temp, viewRight, -viewDelta));
			break;
		case "KeyL": // translate backward, rotate up with shift
			if (event.getModifierState("Shift"))
				rotateModel(viewRight, dirEnum.POSITIVE);
			else
				translateModel(vec3.scale(temp, lookAt, -viewDelta));
			break;
		case "KeyO": // translate forward, rotate down with shift
			if (event.getModifierState("Shift"))
				rotateModel(viewRight, dirEnum.NEGATIVE);
			else
				translateModel(vec3.scale(temp, lookAt, viewDelta));
			break;
		case "KeyI": // translate up, rotate counterclockwise with shift 
			if (event.getModifierState("Shift"))
				rotateModel(lookAt, dirEnum.POSITIVE);
			else
				translateModel(vec3.scale(temp, Up, viewDelta));
			break;
		case "KeyP": // translate down, rotate clockwise with shift
			if (event.getModifierState("Shift"))
				rotateModel(lookAt, dirEnum.NEGATIVE);
			else
				translateModel(vec3.scale(temp, Up, -viewDelta));
			break;
		case "KeyB": // translate down, rotate clockwise with shift
			blendingBool = !blendingBool;
			break;
		case "Digit1":
			if (event.getModifierState("Shift")) {
				custom = !custom;
				window.requestAnimationFrame(main);
			} else {
				cullingMode = "none";
			} break;
		case "Digit2":
			cullingMode = "frustum";
			break;
		case "Digit3":
			console.log("pop")
			cullingMode = "portal";
			break;
		//window.requestAnimationFrame(setupShaders);
		//window.requestAnimationFrame(renderModels);
		case "Backspace": // reset model transforms to default
			for (var whichTriSet = 0; whichTriSet < numTriangleSets; whichTriSet++) {
				vec3.set(inputTriangles[whichTriSet].translation, 0, 0, 0);
				vec3.set(inputTriangles[whichTriSet].xAxis, 1, 0, 0);
				vec3.set(inputTriangles[whichTriSet].yAxis, 0, 1, 0);
			} // end for all triangle sets
			for (var whichEllipsoid = 0; whichEllipsoid < numEllipsoids; whichEllipsoid++) {
				vec3.set(inputEllipsoids[whichEllipsoid].translation, 0, 0, 0);
				vec3.set(inputEllipsoids[whichTriSet].xAxis, 1, 0, 0);
				vec3.set(inputEllipsoids[whichTriSet].yAxis, 0, 1, 0);
			} // end for all ellipsoids
			break;
		default:
			console.log(event.code)
	} // end switch
} // end handleKeyDown

/**
 * This function accepts a url and loads it as a texture in our gl program
 * @param {String} url The URL to the image resource
 * @author webglfundamentals.org https://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html
 * @author eppatten Ethan Patten
 */
function loadTexture(url) {
	var tex = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	// Fill the texture with a 1x1 blue pixel.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
		new Uint8Array([255, 255, 255, 255]));

	// let's assume all images are not a power of 2
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	var textureInfo = {
		width: 1,   // we don't know the size until it loads
		height: 1,
		texture: tex,
	};
	var img = new Image();
	img.addEventListener('load', function() {
		console.log("Image loaded:", img.width, img.height);
		textureInfo.width = img.width;
		textureInfo.height = img.height;
		gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	});
	requestCORSIfNotSameOrigin(img, url);
	img.src = url;
	console.log(img.src);

	return textureInfo;
}

function isPowerOf2(value) {
	return (value & (value - 1)) === 0;
}

function requestCORSIfNotSameOrigin(img, url) {
	if ((new URL(url, window.location.href)).origin !== window.location.origin) {
		img.crossOrigin = "";
	}
}

// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(gl, buffers, programInfo) {
	const num = 2; // every coordinate composed of 2 values
	const type = gl.FLOAT; // the data in the buffer is 32-bit float
	const normalize = false; // don't normalize
	const stride = 0; // how many bytes to get from one set to the next
	const offset = 0; // how many bytes inside the buffer to start from
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
	gl.vertexAttribPointer(
		programInfo.attribLocations.textureCoord,
		num,
		type,
		normalize,
		stride,
		offset,
	);
	gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

function initTextureBuffer(gl) {
	const textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

	const textureCoordinates = [
		// Front
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Back
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Top
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Bottom
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Right
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
		// Left
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
	];

	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(textureCoordinates),
		gl.STATIC_DRAW,
	);

	return textureCoordBuffer;
}



// set up the webGL environment
function setupWebGL() {

	// Set up keys
	document.onkeydown = handleKeyDown; // call this when key pressed


	// Get the canvas and context
	var canvas = document.getElementById("myWebGLCanvas"); // create a js canvas
	gl = canvas.getContext("webgl", { premultipliedAlpha: false }); // get a webgl object from it
	gl.enable(gl.BLEND);
	//TODO we will not do blending for now, no transparency
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	try {
		if (gl == null) {
			throw "unable to create gl context -- is your browser gl ready?";
		} else {
			//gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
			gl.clearDepth(1.0); // use max when we clear the depth buffer
			gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
		}
	} // end try

	catch (e) {
		console.log(e);
	} // end catch

} // end setupWebGL

// read models in, load them into webgl buffers
function loadModels() {

	// make an ellipsoid, with numLongSteps longitudes.
	// start with a sphere of radius 1 at origin
	// Returns verts, tris and normals.
	function makeEllipsoid(currEllipsoid, numLongSteps) {

		try {
			if (numLongSteps % 2 != 0)
				throw "in makeSphere: uneven number of longitude steps!";
			else if (numLongSteps < 4)
				throw "in makeSphere: number of longitude steps too small!";
			else { // good number longitude steps

				console.log("ellipsoid xyz: " + ellipsoid.x + " " + ellipsoid.y + " " + ellipsoid.z);

				// make vertices
				var ellipsoidVertices = [0, -1, 0]; // vertices to return, init to south pole
				var ellipsoidUVs = [0.5, 0.0]; // start with UV for the south pole

				var angleIncr = (Math.PI + Math.PI) / numLongSteps; // angular increment 
				var latLimitAngle = angleIncr * (Math.floor(numLongSteps / 4) - 1); // start/end lat angle
				var latRadius, latY; // radius and Y at current latitude

				for (var latAngle = -latLimitAngle; latAngle <= latLimitAngle; latAngle += angleIncr) {
					latRadius = Math.cos(latAngle);
					latY = Math.sin(latAngle);
					for (var longAngle = 0; longAngle < 2 * Math.PI; longAngle += angleIncr) {
						ellipsoidVertices.push(latRadius * Math.sin(longAngle), latY, latRadius * Math.cos(longAngle));
						// Calculate UV coordinates
						var u = lon / (2 * Math.PI);
						var v = lat / Math.PI;
						ellipsoidUVs.push(u, v);
					}
				}
				ellipsoidVertices.push(0, 1, 0); // add north pole
				ellipsoidUVs.push(0.5, 1.0); // UV for the north pole

				ellipsoidVertices = ellipsoidVertices.map(function(val, idx) { // position and scale ellipsoid
					switch (idx % 3) {
						case 0: // x
							return (val * currEllipsoid.a + currEllipsoid.x);
						case 1: // y
							return (val * currEllipsoid.b + currEllipsoid.y);
						case 2: // z
							return (val * currEllipsoid.c + currEllipsoid.z);
					} // end switch
				});

				// make normals using the ellipsoid gradient equation
				// resulting normals are unnormalized: we rely on shaders to normalize
				var ellipsoidNormals = ellipsoidVertices.slice(); // start with a copy of the transformed verts
				ellipsoidNormals = ellipsoidNormals.map(function(val, idx) { // calculate each normal
					switch (idx % 3) {
						case 0: // x
							return (2 / (currEllipsoid.a * currEllipsoid.a) * (val - currEllipsoid.x));
						case 1: // y
							return (2 / (currEllipsoid.b * currEllipsoid.b) * (val - currEllipsoid.y));
						case 2: // z
							return (2 / (currEllipsoid.c * currEllipsoid.c) * (val - currEllipsoid.z));
					} // end switch
				});

				// make triangles, from south pole to middle latitudes to north pole
				var ellipsoidTriangles = []; // triangles to return
				for (var whichLong = 1; whichLong < numLongSteps; whichLong++) // south pole
					ellipsoidTriangles.push(0, whichLong, whichLong + 1);
				ellipsoidTriangles.push(0, numLongSteps, 1); // longitude wrap tri
				var llVertex; // lower left vertex in the current quad
				for (var whichLat = 0; whichLat < (numLongSteps / 2 - 2); whichLat++) { // middle lats
					for (var whichLong = 0; whichLong < numLongSteps - 1; whichLong++) {
						llVertex = whichLat * numLongSteps + whichLong + 1;
						ellipsoidTriangles.push(llVertex, llVertex + numLongSteps, llVertex + numLongSteps + 1);
						ellipsoidTriangles.push(llVertex, llVertex + numLongSteps + 1, llVertex + 1);
					} // end for each longitude
					ellipsoidTriangles.push(llVertex + 1, llVertex + numLongSteps + 1, llVertex + 2);
					ellipsoidTriangles.push(llVertex + 1, llVertex + 2, llVertex - numLongSteps + 2);
				} // end for each latitude
				for (var whichLong = llVertex + 2; whichLong < llVertex + numLongSteps + 1; whichLong++) // north pole
					ellipsoidTriangles.push(whichLong, ellipsoidVertices.length / 3 - 1, whichLong + 1);
				ellipsoidTriangles.push(ellipsoidVertices.length / 3 - 2, ellipsoidVertices.length / 3 - 1,
					ellipsoidVertices.length / 3 - numLongSteps - 1); // longitude wrap
			} // end if good number longitude steps
			return ({ vertices: ellipsoidVertices, normals: ellipsoidNormals, triangles: ellipsoidTriangles, uvs: ellipsoidUVs });
		} // end try

		catch (e) {
			console.log(e);
		} // end catch
	} // end make ellipsoid

	inputRoom = getRooms(); // read in the triangle data
	// Load texture

	inputTriangles = roomToTriangles(inputRoom);

	portals = roomToPortals(inputRoom)



	try {
		if (inputTriangles == String.null)
			throw "Unable to load triangles file!";
		else {
			var whichSetVert; // index of vertex in current triangle set
			var whichSetTri; // index of triangle in current triangle set
			var vtxToAdd; // vtx coords to add to the coord array
			var normToAdd; // vtx normal to add to the coord array
			var triToAdd; // tri indices to add to the index array
			var maxCorner = vec3.fromValues(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE); // bbox corner
			var minCorner = vec3.fromValues(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE); // other corner

			// process each triangle set to load webgl vertex and triangle buffers
			numTriangleSets = inputTriangles.length; // remember how many tri sets
			for (var whichSet = 0; whichSet < numTriangleSets; whichSet++) { // for each tri set
				var texture = null;
				texture = loadTexture("https://raw.githubusercontent.com/eppatten/CSC-562/master/culling/" + inputTriangles[whichSet].material.texture);
				textures.push(texture.texture)
				// Flip image pixels into the bottom-to-top order that WebGL expects.
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


				// set up hilighting, modeling translation and rotation
				inputTriangles[whichSet].center = vec3.fromValues(0, 0, 0);  // center point of tri set
				inputTriangles[whichSet].on = false; // not highlighted
				inputTriangles[whichSet].translation = vec3.fromValues(0, 0, 0); // no translation
				inputTriangles[whichSet].xAxis = vec3.fromValues(1, 0, 0); // model X axis
				inputTriangles[whichSet].yAxis = vec3.fromValues(0, 1, 0); // model Y axis 

				// set up the vertex and normal arrays, define model center and axes
				inputTriangles[whichSet].glVertices = []; // flat coord list for webgl
				inputTriangles[whichSet].glNormals = []; // flat normal list for webgl
				inputTriangles[whichSet].glUVs = [];
				var numVerts = inputTriangles[whichSet].vertices.length; // num vertices in tri set
				for (whichSetVert = 0; whichSetVert < numVerts; whichSetVert++) { // verts in set
					vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert]; // get vertex to add
					normToAdd = inputTriangles[whichSet].normals[whichSetVert]; // get normal to add
					UVToAdd = inputTriangles[whichSet].uvs[whichSetVert];
					inputTriangles[whichSet].glVertices.push(vtxToAdd[0], vtxToAdd[1], vtxToAdd[2]); // put coords in set coord list
					inputTriangles[whichSet].glNormals.push(normToAdd[0], normToAdd[1], normToAdd[2]); // put normal in set coord list
					inputTriangles[whichSet].glUVs.push(UVToAdd[0], UVToAdd[1]); // put normal in set coord list
					vec3.max(maxCorner, maxCorner, vtxToAdd); // update world bounding box corner maxima
					vec3.min(minCorner, minCorner, vtxToAdd); // update world bounding box corner minima
					vec3.add(inputTriangles[whichSet].center, inputTriangles[whichSet].center, vtxToAdd); // add to ctr sum
				} // end for vertices in set
				vec3.scale(inputTriangles[whichSet].center, inputTriangles[whichSet].center, 1 / numVerts); // avg ctr sum

				// send the vertex coords and normals to webGL
				vertexBuffers[whichSet] = gl.createBuffer(); // init empty webgl set vertex coord buffer
				gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[whichSet]); // activate that buffer
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(inputTriangles[whichSet].glVertices), gl.STATIC_DRAW); // data in
				normalBuffers[whichSet] = gl.createBuffer(); // init empty webgl set normal component buffer
				gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[whichSet]); // activate that buffer
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(inputTriangles[whichSet].glNormals), gl.STATIC_DRAW); // data in

				uvBuffers[whichSet] = gl.createBuffer(); // init empty webgl set normal component buffer
				gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffers[whichSet]); // activate that buffer
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(inputTriangles[whichSet].glUVs), gl.STATIC_DRAW); // data in

				//console.log(new Float32Array(inputTriangles[whichSet].glUVs));
				//console.log(uvBuffers);
				//console.log(normalBuffers);

				// set up the triangle index array, adjusting indices across sets
				inputTriangles[whichSet].glTriangles = []; // flat index list for webgl
				triSetSizes[whichSet] = inputTriangles[whichSet].triangles.length; // number of tris in this set
				for (whichSetTri = 0; whichSetTri < triSetSizes[whichSet]; whichSetTri++) {
					triToAdd = inputTriangles[whichSet].triangles[whichSetTri]; // get tri to add
					inputTriangles[whichSet].glTriangles.push(triToAdd[0], triToAdd[1], triToAdd[2]); // put indices in set list
				} // end for triangles in set

				// send the triangle indices to webGL
				triangleBuffers.push(gl.createBuffer()); // init empty triangle index buffer
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffers[whichSet]); // activate that buffer
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(inputTriangles[whichSet].glTriangles), gl.STATIC_DRAW); // data in

			} // end for each triangle set 

			var temp = vec3.create(); // an intermediate vec3

			viewDelta = vec3.length(vec3.subtract(temp, maxCorner, minCorner)) / 500; // set global

			inputEllipsoids = getJSONFile(INPUT_ELLIPSOIDS_URL, "ellipsoids"); // read in the ellipsoids

			if (inputEllipsoids == String.null)
				throw "Unable to load ellipsoids file!";
			else if (false) { // CHANGE THIS FOR ENABLING ELLIPSOIDS

				// init ellipsoid highlighting, translation and rotation; update bbox
				var ellipsoid; // current ellipsoid
				var ellipsoidModel; // current ellipsoid triangular model
				var minXYZ = vec3.create(), maxXYZ = vec3.create();  // min/max xyz from ellipsoid
				numEllipsoids = inputEllipsoids.length; // remember how many ellipsoids


				for (var whichEllipsoid = 0; whichEllipsoid < numEllipsoids; whichEllipsoid++) {

					// set up various stats and transforms for this ellipsoid
					ellipsoid = inputEllipsoids[whichEllipsoid];
					ellipsoid.on = false; // ellipsoids begin without highlight
					ellipsoid.translation = vec3.fromValues(0, 0, 0); // ellipsoids begin without translation
					ellipsoid.xAxis = vec3.fromValues(1, 0, 0); // ellipsoid X axis
					ellipsoid.yAxis = vec3.fromValues(0, 1, 0); // ellipsoid Y axis 
					ellipsoid.center = vec3.fromValues(ellipsoid.x, ellipsoid.y, ellipsoid.z); // locate ellipsoid ctr
					vec3.set(minXYZ, ellipsoid.x - ellipsoid.a, ellipsoid.y - ellipsoid.b, ellipsoid.z - ellipsoid.c);
					vec3.set(maxXYZ, ellipsoid.x + ellipsoid.a, ellipsoid.y + ellipsoid.b, ellipsoid.z + ellipsoid.c);
					vec3.min(minCorner, minCorner, minXYZ); // update world bbox min corner
					vec3.max(maxCorner, maxCorner, maxXYZ); // update world bbox max corner

					// make the ellipsoid model
					ellipsoidModel = makeEllipsoid(ellipsoid, 32);

					// send the ellipsoid vertex coords and normals to webGL
					vertexBuffers.push(gl.createBuffer()); // init empty webgl ellipsoid vertex coord buffer
					gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[vertexBuffers.length - 1]); // activate that buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ellipsoidModel.vertices), gl.STATIC_DRAW); // data in

					normalBuffers.push(gl.createBuffer()); // init empty webgl ellipsoid vertex normal buffer
					gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[normalBuffers.length - 1]); // activate that buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ellipsoidModel.normals), gl.STATIC_DRAW); // data in

					uvBuffers.push(gl.createBuffer()); // init empty webgl ellipsoid vertex normal buffer
					gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffers[uvBuffers.length - 1]); // activate that buffer
					gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ellipsoidModel.uvs), gl.STATIC_DRAW); // data in

					console.log(new Float32Array(ellipsoidModel.uvs));


					triSetSizes.push(ellipsoidModel.triangles.length);
					console.log(uvBuffers);
					console.log(normalBuffers);

					// send the triangle indices to webGL
					triangleBuffers.push(gl.createBuffer()); // init empty triangle index buffer
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffers[triangleBuffers.length - 1]); // activate that buffer
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ellipsoidModel.triangles), gl.STATIC_DRAW); // data in

					// send the uv information per vertex
					//uvBuffers.push(gl.createBuffer());
					//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, uvBuffers[triangleBuffers.length - 1]); // activate that buffer
					//gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ellipsoidModel.triangles), gl.STATIC_DRAW); // data in
				} // end for each ellipsoid


			} // end if ellipsoid file loaded
		} // end if triangle file loaded
	} // end try 

	catch (e) {
		console.log(e);
	} // end catch
} // end load models

// setup the webGL shaders
function setupShaders() {

	// define vertex shader in essl using es6 template strings
	var vShaderCode = `
        attribute vec3 aVertexPosition; // vertex position
        attribute vec3 aVertexNormal; // vertex normal
		attribute vec2 uvTexValueInput; // the input uv coordinates
        
        uniform mat4 umMatrix; // the model matrix
        uniform mat4 upvmMatrix; // the project view model matrix\
        
        varying vec3 vWorldPos; // interpolated world position of vertex
        varying vec3 vVertexNormal; // interpolated normal for frag shader
		varying vec2 uvTexValue; // the uv coordinates to be passed to frag

        void main(void) {
            
            // vertex position
            vec4 vWorldPos4 = umMatrix * vec4(aVertexPosition, 1.0);
            vWorldPos = vec3(vWorldPos4.x,vWorldPos4.y,vWorldPos4.z);
            gl_Position = upvmMatrix * vec4(aVertexPosition, 1.0);

            // vertex normal (assume no non-uniform scale)
            vec4 vWorldNormal4 = umMatrix * vec4(aVertexNormal, 0.0);
            vVertexNormal = normalize(vec3(vWorldNormal4.x,vWorldNormal4.y,vWorldNormal4.z)); 
			
			// vertex uv coordinates
			uvTexValue = uvTexValueInput;
        }
    `;

	// define fragment shader in essl using es6 template strings
	var fShaderCode = `
        precision mediump float; // set float to medium precision

        // eye location
        uniform vec3 uEyePosition; // the eye's position in world
        
		uniform bool uShouldRenderFrustumCulling;
		
		uniform vec3 topRightRay;
		uniform vec3 topLeftRay;
		uniform vec3 bottomLeftRay;
		uniform vec3 bottomRightRay;
		
        // light properties
        uniform vec3 uLightAmbient; // the light's ambient color
        uniform vec3 uLightDiffuse; // the light's diffuse color
        uniform vec3 uLightSpecular; // the light's specular color
        uniform vec3 uLightPosition; // the light's position
        
        // material properties
        uniform vec3 uAmbient; // the ambient reflectivity
        uniform vec3 uDiffuse; // the diffuse reflectivity
        uniform vec3 uSpecular; // the specular reflectivity
		uniform float uAlpha; // the alpha reflectivity
        uniform float uShininess; // the specular exponent
		uniform bool blendingMode; // which blending mode to select
		uniform bool uShouldRender; // A uniform to control rendering condition
        
        // geometry properties
        varying vec3 vWorldPos; // world xyz of fragment
        varying vec3 vVertexNormal; // normal of fragment
		
		// texture properties
		uniform sampler2D u_texture; // the actual texture file referenced. 
		varying vec2 uvTexValue; // the interpolated uv coordinates to be passed from point
            
        void main(void) {
			
			if (!uShouldRenderFrustumCulling) {
				;
		    }
			
			vec2 newTexValue = vec2(1.0 - uvTexValue.x, uvTexValue.y);
			
			vec4 textureColor = texture2D(u_texture, newTexValue);
        
            // ambient term
            vec3 ambient = uAmbient*uLightAmbient; 
            
            // diffuse term
            vec3 normal = normalize(vVertexNormal); 
            vec3 light = normalize(uLightPosition - vWorldPos);
            float lambert = max(0.0,dot(normal,light));
            vec3 diffuse = uDiffuse*uLightDiffuse*lambert; // diffuse term
            
            // specular term
            vec3 eye = normalize(uEyePosition - vWorldPos);
            vec3 halfVec = normalize(light+eye);
            float highlight = pow(max(0.0,dot(normal,halfVec)),uShininess);
            vec3 specular = uSpecular*uLightSpecular*highlight; // specular term
            
            // combine to output color
            vec3 colorOut = ambient + diffuse + specular; // no specular yet
			if (blendingMode) {
				vec3 colorBlended = vec3(textureColor) * colorOut;
				gl_FragColor = vec4(colorBlended, textureColor[3] * uAlpha); // Output UV coordinates as color
			} else {
				float luminValue = (length(colorOut) + length(vec3(textureColor))) / 2.0; // Calculating luminance value by taking the average of the length of each color vector
				vec3 colorBlended = luminValue * vec3(textureColor) + (1.0 - luminValue) * colorOut;
				gl_FragColor = vec4(colorBlended, textureColor[3] * uAlpha); // Output UV coordinates as color
			}
			
        }
    `;

	try {
		var fShader = gl.createShader(gl.FRAGMENT_SHADER); // create frag shader
		gl.shaderSource(fShader, fShaderCode); // attach code to shader
		gl.compileShader(fShader); // compile the code for gpu execution

		var vShader = gl.createShader(gl.VERTEX_SHADER); // create vertex shader
		gl.shaderSource(vShader, vShaderCode); // attach code to shader
		gl.compileShader(vShader); // compile the code for gpu execution

		if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { // bad frag shader compile
			throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);
			gl.deleteShader(fShader);
		} else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { // bad vertex shader compile
			throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);
			gl.deleteShader(vShader);
		} else { // no compile errors
			var shaderProgram = gl.createProgram(); // create the single shader program
			gl.attachShader(shaderProgram, fShader); // put frag shader in program
			gl.attachShader(shaderProgram, vShader); // put vertex shader in program
			gl.linkProgram(shaderProgram); // link program into gl context

			if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
				throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
			} else { // no shader program link errors
				gl.useProgram(shaderProgram); // activate shader program (frag and vert)

				// locate and enable vertex attributes
				vPosAttribLoc = gl.getAttribLocation(shaderProgram, "aVertexPosition"); // ptr to vertex pos attrib
				gl.enableVertexAttribArray(vPosAttribLoc); // connect attrib to array
				vNormAttribLoc = gl.getAttribLocation(shaderProgram, "aVertexNormal"); // ptr to vertex normal attrib
				gl.enableVertexAttribArray(vNormAttribLoc); // connect attrib to array
				vUVAttribLoc = gl.getAttribLocation(shaderProgram, "uvTexValueInput");
				gl.enableVertexAttribArray(vUVAttribLoc); // connect attrib to array

				// locate vertex uniforms
				mMatrixULoc = gl.getUniformLocation(shaderProgram, "umMatrix"); // ptr to mmat
				pvmMatrixULoc = gl.getUniformLocation(shaderProgram, "upvmMatrix"); // ptr to pvmmat

				// locate fragment uniforms
				var shouldRenderLoc = gl.getUniformLocation(shaderProgram, "uShouldRenderFrustumCulling");
				var eyePositionULoc = gl.getUniformLocation(shaderProgram, "uEyePosition"); // ptr to eye position
				var lightAmbientULoc = gl.getUniformLocation(shaderProgram, "uLightAmbient"); // ptr to light ambient
				var lightDiffuseULoc = gl.getUniformLocation(shaderProgram, "uLightDiffuse"); // ptr to light diffuse
				var lightSpecularULoc = gl.getUniformLocation(shaderProgram, "uLightSpecular"); // ptr to light specular
				var lightPositionULoc = gl.getUniformLocation(shaderProgram, "uLightPosition"); // ptr to light position
				var topRightRayULoc = gl.getUniformLocation(shaderProgram, "topRightRay");
				var topLeftRayULoc = gl.getUniformLocation(shaderProgram, "topLeftRay");
				var botomLeftRayULoc = gl.getUniformLocation(shaderProgram, "bottomLeftRay");
				var bottomRightRayULoc = gl.getUniformLocation(shaderProgram, "bottomRightRay");

				ambientULoc = gl.getUniformLocation(shaderProgram, "uAmbient"); // ptr to ambient
				diffuseULoc = gl.getUniformLocation(shaderProgram, "uDiffuse"); // ptr to diffuse
				specularULoc = gl.getUniformLocation(shaderProgram, "uSpecular"); // ptr to specular
				alphaULoc = gl.getUniformLocation(shaderProgram, "uAlpha");
				blendingModeULoc = gl.getUniformLocation(shaderProgram, "blendingMode");
				shininessULoc = gl.getUniformLocation(shaderProgram, "uShininess"); // ptr to shininess
				textureULoc = gl.getUniformLocation(shaderProgram, "u_texture");

				// pass global constants into fragment uniforms
				gl.uniform3fv(eyePositionULoc, Eye); // pass in the eye's position
				gl.uniform3fv(lightAmbientULoc, lightAmbient); // pass in the light's ambient emission
				gl.uniform3fv(lightDiffuseULoc, lightDiffuse); // pass in the light's diffuse emission
				gl.uniform3fv(lightSpecularULoc, lightSpecular); // pass in the light's specular emission
				gl.uniform3fv(lightPositionULoc, lightPosition); // pass in the light's position
				gl.uniform3fv(topRightRayULoc, currentFrustum.topRightRay);
				gl.uniform3fv(topLeftRayULoc, currentFrustum.topLeftRay);
				gl.uniform3fv(botomLeftRayULoc, currentFrustum.bottomLeftRay);
				gl.uniform3fv(bottomRightRayULoc, currentFrustum.bottomRightRay);
				gl.uniform1i(textureULoc, 0);
				gl.uniform1i(shouldRenderLoc, false); // false means discard triangles
			} // end if no shader program link errors
		} // end if no compile errors
	} // end try 

	catch (e) {
		console.log(e);
	} // end catch
} // end setup shaders

var frameTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var currFrameIdx = 0;
var start = performance.now();
var finish = performance.now();

// render the loaded model
function renderModels() {

	// construct the model transform matrix, based on model state
	function makeModelTransform(currModel) {
		var zAxis = vec3.create(), sumRotation = mat4.create(), temp = mat4.create(), negCtr = vec3.create();

		currModel.center = vec3.fromValues(0, 0, 0);
		currModel.yAxis = vec3.fromValues(0, 1, 0);
		currModel.xAxis = vec3.fromValues(1, 0, 0);
		currModel.translation = vec3.fromValues(-3, 0, -4);

		// move the model to the origin
		mat4.fromTranslation(mMatrix, vec3.negate(negCtr, currModel.center));

		// scale for highlighting if needed
		if (currModel.on)
			mat4.multiply(mMatrix, mat4.fromScaling(temp, vec3.fromValues(1.2, 1.2, 1.2)), mMatrix); // S(1.2) * T(-ctr)

		// rotate the model to current interactive orientation
		vec3.normalize(zAxis, vec3.cross(zAxis, currModel.xAxis, currModel.yAxis)); // get the new model z axis
		mat4.set(sumRotation, // get the composite rotation
			currModel.xAxis[0], currModel.yAxis[0], zAxis[0], 0,
			currModel.xAxis[1], currModel.yAxis[1], zAxis[1], 0,
			currModel.xAxis[2], currModel.yAxis[2], zAxis[2], 0,
			0, 0, 0, 1);
		mat4.multiply(mMatrix, sumRotation, mMatrix); // R(ax) * S(1.2) * T(-ctr)

		// translate back to model center
		mat4.multiply(mMatrix, mat4.fromTranslation(temp, currModel.center), mMatrix); // T(ctr) * R(ax) * S(1.2) * T(-ctr)

		// translate model to current interactive orientation
		mat4.multiply(mMatrix, mat4.fromTranslation(temp, currModel.translation), mMatrix); // T(pos)*T(ctr)*R(ax)*S(1.2)*T(-ctr)

	} // end make model transform	

	// var hMatrix = mat4.create(); // handedness matrix
	var pMatrix = mat4.create(); // projection matrix
	var vMatrix = mat4.create(); // view matrix
	var mMatrix = mat4.create(); // model matrix
	var pvMatrix = mat4.create(); // hand * proj * view matrices
	var pvmMatrix = mat4.create(); // hand * proj * view * model matrices

	window.requestAnimationFrame(renderModels); // set up frame render callback

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear frame/depth buffers


	// set up projection and view
	// mat4.fromScaling(hMatrix,vec3.fromValues(-1,1,1)); // create handedness matrix
	mat4.perspective(pMatrix, 0.5 * Math.PI, 1, 0.1, 10); // create projection matrix
	mat4.lookAt(vMatrix, Eye, Center, Up); // create view matrix
	mat4.multiply(pvMatrix, pvMatrix, pMatrix); // projection
	mat4.multiply(pvMatrix, pvMatrix, vMatrix); // projection * view

	// render each triangle set
	var totalCount = 0;

	var currSet; // the tri set and its material properties

	/*const expectedOutput0 = [{
		points: ROOM_CELL_TO_3D_BLOCK(roomJson, 1, 2, 1, [0, 0, 0]).vertices,
		directionOfPortal: vec3.fromValues(1, 0, 0),
		connectingRoom: 1
	}];
	const expectedOutput1 = [{
		points: ROOM_CELL_TO_3D_BLOCK(roomJson, 1, 2, 1, [0, 0, 0]).vertices,
		directionOfPortal: vec3.fromValues(-1, 0, 0),
		connectingRoom: 0
	}]*/


	currentFrustum.to = 0;
	var portalFrustums = [currentFrustum];
	var queuedFrustums = [];
	var currentCheckingPortalRoom = 0;

	var checkedRooms = [];

	while (portalFrustums.length != 0) {

		let currentCheckingFrustum = portalFrustums[portalFrustums.length - 1];

		currentCheckingPortalRoom = currentCheckingFrustum.to;

		for (var whichTriSet = 0; whichTriSet < numTriangleSets; whichTriSet++) {
			//console.log(inputTriangles[whichTriSet]);
			//console.log(currentFrustum);
			notSeen[whichTriSet] = true;
			if (cullingMode == "frustum" || cullingMode == "portal") {
				if (!isTriInFrustum(currentFrustum, inputTriangles[whichTriSet].vertices)) {
					continue;
				}
				if (cullingMode == "portal") {
					if (inputTriangles[whichTriSet].roomType == currentCheckingPortalRoom && inputTriangles[whichTriSet].roomType != "p") {
						console.log(currentCheckingFrustum)
						if (!isTriInFrustum(currentCheckingFrustum, inputTriangles[whichTriSet].vertices)) {
							console.log("poop")
							continue;
						}
					} else if (inputTriangles[whichTriSet].roomType != "p") {
						if (!isTriInFrustum(currentCheckingFrustum, inputTriangles[whichTriSet].vertices)) {
							console.log("poop")
							continue;
						}
					}
				}
			}

			notSeen[whichTriSet] = false;

			totalCount += inputTriangles[whichTriSet].triangles.length;
			//console.log(inputTriangles);
			currSet = inputTriangles[whichTriSet];

			gl.bindTexture(gl.TEXTURE_2D, textures[whichTriSet]);

			// make model transform, add to view project
			makeModelTransform(currSet);
			mat4.multiply(pvmMatrix, pvMatrix, mMatrix); // project * view * model
			gl.uniformMatrix4fv(mMatrixULoc, false, mMatrix); // pass in the m matrix
			gl.uniformMatrix4fv(pvmMatrixULoc, false, pvmMatrix); // pass in the hpvm matrix

			// reflectivity: feed to the fragment shader
			gl.uniform3fv(ambientULoc, currSet.material.ambient); // pass in the ambient reflectivity
			gl.uniform3fv(diffuseULoc, currSet.material.diffuse); // pass in the diffuse reflectivity
			gl.uniform3fv(specularULoc, currSet.material.specular); // pass in the specular reflectivity
			gl.uniform1f(alphaULoc, currSet.material.alpha); // pass in the alpha value
			gl.uniform1i(blendingModeULoc, blendingBool);
			gl.uniform1f(shininessULoc, currSet.material.n); // pass in the specular exponent

			// vertex buffer: activate and feed into vertex shader
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[whichTriSet]); // activate
			gl.vertexAttribPointer(vPosAttribLoc, 3, gl.FLOAT, false, 0, 0); // feed
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[whichTriSet]); // activate
			gl.vertexAttribPointer(vNormAttribLoc, 3, gl.FLOAT, false, 0, 0); // feed
			gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffers[whichTriSet]);
			gl.vertexAttribPointer(vUVAttribLoc, 2, gl.FLOAT, false, 0, 0);

			// triangle buffer: activate and render
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffers[whichTriSet]); // activate


			gl.drawElements(gl.TRIANGLES, 3 * triSetSizes[whichTriSet], gl.UNSIGNED_SHORT, 0); // render
		} // end for each triangle set

		// render each ellipsoid
		var ellipsoid, instanceTransform = mat4.create(); // the current ellipsoid and material

		for (var whichEllipsoid = 0; whichEllipsoid < numEllipsoids; whichEllipsoid++) {
			ellipsoid = inputEllipsoids[whichEllipsoid];

			// define model transform, premult with pvmMatrix, feed to vertex shader
			makeModelTransform(ellipsoid);
			pvmMatrix = mat4.multiply(pvmMatrix, pvMatrix, mMatrix); // premultiply with pv matrix
			gl.uniformMatrix4fv(mMatrixULoc, false, mMatrix); // pass in model matrix
			gl.uniformMatrix4fv(pvmMatrixULoc, false, pvmMatrix); // pass in project view model matrix

			// reflectivity: feed to the fragment shader
			gl.uniform3fv(ambientULoc, ellipsoid.ambient); // pass in the ambient reflectivity
			gl.uniform3fv(diffuseULoc, ellipsoid.diffuse); // pass in the diffuse reflectivity
			gl.uniform3fv(specularULoc, ellipsoid.specular); // pass in the specular reflectivity
			gl.uniform1f(alphaULoc, currSet.material.alpha); // pass in the alpha value
			gl.uniform1i(blendingModeULoc, blendingBool);
			gl.uniform1f(shininessULoc, ellipsoid.n); // pass in the specular exponent

			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffers[numTriangleSets + whichEllipsoid]); // activate vertex buffer
			gl.vertexAttribPointer(vPosAttribLoc, 3, gl.FLOAT, false, 0, 0); // feed vertex buffer to shader
			gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffers[numTriangleSets + whichEllipsoid]); // activate normal buffer
			gl.vertexAttribPointer(vNormAttribLoc, 3, gl.FLOAT, false, 0, 0); // feed normal buffer to shader
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffers[numTriangleSets + whichEllipsoid]); // activate tri buffer

			// draw a transformed instance of the ellipsoid
			gl.drawElements(gl.TRIANGLES, triSetSizes[numTriangleSets + whichEllipsoid], gl.UNSIGNED_SHORT, 0); // render
		} // end for each ellipsoid

		// Now that we have checked this frustum, remove it
		portalFrustums.pop();

		if (cullingMode == "portal") {

			// Check to make sure that the room this portal looks into isn't already checked
			if (checkedRooms.indexOf(currentCheckingPortalRoom) == -1) {
				// Iterate through all the portals in that new room
				//console.log(portals[0]);
				for (let idx = 0; idx < portals[currentCheckingPortalRoom].length; idx++) {
					let portal = portals[currentCheckingPortalRoom][idx];
					//console.log(portal);
					let newPortal = getPortalFrustrum(currentCheckingFrustum, portal);
					// If the frustum is actually valid, push it
					if (newPortal.topRightRay != null && newPortal.topLeftRay != null && newPortal.bottomLeftRay != null && newPortal.bottomRightRay != null) {
						newPortal.to = portal.connectingRoom;
						queuedFrustums.push(newPortal);
					}
				}
				// Now that we have checked it, add it to the checked list
				checkedRooms.push(currentCheckingPortalRoom);
			}
		}

		if (portalFrustums.length == 0) {
			portalFrustums = portalFrustums.concat(queuedFrustums);
			queuedFrustums = [];
		}
	}

	finish = performance.now();

	frameTimes[currFrameIdx] = finish - start;
	currFrameIdx = (currFrameIdx + 1) % 20;

	let currentFPSTotal = 0;
	frameTimes.map((time) => {
		currentFPSTotal += (time / 1000.0)
	})

	//console.log(currentFPSTotal);
	//console.log(numTriangleSets);
	//console.log(skipCount);


	document.getElementById("fpsCounter").innerText = Math.floor(1 / (currentFPSTotal / 20)).toString();
	document.getElementById("numTrianglesRendered").innerText = (totalCount).toString();
	document.getElementById("cullingMode").innerText = cullingMode;

	start = performance.now();

} // end render model

function specialFeature() {
	if (!custom) {
		clearInterval(intervalId);
		return;
	}
	const INCREMENT_VALUE = (2 * Math.PI) / 360.0;
	if (actualIteration < Math.PI / 2) {
		currIteration += INCREMENT_VALUE;
		actualIteration += INCREMENT_VALUE;
	} else if (actualIteration < 3 * Math.PI / 2) {
		currIteration -= INCREMENT_VALUE;
		actualIteration += INCREMENT_VALUE;
	} else if (actualIteration < 2 * Math.PI) {
		currIteration += INCREMENT_VALUE;
		actualIteration += INCREMENT_VALUE;
	} else {
		actualIteration = 0;
		currIteration = 0;
	}
	window.requestAnimationFrame(renderModels); // set up frame render callback
	window.requestAnimationFrame(loadModels);
}

let playerPos = { x: Eye[0] + 3, y: Eye[2] + 4 }; // Default player position
/* MAIN -- HERE is where execution begins after window load */
function setupTopDown() {
	const canvas = document.getElementById("gameCanvas");
	const ctx = canvas.getContext("2d");

	console.log(inputRoom);
	const TILE_SIZE = canvas.width / inputRoom.rooms[0].length; // Auto-scale tiles


	// Handle keyboard input
	window.addEventListener("keydown", (event) => {
		setTimeout(() => {
			console.log(Center);
			playerPos.y = Eye[2] + 4;
			playerPos.x = Eye[0] + 3;
			drawGrid(); // Redraw after movement
		}, 0);
	});



	// Draw function
	function drawGrid() {
		let viewRightTemp = vec3.clone(viewRight);

		// set up needed view params
		var lookAtTemp = vec3.create(), tempTemp = vec3.create(); // lookat, right & temp vectors
		lookAtTemp = vec3.normalize(lookAtTemp, vec3.subtract(tempTemp, Center, Eye)); // get lookat vector
		viewRightTemp = vec3.normalize(viewRightTemp, vec3.cross(tempTemp, lookAtTemp, Up));



		let _ = vec3.fromValues(0, 0, 0);

		currentFrustum = {
			eye: vec3.add(_, Eye, vec3.fromValues(3, 0, 4)),
			topRightRay: vec3.fromValues(viewRightTemp[0] + viewRightTemp[2], 1, -1.0 * viewRightTemp[0] + viewRightTemp[2]),
			topLeftRay: vec3.fromValues(viewRightTemp[2] - viewRightTemp[0], 1, -1.0 * viewRightTemp[0] - viewRightTemp[2]),
			bottomLeftRay: vec3.fromValues(viewRightTemp[2] - viewRightTemp[0], -1, -1.0 * viewRightTemp[0] - viewRightTemp[2]),
			bottomRightRay: vec3.fromValues(viewRightTemp[0] + viewRightTemp[2], -1, -1.0 * viewRightTemp[0] + viewRightTemp[2]),
		}

		let portal1 = {
			points: [
				vec3.fromValues(6, 0, 2),
				vec3.fromValues(6, 0, 3),
				vec3.fromValues(7, 0, 2),
				vec3.fromValues(7, 0, 3),
				vec3.fromValues(6, 1, 2),
				vec3.fromValues(6, 1, 3),
				vec3.fromValues(7, 1, 2),
				vec3.fromValues(7, 1, 3),

			], directionOfPortal: vec3.fromValues(1, 0, 0)
		}

		let portal2 = {
			points: [
				vec3.fromValues(6, 0, 4),
				vec3.fromValues(6, 0, 5),
				vec3.fromValues(7, 0, 4),
				vec3.fromValues(7, 0, 5),
				vec3.fromValues(6, 1, 4),
				vec3.fromValues(6, 1, 5),
				vec3.fromValues(7, 1, 4),
				vec3.fromValues(7, 1, 5),

			], directionOfPortal: vec3.fromValues(1, 0, 0)
		}


		let newCalculatedFrustum1 = getPortalFrustrum(currentFrustum, portal1);
		let newCalculatedFrustum2 = getPortalFrustrum(currentFrustum, portal2);

		let idxTemp = 0;
		for (let y = 0; y < inputRoom.rooms.length; y++) {
			for (let x = 0; x < inputRoom.rooms[y].length; x++) {
				let tile = inputRoom.rooms[y][x];
				let dark = false;
				if (tile != "s") {
					dark = notSeen[idxTemp];
					idxTemp += 1;
				}
				/*if (cullingMode == "frustum") {
					console.log(ROOM_CELL_TO_3D_BLOCK(inputRoom, y, x, 1));
					if (!isTriInFrustum(currentFrustum, ROOM_CELL_TO_3D_BLOCK(inputRoom, y, x, 1))) {
						dark = true;
					}
					//if (cullingMode == "portal") {
					//	if (tile != currentRoom && tile != "p") {
					//		dark = false;
					//	}
					//}
				}*/

				// Determine tile color
				if (tile === "s") {
					ctx.fillStyle = dark ? "grey" : "blue";
				} else if (tile === "p") {
					ctx.fillStyle = dark ? "black" : "red";
				} else {
					ctx.fillStyle = dark ? "grey" : "lightblue";
				} // Skip "p" (player)

				ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
			}
		}

		// Draw player (green circle)
		ctx.fillStyle = "green";
		ctx.beginPath();
		ctx.arc(
			(playerPos.x) * TILE_SIZE, // Center of tile
			(playerPos.y) * TILE_SIZE,
			TILE_SIZE / 3, //Size of player
			0, Math.PI * 2
		);
		ctx.fill();

		console.log(viewRight);

		drawLine(playerPos.x, playerPos.y, playerPos.x - (viewRightTemp[0] - viewRightTemp[2]) * 30, playerPos.y - (viewRightTemp[0] + viewRightTemp[2]) * 30, "red");
		drawLine(playerPos.x, playerPos.y, playerPos.x + (viewRightTemp[0] + viewRightTemp[2]) * 30, playerPos.y - (viewRightTemp[0] - viewRightTemp[2]) * 30, "yellow");

		if (newCalculatedFrustum1.topRightRay && newCalculatedFrustum1.topLeftRay && newCalculatedFrustum1.bottomLeftRay && newCalculatedFrustum1.bottomRightRay) {
			drawLine(playerPos.x, playerPos.y, playerPos.x + (newCalculatedFrustum1.topRightRay[0]), playerPos.y + (newCalculatedFrustum1.topRightRay[2]), "purple");
			drawLine(playerPos.x, playerPos.y, playerPos.x + (newCalculatedFrustum1.topLeftRay[0]), playerPos.y + (newCalculatedFrustum1.topLeftRay[2]), "green");
		}
		if (newCalculatedFrustum2.topRightRay && newCalculatedFrustum2.topLeftRay && newCalculatedFrustum2.bottomLeftRay && newCalculatedFrustum2.bottomRightRay) {
			drawLine(playerPos.x, playerPos.y, playerPos.x + (newCalculatedFrustum2.topRightRay[0]), playerPos.y + (newCalculatedFrustum2.topRightRay[2]), "purple");
			drawLine(playerPos.x, playerPos.y, playerPos.x + (newCalculatedFrustum2.topLeftRay[0]), playerPos.y + (newCalculatedFrustum2.topLeftRay[2]), "green");
		}
	}

	function drawLine(x1, y1, x2, y2, color) {
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(x1 * TILE_SIZE, y1 * TILE_SIZE);
		ctx.lineTo(x2 * TILE_SIZE, y2 * TILE_SIZE);
		ctx.stroke();
	}

	drawGrid(); // Initial draw
}

// **Check result asynchronously**
function checkQuery() {
	if (gl.getQueryParameter(query, gl.QUERY_RESULT_AVAILABLE)) {
		const count = gl.getQueryParameter(query, gl.QUERY_RESULT);
		document.getElementById("numTrianglesRendered").innerText = count.toString();
	} else {
		requestAnimationFrame(checkQuery);
	}
}

function main() {
	actualIteration = 0;
	currIteration = 0;

	textures = [];

	setupWebGL(); // set up the webGL environment
	loadModels(); // load in the models from tri file
	setupTopDown();
	setupShaders(); // setup the webGL shaders
	renderModels(); // draw the triangles using webGL
	checkQuery();

	if (custom) {
		intervalId = setInterval(specialFeature, intervalTick);
	}

} // end main
