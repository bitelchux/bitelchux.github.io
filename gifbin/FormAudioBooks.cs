using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static gifbin.Utils;

namespace gifbin
{
    public partial class FormAudioBooks : Form
    {
     

        public FormAudioBooks()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
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
            List<LinkItem> list = Utils.getUrlLibriVox(this.url.Text);
            foreach (LinkItem l in list)
            {

                WebClient Client = new WebClient();
                String audioName = l.Text;
                VideoImages.centeredLetters(".\\images\\" + ((FileInfo)comboBox1.SelectedItem).Name, l.Text+" "+ l.Text + " " + l.Text + " " + l.Text + " " + l.Text + " " + l.Text + " " + l.Text);

                Client.DownloadFile(l.Href, "TEMP-" + Utils.Slug(audioName)+".mp3");
                 FFMPGScripter.AddSoundtoVideo2("FINAL-" + ((FileInfo)comboBox1.SelectedItem).Name, "TEMP-" + Utils.Slug(audioName) + ".mp3", Utils.Slug(audioName), false);
            }

        }

        private void comboBox1_DrawItem(object sender, DrawItemEventArgs e)
        {
            FileInfo FI = (FileInfo)comboBox1.Items[e.Index];
            e.Graphics.DrawImage(imageList1.Images[".\\images\\" + FI.Name], e.Bounds.Location);
            e.Graphics.DrawString(FI.Name, Font, Brushes.Black,
         e.Bounds.Left + imageList1.ImageSize.Height + 3, e.Bounds.Top + 4);
         
        }

        private void FormAudioBooks_Load(object sender, EventArgs e)
        {
            var images = Directory.EnumerateFiles(".\\images", "*.*", SearchOption.AllDirectories)
             .Where(s => s.EndsWith(".gif") || s.EndsWith(".jpg") || s.EndsWith(".png"));
            foreach (string file in images)
            {
                imageList1.Images.Add(file, new Bitmap(file));
                comboBox1.Items.Add(new FileInfo(file));
            }
            comboBox1.DrawMode = DrawMode.OwnerDrawFixed;
            comboBox1.DrawItem += comboBox1_DrawItem;
            comboBox1.ItemHeight = imageList1.ImageSize.Height;

        }
    }
}
