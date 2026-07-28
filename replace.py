import sys
import re

with open("src/components/StudentFormDialog.tsx", "r") as f:
    content = f.read()

# Replace the DialogContent
start_marker = "<DialogContent dividers sx={{ py: 2.5 }}>"
end_marker = "</DialogContent>"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx) + len(end_marker)

replacement = """<DialogContent dividers sx={{ py: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <PhotoCaptureSection 
              imageUrl={imageUrl} 
              setImageUrl={setImageUrl} 
              studentName={studentName} 
              showCamera={showCamera} 
              startCamera={startCamera} 
              stopCameraStream={stopCameraStream} 
              capturePhoto={capturePhoto} 
              handleImageUpload={handleImageUpload} 
              videoRef={videoRef} 
              cameraError={cameraError} 
            />
            
            <Divider sx={{ my: 1, borderColor: "rgba(0,0,0,0.04)" }} />
            
            <GeneralInfoSection 
              studentName={studentName} setStudentName={setStudentName}
              rollNumber={rollNumber} setRollNumber={setRollNumber}
              profileId={profileId} setProfileId={setProfileId}
              classId={classId} setClassId={setClassId}
              boarderType={boarderType} setBoarderType={setBoarderType}
              gender={gender} setGender={setGender}
              classes={classes}
            />

            <Divider sx={{ my: 1, borderColor: "rgba(0,0,0,0.04)" }} />

            <FamilyInfoSection 
              fatherName={fatherName} setFatherName={setFatherName}
              motherName={motherName} setMotherName={setMotherName}
              phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
            />
          </Box>
        </DialogContent>"""

new_content = content[:start_idx] + replacement + content[end_idx:]

with open("src/components/StudentFormDialog.tsx", "w") as f:
    f.write(new_content)

print("Replaced!")
