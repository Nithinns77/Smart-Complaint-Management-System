import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// 🔥 ADD THIS (important)
const API = "http://localhost:3000";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    description: "",
  });

  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // 🔹 Fetch complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API}/complaint`); // ✅ FIXED
      setComplaints(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", form); // 🔍 DEBUG

    try {
      await axios.post(`${API}/complaint`, form); // ✅ FIXED
      fetchComplaints();
      setForm({ name: "", email: "", category: "", description: "" });
    } catch (err) {
      console.log("Submit error:", err);
    }
  };

  // 🔹 Delete
  const deleteComplaint = async (id) => {
    await axios.delete(`${API}/complaint/${id}`); // ✅ FIXED
    fetchComplaints();
  };

  // 🔹 Update status
  const updateStatus = async (id) => {
    await axios.put(`${API}/complaint/${id}`, { // ✅ FIXED
      status: "Resolved",
    });
    fetchComplaints();
  };

  // 🔹 Filter + Search
  const filteredComplaints = complaints
    .filter((c) => (filter === "All" ? true : c.status === filter))
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    );

  // 🔹 Dashboard counts
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="container">
      <h1 className="title">🚀 Smart Complaint System</h1>

      {/* 🔹 DASHBOARD */}
      <div className="dashboard">
        <div className="card-box">
          <b>Total</b><br />{total}
        </div>
        <div className="card-box">
          <b>Pending</b><br />{pending}
        </div>
        <div className="card-box">
          <b>Resolved</b><br />{resolved}
        </div>
      </div>

      {/* 🔹 FORM */}
      <div className="card-box">
        <h3>Add Complaint</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          ></textarea>

          {/* 🔥 FIXED BUTTON */}
          <button type="submit" className="btn-primary">
            Submit
          </button>
        </form>
      </div>

      {/* 🔹 SEARCH + FILTER */}
      <div className="card-box">
        <input
          placeholder="🔍 Search by name or category..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <button className="btn-filter" onClick={() => setFilter("All")}>
            All
          </button>
          <button className="btn-filter" onClick={() => setFilter("Pending")}>
            Pending
          </button>
          <button className="btn-filter" onClick={() => setFilter("Resolved")}>
            Resolved
          </button>
        </div>
      </div>

      {/* 🔹 LIST */}
      {filteredComplaints.map((c) => (
        <div key={c._id} className="card-box">
          <h4>{c.name}</h4>
          <p>{c.email}</p>
          <p><b>Category:</b> {c.category}</p>
          <p>{c.description}</p>

          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color: c.status === "Resolved" ? "#00ffae" : "#ff6b6b",
              }}
            >
              {c.status}
            </span>
          </p>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="btn-danger"
              onClick={() => deleteComplaint(c._id)}
            >
              Delete
            </button>

            <button
              className="btn-success"
              onClick={() => updateStatus(c._id)}
            >
              Resolve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;