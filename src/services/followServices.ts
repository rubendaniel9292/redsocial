
import follow from '../models/follow';
import { Types } from 'mongoose';
//usuario seguidos por mi (usuario identificado)
export const followsUsersId = async (identytUserId: any) => {
    try {
        //sacar info de seguimiento
        //consulta de usuario que estoy siguiendo como usuario identificado
        let following = await follow.find({ 'user': identytUserId })
            .select({ 'followed': 1, '_id': 0 });
        //consulta de usuario que me siguen como usuario identificado
        let followers = await follow.find({ 'followed': identytUserId })//usuario identificado
            .select({ 'user': 1, '_id': 0 });
        //procesar array de de identificadores para limpiarlos
        let followingClean: (Types.ObjectId | null | undefined)[] = [];

        following.forEach(follow => {
            followingClean.push(follow.followed)
        });

        let followersClean: (Types.ObjectId | null | undefined)[] = [];

        followers.forEach(follow => {
            followersClean.push(follow.user)
        });
        

        return { following: followingClean, followers: followersClean };


    } catch (error) {
        console.error('Error en followsUsersId:', error);
        return false
    }
}

export const followThisUser = async (identityUserId: any, profileUserId: any) => {
    try {
        //comprobar si un usuario me sige y si yo lo sigo
        //sacar info de seguimiento
        //consulta de usuario que estoy siguiendo como usuario identificado

        //saber si yo como usuario lo sigo 
        let following = await follow.findOne({ 'user': identityUserId, 'followed': profileUserId });

        //consulta de usuario saber si me sigue a mi
        let followers = await follow.findOne({ 'user': profileUserId, 'followed': identityUserId });//usuario identificado

        return { following, followers };

    }
    catch (error) {
        return false
    }

}