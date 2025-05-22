import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Heading,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

const FeedbackPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [type, setType] = useState("");
  const [eventId, setEventId] = useState("");
  const [pastEvents, setPastEvents] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();
  const { id: editId } = useParams();

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    const eventIdFromQuery = searchParams.get("eventId");

    if (eventIdFromQuery && !eventId) {
      setEventId(eventIdFromQuery);
      setType("event");
    }

    if (editId) {
      fetchFeedbackToEdit(editId);
    } else {
      fetchFeedbackList();
    }

    if (type === "event") {
      fetchPastEvents();
    }
  }, [type]);

  const fetchFeedbackToEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setRating(data.rating);
      setComment(data.comment);
      setType(data.type);
      if (data.type === "event") setEventId(data.event);
    } catch (err) {
      toast({ title: "Failed to load feedback", status: "error" });
    }
  };

  const fetchPastEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      const past = data.filter((event) => new Date(event.eventDate) < new Date());
      setPastEvents(past);
    } catch (error) {
      toast({ title: "Failed to load events", status: "error" });
    }
  };

  const fetchFeedbackList = async () => {
    if (!token) {
      toast({ title: "User not logged in", status: "warning" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/feedback/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFeedbackList(data);
    } catch (err) {
      toast({ title: "Error loading feedback", status: "error" });
    }
  };

  const handleSubmit = async () => {
    if (!rating || !comment || !type || (type === "event" && !eventId)) {
      toast({ title: "Please fill in all required fields", status: "warning" });
      return;
    }

    setSubmitting(true);

    const url = editId
      ? `http://localhost:5000/api/feedback/${editId}`
      : "http://localhost:5000/api/feedback";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          type === "event"
            ? { rating, comment, type, eventId }
            : { rating, comment, type }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: data.message || "Submission failed", status: "error" });
      } else {
        toast({
          title: editId ? "Feedback updated!" : "Feedback submitted!",
          status: "success",
        });
        navigate("/profile"); // Go back to profile
      }
    } catch (err) {
      toast({ title: "Error submitting feedback", status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxW="xl" mx="auto" mt={10} p={6} bg="white" borderRadius="lg" boxShadow="md">
      <Heading size="lg" mb={4}>
        {editId ? "Edit Your Feedback" : "Leave Your Feedback"}
      </Heading>

      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Feedback Type</FormLabel>
          <Select
            placeholder="Select type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            isDisabled={!!editId}
          >
            <option value="system">System Feedback</option>
            <option value="event">Event Feedback</option>
          </Select>
        </FormControl>

        {type === "event" && (
          <FormControl isRequired>
            <FormLabel>Select Event</FormLabel>
            <Select
              placeholder="Select past event"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              isDisabled={!!editId}
            >
              {pastEvents.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.eventName} - {new Date(event.eventDate).toLocaleDateString()}
                </option>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl isRequired>
          <FormLabel>Rating</FormLabel>
          <Select
            placeholder="Select rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 && "s"}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Comment</FormLabel>
          <Textarea
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          isLoading={submitting}
          loadingText={editId ? "Updating..." : "Submitting..."}
        >
          {editId ? "Update Feedback" : "Submit Feedback"}
        </Button>
      </VStack>

      {!editId && feedbackList.length > 0 && (
        <Box mt={8}>
          <Heading size="md" mb={2}>
            Your Previous Feedback
          </Heading>
          {feedbackList.map((fb) => (
            <Box key={fb._id} p={4} my={2} bg="gray.50" borderRadius="md" boxShadow="sm">
              <strong>Type:</strong> {fb.type}
              <br />
              {fb.event?.eventName && (
                <>
                  <strong>Event:</strong> {fb.event.eventName}
                  <br />
                </>
              )}
              <strong>Rating:</strong> {fb.rating} ⭐
              <br />
              <strong>Comment:</strong> {fb.comment}
              <br />
              <small>{new Date(fb.createdAt).toLocaleString()}</small>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FeedbackPage;
