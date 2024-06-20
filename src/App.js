import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [pageSize, setPageSize] = useState('a4');
  const [margin, setMargin] = useState(10);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderSize, setBorderSize] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef();

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handlePdfGeneration = () => {
    setLoading(true);
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize
    });

    images.forEach((image, index) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 2 * margin - 2 * borderSize;
        const imgHeight = (img.height * imgWidth) / img.width;
        if (index > 0) doc.addPage();
        doc.setFillColor(bgColor);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');  // Add background color
        doc.setDrawColor(borderColor);
        doc.setLineWidth(borderSize);
        doc.rect(margin - borderSize, margin - borderSize, imgWidth + 2 * borderSize, imgHeight + 2 * borderSize);
        doc.addImage(img, 'JPEG', margin, margin, imgWidth, imgHeight);
        if (index === images.length - 1) {
          doc.save('download.pdf');
          setLoading(false);
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 3000);
          setImages([]);  // Reset images after generating PDF
        }
      };
    });
  };

  return (
    <div className="App">
      <h1>JPG to PDF Converter</h1>
      <input
        type="file"
        multiple
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button onClick={() => fileInputRef.current.click()} className='Add-img'>Add Images</button>
      <button onClick={handlePdfGeneration} disabled={loading} className='btn1'>
        {loading ? 'Generating PDF...' : 'Generate PDF'}
      </button>
      <div>
        <label className='leb1'>
          Orientation:
          <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className='ori1'>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Page Size:
          <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}className='page-size'>
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Margin (mm):
          <input
            type="number"
            value={margin}
            onChange={(e) => setMargin(parseInt(e.target.value))}
         className='margin' />
        </label>
      </div>
      <div>
        <label>
          Background Color:
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
        className='background-color'  />
        </label>
      </div>
      <div>
        <label>
          Border Color:
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
         className='border' />
        </label>
      </div>
      <div>
        <label>
          Border Size (mm):
          <input
            type="number"
            value={borderSize}
            onChange={(e) => setBorderSize(parseInt(e.target.value))}
       className='border-size'   />
        </label>
      </div>
      {showPopup && <div className="popup">PDF Generated! Your download will start shortly.</div>}
      <div className={`image-preview ${loading ? 'loading' : ''}`}>
        {images.map((src, index) => (
          <img key={index} src={src} alt={`preview-${index}`} />
        ))}
      </div>
    </div>
  );
}

export default App;
