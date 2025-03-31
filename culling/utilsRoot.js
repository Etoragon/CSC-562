
export const ROOMS_JSON_ERROR_MESSAGE = "Rooms Json File incorrectly formatted";

export const TRIANGLE_SET_TEMPLATE = { "material": {}, "vertices": [], "triangles": [], "normals": [], "uvs": [] };


export const SEARCH_FOUR_ADJACENT_CELLS = (roomJson, row, col) => {
	let returnDictionary = {
		"up": row == 0,
		"down": row == roomJson.rooms.length - 1,
		"left": col == 0,
		"right": col == roomJson.rooms[row].length - 1,
		"above": false,
		"below": false
	}

	// Iterate through all directions, check to make sure each direction is not 
	// beyond the bounds of the map, then check and save if that cell is "s"
	Object.keys(returnDictionary).map((key) => {

		// If not already disqualified from previous bounds check
		if (!returnDictionary[key]) {

			// The key indicates the direciton
			switch (key) {
				case ("up"):
					returnDictionary[key] = (roomJson.rooms[row - 1][col] == "s");
					break;
				case ("down"):
					returnDictionary[key] = (roomJson.rooms[row + 1][col] == "s");
					break;
				case ("left"):
					returnDictionary[key] = (roomJson.rooms[row][col - 1] == "s");
					break;
				case ("right"):
					returnDictionary[key] = (roomJson.rooms[row][col + 1] == "s");
					break;
				case ("above"):
					returnDictionary[key] = (roomJson.rooms[row][col] != "s");
					break;
				case ("below"):
					returnDictionary[key] = (roomJson.rooms[row][col] != "s");
					break;
			}
		}
	})

	// Finally return the adjacent cell search
	return returnDictionary;
}



export const DIRECTION_TO_WORLD_COORDINATES = (directions, row, col, worldoffset, height) => {
	// Initialize the return object
	let trianglesAndVertices = { "vertices": [], "triangles": [], "normals": [], "uvs": [] };

	// Calculate the offset of the center coordiantes (local to global essentially)
	let centerX = col + 0.5 + worldoffset[0];
	let centerY = row + 0.5 + worldoffset[1];
	let centerZ = height / 2 + worldoffset[2];

	// Go ahead and add all the coordinates
	/*trianglesAndVertices.vertices.push([centerX + 0.5, centerY - 0.5, centerZ - height / 2]);
	trianglesAndVertices.vertices.push([centerX - 0.5, centerY - 0.5, centerZ - height / 2]);
	trianglesAndVertices.vertices.push([centerX + 0.5, centerY - 0.5, centerZ + height / 2]);
	trianglesAndVertices.vertices.push([centerX - 0.5, centerY - 0.5, centerZ + height / 2]);

	trianglesAndVertices.vertices.push([centerX + 0.5, centerY + 0.5, centerZ - height / 2]);
	trianglesAndVertices.vertices.push([centerX - 0.5, centerY + 0.5, centerZ - height / 2]);
	trianglesAndVertices.vertices.push([centerX + 0.5, centerY + 0.5, centerZ + height / 2]);
	trianglesAndVertices.vertices.push([centerX - 0.5, centerY + 0.5, centerZ + height / 2]);*/

	// Iterate through the directions
	Object.keys(directions).map((key) => {
		// If they should have a wall ("s" detected previously)
		if (directions[key]) {
			let currLength = trianglesAndVertices.vertices.length;
			switch (key) {
				case ("up"):
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ - height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ - height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ + height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ + height / 2, centerY - 0.5]);
					trianglesAndVertices.uvs.push([1, 0]);
					trianglesAndVertices.uvs.push([0, 0]);
					trianglesAndVertices.uvs.push([0, 1]);
					trianglesAndVertices.uvs.push([1, 1]);
					trianglesAndVertices.normals.push([0, 0, 1]);
					trianglesAndVertices.normals.push([0, 0, 1]);
					trianglesAndVertices.normals.push([0, 0, 1]);
					trianglesAndVertices.normals.push([0, 0, 1]);
					trianglesAndVertices.triangles = trianglesAndVertices.triangles.concat([[currLength, currLength + 1, currLength + 2], [currLength + 2, currLength + 3, currLength + 0]]);
					break;
				case ("down"):
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ - height / 2, centerY + 0.5]);
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ - height / 2, centerY + 0.5]);
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ + height / 2, centerY + 0.5]);
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ + height / 2, centerY + 0.5]);
					trianglesAndVertices.uvs.push([1, 0]);
					trianglesAndVertices.uvs.push([0, 0]);
					trianglesAndVertices.uvs.push([0, 1]);
					trianglesAndVertices.uvs.push([1, 1]);
					trianglesAndVertices.normals.push([0, 0, -1]);
					trianglesAndVertices.normals.push([0, 0, -1]);
					trianglesAndVertices.normals.push([0, 0, -1]);
					trianglesAndVertices.normals.push([0, 0, -1]);
					trianglesAndVertices.triangles = trianglesAndVertices.triangles.concat([[currLength, currLength + 1, currLength + 2], [currLength + 2, currLength + 3, currLength + 0]]);
					break;
				case ("left"):
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ - height / 2, centerY + 0.5]);
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ - height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ + height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ + height / 2, centerY + 0.5]);
					trianglesAndVertices.uvs.push([1, 0]);
					trianglesAndVertices.uvs.push([0, 0]);
					trianglesAndVertices.uvs.push([0, 1]);
					trianglesAndVertices.uvs.push([1, 1]);
					trianglesAndVertices.normals.push([1, 0, 0]);
					trianglesAndVertices.normals.push([1, 0, 0]);
					trianglesAndVertices.normals.push([1, 0, 0]);
					trianglesAndVertices.normals.push([1, 0, 0]);
					trianglesAndVertices.triangles = trianglesAndVertices.triangles.concat([[currLength, currLength + 1, currLength + 2], [currLength + 2, currLength + 3, currLength + 0]]);
					break;
				case ("right"):
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ - height / 2, centerY + 0.5]);
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ - height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ + height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ + height / 2, centerY + 0.5]);
					trianglesAndVertices.uvs.push([1, 0]);
					trianglesAndVertices.uvs.push([0, 0]);
					trianglesAndVertices.uvs.push([0, 1]);
					trianglesAndVertices.uvs.push([1, 1]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.triangles = trianglesAndVertices.triangles.concat([[currLength, currLength + 1, currLength + 2], [currLength + 2, currLength + 3, currLength + 0]]);
					break;
				case ("above"):
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ + height / 2, centerY + 0.5]);
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ + height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ + height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ + height / 2, centerY + 0.5]);
					trianglesAndVertices.uvs.push([1, 0]);
					trianglesAndVertices.uvs.push([0, 0]);
					trianglesAndVertices.uvs.push([0, 1]);
					trianglesAndVertices.uvs.push([1, 1]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.triangles = trianglesAndVertices.triangles.concat([[currLength, currLength + 1, currLength + 2], [currLength + 2, currLength + 3, currLength + 0]]);
					break;
				case ("below"):
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ - height / 2, centerY + 0.5]);
					trianglesAndVertices.vertices.push([centerX - 0.5, centerZ - height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ - height / 2, centerY - 0.5]);
					trianglesAndVertices.vertices.push([centerX + 0.5, centerZ - height / 2, centerY + 0.5]);
					trianglesAndVertices.uvs.push([1, 0]);
					trianglesAndVertices.uvs.push([0, 0]);
					trianglesAndVertices.uvs.push([0, 1]);
					trianglesAndVertices.uvs.push([1, 1]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.triangles = trianglesAndVertices.triangles.concat([[currLength, currLength + 1, currLength + 2], [currLength + 2, currLength + 3, currLength + 0]]);
					break;
			}

		}
	})

	// Finally after adding the walls, add the ceiling and floor

	if (trianglesAndVertices.vertices.length != 0) {
		//console.log(trianglesAndVertices)
	}

	// Return triangles with triangles, vertices, and normals completed.
	return trianglesAndVertices;
}

/**
 * This constant accepts the json, row, col, and worldoffset to produce the set of triangles for a block
 */
export const ROOM_CELL_TO_3D_BLOCK = (roomJson, row, col, height, worldoffset = [0, 0, 0]) => {

	// Save the current cell type
	let cellType = roomJson.rooms[row][col];

	// Initialize the triangles and cells
	let surroundingCells = {};
	let triangleSetReturn = {};

	// "s" doesn't need to check, only p and numbers (for each room type)
	switch (cellType) {
		case "s":
			return structuredClone(TRIANGLE_SET_TEMPLATE);
		default:
			surroundingCells = SEARCH_FOUR_ADJACENT_CELLS(roomJson, row, col);
			triangleSetReturn = DIRECTION_TO_WORLD_COORDINATES(surroundingCells, row, col, worldoffset, height);
			triangleSetReturn = COLOR_3D_BLOCK(triangleSetReturn, cellType);
			break;
	}

	// With all of it calculated, return the triangle set
	return triangleSetReturn;
}

// This determine the different textures per room
export const ROOM_NUMBER_TO_TEXTURE = { 0: "abe.png", 1: "billie.jpg", "p": "tree.png" }

// Accepts a 3D block set, then updates the lighting and color information
export const COLOR_3D_BLOCK = (triangleSet, roomType) => {
	// Initialize the empty dictionary
	triangleSet.material = {};

	// Update the color lighting
	triangleSet.material.ambient = [0.1, 0.1, 0.1];
	triangleSet.material.diffuse = [0.6, 0.6, 0.6];
	triangleSet.material.specular = [0.3, 0.3, 0.3];

	// Update material surface information
	triangleSet.material.n = 11;
	triangleSet.material.alpha = 0.9;
	triangleSet.material.texture = ROOM_NUMBER_TO_TEXTURE[roomType];

	return triangleSet;
}

/**
 * This function accepts the loaded rooms Json and returns the triangles to render
 * 
 * @param {JSON} roomJson room Json of structure {rooms:[["","",...]], furniture:[[num, num, num, string, num]]}
 * @param {number} [centerHeight=0.5] height of room, since room json is only 2D
 * 
 * @returns Generated 3D triangle set for rooms
 */
export function roomToTriangles(roomJson, height = 1) {
	// Validate the input
	if (!roomJson.rooms || !roomJson.furniture) {
		throw new Error(ROOMS_JSON_ERROR_MESSAGE);
	}

	// Now initialize the final product. 
	let triangleSets = [];
	let triangleRoomTypeToIndex = {};


	// Define the number of rows / columns in this JSON
	let numRows = roomJson.rooms.length;
	let numCols = roomJson.rooms[0].length;

	// First iterate through each element in roomJSON
	for (let currentRow = 0; currentRow < numRows; currentRow++) {
		for (let currentCol = 0; currentCol < numCols; currentCol++) {

			// Find out the type of room at that cell
			let roomType = roomJson.rooms[currentRow][currentCol];

			// Generate the triangles for this specific block in the JSON
			let generatedTriangles = ROOM_CELL_TO_3D_BLOCK(roomJson, currentRow, currentCol, height, [0, 0, 0]);

			// If there are any triangles in the first place
			if (generatedTriangles.triangles.length != 0) {

				// If the type of room does not exist (this is because the type of room shares the same material information and
				// therefore must have separate room dictionaries for that exact reason. 
				if (triangleRoomTypeToIndex[roomType] == undefined) {
					console.log(roomType);

					// Upkeep the map of roomType to indices in the triangleSets
					triangleRoomTypeToIndex[roomType] = triangleSets.length;

					// Create a clone of the template, update the material appropriately, then finally push it to the triangleSets
					let newTriangleSet = structuredClone(TRIANGLE_SET_TEMPLATE);
					newTriangleSet = COLOR_3D_BLOCK(newTriangleSet, roomType);
					triangleSets.push(newTriangleSet);
					console.log(triangleRoomTypeToIndex);
				}

				let currentVertexLength = triangleSets[triangleRoomTypeToIndex[roomType]].vertices.length;

				triangleSets[triangleRoomTypeToIndex[roomType]].normals = triangleSets[triangleRoomTypeToIndex[roomType]].normals.concat(generatedTriangles.normals);
				triangleSets[triangleRoomTypeToIndex[roomType]].vertices = triangleSets[triangleRoomTypeToIndex[roomType]].vertices.concat(generatedTriangles.vertices);
				triangleSets[triangleRoomTypeToIndex[roomType]].uvs = triangleSets[triangleRoomTypeToIndex[roomType]].uvs.concat(generatedTriangles.uvs);

				generatedTriangles.triangles.map((triSet) => {
					triangleSets[triangleRoomTypeToIndex[roomType]].triangles.push([triSet[0] + currentVertexLength, triSet[1] + currentVertexLength, triSet[2] + currentVertexLength]);
				});
			}
		}
	}

	return triangleSets;

}


/**
 * This function should be provided the eye position and the four 3D points which define the 
 * frustrum. Then the rays from each eye to each point are caulcated. 
 * 
 * @param {vec3} eye The 3D vec3 position of the eyes
 * @param {vec3} tr The 3D vec3 position of the top right point
 * @param {vec3} tl The 3D vec3 position of the top left point
 * @param {vec3} bl The 3D vec3 position of the bottom left point
 * @param {vec3} br The 3D vec3 position of the bottom right point
 * 
 * @returns {{"eye": vec3, "topRightRay": vec3,"topLeftRay": vec3,"bottomLeftRay": vec3,"bottomRightRay": vec3}} Which is all needed to define the requested frustrum
 */
export function getFrustrum(eye, tr, tl, bl, br) {

	// Initialize template for return value
	let returnDictionary = {
		"eye": eye,
		"topRightRay": vec3.fromValues(0, 0, 0),
		"topLeftRay": vec3.fromValues(0, 0, 0),
		"bottomLeftRay": vec3.fromValues(0, 0, 0),
		"bottomRightRay": vec3.fromValues(0, 0, 0)
	}

	// Calculate and save the various rays
	returnDictionary.topRightRay = vec3.subtract(tr, eye);
	returnDictionary.topLeftRay = vec3.subtract(tl, eye);
	returnDictionary.bottomLeftRay = vec3.subtract(bl, eye);
	returnDictionary.bottomRightRay = vec3.subtract(br, eye);

	// Finally return
	return returnDictionary;
}

/**
 * This function returns whether it's the top right, top left, bottom left, or bottom right point
 */
export function getWhichPoint(centerPoint, checkingPoint, portalDirection) {
	// Ensure portal direction is in direction of center to point (not exactly, but on that polar side)
	if (vec3.dot(vec3.subtract(centerPoint, checkingPoint), portalDirection) > 0) {
		portalDirection = vec3.scale(portalDirection, -1.0);
	}

	if (checkingPoint[1] < centerPoint[1]) {
		let newRayCross = vec3.cross(vec3.subtract(centerPoint, checkingPoint), vec3.fromValues(0, 1, 0))
		if (vec3.dot(newRayCross, portalDirection) > 0) {
			return "br"
		} else {
			return "bl"
		}
	} else {
		let newRayCross = vec3.cross(vec3.subtract(centerPoint, checkingPoint), vec3.fromValues(0, 1, 0))
		if (vec3.dot(newRayCross, portalDirection) > 0) {
			return "tl"
		} else {
			return "tr"
		}
	}
}

export const NUM_PORTAL_POINTS = 8;

/**
 * 
 * 
 * @param {{"eye": vec3, "topRightRay": vec3,"topLeftRay": vec3,"bottomLeftRay": vec3,"bottomRightRay": vec3}} currentFrustrum The current viewing frustrum
 * @param {{"points": Array<vec3>, "directionOfPortal": Array<vec3>}} portal
 * 
 * @returns {{"eye": vec3, "topRightRay": vec3,"topLeftRay": vec3,"bottomLeftRay": vec3,"bottomRightRay": vec3}} Which is all needed to define the requested frustrum
 */
export function getPortalFrustrum(currentFrustrum, portal) {
	// Calculate the direction of the portal
	let normalizedDireciton = vec3.fromValues(0, 0, 0);
	vec3.normalize(normalizedDireciton, portal.directionOfPortal);

	// Calculate the central point of the portal points
	let sumPortalPoints = vec3.fromValues(0, 0, 0);
	let averagePortalPoints = vec3.fromValues(0, 0, 0);

	// Summate them
	for (let idx = 0; idx < NUM_PORTAL_POINTS; idx++) {
		vec3.add(sumPortalPoints, sumPortalPoints, portal.points[idx]);
	}

	// Calculate averaged point
	vec3.scale(averagePortalPoints, sumPortalPoints, 1.0 / NUM_PORTAL_POINTS);

	// Find vector from eye to the central point
	let eyeToCenter = vec3.fromValues(0, 0, 0);
	vec3.subtract(eyeToCenter, currentFrustrum.eye, averagePortalPoints);

	// We will be finding the front and back points, but this list will only contain the indices of those points
	let frontPoints = { "tr": null, "tl": null, "bl": null, "br": null };
	let backPoints = { "tr": null, "tl": null, "bl": null, "br": null };

	// Declare variable for future use saying whether the direction of portal and direction from eye to center is the same direction
	let sameDirection = -999;
	vec3.dot(sameDirection, eyeToCenter, normalizedDireciton);

	// Declare variable for future use saying whether the direction of portal and direction from eye to center is the same direction
	let portalPointDirection = -999;
	let vecFromPointToCenter = vec3.fromValues(0, 0, 0);

	// Iterate through all points, determine if they are in the front or the back
	for (let idx = 0; idx < NUM_PORTAL_POINTS; idx++) {
		vec3.subtract(vecFromPointToCenter, averagePortalPoints, portal.points[idx]);
		vec3.dot(portalPointDirection, normalizedDireciton, vecFromPointToCenter)
		let whichCorner = getWhichPoint(averagePortalPoints, portal.points[idx], normalizedDireciton);
		if (sameDirection >= 0) {
			if (portalPointDirection >= 0) {
				frontPoints[whichCorner] = idx;
			} else {
				backPoints[whichCorner] = idx;
			}
		} else {
			if (portalPointDirection >= 0) {
				backPoints[whichCorner] = idx;
			} else {
				frontPoints[whichCorner] = idx;
			}
		}
	}

	let finalFrustumPoints = { "tr": null, "tl": null, "bl": null, "br": null };
	let cosineOfAngleBetweenRayToCenterAndRayToEye = -1;
	let vecFromPointToEye = vec3.fromValues(0, 0, 0);
	vecFromPointToCenter = vec3.fromValues(0, 0, 0);

	// Essentially we project all of the points down to the y=0 plane and calculate if it is 45 degrees or below (to 0)
	Object.keys(backPoints).map((key) => {
		let projectedCenter = vec3.fromValues(averagePortalPoints[0], 0, averagePortalPoints[2]);
		let projectedEye = vec3.fromValues(currentFrustrum.eye[0], 0, currentFrustrum.eye[2]);
		let projectedBackPoint = vec3.fromValues(backPoints[key][0], 0, backPoints[key][2]);
		
		vec3.subtract(vecFromPointToEye, projectedEye, projectedBackPoint);
		vec3.subtract(vecFromPointToCenter, projectedCenter, projectedBackPoint);
		cosineOfAngleBetweenRayToCenterAndRayToEye = vec3.dot(vecFromPointToEye, vecFromPointToCenter) / (vec3.length(vecFromPointToEye) * vec3.length(vecFromPointToCenter));
		if (cosineOfAngleBetweenRayToCenterAndRayToEye <= (Math.PI / 4) && cosineOfAngleBetweenRayToCenterAndRayToEye >= 0) {
			finalFrustumPoints[key] = backPoints[key];
		} else {
			finalFrustumPoints[key] = frontPoints[key];
		}
	})
	
	return getFrustrum(currentFrustrum.eye, finalFrustumPoints.tr, finalFrustumPoints.tl, finalFrustumPoints.bl, finalFrustumPoints.br);
}

export function getPortalFrustrum2D(currentFrustrum, portal) {

}

/**
 *  {
   "material": {"ambient": [0.1,0.1,0.1], "diffuse": [0.0,0.6,0.0], "specular": [0.3,0.3,0.3], "n":15, "alpha": 1.0, "texture": "billie.jpg"}, 
   "vertices": [[0.65, 0.4, 0.45],[0.75, 0.6, 0.45],[0.85,0.4,0.45]],
   "normals": [[0, 0, -1],[0, 0,-1],[0, 0,-1]],
   "uvs": [[0,0], [0.5,1], [1,0]],
   "triangles": [[0,1,2]]
 }
 */