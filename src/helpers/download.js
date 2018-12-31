import RNFetchBlob from 'rn-fetch-blob'
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import Notification from 'react-native-system-notification';

 export const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          'title': 'You Downloader requires storage permission'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err)
    }
  }

export const downloadFile = (url, filename, videotitle, audio) =>{
    let dirs = RNFetchBlob.fs.dirs
    RNFetchBlob
    .config({
      // path : dirs.DownloadDir+`/${filename}`,
        addAndroidDownloads : {
            useDownloadManager : true,
            notification : true,
            title : videotitle,
            description : videotitle,
            mime : 'video/mp4',
            mediaScannable : true,
            path : dirs.DownloadDir+`/${filename}`,
        }
      })
      .fetch('GET', url)
      // .progress({count: 10},(received, total) => {
      //   let prog = ((received / total)*100).toFixed(0);
      //   console.log('progress', prog);
      // })
      .then(async res=>{
            console.log('file saved to ', res.path());
            const timestamp = Math.floor(Date.now());
            const title = filename.replace(/.mp4/gi, '');
            const outputFile = `${dirs.DownloadDir}/Hellotube/${title}-${timestamp}.mp4`;
            const command = `-i ${res.path()} -i ${audio} -c:v copy -c:a aac -strict experimental ${outputFile}`
            await RNFFmpeg
            .execute(command)
            .then(data => {
              console.log('convert successfully');
              RNFS.unlink(res.path())
              .then(()=>{
                console.log('file deleted');
                ToastAndroid.showWithGravity(
                  `${filename} downloaded successfully`,
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );

              })
              .catch(error=>{
                console.log(error.message);
              })
            });
      })
      .catch(error=>{
          console.log('error', error);
      })
}
export const downloadMp3 = async (url, mp3Title, abr) =>{
  try{
  console.log('url', url);
  let dirs = RNFetchBlob.fs.dirs
  const timestamp = Math.floor(Date.now());
  const title = mp3Title.replace(/.mp4/gi, '');
  const outputFile = `${dirs.DownloadDir}/Hellotube/${title}-${timestamp}.mp3`;
  //-i input.wav -vn -ar 44100 -ac 2 -ab 192k -f mp3 output.mp3
  const command = `-i ${url} -ar 44100 -ac 2 -b:a ${abr}k -f mp3 ${outputFile}`
  await RNFFmpeg.execute(command)
  .then(data => {
    console.log('convert successfully');
    ToastAndroid.showWithGravity(
      `${mp3Title} downloaded successfully`,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  })
  .catch(err=>{
    console.log('error', err);
  })
}catch(err){
  console.log('error', err);
}
}

export const byteFormate = (a, b) =>{
  if(0==a)return"0 Bytes";
  var c=1024,d=b||2,
  e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],
  f=Math.floor(Math.log(a)/Math.log(c));
  return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]

}
