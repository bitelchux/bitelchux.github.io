
//using LTTS7Lib;
using NAudio.Lame;
using NAudio.Wave;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Speech.Synthesis;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace gifbin
{
    public static class VideoSounds
    {
        public static void Concatenate(string outputFile, IEnumerable<string> sourceFiles)
        {
            byte[] buffer = new byte[1024];
            WaveFileWriter waveFileWriter = null;

            try
            {
                foreach (string sourceFile in sourceFiles)
                {
                    using (WaveFileReader reader = new WaveFileReader(sourceFile))
                    {
                        if (waveFileWriter == null)
                        {
                            // first time in create new Writer
                            waveFileWriter = new WaveFileWriter(outputFile, reader.WaveFormat);
                        }
                        else
                        {
                            if (!reader.WaveFormat.Equals(waveFileWriter.WaveFormat))
                            {
                                throw new InvalidOperationException("Can't concatenate WAV Files that don't share the same format");
                            }
                        }

                        int read;
                        while ((read = reader.Read(buffer, 0, buffer.Length)) > 0)
                        {
                            waveFileWriter.WriteData(buffer, 0, read);
                        }
                    }
                }
            }
            finally
            {
                if (waveFileWriter != null)
                {
                    waveFileWriter.Dispose();
                }
            }

        }

        public static void loopAudio(String filename, int seconds=360)
        //looop durante 6 minutos
        {
           
            String time = FFMPGScripter.getDurationOfAvi(filename + ".wav");
            double duration = TimeSpan.Parse(time).TotalSeconds;
            double numberOfTimes = Math.Ceiling(seconds / duration);
            List<string> list = new List<string>();
            
            
           
            for (int i = 0; i < numberOfTimes; i++)
            {
                list.Add(Directory.GetCurrentDirectory() + "\\" + filename + ".wav");
            }
           
            Concatenate("LOOPEDSOUND-" + filename+".wav", list);
        }
        public static void speak(String txt,String filename,String voz)
        //if aviDuration no hay silecions
        {
            //tts.Read(txt);
            SpeechSynthesizer synth = new SpeechSynthesizer();
        
            synth.SelectVoice(voz);

            synth.SetOutputToWaveFile(filename + ".wav");

            // Build a prompt.
            PromptBuilder builder = new PromptBuilder();
            builder.AppendText(txt);

            // Speak the string asynchronously.
            
            synth.Speak(builder);            
            synth.Dispose();
                               
            List<string> list=new List<string>();

            list.Add(Directory.GetCurrentDirectory() + "\\" + "silence.wav");
            list.Add(Directory.GetCurrentDirectory() + "\\" + filename + ".wav");
            list.Add(Directory.GetCurrentDirectory() + "\\" + "silence.wav");
  
            Concatenate("TEMPSOUND-" + filename.Replace("TEMP-","") + ".wav",list);
            Utils.Console("Voz añadida " + "TEMPSOUND-" + filename.Replace("TEMP-", "") + ".wav");         
        }
    }
}
