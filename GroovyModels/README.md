# Final Project 

The vision of my final project for CSC 462 was to connect live time data from the Xbox 360 Kinect and render that in blender.
In this file I will go through each of the percentages and describe how my program implemented them

# Getting the physical body to render from the Kinect (25%)

The goal of this bullet point was to get the data from the kinect, through the (very much outdated) Xbox 360 Kinect SDK. I had to make a large number of edits to the code to make it happen, which I have included the main file ran with the kinect in the submission.

# Getting the physical body to render *CONTINUOUSLY* from the Kinect (20%)
After extracting the data from the Kinect, I was able to continuously get the data from the kinect (obtain data, re-render). I will say, while the data was correct and it re-rendered, it only perfectly re-rendered in Edit Mode. In the Pose Mode I got data to re-render and it's somewhat accurate but there's a lot of curling. 

# Adding skinning, allowing an externally modeled character (open source) to be mapped to the detected skeleton (15%)

I added spongebob to the rig, and was able to move spongebob based on the rig itself. It was VERY cursed looking due to the curling issue. And unforunately when you rig a model to a skeleton in non-pose mode (the curling thing), spongebob doesn't update.

# Caustics, refraction, and reflection by adding walls which can be reflected off of /seen through by moving the camera (15%)

I was able to add glass and mirrored walls. Instead of moving the camera around the walls, I decided to move the walls and fix the camera.

# Add shadows of the rendered points from the kinect and possibly of the skinned objects. (10%)

There are shadows from all of the moving objects. In addition, since I wasn't able to connect the rig in the Hole-In-The-Wall map, I added the clouds (one was a Tourus) which has shadows. 

# Add ambient occluding of the selected walls onto the floor, floor onto the walls, and PHERAPS onto the skinned object (not sure if that's possible but it could be a stretch goal) (15%)

There was some ambient occluding with the video I showed in class, Dr. Watson noted that.