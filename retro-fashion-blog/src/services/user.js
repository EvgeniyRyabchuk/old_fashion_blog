import {db} from "@/firebase/config";


async function updateProfile(user, newName, newAvatarUrl) {
    if(user.isAdmin) {
        await db.collection("admins").doc(user.id).update({
            name: newName,
            avatar: newAvatarUrl
        });
    } else {
        await db.collection("users").doc(user.id).update({
            name: newName,
            avatar: newAvatarUrl
        });
    }

}

export {
    updateProfile
}