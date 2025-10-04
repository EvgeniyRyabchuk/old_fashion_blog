
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");
const displayNameInput = document.getElementById("displayName");
const saveBtn = document.getElementById("saveProfileBtn");
const defaultImg = "../../images/no-image.png"

// Preview avatar on file select
avatarInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    avatarPreview.src = URL.createObjectURL(file);
  }
});

async function updateProfile(uid, newName, newAvatarUrl, isAdmin) {
    if(isAdmin) {
        await db.collection("admins").doc(uid).update({
            name: newName,
            avatar: newAvatarUrl
        });
    } else {
        await db.collection("users").doc(uid).update({
            name: newName,
            avatar: newAvatarUrl
        });
    }

}

// Save profile
saveBtn.addEventListener("click", async () => {
  const user = firebase.auth().currentUser;
  if (!user) return alert("Not logged in");

  const newName = displayNameInput.value;
  const file = avatarInput.files[0];

  try {
    if (file) {
      const {data: additionUserInfo, isAdmin} = await getUserAddition(user.uid); 
      avatarUrl = await loadToCloudinary(file); 
      await updateProfile(user.uid, newName, avatarUrl, isAdmin);       
    }
    alert("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Error updating profile: " + err.message);
  }
});

// Load current user data
firebase.auth().onAuthStateChanged( async (user) => {
  if (user) {
    const {data: additionUserInfo, isAdmin} = await getUserAddition(user.uid);
    displayNameInput.value = additionUserInfo.name || ""; 
    avatarPreview.src = additionUserInfo.avatar || defaultImg;
  }
});
