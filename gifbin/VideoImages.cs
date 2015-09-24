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
    public static class VideoImages
    {
        /*
        public static double AnimatedGifDuration(String gifFile)
        {
            Image gifImg = Image.FromFile(gifFile);
            FrameDimension dimension = new FrameDimension(gifImg.FrameDimensionsList[0]);
            // Number of frames
            int frameCount = gifImg.GetFrameCount(dimension);
            double times=BitConverter.ToInt32(gifImg.GetPropertyItem(0x5100).Value,0)/4;
            if (times == 0)
                times = 1;
            else 
                times = times/2.0;
         
            var timesx = gifImg.GetPropertyItem(0x5100).Value;
            var duration = BitConverter.ToInt32(timesx, 4 * frameCount % timesx.Length);

            AnimatedGif aniGif = new AnimatedGif(gifFile);
            double totalDuration = 0;
            for (int i = 0; i < aniGif.Images.Count; i++)
            {
                totalDuration += aniGif.Images[i].Duration;                
            }
            var dura = totalDuration;
            return Convert.ToDouble((frameCount/times) / Convert.ToDouble(Const.frameRate));

        }
         */
        public static int imagenGifAnimado(VideoFileWriter writer, String gifFile, int speed, String txt = "", String verticalAlign = "",int numberOfTimes=1)
        {
            Image gifImg = Image.FromFile(gifFile);
          
            FrameDimension dimension = new FrameDimension(gifImg.FrameDimensionsList[0]);
            // Number of frames
            int frameCount = gifImg.GetFrameCount(dimension);
            // Return an Image at a certain index
            int minIterations = Const.frameRate;
            if (frameCount == 1)
                minIterations = Const.frameRate * Const.minGifDuration;
            for (int index = 0; index < Math.Max(frameCount * speed * numberOfTimes, minIterations); index++)
            {             
                try
                {
                    gifImg.SelectActiveFrame(dimension, Convert.ToInt16((index / speed) % frameCount));
                    Graphics g = Graphics.FromImage(gifImg);
                    Bitmap b = new Bitmap(gifImg);
                    //OJO
                    if (b.Width!=Const.width || b.Height!= Const.height)
                        b = Utils.ResizeImage(b, new Size(Const.width, Const.height));
                    g = Graphics.FromImage(b);

                   
                    if (txt != "")
                    {
                       centeredLetters(writer, b, txt, 0, verticalAlign);
                    }
                    if (Fades.fading)
                    {
                        if (Fades.fadeIn > 0)
                        {
                            Fades.fadeIn = Fades.fadeIn - 250 / Fades.steps;
                            using (System.Drawing.Brush brush = new SolidBrush(System.Drawing.Color.FromArgb(Math.Max(0, Fades.fadeIn), 0, 0, 0)))
                            {
                                g.FillRectangle(brush, 0, 0, Const.width, Const.height);
                            }
                            if (Fades.fadeIn <= 0)
                            {
                                Fades.fading = false;
                            }
                        }else 
                        {
                            Fades.fadeOut = Fades.fadeOut - 250/Fades.steps;
                            using (System.Drawing.Brush brush = new SolidBrush(System.Drawing.Color.FromArgb(Math.Max(0,Math.Min(250, 250 - Fades.fadeOut)), 0, 0, 0)))
                            {
                                g.FillRectangle(brush, 0, 0, Const.width, Const.height);
                            }
                        }
                    }
                    
                    g.Save();
                    writer.WriteVideoFrame(b);
                    Const.GLOBALFrameCount++;
                    g.Dispose();
                    b.Dispose();
                    Const.framesInThisVideo = Const.framesInThisVideo + 1;
                    
                    
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.ToString());
                    return 0;
                }
                
            }
            //OJO ANTES ERA SOLO FRAMECOUNT
            return frameCount * speed * numberOfTimes;
        }
        public static void lettersFondoAnimado(VideoFileWriter writer, String gifFile,String txt = "", String verticalAlign = "")
        {
            Image gifImg = Image.FromFile(gifFile);
            FrameDimension dimension = new FrameDimension(gifImg.FrameDimensionsList[0]);        
            int frameCount = gifImg.GetFrameCount(dimension);
            int duracion = txt.Length * Const.duracionCadaLetra/2 * Const.frameRate/10;
            
            for (int cont = 0; cont < duracion; cont++)
            {                
                try
                {
                    gifImg.SelectActiveFrame(dimension, Convert.ToInt16(cont % frameCount));
                    //Graphics g = Graphics.FromImage(gifImg);
                    Bitmap b = new Bitmap(gifImg);
                    b = Utils.ResizeImage(b, new Size(Const.width, Const.height));
                    Graphics g = Graphics.FromImage(b);

                    

                    centeredLetters(writer, b, txt, 0, verticalAlign);
                    g.Save();
                    writer.WriteVideoFrame(b);
                    Const.framesInThisVideo = Const.framesInThisVideo + 1;
                    g.Dispose();
                    b.Dispose();
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.ToString());
                }            
            }
            
            
        }
        public static void centeredLetters(String gifImg, String text)
        {
            StringFormat stringFormat = new StringFormat()
            {
                Alignment = StringAlignment.Center,
                LineAlignment = StringAlignment.Center
            };
            Bitmap b = (Bitmap)Image.FromFile(gifImg, true);
            b = Utils.ResizeImage(b, new Size(Const.width, Const.height));
            Graphics g = Graphics.FromImage(b);
            var font = new Font("Verdana", 30);
            using (var sf = new StringFormat()
            {
                Alignment = StringAlignment.Center,
                LineAlignment = StringAlignment.Center,
            })
            {
                var brush = new SolidBrush(System.Drawing.Color.FromArgb(255, Const.textColor));
                var brushBlack = new SolidBrush(System.Drawing.Color.Black);
                g.DrawString(text, font, brushBlack, new Rectangle(0-2, 0+2, b.Width+b.Width/4, b.Height), sf);
                g.DrawString(text, font, brush, new Rectangle(0, 0, b.Width + b.Width / 4, b.Height), sf);
            }
            b.Save("FINAL-" + gifImg.Split('\\')[gifImg.Split('\\').Length-1]);
        }
        public static void centeredLetters(VideoFileWriter writer, Bitmap image, String txt, int durationInSegs, String verticalAlign = "")
        {
            Graphics g;
            if (image==null){
                image = new Bitmap(Const.width, Const.height);
                g = Graphics.FromImage(image);
                g.FillRectangle(System.Drawing.Brushes.Black, 0, 0, Const.width, Const.height);
            }else{
                g = Graphics.FromImage(image);
            }
            
            
            List<String> aux = Utils.WrapText(txt, Convert.ToDouble(Const.width), "Verdana", 30);
            txt = String.Join(System.Environment.NewLine, aux);


            Font f = new Font("Verdana", 30);
            SizeF stringSize = g.MeasureString(txt, f);
            PointF startingLocation;
            //Determine starting point for drawing            
            startingLocation = new PointF((Const.width - stringSize.Width) / 2 + 80, (Const.height - stringSize.Height) / 2);
            if (verticalAlign.ToUpper().Equals("TOP"))
                startingLocation = new PointF((Const.width - stringSize.Width) / 2, 0);
            if (verticalAlign.ToUpper().Equals("BOTTOM"))
                startingLocation = new PointF((Const.width - stringSize.Width) / 2, (Const.height - stringSize.Height));
            letters(writer,image, txt, durationInSegs, Convert.ToInt32(startingLocation.X), Convert.ToInt32(startingLocation.Y));
            g.Dispose();

        }
        public static void letters(VideoFileWriter writer,Bitmap image,String txt, int durationInSegs, int x, int y)
        {
            //letras
            bool isOverlayed = false ;
            int opacity = 0;
            if (durationInSegs==0)
                opacity = 255;
            Graphics g;
            if (image == null)
            {
                image = new Bitmap(Const.width, Const.height);
                g = Graphics.FromImage(image);
                g.FillRectangle(System.Drawing.Brushes.Black, 0, 0, Const.width, Const.height);
            }
            else
            {
                isOverlayed = true;
                g = Graphics.FromImage(image);
            }  
            for (int j = 0; j <= Math.Max(1, durationInSegs * Const.frameRate); j++)
            {
                                                             
                var b = new SolidBrush(System.Drawing.Color.FromArgb(Math.Min(opacity, 255), Const.textColor));
                opacity = opacity + 10;
                g.DrawString(txt, new System.Drawing.Font("Verdana", 30), b, x, y);
                if (!isOverlayed)
                {
                    g.Save();
                    writer.WriteVideoFrame(image);
                    Const.framesInThisVideo = Const.framesInThisVideo + 1;
                }
               
                
            }
            g.Dispose();
        }
    }
}
