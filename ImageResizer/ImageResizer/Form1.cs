using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ImageResizer
{
    public partial class Form1 : Form
    {
        Bitmap originalImg;
        String originalImgPath;
        String[] WINDOWS10_SIZES= { "300x300",
                                "358x173",
                                "358x358",
                                "1000x800",
                                "414x180",
                                "414x468",
                                "558x558",
                                "558x756",
                                "846x468",
                                "2400x1200"                                
                                };

        public Form1()
        {
            InitializeComponent();
        }
        private void resizeImage(string path, string originalFilename,
            /* note changed names */
                     int canvasWidth, int canvasHeight,
            /* new */
                     int originalWidth, int originalHeight)
        {
            Image image = Image.FromFile(path + originalFilename);

            System.Drawing.Image thumbnail =
                new Bitmap(canvasWidth, canvasHeight); // changed parm names
            System.Drawing.Graphics graphic =
                         System.Drawing.Graphics.FromImage(thumbnail);

            graphic.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphic.SmoothingMode = SmoothingMode.HighQuality;
            graphic.PixelOffsetMode = PixelOffsetMode.HighQuality;
            graphic.CompositingQuality = CompositingQuality.HighQuality;

            /* ------------------ new code --------------- */

            // Figure out the ratio
            double ratioX = (double)canvasWidth / (double)originalWidth;
            double ratioY = (double)canvasHeight / (double)originalHeight;
            // use whichever multiplier is smaller
            double ratio = ratioX < ratioY ? ratioX : ratioY;

            // now we can get the new height and width
            int newHeight = Convert.ToInt32(originalHeight * ratio);
            int newWidth = Convert.ToInt32(originalWidth * ratio);

            // Now calculate the X,Y position of the upper-left corner 
            // (one of these will always be zero)
            int posX = Convert.ToInt32((canvasWidth - (originalWidth * ratio)) / 2);
            int posY = Convert.ToInt32((canvasHeight - (originalHeight * ratio)) / 2);
            if (comboBox1.SelectedItem.Equals("Blanco"))
                graphic.Clear(Color.White); // white padding
            else
                graphic.Clear(Color.Black); // white padding
            graphic.DrawImage(image, posX, posY, newWidth, newHeight);

            /* ------------- end new code ---------------- */

            System.Drawing.Imaging.ImageCodecInfo[] info =
                             ImageCodecInfo.GetImageEncoders();
            EncoderParameters encoderParameters;
            encoderParameters = new EncoderParameters(1);
            encoderParameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality,
                             100L);
            thumbnail.Save(path + originalFilename.Replace(".jpg", newWidth + ".jpg").Replace(".gif", newWidth + ".gif").Replace(".png", newWidth + ".png"), info[1],
                             encoderParameters);
        }
        private void textBox1_TextChanged(object sender, EventArgs e)
        {

       
        }

        private void button1_Click(object sender, EventArgs e)
        {
            // Set filter options and filter index.
            openFileDialog1.Filter = "JPEG files (*.jpg)|*.jpg|GIF files (*.gif)|*.gif|All files (*.*)|*.*";
            openFileDialog1.FilterIndex = 1;

            openFileDialog1.Multiselect = true;



            // Process input if the user clicked OK.
            if (openFileDialog1.ShowDialog() == DialogResult.OK)
            {
                // Open the selected file to read.
                originalImg = (Bitmap)Image.FromFile(openFileDialog1.FileName);
                originalImgPath = openFileDialog1.FileName.Split('\\')[openFileDialog1.FileName.Split('\\').Length-1];


            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            for (int i = 0; i < WINDOWS10_SIZES.Length; i++)
            {
                int w=Convert.ToInt16(WINDOWS10_SIZES[i].Split('x')[0]);
                int h=Convert.ToInt16(WINDOWS10_SIZES[i].Split('x')[1]);
                this.resizeImage(".\\", originalImgPath, w, h, originalImg.Width, originalImg.Height);
            }
        }

        private void btnGo_Click(object sender, EventArgs e)
        {
            webBrowser1.Navigate(url.Text);
        }
        void wb_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            Bitmap bmp = new Bitmap(100, 100);
            webBrowser1.DrawToBitmap(bmp, new Rectangle(webBrowser1.Location.X, webBrowser1.Location.Y, webBrowser1.Width, webBrowser1.Height));

            bmp.Save("screenshoot.jpg");
        }
        private void button3_Click(object sender, EventArgs e)
        {
            webBrowser1.Width = 800;
            webBrowser1.Height = 800;
            webBrowser1.Navigate(webBrowser1.Url);
            webBrowser1.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(wb_DocumentCompleted);
 
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            /*
            RegistryKey Regkey = null;
            try
            {
                var appName = Process.GetCurrentProcess().ProcessName + ".exe";
                //For 64 bit Machine 
                if (Environment.Is64BitOperatingSystem)
                    Regkey = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SOFTWARE\\Wow6432Node\\Microsoft\\Internet Explorer\\MAIN\\FeatureControl\\FEATURE_BROWSER_EMULATION", true);
                else  //For 32 bit Machine 
                    Regkey = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SOFTWARE\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE_BROWSER_EMULATION", true);

                //If the path is not correct or 
                //If user't have priviledges to access registry 
                if (Regkey == null)
                {
                    MessageBox.Show("Application Settings Failed - Address Not found");
                    return;
                }

                string FindAppkey = Convert.ToString(Regkey.GetValue(appName));

                //Check if key is already present 
                if (FindAppkey == "8000")
                {
                    MessageBox.Show("Required Application Settings Present");
                    Regkey.Close();
                    return;
                }

                //If key is not present add the key , Kev value 8000-Decimal 
                if (string.IsNullOrEmpty(FindAppkey))
                    Regkey.SetValue(appName, unchecked((int)0x1F40), RegistryValueKind.DWord);

                //check for the key after adding 
                FindAppkey = Convert.ToString(Regkey.GetValue(appName));

                if (FindAppkey == "8000")
                    MessageBox.Show("Application Settings Applied Successfully");
                else
                    MessageBox.Show("Application Settings Failed, Ref: " + FindAppkey);


            }
            catch (Exception ex)
            {
                MessageBox.Show("Application Settings Failed");
                MessageBox.Show(ex.Message);
            }
            finally
            {
                //Close the Registry 
                if (Regkey != null)
                    Regkey.Close();
            }
             */
        }

    }
}
