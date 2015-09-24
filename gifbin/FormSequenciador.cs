
using AForge.Video.FFMPEG;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System;
using System.Speech.Synthesis;
using Microsoft.VisualBasic.FileIO;
using System.Text.RegularExpressions;

namespace gifbin
{

    public partial class FormSequenciador : Form
    {
        public string forcedTags { get; private set; }

        public FormSequenciador()
        {
            InitializeComponent();
        }
        public class CsvLine
        {
            public String grupo { get; set; }
            public String title { get; set; }
            public String text { get; set; }

            public String bgAnimation { get; set; }
            public String frontPicture { get; set; }

            public bool showText = true;

            public String Mod { get; set; }

}
        public class CsvFile
        {
            public String fileName { get; set; }
            public String title { get; set; }
            public bool firstColumn { get; set; }
            public List<CsvLine> lines = new List<CsvLine>();
        }

        private void Form4_Load(object sender, EventArgs e)
        {
           // new UploadVideo().uploadCaptions("jGzbRTE4lmk", "en", "pruebacaptions");

            
          //REFERENCIA MsgBox.Show("ACTIVEVOICEPROJECTLIB");
          SpeechSynthesizer synth = new SpeechSynthesizer();
          var o = synth.GetInstalledVoices();
          foreach (InstalledVoice v in o)
          {

              var x = v.VoiceInfo.Name;
              Voz.Items.Add(v.VoiceInfo.Name);
          }
          /*
          synth.SelectVoice("Microsoft Helena Desktop");
          //synth.SelectVoiceByHints(VoiceGender.Male, VoiceAge.Adult, 1, System.Globalization.CultureInfo.CurrentCulture);
          //synth.SetOutputToWaveFile("sample.wav");
          // Build a prompt.
          PromptBuilder builder = new PromptBuilder();
          builder.AppendText("esto es una puta mierda y no funciona ni pa tras");

          // Speak the string asynchronously.
          synth.Speak(builder);
          */

        }
        private void generateMovies(CsvFile file)
        {

            Graphics g;


            //VideoSounds.startSounds(filename + "wav");

            String description = "";
            String captions = "";
            int contVideos = 0;
            String filename;
            String grupo = "";
            string fileList = "";
            String title = "";
            String finalFile = "";
            String antGrupo = "";
            int contlineas = 0;
            int contYtfiles = 0;
            CsvLine l = new CsvLine() { title = "DUMMY CSV LINE", grupo = "DUMMY CSV LINE" };
            file.lines.Add(l);

            string previousCaptionTime = "00:00:01.100";
            int contCaptions = 1;
            foreach (CsvLine k in file.lines)
            {
                /*
                if (contlineas == 0)
                {
                    var dum = 0;
                    var dum2 = "";
                    diapos("dummy.avi", ref dum2, "a", k.bgAnimation, dum);

                }
                */
                contlineas++;
                grupo = k.grupo;

                if (grupo != antGrupo || contlineas == file.lines.Count)
                {
                    if (antGrupo != "")
                    {
                        Utils.Console("Current group:" + grupo);
                        finalFile = Utils.Slug(antGrupo);
                        FFMPGScripter.Concatenate(fileList, finalFile);
                        fileList = "";

                        System.Threading.Thread.Sleep(1000);
                        DateTime d = DateTime.Today;
                        Random rnd = new Random();
                       // d = d.AddDays(Convert.ToInt16(contYtfiles++/ 2));
                        d = d.AddHours(rnd.Next(0,24));
                        
                        String tags = this.tags.Text + title + "," + forcedTags;
                        tags = tags.Replace(":", ",");
                        YTVideo ytVideo = new YTVideo
                        {
                            Title = title,
                            Descrip = description,
                            Tags = tags.Split(','),
                            CategoryId = "22",
                            PublishedAt = d,
                            Captions = captions,
                            MediaFile = finalFile + ".avi",
                            Language = language.SelectedItem.ToString(),
                            InfoFile = finalFile + ".ytjson"
                        };
                        Utils.writeJson(finalFile + ".ytjson", ytVideo);

                        new UploadVideo(ytVideo).init();

                        while (Const.isUploadingVideo)
                        {
                            System.Threading.Thread.Sleep(1000);
                            //Utils.Console("Video subiendo " + finalFile + ".avi");
                        }
                        Utils.Console("Video subido " + finalFile + ".avi");
                        Utils.CleanTempFiles();
                        description = "";
                        captions = "";
                        previousCaptionTime = "00:00:01.100";

                    }
                    antGrupo = grupo;
                    contVideos = 0;
                }

                title = grupo;
                if (title.IndexOf("DUMMY CSV LINE") >= 0)
                {
                    Utils.Console("Csv procesado");
                    break;
                }
                filename = Utils.Slug(grupo + "-" + contVideos);
                antGrupo = grupo;
                int contDiapos = 0;
                String duration;
                String txt = k.text;
                string[] oldTime;
                string[] newTime;
                TimeSpan captionDuration;
                if (k.title.Equals("ONLYDESC"))
                {
                    description = description + k.text + System.Environment.NewLine;
                //    description = description + "Fuente: gallerquina http://www.lagallerquina.blogspot.com" + System.Environment.NewLine;
                }
                else
                if (k.title.Equals("ONLYTAGS"))
                {
                    forcedTags = k.text;
                }
                else
                {
                    if (k.title != "")
                    {


                        txt = k.title;
                        diapos(filename, ref fileList, txt, k.bgAnimation, contDiapos);
                        description = description + txt + System.Environment.NewLine;

                        //Caption issues
                        oldTime = previousCaptionTime.Split('.');
                        oldTime = oldTime[0].Split(':');
                        captionDuration = new TimeSpan(Convert.ToInt16(oldTime[0]), Convert.ToInt16(oldTime[1]), Convert.ToInt16(oldTime[2]));
                        duration = FFMPGScripter.getDurationOfAvi("FINALTEMP-" + filename + "-" + contDiapos + "-framekey.avi");
                        newTime = duration.Split('.');
                        newTime = newTime[0].Split(':');
                        captionDuration = captionDuration.Add(new TimeSpan(Convert.ToInt16(newTime[0]), Convert.ToInt16(newTime[1]), Convert.ToInt16(newTime[2])));
                        captions = captions + contCaptions++ + System.Environment.NewLine;
                        captions = captions + previousCaptionTime.Replace(".", ",") + " --> " + captionDuration.ToString().Replace(".", ",") + System.Environment.NewLine;
                        captions = captions + txt + System.Environment.NewLine;
                        captions = captions + System.Environment.NewLine;
                        previousCaptionTime = captionDuration.ToString();

                        contDiapos++;
                    }
                    txt = k.text;
                    if (k.Mod.Equals("JOIN"))
                    {
                        k.text = k.text.Replace("." + System.Environment.NewLine, ", ");
                        k.text = k.text.TrimEnd(new char[] { ',', ' ' });
                    }
                    String[] slides = new String[] { k.text };
                    if (k.Mod.Equals("SPLIT"))
                    {
                        slides = k.text.Split(new string[] { Environment.NewLine }, StringSplitOptions.None);
                    }
                    for (int m = 0; m < slides.Length; m++)
                    {
                        if (slides[m].Equals(""))
                            break;
                        txt = slides[m];

                        diapos(filename, ref fileList, txt, k.bgAnimation, contDiapos);
                        description = description + txt + System.Environment.NewLine;
                        //Caption issues
                        oldTime = previousCaptionTime.Split('.');
                        oldTime = oldTime[0].Split(':');
                        captionDuration = new TimeSpan(Convert.ToInt16(oldTime[0]), Convert.ToInt16(oldTime[1]), Convert.ToInt16(oldTime[2]));
                        duration = FFMPGScripter.getDurationOfAvi("FINALTEMP-" + filename + "-" + contDiapos + "-framekey.avi");
                        newTime = duration.Split('.');
                        newTime = newTime[0].Split(':');
                        captionDuration = captionDuration.Add(new TimeSpan(Convert.ToInt16(newTime[0]), Convert.ToInt16(newTime[1]), Convert.ToInt16(newTime[2])));
                        captions = captions + contCaptions++ + System.Environment.NewLine;
                        captions = captions + previousCaptionTime.Replace(".", ",") + " --> " + captionDuration.ToString().Replace(".", ",") + System.Environment.NewLine;
                        captions = captions + txt + System.Environment.NewLine;
                        captions = captions + System.Environment.NewLine;
                        previousCaptionTime = captionDuration.ToString();

                        System.IO.StreamWriter fileCaption = new System.IO.StreamWriter(Utils.Slug(k.grupo) + ".rst");
                        fileCaption.Write(captions);
                        fileCaption.Close();

                        contDiapos++;
                        contVideos++;
                    }
                }
            }
        }

        private void diapos(String filename, ref String fileList, String text, String bg, int cont)
        {
            //3 segundos
            //10 segundos
            //30 segundos
            //un minuto
            Fades.fading = false;
            Fades.fadeIn = 0;
            Fades.fadeOut = 0;


            string fileLoopList;
            if (bg.IndexOf("|") >= 0)
            {
                var aux = bg.Split('|');
                Random rnd = new Random();
                string cual = aux[rnd.Next(0, aux.Length-1)];
                bg = cual;
            }
            if (bg.IndexOf("http:") >= 0)
            {
                Utils.GetImage(bg, "TEMP" + Utils.Slug(filename), ".",true);
                System.Threading.Thread.Sleep(2000);
                bg = "TEMP" + Utils.Slug(filename) + ".jpg";
                

            }
            if (!File.Exists(bg)|| bg.Equals(""))
            {
                bg = Const.comunbg;
            }
            Image gifImg = Image.FromFile(bg);
            FrameDimension dimension = new FrameDimension(gifImg.FrameDimensionsList[0]);
            double frameCount = gifImg.GetFrameCount(dimension);
            gifImg.Dispose();

            double gifDuration = 0;
            if (frameCount != 1)
                gifDuration = frameCount / Convert.ToDouble(Const.frameRate);
            else
                gifDuration = Const.minGifDuration;
            double minDuration = 2;
            double numRepes = minDuration / gifDuration;
            Fades.fadeIn = 250;
            Fades.fading = true;
            VideoFileWriter writer = new VideoFileWriter();
            writer.Open("TEMP-" + filename + "-" + cont + "-in.avi", Const.width, Const.height, Const.frameRate, VideoCodec.MSMPEG4v3, 4000000);
            VideoImages.imagenGifAnimado(writer, bg, 1, text, "", Convert.ToInt16(Math.Max(1, numRepes)));
            writer.Close();
            writer.Dispose();
            System.GC.Collect();
            fileLoopList = "file '" + Directory.GetCurrentDirectory() + "\\" + "TEMP-" + filename + "-" + cont + "-in.avi'" + System.Environment.NewLine;
            Fades.fading = false;


            writer = new VideoFileWriter();
            writer.Open("TEMP-" + filename + "-" + cont + ".avi", Const.width, Const.height, Const.frameRate, VideoCodec.MSMPEG4v3, 4000000);
            VideoImages.imagenGifAnimado(writer, bg, 1, text, "");
           
            writer.Close();
            writer.Dispose();
           
            System.GC.Collect();
            int numWords = text.Split(' ').Length;
            double wordsPerSecond = 1;
            minDuration = numWords / wordsPerSecond;
            numRepes = minDuration / gifDuration;
            for (int h = 1; h <= Math.Max(1,numRepes); h++)
            {
                fileLoopList = fileLoopList + "file '" + Directory.GetCurrentDirectory() + "\\" + "TEMP-" + filename + "-" + cont + ".avi'" + System.Environment.NewLine;
            }

          /*
            Fades.fadeOut = 250;
            Fades.fading = true;
            writer = new VideoFileWriter();
            writer.Open("TEMP-" + filename + "-" + cont + "-out.avi", Const.width, Const.height, Const.frameRate, VideoCodec.MPEG4, 1000000);
            VideoImages.imagenGifAnimado(writer, bg, 1, text, "", Convert.ToInt16(Math.Max(1, Fades.steps / frameCount)));
            writer.Close();
            writer.Dispose();
            */
            
            FFMPGScripter.Concatenate(fileLoopList, "TEMP-" + filename + "-" + cont + "-framekey");
           
            VideoSounds.speak(text, "TEMP-" + filename, this.Voz.SelectedItem.ToString());
            System.GC.Collect();
            FFMPGScripter.AddSoundtoVideo("TEMP-" + filename + "-" + cont + "-framekey.avi", "TEMPSOUND-" + filename + ".wav");
            /*
            fileLoopList = "file '" + Directory.GetCurrentDirectory() + "\\" + "TEMPWITHAUDIOTEMP-" + filename + "-" + cont + "-framekey.avi'" + System.Environment.NewLine;
            fileLoopList = fileLoopList + "file '" + Directory.GetCurrentDirectory() + "\\" + "TEMP-" + filename + "-" + cont + "-out.avi'" + System.Environment.NewLine;
            FFMPGScripter.Concatenate(fileLoopList, "FINALTEMP-" + filename + "-" + cont + "-framekey");
            */
            double duration = TimeSpan.Parse(FFMPGScripter.getDurationOfAvi("FINALTEMP-" + filename + "-" + cont + "-framekey.avi")).TotalSeconds;
            //FFMPGScripter.Concatenate(fileLoopList, "TEMP-" + filename + "-" + cont + "-framekey");
            System.GC.Collect();
            /*
            description = description + text + System.Environment.NewLine;
            captions = captions + Const.framesInThisVideo + "->" + text + System.Environment.NewLine;
            */
            fileList = fileList + "file '" + Directory.GetCurrentDirectory() + "\\" + "FINALTEMP-" + filename + "-" + cont + "-framekey.avi'" + System.Environment.NewLine;
            Utils.Console("Diapositiva hecha de " + "FINALTEMP-" + filename + "-" + cont + "-framekey.avi");
        }
        public void processCSV(String csvFile)
        {
            Utils.CleanTempFiles();
            var reader = new StreamReader(File.OpenRead(csvFile),Encoding.UTF8);


            CsvFile file = new CsvFile();
            using (var csvReader = new TextFieldParser(reader))
            {
                while (true)
                {
                    string[] values = null;

                    csvReader.SetDelimiters(new string[] { ";" });
                    csvReader.HasFieldsEnclosedInQuotes = true;
                    values = csvReader.ReadFields();
                    if (values == null)
                        break;
                    values[1] = Utils.fixString(values[1]);
                    values[2] = Utils.fixString(values[2]);

                    CsvLine dum = new CsvLine()
                    {
                        //grupo,titulo,texto,anim,image
                        //el titulo, puede ser igual al grupo
                        grupo = System.Net.WebUtility.HtmlDecode(values[0]),
                        title = System.Net.WebUtility.HtmlDecode(values[1]),
                        text = System.Net.WebUtility.HtmlDecode(values[2]),
                        bgAnimation = values[3],
                        frontPicture=values.Length>=5?values[4]:"",
                        Mod=values.Length>=6?values[5]:""
                    };

                    file.lines.Add(dum);
                }
            }
            generateMovies(file);
        }
        private void button1_Click(object sender, EventArgs e)
        {
            Const.staticBg = new Bitmap(this.fondostatic.Text);
            if (this.textColor.SelectedItem.ToString().Equals("Negro"))
                Const.textColor = System.Drawing.Color.Black;
            if (this.textColor.SelectedItem.ToString().Equals("Blanco"))
                Const.textColor = System.Drawing.Color.White;
            if (this.textColor.SelectedItem.ToString().Equals("Verde"))
                Const.textColor = System.Drawing.Color.ForestGreen;
            if (this.textColor.SelectedItem.ToString().Equals("Rojo"))
                Const.textColor = System.Drawing.Color.Red;
            if (this.textColor.SelectedItem.ToString().Equals("Azul"))
                Const.textColor = System.Drawing.Color.AliceBlue;
            if (this.textColor.SelectedItem.ToString().Equals("Amarillo"))
                Const.textColor = System.Drawing.Color.Yellow;
            if (this.textColor.SelectedItem.ToString().Equals("Fosforito"))
                Const.textColor = System.Drawing.Color.LightYellow;
            Const.blackBars = false;
            Utils.ConsoleClear();
            String csvFile="";
            OpenFileDialog openFileDialog1 = new OpenFileDialog();
            openFileDialog1.InitialDirectory = ".";
            openFileDialog1.Filter = "csv files (*.csv)|*.csv";
            openFileDialog1.FilterIndex = 2;
            openFileDialog1.RestoreDirectory = true;
            if (openFileDialog1.ShowDialog() == DialogResult.OK)
            {
                csvFile = openFileDialog1.FileName;
            }
            processCSV(csvFile);

        
            /*
                        using WMPLib;

            var player = new WindowsMediaPlayer();
            var clip = player.newMedia(filePath);
            Console.WriteLine(TimeSpan.FromSeconds(clip.duration));
             * */

        }
        private void updateCategories()
        {
            System.IO.StreamReader file;
            String line;
            if (this.language.SelectedItem.ToString().Equals("es"))
                file = new System.IO.StreamReader("CATEGORIESES.txt");
            else
                file = new System.IO.StreamReader("CATEGORIESUS.txt");
            while ((line = file.ReadLine()) != null)
            {
                var values = line.Split(';');
                this.categories.Items.Add(new ListItem(values[1], Convert.ToInt16(values[0])));

            }

            file.Close();
        }
        private void language_SelectedIndexChanged(object sender, System.EventArgs e)
        {
            updateCategories();
        }

        private void Voz_SelectedIndexChanged(object sender, System.EventArgs e)
        {

        }

        private void categories_SelectedIndexChanged(object sender, System.EventArgs e)
        {
            var t = this.categories.SelectedText;
        }

        private void textColor_SelectedIndexChanged(object sender, EventArgs e)
        {

        }
    }
}
