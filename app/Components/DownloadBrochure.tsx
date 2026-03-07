"use client";

import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Feature {
  feature: string;
  subheading: string | null;
  price: string;
}

interface DownloadProps {
  packageName: string;
  amount: number;
  features: Feature[];
}

const DownloadBrochure = ({ packageName, amount, features }: DownloadProps) => {
  
  // Helper to convert local Public Image URL to Base64
  const getBase64ImageFromURL = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

     const downloadPDF = async () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;
  const bgImageUrl = "/img/pdfbg.jpg"; 

  try {
    const base64Img = await getBase64ImageFromURL(bgImageUrl);

    const addBackgroundImage = (pdfDoc: jsPDF) => {
      pdfDoc.addImage(base64Img, "PNG", 0, 0, pageWidth, pageHeight);
    };

    addBackgroundImage(doc);

    // --- Badges ---
    doc.setFontSize(16);
    const padding = 6;
    const borderRadius = 4;
    const topMargin = 80; 
    const badgeHeight = 12;
    const lineSpacing = 12;

    // 1. Package Name
    const pkgNameText = packageName.toUpperCase();
    const pkgWidth = doc.getTextWidth(pkgNameText);
    const pkgBoxWidth = pkgWidth + (padding * 2);
    const pkgX = centerX - (pkgBoxWidth / 2);

    doc.setFillColor(0, 169, 157);
    doc.roundedRect(pkgX, topMargin, pkgBoxWidth, badgeHeight, borderRadius, borderRadius, "F");

    doc.setTextColor(255, 255, 255);
    doc.text(pkgNameText, centerX, topMargin + 8, { align: "center" });

    // --- Table (Before Price) ---
    const tableColumn = ["Feature", "Description", "Price"];
    const tableRows = features.map((item) => [
      item.feature,
      item.subheading || "N/A",
      item.price,
    ]);

    // Table starts slightly below package name
    const tableStartY = topMargin + badgeHeight + lineSpacing+50;

    autoTable(doc, {
      startY: tableStartY,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { 
        fillColor: [0, 169, 157],
        textColor: [255, 255, 255],
        halign: 'center',
        fontSize: 12,
        cellPadding: 4
      },
      bodyStyles: { 
        halign: 'center',
        textColor: [40, 40, 40],
        lineColor: [255, 255, 255],
        lineWidth: 0.5
      },
      alternateRowStyles: { 
        fillColor: [183, 236, 229]
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        if (data.pageNumber > 1) {
          addBackgroundImage(doc);
        }
      },
    });

    // 2. Price (Below Table)
    const finalY = (doc as any).lastAutoTable?.finalY || tableStartY + 20; // get Y after table
    const gstRate = 0.18;
const amountWithGST = amount + amount * gstRate;

// Price text
const priceText = `HA Price incl. 18% GST: Rs. ${amountWithGST.toFixed(2)} /-`;
    const priceWidth = doc.getTextWidth(priceText);
    const priceBoxWidth = priceWidth + (padding * 2);
    const priceX = centerX - (priceBoxWidth / 2);
    const priceY = finalY + lineSpacing;

    doc.setFillColor(220, 53, 69);
    doc.roundedRect(priceX, priceY, priceBoxWidth, badgeHeight, borderRadius, borderRadius, "F");

    doc.setTextColor(255, 255, 255);
    doc.text(priceText, centerX, priceY + 8, { align: "center" });

    const fileName = `${packageName.replace(/\s+/g, "_")}_Brochure.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error("Error generating PDF:", error);
    doc.save(`${packageName}_Simple.pdf`);
  }
};

  return (
    <button 
      onClick={downloadPDF} 
      className="btn btn-outline-primary ms-2 ml-1"
      style={{ 
         
      }}
    >
      <i className="bi bi-download"></i>
      Download Brochure
    </button>
  );
};

export default DownloadBrochure;