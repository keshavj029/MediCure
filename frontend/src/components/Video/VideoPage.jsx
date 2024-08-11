import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { APP_ID, SERVER_SECRET } from './constant';
import './VideoPage.css';

const VideoPage = () => {
    const { id } = useParams();
    const roomID = id;
    const videoContainerRef = useRef(null);

    useEffect(() => {
        const initializeMeeting = async () => {
            const appID = APP_ID;
            const serverSecret = SERVER_SECRET;
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), "roshni");
            const zp = ZegoUIKitPrebuilt.create(kitToken);

            zp.joinRoom({
                container: videoContainerRef.current,
                sharedLinks: [
                    {
                        name: 'Copy link',
                        url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
                    },
                ],
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall,
                },
            });
        };

        initializeMeeting();
    }, [roomID]);

    return (
        <div className="video-page">
            <header className="video-header">
                <h1>Video Call</h1>
            </header>
            <main className="video-container" ref={videoContainerRef}></main>
        </div>
    );
};

export default VideoPage;
