import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

function App() {
  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
    },
    {
      name: "Hobbies",
      selector: (row) => row.hobbies,
      cell: (d) => <span>{d.hobbies.join(", ")}</span>,
    },
    {
      name: "Dob",
      selector: (row) => row.dob,
    },
    {
      name: "Edit",
      cell: (row) => <button onClick={() => updateStu(row.id)}>Edit</button>,
    },
    {
      name: "Del",
      cell: (row) => <button onClick={() => deleteStu(row.id)}>Del</button>,
    },
  ];

  const [finalData, setFinalData] = useState(
    JSON.parse(localStorage.getItem("students")) || []
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    hobbies: [],
    id: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHobbiesChange = (e) => {
    const { options } = e.target;
    const selectedHobbies = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedHobbies.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      hobbies: selectedHobbies,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.dob ||
      !formData.gender ||
      formData.hobbies.length === 0
    ) {
      alert("All fields are required!");
      return;
    }
    if (formData.id !== "") {
      const updatedData = finalData.map((stu) =>
        stu.id === formData.id ? { ...stu, ...formData } : stu
      );
      setFinalData(updatedData);
    } else {
      setFinalData([...finalData, { ...formData, id: Date.now() }]);
    }

    handleCloseModal();
  };

  const deleteStu = (id) => {
    setFinalData(finalData.filter((i) => i.id !== id));
  };

  const updateStu = (id) => {
    const studentToUpdate = finalData.find((stu) => stu.id === id);

    if (studentToUpdate) {
      setFormData({ ...studentToUpdate });
      setShowModal(true);
    }
  };

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(finalData));
  }, [finalData]);

  const tableData = {
    columns,
    data: finalData,
  };
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (e) => {
    e.preventDefault();
    setFormData({
      name: "",
      id: "",
      email: "",
      dob: "",
      gender: "",
      hobbies: [],
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const modalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    display: showModal ? "block" : "none",
    maxWidth: "900px",
    width: "100%",
  };

  const overlayStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: showModal ? "block" : "none",
  };

  const customSortIcon = (column, sortDirection) => {
    if (sortDirection === "asc") {
      return <span>&#9660;</span>;
    }
    if (sortDirection === "desc") {
      return <span>&#9650;</span>;
    }
    return <span>&#8693;</span>;
  };

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">
            Navbar
          </a>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link to="/">Navbar</Link>
              </li>
            </ul>
            <div className="form-inline my-2 my-lg-0">
              <button
                className="btn btn-outline-success my-2 my-sm-0"
                onClick={(e) => handleOpenModal(e)}
              >
                Add student
              </button>
            </div>
          </div>
        </nav>
      </header>
      <div className="container py-5">
        {finalData && finalData.length > 0 ? (
          <DataTableExtensions {...tableData}>
            <DataTable
              noHeader
              defaultSortField="id"
              defaultSortAsc={false}
              pagination
              highlightOnHover
              sortIcon={customSortIcon}
              onSort={(column, sortDirection) => {
                // handle sort logic if needed
                console.log(column, sortDirection);
              }}
            />
          </DataTableExtensions>
        ) : (
          <div>
            No Record Found please add here
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="button"
              onClick={(e) => handleOpenModal(e)}
            >
              Add student
            </button>
          </div>
        )}
      </div>

      {/* model code */}
      <div>
        <div style={overlayStyles} onClick={handleCloseModal}></div>

        <div style={modalStyles} aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Student Form</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dob">DOB:</label>
                    <input
                      type="date"
                      className="form-control"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender:</label>
                    <div>
                      <label className="mr-2">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === "Male"}
                          onChange={handleInputChange}
                        />
                        Male
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === "Female"}
                          onChange={handleInputChange}
                        />
                        Female
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="hobbies">Hobbies:</label>
                    <select
                      multiple
                      className="form-control"
                      id="hobbies"
                      name="hobbies"
                      value={formData.hobbies}
                      onChange={handleHobbiesChange}
                    >
                      <option value="Reading">Reading</option>
                      <option value="Music">Music</option>
                      <option value="Sports">Sports</option>
                      <option value="Art">Art</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="close btn btn-warning"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
