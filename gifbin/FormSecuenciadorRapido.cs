using AForge.Video.FFMPEG;
using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Speech.Synthesis;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace gifbin
{
    public partial class FormSecuenciadorRapido : Form
    {
        public string forcedTags { get; private set; }

        public FormSecuenciadorRapido()
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

        private void FormSecuenciadorRapido_Load(object sender, EventArgs e)
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
            List<string> list = new List<string>();
            
            CsvLine l = new CsvLine() { title = "DUMMY CSV LINE", grupo = "DUMMY CSV LINE" };
            file.lines.Add(l);

            string previousCaptionTime = "00:00:02.100";
            int contCaptions = 1;
            foreach (CsvLine k in file.lines)
            {
               
                contlineas++;
                grupo = k.grupo;

                if (grupo != antGrupo || contlineas == file.lines.Count)
                {
                    filename = Utils.Slug(grupo);
                    
                    if (antGrupo != "")
                    {
                        finalFile = Utils.Slug(antGrupo);
                        list.Add(Directory.GetCurrentDirectory() + "\\silence.wav");
                        VideoSounds.Concatenate("FINALSOUND-" + finalFile + ".wav", list);
                        list.Clear();
                        String auxDuration = FFMPGScripter.getDurationOfAvi("TEMP-" + finalFile + "-0.avi");
                        var time = auxDuration.Split('.');
                        time = time[0].Split(':');
                        double videoDuration = new TimeSpan(Convert.ToInt16(time[0]), Convert.ToInt16(time[1]), Convert.ToInt16(time[2])).TotalSeconds;

                        auxDuration = FFMPGScripter.getDurationOfAvi("FINALSOUND-" + finalFile + ".wav");
                        time = auxDuration.Split('.');
                        time = time[0].Split(':');
                        double audioDuration = new TimeSpan(Convert.ToInt16(time[0]), Convert.ToInt16(time[1]), Convert.ToInt16(time[2])).TotalSeconds;

                        double numRepes = audioDuration / videoDuration;
                        String videoFileLoopList = "";
                        for (int h = 1; h <= Math.Max(1, numRepes); h++)
                        {
                            videoFileLoopList = videoFileLoopList + "file '" + Directory.GetCurrentDirectory() + "\\" + "TEMP-" + finalFile + "-0.avi'" + System.Environment.NewLine;
                        }
                        FFMPGScripter.Concatenate(videoFileLoopList, "TEMP-" + finalFile + "-framekey");

                        System.GC.Collect();
                        FFMPGScripter.AddSoundtoVideo("TEMP-" + finalFile + "-framekey.avi", "FINALSOUND-" + finalFile + ".wav","FINAL",false);


                        Utils.Console("Current group:" + grupo);
                        
                      

                        System.Threading.Thread.Sleep(1000);
                        DateTime d = DateTime.Today;
                        Random rnd = new Random();
                        // d = d.AddDays(Convert.ToInt16(contYtfiles++/ 2));
                        d = d.AddHours(rnd.Next(0, 24));

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
                            MediaFile = "FINALTEMP-"+finalFile + "-framekey.avi",
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
                        if (grupo.IndexOf("DUMMY CSV LINE") >= 0)
                        {
                            Utils.Console("Csv procesado");
                            break;
                        }
                    }
                   
                    diapos(filename, ref fileList, grupo, k.frontPicture, 0);
                    antGrupo = grupo;
                    contVideos = 0;
                    
                }
                if (grupo.IndexOf("DUMMY CSV LINE") >= 0)
                {
                    Utils.Console("Csv procesado");
                    break;
                }
                title = grupo;
                
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
                    if (k.title!="")
                        slides[0] =  k.title + "." + Environment.NewLine + slides[0];
                    for (int m = 0; m < slides.Length; m++)
                    {
                        if (slides[m].Equals(""))
                            break;
                        txt = slides[m];
                        VideoSounds.speak(txt, filename + "-" + contDiapos, this.Voz.SelectedItem.ToString());
                        
                        description = description + txt + System.Environment.NewLine;
                        //Caption issues
                        oldTime = previousCaptionTime.Split('.');
                        oldTime = oldTime[0].Split(':');
                        captionDuration = new TimeSpan(Convert.ToInt16(oldTime[0]), Convert.ToInt16(oldTime[1]), Convert.ToInt16(oldTime[2]));
                        duration = FFMPGScripter.getDurationOfAvi("TEMPSOUND-" + filename + "-" + contDiapos + ".wav");                        
                        list.Add(Directory.GetCurrentDirectory() + "\\TEMPSOUND-" + filename + "-" + contDiapos + ".wav");
                        newTime = duration.Split('.');
                        newTime = newTime[0].Split(':');
                        
                        captionDuration = captionDuration.Add(new TimeSpan(Convert.ToInt16(newTime[0]), Convert.ToInt16(newTime[1]), Convert.ToInt16(newTime[2])));
                        captions = captions + contCaptions++ + System.Environment.NewLine;
                        captions = captions + previousCaptionTime.Replace(".", ",") + " --> " + captionDuration.ToString().Replace(".", ",") + System.Environment.NewLine;
                        captions = captions + txt + System.Environment.NewLine;
                        captions = captions + System.Environment.NewLine;
                        previousCaptionTime = captionDuration.ToString();

                        System.IO.StreamWriter fileCaption = new System.IO.StreamWriter("FINALTEMP-" + Utils.Slug(k.grupo) + "-framekey.rst");
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
          


            string fileLoopList;
            if (bg.IndexOf("|") >= 0)
            {
                var aux = bg.Split('|');
                Random rnd = new Random();
                string cual = aux[rnd.Next(0, aux.Length - 1)];
                bg = cual;
            }
            if (bg.IndexOf("http:") >= 0)
            {
                Utils.GetImage(bg, "TEMP" + Utils.Slug(filename), ".", true);
                System.Threading.Thread.Sleep(2000);
                bg = "TEMP" + Utils.Slug(filename) + ".jpg";


            }
            if (!File.Exists(bg) || bg.Equals(""))
            {
                bg = "comun.jpg";
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
         
            VideoFileWriter writer = new VideoFileWriter();
     
            writer.Open("TEMP-" + filename + "-" + cont + ".avi", Const.width, Const.height, Const.frameRate, VideoCodec.MSMPEG4v3, 4000000);
            VideoImages.imagenGifAnimado(writer, bg, 1, text, "");

            writer.Close();
            writer.Dispose();

       
        }
        public void processCSV(String csvFile)
        {
            Utils.CleanTempFiles();
            var reader = new StreamReader(File.OpenRead(csvFile), Encoding.UTF8);


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
                        frontPicture = values.Length >= 5 ? values[4] : "",
                        Mod = values.Length >= 6 ? values[5] : ""
                    };

                    file.lines.Add(dum);
                }
            }
            generateMovies(file);
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
    

 

        private void button1_Click_1(object sender, EventArgs e)
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
            String csvFile = "";
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
        }

        private void language_SelectedIndexChanged(object sender, EventArgs e)
        {
            updateCategories();
        }

        private void tags_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
