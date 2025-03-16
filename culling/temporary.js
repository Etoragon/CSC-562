
/**
 * Current work so far
 */

/**
 * For the topdown view for extra credit, for the portal culling, would it be smart to make it a 3D topdown viewer, or a 2D topdown viewer.
 */

function handleKeyUp(event) {

	if (currKeyName == event.code) {
		currKeyName = null;
	} else {
		return;
	}

	switch (event.code) {
		// view change
		case "W": // translate view left, rotate left with shift
			clearInterval(currentPressCode);
			break;
	}
}

var currentPressCode = null;
var currKeyName = null;

/**
 * This function acts as the controls for when keys are pressed. 
 * @param {KeyboardEvent} event the event when a keyboard button is pressed
 * @author Ethan Patten eppatten
 */
function handleKeyDown(event) {

	if (currKeyName == event.code) {
		return;
	}

	switch (keyPressCode) {
		case "W": // translate view left, rotate left with shift
			currentPressCode ? clearInterval(currentPressCode) : null;
			currKeyName = event.code
			currentPressCode = setInterval(() => { rotateModel(Up, dirEnum.POSITIVE); }, 33.333); //33.333 ms is 30 chars per second
	}
}




/**
 * Separate question, does light ever appear to wrap around an object, or would that be included in subsurface scattering?
 */