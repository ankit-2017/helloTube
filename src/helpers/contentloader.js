import React from 'react';
import ContentLoader from 'react-native-content-loader'
import {Circle, Rect} from 'react-native-svg'
import {View} from 'react-native'


export const Contentloader = () =>{
    const loaderData =[] 
    for (let index = 0; index < 4; index++) {
         loaderData.push(<View key={index} style={{marginTop: 10}}>
         <ContentLoader 
            rtl
            height={250}
            width={400}
            speed={1}
            primaryColor="#e9e6e6"
            secondaryColor="#dedbe0"
            >
        <Rect  x="10.23" y="-9.33" rx="0" ry="0" width="460" height="216.44" /> 
		<Circle cx="24.27" cy="231.71" r="13.04" /> 
		<Rect x="190.23" y="141.67" rx="0" ry="0" width="0" height="0" /> 
		<Rect x="50.23" y="226.67" rx="0" ry="0" width="335.17" height="12.87" />

        </ContentLoader>
        </View>)
    }
    return loaderData;
};