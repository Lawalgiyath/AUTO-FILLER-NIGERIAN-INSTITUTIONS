# 🎓 UNILAG Staff Form AutoFiller - Web Application

![UNILAG Colors](https://img.shields.io/badge/UNILAG-Maroon%20%26%20White-800000)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

A beautiful web interface for automating Google Form submissions with University of Lagos staff information.

## 🌐 Live Demo

**URL**: [Coming Soon - Will be deployed on Vercel]

## ✨ Features

### 🎨 UNILAG-Branded Interface
- Official UNILAG maroon and gold colors
- UNILAG logo integration
- Responsive design for all devices
- Clean, modern UI with smooth animations

### 📋 Smart Instructions System
- Comprehensive data preparation guide
- Required checkbox confirmation before upload
- Clear examples and format specifications
- Step-by-step instructions

### 📤 Easy File Upload
- Drag-and-drop interface
- Support for CSV, Excel (.xlsx, .xls), and Word (.docx)
- Real-time file validation
- Progress indicators

### ✅ Instant Validation
- Immediate data quality checks
- Detailed error reporting
- Field-by-field validation results
- Warning system for potential issues

### 📊 Beautiful Results Display
- Visual summary statistics
- Color-coded validation status
- Detailed error listings
- Preview of valid records

## 🚀 Quick Start

### For Users

1. **Visit the Website**
   ```
   [URL will be here after deployment]
   ```

2. **Read Instructions**
   - Review the data preparation guide
   - Check the checkbox to confirm
   - Click "Continue to Upload"

3. **Upload Your File**
   - Drag and drop your file, or
   - Click "Browse Files" to select
   - Supported: CSV, Excel, Word

4. **Review Results**
   - Check validation summary
   - Fix any errors shown
   - Download corrected file if needed

### For Developers

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Lawalgiyath/AUTO-FILLER-NIGERIAN-INSTITUTIONS.git
   cd AUTO-FILLER-NIGERIAN-INSTITUTIONS
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
AUTO-FILLER-NIGERIAN-INSTITUTIONS/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── validate/         # File validation endpoint
│   ├── globals.css          # Global styles with UNILAG colors
│   ├── layout.js            # Root layout
│   └── page.js              # Home page
├── components/              # React components
│   ├── Header.js            # UNILAG-branded header
│   ├── InstructionsModal.js # Instructions with checkbox
│   ├── UploadSection.js     # File upload interface
│   └── ResultsSection.js    # Validation results display
├── src/                     # Core logic (shared with CLI)
│   ├── cli.js              # Command-line interface
│   ├── fileParser.js       # File parsing
│   ├── formFiller.js       # Form automation
│   └── validator.js        # Data validation
├── public/                  # Static assets
│   └── unilag-logo.png     # UNILAG logo
├── data/                    # Sample data files
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind with UNILAG colors
└── vercel.json             # Vercel deployment config
```

## 🎨 UNILAG Design System

### Colors
```css
--unilag-maroon: #800000    /* Primary brand color */
--unilag-gold: #FFD700      /* Secondary brand color */
--unilag-dark: #4A0000      /* Darker shade */
--unilag-light: #FFF5E6     /* Light background */
```

### Components
- **Header**: Maroon gradient with UNILAG logo
- **Cards**: White with maroon borders
- **Buttons**: Maroon with hover effects
- **Checkboxes**: Maroon accent color
- **Footer**: Maroon background with white text

## 📋 Data Format Requirements

### Required Columns
| Column | Type | Example |
|--------|------|---------|
| Title | Dropdown | Prof, Dr, Mr, Mrs, Ms |
| Surname | Text | Adeyemi |
| FirstName | Text | Oluwaseun |
| MiddleName | Text (Optional) | Babatunde |
| Email | Email | o.adeyemi@unilag.edu.ng |
| Faculty | Text | Faculty of Science |
| Department | Text | Computer Science |
| Rank | Dropdown | Professor, Lecturer I, etc. |
| EmploymentStatus | Dropdown | Full Time, Contract, etc. |

### Supported File Formats
- **CSV**: Comma-separated values
- **Excel**: .xlsx and .xls
- **Word**: .docx with table format

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run CLI version
npm run cli -- validate -f data/sample-staff.csv
```

### Environment Variables

Create a `.env.local` file for local development:

```env
# Add any environment variables here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🚀 Deployment to Vercel

### Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add web interface"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Configure Settings**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🔒 Security Features

- ✅ File type validation
- ✅ File size limits
- ✅ Temporary file cleanup
- ✅ No data storage (processed in memory)
- ✅ Input sanitization
- ✅ Error handling

## 📊 API Endpoints

### POST /api/validate

Validates uploaded staff data file.

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field

**Response**:
```json
{
  "success": true,
  "summary": {
    "total": 10,
    "valid": 10,
    "invalid": 0,
    "warnings": 0
  },
  "results": [...]
}
```

## 🎯 Features Roadmap

- [x] Web interface with UNILAG branding
- [x] File upload and validation
- [x] Instructions modal with checkbox
- [x] Detailed validation results
- [ ] Google Form configuration UI
- [ ] Direct form submission from web
- [ ] Download validation report (PDF)
- [ ] Batch processing with progress bar
- [ ] User authentication
- [ ] Data history

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - Free to use and modify for your institution's needs.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/Lawalgiyath/AUTO-FILLER-NIGERIAN-INSTITUTIONS/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Lawalgiyath/AUTO-FILLER-NIGERIAN-INSTITUTIONS/discussions)
- **Documentation**: See README.md for CLI documentation

## 🙏 Acknowledgments

- University of Lagos for the color scheme and branding
- Next.js team for the amazing framework
- Vercel for hosting

---

**Built with ❤️ for the University of Lagos** 🇳🇬

**Version**: 2.0.0 (Web Interface)
