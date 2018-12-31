import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet, PixelRatio, TouchableHighlight, ActivityIndicator} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import YouTube from 'react-native-youtube';
import Orientation from 'react-native-orientation';
import { Container } from 'native-base';
import {formatView} from '../helpers/numberFormat';
import {Grid, Row, Col} from 'react-native-easy-grid'
// import {Icon} from 'react-native-vector-icons/AntDesign'
import {downloadFile, requestStoragePermission, byteFormate, downloadMp3} from '../helpers/download';
import axios from 'axios';

const apiKey = 'AIzaSyCwjY8Rk7ysaEY1uGOrTmvEVaQsVbEJ7n4';

class YoutubeVideo extends Component {
    constructor(props){
        super(props);
        this.state={
            status: '',
            quality: '',
            error: '',
            isFullScreen:false,
            moduleMargin: StyleSheet.hairlineWidth * 2,
            orientation: null,
            height: 250,
            play: false,
            videoData: [],
            downloadUrl: null,
            filename: null,
            loader: true,
            disabled: true,
            check: '',
            mp3file: [],
            video: []

        }
    }
    getVideoData = () =>{
        const self = this;
        fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${this.props.navigation.state.params.youtubeId}&key=${apiKey}`)
        .then(res=>res.json())
        .then(res =>{
            console.log('video response', res);
            const videoData = []
            res.items.map((view, i)=>{
               videoData.push(view);
            })
            self.setState({videoData});
            this.getDownloadLink();
        })
    }
    
    componentDidMount(){
        Orientation.lockToPortrait();
        this.getVideoData(); 
    }
    componentWillUnmount(){
        this.setState({mp3file: [], video: []})
        console.log('component will unmounted');
    }

    getDownloadLink = async () =>{
        const self = this;
        const id = this.props.navigation.state.params.youtubeId;
            const youtubeUrl = `https://www.youtube.com/watch?v=${id}`
            axios.post('https://intense-refuge-16489.herokuapp.com/api/info',{
                url: youtubeUrl
            })
            .then(response=> {
                console.log('download info', response);
                const mp3 = []
                const video = []
                response.data.formats.map((format, i)=>{
                    if(format.vcodec === "none" && format.abr >= 128){
                        mp3.push(format);
                    }else if(format.ext === "mp4" && format.height >= 360){
                        video.push(format);
                    }
                })
                console.log('mp3', mp3);
                self.setState({
                    downloadUrl: response.data.url,
                    filename: response.data._filename,
                    mp3file: mp3,
                    video,
                    loader: false, 
                    disabled: false
                })
                
            })
            .catch(error=>{
                console.log('error', error);
            })
    }

    getDownloadData = async (url, filename,abr={}, ext) =>{
        const self = this;
        requestStoragePermission()
        .then(data2=>{
            console.log('check', data2);
            if(data2 === true){
                const title = self.state.videoData? self.state.videoData[0].snippet.title : 'youtube_video';
                const audio = self.state.mp3file? self.state.mp3file[0].url : ''
                if(ext === 'video'){
                    downloadFile(url, filename, title, audio)
                }
                else{
                    downloadMp3(url, filename, abr);
                }
                  
            }else{
                requestStoragePermission();
            }
        })
    }


    handleReady = () => {
        setTimeout(() => this.setState({ height: 251 }), 500);
    }
    render(){

        console.log('mp3 files', this.state.mp3file);
        // console.log('filename', this.state.filename);
        return <ScrollView style={style.container} >
                <View>
                    <YouTube
                    videoId={this.props.navigation.state.params.youtubeId}   // The YouTube video ID
                    play={this.state.play}             // control playback of video with true/false
                    fullscreen={this.state.isFullScreen}       // control whether the video should play in fullscreen or inline  
                    showFullscreenButton={false}          
                    apiKey="AIzaSyCwjY8Rk7ysaEY1uGOrTmvEVaQsVbEJ7n4"
                    controls={1}
                    onFullScreenEnter={() => Orientation.unlockAllOrientations()}
                    onFullScreenExit={() =>Orientation.lockToPortrait() }
                    onReady={()=>this.handleReady()}
                    onChangeState={e => this.setState({ status: e.state })}
                    onChangeQuality={e => this.setState({ quality: e.quality })}
                    onError={e => console.log('error', e)}
                    style={{ alignSelf:'stretch', height:this.state.height, margin: this.state.moduleMargin }}
                    />
                </View>
                <View style={{margin: 10}} >
                    <View>
                        <Text style={{fontSize: 16, fontWeight: "400"}}>{this.state.videoData[0]? this.state.videoData[0].snippet.title: ''}</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}} >
                        <View style={{marginRight: 30}} >
                            <Icon name="thumb-up" color="gray" style={{marginBottom: 7}} />
                            <Text>{this.state.videoData[0] ? formatView(this.state.videoData[0].statistics.likeCount): ''}</Text>
                        </View>
                        <View style={{marginRight: 30}} >
                            <Icon name="thumb-down" color="gray" style={{marginBottom: 7}} />
                            <Text>{this.state.videoData[0] ? formatView(this.state.videoData[0].statistics.dislikeCount): ''}</Text>
                        </View>
                        <View style={{marginRight: 30}} >
                            <Icon name="view-carousel" color="gray" style={{marginBottom: 7}} />
                            <Text>{this.state.videoData[0] ? formatView(this.state.videoData[0].statistics.viewCount): ''}</Text>
                        </View>
                        <View>
                            <Icon name="comment" color="gray" style={{marginBottom: 7}} />
                            <Text>{this.state.videoData[0] ? formatView(this.state.videoData[0].statistics.commentCount): ''}</Text>
                        </View>
                    </View>
                    <View style={{marginTop: 7, marginBottom: 15}}>
                        <Text style={{marginRight: 20}} >{this.state.videoData[0]? this.state.videoData[0].snippet.channelTitle: ''}</Text>
                        {/* <Text>{this.state.videoData[0] ? formatView(this.state.videoData[0].statistics.viewCount): ''} views &nbsp; {this.state.videoData[0] ? formatView(this.state.videoData[0].statistics.commentCount): ''} comments</Text> */}
                    </View>

                    {this.state.loader ? 
                    <ActivityIndicator size="large" color="#0000ff" />:
                    
                    <View>
                        <View style={style.makeInline}>
                            <Icon name="audiotrack" size={25} />
                            <Text style={{marginLeft: 15}} >Audio mp3 download links</Text>
                        </View>
                        
                        {this.state.mp3file.length > 1 && this.state.mp3file.map((item, i)=>(
                            <TouchableHighlight key={i}  onPress={()=> this.getDownloadData(item.url, this.state.filename, item.abr, ext='mp3')} underlayColor="gray" >
                                <View style={[style.container1, style.horizontal]} >
                                    <Text>mp3</Text>
                                    <Text>{item.abr}kbps</Text>
                                    <Text>{byteFormate(item.filesize,2)}</Text>
                                </View> 
                            </TouchableHighlight> 
                        ))}

                        <View style={[style.makeInline, {marginTop: 10}]}>
                            <Icon name="video-library" size={25} />
                            <Text style={{marginLeft: 15}} >Video download links</Text>
                        </View>
                        
                        {this.state.video.length > 1 && this.state.video.map((item, i)=>(
                            <TouchableHighlight key={i}  onPress={()=> this.getDownloadData(item.url, this.state.filename, ext = 'video')} underlayColor="gray" >
                                <View style={[style.container1, style.horizontal]} >
                                    <Text>{item.ext}</Text>
                                    <Text>{item.format_note}</Text>
                                    <Text>{byteFormate(item.filesize,2)}</Text>
                                </View> 
                            </TouchableHighlight> 
                        ))}
                            
                        {/* <Button
                            buttonStyle={style.downloadButton}
                            disabledStyle={{ borderRadius: 30, backgroundColor: 'rgba(179, 179, 255, 1)' }} // <- Add this
                            activeOpacity={0.8}
                            title={('Download video in high resolution')}
                            onPress={()=>this.getDownloadData(this.props.navigation.state.params.youtubeId)}
                            textStyle={style.TextButton}
                            loading={this.state.loader}
                            disabled={this.state.disabled}
                        /> */}
                    </View>}

                </View>
        </ScrollView>
    }
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        // backgroundColor: "gray"
    },
    downloadButton: {
        borderRadius: 30,
        height: 50,
        marginTop: 20,
        backgroundColor: "rgba(92, 99,216, 1)",
    },
    TextButton:{
        fontSize: 17,
        color: '#ffffff'
    },
    makeInline:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    container1: {
        justifyContent: 'center'
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
      }

})

export default YoutubeVideo