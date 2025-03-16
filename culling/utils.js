
const ROOMS_JSON_ERROR_MESSAGE = "Rooms Json File incorrectly formatted"


const SEARCH_FOUR_ADJACENT_CELLS = (roomJson, row, col) => {
	let returnDictionary = {
		"up": row == 0,
		"down": row == roomJson.length - 1,
		"left": col == 0,
		"right": col == roomJson[row].length - 1
	}

	// Iterate through all directions, check to make sure each direction is not 
	// beyond the bounds of the map, then check and save if that cell is "s"
	Object.keys(returnDictionary).map((key) => {

		// If not already disqualified from previous bounds check
		if (!returnDictionary[key]) {

			// The key indicates the direciton
			switch (key) {
				case ("up"):
					returnDictionary[key] = (roomJson[row - 1][col] == "s");
					break;
				case ("down"):
					returnDictionary[key] = (roomJson[row + 1][col] == "s");
					break;
				case ("left"):
					returnDictionary[key] = (roomJson[row][col - 1] == "s");
					break;
				case ("right"):
					returnDictionary[key] = (roomJson[row][col + 1] == "s");
					break;
			}
		}
	})

	// Finally return the adjacent cell search
	return returnDictionary;
}



const DIRECTION_TO_WORLD_COORDINATES = (directions, row, col, worldoffset, height) => {
	// Initialize the return object
	let trianglesAndVertices = { "vertices": [], "triangles": [], "normals": [] };

	// Calculate the offset of the center coordiantes (local to global essentially)
	let centerX = col + 0.5 + worldoffset[0];
	let centerY = row + 0.5 + worldoffset[1];
	let centerZ = height / 2 + worldoffset[2];

	// Go ahead and add all the coordinates
	trianglesAndVertices.vertices.push([centerX + 0.5, centerY - 0.5, centerZ - height / 2]);
	trianglesAndVertices.vertices.push([centerX - 0.5, centerY - 0.5, centerZ - height / 2]);
	trianglesAndVertices.vertices.push([centerX + 0.5, centerY - 0.5, centerZ + height / 2]);
	trianglesAndVertices.vertices.push([centerX - 0.5, centerY - 0.5, centerZ + height / 2]);
	
	trianglesAndVertices.vertices.push([centerX + 0.5, centerY + 0.5, centerZ - height / 2]);
	trianglesAndVertices.vertices.push([centerX - 0.5, centerY + 0.5, centerZ - height / 2]);
	trianglesAndVertices.vertices.push([centerX + 0.5, centerY + 0.5, centerZ + height / 2]);
	trianglesAndVertices.vertices.push([centerX - 0.5, centerY + 0.5, centerZ + height / 2]);

	// Iterate through the directions
	Object.keys(directions).map((key) => {
		// If they should have a wall ("s" detected previously)
		if (directions[key]) {
			switch (key) {
				case ("up"):
					trianglesAndVertices.normals.push([0, 1, 0]);
					trianglesAndVertices.normals.push([0, 1, 0]);
					trianglesAndVertices.triangles.concat([[0, 1, 2], [2, 3, 0]]);
					break;
				case ("down"):
					trianglesAndVertices.normals.push([0, -1, 0]);
					trianglesAndVertices.normals.push([0, -1, 0]);
					trianglesAndVertices.triangles.concat([[4, 5, 6], [6, 7, 4]]);
					break;
				case ("left"):
					trianglesAndVertices.normals.push([1, 0, 0]);
					trianglesAndVertices.normals.push([1, 0, 0]);
					trianglesAndVertices.triangles.concat([[1, 3, 5], [5, 7, 1]]);
					break;
				case ("right"):
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.normals.push([-1, 0, 0]);
					trianglesAndVertices.triangles.concat([[0, 2, 4], [4, 6, 0]]);
					break;
			}
		}
	})

	// Finally after adding the walls, add the ceiling and floor


	// Return triangles with triangles, vertices, and normals completed.
	return trianglesAndVertices;
}

/**
 * This constant accepts the json, row, col, and worldoffset to produce the set of triangles for a block
 */
const ROOM_CELL_TO_3D_BLOCK = (roomJson, row, col, height, worldoffset = [0, 0, 0]) => {

	// Save the current cell type
	let cellType = roomJson[row][col];

	// Initialize the triangles and cells
	let surroundingCells = {};
	let triangleSetReturn = {};

	// "s" doesn't need to check, only p and numbers (for each room type)
	switch (cellType) {
		case "s":
			return {};
		default:
			surroundingCells = SEARCH_FOUR_ADJACENT_CELLS(roomJson, row, col);
			triangleSetReturn = DIRECTION_TO_WORLD_COORDINATES(surroundingCells, row, col, worldoffset, height);
			break;
	}

	// With all of it calculated, return the triangle set
	return triangleSetReturn;
}

// This determine the different textures per room
const ROOM_NUMBER_TO_TEXTURE = { 0: "someTexturePath", 1: "someTexturePath2" }

// Accepts a 3D block set, then updates the lighting and color information
const COLOR_3D_BLOCK = (triangleSet, roomType) => {

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
export function roomToTriangles(roomJson, centerHeight = 0.5) {
	// Validate the input
	if (!roomJson.rooms || !roomJson.furniture) {
		throw new Error(ROOMS_JSON_ERROR_MESSAGE);
	}

	// Otherwise continue with the function 

}