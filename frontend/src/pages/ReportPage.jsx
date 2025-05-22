import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  // ✅ Fetch Report from Backend
  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/feedback/report", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(response.data);
    } catch (err) {
      setError("Failed to fetch report data.");
    }
  };

  // ✅ Generate PDF Report
  const generatePDF = () => {
    if (!report) return;
  
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("Feedback Summary Report", 14, 20);
  
    doc.setFontSize(14);
    doc.text(`Average Rating: ${report.overallSummary.averageRating}`, 14, 30);
  
    let yPosition = 40; // Start Y-position for next section
  
    doc.setFontSize(12);
    doc.text("Key Comments:", 14, yPosition);
    yPosition += 10;
  
    report.overallSummary.topComments.forEach((comment) => {
      doc.text(`${comment}`, 14, yPosition); // Remove symbol from PDF
      yPosition += 10;
    });
  
    yPosition += 5;
    doc.text("Improvement Suggestions:", 14, yPosition);
    yPosition += 10;
  
    report.overallSummary.improvementSuggestions.forEach((suggestion) => {
      doc.text(`${suggestion}`, 14, yPosition); // Remove symbol from PDF
      yPosition += 10;
    });
  
    doc.addPage();
  
    doc.setFontSize(14);
    doc.text("Attendee-Specific Feedback", 14, 20);
  
    let startY = 30;
    Object.entries(report.attendeeSummary).forEach(([email, summary]) => {
      doc.setFontSize(12);
      doc.text(`User: ${email}`, 14, startY);
      doc.text(`Total Feedback: ${summary.totalFeedback}`, 14, startY + 10);
      doc.text(`Average Rating: ${summary.averageRating}`, 14, startY + 20);
      doc.text("Comments:", 14, startY + 30);
  
      summary.comments.forEach((comment, index) => {
        doc.text(`  - ${comment}`, 18, startY + 40 + index * 10); // No symbols in PDF
      });
  
      doc.text("Improvement Suggestions:", 14, startY + 60 + summary.comments.length * 10);
      summary.improvementSuggestions.forEach((suggestion, index) => {
        doc.text(`  - ${suggestion}`, 18, startY + 70 + summary.comments.length * 10 + index * 10); // No symbols in PDF
      });
  
      startY += 90 + summary.comments.length * 10 + summary.improvementSuggestions.length * 10;
      if (startY > 250) {
        doc.addPage();
        startY = 30;
      }
    });
  
    doc.save("Feedback_Report.pdf");
  };
  

  return (
    <div className="container mt-4">
      <h2>📊 Feedback Report</h2>
      {/* ✅ PDF Generation Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-success mt-3" onClick={generatePDF}>
          📄 Generate PDF Report
        </button>
      </div>
      <br></br>
      {error && <p className="text-danger">{error}</p>}
      {!report ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* ✅ Overall Summary */}
          <div className="card p-3 mb-3">
            <h4>Overall Summary</h4>
            <p><strong>📊 Average Rating:</strong> {report.overallSummary.averageRating}</p>
            <h5>📝 Key Comments:</h5>
            <ul>
              {report.overallSummary.topComments.length > 0 ? (
                report.overallSummary.topComments.map((comment, index) => <li key={index}>{comment}</li>)
              ) : (
                <p>No key comments available.</p>
              )}
            </ul>
            <h5>🔧 Improvement Suggestions:</h5>
            <ul>
              {report.overallSummary.improvementSuggestions.length > 0 ? (
                report.overallSummary.improvementSuggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)
              ) : (
                <p>No improvement suggestions available.</p>
              )}
            </ul>
          </div>

          {/* ✅ Attendee-Specific Summary */}
          <div className="card p-3">
            <h4>Attendee-Specific Feedback</h4>
            {Object.keys(report.attendeeSummary).length > 0 ? (
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Email</th>
                    <th>Total Feedback</th>
                    <th>Average Rating</th>
                    <th>Comments</th>
                    <th>Improvement Suggestions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.attendeeSummary).map(([email, summary], index) => (
                    <tr key={index}>
                      <td>{email}</td>
                      <td>{summary.totalFeedback}</td>
                      <td>{summary.averageRating}</td>
                      <td>
                        <ul>
                          {summary.comments.map((comment, idx) => (
                            <li key={idx}>{comment}</li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <ul>
                          {summary.improvementSuggestions.length > 0 ? (
                            summary.improvementSuggestions.map((suggestion, idx) => <li key={idx}>{suggestion}</li>)
                          ) : (
                            <p>No improvement suggestions</p>
                          )}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No attendee feedback available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportPage;