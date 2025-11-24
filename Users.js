import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        alert("❌ Error fetching users: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profession: user.profession || "",
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), editData);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, ...editData } : user
        )
      );
      setEditingId(null);
      alert("✓ User updated successfully!");
    } catch (error) {
      alert("❌ Error updating user: " + error.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter((user) => user.id !== userId));
        alert("✓ User deleted successfully!");
      } catch (error) {
        alert("❌ Error deleting user: " + error.message);
      }
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>👥 Registered Users</h1>
          <p style={styles.subtitle}>Total Users: {users.length}</p>
        </div>

        {loading ? (
          <p style={styles.loadingText}>⏳ Loading users...</p>
        ) : users.length === 0 ? (
          <p style={styles.emptyText}>📭 No users registered yet</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>Profession</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={styles.tableRow}>
                    {editingId === user.id ? (
                      <>
                        <td style={styles.td}>
                          <input
                            type="text"
                            value={editData.fullName}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                fullName: e.target.value,
                              })
                            }
                            style={styles.editInput}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) =>
                              setEditData({ ...editData, email: e.target.value })
                            }
                            style={styles.editInput}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) =>
                              setEditData({ ...editData, phone: e.target.value })
                            }
                            style={styles.editInput}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="text"
                            value={editData.address}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                address: e.target.value,
                              })
                            }
                            style={styles.editInput}
                          />
                        </td>
                        <td style={styles.td}>
                          <input
                            type="text"
                            value={editData.profession}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                profession: e.target.value,
                              })
                            }
                            style={styles.editInput}
                          />
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleSaveEdit(user.id)}
                            style={styles.saveBtn}
                          >
                            ✓ Save
                          </button>
                          <button
                            onClick={handleCancel}
                            style={styles.cancelBtn}
                          >
                            ✕ Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={styles.td}>{user.fullName}</td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>{user.phone}</td>
                        <td style={styles.td}>{user.address}</td>
                        <td style={styles.td}>{user.profession || "N/A"}</td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleEdit(user)}
                            style={styles.editBtn}
                          >
                            ✎ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            style={styles.deleteBtn}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back to Registration
        </button>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    backgroundImage: "url('https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "1200px",
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
  loadingText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    fontSize: "16px",
    color: "#999",
  },
  tableWrapper: {
    overflowX: "auto",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#667eea",
  },
  th: {
    padding: "15px",
    textAlign: "left",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
  },
  tableRow: {
    borderBottom: "1px solid #e0e0e0",
  },
  td: {
    padding: "12px 15px",
    fontSize: "14px",
    color: "#333",
  },
  editInput: {
    width: "100%",
    padding: "8px",
    border: "1px solid #667eea",
    borderRadius: "5px",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  editBtn: {
    padding: "6px 12px",
    background: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    marginRight: "5px",
    transition: "all 0.3s ease",
  },
  deleteBtn: {
    padding: "6px 12px",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  saveBtn: {
    padding: "6px 12px",
    background: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    marginRight: "5px",
    transition: "all 0.3s ease",
  },
  cancelBtn: {
    padding: "6px 12px",
    background: "#95a5a6",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  backBtn: {
    width: "100%",
    padding: "12px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};
