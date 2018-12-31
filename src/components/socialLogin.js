import React, {Component} from 'react';
import {Text, View, StyleSheet, AsyncStorage} from 'react-native';
import {Container, Content, Tabs, Tab, Header, TabHeading, Icon, Thumbnail} from 'native-base';
import {GoogleSignin, GoogleSigninButton, statusCodes} from 'react-native-google-signin'
import {googleConfig} from '../config/config';
import Home from './home';
import Drive from './Drive';
import {Stack} from '../router';
import {requestStoragePermission} from '../helpers/download'

class SocialLogin extends Component {
    constructor(props){
        super(props);
        this.state = {
            isSigninInProgress: false,
            userInfo: '',
            isSignedIn: false,
            userInfo1: ''
        }
    }
    isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        console.log('isSignedin', isSignedIn);
        this.setState({ isSignedIn });
      };
      saveUser = async (user) => {
        try {
          await AsyncStorage.setItem('userInfo', JSON.stringify(user));
        //   await AsyncStorage.setItem('scopes', JSON.stringify(scopes));
        } catch (error) {
          // Error retrieving data
          console.log('error in setting local data',error.message);
        }
      };

      getUserId = async () => {
        let user = '';
        try {
            user = await AsyncStorage.getItem('userInfo') || 'none';
        } catch (error) {
          // Error retrieving data
          console.log('error in getting local data',error.message);
        }
        return user;
      }

    componentWillMount(){
        requestStoragePermission();
        googleConfig();
        this.isSignedIn();
        const data = this.getUserId();
        data.then(result=>{
            if(result !== 'none'){
                // console.log('local data', JSON.parse(result));
                this.setState({userInfo: JSON.parse(result)});
            }   
        })
        .catch(error=>{
            console.log('error', error);
        })
        this.setState({userInfo1: data});
    }
    
signIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        this.saveUser(userInfo);
        this.setState({ userInfo: userInfo });
        this.isSignedIn();

        // console.log('user info', userInfo);
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('sign in cancell');
        } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
            console.log('in progress');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        } else {
        // some other error happened
        console.log('something went wrong');
        }
    }
    };
    updateState = async (isSignedIn) =>{
        this.setState({isSignedIn})
    }
    
    render(){
        // console.log('userInfo1 ', this.state.userInfo1)
        if(this.state.isSignedIn===true){
            return <Container style={style.Container}>
                        <Stack />
                        {/* <Tabs >
                            <Tab heading={<TabHeading style={{backgroundColor: "red"}} ><Icon size={15} color="#fff" name="logo-youtube" /><Text style={{marginLeft: 5, color: 'white'}}>Youtube Videos</Text></TabHeading>} >
                                <Stack />
                            </Tab>
                            <Tab heading={<TabHeading style={{backgroundColor: "red"}} ><Icon size={15} color="#fff" name="person" /><Text style={{marginLeft: 5, color: '#fff'}} >User</Text></TabHeading>} >
                                <Home 
                                userInfo ={this.state.userInfo}
                                updateState = {this.isSignedIn}
                                />
                            </Tab>
                            
                        </Tabs> */}
                        
                    </Container> 
            
        }else{
            return <Container style={style.googleButton}>
                        <Thumbnail large source={require('../assets/icon.png')} />
                        <GoogleSigninButton
                        style={{ width: 312, height: 70, marginTop: 30 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={this.signIn}
                        disabled={this.state.isSigninInProgress} />
                    </Container>
        } 
        
    }
}

const style= StyleSheet.create({
    Container: {
        flex: 1,
        
        // backgroundColor: '#002B36'
    },
    googleButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffe6e6"
    }
})

export default SocialLogin