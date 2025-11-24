import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (phone.length < 10) newErrors.phone = "Phone must be at least 10 digits";
    if (!address.trim()) newErrors.address = "Address is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "users"), {
        fullName,
        email,
        phone,
        address,
        profession,
        createdAt: new Date(),
      });

      alert("✓ User Registered Successfully!");

      setFullName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setProfession("");
      setErrors({});
    } catch (error) {
      alert("❌ Error registering user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📝 User Registration</h1>
          <p style={styles.subtitle}>Create your account in minutes</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>👤 Full Name *</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: "" });
              }}
              style={errors.fullName ? styles.inputError : styles.input}
              required
            />
            {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>📧 Email *</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              style={errors.email ? styles.inputError : styles.input}
              required
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>📱 Phone Number *</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: "" });
              }}
              style={errors.phone ? styles.inputError : styles.input}
              required
            />
            {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>🏠 Address *</label>
            <textarea
              placeholder="Enter your address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors({ ...errors, address: "" });
              }}
              style={errors.address ? styles.textareaError : styles.textarea}
              rows="3"
              required
            />
            {errors.address && <span style={styles.errorText}>{errors.address}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>💼 Profession (Optional)</label>
            <input
              type="text"
              placeholder="Enter your profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "⏳ Registering..." : "✓ Register Now"}
          </button>
        </form>

        <button style={styles.viewBtn} onClick={() => navigate("/users")}>
          👥 View All Users
        </button>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    backgroundImage: "url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGZsc2dnZWg1MjJ2aWY1eHBiMGl1cHhnd2RsNDBxMm8xbHc1NXdvaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aRZ4vTsHnyW6A/giphy.gif')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    width: "500px",
    maxWidth: "100%",
    padding: "40px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "15px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    color: "#333",
    margin: "0 0 10px 0",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
  },
  form: {
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    outline: "none",
  },
  inputError: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e74c3c",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
    backgroundColor: "#fadbd8",
  },
  textarea: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
  },
  textareaError: {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e74c3c",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    backgroundColor: "#fadbd8",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: "12px",
    marginTop: "5px",
    display: "block",
  },
  submitBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  },
  viewBtn: {
    width: "100%",
    padding: "12px",
    background: "#f0f0f0",
    color: "#333",
    border: "2px solid #667eea",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.1s ease",
  },
};
