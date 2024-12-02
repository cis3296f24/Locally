import { 
    registerFollowMasterID, 
    registerFollowerID, 
    postFollowingID, 
    unfollowMasterID, 
    updateFollowersList, 
    getFollowMaster, 
    deleteFollowMaster, 
    registerIndieID,
    unregisterIndieDevice
} from 'native-notify';
import axios from 'axios';
import { useState } from 'react';

export interface PushNotificationData {
    title: string;
    message: string;
    // pushData?: Record<string, unknown>;
};

const useNativeNotify = () => {
    const appId = 25151; 
    const appToken = 'bdWU0reHJ0TDNushqXwyuJ';

    const [registeredUserId, setRegisteredUserId] = useState<string | null>(null); // Track registered user ID

    /**
     * Registers a device for a specific user.
     * @param userId Unique user ID.
     */
    const registerDevice = (userId: string): void => {
        try {
            // Native Notify Indie Push Registration Code
            registerIndieID(userId, appId, appToken);
            setRegisteredUserId(userId);
            console.log(`Device registered for user: ${userId}`);
        } catch (error) {
            console.error('Error registering device:', error);
        }
    };

    /**
     * Unregisters a device for a specific user (logout functionality).
     * @param userId Unique user ID.
     */
    const unregisterDevice = (userId: string): void => {
        try {
            // Native Notify Indie Push Unregister Code
            unregisterIndieDevice(userId, appId, appToken);
            setRegisteredUserId(null);
            console.log(`Device unregistered for user: ${userId}`);
        } catch (error) {
            console.error('Error unregistering device:', error);
        }
    };

    /**
     * Registers a Follow Master.
     * @param masterId Unique ID for the Follow Master.
     */
    const registerFollowMaster = (masterId: string): void => {
        try {
            registerFollowMasterID(masterId, appId, appToken);
            console.log(`Follow Master registered: ${masterId}`);
        } catch (error) {
            console.error('Error registering Follow Master:', error);
        }
    };

    /**
     * Registers a Follower.
     * @param masterId Follow Master ID.
     * @param followerId Follower ID.
     */
    const registerFollower = (masterId: string, followerId: string): void => {
        try {
            registerFollowerID(masterId, followerId, appId, appToken);
            console.log(`Follower registered: ${followerId} following ${masterId}`);
        } catch (error) {
            console.error('Error registering Follower:', error);
        }
    };

    /**
     * Sends a Follow Push Notification.
     * @param masterId Follow Master ID.
     * @param notification Notification data including title, message, and optional push data.
     */
    const sendFollowNotification = async (
        masterId: string,
        title: string,
        message: string,
        pushData?: Record<string, unknown>
    ): Promise<void> => {
        try {
            await axios.post('https://app.nativenotify.com/api/follow/notification', {
                masterSubID: masterId,
                appId,
                appToken,
                title: title,
                message: message,
                pushData: pushData,
            });
            const data = getFollowMasterInfo(masterId);
            console.log('Notification data:', data);
            console.log(`Notification sent to followers of Master ID: ${masterId}`);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    /**
     * Gets a Follow Master's information.
     * @param masterId Follow Master ID.
     * @returns Follow Master data object.
     */
    const getFollowMasterInfo = (masterId: string): unknown => {
        try {
            const followMasterData = getFollowMaster(masterId, appId, appToken);
            console.log(`Follow Master data fetched for ID: ${masterId}`);
            return followMasterData;
        } catch (error) {
            console.error('Error fetching Follow Master information:', error);
        }
    };

    /**
     * Adds a user to a Follow Master's Following List.
     * @param masterId Follow Master ID.
     * @param followingId User ID to be added to the Following List.
     */
    const addToFollowingList = (masterId: string, followingId: string): void => {
        try {
            postFollowingID(masterId, followingId, appId, appToken);
            console.log(`User ${followingId} added to ${masterId}'s Following List`);
        } catch (error) {
            console.error('Error adding to Following List:', error);
        }
    };

    /**
     * Unfollows a Follow Master.
     * @param masterId Follow Master ID.
     * @param followerId Follower ID.
     */
    const unfollowMaster = (masterId: string, followerId: string): void => {
        try {
            unfollowMasterID(masterId, followerId, appId, appToken);
            console.log(`Follower ${followerId} unfollowed Master ${masterId}`);
        } catch (error) {
            console.error('Error unfollowing Master:', error);
        }
    };

    /**
     * Removes a user from a Follow Master's Following List.
     * @param masterId Follow Master ID.
     * @param removedId User ID to be removed from the Following List.
     */
    const removeFromFollowingList = (masterId: string, removedId: string): void => {
        try {
            updateFollowersList(masterId, removedId, appId, appToken);
            console.log(`User ${removedId} removed from ${masterId}'s Following List`);
        } catch (error) {
            console.error('Error removing from Following List:', error);
        }
    };

    /**
     * Deletes or unregisters a Follow Master.
     * @param masterId Follow Master ID to be deleted.
     */
    const deleteFollowMasterById = (masterId: string): void => {
        try {
            deleteFollowMaster(appId, appToken, masterId);
            console.log(`Follow Master deleted: ${masterId}`);
        } catch (error) {
            console.error('Error deleting Follow Master:', error);
        }
    };

    return {
        registerDevice,
        unregisterDevice,
        registerFollowMaster,
        registerFollower,
        sendFollowNotification,
        getFollowMasterInfo,
        addToFollowingList,
        unfollowMaster,
        removeFromFollowingList,
        deleteFollowMasterById,
    };
};

export default useNativeNotify;
