using AForge.Video.FFMPEG;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Media;

namespace gifbin
{
    public class YTVideo
    {
        public String Title { get; set; }
        public String Descrip { get; set; }
        public string[] Tags { get; set; }
        public int CategoryId { get; set; }
        public System.DateTime PublishedAt { get; set; }
        public String VideoId { get; set; }
        public String MediaFile { get; set; }
        public String InfoFile { get; set; }
        public String Captions { get; set; }
        public String Aux { get; set; }
    }
    public class UploadVideo
    {
        YTVideo myVideo;
        System.Timers.Timer tmr;
        public UploadVideo(YTVideo video)
        {
            myVideo = video;

        }
        public void init()
        {
            try
            {
                new UploadVideo().Run().Wait();
            }
            catch (AggregateException ex)
            {
                foreach (var e in ex.InnerExceptions)
                {
                    Console.WriteLine("Error: " + e.Message);
                }
            }
        }
        public async Task Run()
        {
            try
            {
                UserCredential credential;
                using (var stream = new FileStream("client_secrets.json", FileMode.Open, FileAccess.Read))
                {
                    credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                        GoogleClientSecrets.Load(stream).Secrets,
                        // This OAuth 2.0 access scope allows an application to upload files to the
                        // authenticated user's YouTube channel, but doesn't allow other types of access.
                        new[] { YouTubeService.Scope.YoutubeUpload },
                        "user",
                        CancellationToken.None
                    );
                }


                var youtubeService = new YouTubeService(new BaseClientService.Initializer()
                {
                    HttpClientInitializer = credential,
                    ApplicationName = Assembly.GetExecutingAssembly().GetName().Name
                });
                var cap = new Caption();
                //subtitulos? cap.Snippet.VideoId
                var video = new Video();

                video.Snippet = new VideoSnippet();
                video.Snippet.Title = myVideo.Title;
                //ojo
  //              AccessPolicy accessPolicy = new AccessPolicy();
                
             //   video.MonetizationDetails = new VideoMonetizationDetails();
//                video.MonetizationDetails.Access.Allowed=true;
                video.Snippet.PublishedAt = myVideo.PublishedAt;
                video.Snippet.Description = myVideo.Descrip;
                video.Snippet.Tags = myVideo.Tags;
                video.Snippet.CategoryId = "22"; // See https://developers.google.com/youtube/v3/docs/videoCategories/list
                video.Status = new VideoStatus();
                video.Status.PrivacyStatus = "private"; // or "private" or "public"
                video.Status.PublicStatsViewable = true;
                video.Status.PublishAt = myVideo.PublishedAt.AddDays(1);
                var filePath = myVideo.MediaFile; // Replace with path to actual movie file.

                using (var fileStream = new FileStream(filePath, FileMode.Open))
                {
                    var videosInsertRequest = youtubeService.Videos.Insert(video, "snippet,status", fileStream, "video/*");
                    videosInsertRequest.ProgressChanged += videosInsertRequest_ProgressChanged;
                    videosInsertRequest.ResponseReceived += videosInsertRequest_ResponseReceived;


                    await videosInsertRequest.UploadAsync();
                }
            }
            catch (Exception ex)
            {
              
                    //MessageBox.Show(ex.ToString());
                var msg = ex.ToString();
              
            }
        }

        void videosInsertRequest_ProgressChanged(Google.Apis.Upload.IUploadProgress progress)
        {
            switch (progress.Status)
            {
                case UploadStatus.Uploading:
                    Console.WriteLine("{0} bytes sent.", progress.BytesSent);
                    break;

                case UploadStatus.Failed:
                    MessageBox.Show(progress.Exception.ToString());
                    Console.WriteLine("An error prevented the upload from completing.\n{0}", progress.Exception);
                    break;
            }
        }
        private void timerHandler(object sender, EventArgs e)
        {
            /*
            try
            {
               // File.Delete(myVideo.MediaFile);
            }
            catch (Exception ex)
            {
                var msg = ex.ToString();
            }
            */
            tmr.Stop(); // Manually stop timer, or let run indefinitely
        }
        void videosInsertRequest_ResponseReceived(Video video)
        {
            myVideo = Utils.readJson(myVideo.InfoFile);
            myVideo.VideoId = video.Id;
            Utils.writeJson(myVideo.InfoFile, myVideo);
            Console.WriteLine("Video id '{0}' was successfully uploaded.", video.Id);
            /*
            tmr = new System.Timers.Timer();
            tmr.Interval = 3000; // 0.1 second
            tmr.Elapsed += timerHandler; // We'll write it in a bit
            tmr.Start(); // The countdown is launched!
            */

        }
    }

}
