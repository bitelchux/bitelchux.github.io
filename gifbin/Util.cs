using AForge.Video.FFMPEG;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
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
    public class ListItem
    {
        public int Value;
        public string Text;
        public ListItem(string text, int value)
        {
            Value = value;
            Text = text;
        }
        public override string ToString()
        {
            return Text;
        }
    }
  
    public static class Const
    {
        public static int optimalDuration = 1 * 60 * 30;
        //public static int optimalDuration = 2 * 60 * 30;
        //public static int optimalDuration = 1;
        public static int framesInThisVideo = 0;
        public static bool firsVideo = true;
        public static int frameRate = 25;
        public static int width = 1280;
        public static int height = 720;
        public static int duracionCadaLetra = 2; //1 segundo
        public static bool isUploadingVideo = false;
        public static bool blackBars = false;
        public static bool withSound = true;
        public static System.Drawing.Color textColor = System.Drawing.Color.Black;
        public static int minGifDuration = 5;
        public static string credentials = "";
        public static bool resizeWithRatio = true;
        public static Bitmap staticBg = null;
        public static int i = 0;
        public static string comunbg = "comun.jpg";
        public static int GLOBALFrameCount = 0;
    }


    public static class Utils
    {
        public static String fixString(String values)
        {

            values = values.Replace("</li>", "<br/>");
            values = values.Replace("</p>", "<br/>");
            values = values.Replace("<li>", " - ");
            values = values.Replace("</ul>", "<br/>");
            values = values.Replace("<ul>", "");
            values = values.Replace("<li>", " - ");
            for (var j = 0; j < 20; j++)
            {
                values = values.Replace(j + ". ", ".<br/>" + j + ": ");
            }
            RegexOptions options = RegexOptions.None;
            Regex regex = new Regex(@"[ ]{2,}", options);
            values = regex.Replace(values, @" ");
            values = values.Replace("<br/> <br/>", "<br/>");
            values = values.Replace("<br>", "<br/>");
           // values = values.Replace("<br/>", ".<br/>");
            values = values.Replace("..<br/>", ".<br/>");
            values = values.Replace(". .<br/>", ".<br/>");
            values = values.Replace("<br/>", System.Environment.NewLine);
            values = Utils.StripTags(values);
            values = values.Replace("gr ", "gramos ");
            values = values.Replace("gr.", "gramos.");
            
            String matchpattern = @"1 [a-zA-Z]*";
            String replacementpattern = @"un $0";
            values = Regex.Replace(values, matchpattern, replacementpattern);

            matchpattern = @"1 \b[a-zA-Z]*a\b";
            replacementpattern = @"una $0";
            values = Regex.Replace(values, matchpattern, replacementpattern);
            values = values.Replace("un una 1 ", "una ");
            values = values.Replace("un 1 ", "un ");
            matchpattern = @"Paso [0-9]*";
            replacementpattern = @"$0:";
            values = Regex.Replace(values, matchpattern, replacementpattern);

            values = values.Replace(":.", ":");
            values = values.Replace("::", ":");
            values = values.Replace(",,", ",");
            values = values.Replace("Paso :una", "Paso 1:");
            values = values.Replace("Paso :un", "Paso 1:");
            string expression = @"[\.\?\!,]\s+([a-z])";
            string input = values;
            char[] charArray = input.ToCharArray();
            foreach (Match match in Regex.Matches(input, expression, RegexOptions.Singleline))
            {
                charArray[match.Groups[1].Index] = Char.ToUpper(charArray[match.Groups[1].Index]);
            }
            values = new string(charArray);
            values=Regex.Replace(values,"(?<=[0-9])(?=[A-Za-z])|(?<=[A-Za-z])(?=[0-9])"," ");

            options = RegexOptions.None;
            regex = new Regex(@"[ ]{2,}", options);
            values = regex.Replace(values, @" ");
            values = values.Replace("  ", " ");
            values = values.Replace("  ", " ");
            values = values.Replace("  ", " ");
            return values;
        }
        public static string TruncateLongString(String str, int maxLength)
        {
            String x= str.Substring(0, Math.Min(str.Length, maxLength));

            if (str.Length > maxLength)
            {
                x = x + "...";
            }
            return x;
        }
        public static string RemoveSpecialCharacters(string str)
        {
            StringBuilder sb = new StringBuilder();
            foreach (char c in str)
            {
                if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '.' || c == '_' || c == ' ')
                {
                    sb.Append(c);
                }
            }
            return sb.ToString();
        }
        public static void CleanTempFiles()
        {
            try {
                var dir = new DirectoryInfo(".");
                foreach (var f in dir.EnumerateFiles("TEMP*.*"))
                {
                    if (f.LastAccessTime < DateTime.Now.AddMinutes(-20))
                        f.Delete();

                }
                foreach (var f in dir.EnumerateFiles("FINAL*.*"))
                {
                    if (f.LastAccessTime < DateTime.Now.AddDays(-1))
                        f.Delete();
                }
                foreach (var f in dir.EnumerateFiles("FINALTEMP*.*"))
                {
                    if (f.LastAccessTime < DateTime.Now.AddMinutes(-20))
                        f.Delete();
                }
                foreach (var f in dir.EnumerateFiles("*.rst"))
                {
                    if (!Directory.Exists("Archives"))
                        Directory.CreateDirectory("Archives");
                    if (f.LastAccessTime < DateTime.Now.AddDays(-1))
                        f.MoveTo("Archives\\" + f.Name);
                }
                foreach (var f in dir.EnumerateFiles("*.ytjson"))
                {
                    if (!Directory.Exists("Archives"))
                        Directory.CreateDirectory("Archives");
                    if (f.LastAccessTime < DateTime.Now.AddDays(-1) && !f.Name.Equals("test.ytjson"))
                        f.MoveTo("Archives\\" + f.Name);
                }
            }catch(Exception ex)
            {
                Utils.Console(ex.ToString());
            }
        }
        public static Bitmap CropImage(Bitmap source, Rectangle section)
        {
            // An empty bitmap which will hold the cropped image
            Bitmap bmp = new Bitmap(section.Width, section.Height);

            Graphics g = Graphics.FromImage(bmp);

            // Draw the given area (section) of the source image
            // at location 0,0 on the empty bitmap (bmp)
            g.DrawImage(source, 0, 0, section, GraphicsUnit.Pixel);

            return bmp;
        }
        public static Bitmap ResizeImage(Bitmap imgToResize, Size size)
        {
            try
            {

                Bitmap b = new Bitmap(size.Width, size.Height);
                if (Const.blackBars)
                {

                    Rectangle section = new Rectangle(new Point(0, 40), new Size(imgToResize.Width, imgToResize.Height-80));
                    imgToResize = Utils.CropImage(imgToResize, section);
                }
                using (Graphics g = Graphics.FromImage((Image)b))
                {
                    // Figure out the ratio
                    double ratioX = ((double)size.Width-50) / (double)imgToResize.Width;
                    double ratioY = ((double)size.Height-50) / (double)imgToResize.Height;
                    // use whichever multiplier is smaller
                    double ratio = ratioX < ratioY ? ratioX : ratioY;
                
                    // now we can get the new height and width
                    int newHeight = Convert.ToInt32(imgToResize.Height * ratio);
                    int newWidth = Convert.ToInt32(imgToResize.Width * ratio);


                    // Now calculate the X,Y position of the upper-left corner 
                    // (one of these will always be zero)
                    int posX = Convert.ToInt32((size.Width/2) - (newWidth / 2));
                    int posY = Convert.ToInt32((size.Height/2) - (newHeight / 2));

                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.CompositingQuality = CompositingQuality.HighQuality;
                    if (Const.staticBg==null)
                        g.Clear(System.Drawing.Color.Black); // white padding
                    else
                    {
                      
                            g.DrawImage(Const.staticBg, 0, 0, size.Width, size.Height);
                     
                    }
                    //cuadrado negro

   

                    if (Const.resizeWithRatio) {
                      
                        g.DrawImage(imgToResize, posX, posY, newWidth, newHeight);
                    }
                    else {
                        g.DrawImage(imgToResize, 0, 0, size.Width, size.Height);
                    }


                   
                }

                return b;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.ToString());
                Bitmap image = new Bitmap(size.Width, size.Height);
                Graphics g = Graphics.FromImage(image);
                g.FillRectangle(System.Drawing.Brushes.Black, 0, 0, size.Width, size.Height);
                g.Save();
                return image;

            }
        }
        public static string Slug(this string phrase)
        {
            string str = phrase.RemoveAccent().ToLower();
            // invalid chars           
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            // convert multiple spaces into one space   
            str = Regex.Replace(str, @"\s+", " ").Trim();
            // cut and trim 
            str = str.Trim();
            str = Regex.Replace(str, @"\s", "-"); // hyphens   
            return str;
        }

        public static string RemoveAccent(this string txt)
        {
            byte[] bytes = System.Text.Encoding.GetEncoding("Cyrillic").GetBytes(txt);
            return System.Text.Encoding.ASCII.GetString(bytes);
        }
        public static void getUrl(string Url, String folder = "")
        {



            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(Url);
            myRequest.Method = "GET";
            WebResponse myResponse = myRequest.GetResponse();
            StreamReader sr = new StreamReader(myResponse.GetResponseStream(), System.Text.Encoding.UTF8);
            string result = sr.ReadToEnd();
            sr.Close();
            myResponse.Close();
            int desde = result.IndexOf("<div  class=\"thumbs\">");
            int hasta = result.IndexOf("</ul>", desde + 5);

            result = result.Substring(desde, hasta - desde);
            List<string> list = new List<string>();

            // 1.
            // Find all matches in file.
            MatchCollection m1 = Regex.Matches(result, "(<img src=\".*?\" alt=\".*?\" width=\"112\" height=\"112\" class=\"hover\"/>)", RegexOptions.Singleline);

            // 2.
            // Loop over each match.
            foreach (Match m in m1)
            {
                String value = m.Groups[1].Value;
                //<img src="/bin/062015/tn_1437064995_soccer_puddle_jump.gif" alt="Soccer puddle jump" width="112" height="112" class="hover"/>
                value = value.Replace("<img src=\"", "http://www.gifbin.com");
                value = value.Replace("/tn_", "/");
                value = value.Replace("\" alt=\"", "|");
                value = value.Replace(" width=\"112\" height=\"112\" class=\"hover\"/>", "");
                var item = value.Split('|');
                Utils.GetImage(item[0], Utils.RemoveSpecialCharacters(item[1]), folder);


            }
        }
        public struct LinkItem
        {
            public string Href;
            public string Text;

            public override string ToString()
            {
                return Href + "\n\t" + Text;
            }
        }
        public static List<LinkItem> getUrlLibriVox(string Url)
        {



            HttpWebRequest myRequest = (HttpWebRequest)WebRequest.Create(Url);
            myRequest.Method = "GET";
            WebResponse myResponse = myRequest.GetResponse();
            StreamReader sr = new StreamReader(myResponse.GetResponseStream(), System.Text.Encoding.UTF8);
            string result = sr.ReadToEnd();
            sr.Close();
            myResponse.Close();
            int desde = result.IndexOf("<tbody>");
            int hasta = result.IndexOf("</tbody>", desde + 5);

            result = result.Substring(desde, hasta - desde);
            List<LinkItem> list = new List<LinkItem>();

            // 1.
            // Find all matches in file.
            MatchCollection m1 = Regex.Matches(result, @"(<a.*?>.*?</a>)",RegexOptions.Singleline);   // 2.
            // Loop over each match.
            foreach (Match m in m1)
            {
                String value = m.Groups[1].Value;
             
                LinkItem i = new LinkItem();

                // 3.
                // Get href attribute.
                Match m2 = Regex.Match(value, @"href=\""(.*?)\""",
                RegexOptions.Singleline);
                if (m2.Success)
                {
                    i.Href = m2.Groups[1].Value;
                }

                // 4.
                // Remove inner tags from text.
                string t = Regex.Replace(value, @"\s*<.*?>\s*", "",
                RegexOptions.Singleline);
                i.Text = t;
                if (!i.Text.Equals("Play"))
                  if (i.Href.EndsWith(".mp3")|| i.Href.EndsWith(".wav")||i.Href.EndsWith(".ogg")|| i.Href.EndsWith(".mp4"))
                    list.Add(i);

            }
            return list;
        }
        public static List<string> WrapText(string text, double pixels, string fontFamily, float emSize)
        {
            string[] originalLines = text.Split(new string[] { " " },
                StringSplitOptions.None);

            List<string> wrappedLines = new List<string>();

            StringBuilder actualLine = new StringBuilder();
            double actualWidth = 0;

            foreach (var item in originalLines)
            {
                FormattedText formatted = new FormattedText(item + " ",
                    CultureInfo.CurrentCulture,
                    System.Windows.FlowDirection.LeftToRight,
                    new Typeface(fontFamily), emSize, System.Windows.Media.Brushes.Black);
                //    formatted.TextAlignment = System.Windows.TextAlignment.Justify;
                actualLine.Append(item + " ");
                actualWidth += formatted.Width * 2;

                if (actualWidth > pixels)
                {
                    wrappedLines.Add(actualLine.ToString());
                    actualLine.Clear();
                    actualWidth = 0;
                }
            }

            if (actualLine.Length > 0)
                wrappedLines.Add(actualLine.ToString());

            return wrappedLines;
        }
        public static void GetImage(string imageUrl, String name, String folder, bool convert = false)
        {
            try
            {
                Utils.Console("Get image " + imageUrl);
                byte[] imageBytes;
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);
                HttpWebRequest imageRequest = (HttpWebRequest)WebRequest.Create(imageUrl);
                imageRequest.UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.121 Safari/535.2";
                WebResponse imageResponse = imageRequest.GetResponse();

                Stream responseStream = imageResponse.GetResponseStream();
                String extension = imageUrl.EndsWith(".gif")?".gif":".jpg";
                String destFile = folder + "\\" + name + extension;
                FileStream fs = new FileStream(destFile, FileMode.Create);
                BinaryWriter bw = new BinaryWriter(fs);
                using (BinaryReader br = new BinaryReader(responseStream))
                {
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    do
                    {
                        bytesRead = br.Read(buffer, 0, buffer.Length);
                        bw.Write(buffer, 0, bytesRead);
                    } while (bytesRead != 0);
                    br.Close();
                }
                responseStream.Close();
                imageResponse.Close();
                fs.Close();
                bw.Close();
                System.Drawing.Image image1 = System.Drawing.Image.FromFile(destFile);

                // Save the image in JPEG format.
                if (convert)
                {
                    if (extension.Equals(".gif"))
                        image1.Save(destFile.Replace(".gif", ".jpg"), System.Drawing.Imaging.ImageFormat.Jpeg);
                    if (extension.Equals(".jpg") || extension.Equals(".jpeg"))
                        image1.Save(destFile.Replace(".jpg", ".gif").Replace(".jpeg", ".gif"), System.Drawing.Imaging.ImageFormat.Gif);
                    if (extension.Equals(".png"))
                        image1.Save(destFile.Replace(".png", ".gif"), System.Drawing.Imaging.ImageFormat.Gif);
                }
                Utils.Console("Image done! " + imageUrl);
            }
            catch (Exception ex)
            {
                Utils.Console("<font style='color:red'>" + ex.ToString()+"</font>");
            }

        }
        public static void Console(String txt)
        {
            try {
                String filePath = "log.html";
                string currentContent = String.Empty;
                if (File.Exists(filePath))
                {
                    currentContent = File.ReadAllText(filePath);
                }
                File.WriteAllText(filePath, DateTime.Now + "->" + txt + "<br/>" + currentContent, Encoding.UTF8);
                //write string to file
            }catch(Exception ex)
            {
                var dum = "error";

            }
            
        }
        /// <summary>
        /// Remove HTML from string with Regex.
        /// </summary>
        public static string StripTags(string source)
        {
            return Regex.Replace(source, "<.*?>", string.Empty);
        }
        public static void refreshCategories()
        {
            new UploadVideo().getCategories("US");
            new UploadVideo().getCategories("ES");
        }
        public static void ConsoleClear()
        {
            System.IO.File.WriteAllText("log.html", "");
        }
        public static void writeJson(String filename, YTVideo item)
        {
            string json = JsonConvert.SerializeObject(item);

            //write string to file
            System.IO.File.WriteAllText(filename, json, Encoding.UTF8);
        }
        public static YTVideo readJson(String filename)
        {
            string json = System.IO.File.ReadAllText(filename);
            return JsonConvert.DeserializeObject<YTVideo>(json);
        }
        public static void copyImage(String url, String path,String folder=".")
        {
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(url);
            HttpWebResponse httpWebReponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (Stream stream = httpWebReponse.GetResponseStream())
            using (FileStream fs = File.Create(folder+"/" + path + ".gif"))
            {
                stream.CopyTo(fs);
            }

        }
        public static bool getImagesFromURL(String url,String tag)
        {
            //por si viene esto si que vale/page/1
      

            if (!Directory.Exists(tag))
                Directory.CreateDirectory(tag);
            WebClient x = new WebClient();
            string source="";
            try
            {
                 source = x.DownloadString(url);
            }
            catch (Exception ex)
            {
                if (ex.ToString().IndexOf("404") >= 0)
                    return false;
                else
                    return true;
            }

            HtmlAgilityPack.HtmlDocument document = new HtmlAgilityPack.HtmlDocument();
            document.LoadHtml(source);
            foreach (HtmlNode link in document.DocumentNode.SelectNodes("//img"))
            {
                try
                {
                    if (link.Attributes["src"].Value.EndsWith(".gif") && link.ParentNode.Attributes["href"].Value.EndsWith(".gif"))
                    {
                        copyImage(link.Attributes["src"].Value, link.Attributes["alt"].Value,tag);
                    }
                }
                catch (Exception ex)
                {
                    var t = ex.ToString();
                }
            }
            return true;
        }
        public static List<Uri> findUris(string message)
        {
            string anchorPattern = "<a[\\s]+[^>]*?href[\\s]?=[\\s\\\"\']+(?<href>.*?)[\\\"\\']+.*?>(?<fileName>[^<]+|.*?)?<\\/a>";
            MatchCollection matches = Regex.Matches(message, anchorPattern, RegexOptions.IgnorePatternWhitespace | RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.Compiled);
            if (matches.Count > 0)
            {
                List<Uri> uris = new List<Uri>();

                foreach (Match m in matches)
                {
                    string url = m.Groups["url"].Value;
                    Uri testUri = null;
                    if (Uri.TryCreate(url, UriKind.RelativeOrAbsolute, out testUri))
                    {
                        uris.Add(testUri);
                    }
                }
                return uris;
            }
            return null;
        }

    }
    public static class Fades
    {
        public static int fadeIn = 0;
        public static int fadeOut = 0;
        public static int steps = 20;
        public static bool fading = false;
    }
}

