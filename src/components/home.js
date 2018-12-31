import React, {Component} from 'react';
import { Container, Thumbnail, Content } from 'native-base';
import {View, Text, StyleSheet, AsyncStorage} from 'react-native';
import {Card, Button} from 'react-native-elements'
import {GoogleSignin} from 'react-native-google-signin';


class Home extends Component {
    constructor(props){
        super(props);
    }

    deleteUser = async () => {
        try {
          await AsyncStorage.removeItem('userInfo');
        } catch (error) {
          // Error retrieving data
          console.log('error while removing user',error.message);
        }
      };
    signOut = async () => {
        console.log('in signout');
        try {
        //   await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          this.deleteUser() // Remember to remove the user from your app's state as well
          this.props.updateState();
        } catch (error) {
          console.error('error while signout',error);
        }
      };
    
    render(){
        console.log('this.props', this.props);
        const {userInfo} = this.props;
        return <Container > 
                    <Card 
                        // style={style.container}
                        title={userInfo ? userInfo.user.name: null} 
                    >
                        <View style={style.container}>
                            <Thumbnail large source={{uri: userInfo ? userInfo.user.photo: null}} />
                        </View>
                        <Text style={{marginTop: 10, textAlign: 'center'}}>
                            {userInfo ? userInfo.user.email: null}
                        </Text>
                        <Button
                        backgroundColor='#03A9F4'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginTop:20, marginRight: 0, marginBottom: 0}}
                        title='Sign out' 
                        onPress={()=> this.signOut()}
                        />
                    </Card>
        </Container>
    }
}

const style = StyleSheet.create({
    container: {
        justifyContent:'center',
        alignItems: 'center',
        backgroundColor: '#fff',

        
    }
})
export default Home