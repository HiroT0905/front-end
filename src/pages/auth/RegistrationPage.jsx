import React, { useState } from "react";
import UserService from "../../service/userService";
import { useNavigate } from "react-router-dom";

function RegistrationPage() {
  const navigate = useNavigate();

  // State for form data and contact info
  const [formData, setFormData] = useState({
    cccd: "",
    password: "",
    fullName: "",
    dob: "",
    sex: "",
    address: "",
  });

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  });

  const [isForm1Complete, setIsForm1Complete] = useState(false);

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    const stateSetter = formType === "form1" ? setFormData : setContactInfo;
    stateSetter((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Check if the user is already logged in
    if (token) {
      alert("You are already logged in. Please log out before registering a new account.");
      return;
    }

    try {
      // Combine form data and contact info
      const userData = { ...formData, ...contactInfo };

      // Register the user
      const response = await UserService.register(userData, token);

      if (response.code === 200) {
        alert("User registered successfully");
        navigate("/login");
      } else {
        alert(`Error: ${response.error}`);
      }

      // Reset the form after successful registration
      setFormData({
        cccd: "",
        password: "",
        fullName: "",
        dob: "",
        sex: "",
        address: "",
      });

      setContactInfo({
        email: "",
        phone: "",
      });

    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred while registering user.");
    }
  };

  const handleNext = () => {
    // Ensure the first part of the form is completed
    if (formData.cccd && formData.password && formData.fullName && formData.dob && formData.sex && formData.address) {
      setIsForm1Complete(true);
    } else {
      alert("Please complete all fields in the first part of the form.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Registration</h2>
        <form onSubmit={handleSubmit}>
          {/* First Form Part */}
          {!isForm1Complete ? (
            <>
              <div className="mb-4">
                <label htmlFor="cccd" className="block text-sm font-medium text-gray-600">CCCD</label>
                <input
                  type="text"
                  id="cccd"
                  name="cccd"
                  value={formData.cccd}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dob" className="block text-sm font-medium text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="sex" className="block text-sm font-medium text-gray-600">Sex</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange(e, "form1")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={(e) => handleInputChange(e, "form2")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={contactInfo.phone}
                  onChange={(e) => handleInputChange(e, "form2")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Register
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;