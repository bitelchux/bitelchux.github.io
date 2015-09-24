
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using AForge.Video.FFMPEG;
using System.Drawing.Imaging;
using System.Xml;
using System.ServiceModel.Syndication;
using HtmlAgilityPack;
using System.Windows.Documents;
namespace gifbin
{
    public partial class FormVideosWhatsapp : Form
    {
        //int optimalDuration = 2 * 60 * 25; //3 minutos 4500 frames
        
        
        
        
        
        
        String filename = "";
        public FormVideosWhatsapp()
        {
            InitializeComponent();
        }
       
        public void videoTron()
        {
            Fades.fading = false;
            Const.withSound =checkBox1.Checked;
            VideoFileWriter writer;
            int contVideos = Convert.ToInt16(apartirde.Text);            
            Graphics g;
            string[] gifs = Directory.GetFiles(this.folder.Text, "*.gif");
            writer = new VideoFileWriter();
            filename = Utils.Slug(this.folder.Text) + "-" + contVideos;

            writer.Open(filename + ".avi", Const.width, Const.height, Const.frameRate, VideoCodec.MSMPEG4v3, 3000000);
            //VideoSounds.startSounds(filename + "wav");

            String description = "";
            String captions = "";
            int contCaptions = 1;
            string previousCaptionTime = "00:00:00.001";
            TimeSpan captionDuration ;
            string[] oldTime;
            string[] newTime;
            string duration = "";
            string txt = "";
            int numOfFrames=0;
            double seconds = 0;

            Image auxImg = null;
            Const.GLOBALFrameCount = 0;
            for (int i = 0; i < gifs.Length; i++)
            {
                Const.GLOBALFrameCount = 0;
                bool process = true;
                auxImg=Image.FromFile(gifs[i]);
                if (auxImg.Width < 200)
                    process = false;
                FileInfo f = new FileInfo(gifs[i]);
                if (f.Length<=1000)
                    process = false;
                if (process)
                {
                    Utils.Console("A procesar el " + gifs[i] + "(" + Const.framesInThisVideo + " de " + Const.optimalDuration + ")");
                    description = description + gifs[i].Replace(".gif", "").Replace(folder.Text + "\\", "") + System.Environment.NewLine;
                    //captions = captions + Const.framesInThisVideo + "->" + gifs[i].Replace(".gif", "").Replace(folder.Text + "\\", "").Replace(folder.Text, "") + System.Environment.NewLine;
                    VideoImages.letters(writer, null, Utils.TruncateLongString(gifs[i].Replace(".gif", "").Replace(folder.Text + "\\", "").Replace(folder.Text, ""), 60), 2, Const.width / 4, Const.height / 2);
                    numOfFrames = VideoImages.imagenGifAnimado(writer, gifs[i], 1);
                    System.GC.Collect();
                    
                    if (numOfFrames < 100)
                    {
                        var aux = numOfFrames + VideoImages.imagenGifAnimado(writer, gifs[i], 2);                        
                        System.GC.Collect();
                    }
                    seconds = Convert.ToDouble(Const.GLOBALFrameCount)/Const.frameRate + 1.8;
                    string msnew = seconds.ToString().Split(',').Length > 1 ? seconds.ToString().Split(',')[1] : "000";
                    duration = string.Format("{0:00}:{1:00}:{2:00}.{3:000}", seconds / 3600, (seconds / 60) % 60, seconds % 60, msnew);
                    oldTime = previousCaptionTime.Split('.');
                    String msold = oldTime[1];
                    oldTime = oldTime[0].Split(':');
                    captionDuration = new TimeSpan(0, Convert.ToInt16(oldTime[0]), Convert.ToInt16(oldTime[1]), Convert.ToInt16(oldTime[2]), Convert.ToInt16(msold));
                    newTime = duration.Split('.');
                    newTime = newTime[0].Split(':');
                    captionDuration = captionDuration.Add(new TimeSpan(0, Convert.ToInt16(newTime[0]), Convert.ToInt16(newTime[1]), Convert.ToInt16(newTime[2]), Convert.ToInt16(Math.Round(Convert.ToInt16(msnew) / 10.0)) * 100));
                    txt = gifs[i].Replace(".gif", "").Replace(folder.Text + "\\", "");
                    captions = captions + contCaptions++ + System.Environment.NewLine;
                    captions = captions + previousCaptionTime + " --> " + captionDuration.ToString(@"hh\:mm\:ss\.fff") + System.Environment.NewLine;
                    captions = captions + txt + System.Environment.NewLine;
                    captions = captions + System.Environment.NewLine;
                    previousCaptionTime = captionDuration.ToString(@"hh\:mm\:ss\.fff");
                    System.IO.StreamWriter fileCaption = new System.IO.StreamWriter("FINAL" + Utils.Slug(filename) + ".rst");
                    fileCaption.Write(captions);
                    fileCaption.Close();

                    /*
                 VideoImages.lettersFondoAnimado(writer, gifs[i],description, "BOTTOM");
                    System.GC.Collect();
                     */
                    if (!Directory.Exists("PROCESSED" + folder.Text))
                    {
                        Directory.CreateDirectory("PROCESSED" + folder.Text);
                    }


                    try
                    {
                        File.Copy(gifs[i], gifs[i].Replace(folder.Text + "\\", ".\\PROCESSED" + folder.Text + "\\"));
                        System.Threading.Thread.Sleep(2000);
                        File.Delete(gifs[i]);
                    }
                    catch (Exception e)
                    {
                        Utils.Console(e.ToString());
                    }
                    if (Const.framesInThisVideo > Const.optimalDuration || i == gifs.Length - 1)
                    {
                        //VideoImages.letters(writer,null, "Thanks for watching!!!", 2, Const.width / 4, Const.height / 2);
                        writer.Close();

                        //VideoSounds.endSounds();
                        string targetFile = Utils.Slug(folder.Text) + "-" + contVideos;
                        Random rnd = new Random();
                        //ojo
                        if (Const.withSound)
                        {
                            FFMPGScripter.AddSoundtoVideo(targetFile + ".avi", "circus" + rnd.Next(1, 5) + ".wav");
                        }
                        else
                        {
                            if (File.Exists("FINAL" + targetFile + ".avi"))
                                File.Delete("FINAL" + targetFile + ".avi");
                            System.IO.File.Move(targetFile + ".avi", "FINAL" + targetFile + ".avi");
                        }
                        File.Delete(targetFile + ".avi");
                        Const.framesInThisVideo = 0;
                        writer = new VideoFileWriter();


                        //String tags="videos graciosos,videos chistosos,videos divertidos,humor,caidas graciosas,caídas,caídas divertidas";
                        String tags = this.tags.Text;
                        tags = string.Format(tags, coletilla.Text);
                        //tags=tags+","+ aux.Replace(","," " + coletilla.Text+",")+ " " + coletilla.Text;
                        DateTime d = DateTime.Now;

                        rnd = new Random();
                        d = d.AddHours(rnd.Next(0, Convert.ToInt16(durante.Text)));
                        YTVideo ytVideo = new YTVideo
                        {
                            Title = String.Format(titulo.Text, coletilla.Text, (contVideos + 1)),
                            Descrip = String.Format(titulo.Text, coletilla.Text, (contVideos + 1)) + System.Environment.NewLine + description,
                            Tags = Regex.Split(tags + "," + description.Replace(System.Environment.NewLine, ","), ","),
                            //CategoryId = ((ListItem)this.category.SelectedItem).Value.ToString(),
                            //OJO
                            CategoryId = "20",
                            PublishedAt = d,
                            Captions = captions,
                            Language = lenguage.Text,
                            MediaFile = "FINAL" + targetFile + ".avi",
                            InfoFile = targetFile + ".ytjson"
                        };
                        Utils.writeJson(targetFile + ".ytjson", ytVideo);

                        while (Const.isUploadingVideo)
                        {
                            System.Threading.Thread.Sleep(2000);
                        }
                        Utils.CleanTempFiles();
                        new UploadVideo(ytVideo).init();

                        description = "";
                        captions = "";
                        Const.GLOBALFrameCount = 0;
                        previousCaptionTime = "00:00:00.100";
                        if (i != gifs.Length - 1)
                        {
                            filename = Utils.Slug(folder.Text) + "-" + ++contVideos;
                            writer.Open(filename + ".avi", Const.width, Const.height, Const.frameRate, VideoCodec.MSMPEG4v3, 3000000);
                            // VideoSounds.startSounds(filename + "wav");
                        }

                    }
                }
                else
                {
                    //gif muy cutre
                }
            }

            

            if (writer.IsOpen)
            {
                writer.Close();
            }
        }
        
       
      
        private void button1_Click(object sender, EventArgs e)
        {
            Const.resizeWithRatio = true;
            Const.staticBg = new Bitmap(this.fondostatic.Text);
            Utils.ConsoleClear();
            videoTron();
            MessageBox.Show("FIN");
            
             
             
        }
        /*
        private void button2_Click(object sender, EventArgs e)
        {
            VideoFileWriter writer;
            int contVideos = 0;
            int contParts = 0;
            Graphics g;
            string[] gifs = Directory.GetFiles(@".", "*.gif");
          

            String description = "";
            String captions = "";

            for (int i = 0; i < gifs.Length; i++)
            {
                writer = new VideoFileWriter();
                filename = tag.Text + "-" + contVideos + "-"+ contParts;
                writer.Open(filename + ".avi", Const.width, Const.height, Const.frameRate, VideoCodec.MPEG4, 1000000);
                VideoSounds.startSounds(filename);


                description = description + gifs[i].Replace(".gif", "").Replace(".\\", "") + System.Environment.NewLine;
                captions = captions + Const.framesInThisVideo + "->" + gifs[i].Replace(".gif", "").Replace(".\\", "") + System.Environment.NewLine;
                VideoSounds.speak(gifs[i].Replace(".gif", "").Replace(".\\", ""));
                VideoImages.letters(writer, null, description, 2, Const.width / 4, Const.height / 2);
       
                System.GC.Collect();
                VideoImages.imagenGifAnimado(writer, gifs[i], 1);
           
                System.GC.Collect();
                /*
                VideoImages.imagenGifAnimado(writer, gifs[i], 1, description, "BOTTOM");
                VideoSounds.flush();
                System.GC.Collect();
                VideoImages.imagenGifAnimado(writer, gifs[i], 1, description, "TOP");
                VideoSounds.flush();
                System.GC.Collect();
                VideoImages.imagenGifAnimado(writer, gifs[i], 1, description);
                VideoSounds.flush();
                System.GC.Collect();
                //camara lenta
                //VideoImages.imagenGifAnimado(writer, gifs[i], 2, description, "BOTTOM");
                System.GC.Collect();
                // prueba con letras
                //VideoImages.lettersFondoAnimado(writer, gifs[i], ref framesInThisVideo, description, "BOTTOM");
                writer.Close();
                VideoSounds.endSounds();

                FFMPGScripter.AddSoundtoVideo(filename + ".avi", filename + ".mp3");
                contParts++;
                if (Const.framesInThisVideo > Const.optimalDuration || i == gifs.Length - 1)
                {
                    string targetFile = tag.Text + "-" + contVideos;
                    string fileList = "";
                    for (int h = 0; h < contParts; h++)
                    {
                        fileList = fileList + "file '" + Directory.GetCurrentDirectory() + "\\" + tag.Text + "-" + contVideos + "-" + h + ".avi'" + System.Environment.NewLine;

                    }
                    FFMPGScripter.Concatenate(fileList, targetFile + ".avi");
                    //ojo
                    
                    String tags = "videos graciosos,videos chistosos,videos divertidos,humor,caidas graciosas,caídas,caídas divertidas";
                    String aux = "videos graciosos,videos chistosos,videos divertidos";
                    tags = tags + "," + aux.Replace(",", " " + YTTitle.Text) + " " + YTTitle.Text;
                    DateTime d = DateTime.Today;
                    Random rnd = new Random();
                    d.AddHours(rnd.Next(0, 24 * 185));        
                    
                    YTVideo ytVideo = new YTVideo
                    {
                        Title = YTTitle.Text,
                        Descrip = description,
                        Tags = Regex.Split(tags, ","),
                        CategoryId = 22,
                        PublishedAt = d,
                        Captions = captions,
                        MediaFile = filename,
                        InfoFile = filename + ".ytjson"
                    };
                    Utils.writeJson(filename + ".ytjson", ytVideo);
                    new UploadVideo(ytVideo).Run().Wait();
                    description = "";                                    
                }

            }
        }
        */
        private void linkLabel1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            System.Diagnostics.Process.Start("https://security.google.com/settings/security/permissions?pli=1");
        }

        private void button3_Click(object sender, EventArgs e)
        {
           
           for (int i = Convert.ToInt16(desde.Text); i < Convert.ToInt16(hasta.Text); i++)
           
           {
               Utils.getUrl("http://www.gifbin.com/tag/"+tag.Text+"/"+i,this.tag.Text);

           }
           
        }

        private void button4_Click(object sender, EventArgs e)
        {
        
           // var x=Utils.getImagesFromURL("http://www.reactiongifs.com/tag/abandon-thread/page/230/","test");
            
            List<string> links=new List<string>();
            links.Add("Abandon Thread|abandon-thread");//Abandon Thread</a></li>
            links.Add("Amused|amused");//Amused</a></li>
            links.Add("BFD|bfd");//BFD</a></li>
            links.Add("Birthday|birthday");//Birthday</a></li>
            links.Add("Bitch Please|bitch-please");//Bitch Please</a></li>
            links.Add("Booty Had Me Like|booty-had-me-like");//Booty Had Me Like</a></li>
            links.Add("Bored|bored");//Bored</a></li>
            links.Add("Confused|confused");//Confused</a></li>
            links.Add("Cry|cry");//Cry</a></li>
            links.Add("Crying|crying");//Crying</a></li>
            links.Add("Dance|dance");//Dance</a></li>
            links.Add("Dat Ass|dat-ass");//Dat Ass&nbsp;</a></li>
            links.Add("Deal With It|deal-with-it");//Deal With It</a></li>
            links.Add("Derp|derp");//Derp</a></li>
            links.Add("Disappointed|disappointed");//Disappointed</a></li>
            links.Add("Disgusted|disgusted");//Disgusted</a></li>
            links.Add("Do Not Want|do-not-want");//Do NOT want</a></li>
            links.Add("Do Want|do-want");//Do Want</a></li>
            links.Add("Drunk|drunk");//Drunk</a></li>
            links.Add("Eww|eww");//Eww</a></li>
            links.Add("Excited|excited");//Excited</a></li>
            links.Add("Eye Roll|eye-roll");//Eye roll</a></li>
            links.Add("Facepalm|facepalm");//Facepalm</a></li>
            links.Add("Fail|fail");//Fail</a></li>
            links.Add("Flip the Bird|flip-the-bird");//Flip the Bird</a></li>
            links.Add("Flirt|flirt");//Flirt</a></li>
            links.Add("Funny|funny");//Funny</a></li>
            links.Add("Good Job!|good-job");//Good Job</a></li>
            links.Add("GTFO|gtfo");//GTFO</a></li>
            links.Add("High Five|high-five");//High Five</a></li>
            links.Add("Hug|hug");//Hug</a></li>
            links.Add("IDK|idk");//IDK</a></li>
            links.Add("I Give Up|i-give-up");//I Give Up</a></li>
            links.Add("Incredulous|incredulous");//Incredulous</a></li>
            links.Add("Interesting|interesting");//Interesting</a></li>
            links.Add("Judging You|judging-you");//Judging You</a></li>
            links.Add("laughing|laughing");//Laughing</a></li>
            links.Add("Lewd|lewd");//Lewd</a></li>
            links.Add("LOL|lol");//LOL</a></li>
            links.Add("Love|love");//Love</a></li>
            links.Add("Mad|mad");//Mad</a></li>
            links.Add("Meh|meh");//Meh</a></li>
            links.Add("No|no");//No</a></li>
            links.Add("Nod|nod");//Nod</a></li>
            links.Add("Nomming|nomming");//Nomming</a></li>
            links.Add("Not Bad|not-bad");//Not Bad</a></li>
            links.Add("OMG|omg");//OMG</a></li>
            links.Add("Oh Really|o-realy");//O RLY?</a></li>
            links.Add("Party Hard|party-hard");//Party Hard</a></li>
            links.Add("Pleased|pleased");//Pleased</a></li>
            links.Add("Popcorn|popcorn");//Popcorn</a></li>
            links.Add("Rad|rad");//Rad</a></li>
            links.Add("rage|rage");//Rage</a></li>
            links.Add("rejected|rejected");//Rejected</a></li>
            links.Add("Sad|sad");//Sad</a></li>
            links.Add("Sarcastic|sarcastic");//Sarcastic</a></li>
            links.Add("Say What|say-what");//Say What?</a></li>
            links.Add("Scared|scared");//Scared</a></li>
            links.Add("Serious|serious");//Serious</a></li>
            links.Add("Sexy|sexy");//Sexy</a></li>
            links.Add("Shut Up|shut-up");//Shut Up</a></li>
            links.Add("Sleepy|sleepy");//Sleepy</a></li>
            links.Add("SMH|smh");//SMH</a></li>
            links.Add("Sorry|sorry");//Sorry</a></li>
            links.Add("Stoned|stoned");//Stoned</a></li>
            links.Add("Success|success");//Success</a></li>
            links.Add("Suspicious|suspicious");//Suspicious</a></li>
            links.Add("Thank You|thank-you");//Thank you</a></li>
            links.Add("What?|what");//What?</a></li>
            links.Add("Thumbs Up|thumbs-up");//Thumbs Up</a></li>
            links.Add("Who Cares|who-cares");//Who Cares?</a></li>
            links.Add("WTF|wtf");//WTF?</a></li>
            links.Add("Yes|yes");//Yes</a></li>
            links.Add("You Don't Say|you-dont-say");//You Don’t Say</a></li>
            links.Add("You Tried|you-tried");//You Tried</a></li>
            links.Add("Yuck|yuck");//Yuck</a></li>
            for (int i = 0; i < links.Count; i++)
            {
                var aux = links[i].Split('|');
                for (var j = 0; j < 50; j++)
                {
                    if (!Utils.getImagesFromURL("http://www.reactiongifs.com/tag/" + aux[1] + "/page/" + j + "/", aux[0]))
                    {
                        j = 60;
                        //fin de paginas
                    }

                }
            }
        }

        private void checkBox1_CheckedChanged(object sender, EventArgs e)
        {
            Const.withSound = checkBox1.Checked;
        }
   

        private void updateCategories()
        {
            System.IO.StreamReader file;
            String line;
            if (this.lenguage.SelectedItem.ToString().Equals("es"))
                file = new System.IO.StreamReader("CATEGORIESES.txt");
            else
                file = new System.IO.StreamReader("CATEGORIESUS.txt");
            while ((line = file.ReadLine()) != null)
            {
                var values=line.Split(';');
                this.category.Items.Add(new ListItem(values[1], Convert.ToInt16(values[0])));
                
            }

            file.Close();
        }
        private void Form1_Load(object sender, EventArgs e)
        {
            // Read the file and display it line by line.

           
        }

        private void tags_TextChanged(object sender, EventArgs e)
        {

        }

        private void button5_Click(object sender, EventArgs e)
        {
            string url = "http://www.reddit.com/r/gifs/.rss";
            XmlReader reader = XmlReader.Create(url);
            SyndicationFeed feed = SyndicationFeed.Load(reader);
            reader.Close();
            int i = 0;
            foreach (SyndicationItem item in feed.Items)
            {
                if (item.PublishDate.Day >= DateTime.Today.AddDays(-1).Day)
                {
                    String subject = item.Title.Text;
                    String summary = item.Summary.Text;
                    //item.Title.Text;
                    HtmlAgilityPack.HtmlDocument doc = new HtmlAgilityPack.HtmlDocument();
                    doc.LoadHtml(summary);
                    foreach (HtmlNode link in doc.DocumentNode.SelectNodes("//a[@href]"))
                    {
                        HtmlAttribute att = link.Attributes["href"];
                        if (att.Value.EndsWith(".gifv") || att.Value.EndsWith(".gif"))
                        {
                            Utils.GetImage(att.Value.Replace(".gifv", ".gif"), subject, "REDDIT" + DateTime.Today.Year + "-" + DateTime.Today.Month + "-" + DateTime.Today.Day);
                        }

                    }
                    if (i++ >= 10)
                        break;
                }

            }
            MessageBox.Show("FIN");
        }

        private void lenguage_SelectedIndexChanged(object sender, EventArgs e)
        {
            this.updateCategories();
        }

        private void durante_TextChanged(object sender, EventArgs e)
        {

        }

        private void textBox2_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
