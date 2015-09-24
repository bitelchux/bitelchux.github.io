using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using SpeechLib;
using System.Speech.Synthesis;
using System.Xml;
using System.ServiceModel.Syndication;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
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
    public partial class FormMain : Form
    {
        public FormMain()
        {
            InitializeComponent();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            FormVideosWhatsapp frm = new FormVideosWhatsapp();
            frm.Show();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            FormSequenciador frm = new FormSequenciador();
            frm.Show();
        }

        private void Main_Load(object sender, EventArgs e)
        {
            Utils.CleanTempFiles();
            string[] files = System.IO.Directory.GetFiles("certificados","*.json");

            this.credenciales.Items.AddRange(files);

            /*
            //REFERENCIA MsgBox.Show("ACTIVEVOICEPROJECTLIB");
            SpeechSynthesizer synth = new SpeechSynthesizer();
            var o = synth.GetInstalledVoices();
            foreach (InstalledVoice v in o)
            {

                var x = v.VoiceInfo.Name;
            }
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

        private void button3_Click(object sender, EventArgs e)
        {
            
       
        }

        private void button3_Click_1(object sender, EventArgs e)
        {
            Utils.refreshCategories();
        }

        private void button4_Click(object sender, EventArgs e)
        {
            Utils.ConsoleClear();
            UploadVideo.uploadSampleVideo();
        }

        private void button5_Click(object sender, EventArgs e)
        {
            var dir = new DirectoryInfo(".");
            foreach (var f in dir.EnumerateFiles("*.ytjson"))
            {
                YTVideo ytVideo = Utils.readJson(f.Name);

                while (Const.isUploadingVideo)
                {
                    System.Threading.Thread.Sleep(2000);
                }
                new UploadVideo(ytVideo).init();

            }
            /*
            String ytFile = "";
            OpenFileDialog openFileDialog1 = new OpenFileDialog();
            openFileDialog1.InitialDirectory = ".";
            openFileDialog1.Filter = "ytjson files (*.ytjson)|*.ytjson";
            openFileDialog1.FilterIndex = 2;
            openFileDialog1.RestoreDirectory = true;
            if (openFileDialog1.ShowDialog() == DialogResult.OK)
            {
                ytFile = openFileDialog1.FileName;
            }
            YTVideo ytVideo= Utils.readJson(ytFile);

            while (Const.isUploadingVideo)
            {
                System.Threading.Thread.Sleep(2000);
            }
            new UploadVideo(ytVideo).init();
            */
        }

        private void linkLabel1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {

        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void button6_Click(object sender, EventArgs e)
        {
            if (this.credenciales.SelectedItem==null)
                MessageBox.Show("seleccione unas credenciales");
            else { 
                new UploadVideo().GetChannelName();
                this.panel1.Visible = true;
            }
        }

        private void credenciales_SelectedIndexChanged(object sender, EventArgs e)
        {
            Const.credentials = this.credenciales.SelectedItem.ToString();
        }

        private void button7_Click(object sender, EventArgs e)
        {
            FormSecuenciadorRapido frm = new FormSecuenciadorRapido();
            frm.Show();
        }

        private void button8_Click(object sender, EventArgs e)
        {
            FormAudioBooks frm = new FormAudioBooks();
            frm.Show();
        }
    }
}
