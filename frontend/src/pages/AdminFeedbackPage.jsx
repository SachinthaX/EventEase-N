import {
  Box,
  Heading,
  Select,
  VStack,
  Text,
  Button,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";               // default import
import autoTable from "jspdf-autotable"; // import the plugin factory
import axios from "axios";

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredRating, setFilteredRating] = useState("");
  const toast = useToast();

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(await res.json());
    } catch {
      toast({ title: "Failed to fetch feedback", status: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast({ title: "Deleted", status: "success" });
        setFeedbacks((f) => f.filter((fb) => fb._id !== id));
      } else throw new Error();
    } catch {
      toast({ title: "Delete failed", status: "error" });
    }
  };

  const generatePDFReport = async () => {
    try {
      const { data: report } = await axios.get(
        "http://localhost:5000/api/feedback/report/summary",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const doc = new jsPDF();

      // COVER
      doc.setFontSize(18);
      doc.text("📊 Feedback Summary Report", 14, 20);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Total Feedbacks: ${report.totalFeedbacks}`, 14, 38);
      doc.text(`Average Rating: ${report.averageRating}`, 14, 46);

      let y = 56;
      doc.setFontSize(14);
      doc.text("Top Comments:", 14, y);
      y += 8;
      doc.setFontSize(12);
      report.topComments.forEach((c) => {
        doc.text(`• ${c}`, 18, y);
        y += 7;
      });

      y += 5;
      doc.setFontSize(14);
      doc.text("Improvement Suggestions:", 14, y);
      y += 8;
      doc.setFontSize(12);
      report.improvementSuggestions.forEach((s) => {
        doc.text(`• ${s}`, 18, y);
        y += 7;
      });

      if (report.topRatedUsers?.length) {
        y += 10;
        doc.setFontSize(14);
        doc.text("Top Rated Users:", 14, y);
        y += 8;
        doc.setFontSize(12);
        report.topRatedUsers.forEach((u, i) => {
          doc.text(`${i + 1}. ${u.email} — Avg ${u.avg}`, 18, y);
          y += 7;
        });
      }

      // FULL LIST
      doc.addPage();
      doc.setFontSize(16);
      doc.text("📋 All Feedback Submissions", 14, 20);

      autoTable(doc, {
        startY: 28,
        head: [["User", "Type", "Event", "Rating", "Comment", "Date"]],
        body: report.allFeedbacks.map((f) => [
          f.user,
          f.type,
          f.event,
          f.rating,
          f.comment,
          new Date(f.createdAt).toLocaleDateString(),
        ]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [44, 62, 80], textColor: 255 },
      });

      doc.save("Feedback_Summary_Report.pdf");
    } catch (err) {
      console.error("Download error:", err);
      toast({ title: "Failed to download report", status: "error" });
    }
  };

  const filtered = filteredRating
    ? feedbacks.filter((fb) => String(fb.rating) === filteredRating)
    : feedbacks;

  const systemFeedback = filtered.filter((fb) => fb.type === "system");
  const eventFeedback = filtered.filter((fb) => fb.type === "event");

  return (
    <Box maxW="6xl" mx="auto" mt={10} p={6} bg="white" borderRadius="lg" boxShadow="md">
      <Heading size="lg" mb={6}>
        🛡️ Admin Feedback Dashboard
      </Heading>

      <HStack justify="space-between" mb={4}>
        <Select
          placeholder="Filter by rating"
          value={filteredRating}
          onChange={(e) => setFilteredRating(e.target.value)}
          maxW="200px"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && "s"}
            </option>
          ))}
        </Select>

        <Button colorScheme="purple" onClick={generatePDFReport}>
          📄 Download Feedback Report
        </Button>
      </HStack>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>System Feedback</Tab>
          <Tab>Event Feedback</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {systemFeedback.length === 0 ? (
                <Text>No system feedback found</Text>
              ) : (
                systemFeedback.map((fb) => (
                  <Box
                    key={fb._id}
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    boxShadow="sm"
                    position="relative"
                  >
                    <Text>
                      <strong>User:</strong> {fb.user?.email}
                    </Text>
                    <Text>
                      <strong>Rating:</strong> {"⭐".repeat(fb.rating)}
                    </Text>
                    <Text>
                      <strong>Comment:</strong> {fb.comment}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(fb.createdAt).toLocaleString()}
                    </Text>

                    <Button
                      size="sm"
                      colorScheme="red"
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={() => handleDelete(fb._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))
              )}
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {eventFeedback.length === 0 ? (
                <Text>No event feedback found</Text>
              ) : (
                eventFeedback.map((fb) => (
                  <Box
                    key={fb._id}
                    p={4}
                    bg="gray.50"
                    borderRadius="md"
                    boxShadow="sm"
                    position="relative"
                  >
                    <Text>
                      <strong>User:</strong> {fb.user?.email}
                    </Text>
                    <Text>
                      <strong>Rating:</strong> {"⭐".repeat(fb.rating)}
                    </Text>
                    <Text>
                      <strong>Event:</strong> {fb.event?.eventName || fb.event}
                    </Text>
                    <Text>
                      <strong>Comment:</strong> {fb.comment}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(fb.createdAt).toLocaleString()}
                    </Text>

                    <Button
                      size="sm"
                      colorScheme="red"
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={() => handleDelete(fb._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ))
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminFeedbackPage;
