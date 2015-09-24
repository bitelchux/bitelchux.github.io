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
        public string CategoryId { get; set; }
        public System.DateTime PublishedAt { get; set; }
        public String VideoId { get; set; }
        public String MediaFile { get; set; }
        public String InfoFile { get; set; }
        public String Captions { get; set; }
        public String Language { get; set; }
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
        public UploadVideo()
        {
          

        }
        public void init()
        {
            try
            {
                new UploadVideo(myVideo).Run();
                
            }
            catch (AggregateException ex)
            {
                foreach (var e in ex.InnerExceptions)
                {
                    Utils.Console("<font style='color:red'>Error: " + e.Message+"</font>");
                    //MessageBox.Show(e.Message);
                }
            }
        }
        void captionInsertRequest_ProgressChanged(Google.Apis.Upload.IUploadProgress progress)
        {

            switch (progress.Status)
            {
                case UploadStatus.Starting:
                    Const.isUploadingVideo = true;
                    break;
                case UploadStatus.Completed:
                    Utils.Console("Etiquetas subidas");
                    Const.isUploadingVideo = false;
                    break;

                case UploadStatus.Uploading:
                    Const.isUploadingVideo = true;
                    Console.WriteLine("{0} bytes sent.", progress.BytesSent);
                    break;

                case UploadStatus.Failed:
                    
                    Const.isUploadingVideo = false;
                    Utils.Console("<font style='color:red'>An error prevented the upload from completing " + progress.Exception + "</font>");
                    
                    break;
            }
        }
        void captionInsertRequest_ResponseReceived(Caption caption)
        {
            
                var c = caption;

            /*
            tmr = new System.Timers.Timer();
            tmr.Interval = 3000; // 0.1 second
            tmr.Elapsed += timerHandler; // We'll write it in a bit
            tmr.Start(); // The countdown is launched!
            */

        }
        
        public async Task getCategories(String regionCode)
        {

            UserCredential credential;
            using (var stream = new FileStream(Const.credentials, FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    // This OAuth 2.0 access scope allows an application to upload files to the
                    // authenticated user's YouTube channel, but doesn't allow other types of access.
                    new[] { YouTubeService.Scope.Youtubepartner, YouTubeService.Scope.YoutubeUpload, YouTubeService.Scope.YoutubeForceSsl },
                    "user",
                    CancellationToken.None
                );
            }
            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = Assembly.GetExecutingAssembly().GetName().Name
            });
            var videoCatagories = youtubeService.VideoCategories.List("snippet");
            videoCatagories.RegionCode = regionCode;
            var result = videoCatagories.Execute();
            for (int i = 0; i < result.Items.Count; i++)
            {
                System.IO.File.AppendAllText("CATEGORIES" + regionCode + ".txt", result.Items[i].Id+";" + result.Items[i].Snippet.Title+System.Environment.NewLine);
            }
            
        }
        public async Task uploadCaptions(string videoId, string lang, string filename)
        {
            if (File.Exists(filename))
            {
                try { 
                    Utils.Console("Empieza a Subir etiquetas " + filename);
                    Caption cap = new Caption();
                    cap.Snippet = new CaptionSnippet();
                    cap.Snippet.VideoId = videoId;
                    cap.Snippet.Language = lang;
                    cap.Snippet.Name = filename;
                    cap.Snippet.IsDraft = false;
                    UserCredential credential;
                    using (var stream = new FileStream(Const.credentials, FileMode.Open, FileAccess.Read))
                    {
                        credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                            GoogleClientSecrets.Load(stream).Secrets,
                            // This OAuth 2.0 access scope allows an application to upload files to the
                            // authenticated user's YouTube channel, but doesn't allow other types of access.
                            new[] { YouTubeService.Scope.Youtubepartner, YouTubeService.Scope.YoutubeUpload,YouTubeService.Scope.YoutubeForceSsl },
                            "user",
                            CancellationToken.None
                        );
                    }
                    var youtubeService = new YouTubeService(new BaseClientService.Initializer()
                     {
                         HttpClientInitializer = credential,
                         ApplicationName = Assembly.GetExecutingAssembly().GetName().Name
                     });


                    //write string to file
                
    //                string captions = "uhlduiqweoquey";
    //                System.IO.File.WriteAllText(filename, captions);
                    using (System.IO.Stream fileStream = new FileStream(filename, FileMode.Open))
                    {
                        var captionsInsertRequest = youtubeService.Captions.Insert(cap, "snippet", fileStream, "*/*");
                        captionsInsertRequest.ProgressChanged += captionInsertRequest_ProgressChanged;
                        captionsInsertRequest.ResponseReceived += captionInsertRequest_ResponseReceived;
                        captionsInsertRequest.Upload();
                    }
                }
                catch (Exception ex)
                {
                    
                    Utils.Console(ex.ToString());
                }
            }
        }
        public async Task GetChannelName()
        {

            UserCredential credential;

         
            using (var stream = new FileStream(Const.credentials, FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    // This OAuth 2.0 access scope allows an application to upload files to the
                    // authenticated user's YouTube channel, but doesn't allow other types of access.
                    new[] { YouTubeService.Scope.Youtubepartner, YouTubeService.Scope.YoutubeUpload, YouTubeService.Scope.YoutubeForceSsl },
                    "user",
                    CancellationToken.None
                );
            }
            
            if (credential != null)
            {
              //  await credential.RevokeTokenAsync(CancellationToken.None);
            }
            
            {
                using (var stream = new FileStream(Const.credentials, FileMode.Open, FileAccess.Read))
                {
                    credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                        GoogleClientSecrets.Load(stream).Secrets,
                        // This OAuth 2.0 access scope allows an application to upload files to the
                        // authenticated user's YouTube channel, but doesn't allow other types of access.
                        new[] { YouTubeService.Scope.Youtubepartner, YouTubeService.Scope.YoutubeUpload, YouTubeService.Scope.YoutubeForceSsl },
                        "user",
                        CancellationToken.None
                    );
                }
            }
            // credential.RevokeTokenAsync()
            // http://peleyal.blogspot.com.es/2014/06/182-is-here.html
            //await GoogleWebAuthorizationBroker.ReauthorizeAsync(credential, CancellationToken.None);

            var youtubeService = new YouTubeService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = Assembly.GetExecutingAssembly().GetName().Name
            });

            var channelsListRequest = youtubeService.Channels.List("contentDetails,id");
            channelsListRequest.Mine = true;

            var channelsListResponse = await channelsListRequest.ExecuteAsync();
            
            System.Diagnostics.Process.Start("https://www.youtube.com/channel/" + channelsListResponse.Items[0].Id);
            
            foreach (var channel in channelsListResponse.Items)
            {
                var uploadsListId = channel.ContentDetails.RelatedPlaylists.Uploads;

               // CommandLine.WriteLine(String.Format("Videos in list {0}", uploadsListId));
               /*
                var nextPageToken = "";
                while (nextPageToken != null)
                {
                    var playlistItemsListRequest = youtubeService.PlaylistItems.List("snippet");
                    playlistItemsListRequest.PlaylistId = uploadsListId;
                    playlistItemsListRequest.MaxResults = 50;
                    playlistItemsListRequest.PageToken = nextPageToken;

                    var playlistItemsListResponse  = await playlistItemsListRequest.ExecuteAsync();

                    foreach (var playlistItem in playlistItemsListResponse.Items)
                    {
                        var x = playlistItem.Snippet.Title;
                        if (playlistItem.Snippet.PublishedAt.Value.Day>=29 && playlistItem.Snippet.PublishedAt.Value.Month == 8)
                        {
                            var videoDeleteRequest =youtubeService.Videos.Delete(playlistItem.Snippet.ResourceId.VideoId);
                            var videoDeleteResponse = await videoDeleteRequest.ExecuteAsync();
                        }
                        else
                        {
                            var i=1;
                        }
                    }

                    nextPageToken = playlistItemsListResponse.NextPageToken;
                }
                */
            }
            
        }
        public async Task Run()
        {
            if (1 == 1)
            {
                try
                {
                    Utils.Console("Empieza a subir video " + myVideo.MediaFile);
                    UserCredential credential;
                    using (var stream = new FileStream(Const.credentials, FileMode.Open, FileAccess.Read))
                    {
                        credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                            GoogleClientSecrets.Load(stream).Secrets,
                            // This OAuth 2.0 access scope allows an application to upload files to the
                            // authenticated user's YouTube channel, but doesn't allow other types of access.
                            new[] { YouTubeService.Scope.Youtubepartner, YouTubeService.Scope.YoutubeUpload, YouTubeService.Scope.YoutubeForceSsl },
                            "user",
                            CancellationToken.None
                        );
                    }
                    await GoogleWebAuthorizationBroker.ReauthorizeAsync(credential, CancellationToken.None);

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
                    Random rnd = new Random();

                    video.Snippet.PublishedAt = myVideo.PublishedAt.AddHours(rnd.Next(1, 90));
                    video.Snippet.Description = myVideo.Descrip;
                    video.Snippet.DefaultLanguage = myVideo.Language;
                    video.Snippet.DefaultAudioLanguage = myVideo.Language;
                    String auxtags = String.Join(",", myVideo.Tags);
                    auxtags = auxtags.Substring(0, Math.Min(auxtags.Length, 450));
                    myVideo.Tags = auxtags.Split(',');
                    myVideo.Tags = myVideo.Tags.Take(Math.Max(1, Math.Min(20, myVideo.Tags.Count() - 1))).ToArray();
                    video.Snippet.Tags = myVideo.Tags;

                    // video.Snippet.CategoryId = myVideo.CategoryId; // See https://developers.google.com/youtube/v3/docs/videoCategories/list
                    video.Status = new VideoStatus();
                    //video.Status.PrivacyStatus = "private"; // or "private" or "public"
                    video.Status.PrivacyStatus = "public"; // or "private" or "public"
                    video.Status.PublicStatsViewable = true;
                    //video.Status.PublishAt = myVideo.PublishedAt;
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

                    Utils.Console(ex.ToString());
                    //var msg = ex.ToString();

                }
            }
        }
        public static void uploadSampleVideo()
        {
            Random rnd = new Random();
            DateTime d = DateTime.Today;
            d = d.AddHours(rnd.Next(0, 24));
            YTVideo ytVideo = new YTVideo
            {
                Title = "Test",
                Descrip = "test",
                Tags = Regex.Split("test", ","),
                CategoryId = "20",
                PublishedAt = d,
               
                Language = "en",
                MediaFile = "test.avi",
                InfoFile = "test.ytjson"
            };
            Utils.writeJson("test.ytjson", ytVideo);

            while (Const.isUploadingVideo)
            {
                System.Threading.Thread.Sleep(2000);
            }
            new UploadVideo(ytVideo).init();
        }
        
        void videosInsertRequest_ProgressChanged(Google.Apis.Upload.IUploadProgress progress)
        {
            
            switch (progress.Status)
            {
                case UploadStatus.Starting:
                    Const.isUploadingVideo = true;
                    break;
                case UploadStatus.Completed:
                    Utils.Console("Video subido");
                    Const.isUploadingVideo = false;
                    break;

                case UploadStatus.Uploading:
                    Const.isUploadingVideo = true;
                    var size = new FileInfo(myVideo.MediaFile).Length;
                    Utils.Console(progress.BytesSent + " bytes sent of " + size + "bytes" + progress.BytesSent*100/size + "%");
                    break;

                case UploadStatus.Failed:
                    Const.isUploadingVideo = false;
                    //MessageBox.Show(progress.Exception.ToString());
                    Utils.Console("<font style='color:red'>An error prevented the upload from completing " + progress.Exception + "</font>");
                    break;
            }
        }

    
        void videosInsertRequest_ResponseReceived(Video video)
        {
            myVideo = Utils.readJson(myVideo.InfoFile);
            myVideo.VideoId = video.Id;
            Utils.writeJson(myVideo.InfoFile, myVideo);
            Utils.Console("Video id " + myVideo.MediaFile + " was successfully uploaded.");
            Const.isUploadingVideo = false;
            
            uploadCaptions(video.Id, myVideo.Language,  myVideo.MediaFile.Replace(".avi", "") + ".rst");
            /*
            tmr = new System.Timers.Timer();
            tmr.Interval = 3000; // 0.1 second
            tmr.Elapsed += timerHandler; // We'll write it in a bit
            tmr.Start(); // The countdown is launched!
            */

        }
    }

}
