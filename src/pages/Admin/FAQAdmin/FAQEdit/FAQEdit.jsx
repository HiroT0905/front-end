import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../../../service/userService"; // Make sure UserService has the updateFAQ function
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

const EditFaq = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [faqData, setFaqData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch FAQ data on component mount
  useEffect(() => {
    const fetchFaqDetails = async () => {
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await UserService.getFaqById(token, id); // Fetch FAQ by ID
        setFaqData({
          title: response.faqDTO.title,
          description: response.faqDTO.description,
        });
      } catch (error) {
        console.error("Error fetching FAQ data:", error.message);
        setError("Unable to load FAQ data.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFaqDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaqData({ ...faqData, [name]: value }); // Update FAQ data
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      setLoading(true); // Start loading
      const token = localStorage.getItem("token"); // Get token from localStorage

      // Send update request to server
      const response = await UserService.updateFAQ(
        id,
        faqData.title,
        faqData.description,
        token
      );

      if (response) {
        alert("FAQ updated successfully!");
        navigate("/admin/faqs"); // Redirect to FAQ list after successful update
      } else {
        alert("Error updating FAQ.");
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      setError("Unable to update FAQ.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Update FAQ
        </Typography>
        {loading && <CircularProgress />} {/* Display loading indicator */}
        {error && <Typography color="error">{error}</Typography>}{" "}
        {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div class="flex flex-col gap-4">
            <div class="w-full">
              <TextField
                label="Title"
                name="title"
                value={faqData.title}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div class="w-full">
              <TextField
                label="Description"
                name="description"
                value={faqData.description}
                onChange={handleInputChange}
                fullWidth
                required
                multiline
                rows={4}
              />
            </div>

            <div class="w-full">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Updating..." : "Update FAQ"}
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </Box>
  );
};

export default EditFaq;
