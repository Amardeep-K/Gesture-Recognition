import { Finger, FingerCurl, FingerDirection } from 'fingerpose';

import { GestureDescription } from 'fingerpose';  // Correct import


// describe 'A' gesture in ASL
const aDescription = new GestureDescription('A');

// thumb:
aDescription.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0); // Thumb is extended
aDescription.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0); // Thumb pointing straight up
aDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.5); // Slight tilt to the left
aDescription.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.5); // Slight tilt to the right

// index:
aDescription.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0); // Index curled fully
aDescription.addDirection(Finger.Index, FingerDirection.VerticalDown, 0.8); // Index pointed down inside the fist
aDescription.addDirection(Finger.Index, FingerDirection.HorizontalLeft, 0.3); // Index curled to the left
aDescription.addDirection(Finger.Index, FingerDirection.HorizontalRight, 0.3); // Index curled to the right

// middle:
aDescription.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0); // Middle curled fully
aDescription.addDirection(Finger.Middle, FingerDirection.VerticalDown, 0.8); // Middle pointed down inside the fist
aDescription.addDirection(Finger.Middle, FingerDirection.HorizontalLeft, 0.3); // Middle curled to the left
aDescription.addDirection(Finger.Middle, FingerDirection.HorizontalRight, 0.3); // Middle curled to the right

// ring:
aDescription.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0); // Ring curled fully
aDescription.addDirection(Finger.Ring, FingerDirection.VerticalDown, 0.8); // Ring pointed down inside the fist
aDescription.addDirection(Finger.Ring, FingerDirection.HorizontalLeft, 0.3); // Ring curled to the left
aDescription.addDirection(Finger.Ring, FingerDirection.HorizontalRight, 0.3); // Ring curled to the right

// pinky:
aDescription.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0); // Pinky curled fully
aDescription.addDirection(Finger.Pinky, FingerDirection.VerticalDown, 0.8); // Pinky pointed down inside the fist
aDescription.addDirection(Finger.Pinky, FingerDirection.HorizontalLeft, 0.3); // Pinky curled to the left
aDescription.addDirection(Finger.Pinky, FingerDirection.HorizontalRight, 0.3); // Pinky curled to the right

export default aDescription;
