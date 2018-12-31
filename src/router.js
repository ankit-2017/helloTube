import {createStackNavigator, createAppContainer } from 'react-navigation';

import Drive from './components/Drive';
import YoutubeVideo from './components/youtubeVideo';

export const Stack = createAppContainer(createStackNavigator({
    listPage: {
        screen: Drive,
        navigationOptions: {
            title: "youtube videos",
        }
    },
    youtubeVideo: {
        screen: YoutubeVideo,
        navigationOptions: {
            title: "Watch video"
        }
    }
}));