

class Color {
	constructor(r, g, b, a) {
		if ((typeof (r) !== "number") || (typeof (g) !== "number") || (typeof (b) !== "number") || (typeof (a) !== "number"))
			throw "color component not a number";
		else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
			throw "color component less than 0";
		else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
			throw "color component bigger than 255";
		else {
			this[0] = r; this[1] = g; this[2] = b; this[3] = a;
		}
	} // end Color constructor

	// Color change method
	change(r, g, b, a) {
		if ((typeof (r) !== "number") || (typeof (g) !== "number") || (typeof (b) !== "number") || (typeof (a) !== "number"))
			throw "color component not a number";
		else if ((r < 0) || (g < 0) || (b < 0) || (a < 0))
			throw "color component less than 0";
		else if ((r > 255) || (g > 255) || (b > 255) || (a > 255))
			throw "color component bigger than 255";
		else {
			this[0] = r; this[1] = g; this[2] = b; this[3] = a;
		}
	} // end Color change method
} // end color class

class Vector {
	constructor(x, y, z) {
		this.set(x, y, z);
	} // end constructor

	// sets the components of a vector
	set(x, y, z) {
		if ((typeof (x) !== "number") || (typeof (y) !== "number") || (typeof (z) !== "number"))
			throw "vector component not a number";
		else
			this.x = x; this.y = y; this.z = z;

	} // end vector set

	// copy the passed vector into this one
	copy(v) {
		if (!(v instanceof Vector)) {
			throw "Vector.copy: non-vector parameter";
		} else {
			this.x = v.x; this.y = v.y; this.z = v.z;
		}
	}

	toConsole(prefix) {
		console.log(prefix + "[" + this.x + "," + this.y + "," + this.z + "]");
	} // end to console

	// static dot method
	static dot(v1, v2) {
		if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
			throw "Vector.dot: non-vector parameter";
		else
			return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
	} // end dot static method

	static cross(v1, v2) {
		if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
			throw "Vector.cross: non-vector parameter";
		else
			return (new Vector(v1.y * v2.z - v1.z * v2.y,
				v1.z * v2.x - v1.x * v2.z,
				v1.x * v2.y - v1.y * v2.x));
	}

	// static add method
	static add(v1, v2) {
		if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
			throw "Vector.add: non-vector parameter";
		else
			return (new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z));
	} // end add static method

	// static subtract method, v1-v2
	static subtract(v1, v2) {
		if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
			throw "Vector.subtract: non-vector parameter";
		else {
			var v = new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
			//v.toConsole("Vector.subtract: ");
			return (v);
		}
	} // end subtract static method

	// static divide method, v1.x/v2.x etc
	static divide(v1, v2) {
		if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
			throw "Vector.divide: non-vector parameter";
		else {
			var v = new Vector(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
			//v.toConsole("Vector.divide: ");
			return (v);
		}
	} // end divide static method

	// static divide method, v1.x/v2.x etc
	static multiply(v1, v2) {
		if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
			throw "Vector.multiply: non-vector parameter";
		else {
			var v = new Vector(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
			//v.toConsole("Vector.divide: ");
			return (v);
		}
	} // end multiply static method

	// static scale method
	static scale(c, v) {
		if (!(typeof (c) === "number") || !(v instanceof Vector))
			throw "Vector.scale: malformed parameter";
		else
			return (new Vector(c * v.x, c * v.y, c * v.z));
	} // end scale static method

	// static normalize method
	static normalize(v) {
		if (!(v instanceof Vector))
			throw "Vector.normalize: parameter not a vector";
		else {
			var lenDenom = 1 / Math.sqrt(Vector.dot(v, v));
			return (Vector.scale(lenDenom, v));
		}
	} // end scale static method

	static magnitude(v) {
		if (!(v instanceof Vector))
			throw "Vector.normalize: parameter not a vector";
		else {
			let magn = v.x ** 2 + v.y ** 2 + v.z ** 2;
			return magn;
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

/**
 * This function accepts some parameters and returns if a given point is within the triangle
 * 
 * @param {Vector} i The interesection point in x y z coordinates using the Vector Class
 * @param {Vector} a A triangle vertex in x y z coordinates using the Vector Class
 * @param {Vector} b Another triangle vertex in x y z coordinates using the Vector Class
 * @param {Vector} c The last triangle vertex in x y z coordinates using the Vector Class
 * @param {Vector} n The normal vector of the triangle in x y z coordinates using the Vector Class
 * 
 * @returns {boolean} Whether the point is inside the triangle
 * 
 */
function IsPointInsideTriangle(i, a, b, c, n) {
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
}



/**
 * This function accepts a ray, triangle, and clipvalue to determine wherther the ray hits the triangle
 * If so, it returns information about the intersection
 * 
 * @param {Array<Vector>} ray Array with the eye and ray direction both as vectors (in that order) such that [EYE, DIR]
 * @param {Array<Array>} triangle Array of Triangle vertices, each with x, y, and z coordinates
 * 
 * @returns {JSON} JSON object with attributes exists, xyz, and t;
 */
function rayTriangleIntersect(ray, triangle) {
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

/**
 * Calculates the indirect illumination at a given intersection point. It does this by randomly sampling a direction, then calculating the radiance at that spot.
 * When the ray hits a certain recursion depth, however (either because it hit the max defined at the bottom or it fails the random coin flip), it just returns the direct
 * illumination at its new intersection point, therefore collapsing the recursion
 * 
 * @param {Vector} intersection - The intersection point where illumination is calculated.
 * @param {Vector} rayToDestination - The ray direction towards the destination.
 * @param {Array} lights - An array of light sources in the scene.
 * @param {Array} inputTriangles - An array of triangles in the scene.
 * @param {Array} inputEllipsoids - An array of ellipsoids in the scene.
 * @param {boolean} currentlyEllipsoid - Indicates whether the current object is an ellipsoid.
 * @param {number} whichEllipsoid - Index of the current ellipsoid in the array.
 * @param {number} whichTriSet - Index of the current triangle set.
 * @param {number} whichTriInSet - Index of the triangle within the set.
 * @param {number} bounceCountCurrent - The current bounce count for recursion.
 * 
 * @returns {Vector} The calculated illumination color or intensity at the intersection.
 */
function indirectIllumination(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid, whichTriSet, whichTriInSet, bounceCountCurrent) {

	let estRadiance = new Vector(0, 0, 0);
	let numEllipsoids = inputEllipsoids.length;

	// How many rays should be sent from this intersection
	let bounceNum = 0;

	// If it's the first recursive call, return the INITAL_BOUNCE_AMOUNT, else, just continue the same ray
	if (bounceCountCurrent == 0) {
		bounceNum = INITIAL_BOUNCE_AMOUNT;
	} else {
		bounceNum = 1;
	}

	// Now let's iterate through each indirect ray that will bounce from the hemisphere
	for (let bounceIdx = 0; bounceIdx < bounceNum; bounceIdx++) {

		// Randomly sample the angles which define spherical coordinates
		let theta = (Math.random() * 2.0 * Math.PI);
		let phi = (Math.random() * Math.PI / 2.0);

		// Calculate the normal vector of the intersection
		let normalVector;
		if (currentlyEllipsoid) {
			// If sphere, normal is from center to intersection
			let sphereCenter = new Vector(inputEllipsoids[whichEllipsoid].x, inputEllipsoids[whichEllipsoid].y, inputEllipsoids[whichEllipsoid].z);
			normalVector = Vector.subtract(intersection.xyz, sphereCenter);
		} else {
			// If triangle, normal is pre-defined
			let normalArray = inputTriangles[whichTriSet].normals[whichTriInSet];
			normalVector = new Vector(normalArray[0], normalArray[1], normalArray[2]);
		}

		// To create an orthonormal basis set which the up vector as the normal, we will cross the normal and the ray to destination vector,
		// which will result in a vector orthogonal to the normal
		let normalizedOrthogonalVector1 = Vector.normalize(Vector.cross(normalVector, rayToDestination));

		// Using the previos vector and the normal, create the last vector by crossing them and establish our orthonormal basis set
		let normalizedOrthogonalVector2 = Vector.normalize(Vector.cross(normalVector, normalizedOrthogonalVector1));

		// Using the random angle theta, rotate the first orthonormal basis vector about the normal in circle defined by normalizedOrthogonalVector1 and normalizedOrthogonalVector2
		let normalizedVectorCircledAroundNormal = Vector.normalize(Vector.add(Vector.scale(Math.cos(theta), normalizedOrthogonalVector1), Vector.scale(Math.sin(theta), normalizedOrthogonalVector2)));

		// Using the random angle phi, calculate the vector which is phi radians away from the normal and
		// (pi/2 - phi) radians away from the previous vector (both of which define the vertical plane for the final vector)
		let randomDirectionHemisphereVector = Vector.normalize(Vector.add(Vector.scale(Math.cos(phi), normalVector), Vector.scale(Math.sin(phi), normalizedVectorCircledAroundNormal)));

		// Check for efraction sphere index, and if so, set the "random" direction to just the negative normal, which models refraction
		if (currentlyEllipsoid && whichEllipsoid == REFRACTION_SPHERE_IDX) {
			randomDirectionHemisphereVector = Vector.scale(1.0, normalVector); //this is the bread and butter of Refraction. This makes the sample vector opposite to normal and therefore beautiful
		}

		// Set up variables to detect and trackthe nearest intersection
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

				// Check intersection of the ray with this triangle
				let intersectionNew = rayTriangleIntersect([intersection.xyz, randomDirectionHemisphereVector], vertices, 2);

				// If it exists and it is NOT the one it came from 
				if (intersectionNew.exists && !(whichTriSet == triSetIdx && whichTriInSet == triInSetIdx)) {

					// Check to see if this intersection is the closest so far
					if (intersectionNew.t < closestT) {

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

			// Check ray intersection with Ellipsoid
			isect = rayEllipsoidIntersect([intersection.xyz, randomDirectionHemisphereVector], inputEllipsoids[ellipsoidIdx], 0);
			if (isect.exists) {// there is an intersect
				if (isect.t < closestT) { // it is the closest yet

					triangle = false;

					// if so, set tracking variables
					closestTriSetIdx = null;
					closestTriInSetIdx = null;
					closestT = isect.t;
					closestIntersection = isect;
					closestEllipsoidIdx = ellipsoidIdx;
				} // end if closest yet
			}
		} // end for ellipsoids


		// Coefficient variables for lighting calculation
		let cosineResult = 0;
		let brdfResult = 0;
		let distanceFactor = 0;
		let totalFactor = 0;

		// Preset the radiance variable
		let resultingRadiance = new Vector(0, 0, 0);

		// If no intersection, then return 0. Otherwise continue to calculation
		if (closestIntersection == null) {
			resultingRadiance = new Vector(0, 0, 0);
		} else {

			let directionFromNewIntersectionToPreviousIntersection = Vector.subtract(intersection.xyz, closestIntersection.xyz);
			let intersectionNormalVector;

			// Calculate the normals of the intersection points (triangle or ellipsoid)
			if (triangle) {
				let intersectionNormalArray = inputTriangles[closestTriSetIdx].normals[closestTriInSetIdx]
				intersectionNormalVector = new Vector(intersectionNormalArray[0], intersectionNormalArray[1], intersectionNormalArray[2]);
			} else {
				let sphereCenter = new Vector(inputEllipsoids[closestEllipsoidIdx].x, inputEllipsoids[closestEllipsoidIdx].y, inputEllipsoids[closestEllipsoidIdx].z);
				intersectionNormalVector = Vector.subtract(intersection.xyz, sphereCenter);
				//console.log([sphereCenter, intersectionNormalVector])
			}

			// Calculate and save brdf
			brdfResult = brdf(intersectionNormalVector, directionFromNewIntersectionToPreviousIntersection, rayToDestination);

			// Calculate random russian roulette value
			let rouletteFactor = Math.random();

			// Calculate the radiance at the new intersection point, and only cotinue recursive indirect called if the random factor is above 0.5
			resultingRadiance = radiance(closestIntersection, directionFromNewIntersectionToPreviousIntersection, lights,
				inputTriangles, inputEllipsoids, !triangle, closestEllipsoidIdx, closestTriSetIdx, closestTriInSetIdx, (rouletteFactor > 0.5) ? bounceCountCurrent + 1 : LONGEST_BOUNCE_DEPTH);

			// Calculate the various factors applied after lighting calculation
			cosineResult = Math.max(0, Vector.dot(Vector.normalize(intersectionNormalVector), Vector.normalize(directionFromNewIntersectionToPreviousIntersection)));
			distanceFactor = 1 / (1 + closestT ** 2);
			totalFactor = (1 / 5) * (cosineResult * brdfResult * distanceFactor) + 0.4; // Unique make it your own


		}

		// Finally add the new resultingRadiance to the existing estRadiance
		estRadiance = Vector.add(estRadiance, Vector.scale(totalFactor, resultingRadiance));
	}

	// Divide the estimated radiance by the number of rays sent out to average all of them
	return Vector.scale(1 / bounceNum, estRadiance);
}

// Source code from developer.mozilla.org
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

/**
 * This function is my custom sigmoid function which transforms a variable with range [0, 1] to another variable with range [0, 1]
 * The function is sqrt(-(value)^exp + 1)
 * 
 * @param {number} value - Input variable to the sigmoid funtion with range [0, 1]
 * @param {number} [exp=1.1] - Input exponent, by default 1.1, which changes the sigmoid function
 * 
 * @returns {number} Output of Sigmoid function with range [0, 1]
 */
function customSigmoidFunction(value, exp = 1.1) {
	return Math.sqrt(-1.0 * Math.pow(value, exp) + 1);
}

/**
 * This is a custom brdf function which I made to match the style which I wanted to implement. Takes in normal to surface, ray in and ray out (all with bases at the intersection point)
 * and outputs a result which factors in how light should be resulting from the input to the output vectors given the normal of the surface
 * 
 * @param {Vector} normalToSurface - A vector in xyz which is the normal of the intersection surface
 * @param {Vector} rayToLightsource - A vector in xyz which is the ray from the intersection point to the lighting source 
 * @param {Vector} rayToDestination - A vector in xyz which is the ray from the intersection to the lighting destination from the source off the intersection
 * 
 * @returns {number} A number which has a range of [0, 1] which represents the portion of light from the source off the intersection to the destination point
 */
function brdf(normalToSurface, rayToLightsource, rayToDestination) {
	return customSigmoidFunction(Math.abs(Math.abs(Vector.dot(Vector.normalize(rayToLightsource), Vector.normalize(normalToSurface))) - Math.abs(Vector.dot(Vector.normalize(rayToDestination), Vector.normalize(normalToSurface)))));
}

/**
 * Calculates the direct illumination at a given intersection point.
 * 
 * @param {Vector} intersection - The intersection point where illumination is calculated.
 * @param {Vector} rayToDestination - The ray direction towards the destination.
 * @param {Array} lights - An array of light sources in the scene.
 * @param {Array} inputTriangles - An array of triangles in the scene.
 * @param {Array} inputEllipsoids - An array of ellipsoids in the scene.
 * @param {boolean} currentlyEllipsoid - Indicates whether the current object is an ellipsoid.
 * @param {number} whichEllipsoid - Index of the current ellipsoid in the array.
 * @param {number} whichTriSet - Index of the current triangle set.
 * @param {number} whichTriInSet - Index of the triangle within the set.
 * 
 * @returns {Vector} The calculated illumination color or intensity at the intersection.
 */
function directIllumincation(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid, whichTriSet, whichTriInSet) {

	// Initialize radiance estimated value
	let estRadiance = new Vector(0, 0, 0);

	// We are just using uniform distribution, all lights have same prob
	let lightProbability = 1 / lights.length;

	// Go through each sample 
	for (let sampleIdx = 0; sampleIdx < numberOfLightSamples; sampleIdx++) {

		// Get a random light index
		let randomLightIdx = getRandomInt(lights.length);

		// Obtain the light at the given point 
		let randomlySelectedLight = lights[randomLightIdx];
		let randomlySelectedLightPosition = new Vector(randomlySelectedLight.x, randomlySelectedLight.y, randomlySelectedLight.z);
		let vectorFromIntersectionToRandomLight = Vector.subtract(randomlySelectedLightPosition, intersection.xyz);


		// Check if life is occluded and if not		
		let occludedList = isLightOccluded(vectorFromIntersectionToRandomLight, intersection.xyz, inputEllipsoids, currentlyEllipsoid, whichEllipsoid);
		if (occludedList.length == 1 && occludedList[0][0] == REFRACTION_SPHERE_IDX) {
			estRadiance = Vector.add(estRadiance, directIllumincation(occludedList[0][1], rayToDestination, lights, inputTriangles, inputEllipsoids, true, occludedList[0][0], whichTriSet, whichTriInSet));
		} else if (occludedList.length == 0) {

			// Calculate normal vector for either sphere or triangle, depending on state
			let normalVector;
			if (currentlyEllipsoid) {
				let sphereCenter = new Vector(inputEllipsoids[whichEllipsoid].x, inputEllipsoids[whichEllipsoid].y, inputEllipsoids[whichEllipsoid].z);
				normalVector = Vector.subtract(intersection.xyz, sphereCenter);
			} else {
				let normalArray = inputTriangles[whichTriSet].normals[whichTriInSet];
				normalVector = new Vector(normalArray[0], normalArray[1], normalArray[2]);
			}

			// Populate factors and initialize the surface color
			let brdfResult = brdf(normalVector, vectorFromIntersectionToRandomLight, rayToDestination);
			let cosineResult = Math.max(0, Vector.dot(Vector.normalize(normalVector), Vector.normalize(vectorFromIntersectionToRandomLight)));
			let surfaceColor;

			// Get surface color depending on ellipsoid or triangle
			if (currentlyEllipsoid) {
				surfaceColor = new Vector(inputEllipsoids[whichEllipsoid].diffuse[0], inputEllipsoids[whichEllipsoid].diffuse[1], inputEllipsoids[whichEllipsoid].diffuse[2]);
			} else {
				surfaceColor = new Vector(inputTriangles[whichTriSet].material.diffuse[0], inputTriangles[whichTriSet].material.diffuse[1], inputTriangles[whichTriSet].material.diffuse[2]);
			}

			// Add the radiance from the surface color (direct light)
			estRadiance = Vector.add(estRadiance, Vector.scale(brdfResult * cosineResult, surfaceColor));
		}
	}

	// Return the weighted results
	return Vector.scale(1 / (numberOfLightSamples * lightProbability * 1.0), estRadiance);
}


/**
 * This function dictates the overall color and shading resulting from an intersection.
 * intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0
 */
function radiance(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid = 0, whichTriSet = 0, whichTriInSet = 0, bounceCountCurrent) {

	// If we've hit the maximum bounce depth (or if roulette failed and caused this), only calculate direct therefore ending recursion
	if (bounceCountCurrent >= LONGEST_BOUNCE_DEPTH) {

		// Calculate direct
		let direct = directIllumincation(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid, whichTriSet, whichTriInSet);

		// If for some reason the direct values are over 1, normalize it keeping the same ratios
		if (Math.max(direct.x, direct.y, direct.z) > 1) {
			direct = Vector.scale(1 / Math.max(direct.x, direct.y, direct.z), direct);
		}

		// Return direct result
		return direct;
	} else {

		// Obtain both the indirect and direct light
		let indirectRaw = Vector.scale(2.2, indirectIllumination(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid, whichTriSet, whichTriInSet, bounceCountCurrent))
		let directRaw = Vector.scale(1, directIllumincation(intersection, rayToDestination, lights, inputTriangles, inputEllipsoids, currentlyEllipsoid, whichEllipsoid, whichTriSet, whichTriInSet));

		// You know, sometimes things are just so small that they turn into Nan's. So if they do they're basically just zero tbh
		if (isNaN(indirectRaw.x) || isNaN(indirectRaw.y) || isNaN(indirectRaw.z)) {
			indirectRaw = new Vector(0, 0, 0);
		}
		if (isNaN(indirectRaw.x) || isNaN(indirectRaw.y) || isNaN(indirectRaw.z)) {
			directRaw = new Vector(0, 0, 0);
		}

		// Sometimes they're negative, if they are just make them zero
		let direct = new Vector(Math.max(0, directRaw.x), Math.max(0, directRaw.y), Math.max(0, directRaw.z));
		let indirect = new Vector(Math.max(0, indirectRaw.x), Math.max(0, indirectRaw.y), Math.max(0, indirectRaw.z));

		// Initialize adn set surface color
		let surfaceColor;
		if (currentlyEllipsoid) {
			surfaceColor = new Vector(inputEllipsoids[whichEllipsoid].diffuse[0], inputEllipsoids[whichEllipsoid].diffuse[1], inputEllipsoids[whichEllipsoid].diffuse[2]);;
		} else {
			surfaceColor = new Vector(inputTriangles[whichTriSet].material.diffuse[0], inputTriangles[whichTriSet].material.diffuse[1], inputTriangles[whichTriSet].material.diffuse[2]);
		}

		// If any individual component of light coming in is greater than the material's light component itself, then the material can only reflect what its surface values are
		let indirectResultingLight = new Vector(Math.min(surfaceColor.x, indirect.x), Math.min(surfaceColor.y, indirect.y), Math.min(surfaceColor.z, indirect.z))

		// You know, sometimes things are just so small that they turn into Nan's. So if they do they're basically just zero tbh
		if (isNaN(direct.x) || isNaN(direct.y) || isNaN(direct.z)) {
			direct = new Vector(0, 0, 0);
		}
		if (isNaN(indirectResultingLight.x) || isNaN(indirectResultingLight.y) || isNaN(indirectResultingLight.z)) {
			indirectResultingLight = new Vector(0, 0, 0);
		}

		// Initialize and set raw combined values
		let combinedRaw;
		if (currentlyEllipsoid && whichEllipsoid == REFRACTION_SPHERE_IDX) {
			combinedRaw = Vector.scale(1.0, indirect);
			//console.log(indirectRaw);
		} else {
			combinedRaw = Vector.add(direct, indirectResultingLight);
		}

		// Calculate combined and return it!
		let combined = new Vector(Math.min(1, Math.max(0, combinedRaw.x)), Math.min(1, Math.max(0, combinedRaw.y)), Math.min(1, Math.max(0, combinedRaw.z)));
		return combined;
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
function isLightOccluded(L, isectPos, ellipsoids, currentlyEllipsoid, isectEllipsoid = 0) {
	var d = 0; // which ellipsoid
	var lightOccluded = false; // if light is occluded
	var occluderIsect = {}; // occluder intersect details
	var occList = [];
	// console.log("testing for occlusions");

	// check each ellipsoid up to intersected ellipsoid to see if it occludes
	while ((!lightOccluded) && (d < isectEllipsoid)) {
		occluderIsect = rayEllipsoidIntersect([isectPos, L], ellipsoids[d], 0);
		if (!occluderIsect.exists) { // no intersection
			d++; // on to next ellipsoid
		} else if (occluderIsect.t > 1) { // light in front of intersection
			d++; // on to next sphere
		} else {
			occList.push([d, occluderIsect]);
			//lightOccluded = true;
			d++;
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
			occList.push([d, occluderIsect]);
			//lightOccluded = true;
			d++;
			// console.log("occlusion found from ellipsoid "+isectEllipsoid+" to "+e);
		} // end if occlusion found
	} // while all ellipsoids after one intersected by eye

	return occList;
}

function getInputLights() {
	return [
		{ "x": 0.5, "y": 1, "z": 0.5, "ambient": [1, 1, 1], "diffuse": [1, 1, 1], "specular": [1, 1, 1] },
		{ "x": 0.8, "y": 0.5, "z": 0.3, "ambient": [1, 1, 1], "diffuse": [1, 1, 1], "specular": [1, 1, 1] }
	]
}

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
									let resultingRadiance = radiance(intersection, dirFromIntersectionToEye, inputLights, inputTriangles, inputEllipsoids, false, 0, triSetIdx, triInSetIdx, 0);
									tempColor = Vector.scale(1.0, resultingRadiance);
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
								resultingRadiance = radiance(isect, dirFromIntersectionToEye, inputLights, inputTriangles, inputEllipsoids, true, e, 0, 0, 0);
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


// Index of sphere which is designated to be refracting light
const REFRACTION_SPHERE_IDX = 1;
// Number of random samples per pixels
const pixelSampleTotalAmount = 10;
// The maximum recursion depth for an indirect ray
const LONGEST_BOUNCE_DEPTH = 6;
// Number of rays initially casted from the first hemisphere
const INITIAL_BOUNCE_AMOUNT = 7;
// Number of samples to a randomly selected light
var numberOfLightSamples = 1;

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