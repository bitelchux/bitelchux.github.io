namespace gifbin
{
    partial class FormSequenciador
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.button1 = new System.Windows.Forms.Button();
            this.language = new System.Windows.Forms.ComboBox();
            this.Voz = new System.Windows.Forms.ComboBox();
            this.tags = new System.Windows.Forms.TextBox();
            this.categories = new System.Windows.Forms.ComboBox();
            this.textColor = new System.Windows.Forms.ComboBox();
            this.fondostatic = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(170, 12);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(102, 44);
            this.button1.TabIndex = 0;
            this.button1.Text = "Process";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // language
            // 
            this.language.FormattingEnabled = true;
            this.language.Items.AddRange(new object[] {
            "es",
            "en"});
            this.language.Location = new System.Drawing.Point(12, 12);
            this.language.Name = "language";
            this.language.Size = new System.Drawing.Size(41, 21);
            this.language.TabIndex = 1;
            this.language.SelectedIndexChanged += new System.EventHandler(this.language_SelectedIndexChanged);
            // 
            // Voz
            // 
            this.Voz.FormattingEnabled = true;
            this.Voz.Location = new System.Drawing.Point(12, 35);
            this.Voz.Name = "Voz";
            this.Voz.Size = new System.Drawing.Size(152, 21);
            this.Voz.TabIndex = 2;
            this.Voz.SelectedIndexChanged += new System.EventHandler(this.Voz_SelectedIndexChanged);
            // 
            // tags
            // 
            this.tags.Location = new System.Drawing.Point(12, 131);
            this.tags.Multiline = true;
            this.tags.Name = "tags";
            this.tags.Size = new System.Drawing.Size(218, 77);
            this.tags.TabIndex = 3;
            this.tags.Text = "muestras gratis,muestras gratuitas,regalos revistas,regalos revistas octubre,mues" +
    "tras gratis revistas,muestras gratis revistas octubre";
            // 
            // categories
            // 
            this.categories.FormattingEnabled = true;
            this.categories.Location = new System.Drawing.Point(59, 12);
            this.categories.Name = "categories";
            this.categories.Size = new System.Drawing.Size(105, 21);
            this.categories.TabIndex = 4;
            this.categories.SelectedIndexChanged += new System.EventHandler(this.categories_SelectedIndexChanged);
            // 
            // textColor
            // 
            this.textColor.FormattingEnabled = true;
            this.textColor.Items.AddRange(new object[] {
            "Negro",
            "Blanco",
            "Verde",
            "Rojo",
            "Amarillo",
            "Fosforito"});
            this.textColor.Location = new System.Drawing.Point(12, 62);
            this.textColor.Name = "textColor";
            this.textColor.Size = new System.Drawing.Size(121, 21);
            this.textColor.TabIndex = 5;
            this.textColor.SelectedIndexChanged += new System.EventHandler(this.textColor_SelectedIndexChanged);
            // 
            // fondostatic
            // 
            this.fondostatic.Location = new System.Drawing.Point(12, 89);
            this.fondostatic.Name = "fondostatic";
            this.fondostatic.Size = new System.Drawing.Size(211, 20);
            this.fondostatic.TabIndex = 31;
            this.fondostatic.Text = "cocteles.jpg";
            // 
            // FormSequenciador
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(284, 262);
            this.Controls.Add(this.fondostatic);
            this.Controls.Add(this.textColor);
            this.Controls.Add(this.categories);
            this.Controls.Add(this.tags);
            this.Controls.Add(this.Voz);
            this.Controls.Add(this.language);
            this.Controls.Add(this.button1);
            this.Name = "FormSequenciador";
            this.Text = "Form4";
            this.Load += new System.EventHandler(this.Form4_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.ComboBox language;
        private System.Windows.Forms.ComboBox Voz;
        private System.Windows.Forms.TextBox tags;
        private System.Windows.Forms.ComboBox categories;
        private System.Windows.Forms.ComboBox textColor;
        private System.Windows.Forms.TextBox fondostatic;
    }
}