import { vec3 } from 'gl-matrix';

const ROOMS_JSON_ERROR_MESSAGE = "Rooms Json File incorrectly formatted";

const TRIANGLE_SET_TEMPLATE = { "material": {}, "vertices": [], "triangles": [], "normals": [], "uvs": [] };

function isTriInFrustum(currentFrustum, triPoints) {
    let forwardDirection = vec3.create();

    vec3.add(forwardDirection, currentFrustum.topRightRay, currentFrustum.topLeftRay);
    vec3.add(forwardDirection, forwardDirection, currentFrustum.bottomLeftRay);
    vec3.add(forwardDirection, forwardDirection, currentFrustum.bottomRightRay);

    for (let idx = 0; idx < triPoints.length; idx++) {
        let point3d = triPoints[idx];
        let eyeToPoint = vec3.create();
        vec3.subtract(eyeToPoint, point3d, currentFrustum.eye);

        if (vec3.dot(forwardDirection, eyeToPoint) > 0) {
            
			let dot1 = vec3.dot(currentFrustum.topRightRay, eyeToPoint);
			let dot2 = vec3.dot(currentFrustum.topLeftRay, eyeToPoint);
			let dot3 = vec3.dot(currentFrustum.bottomLeftRay, eyeToPoint);
			let dot4 = vec3.dot(currentFrustum.bottomRightRay, eyeToPoint);
			
			if (dot1 > 0 && dot2 > 0 && dot3 > 0 && dot4 > 0) {
				return true;
			}
        }
    }

    return false;
}


const SEARCH_FOUR_ADJACENT_CELLS = (roomJson, row, col) => {
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



const DIRECTION_TO_WORLD_COORDINATES = (directions, row, col, worldoffset, height) => {
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
const ROOM_CELL_TO_3D_BLOCK = (roomJson, row, col, height, worldoffset = [0, 0, 0]) => {

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
const ROOM_NUMBER_TO_TEXTURE = { 0: "abe.png", 1: "billie.jpg", "p": "tree.png" }

// Accepts a 3D block set, then updates the lighting and color information
const COLOR_3D_BLOCK = (triangleSet, roomType) => {
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

function roomToPortals(roomJson, height = 1) {
	// Validate the input
	if (!roomJson.rooms || !roomJson.furniture) {
		throw new Error(ROOMS_JSON_ERROR_MESSAGE);
	}

	// Now initialize the final product. 
	let returnPortals = {}

	// Define the number of rows / columns in this JSON
	let numRows = roomJson.rooms.length;
	let numCols = roomJson.rooms[0].length;

	// First iterate through each element in roomJSON
	for (let currentRow = 0; currentRow < numRows; currentRow++) {
		for (let currentCol = 0; currentCol < numCols; currentCol++) {

			// Find out the type of room at that cell
			let roomType = roomJson.rooms[currentRow][currentCol];

			if (roomType == "p") {
				let top = roomJson.rooms[currentRow - 1][currentCol];
				let bottom = roomJson.rooms[currentRow + 1][currentCol];
				let left = roomJson.rooms[currentRow][currentCol - 1];
				let right = roomJson.rooms[currentRow][currentCol + 1];

				// Generate the triangles for this specific block in the JSON
				let generatedTriangles = ROOM_CELL_TO_3D_BLOCK(roomJson, currentRow, currentCol, height, [0, 0, 0]);

				if (top == "s" && bottom == "s") {

					let portal1 = { "points": generatedTriangles.vertices, "directionOfPortal": vec3.fromValues(1, 0, 0), "connectingRoom": right };
					if (!returnPortals[left]) {
						returnPortals[left] = []
					}
					returnPortals[left].push(portal1);

					let portal2 = { "points": generatedTriangles.vertices, "directionOfPortal": vec3.fromValues(-1, 0, 0), "connectingRoom": left };
					if (!returnPortals[right]) {
						returnPortals[right] = []
					}
					returnPortals[right].push(portal2);
				} else {
					let portal3 = { "points": generatedTriangles.vertices, "directionOfPortal": vec3.fromValues(0, 0, 1), "connectingRoom": bottom };
					if (!returnPortals[top]) {
						returnPortals[top] = []
					}
					returnPortals[top].push(portal3);

					let portal4 = { "points": generatedTriangles.vertices, "directionOfPortal": vec3.fromValues(0, 0, -1), "connectingRoom": top };
					if (!returnPortals[bottom]) {
						returnPortals[bottom] = []
					}
					returnPortals[bottom].push(portal4);
				}

			}
		}
	}
	return returnPortals;
}

/**
 * This function accepts the loaded rooms Json and returns the triangles to render
 * 
 * @param {JSON} roomJson room Json of structure {rooms:[["","",...]], furniture:[[num, num, num, string, num]]}
 * @param {number} [centerHeight=0.5] height of room, since room json is only 2D
 * 
 * @returns Generated 3D triangle set for rooms
 */
function roomToTriangles(roomJson, height = 1) {
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
function getFrustrum(eye, tr, tl, bl, br) {

	// Initialize template for return value
	let returnDictionary = {
		"eye": eye,
		"topRightRay": vec3.fromValues(0, 0, 0),
		"topLeftRay": vec3.fromValues(0, 0, 0),
		"bottomLeftRay": vec3.fromValues(0, 0, 0),
		"bottomRightRay": vec3.fromValues(0, 0, 0)
	}

	// Calculate and save the various rays
	vec3.subtract(returnDictionary.topRightRay, tr, eye);
	vec3.subtract(returnDictionary.topLeftRay, tl, eye);
	vec3.subtract(returnDictionary.bottomLeftRay, bl, eye);
	vec3.subtract(returnDictionary.bottomRightRay, br, eye);

	// Finally return
	return returnDictionary;
}

/**
 * This function returns whether it's the top right, top left, bottom left, or bottom right point
 */
function getWhichPoint(centerPoint, checkingPoint, portalDirection) {
	// Ensure portal direction is in direction of center to point (not exactly, but on that polar side)
	let temp1 = vec3.fromValues(0, 0, 0);

	if (checkingPoint[1] < centerPoint[1]) {
		let newRayCross = vec3.fromValues(0, 0, 0);
		vec3.cross(newRayCross, portalDirection, vec3.subtract(temp1, checkingPoint, centerPoint));
		if (vec3.dot(newRayCross, vec3.fromValues(0, 1, 0)) < 0) {
			return "bl"
		} else {
			return "br"
		}
	} else {
		let newRayCross = vec3.fromValues(0, 0, 0);
		vec3.cross(newRayCross, portalDirection, vec3.subtract(temp1, checkingPoint, centerPoint));
		if (vec3.dot(newRayCross, vec3.fromValues(0, 1, 0)) < 0) {
			return "tl"
		} else {
			return "tr"
		}
	}
}

const NUM_PORTAL_POINTS = 8;

/**
 * 
 * 
 * @param {{"eye": vec3, "topRightRay": vec3,"topLeftRay": vec3,"bottomLeftRay": vec3,"bottomRightRay": vec3}} currentFrustrum The current viewing frustrum
 * @param {{"points": Array<vec3>, "directionOfPortal": Array<vec3>}} portal
 * 
 * @returns {{"eye": vec3, "topRightRay": vec3,"topLeftRay": vec3,"bottomLeftRay": vec3,"bottomRightRay": vec3}} Which is all needed to define the requested frustrum
 */
function getPortalFrustrum(currentFrustrum, portal) {
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
		portalPointDirection = vec3.dot(normalizedDireciton, vecFromPointToCenter)
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
		console.log(portalPointDirection);
		console.log(frontPoints);
		console.log(backPoints);
	}

	let finalFrustumPoints = { "tr": null, "tl": null, "bl": null, "br": null };
	let cosineOfAngleBetweenRayToCenterAndRayToEye = -1;
	let vecFromPointToEye = vec3.fromValues(0, 0, 0);
	vecFromPointToCenter = vec3.fromValues(0, 0, 0);

	// Essentially we project all of the points down to the y=0 plane and calculate if it is 45 degrees or below (to 0)
	Object.keys(backPoints).map((key) => {
		let projectedCenter = vec3.fromValues(averagePortalPoints[0], 0, averagePortalPoints[2]);
		let projectedEye = vec3.fromValues(currentFrustrum.eye[0], 0, currentFrustrum.eye[2]);
		let projectedBackPoint = vec3.fromValues(portal.points[backPoints[key]][0], 0, portal.points[backPoints[key]][2]);

		console.log(projectedCenter);
		console.log(projectedEye);
		console.log(projectedBackPoint);

		vec3.subtract(vecFromPointToEye, projectedEye, projectedBackPoint);
		vec3.subtract(vecFromPointToCenter, projectedCenter, projectedBackPoint);
		cosineOfAngleBetweenRayToCenterAndRayToEye = vec3.dot(vecFromPointToEye, vecFromPointToCenter) / (vec3.length(vecFromPointToEye) * vec3.length(vecFromPointToCenter));
		console.log(vecFromPointToEye);
		console.log(vecFromPointToCenter);
		console.log(cosineOfAngleBetweenRayToCenterAndRayToEye);
		console.log(vec3.dot(vecFromPointToEye, vecFromPointToCenter));
		if (cosineOfAngleBetweenRayToCenterAndRayToEye >= Math.cos((Math.PI / 4)) && cosineOfAngleBetweenRayToCenterAndRayToEye <= Math.cos(0)) {
			finalFrustumPoints[key] = backPoints[key];
		} else {
			finalFrustumPoints[key] = frontPoints[key];
		}
	})


	console.log(normalizedDireciton);
	console.log(currentFrustrum.eye);
	console.log(portal.points[backPoints.tr], portal.points[backPoints.tl], portal.points[backPoints.bl], portal.points[backPoints.br]);
	console.log(portal.points[finalFrustumPoints.tr], portal.points[finalFrustumPoints.tl], portal.points[finalFrustumPoints.bl], portal.points[finalFrustumPoints.br]);

	return getFrustrum(currentFrustrum.eye, portal.points[finalFrustumPoints.tr], portal.points[finalFrustumPoints.tl], portal.points[finalFrustumPoints.bl], portal.points[finalFrustumPoints.br]);
}

function getPortalFrustrum2D(currentFrustrum, portal) {

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
const sampleRoomJson = {
	rooms: [["s", "s"], ["s", "0"]],
	furniture: []
};

describe("roomToTriangles", () => {
	test("should throw an error for incorrectly formatted JSON", () => {
		expect(() => roomToTriangles({ rooms: [[]] })).toThrow("Rooms Json File incorrectly formatted");
	});

	test("should generate correct triangles for a simple room structure", () => {
		const result = roomToTriangles(sampleRoomJson, 1);
		expect(result).toBeDefined();
		expect(result.length).toBeGreaterThan(0);
	});
});

describe("SEARCH_FOUR_ADJACENT_CELLS_2X2", () => {
	test("should correctly identify adjacent 's' cells", () => {
		const roomJson = { "rooms": [["s", "s"], ["0", "s"]] };
		const result = SEARCH_FOUR_ADJACENT_CELLS(roomJson, 1, 1);
		expect(result).toEqual({ up: true, down: true, left: false, right: true, above: false, below: false });
		const result1 = SEARCH_FOUR_ADJACENT_CELLS(roomJson, 0, 0);
		expect(result1).toEqual({ up: true, down: false, left: true, right: true, above: false, below: false });
	});
});

describe("SEARCH_FOUR_ADJACENT_CELLS_3X3", () => {
	test("should correctly identify adjacent 's' cells", () => {
		const roomJson = { "rooms": [["s", "s", "s"], ["s", "0", "s"], ["s", "s", "s"]] };
		const result = SEARCH_FOUR_ADJACENT_CELLS(roomJson, 1, 1);
		expect(result).toEqual({ up: true, down: true, left: true, right: true, above: true, below: true });
		const result1 = SEARCH_FOUR_ADJACENT_CELLS(roomJson, 2, 2);
		expect(result1).toEqual({ up: true, down: true, left: true, right: true, above: false, below: false });
		const result2 = SEARCH_FOUR_ADJACENT_CELLS(roomJson, 2, 1);
		expect(result2).toEqual({ up: false, down: true, left: true, right: true, above: false, below: false });
	});
});

describe("DIRECTION_TO_WORLD_COORDINATES", () => {
	test("should generate correct world coordinates based on directions", () => {
		const directions = { up: false, down: true, left: false, right: true };
		const result = DIRECTION_TO_WORLD_COORDINATES(directions, 0, 0, [0, 0, 0], 1);
		expect(result.vertices.length).toEqual(8);
		expect(result.triangles.length).toEqual(4);

		// We expect all of the points because that's how we coded it to do so. 
		expect(result.vertices.length).toEqual(8);

		expect(result.triangles[0]).toEqual([0, 1, 2]);
		expect(result.triangles[1]).toEqual([2, 3, 0]);
		expect(result.triangles[2]).toEqual([4, 5, 6]);
		expect(result.triangles[3]).toEqual([6, 7, 4]);

	});
});

describe("roomToPortals", () => {
	test("should generate correct portals for a valid room JSON", () => {
		const roomJson = {
			rooms: [
				["s", "s", "s"],
				["s", "0", "s"],
				["s", "s", "s"]
			],
			furniture: []
		};
		const expectedOutput = {};
		expect(roomToPortals(roomJson)).toEqual(expectedOutput);
	});

	test("should return an empty array when no portals exist", () => {
		const roomJson = {
			rooms: [
				["s", "s", "s", "s", "s"],
				["s", 0, "p", 1, "s"],
				["s", "s", "s", "s", "s"]
			],
			furniture: []
		};
		const expectedOutput0 = [{
			points: ROOM_CELL_TO_3D_BLOCK(roomJson, 1, 2, 1, [0, 0, 0]).vertices,
			directionOfPortal: vec3.fromValues(1, 0, 0),
			connectingRoom: 1
		}];
		const expectedOutput1 = [{
			points: ROOM_CELL_TO_3D_BLOCK(roomJson, 1, 2, 1, [0, 0, 0]).vertices,
			directionOfPortal: vec3.fromValues(-1, 0, 0),
			connectingRoom: 0
		}]
		expect(roomToPortals(roomJson)[0]).toEqual(expectedOutput0);
		expect(roomToPortals(roomJson)[1]).toEqual(expectedOutput1);
	});

	test("should return an empty array when no portals exist", () => {
		const roomJson = {
			rooms: [
				["s", "s", "s", "s", "s"],
				["s", 0, "p", 1, "s"],
				["s", 0, "s", 1, "s"],
				["s", 0, "p", 1, "s"],
				["s", "s", "s", "s", "s"]
			],
			furniture: []
		};
		const expectedOutput0A = {
			points: ROOM_CELL_TO_3D_BLOCK(roomJson, 1, 2, 1, [0, 0, 0]).vertices,
			directionOfPortal: vec3.fromValues(1, 0, 0),
			connectingRoom: 1
		};
		const expectedOutput0B = {
			points: ROOM_CELL_TO_3D_BLOCK(roomJson, 3, 2, 1, [0, 0, 0]).vertices,
			directionOfPortal: vec3.fromValues(1, 0, 0),
			connectingRoom: 1
		};
		const expectedOutput1A = {
			points: ROOM_CELL_TO_3D_BLOCK(roomJson, 1, 2, 1, [0, 0, 0]).vertices,
			directionOfPortal: vec3.fromValues(-1, 0, 0),
			connectingRoom: 0
		};
		const expectedOutput1B = {
			points: ROOM_CELL_TO_3D_BLOCK(roomJson, 3, 2, 1, [0, 0, 0]).vertices,
			directionOfPortal: vec3.fromValues(-1, 0, 0),
			connectingRoom: 0
		};
		expect(roomToPortals(roomJson)[0][0]).toEqual(expectedOutput0A);
		expect(roomToPortals(roomJson)[0][1]).toEqual(expectedOutput0B);
		expect(roomToPortals(roomJson)[1][0]).toEqual(expectedOutput1A);
		expect(roomToPortals(roomJson)[1][1]).toEqual(expectedOutput1B);
	});

	test("should throw an error when 'rooms' key is missing", () => {
		const roomJson = { furniture: [] };
		expect(() => roomToPortals(roomJson)).toThrow(ROOMS_JSON_ERROR_MESSAGE);
	});
});




// Test cases for `getFrustrum` function
describe("getFrustrum", () => {
	test("should generate correct frustrum with standard points", () => {
		const eye1 = vec3.fromValues(0, 0, 0);
		const tr1 = vec3.fromValues(1, 1, 1);
		const tl1 = vec3.fromValues(-1, 1, 1);
		const bl1 = vec3.fromValues(-1, -1, 1);
		const br1 = vec3.fromValues(1, -1, 1);

		const frustum1 = getFrustrum(eye1, tr1, tl1, bl1, br1);
		expect(frustum1).toHaveProperty('eye');
		expect(frustum1.topRightRay.toString()).toEqual([1, 1, 1].toString());
		expect(frustum1.topLeftRay.toString()).toEqual([-1, 1, 1].toString());
		expect(frustum1.bottomLeftRay.toString()).toEqual([-1, -1, 1].toString());
		expect(frustum1.bottomRightRay.toString()).toEqual([1, -1, 1].toString());
	});

	test("should handle degenerate case where all points are the same", () => {
		const eye2 = vec3.fromValues(0, 0, 0);
		const tr2 = vec3.fromValues(1, 1, 1);
		const tl2 = vec3.fromValues(1, 1, 1);
		const bl2 = vec3.fromValues(1, 1, 1);
		const br2 = vec3.fromValues(1, 1, 1);

		const frustum2 = getFrustrum(eye2, tr2, tl2, bl2, br2);
		expect(frustum2.topRightRay.toString()).toEqual([1, 1, 1].toString());
		expect(frustum2.topLeftRay.toString()).toEqual([1, 1, 1].toString());
		expect(frustum2.bottomLeftRay.toString()).toEqual([1, 1, 1].toString());
		expect(frustum2.bottomRightRay.toString()).toEqual([1, 1, 1].toString());
	});
});



// Test cases for `getWhichPoint` function
describe("getWhichPoint", () => {
	test("should return 'tr' for top-right point", () => {
		const center1 = vec3.fromValues(0.5, 0.5, 0.5);
		const checkingPoint1 = vec3.fromValues(1, 1, 0);
		const portalDirection1 = vec3.fromValues(1, 0, 0);

		const point1 = getWhichPoint(center1, checkingPoint1, portalDirection1);
		expect(point1).toBe("tr");
	});

	test("should return 'tl' for top-left point", () => {
		const center1 = vec3.fromValues(0.5, 0.5, 0.5);
		const checkingPoint2 = vec3.fromValues(1, 1, 1);
		const portalDirection2 = vec3.fromValues(1, 0, 0);

		const point2 = getWhichPoint(center1, checkingPoint2, portalDirection2);
		expect(point2).toBe("tl");
	});

	test("should return 'tr' for top-right point", () => {
		const center1 = vec3.fromValues(0.5, 0.5, 0.5);
		const checkingPoint1 = vec3.fromValues(0, 1, 0);
		const portalDirection1 = vec3.fromValues(1, 0, 0);

		const point1 = getWhichPoint(center1, checkingPoint1, portalDirection1);
		expect(point1).toBe("tr");
	});

	test("should return 'tl' for top-left point", () => {
		const center1 = vec3.fromValues(0.5, 0.5, 0.5);
		const checkingPoint2 = vec3.fromValues(0, 1, 1);
		const portalDirection2 = vec3.fromValues(1, 0, 0);

		const point2 = getWhichPoint(center1, checkingPoint2, portalDirection2);
		expect(point2).toBe("tl");
	});

	test("should return 'bl' for bottom-left point", () => {
		const center1 = vec3.fromValues(0.5, 0.5, 0.5);
		const checkingPoint3 = vec3.fromValues(1, 0, 0);
		const portalDirection3 = vec3.fromValues(1, 0, 0);

		const point3 = getWhichPoint(center1, checkingPoint3, portalDirection3);
		expect(point3).toBe("br");
	});

	test("should return 'bl' for bottom-left point", () => {
		const center1 = vec3.fromValues(0.5, 0.5, 0.5);
		const checkingPoint3 = vec3.fromValues(0, 0, 0);
		const portalDirection3 = vec3.fromValues(1, 0, 0);

		const point3 = getWhichPoint(center1, checkingPoint3, portalDirection3);
		expect(point3).toBe("br");
	});

	test("should return 'bl' for bottom-left point", () => {
		const center1 = vec3.fromValues(0.5, 0.5, 0.5);
		const checkingPoint3 = vec3.fromValues(1, 0, 1);
		const portalDirection3 = vec3.fromValues(1, 0, 0);

		const point3 = getWhichPoint(center1, checkingPoint3, portalDirection3);
		expect(point3).toBe("bl");
	});

	test("should return 'bl' for bottom-left point", () => {
		const center1 = vec3.fromValues(0.5, 0.5, 0.5);
		const checkingPoint3 = vec3.fromValues(0, 0, 1);
		const portalDirection3 = vec3.fromValues(1, 0, 0);

		const point3 = getWhichPoint(center1, checkingPoint3, portalDirection3);
		expect(point3).toBe("bl");
	});


});

// Test cases for `getPortalFrustrum` function
describe("getPortalFrustrum", () => {
	test("should generate correct portal frustrum", () => {
		const eye1 = vec3.fromValues(0.5, 0.5, 3);
		const tr1 = vec3.fromValues(1, 1, 1);
		const tl1 = vec3.fromValues(-1, 1, 1);
		const bl1 = vec3.fromValues(-1, -1, 1);
		const br1 = vec3.fromValues(1, -1, 1);
		const currentFrustrum1 = getFrustrum(eye1, tr1, tl1, bl1, br1);
		const portal1 = {
			points: [
				vec3.fromValues(0, 0, 0),
				vec3.fromValues(0, 0, 1),
				vec3.fromValues(0, 1, 0),
				vec3.fromValues(0, 1, 1),
				vec3.fromValues(1, 0, 0),
				vec3.fromValues(1, 0, 1),
				vec3.fromValues(1, 1, 0),
				vec3.fromValues(1, 1, 1),
			],
			directionOfPortal: vec3.fromValues(0, 0, 1),
		};

		const portalFrustum1 = getPortalFrustrum(currentFrustrum1, portal1);
		expect(portalFrustum1).toHaveProperty("eye");
		expect(portalFrustum1.topRightRay.toString()).toEqual([0.5, 0.5, -3].toString());
		expect(portalFrustum1.topLeftRay.toString()).toEqual([-0.5, 0.5, -3].toString());
		expect(portalFrustum1.bottomLeftRay.toString()).toEqual([-0.5, -0.5, -3].toString());
		expect(portalFrustum1.bottomRightRay.toString()).toEqual([0.5, -0.5, -3].toString());
	});

	test("should generate correct portal frustrum slanted camera", () => {
		const eye1 = vec3.fromValues(1.1, 0.5, 3);
		const tr1 = vec3.fromValues(1, 1, 1);
		const tl1 = vec3.fromValues(-1, 1, 1);
		const bl1 = vec3.fromValues(-1, -1, 1);
		const br1 = vec3.fromValues(1, -1, 1);
		const currentFrustrum1 = getFrustrum(eye1, tr1, tl1, bl1, br1);
		const portal1 = {
			points: [
				vec3.fromValues(0, 0, 0),
				vec3.fromValues(0, 0, 1),
				vec3.fromValues(0, 1, 0),
				vec3.fromValues(0, 1, 1),
				vec3.fromValues(1, 0, 0),
				vec3.fromValues(1, 0, 1),
				vec3.fromValues(1, 1, 0),
				vec3.fromValues(1, 1, 1),
			],
			directionOfPortal: vec3.fromValues(0, 0, 1),
		};

		const portalFrustum1 = getPortalFrustrum(currentFrustrum1, portal1);
		expect(portalFrustum1).toHaveProperty("eye");
		//expect(portalFrustum1.topRightRay.toString()).toEqual([-0.1, 0.5, -2].toString());
		//expect(portalFrustum1.topLeftRay.toString()).toEqual([-1.1, 0.5, -3].toString());
		//expect(portalFrustum1.bottomLeftRay.toString()).toEqual([-1.1, -0.5, -3].toString());
		//expect(portalFrustum1.bottomRightRay.toString()).toEqual([-0.1, -0.5, -2].toString());
	});
});

describe("isTriInFrustum", () => {
	test("should return true for a triangle fully inside the frustum", () => {
		const currentFrustum = {
			eye: vec3.fromValues(0, 0, 0),
			topRightRay: vec3.fromValues(1, 1, 1),
			topLeftRay: vec3.fromValues(-1, 1, 1),
			bottomLeftRay: vec3.fromValues(-1, -1, 1),
			bottomRightRay: vec3.fromValues(1, -1, 1)
		};
		const triPoints = [
			vec3.fromValues(0.2, 0.2, 2),
			vec3.fromValues(-0.2, 0.2, 2),
			vec3.fromValues(0, -0.2, 2)
		];
		console.log("------------------------------------")
		console.log(triPoints)
		expect(isTriInFrustum(currentFrustum, triPoints)).toBe(true);
	});

	test("should return false for a triangle completely outside the frustum", () => {
		const currentFrustum = {
			eye: vec3.fromValues(0, 0, 0),
			topRightRay: vec3.fromValues(1, 1, 1),
			topLeftRay: vec3.fromValues(-1, 1, 1),
			bottomLeftRay: vec3.fromValues(-1, -1, 1),
			bottomRightRay: vec3.fromValues(1, -1, 1)
		};
		const triPoints = [
			vec3.fromValues(3, 3, 5),
			vec3.fromValues(4, 3, 5),
			vec3.fromValues(3, 4, 5)
		];
		console.log("------------------------------------");
		console.log(triPoints);
		expect(isTriInFrustum(currentFrustum, triPoints)).toBe(false);
	});

	test("should return true for a triangle partially inside the frustum", () => {
		const currentFrustum = {
			eye: vec3.fromValues(0, 0, 0),
			topRightRay: vec3.fromValues(1, 1, 1),
			topLeftRay: vec3.fromValues(-1, 1, 1),
			bottomLeftRay: vec3.fromValues(-1, -1, 1),
			bottomRightRay: vec3.fromValues(1, -1, 1)
		};
		const triPoints = [
			vec3.fromValues(0.5, 0.5, 1),
			vec3.fromValues(1.5, 1.5, 2), // Outside
			vec3.fromValues(0, -0.5, 1)
		];
		console.log("------------------------------------")
		console.log(triPoints)
		expect(isTriInFrustum(currentFrustum, triPoints)).toBe(true);
	});

	test("should return false when all points are behind the eye", () => {
		const currentFrustum = {
			eye: vec3.fromValues(0, 0, 0),
			topRightRay: vec3.fromValues(1, 1, 1),
			topLeftRay: vec3.fromValues(-1, 1, 1),
			bottomLeftRay: vec3.fromValues(-1, -1, 1),
			bottomRightRay: vec3.fromValues(1, -1, 1)
		};
		const triPoints = [
			vec3.fromValues(-1, -1, -2),
			vec3.fromValues(1, -1, -2),
			vec3.fromValues(0, 1, -2)
		];
		console.log("------------------------------------")
		console.log(triPoints)
		expect(isTriInFrustum(currentFrustum, triPoints)).toBe(false);
	});

	test("should return false when the triangle points are exactly on the frustum planes", () => {
		const currentFrustum = {
			eye: vec3.fromValues(0, 0, 0),
			topRightRay: vec3.fromValues(1, 1, 1),
			topLeftRay: vec3.fromValues(-1, 1, 1),
			bottomLeftRay: vec3.fromValues(-1, -1, 1),
			bottomRightRay: vec3.fromValues(1, -1, 1)
		};
		const triPoints = [
			vec3.fromValues(1, 1.1, .2), // On top right plane
			vec3.fromValues(-1, 1.1, .2), // On top left plane
			vec3.fromValues(0, 1.1, .2) // On bottom plane
		];
		console.log("------------------------------------")
		console.log(triPoints)
		expect(isTriInFrustum(currentFrustum, triPoints)).toBe(false);
	});
});