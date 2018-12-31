import React, {Component} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet, RefreshControl} from 'react-native';
import {Card, Button, SearchBar} from 'react-native-elements'
import { Container, Thumbnail } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import {Contentloader} from '../helpers/contentloader'
import {numberFormat} from '../helpers/numberFormat'
const apiKey = 'AIzaSyCwjY8Rk7ysaEY1uGOrTmvEVaQsVbEJ7n4';
const results = 20;



class Drive extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            videoId: [],
            newList:[],
            ChannelId: [],
            channelThumnail: []

        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.fetchYoutube();
        // In actual case set refreshing to false when whatever is being refreshed is done!
        setTimeout(() => {
          this.setState({ refreshing: false });
        }, 2000);
      };

    fetchYoutube = () =>{
        fetch(`https://www.googleapis.com/youtube/v3/videos/?key=${apiKey}&chart=mostPopular&hl=hi&type=video&regionCode=IN&part=snippet,id&order=rating&maxResults=${results}`)
        .then(res=> res.json())
        .then(res=>{
            // console.log('response', res);
            const popular =[]
            const videoId = []
            res.items.forEach(item =>{
                popular.push(item);
                videoId.push(item.id.videoId || item.id)
                // ChannelId.push(item.snippet.channelId)
            })
            this.setState({data: popular});
            this.setState({videoId})
            // this.setState({ChannelId})
            this.getView();
            
            
        })
        .catch(error =>{
            console.log('error while fetching data', error);
        })
    }


    getView =() =>{
        const self = this;
        // console.log('videoid', this.state.videoId);
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${this.state.videoId}&key=${apiKey}`)
        .then(res=>res.json())
        .then(res =>{
            // console.log('video response', res);
            // console.log('channel thumb', self.state.channelThumnail);
            const viewCount = []
            res.items.map((view, i)=>{
                const newData1 = Object.assign([], {viewcount: numberFormat(view.statistics.viewCount), comment: view.statistics.commentCount}, 
                {alldata: self.state.data[i]});
                viewCount.push(newData1)
            })
            self.setState({newList: viewCount});
        })
    }
    
    componentDidMount(){
        this.fetchYoutube();
        
    }
    
    searchYoutube = (e) =>{
        if(e !== ''){
        fetch(`https://www.googleapis.com/youtube/v3/search/?key=${apiKey}&q=${e}&type=video&part=snippet,id&order=relevance&maxResults=${results}`)
        .then(res=> res.json())
        .then(res=>{
            // console.log('response search', res);
            const videoId =[]
            const Items =[]
            // const ChannelId =[]
            res.items.forEach(item =>{
                Items.push(item);
                videoId.push(item.id.videoId || item.id)
                // ChannelId.push(item.snippet.channelId)

            })
            this.setState({data: Items});
            this.setState({videoId})
            // this.setState({ChannelId})
            this.getView();
        })
        .catch(error =>{
            console.log('error while fetching data', error);
        })
    }else{
        this.fetchYoutube();
    }
    }
    

    render(){
        // console.log('new list', this.state.newList);
        return <Container style={{flex: 1}}>
                <View  >
                    <SearchBar
                    lightTheme
                    round
                    searchIcon={{ size: 24 }}
                    onChangeText={(e)=>this.searchYoutube(e)}
                    // onClear={}
                    platform="android"
                    placeholder='Search youtube videos' 
                    />
                </View>

            <ScrollView
            refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={()=>this.onRefresh()}
                  title="Pull to refresh"
                />
              } 
             >
                {this.state.newList.length < 1?
                    <Contentloader />
                 :
                 this.state.newList.length > 1 && this.state.newList.map((item, i)=>(
                    <TouchableWithoutFeedback key={i}
                    onPress={()=> this.props.navigation.navigate("youtubeVideo", {youtubeId: item.alldata.id.videoId || item.alldata.id})}
                    >
                        <Card 
                        key={i} 
                        image={{uri :item.alldata.snippet.thumbnails.high.url}}
                        imageStyle={{height:170}}
                        >
                        <View>
                            {/* <Thumbnail small source={{uri: item.channelInfo? item.channelInfo.url:'' }} /> */}
                            <Text style={{fontSize: 16, fontWeight: "400"}}>{item.alldata.snippet.title}</Text>
                            <Text>{item.viewcount} views &nbsp; {item.comment} comments</Text>
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}} >
                            <Text>{item.alldata.snippet.channelTitle}</Text>
                        </View>

                        </Card>
                    </TouchableWithoutFeedback>
                ))}
            </ScrollView>
  
        </Container>
    }
}
const style= StyleSheet.create({
    searchView : {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    }
})
export default Drive;