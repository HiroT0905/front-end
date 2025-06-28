class OcrService {
    async extractImage(file) {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("http://localhost:8080/api/ocr/extract", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to extract image");
            }

            return await response.json(); // Expecting JSON response
        } catch (error) {
            console.error("Error in OcrService:", error);
            throw error;
        }
    }
}

const ocrService = new OcrService();
export default ocrService;