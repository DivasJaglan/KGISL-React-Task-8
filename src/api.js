import React, { useEffect, useState } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { InputGroup, Toaster, Dialog, FormGroup } from "@blueprintjs/core";
import "./api.css";

const AppToster = Toaster.create({
  position: "top",
});

export default function Api() {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState({
    firstName: "",
    lastName: "",
    username: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch data from Mocky API
  useEffect(() => {
    fetch("https://run.mocky.io/v3/3251d07f-4c06-4b0a-a63b-c38672cd1e30")
      .then((res) => res.json())
      .then((response) => {
        setData(response);
        console.log(response); // Check the response in the console
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Update new data for adding a user
  const onUpdate = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new data (currently mock API doesn't support POST, so we'll just update local state)
  const onAdd = () => {
    // Adding the new user to the state (simulating a successful POST request)
    const newUser = {
      id: data.length + 1, // Using length as a unique ID for now
      firstName: newData.firstName,
      lastName: newData.lastName,
      username: newData.username,
    };

    setData((prevData) => [...prevData, newUser]);

    AppToster.show({
      message: "Data Added Successfully!",
    });

    setNewData({
      firstName: "",
      lastName: "",
      username: "",
    });
  };

  // Delete user from data
  const onDelete = (id) => {
    const updatedData = data.filter((user) => user.id !== id);
    setData(updatedData);

    AppToster.show({
      message: "User Deleted Successfully!",
      intent: "danger",
    });
  };

  // Open modal to edit user
  const onEdit = (user) => {
    setEditData(user);
    setIsModalOpen(true);
  };

  // Handle changes in the edit modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Save the edited data
  const handleSaveEdit = () => {
    const updatedData = data.map((user) =>
      user.id === editData.id ? editData : user
    );
    setData(updatedData);
    setIsModalOpen(false);

    AppToster.show({
      message: "User Updated Successfully!",
    });
  };

  return (
    <>
      <table className="custom-table rounded-3">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>
                <button
                  className="btn btn-outline-primary mx-2"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => onDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                name="firstName"
                value={newData.firstName}
                onChange={onUpdate}
                placeholder="Enter First Name"
              />
            </td>
            <td>
              <InputGroup
                name="lastName"
                value={newData.lastName}
                onChange={onUpdate}
                placeholder="Enter Last Name"
              />
            </td>
            <td>
              <InputGroup
                name="username"
                value={newData.username}
                onChange={onUpdate}
                placeholder="Enter Username"
              />
            </td>
            <td>
              <button className="btn btn-outline-success" onClick={onAdd}>
                ADD
              </button>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Modal for editing user */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit User"
      >
        <div className="bp4-dialog-body p-2 edit-body">
          <FormGroup label="First Name" labelFor="first-name">
            <InputGroup
              id="first-name"
              name="firstName"
              className="shadow"
              value={editData?.firstName || ""}
              onChange={handleEditChange}
              placeholder="Enter First Name"
            />
          </FormGroup>
          <FormGroup label="Last Name" labelFor="last-name">
            <InputGroup
              className="shadow"
              id="last-name"
              name="lastName"
              value={editData?.lastName || ""}
              onChange={handleEditChange}
              placeholder="Enter Last Name"
            />
          </FormGroup>
          <FormGroup label="Username" labelFor="username">
            <InputGroup
              className="shadow"
              id="username"
              name="username"
              value={editData?.username || ""}
              onChange={handleEditChange}
              placeholder="Enter Username"
            />
          </FormGroup>
        </div>
        <div className="bp4-dialog-footer">
          <button
            className="btn btn-outline-primary m-2"
            onClick={handleSaveEdit}
          >
            Save Changes
          </button>
          <button
            className="btn btn-outline-danger my-2"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Dialog>
    </>
  );
}
