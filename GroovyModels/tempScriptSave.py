import subprocess
import re
import bpy
import time
from mathutils import Vector

exe_path = r"C:\Users\Ethan\Documents\College\NCSU\CSC_561-562\CSC-562\GroovyModels\SkeletonBasics-D2D\SkeletonBasics.exe"

collection = bpy.data.collections["Spongebob"]
armature = list(collection.all_objects)[1]


#collection = bpy.data.collections["Spongebob"]

# Map from skeleton point to the bone whose tail the point represents.
# Exception for the head, it is the bone's head (the pont is no one's tail)
pointIdxToBone = {
    0: armature.data.edit_bones["HipTop"],
    1: armature.data.edit_bones["Torso"],
    2: armature.data.edit_bones["Head"],
    3: armature.data.edit_bones["Head"],
    4: armature.data.edit_bones["ShoulderLeft"],
    5: armature.data.edit_bones["ArmLeft"],
    6: armature.data.edit_bones["ForearmLeft"],
    7: armature.data.edit_bones["HandLeft"],
    8: armature.data.edit_bones["ShoulderRight"],
    9: armature.data.edit_bones["ArmRight"],
    10: armature.data.edit_bones["ForearmRight"],
    11: armature.data.edit_bones["HandRight"],
    12: armature.data.edit_bones["HipLeft"],
    13: armature.data.edit_bones["FemurLeft"],
    14: armature.data.edit_bones["ShinLeft"],
    15: armature.data.edit_bones["FootLeft"],
    16: armature.data.edit_bones["HipRight"],
    17: armature.data.edit_bones["FemurRight"],
    18: armature.data.edit_bones["ShinRight"],
    19: armature.data.edit_bones["FootRight"],
}

EXCEPTION_JOINT_IDX = 3

# because that is hardcoded index of object
#bones = list(list(collection.all_objects)[1].pose.bones)

process = subprocess.Popen(
    [exe_path],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    bufsize=1,
    universal_newlines=True
)

skeleton_data = {}
current_skeleton = None
startBoolean = True
loadedSkeletons = False

def process_output():
    global current_skeleton, skeleton_data, startBoolean, loadedSkeletons

    # Read multiple lines quickly, then pause
    for _ in range(10):
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            return None  # stop the timer if the process is done
        if output:
            line = output.strip()
            #print(f"Output: {line}")

            matchStart = re.match(r"NEW_FRAME", line)
            matchSkeleton = re.match(r"SkeletonNumber:(\d+)", line)

            if matchStart:
                #print("start")
                if startBoolean:
                    print("first")
                    startBoolean = False
                elif loadedSkeletons:
                    print("changing squares")
                    for idx, jointPoint in enumerate(skeleton_data[list(skeleton_data.keys())[0]]['positions']):
                        try:
                            bone = pointIdxToBone[idx]
                            
                            print(bone.head)
                            print(bone.tail)
                            
                            tail_pos = Vector(jointPoint)
                            
                            
                            if (idx == EXCEPTION_JOINT_IDX):
                                bone.head = tail_pos
                            else:
                                bone.tail = tail_pos
                            
                            
                            #obj.location = (x, z, y+1.0)
                            #obj.scale = (0.05, 0.05, 0.05)
                            
                            
                            #pose_bone_idx = bone_to_joint_index[obj.name]
                                    
                            # Each bone connects joint idx to idx + 1
                            #x1, y1, z1 = skeleton_data[list(skeleton_data.keys())[0]]['positions'][pose_bone_idx[0]]
                            #x2, y2, z2 = skeleton_data[list(skeleton_data.keys())[0]]['positions'][pose_bone_idx[1]]
                            

                            #head = (x1, z1, y1)  # Swap Y/Z
                            #tail = (x2, z2, y2)

                            # Move the bones in pose mode by repositioning head and tail indirectly
                            # This requires working in EDIT mode temporarily to set bone shape (not great for real-time)
                            # Instead, apply translation to pose bones

                            # Compute direction vector and midpoint
                            #mid = [(h + t) / 2 for h, t in zip(head, tail)]
                            #direction = [(t - h) for h, t in zip(head, tail)]

                            # You can use location or apply a matrix here
                            #pose_bone.location = mid  # Approximate position
                            # Optionally rotate bone to point from head to tail (advanced)
                            
                            # Direction vector from head to tail
                            #direction = Vector(tail) - Vector(head)
                            #direction.normalize()

                            # Blender bones point along +Y by default, so we align that to our direction
                            #target_axis = Vector((0, 1, 0))  # Local +Y

                            # Compute the rotation from +Y to our desired direction
                            #rotation = target_axis.rotation_difference(direction)

                            # Apply rotation in pose space
                            #pose_bone.rotation_mode = 'QUATERNION'
                            #pose_bone.rotation_quaternion = rotation
                            
                            #print(pose_bone)
                            #print(pose_bone.location)
                        except IndexError:
                            pass
                    bpy.context.view_layer.update()
                loadedSkeletons = False

            elif matchSkeleton:
                current_skeleton = int(matchSkeleton.group(1))
                skeleton_data[current_skeleton] = {
                    'tracking_state': None,
                    'positions': []
                }

            elif line.startswith("SkeletonTrackingState:") and current_skeleton is not None:
                state = int(line.split(":")[1])
                skeleton_data[current_skeleton]['tracking_state'] = state

            elif line.startswith("SkeletonPosition:(") and current_skeleton is not None:
                pos_match = re.match(r"SkeletonPosition:\(([-\d.]+),([-\d.]+),([-\d.]+)\)", line)
                if pos_match:
                    loadedSkeletons = True
                    x, y, z = map(float, pos_match.groups())
                    skeleton_data[current_skeleton]['positions'].append((x, y, z))

    # Keep calling this function every 0.1 seconds
    return 0.005

# Start the timer loop
bpy.app.timers.register(process_output)
