namespace gifbin
{
    partial class FormSecuenciadorRapido
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
            this.fondostatic = new System.Windows.Forms.TextBox();
            this.textColor = new System.Windows.Forms.ComboBox();
            this.categories = new System.Windows.Forms.ComboBox();
            this.tags = new System.Windows.Forms.TextBox();
            this.Voz = new System.Windows.Forms.ComboBox();
            this.language = new System.Windows.Forms.ComboBox();
            this.button1 = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // fondostatic
            // 
            this.fondostatic.Location = new System.Drawing.Point(12, 89);
            this.fondostatic.Name = "fondostatic";
            this.fondostatic.Size = new System.Drawing.Size(211, 20);
            this.fondostatic.TabIndex = 38;
            this.fondostatic.Text = "0fondohumor.jpg";
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
            this.textColor.TabIndex = 37;
            // 
            // categories
            // 
            this.categories.FormattingEnabled = true;
            this.categories.Location = new System.Drawing.Point(59, 12);
            this.categories.Name = "categories";
            this.categories.Size = new System.Drawing.Size(105, 21);
            this.categories.TabIndex = 36;
            // 
            // tags
            // 
            this.tags.Location = new System.Drawing.Point(12, 131);
            this.tags.Multiline = true;
            this.tags.Name = "tags";
            this.tags.Size = new System.Drawing.Size(218, 77);
            this.tags.TabIndex = 35;
            this.tags.Text = "recetas de la abuela,recetas caseras,recetas simples,recetas sencillas,recetas de" +
    " toda la vida,recetas traidicionales,";
            this.tags.TextChanged += new System.EventHandler(this.tags_TextChanged);
            // 
            // Voz
            // 
            this.Voz.FormattingEnabled = true;
            this.Voz.Location = new System.Drawing.Point(12, 35);
            this.Voz.Name = "Voz";
            this.Voz.Size = new System.Drawing.Size(152, 21);
            this.Voz.TabIndex = 34;
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
            this.language.TabIndex = 33;
            this.language.SelectedIndexChanged += new System.EventHandler(this.language_SelectedIndexChanged);
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(170, 12);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(102, 44);
            this.button1.TabIndex = 32;
            this.button1.Text = "Process";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click_1);
            // 
            // FormSecuenciadorRapido
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(284, 261);
            this.Controls.Add(this.fondostatic);
            this.Controls.Add(this.textColor);
            this.Controls.Add(this.categories);
            this.Controls.Add(this.tags);
            this.Controls.Add(this.Voz);
            this.Controls.Add(this.language);
            this.Controls.Add(this.button1);
            this.Name = "FormSecuenciadorRapido";
            this.Text = "FormSecuenciadorRapido";
            this.Load += new System.EventHandler(this.FormSecuenciadorRapido_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox fondostatic;
        private System.Windows.Forms.ComboBox textColor;
        private System.Windows.Forms.ComboBox categories;
        private System.Windows.Forms.TextBox tags;
        private System.Windows.Forms.ComboBox Voz;
        private System.Windows.Forms.ComboBox language;
        private System.Windows.Forms.Button button1;
    }
}