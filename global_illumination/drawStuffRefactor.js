

class Color {
	constructor(r, g, b, a) {
		/**try { */
		if ((typeof (r) !== "number") || (typeof (g) !== "number") || (typeof (b) !== "number") || (typeof (a) !== "number"))
			throw "color component not a number";
		else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
			throw "color component less than 0";
		else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
			throw "color component bigger than 255";
		else {
			this[0] = r; this[1] = g; this[2] = b; this[3] = a;
		}
		/**} // end try

		catch (e) {
			console.log(e);
			console.log([r, g, b, a]);
		} */
	} // end Color constructor

	// Color change method
	change(r, g, b, a) {
		try {
			if ((typeof (r) !== "number") || (typeof (g) !== "number") || (typeof (b) !== "number") || (typeof (a) !== "number"))
				throw "color component not a number";
			else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
				throw "color component less than 0";
			else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
				throw "color component bigger than 255";
			else {
				this[0] = r; this[1] = g; this[2] = b; this[3] = a;
			}
		} // end try

		catch (e) {
			console.log(e);
			console.log([r, g, b, a]);
			throw (e);
		}
	} // end Color change method
} // end color class

class Vector {
	constructor(x, y, z) {
		this.set(x, y, z);
	} // end constructor

	// sets the components of a vector
	set(x, y, z) {
		try {
			if ((typeof (x) !== "number") || (typeof (y) !== "number") || (typeof (z) !== "number"))
				throw "vector component not a number";
			else
				this.x = x; this.y = y; this.z = z;
		} // end try

		catch (e) {
			console.log(e);
		}
	} // end vector set

	// copy the passed vector into this one
	copy(v) {
		try {
			if (!(v instanceof Vector))
				throw "Vector.copy: non-vector parameter";
			else
				this.x = v.x; this.y = v.y; this.z = v.z;
		} // end try

		catch (e) {
			throw (e);
			console.log(e);
		}
	}

	toConsole(prefix) {
		console.log(prefix + "[" + this.x + "," + this.y + "," + this.z + "]");
	} // end to console

	// static dot method
	static dot(v1, v2) {
		try {
			if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
				throw "Vector.dot: non-vector parameter";
			else
				return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
		} // end try

		catch (e) {
			console.log(e);
			console.log(v1);
			console.log(v2);
			throw Error(e);
			return (NaN);
		}
		/*try {
			if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
				throw "Vector.dot: non-vector parameter";
			else
				return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
		} // end try

		catch (e) {
			console.log(e);
			throw Error(e);
			return (NaN);
		}*/
	} // end dot static method

	static cross(v1, v2) {
		try {
			if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
				throw "Vector.cross: non-vector parameter";
			else
				return (new Vector(v1.y * v2.z - v1.z * v2.y,
					v1.z * v2.x - v1.x * v2.z,
					v1.x * v2.y - v1.y * v2.x));
		} // end try

		catch (e) {
			console.log(e);
			throw Error(e);
			return (NaN);
		}
	}

	// static add method
	static add(v1, v2) {
		try {
			if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
				throw "Vector.add: non-vector parameter";
			else
				return (new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z));
		} // end try

		catch (e) {
			console.log(e);
			throw Error(e);
			return (new Vector(NaN, NaN, NaN));
		}
	} // end add static method

	// static subtract method, v1-v2
	static subtract(v1, v2) {
		try {
			if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
				throw "Vector.subtract: non-vector parameter";
			else {
				var v = new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
				//v.toConsole("Vector.subtract: ");
				return (v);
			}
		} // end try

		catch (e) {
			console.log(e);
			return (new Vector(NaN, NaN, NaN));
		}
	} // end subtract static method

	// static divide method, v1.x/v2.x etc
	static divide(v1, v2) {
		try {
			if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
				throw "Vector.divide: non-vector parameter";
			else {
				var v = new Vector(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
				//v.toConsole("Vector.divide: ");
				return (v);
			}
		} // end try

		catch (e) {
			console.log(e);
			return (new Vector(NaN, NaN, NaN));
		}
	} // end divide static method

	// static divide method, v1.x/v2.x etc
	static multiply(v1, v2) {
		try {
			if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
				throw "Vector.multiply: non-vector parameter";
			else {
				var v = new Vector(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
				//v.toConsole("Vector.divide: ");
				return (v);
			}
		} // end try

		catch (e) {
			console.log(e);
			return (new Vector(NaN, NaN, NaN));
		}
	} // end multiply static method

	// static scale method
	static scale(c, v) {
		try {
			if (!(typeof (c) === "number") || !(v instanceof Vector))
				throw "Vector.scale: malformed parameter";
			else
				return (new Vector(c * v.x, c * v.y, c * v.z));
		} // end try

		catch (e) {
			console.log(e);
			throw Error(e);
			return (new Vector(NaN, NaN, NaN));
		}
	} // end scale static method

	// static normalize method
	static normalize(v) {
		try {
			if (!(v instanceof Vector))
				throw "Vector.normalize: parameter not a vector";
			else {
				var lenDenom = 1 / Math.sqrt(Vector.dot(v, v));
				return (Vector.scale(lenDenom, v));
			}
		} // end try

		catch (e) {
			console.log(e);
			throw Error(e);
			return (new Vector(NaN, NaN, NaN));
		}
	} // end scale static method

	static magnitude(v) {
		try {
			if (!(v instanceof Vector))
				throw "Vector.normalize: parameter not a vector";
			else {
				let magn = v.x ** 2 + v.y ** 2 + v.z ** 2;
				return magn;
			}
		} // end try

		catch (e) {
			console.log(e);
			throw Error(e);
			return (new Vector(NaN, NaN, NaN));
		}
	}

	static limit(v, c) {
		let newV = new Vector(v.x, v.y, v.z);
		if (v.x > c) {
			newV.x = c;
		}
		if (v.y > c) {
			newV.y = c;
		}
		if (v.z > c) {
			newV.z = c;
		}
		return v;
	}

} // end Vector class

/**
 * Get the input triangles for the program (hardcoded)
 * 
 * @returns {Array<JSON>} Output which is a list of json objects, each with material, vertices, normals, and triangles attributes
 */
function getInputTriangles() {
	return [
		{
			"material": { "ambient": [0.1, 0.1, 0.1], "diffuse": [0.5, 0.5, 0.5], "specular": [0.3, 0.3, 0.3], "n": 11, "alpha": 0.9, "texture_name": "shipActive" },
			"vertices": [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1], [0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]],
			"normals": [[0, 0, 1], [0, 0, 1]],
			"triangles": [[0, 1, 4], [4, 5, 0]]
		},
		{
			"material": { "ambient": [0.1, 0.1, 0.1], "diffuse": [0.5, 0, 0], "specular": [0.3, 0.3, 0.3], "n": 11, "alpha": 0.9, "texture_name": "shipActive" },
			"vertices": [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1], [0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]],
			"normals": [[1, 0, 0], [1, 0, 0]],
			"triangles": [[7, 4, 0], [3, 7, 0]]
		},
		{
			"material": { "ambient": [0.1, 0.1, 0.1], "diffuse": [0, 0, 0.5], "specular": [0.3, 0.3, 0.3], "n": 11, "alpha": 0.9, "texture_name": "shipActive" },
			"vertices": [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1], [0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1], [1, 1, 1]],
			"normals": [[-1, 0, 0], [-1, 0, 0]],
			"triangles": [[1, 2, 6], [6, 5, 1]]
		},
		{
			"material": { "ambient": [0.1, 0.1, 0.1], "diffuse": [0.5, 0.5, 0.5], "specular": [0.3, 0.3, 0.3], "n": 11, "alpha": 0.9, "texture_name": "shipActive" },
			"vertices": [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1], [0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]],
			"normals": [[0, 1, 0], [0, 1, 0], [0, -1, 0], [0, -1, 0], [0, 0, -1], [0, 0, -1]],
			"triangles": [[0, 1, 2], [2, 3, 0], [6, 7, 4], [4, 5, 6], [3, 2, 6], [6, 3, 7]]
		}
	]
}

/**
 * Get the JSON file from the passed URL
 * 
 * @param {String} url String of the desired resource's url
 * @param {String} descr description of the desired resource for return messages
 * 
 * @returns {JSON} returns the desired JSON resource at url
 */
function getJSONFile(url, descr) {
	try {
		if ((typeof (url) !== "string") || (typeof (descr) !== "string"))
			throw "getJSONFile: parameter not a string";
		else {
			// Create and send a new http request
			var httpReq = new XMLHttpRequest();
			httpReq.open("GET", url, false);
			httpReq.send(null);

			// Check for timeout and break if over 3 second
			var startTime = Date.now();
			while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
				if ((Date.now() - startTime) > 3000)
					break;
			}

			// If there are any bad returns or timeouts, then throw error. Else obtain resource and return
			if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
				throw "Unable to open " + descr + " file!";
			else
				return JSON.parse(httpReq.response);

		}
	} catch (e) {
		console.log(e);
		return (String.null);
	}
}


/**
 * This function accepts the triangles as well as which triangle set and which triangle within that set, then
 * returns the list of vertices which relate to that specific triangle
 * 
 * @param {Array<JSON>} inputTriangles List of JSON's of triangle sets to be used for reference
 * @param {Number} whichTriSet Represents index of which tri set to parse from inputTriangles
 * @param {Number} whicTriInSet Represents the index of which triangle within that tri set defined by whichTriSet
 * 
 * @returns {Array<Array>} Returns an array of three vertices (each with x, y, and z coordinates)
 */
function getVertices(inputTriangles, whichTriSet, whicTriInSet) {

	let vertices = [];
	for (let vertIdx = 0; vertIdx < 3; vertIdx++) {
		vertices.push(inputTriangles[whichTriSet].vertices[inputTriangles[whichTriSet].triangles[whicTriInSet][vertIdx]]);
	}
	return vertices;
}

/**
 * Helper function for IsPointInsideTriangle
 * Checks if a point is on the same side of the edge or exactly on the edge
 */
function side(n, i, a, b) {
	var f = Vector.subtract(i, a);
	var g = Vector.subtract(b, a);
	return Vector.dot(n, Vector.cross(f, g));
}

function IsPointInsideTriangle(i, a, b, c, n) {
	try {
		if (!(i instanceof Vector) || !(a instanceof Vector) || !(b instanceof Vector) || !(c instanceof Vector))
			throw "Need vector inputs";

		var s1 = side(n, i, a, b);
		var s2 = side(n, i, b, c);
		var s3 = side(n, i, c, a);

		// Allow inclusion of edges by checking for zero-cross product (colinearity)
		if ((s1 === 0 || s2 === 0 || s3 === 0) || (s1 > 0 && s2 > 0 && s3 > 0) || (s1 < 0 && s2 < 0 && s3 < 0)) {
			return true;
		}
		return false;
	} catch (e) {
		console.log(e);
		return false;
	}
}



/**
 * This function accepts a ray, triangle, and clipvalue to determine wherther the ray hits the triangle
 * If so, it returns information about the intersection
 * 
 * @param {Array<Vector>} ray Array with the eye and ray direction both as vectors (in that order) such that [EYE, DIR]
 * @param {Array<Array>} triangle Array of Triangle vertices, each with x, y, and z coordinates
 * @param {Number} clipVal The value by which the ray should not be checked past (defines clipping plane)
 * 
 * @returns {JSON} JSON object with attributes exists, xyz, and t;
 */
function rayTriangleIntersect(ray, triangle, clipVal) {
	if (!(ray instanceof Array) || !(triangle instanceof Object))
		throw "RayTriangleIntersect: ray or ellipsoid are not formatted well";
	else if (ray.length != 2)
		throw "RayTriangleIntersect: badly formatted ray";
	else { // valid params
		var vertA = new Vector(triangle[0][0], triangle[0][1], triangle[0][2]);
		var vertB = new Vector(triangle[1][0], triangle[1][1], triangle[1][2]);
		var vertC = new Vector(triangle[2][0], triangle[2][1], triangle[2][2]);
		var triNormal = Vector.cross(Vector.subtract(vertB, vertA),
			Vector.subtract(vertC, vertA));
		// console.log(triNormal);
		var d = Vector.dot(triNormal, vertA); //console.log("d: " + d);

		var n_dot_eye = Vector.dot(triNormal, ray[0]); //console.log("n_dot_eye: " + n_dot_eye);
		var n_dot_dir = Vector.dot(triNormal, ray[1]); //console.log("n_dot_dir: " + n_dot_dir);
		if (n_dot_dir == 0) {
			throw "parallel planes!";
		}
		else {
			var t = (d - n_dot_eye) / n_dot_dir;  //console.log("t: " + t);
			var isect = Vector.add(ray[0], Vector.scale(t, ray[1])); //console.log(isect);
			var exitsInside = IsPointInsideTriangle(isect, vertA, vertB, vertC, triNormal);
			return ({ "exists": exitsInside, "xyz": isect, "t": t });
		}
	} // end if valid params
}

//var numRaysSentOutOfHemisphere = 1;
function indirectIllumination(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0, bounceCountCurrent = 0) {
	let estRadiance = new Vector(0, 0, 0);

	let numEllipsoids = inputEllipsoids.length;

	let bounceNum = 0;

	if (bounceCountCurrent == 0) {
		bounceNum = INITIAL_BOUNCE_AMOUNT;
	} else {
		bounceNum = 1;
	}

	for (let bounceIdx = 0; bounceIdx < bounceNum; bounceIdx++) {

		let theta = (Math.random() * 2.0 * Math.PI);
		let phi = (Math.random() * Math.PI / 2.0);

		let normalVector;
		if (currentlyEllipsoid) {
			//console.log([whichEllipsoid, inputEllipsoids]);
			let sphereCenter = new Vector(inputEllipsoids[whichEllipsoid].x, inputEllipsoids[whichEllipsoid].y, inputEllipsoids[whichEllipsoid].z);
			normalVector = Vector.subtract(intersection.xyz, sphereCenter);
		} else {
			//console.log([inputTriangles, whichTriSet, inputTriangles[whichTriSet].normals, whichTriInSet])
			let normalArray = inputTriangles[whichTriSet].normals[whichTriInSet];
			normalVector = new Vector(normalArray[0], normalArray[1], normalArray[2]);
		}

		let normalizedOrthogonalVector1 = Vector.normalize(Vector.cross(normalVector, rayToDestination));
		let normalizedOrthogonalVector2 = Vector.normalize(Vector.cross(normalVector, normalizedOrthogonalVector1));

		let normalizedVectorCircledAroundNormal = Vector.normalize(Vector.add(Vector.scale(Math.cos(theta), normalizedOrthogonalVector1), Vector.scale(Math.sin(theta), normalizedOrthogonalVector2)));

		let randomDirectionHemisphereVector = Vector.normalize(Vector.add(Vector.scale(Math.cos(phi), normalVector), Vector.scale(Math.sin(phi), normalizedVectorCircledAroundNormal)));

		if (currentlyEllipsoid && whichEllipsoid == REFRACTION_SPHERE_IDX) {
			randomDirectionHemisphereVector = Vector.scale(1.0, normalVector); //this is the bread and butter of Refraction. This makes the sample vector opposite to normal and therefore beautiful
		}

		let closestT = Number.MAX_VALUE;
		let closestIntersection = null;
		let closestTriSetIdx = null;
		let closestTriInSetIdx = null;
		let closestEllipsoidIdx = null;

		let triangle = false;

		// Iterate first through each tri group
		for (let triSetIdx = 0; triSetIdx < inputTriangles.length; triSetIdx++) {

			// Get the number of triangles in that triangle set and iterate through them
			let numTrianglesInSet = inputTriangles[triSetIdx].triangles.length;
			for (let triInSetIdx = 0; triInSetIdx < numTrianglesInSet; triInSetIdx++) {

				// Obtain the vertices for each triangle
				let vertices = getVertices(inputTriangles, triSetIdx, triInSetIdx);

				let intersectionNew = rayTriangleIntersect([intersection.xyz, randomDirectionHemisphereVector], vertices, 2);

				if (intersectionNew.exists && !(whichTriSet == triSetIdx && whichTriInSet == triInSetIdx)) {

					// Check to see if this intersection is the closest so far
					if (intersectionNew.t < closestT) {

						//console.log('check here');
						triangle = true;
						// If so, set new closest t
						closestT = intersectionNew.t;
						closestIntersection = intersectionNew;
						closestTriSetIdx = triSetIdx;
						closestTriInSetIdx = triInSetIdx;
					}
				}
			}
		}

		// Now iterate through every ellipsoid
		for (var ellipsoidIdx = 0; ellipsoidIdx < numEllipsoids; ellipsoidIdx++) {
			// for (var e=0; e<1; e++) 
			isect = rayEllipsoidIntersect([intersection.xyz, randomDirectionHemisphereVector], inputEllipsoids[ellipsoidIdx], 0);
			if (isect.exists) {// there is an intersect
				if (isect.t < closestT) { // it is the closest yet
					//console.log("here");
					triangle = false;

					closestTriSetIdx = null;
					closestTriInSetIdx = null;
					closestT = isect.t;
					closestIntersection = isect;
					closestEllipsoidIdx = ellipsoidIdx;
				} // end if closest yet
			}
		} // end for ellipsoids


		let cosineResult = 0;
		let resultingRadiance = new Vector(0, 0, 0);
		let brdfResult = 0;
		let distanceFactor = 0;

		let totalFactor = 0;

		if (closestIntersection == null) {
			//console.log("here");
			resultingRadiance = new Vector(0, 0, 0);
		} else {


			let directionFromNewIntersectionToPreviousIntersection = Vector.subtract(intersection.xyz, closestIntersection.xyz);

			let intersectionNormalVector;

			if (triangle) {
				let intersectionNormalArray = inputTriangles[closestTriSetIdx].normals[closestTriInSetIdx]
				intersectionNormalVector = new Vector(intersectionNormalArray[0], intersectionNormalArray[1], intersectionNormalArray[2]);
			} else {
				let sphereCenter = new Vector(inputEllipsoids[closestEllipsoidIdx].x, inputEllipsoids[closestEllipsoidIdx].y, inputEllipsoids[closestEllipsoidIdx].z);
				intersectionNormalVector = Vector.subtract(intersection.xyz, sphereCenter);
				//console.log([sphereCenter, intersectionNormalVector])
			}

			//console.log([intersectionNormalVector, directionFromNewIntersectionToPreviousIntersection, rayToDestination]);
			brdfResult = brdf(intersectionNormalVector, directionFromNewIntersectionToPreviousIntersection, rayToDestination);
			//intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0, onlyDirect = false

			let rouletteFactor = Math.random();

			if (currentlyEllipsoid && whichEllipsoid == REFRACTION_SPHERE_IDX) {
				resultingRadiance = directIllumincation(closestIntersection, directionFromNewIntersectionToPreviousIntersection, lights,
					inputTriangles, inputEllipsoids, !triangle, closestEllipsoidIdx, closestTriSetIdx, closestTriInSetIdx)
				return resultingRadiance;
			} else {

				resultingRadiance = radiance(closestIntersection, directionFromNewIntersectionToPreviousIntersection, lights,
					inputTriangles, inputEllipsoids, !triangle, closestEllipsoidIdx, closestTriSetIdx, closestTriInSetIdx, true, (rouletteFactor > 0.5) ? bounceCountCurrent + 1 : LONGEST_BOUNCE_DEPTH);
				//let surfaceColor = new Vector(inputTriangles[whichTriSet].material.diffuse[0], inputTriangles[whichTriSet].material.diffuse[1], inputTriangles[whichTriSet].material.diffuse[2]);

				cosineResult = Math.max(0, Vector.dot(Vector.normalize(intersectionNormalVector), Vector.normalize(directionFromNewIntersectionToPreviousIntersection)));
				distanceFactor = 1 / (1 + closestT ** 2);

				totalFactor = (1 / 5) * (cosineResult * brdfResult * distanceFactor) + 0.4; // Unique make it your own
			}

		}

		//let thisColor = Vector.scale(cosineResult * brdfResult * distanceFactor, resultingRadiance);
		//let largestValue = Math.min(1.0, Math.max(thisColor.x, thisColor.y, thisColor.z));
		//let calculatedScaleFactor = Math.pow(largestValue, 1/8) / largestValue;

		//let thisColorAdjusted = Vector.scale(calculatedScaleFactor, thisColor);

		estRadiance = Vector.add(estRadiance, Vector.scale(totalFactor, resultingRadiance));
		//console.log([brdfResult, cosineResult]);
		//console.log(estRadiance);

	}

	return Vector.scale(1 / bounceNum, estRadiance);
	//return new Vector(0, 0, 0);
}

// Source code from developer.mozilla.org
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

function customSigmoidFunction(value, exp = 1.1) {
	return Math.sqrt(-1.0 * Math.pow(value, exp) + 1);
}

function brdf(normalToSurface, rayToLightsource, rayToDestination) {
	// sqrt(x^3 + 1)
	return customSigmoidFunction(Math.abs(Math.abs(Vector.dot(Vector.normalize(rayToLightsource), Vector.normalize(normalToSurface))) - Math.abs(Vector.dot(Vector.normalize(rayToDestination), Vector.normalize(normalToSurface)))));
}

var temp1 = true;
// This variable determines for every intersection point, how many times should a random light source be sampled.

function directIllumincation(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0) {

	let estRadiance = new Vector(0, 0, 0);

	// We are just using uniform distribution, all lights have same prob
	let lightProbability = 1 / lights.length;

	// 
	for (let sampleIdx = 0; sampleIdx < numberOfLightSamples; sampleIdx++) {

		let randomLightIdx = getRandomInt(lights.length);
		//console.log(lights.length);
		//console.log(randomLightIdx);

		//this is where sampling inside a location would be 
		let randomlySelectedLight = lights[randomLightIdx];
		//console.log(lights);
		//console.log(randomlySelectedLight);
		let randomlySelectedLightPosition = new Vector(randomlySelectedLight.x, randomlySelectedLight.y, randomlySelectedLight.z);
		let vectorFromIntersectionToRandomLight = Vector.subtract(randomlySelectedLightPosition, intersection.xyz);

		let occluded = isLightOccluded(vectorFromIntersectionToRandomLight, intersection.xyz, inputEllipsoids, inputTriangles, currentlyEllipsoid, whichEllipsoid, whichTriSet, whichTriInSet);

		//L, isectPos, ellipsoids, triangles, currentlyEllipsoid, isectEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0

		if (occluded) {
			return estRadiance;
		} else {

			let normalVector;
			if (currentlyEllipsoid) {
				let sphereCenter = new Vector(inputEllipsoids[whichEllipsoid].x, inputEllipsoids[whichEllipsoid].y, inputEllipsoids[whichEllipsoid].z);
				normalVector = Vector.subtract(intersection.xyz, sphereCenter);
			} else {
				let normalArray = inputTriangles[whichTriSet].normals[whichTriInSet];
				normalVector = new Vector(normalArray[0], normalArray[1], normalArray[2]);
			}

			let brdfResult = brdf(normalVector, vectorFromIntersectionToRandomLight, rayToDestination);

			let cosineResult = Math.max(0, Vector.dot(Vector.normalize(normalVector), Vector.normalize(vectorFromIntersectionToRandomLight)));
			//console.log([normalVector, vectorFromIntersectionToRandomLight, Vector.magnitude(vectorFromIntersectionToRandomLight), Vector.normalize(vectorFromIntersectionToRandomLight)]);
			//console.log(cosineResult);
			let surfaceColor;


			if (currentlyEllipsoid) {
				surfaceColor = new Vector(inputEllipsoids[whichEllipsoid].diffuse[0], inputEllipsoids[whichEllipsoid].diffuse[1], inputEllipsoids[whichEllipsoid].diffuse[2]);
				//console.log(surfaceColor);
				//console.log(surfaceColor);
			} else {
				surfaceColor = new Vector(inputTriangles[whichTriSet].material.diffuse[0], inputTriangles[whichTriSet].material.diffuse[1], inputTriangles[whichTriSet].material.diffuse[2]);
			}

			estRadiance = Vector.add(estRadiance, Vector.scale(brdfResult * cosineResult, surfaceColor));
			if (currentlyEllipsoid) {
				//console.log(estRadiance);
				//console.log(brdfResult);
				//console.log(cosineResult);
			} else {
				if (estRadiance.x < 0 || estRadiance.y < 0 || estRadiance.z < 0) {
					//console.log('______________________________________________________________________________________________');
				}
			}
			//estRadiance = new Vector(cosineResult, cosineResult, cosineResult);
			//estRadiance = new Vector(brdfResult, brdfResult, brdfResult);
			//console.log(estRadiance);
			//estRadiance = new Vector(cosineResult, cosineResult, cosineResult);
		}

	}

	return Vector.scale(1 / (numberOfLightSamples * lightProbability * 1.0), estRadiance);

	//return new Vector(0.5, 0.5, 0.5);
}

let tempNumber1 = true;
let tempNumber2 = true;
let tempNumber3 = true;
let tempNumber4 = true;


/**
 * This function dictates the overall color and shading resulting from an intersection.
 * intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0
 */
function radiance(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0, onlyDirect = false, bounceCountCurrent) {
	if (bounceCountCurrent >= LONGEST_BOUNCE_DEPTH) {
		let direct = directIllumincation(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid, whichTriSet, whichTriInSet);
		if (Math.max(direct.x, direct.y, direct.z) > 1) {
			direct = Vector.scale(1 / Math.max(direct.x, direct.y, direct.z), direct);
		} if (Math.max(direct.x, direct.y, direct.z) > 1) {
			throw Error("cope");
		}
		return direct;
	} else {
		let indirectRaw = Vector.scale(2.2, indirectIllumination(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid, whichTriSet, whichTriInSet, bounceCountCurrent))
		let directRaw = Vector.scale(1, directIllumincation(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid, whichTriSet, whichTriInSet));

		if (isNaN(indirectRaw.x) || isNaN(indirectRaw.y) || isNaN(indirectRaw.z)) {
			indirectRaw = new Vector(0, 0, 0);
		}
		if (isNaN(indirectRaw.x) || isNaN(indirectRaw.y) || isNaN(indirectRaw.z)) {
			directRaw = new Vector(0, 0, 0);
		}

		let direct = new Vector(Math.max(0, directRaw.x), Math.max(0, directRaw.y), Math.max(0, directRaw.z));
		let indirect = new Vector(Math.max(0, indirectRaw.x), Math.max(0, indirectRaw.y), Math.max(0, indirectRaw.z));
		let surfaceColor;
		if (currentlyEllipsoid) {
			surfaceColor = new Vector(inputEllipsoids[whichEllipsoid].diffuse[0], inputEllipsoids[whichEllipsoid].diffuse[1], inputEllipsoids[whichEllipsoid].diffuse[2]);;
		} else {
			surfaceColor = new Vector(inputTriangles[whichTriSet].material.diffuse[0], inputTriangles[whichTriSet].material.diffuse[1], inputTriangles[whichTriSet].material.diffuse[2]);
		}

		let indirectResultingLight = new Vector(Math.min(surfaceColor.x, indirect.x), Math.min(surfaceColor.y, indirect.y), Math.min(surfaceColor.z, indirect.z))


		if (isNaN(direct.x) || isNaN(direct.y) || isNaN(direct.z)) {
			direct = new Vector(0, 0, 0);
		}
		if (isNaN(indirectResultingLight.x) || isNaN(indirectResultingLight.y) || isNaN(indirectResultingLight.z)) {
			indirectResultingLight = new Vector(0, 0, 0);
		}
		let combinedRaw;

		if (currentlyEllipsoid && whichEllipsoid == REFRACTION_SPHERE_IDX) {
			combinedRaw = Vector.scale(1.0, indirect);
			//console.log(indirectRaw);
		} else {
			combinedRaw = Vector.add(direct, indirectResultingLight);
		}


		let combined = new Vector(Math.min(1, Math.max(0, combinedRaw.x)), Math.min(1, Math.max(0, combinedRaw.y)), Math.min(1, Math.max(0, combinedRaw.z)));


		return combined; //Vector.add(indirect, direct); //new Vector(Math.min(1.0, tempVector.x), Math.min(1.0, tempVector.y), Math.min(1.0, tempVector.z))
	}
}



// Solve quadratic. Return empty array if no solutions, 
// one t value if one solution, two if two solutions.
function solveQuad(a, b, c) {
	var discr = b * b - 4 * a * c;
	// console.log("a:"+a+" b:"+b+" c:"+c);

	if (discr < 0) { // no solutions
		// console.log("no roots!");
		return ([]);
	} else if (discr == 0) { // one solution
		// console.log("root: "+(-b/(2*a)));
		return ([-b / (2 * a)]);
	} else { // two solutions
		var denom = 0.5 / a;
		var term1 = -b;
		var term2 = Math.sqrt(discr)
		var tp = denom * (term1 + term2);
		var tm = denom * (term1 - term2);
		// console.log("root1:"+tp+" root2:"+tm);
		if (tm < tp)
			return ([tm, tp]);
		else
			return ([tp, tm]);
	}
} // end solveQuad


// ray ellipsoid intersection
// if no intersect, return NaN
// if intersect, return xyz vector and t value
// intersects in front of clipVal don't count
function rayEllipsoidIntersect(ray, ellipsoid, clipVal) {
	if (!(ray instanceof Array) || !(ellipsoid instanceof Object))
		throw "RayEllipsoidIntersect: ray or ellipsoid are not formatted well";
	else if (ray.length != 2)
		throw "RayEllipsoidIntersect: badly formatted ray";
	else { // valid params
		var A = new Vector(ellipsoid.a, ellipsoid.b, ellipsoid.c); // A as a vector
		var dDivA = Vector.divide(ray[1], A); // D/A
		var quadA = Vector.dot(dDivA, dDivA); // dot(D/A,D/A)
		var EmCdivA = Vector.divide(Vector.subtract(ray[0], new Vector(ellipsoid.x, ellipsoid.y, ellipsoid.z)), A); // (E-C)/A
		var quadB = 2 * Vector.dot(dDivA, EmCdivA); // 2 * dot(D/A,(E-C)/A)
		var quadC = Vector.dot(EmCdivA, EmCdivA) - 1; // dot((E-C)/A,(E-C)/A) - 1
		// if (clipVal == 0) {
		//     ray[0].toConsole("ray.orig: ");
		//     ray[1].toConsole("ray.dir: ");
		//     console.log("a:"+a+" b:"+b+" c:"+c);
		// } // end debug case

		var qsolve = solveQuad(quadA, quadB, quadC);
		if (qsolve.length == 0)
			return { "exists": false, "xyz": null, "t": null }
		else if (qsolve.length == 1) {
			if (qsolve[0] < clipVal)
				return { "exists": false, "xyz": null, "t": null }
			else {
				var isect = Vector.add(ray[0], Vector.scale(qsolve[0], ray[1]));
				//console.log("t: "+qsolve[0]);
				//isect.toConsole("intersection: ");
				return ({ "exists": true, "xyz": isect, "t": qsolve[0] });
			} // one unclipped intersection
		} else if (qsolve[0] < clipVal) {
			if (qsolve[1] < clipVal)
				return { "exists": false, "xyz": null, "t": null }
			else {
				var isect = Vector.add(ray[0], Vector.scale(qsolve[1], ray[1]));
				//console.log("t2: "+qsolve[1]);
				//isect.toConsole("intersection: ");
				return ({ "exists": true, "xyz": isect, "t": qsolve[1] });
			} // one intersect too close, one okay
		} else {
			var isect = Vector.add(ray[0], Vector.scale(qsolve[0], ray[1]));
			//console.log("t1: "+qsolve[0]);
			//isect.toConsole("intersection: ");
			return ({ "exists": true, "xyz": isect, "t": qsolve[0] });
		} // both not too close
	} // end if valid params
} // end raySphereIntersect

// returns true if passed light is occluded from passed intersect/ellipsoid
// by passed array of ellipsoids
function isLightOccluded(L, isectPos, ellipsoids, triangles, currentlyEllipsoid, isectEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0) {
	var d = 0; // which ellipsoid
	var lightOccluded = false; // if light is occluded
	var occluderIsect = {}; // occluder intersect details
	// console.log("testing for occlusions");

	// check each ellipsoid up to intersected ellipsoid to see if it occludes
	while ((!lightOccluded) && (d < isectEllipsoid)) {
		occluderIsect = rayEllipsoidIntersect([isectPos, L], ellipsoids[d], 0);
		if (!occluderIsect.exists) { // no intersection
			d++; // on to next ellipsoid
		} else if (occluderIsect.t > 1) { // light in front of intersection
			d++; // on to next sphere
		} else {
			lightOccluded = true;
			// console.log("occlusion found from ellipsoid "+isectEllipsoid+" to "+e);
		} // end if occlusion found
	} // while all ellipsoids up to one intersected by eye

	// check each ellipsoid after intersected ellipsoid to see if it occludes
	if (currentlyEllipsoid) {
		d += 1;
	}
	while ((!lightOccluded) && (d < ellipsoids.length)) {
		occluderIsect = rayEllipsoidIntersect([isectPos, L], ellipsoids[d], 0);
		// console.log("oisect: "+occluderIsect);
		if (!occluderIsect.exists) { // no intersection
			d++; // on to next ellipsoid
		} else if (occluderIsect.t > 1) { // light in front of intersection
			d++; // on to next ellipsoid
		} else {
			lightOccluded = true;
			// console.log("occlusion found from ellipsoid "+isectEllipsoid+" to "+e);
		} // end if occlusion found
	} // while all ellipsoids after one intersected by eye

	return lightOccluded;

	/*// check each ellipsoid up to intersected ellipsoid to see if it occludes
	let e = 0; // which ellipsoid
	let f = 0;
	let vertices = []; // to sore vertices of tri set iteratively
	// console.log("testing for occlusions");
	
	while ((!lightOccluded) && ((e == whichTriSet) ? (f != whichTriInSet) : true)) {
	
		vertices = [];
		for (let vertexCount = 0; vertexCount < 3; vertexCount++) {
			vertices.push(triangles[e].vertices[triangles[e].triangles[f][vertexCount]])
		}
	
		occluderIsect = rayTriangleIntersect([isectPos, L], vertices, 0);
		if (!occluderIsect.exists) { // no intersection
			if (f + 1 < triangles[e].triangles.length) {
				f++;
			} else {
				f = 0;
				e++;
			}
		} else if (occluderIsect.t > 1) { // light in front of intersection
			if (f + 1 < triangles[e].triangles.length) {
				f++;
			} else {
				f = 0;
				e++;
			}
		} else {
			lightOccluded = true;
			// console.log("occlusion found from ellipsoid "+isectEllipsoid+" to "+e);
		} // end if occlusion found
	} // while all ellipsoids up to one intersected by eye
	
	// check each ellipsoid after intersected ellipsoid to see if it occludes
	if (!currentlyEllipsoid) {
		if (f + 1 < triangles[e].triangles.length) {
			f++;
		} else {
			f = 0;
			e++;
		}
	}
	
	while ((!lightOccluded) && (e < triangles.length)) {
	
		vertices = [];
		for (let vertexCount = 0; vertexCount < 3; vertexCount++) {
			vertices.push(triangles[e].vertices[triangles[e].triangles[f][vertexCount]])
		}
	
		occluderIsect = rayTriangleIntersect([isectPos, L], vertices, 0);
		// console.log("oisect: "+occluderIsect);
		if (!occluderIsect.exists) { // no intersection
			if (f + 1 < triangles[e].triangles.length) {
				f++;
			} else {
				f = 0;
				e++;
			}
		} else if (occluderIsect.t > 1) { // light in front of intersection
			if (f + 1 < triangles[e].triangles.length) {
				f++;
			} else {
				f = 0;
				e++;
			}
		} else {
			lightOccluded = true;
			// console.log("occlusion found from ellipsoid "+isectEllipsoid+" to "+e);
		} // end if occlusion found
	} // while all ellipsoids after one intersected by eye
	
	return (lightOccluded);*/
} // end is light occluded
/*
// color the passed intersection and ellipsoid
function shadeIsect(isect, isectEllipsoid, lights, ellipsoids, inputTriangles) {
	if (!(isect instanceof Object) || !(typeof (isectEllipsoid) === "number")
		|| !(lights instanceof Array) || !(ellipsoids instanceof Array))
		throw "shadeIsect: bad parameter passed";
	else if (RENDER_METHOD == renderTypes.ISECT_ONLY) {
		var r = ellipsoids[isectEllipsoid].diffuse[0];
		var g = ellipsoids[isectEllipsoid].diffuse[1];
		var b = ellipsoids[isectEllipsoid].diffuse[2];
		return (new Color(255 * r, 255 * g, 255 * b, 255));
	} else { // if not just rendering intersects
		var c = new Color(0, 0, 0, 255); // init the ellipsoid color to black
		var ellipsoid = ellipsoids[isectEllipsoid]; // ellipsoid intersected by eye
		// console.log("shading pixel");
	
		// add light for each source
		var lightOccluded = false; // if an occluder is found
		var Lloc = new Vector(0, 0, 0);
		for (var l = 0; l < lights.length; l++) {
	
			// add in the ambient light
			c[0] += lights[l].ambient[0] * ellipsoid.ambient[0]; // ambient term r
			c[1] += lights[l].ambient[1] * ellipsoid.ambient[1]; // ambient term g
			c[2] += lights[l].ambient[2] * ellipsoid.ambient[2]; // ambient term b
	
			// check each other sphere to see if it occludes light
			Lloc.set(lights[l].x, lights[l].y, lights[l].z);
			var L = Vector.subtract(Lloc, isect.xyz); // light vector unnorm'd
			// L.toConsole("L: ");
			// console.log("isect: "+isect.xyz.x+", "+isect.xyz.y+", "+isect.xyz.z);
	
			// if light isn't occluded
			var shadowed = (RENDER_METHOD == renderTypes.LIT_SHADOWS) ?
				isLightOccluded(L, isect.xyz, ellipsoids, inputTriangles, true, isectEllipsoid, 0, 0) : false;
	
			//  L, isectPos, ellipsoids, triangles, currentlyEllipsoid, isectEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0
			if (!shadowed) {
				// console.log("no occlusion found");
				L = Vector.normalize(L);
				// add in the diffuse light
				var isectMCtr = Vector.subtract(isect.xyz, new Vector(ellipsoid.x, ellipsoid.y, ellipsoid.z));
				var derivCoeffs = new Vector(ellipsoid.a * ellipsoid.a, ellipsoid.b * ellipsoid.b, ellipsoid.c * ellipsoid.c);
				var derivCoeffs = Vector.divide(new Vector(2, 2, 2), derivCoeffs);
				var N = Vector.normalize(Vector.multiply(isectMCtr, derivCoeffs)); // surface normal 
				var diffFactor = Math.max(0, Vector.dot(N, L));
				if (diffFactor > 0) {
					c[0] += lights[l].diffuse[0] * ellipsoid.diffuse[0] * diffFactor;
					c[1] += lights[l].diffuse[1] * ellipsoid.diffuse[1] * diffFactor;
					c[2] += lights[l].diffuse[2] * ellipsoid.diffuse[2] * diffFactor;
				} // end nonzero diffuse factor
	
			} // end if light not occluded
		} // end for lights
	
		c[0] = 255 * Math.min(1, c[0]); // clamp max value to 1
		c[1] = 255 * Math.min(1, c[1]); // clamp max value to 1
		c[2] = 255 * Math.min(1, c[2]); // clamp max value to 1
	
		let returnVector = new Vector(c[0], c[1], c[2]);
		return (returnVector);
	} // if not just rendering isect
}*/

function getInputLights() {
	return [
		{ "x": 0.5, "y": 1, "z": 0.5, "ambient": [1, 1, 1], "diffuse": [1, 1, 1], "specular": [1, 1, 1] },
		{ "x": 0.8, "y": 0.5, "z": 0.3, "ambient": [1, 1, 1], "diffuse": [1, 1, 1], "specular": [1, 1, 1] }
	]
}

// Index of sphere which is designated to be refracting light
const REFRACTION_SPHERE_IDX = 1;
// Number of random samples per pixels
const pixelSampleTotalAmount = 2;
// The maximum recursion depth for an indirect ray
const LONGEST_BOUNCE_DEPTH = 3;
// Number of rays initially casted from the first hemisphere
const INITIAL_BOUNCE_AMOUNT = 1;
// Number of samples to a randomly selected light
var numberOfLightSamples = 3;
/**
 * This function accepts the context to be written do, iterates through the input triangles
 * which is defined as a global constant and renders the scene from the constant global eye location
 * 
 * @param {WebGLRenderingContext} context The context canvas to be written to in the html code
 */
function rayCastTriangles(context) {

	// Obtain the input triangles and lights
	//var inputTriangles = getJSONFile(INPUT_TRIANGLES_URL, "triangles");
	var inputTriangles = getInputTriangles();
	var inputEllipsoids = getJSONFile(INPUT_SPHERES_URL, "ellipsoids");
	
	
	var inputLights = getJSONFile(INPUT_LIGHTS_URL, "lights");
	//var inputLights = getInputLights();

	inputLights[0].y = 0.99999999;
	inputLights


	var w = context.canvas.width;
	var h = context.canvas.height;
	var imagedata = context.createImageData(w, h);

	// If the input triangles are not null
	if (inputTriangles != String.null) {
		// Initialize the pixel coordinates
		let x = 0; let y = 0;

		// How many sets of triangles are there?
		let numTriangleSets = inputTriangles.length;
		let numEllipsoids = inputEllipsoids.length;

		// Initialize values for Ray and param T value
		let Dir = new Vector(0, 0, 0);
		let closestT = Number.MAX_VALUE;

		// Initialize the pixel color (black at first)
		let c = new Color(0, 0, 0, 0);


		// Set world pixel coordinates and differentials
		let wx = WIN_LEFT; // init world pixel xcoord
		let wy = WIN_TOP; // init world pixel ycoord
		let wxd = (WIN_RIGHT - WIN_LEFT) * 1 / (w - 1); // world pixel x differential
		let wyd = (WIN_BOTTOM - WIN_TOP) * 1 / (h - 1); // world pixel y differential

		// Loop over the pixels
		for (y = 0; y < h; y++) {

			// Start at the left of the row
			wx = WIN_LEFT;

			// In that row, loop over the pixels
			for (x = 0; x < h; x++) {

				let totalSummedColors = new Vector(0, 0, 0);

				for (let randomRayNum = 0; randomRayNum < pixelSampleTotalAmount; randomRayNum++) {

					// For each pixel initalize the closest interesection value to infinity and set color to black
					closestT = Number.MAX_VALUE;
					c.change(0, 0, 0, 255);

					// Initialize the temporary color array to house values (may be over 255 until end)
					let tempColor = new Vector(0, 0, 0);

					// Set the ray value random
					Dir.copy(Vector.subtract(new Vector(wx + (Math.random() - 0.5) * wxd, wy + (Math.random() - 0.5) * wyd, WIN_Z), Eye)); // set ray direction

					// Set the ray value middle
					//Dir.copy(Vector.subtract(new Vector(wx, wy, WIN_Z), Eye)); // set ray direction

					// Iterate first through each tri group
					for (let triSetIdx = 1; triSetIdx < numTriangleSets; triSetIdx++) {

						// Get the number of triangles in that triangle set and iterate through them
						let numTrianglesInSet = inputTriangles[triSetIdx].triangles.length;
						for (let triInSetIdx = 0; triInSetIdx < numTrianglesInSet; triInSetIdx++) {

							// Obtain the vertices for each triangle
							let vertices = getVertices(inputTriangles, triSetIdx, triInSetIdx);

							// Calculate intersect, and proceed to shading and coloring if it does exist
							let intersection = rayTriangleIntersect([Eye, Dir], vertices, 1);
							if (intersection.exists) {

								// Check to see if this intersection is the closest so far
								if (intersection.t < closestT) {

									//console.log('check here');

									// If so, set new closest t
									closestT = intersection.t;

									// We have the direction from the eye to the intersection, but we need from the intersection to the eye
									let dirFromIntersectionToEye = Vector.scale(-1.0, Dir);

									// intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, 
									// whichEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0, onlyDirect = false
									let resultingRadiance = radiance(intersection, dirFromIntersectionToEye, inputLights, inputTriangles, inputEllipsoids, false, 0, triSetIdx, triInSetIdx, false, 0);

									tempColor = Vector.scale(1.0, resultingRadiance);


									//console.log(newTriDiffuse);
									//c.change(resultingRadiance.x * 255, resultingRadiance.y * 255, resultingRadiance.z * 255, 255);
								}
							}

						}

					}

					// Now iterate through every ellipsoid
					for (var e = 0; e < numEllipsoids; e++) {
						// for (var e=0; e<1; e++) {
						isect = rayEllipsoidIntersect([Eye, Dir], inputEllipsoids[e], 1);
						if (isect.exists) {// there is an intersect
							if (isect.t < closestT) { // it is the closest yet
								closestT = isect.t; // record closest t yet
								let dirFromIntersectionToEye = Vector.scale(-1.0, Dir);
								//isect, isectEllipsoid, lights, ellipsoids, inputTriangles
								//resultingRadiance = shadeIsect(isect, e, inputLights, inputEllipsoids, inputTriangles);
								resultingRadiance = radiance(isect, dirFromIntersectionToEye, inputLights, inputTriangles, inputEllipsoids, true, e, 0, 0, false, 0);
								tempColor = Vector.scale(1.0, resultingRadiance);
							} // end if closest yet
						}
					} // end for ellipsoids

					totalSummedColors = Vector.add(tempColor, totalSummedColors);
				}
				totalSummedColors = Vector.scale(1.0 / pixelSampleTotalAmount, totalSummedColors);

				c.change(Math.abs(Math.min(1.0, totalSummedColors.x)) * 255, Math.abs(Math.min(1.0, totalSummedColors.y)) * 255, Math.abs(Math.min(1.0, totalSummedColors.z)) * 255, 255);

				drawPixel(imagedata, x, y, c);
				wx += wxd;
			}

			wy += wyd;
		}

		context.putImageData(imagedata, 0, 0);
	}
}



/**
 * Given a pixel position, calculate x and y pixel and world coords
 * 
 * @param {Number} pixelNum The pixel number which increases from left to right then top to down
 * @param {Number} w The width of the screen in pixels
 * @param {Number} h The height of the screen in pixels
 * 
 * @returns {JSON} Output which has properties x, y, wx, wy which are x and y for the pixel grid locations and wx wy which are ratios of the location (between 0 and 1)
 */
function getPixelLocat(pixelNum, w, h) {

	var y = Math.floor(pixelNum / w);
	var x = pixelNum - y * w;

	var wx = WIN_LEFT + x / w * (WIN_RIGHT - WIN_LEFT);
	var wy = WIN_TOP + y / h * (WIN_BOTTOM - WIN_TOP);

	return ({ "x": x, "y": y, "wx": wx, "wy": wy });
}

// draw a pixel at x,y using color
function drawPixel(imagedata, x, y, color) {
	try {
		if ((typeof (x) !== "number") || (typeof (y) !== "number"))
			throw "drawpixel location not a number";
		else if ((x < 0) || (y < 0) || (x >= imagedata.width) || (y >= imagedata.height))
			throw "drawpixel location outside of image";
		else if (color instanceof Color) {
			var pixelindex = (y * imagedata.width + x) * 4;
			imagedata.data[pixelindex] = color[0];
			imagedata.data[pixelindex + 1] = color[1];
			imagedata.data[pixelindex + 2] = color[2];
			imagedata.data[pixelindex + 3] = color[3];
		} else
			throw "drawpixel color is not a Color";
	} // end try

	catch (e) {
		console.log(e);
		console.log(color);
	}
} // end drawPixel


/* constants and globals */
const WIN_Z = 0;
const WIN_LEFT = 0, WIN_RIGHT = 1;
const WIN_BOTTOM = 0, WIN_TOP = 1;
//const WIN_LEFT = 0.28, WIN_RIGHT = 0.4;
//const WIN_BOTTOM = 0.6, WIN_TOP = 0.72;

const INPUT_SPHERES_URL = "https://ncsucg4games.github.io/prog1/spheres.json";
const INPUT_LIGHTS_URL = "https://ncsucg4games.github.io/prog1/lights.json";

const renderTypes = {
	ISECT_ONLY: 1, // render white if intersect in pixel
	LIT: 2, // render lit color if intersect in pixel
	LIT_SHADOWS: 3 // render lit/shadowed color in intersect in pixel
};

const RENDER_METHOD = renderTypes.LIT_SHADOWS; // show intersections unlit in white


var Eye = new Vector(0.5, 0.5, -0.5); // set the eye position

/**
 * This function runs the overall program and makes calls to the rendering algorithms
 */
function main() {

	// Get the canvas and context
	var canvas = document.getElementById("viewport");
	var context = canvas.getContext("2d");

	//Render the Scene
	rayCastTriangles(context);
}