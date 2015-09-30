using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace gifbin
{
    //OJO comandos ffmpg
    //http://www.labnol.org/internet/useful-ffmpeg-commands/28490/
    public static class FFMPGScripter
    {
        public static void AddSoundtoVideo(String videoFile, String audioFile, string prefix = "FINAL", bool shortest=true)
        {
            String shortestTxt = "";
            String cmd = Directory.GetCurrentDirectory() + "\\" + "ffmpeg";
            if (shortest)
                shortestTxt = " -shortest ";
            //String parames = "-y -i " + Directory.GetCurrentDirectory() + "\\" + videoFile + " -i " + Directory.GetCurrentDirectory() + "\\" + audioFile + " -map 0 -map 1 -c:v copy -c:a copy " + Directory.GetCurrentDirectory() + "\\FINAL" + videoFile;
            String parames = "-y -i " + Directory.GetCurrentDirectory() + "\\" + videoFile + " -i " + Directory.GetCurrentDirectory() + "\\" + audioFile + " -map 0 -map 1 -codec copy " + shortestTxt + " " + Directory.GetCurrentDirectory() + "\\" + prefix + videoFile;
            System.Diagnostics.Process p = new System.Diagnostics.Process();

            p.StartInfo = new System.Diagnostics.ProcessStartInfo(cmd, parames);

            /*
               p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.RedirectStandardError = true;
            p.StartInfo.UseShellExecute = false;
            p.StartInfo.CreateNoWindow = true;
            p.EnableRaisingEvents = true;
            */

            p.StartInfo.CreateNoWindow = true;
            p.Start();

            /*
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.UseShellExecute = false;
            // instead of p.WaitForExit(), do
            string q = "";
            while (!p.HasExited)
            {
                q += p.StandardOutput.ReadToEnd();
            }
            MessageBox.Show(q);
             * */
            p.WaitForExit();
            //MessageBox.Show("Pausa");
            Utils.Console("<!--- FFMPGe " + parames + "--->");         

        }

        public static void AddSoundtoVideo2(String videoFile, String audioFile,String outputFile, bool shortest = false)
        {
            String shortestTxt = "";
            String cmd = Directory.GetCurrentDirectory() + "\\" + "ffmpeg";
            if (shortest)
                shortestTxt = " -shortest ";
            //String parames = "-y -i " + Directory.GetCurrentDirectory() + "\\" + videoFile + " -i " + Directory.GetCurrentDirectory() + "\\" + audioFile + " -map 0 -map 1 -c:v copy -c:a copy " + Directory.GetCurrentDirectory() + "\\FINAL" + videoFile;
            String parames = "-y -i " + Directory.GetCurrentDirectory() + "\\" + videoFile + " -i " + Directory.GetCurrentDirectory() + "\\" + audioFile + " -map 0 -map 1 -codec copy " + shortestTxt + " " + Directory.GetCurrentDirectory() + "\\" +  outputFile + ".avi";
            parames = "-loop 1 -i " + Directory.GetCurrentDirectory() + "\\" + videoFile + " -i " + Directory.GetCurrentDirectory() + "\\" + audioFile + " -c:v libx264 -preset ultrafast -r 1 -c:a aac -strict experimental -shortest " + Directory.GetCurrentDirectory() + "\\" +  outputFile + ".avi";
            //parames= "-i " + Directory.GetCurrentDirectory() + "\\" + audioFile + " - loop 1 -r 2 -i " + Directory.GetCurrentDirectory() + "\\" + videoFile + " -c:a copy -c:v libx264 -preset ultrafast -shortest " + Directory.GetCurrentDirectory() + "\\" + outputFile + ".avi";
            System.Diagnostics.Process p = new System.Diagnostics.Process();

            p.StartInfo = new System.Diagnostics.ProcessStartInfo(cmd, parames);

            /*
               p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.RedirectStandardError = true;
            p.StartInfo.UseShellExecute = false;
            p.StartInfo.CreateNoWindow = true;
            p.EnableRaisingEvents = true;
            */

            p.StartInfo.CreateNoWindow = true;
            p.Start();

            /*
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.UseShellExecute = false;
            // instead of p.WaitForExit(), do
            string q = "";
            while (!p.HasExited)
            {
                q += p.StandardOutput.ReadToEnd();
            }
            MessageBox.Show(q);
             * */
            p.WaitForExit();
            //MessageBox.Show("Pausa");
            Utils.Console("<!--- FFMPGe " + parames + "--->");

        }

        public static string getDurationOfAvi(String aviFile)
        {                       
            using(Process ffmpeg = new Process())
            {
	             String duration;  // soon will hold our video's duration in the form "HH:MM:SS.UU"
	             String result;  // temp variable holding a string representation of our video's duration
	             StreamReader errorreader;  // StringWriter to hold output from ffmpeg

	             // we want to execute the process without opening a shell
	             ffmpeg.StartInfo.UseShellExecute = false;
	             ffmpeg.StartInfo.ErrorDialog = false;

	             // redirect StandardError so we can parse it
	             // for some reason the output comes through over StandardError
	             ffmpeg.StartInfo.RedirectStandardError = true;

	             // set the file name of our process, including the full path
	             // (as well as quotes, as if you were calling it from the command-line)
	             ffmpeg.StartInfo.FileName = Directory.GetCurrentDirectory() + "\\ffmpeg.exe";

	             // set the command-line arguments of our process, including full paths of any files
	             // (as well as quotes, as if you were passing these arguments on the command-line)
	             ffmpeg.StartInfo.Arguments = "-i " + Directory.GetCurrentDirectory() + "\\" +aviFile;

	             // start the process
	             ffmpeg.Start();

	             // now that the process is started, we can redirect output to the StreamReader we defined
	             errorreader = ffmpeg.StandardError;

	             // wait until ffmpeg comes back
	             ffmpeg.WaitForExit(2000);

	             // read the output from ffmpeg, which for some reason is found in Process.StandardError
	             result = errorreader.ReadToEnd();

	             // a little convoluded, this string manipulation...
	             // working from the inside out, it:
	             // takes a substring of result, starting from the end of the "Duration: " label contained within,
	             // (execute "ffmpeg.exe -i somevideofile" on the command-line to verify for yourself that it is there)
	             // and going the full length of the timestamp.
	             // The resulting substring is of the form "HH:MM:SS.UU"

	             duration = result.Substring(result.IndexOf("Duration: ") + ("Duration: ").Length, ("00:00:00.00").Length);

                 return duration;
            }
        }
        public static void fixVideo(String sourceFile, String targetFile)
        {
            
            //ffmpeg -threads 4 -i vid.avi -vcodec copy -acodec copy vidout.avi
               // System.IO.File.WriteAllText(targetFile + ".txt", fileList);
            String cmd = Directory.GetCurrentDirectory() + "\\" + "ffmpeg";
            //String parames = "-y -f concat -i " + Directory.GetCurrentDirectory() + "\\" + targetFile + ".txt -c copy " + targetFile + extensiones;
            String parames = "-threads 4 -i " + Directory.GetCurrentDirectory() + "\\" + sourceFile + " - vcodec copy -acodec copy " + Directory.GetCurrentDirectory() + "\\" + targetFile;
            System.Diagnostics.Process p = new System.Diagnostics.Process();

            p.StartInfo = new System.Diagnostics.ProcessStartInfo(cmd, parames);
            p.Start();
           
        }
        public static void Concatenate(String fileList, String targetFile,String extensiones=".avi")
        {
            
            System.IO.File.WriteAllText(targetFile + ".txt", fileList);
            String cmd = Directory.GetCurrentDirectory() + "\\" + "ffmpeg";
            //String parames = "-y -f concat -i " + Directory.GetCurrentDirectory() + "\\" + targetFile + ".txt -c copy " + targetFile + extensiones;
            //String parames = "-y -f concat -i " + Directory.GetCurrentDirectory() + "\\" + targetFile + ".txt -c copy -vcodec msmpeg4v2 " + targetFile + extensiones;
           // String parames = "-y -f concat -i " + Directory.GetCurrentDirectory() + "\\" + targetFile + ".txt -c copy -codec " + targetFile + extensiones;
            String parames = "-y -f concat -i " + Directory.GetCurrentDirectory() + "\\" + targetFile + ".txt -c copy " + targetFile + extensiones;
            System.Diagnostics.Process p = new System.Diagnostics.Process();

            p.StartInfo = new System.Diagnostics.ProcessStartInfo(cmd, parames);
//            p.StartInfo.RedirectStandardOutput = true;
//            p.StartInfo.RedirectStandardError = true;
//            p.StartInfo.UseShellExecute = false;
            p.StartInfo.CreateNoWindow = true;
            p.Start();
            /*
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.UseShellExecute = false;
            // instead of p.WaitForExit(), do
            string q = "";
            while (!p.HasExited)
            {
                q += p.StandardOutput.ReadToEnd();
            }
            MessageBox.Show(q);
             * */
            p.WaitForExit();
            Utils.Console("<!--- FFMPGe " + parames + "--->");         
        }
    }
}
