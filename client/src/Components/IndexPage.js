import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function IndexPage() {
    const [Site, setSite] = useState({
        Name: ' ',
        Url: ' ',
        Logo: ' ',
        Category: ' '
    });

    const [Category, setCategory] = useState({
        Category: ' '
    });

    const [AllSite, setAllSite] = useState([]);
    const [AllCategory, setAllCategory] = useState([]);
    const defaultBackgroundColor = 'https://4kwallpapers.com/images/walls/thumbs_2t/11581.png';
    const [backgroundImage, setBackgroundImage] = useState(defaultBackgroundColor);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({ username: '', password: '', phoneno: '' });

    const token = localStorage.getItem('token');
    const AdminToken = localStorage.getItem('AdminToken');

    const AddNewSite = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/AddNewSite", Site, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Site added successfully!");
            setAllSite([...AllSite, response.data]);
        } catch (error) {
            console.error("Error adding site:", error);
            alert("Failed to add site.");
        }
    };

    const DeleteSite = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/DeleteSite/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Site deleted successfully!");
            setAllSite(AllSite.filter(site => site._id !== id));
        } catch (error) {
            console.error("Error deleting site:", error);
            alert("Failed to delete site.");
        }
    };

    const AddNewCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/AddNewCategory", Category, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Category added successfully!");
            setAllCategory([...AllCategory, response.data]);
        } catch (error) {
            console.error("Error adding category:", error);
            alert("Failed to add category.");
        }
    };

    const saveUserBackground = async () => {
        try {
            // eslint-disable-next-line
            const response = await axios.post("http://localhost:3001/saveUserBackground", { backgroundImage }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Background image saved successfully!");
        } catch (error) {
            console.error("Error saving background image:", error);
            alert("Failed to save background image.");
        }
    };

    useEffect(() => {
        const fetchUserBackground = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:3001/getUserBackground', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBackgroundImage(response.data.backgroundImage || defaultBackgroundColor);
            } catch (error) {
                console.error("Error fetching user background:", error);
                setBackgroundImage(defaultBackgroundColor);
            }
        };
        fetchUserBackground();
    }, [token]);

    const [userName, setUserName] = useState('');
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUserName(storedUsername); // Set the username from localStorage
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/login", loginData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.user?.username || 'user');
            setUserName(response.data.user?.username || 'user');
            const userResponse = await axios.get("http://localhost:3001/getUserBackground", {
                headers: { Authorization: `Bearer ${response.data.token}` }
            });

            setBackgroundImage(userResponse.data.backgroundImage || defaultBackgroundColor);
            alert("Login successful!");
            window.location.reload();
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert(error.response?.data.msg || "Invalid credentials.");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/register", registerData);
            alert("Registration Successful. Please login.");
            window.location.reload();
        } catch (error) {
            console.error("Registration failed", error);
            alert("Registration failed");
        }
    };

    useEffect(() => {
        const fetchSites = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:3001/GetSite', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllSite(response.data);
            } catch (error) {
                console.error("Error fetching sites:", error);
            }
        };
        fetchSites();
    }, [token]);

    useEffect(() => {
        const fetchCategories = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:3001/GetCategory', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllCategory(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [token]);

    const googleSearch = (event) => {
        event.preventDefault();
        var text = document.getElementById("search").value;
        var cleanQuery = text.replace(" ", "+", text);
        var url = "http://www.google.com/search?q=" + cleanQuery;
        window.open(url, '_blank');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('AdminToken');
        window.location.reload();
    };

    const [EditSite, setEditSite] = useState({
        _id: Site._id,
        Name: '',
        Url: '',
        Logo: '',
        Category: ''
    });

    const handleUpdate = async () => {
        try {
            // eslint-disable-next-line
            const updateResponse = await axios.put(`http://localhost:3001/sites/${EditSite._id}`, {
                Name: EditSite.Name,
                Url: EditSite.Url,
                Logo: EditSite.Logo,
                Category: EditSite.Category
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = await axios.get('http://localhost:3001/GetSite', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllSite(response.data);
            setEditSite({ Name: '', Url: '', Logo: '', Category: '' });
        } catch (error) {
            console.error("Error updating site:", error);
        }
    };
    const [adminData, setAdminData] = useState({ username: '', password: '' });

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/admin/login", adminData);
            alert("Admin login successful!");
            localStorage.setItem('AdminToken', response.data.token);
            window.location.reload();
        } catch (error) {
            console.error("Admin login failed:", error.response?.data || error.message);
            alert(error.response?.data.msg || "Invalid admin credentials.");
        }
    };

    const handleAdminRegister = async (e) => {
        e.preventDefault();
        try {
            // eslint-disable-next-line
            const response = await axios.post("http://localhost:3001/admin/register", registerData);
            alert("Admin registration successful!");
        } catch (error) {
            console.error("Admin registration failed:", error.response?.data || error.message);
            alert(error.response?.data.msg || "Registration failed.");
        }
    };

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            if (AdminToken) {
                try {
                    const response = await axios.get('http://localhost:3001/getAllUsers', {
                        headers: { Authorization: `Bearer ${AdminToken}` }
                    });
                    setUsers(response.data);
                } catch (error) {
                    console.error('Error fetching users', error);
                }
            }
        };

        fetchUsers();
    }, [AdminToken]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:3001/getfeedback');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };

        fetchFeedbacks();
    }, []);

    const [commonSite, setCommonSite] = useState({
        Name: '',
        Url: '',
        Logo: '',
        Category: ''
    });

    const [sites, setSites] = useState([]);

    const addSite = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/addSite', commonSite);
            setSites([...sites, response.data]);
            setCommonSite({ Name: '', Url: '', Logo: '', Category: '' });
            alert('Site added successfully!');
        } catch (error) {
            console.error('Error adding site:', error);
        }
    };

    const [editCommonSite, setEditCommonSite] = useState({});

    const handleCommonSiteUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:3001/editCommonSite/${editCommonSite._id}`, editCommonSite);
            setSites(prevSites => prevSites.map(site => site._id === editCommonSite._id ? response.data : site));
            alert('Site updated successfully!');
        } catch (error) {
            console.error('Error updating site:', error);
            alert('Failed to update site. Please try again.');
        }
    };

    const deleteSite = async (siteId) => {
        try {
            await axios.delete(`http://localhost:3001/deletecommonsite/${siteId}`);
            setSites(prevSites => prevSites.filter(site => site._id !== siteId));
            alert('Site deleted successfully!');
        } catch (error) {
            console.error('Error deleting site:', error);
            alert('Failed to delete site. Please try again.');
        }
    };

    const [allSites, setAllSites] = useState([]);
    const [commonCategory, setCommonCategory] = useState({
        Name: ''
    });

    const [commonCategories, setCommonCategories] = useState({});
    const addCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/addCategory', commonCategory);
            setCommonCategories([...commonCategories, response.data]);
            alert('Category added successfully!');
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const [allCommonCategories, setAllCommonCategories] = useState([]);

    useEffect(() => {
        const fetchSitesAndCategories = async () => {
            try {
                const sitesResponse = await axios.get('http://localhost:3001/getAllSites');
                setAllSites(sitesResponse.data);

                const response = await axios.get('http://localhost:3001/getAllCommonCategories');
                setAllCommonCategories(response.data);
            } catch (error) {
                console.error('Error fetching sites or categories', error);
            }
        };
        fetchSitesAndCategories();
    }, [allSites]);

    const [editMode, setEditMode] = useState(false);
    const [AdmineditMode, setAdminEditMode] = useState(false);

    const deleteCommonCategory = async (categoryId) => {
        try {
            await axios.delete(`http://localhost:3001/deleteCommonCategory/${categoryId}`);
            alert('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        }
    };

    const [feedbacks, setFeedbacks] = useState([]);
    const handleFeedbackSubmit = async (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const message = event.target.message.value;

        try {
            await axios.post('http://localhost:3001/feedback', { name, message });
            alert('Feedback submitted successfully!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback. Please try again.');
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            await axios.delete(`http://localhost:3001/DeleteCategory/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAllCategory(prevCategories => prevCategories.filter(category => category._id !== categoryId));
            alert('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        }
    };

    return (
        <div className='IndexPage' style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className='navbar'>
                <p>My WebSite At A Glance...</p>
                <form className='Search' onSubmit={googleSearch}>
                    <input id='search' type='text' placeholder='Google Search...' />
                </form>
                {/* Footer Buttons */}
                {
                    token ?
                        <div className='footer'>
                            <div className='editCheckbox'><input type='checkbox' checked={editMode}
                                onChange={(e) => setEditMode(e.target.checked)} />Edit Site</div>
                            <button className='btn btn-info' data-bs-toggle="modal" data-bs-target="#ChangeBackgroundModal">Change Background</button>
                            <button className='btn btn-info' data-bs-toggle="modal" data-bs-target="#AddNewCategoryModal">Add Category</button>
                            <button className='btn btn-info' data-bs-toggle="modal" data-bs-target="#AddNewSiteModal">Add WebSite</button>
                        </div>
                        :
                        null
                }

                {/* AdminFooter */}
                {
                    (AdminToken && !token) ?
                        <div className='footer'>
                            <div className='editCheckbox'><input type='checkbox' checked={AdmineditMode} onChange={(e) => setAdminEditMode(e.target.checked)} />Edit Admin Page</div>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ShowFeedbackModal">Show Feedback</button>
                            <div class="modal fade" id="ShowFeedbackModal" tabindex="-1" aria-labelledby="ShowFeedbackModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="ShowFeedbackModalLabel">FeedBacks</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            {feedbacks.length === 0 ? (
                                                <p>No feedback available.</p>
                                            ) : (
                                                <ul>
                                                    {feedbacks.map((feedback, index) => (
                                                        <li key={index}>
                                                            <strong>{feedback.name}:</strong> {feedback.message}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#AddCommonCategoryModal">Add Category</button>
                            <div className="modal fade" id="AddCommonCategoryModal" tabIndex="-1" aria-labelledby="AddCommonCategoryModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <form onSubmit={addCategory}> {/* Add the onSubmit handler */}
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="AddCommonCategoryModalLabel">Add Category</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <input
                                                    type="text"
                                                    placeholder="Category Name"
                                                    value={commonCategory.Name}
                                                    onChange={e => setCommonCategory({ Name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" className="btn btn-primary">Add Category</button> {/* Submit button */}
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#AddCommonSiteModal">Add Site</button>
                            <div className="modal fade" id="AddCommonSiteModal" tabIndex="-1" aria-labelledby="AddCommonSiteModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <form onSubmit={addSite}>
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="AddCommonSiteModalLabel">Add Site</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <input
                                                    type="text"
                                                    placeholder="Name"
                                                    value={commonSite.Name}
                                                    onChange={e => setCommonSite({ ...commonSite, Name: e.target.value })}
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="URL"
                                                    value={commonSite.Url}
                                                    onChange={e => setCommonSite({ ...commonSite, Url: e.target.value })}
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Logo"
                                                    value={commonSite.Logo}
                                                    onChange={e => setCommonSite({ ...commonSite, Logo: e.target.value })}
                                                    required
                                                />
                                                <select
                                                    value={commonSite.Category}
                                                    onChange={e => setCommonSite({ ...commonSite, Category: e.target.value })}
                                                    required>
                                                    <option value="">--Select Category--</option>
                                                    {allCommonCategories.map((category, index) => (
                                                        <option key={index} value={category.Name}>
                                                            {category.Name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="submit" className="btn btn-primary">Add Site</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
                <div className='Login'>
                    {token && <h3>{userName}</h3>}
                    {token ? (
                        <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                    ) : (
                        <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#LoginModal">Login</button>
                    )}
                    <button className='btn btn-danger' data-bs-toggle="modal" data-bs-target="#AdminModal">Admin</button>
                    <div className="modal fade" id="AdminModal" tabIndex="-1" aria-labelledby="AdminModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="AdminModalLabel">Admin Login</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    {!AdminToken ? (
                                        <form onSubmit={handleAdminLogin}>
                                            <label>Admin Username</label>
                                            <input type="text" value={adminData.username} onChange={(e) => setAdminData({ ...adminData, username: e.target.value })} />
                                            <label>Admin Password</label>
                                            <input type="password" value={adminData.password} onChange={(e) => setAdminData({ ...adminData, password: e.target.value })} />
                                            <button className='btn btn-warning mt-1' type="submit">Admin Login</button>
                                        </form>
                                    ) : (
                                        <div>
                                            <h5>Total Users: {users.length}</h5>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Username</th>
                                                        <th>Password</th>
                                                        <th>PhoneNo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((user, index) => (
                                                        <tr key={index}>
                                                            <td>{user.username}</td>
                                                            <td>{user.password}</td>
                                                            <td>{user.phoneno}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                {AdminToken ?
                                    <div className="modal-footer">
                                        <button className='btn btn-warning' onClick={handleAdminLogout}>Logout</button>
                                        <button className="btn btn-primary" data-bs-target="#AdminRegisterModal" data-bs-toggle="modal">Register</button>
                                    </div>
                                    :
                                    null
                                }

                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="AdminRegisterModal" aria-hidden="true" aria-labelledby="AdminRegisterModalLabel" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="AdminRegisterModalLabel">Register New Admin</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleAdminRegister}>
                                        <label>New Admin Username</label>
                                        <input type="text" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} />
                                        <label>New Admin Password</label>
                                        <input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
                                        <button className='btn btn-warning mt-1' type="submit">Register</button>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary" data-bs-target="#AdminModal" data-bs-toggle="modal">Back to Login</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Login Modal */}
            <div className="modal fade" id="LoginModal" tabIndex="-1" aria-labelledby="LoginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="LoginModalLabel">Login</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="modal-body">
                                <label>Username</label>
                                <input type="text" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} required />
                                <label>Password</label>
                                <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Login</button>
                                <button className="btn btn-link" data-bs-target="#RegisterModal" data-bs-toggle="modal">New User?</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Register Modal */}
            <div className="modal fade" id="RegisterModal" tabIndex="-1" aria-labelledby="RegisterModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="RegisterModalLabel">Register</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleRegister}>
                            <div className="modal-body">
                                <label>Username</label>
                                <input type="text" value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} required />
                                <label>Password</label>
                                <input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
                                <label>PhoneNo</label>
                                <input type="number" value={registerData.phoneno} onChange={(e) => setRegisterData({ ...registerData, phoneno: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className='Site'>
                {
                    token ?
                        <>
                            <div className='Categories row'>
                                {AllCategory.map((category, idx) => (
                                    <div key={idx} className='Category col-3'>
                                        {AllSite.filter(site => site.Category.trim().toLowerCase() === category.Category.trim().toLowerCase())
                                            .map((site, index) => (
                                                <div key={index} className='WebSite'>
                                                    <a href={site.Url} target='_blank' rel="noreferrer"> <img src={site.Logo} alt='...' />{site.Name}</a>
                                                </div>
                                            ))
                                        }
                                        {
                                            editMode && (
                                                <button className='btn btn-outline-danger' onClick={() => deleteCategory(category._id)}>Delete Category</button>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>
                            {/* Display All Sites */}
                            <div className='AllSites row'>
                                {AllSite.map((Element, idx) => (
                                    <div key={idx} className='WebSite col-1'>
                                        <a href={Element.Url} target='_blank' rel="noreferrer"><img src={Element.Logo} alt='...' />{Element.Name}</a>
                                        {
                                            editMode && (
                                                <>
                                                    <button
                                                        className='btn btn-outline-primary'
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#EditModal-${Element._id}`}
                                                        onClick={() => setEditSite({ ...Element })} >
                                                        Edit
                                                    </button>
                                                    <button className='btn btn-outline-danger' onClick={() => DeleteSite(Element._id)}>Delete</button>
                                                </>
                                            )
                                        }
                                        <div className="modal fade" id={`EditModal-${Element._id}`} tabIndex="-1" aria-labelledby="EditModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                                                        <div className="modal-header">
                                                            <h1 className="modal-title fs-5" id="EditModalLabel">Edit Site</h1>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <input type='text' value={EditSite.Name} onChange={(e) => setEditSite({ ...EditSite, Name: e.target.value })} placeholder='Name' />
                                                            <input type='text' value={EditSite.Url} onChange={(e) => setEditSite({ ...EditSite, Url: e.target.value })} placeholder='URL' />
                                                            <input type='text' value={EditSite.Logo} onChange={(e) => setEditSite({ ...EditSite, Logo: e.target.value })} placeholder='Logo URL' />
                                                            <select value={EditSite.Category} onChange={(e) => setEditSite({ ...EditSite, Category: e.target.value })} >
                                                                <option value="">--Select Category--</option>
                                                                {AllCategory.map((category, idx) => (
                                                                    <option key={idx} value={category.Category}>{category.Category}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                        : null
                }
                {
                    token ?
                        null
                        :
                        <>
                            <div className='Categories row'>
                                {allCommonCategories.map((category, idx) => (
                                    <div key={idx} className='Category col-3'>
                                        {allSites.filter(site => site.Category.trim().toLowerCase() === category.Name.trim().toLowerCase())
                                            .map((site, index) => (
                                                <div key={index} className='WebSite'>
                                                    <a href={site.Url} target='_blank' rel="noreferrer"><img src={site.Logo} alt='...' />{site.Name}</a>
                                                </div>
                                            ))
                                        }
                                        {
                                            (AdminToken && AdmineditMode) ?
                                                <button className='btn btn-outline-danger' onClick={() => deleteCommonCategory(category._id)}>Delete Category</button>
                                                :
                                                null
                                        }

                                    </div>
                                ))}
                            </div>

                            <div className='AllSites row'>
                                {allSites.map((site, idx) => (
                                    <div key={idx} className='WebSite col-1'>
                                        <a href={site.Url} target='_blank' rel="noreferrer"><img src={site.Logo} alt='Site Logo' />{site.Name}</a>
                                        {
                                            (AdminToken && AdmineditMode) ?
                                                <>
                                                    <button className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#EditCommonSiteModal" onClick={() => setEditCommonSite(site)}> Edit</button>

                                                    <div className="modal fade" id="EditCommonSiteModal" tabIndex="-1" aria-labelledby="EditCommonSiteModalLabel" aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <form onSubmit={(e) => { e.preventDefault(); handleCommonSiteUpdate(); }}>
                                                                    <div className="modal-header">
                                                                        <h1 className="modal-title fs-5" id="EditCommonSiteModalLabel">Edit Site</h1>
                                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <input
                                                                            type='text'
                                                                            value={editCommonSite.Name}
                                                                            onChange={(e) => setEditCommonSite({ ...editCommonSite, Name: e.target.value })}
                                                                            placeholder='Name'
                                                                            required
                                                                        />
                                                                        <input
                                                                            type='text'
                                                                            value={editCommonSite.Url}
                                                                            onChange={(e) => setEditCommonSite({ ...editCommonSite, Url: e.target.value })}
                                                                            placeholder='URL'
                                                                            required
                                                                        />
                                                                        <input
                                                                            type='text'
                                                                            value={editCommonSite.Logo}
                                                                            onChange={(e) => setEditCommonSite({ ...editCommonSite, Logo: e.target.value })}
                                                                            placeholder='Logo URL'
                                                                            required
                                                                        />
                                                                        <select
                                                                            value={editCommonSite.Category}
                                                                            onChange={(e) => setEditCommonSite({ ...editCommonSite, Category: e.target.value })}
                                                                            required
                                                                        >
                                                                            <option value="">--Select Category--</option>
                                                                            {allCommonCategories.map((category, index) => (
                                                                                <option key={index} value={category.Name}>
                                                                                    {category.Name}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                        <button type="submit" className="btn btn-primary">Save changes</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className='btn btn-outline-danger' onClick={() => { deleteSite(site._id); }}> Delete </button>
                                                </>
                                                :
                                                null
                                        }
                                    </div>
                                ))}
                            </div>
                        </>
                }
            </div>
            <div className='footer'>
                <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#FeedbackModal">Feedback</button>
                <div className="modal fade" id="FeedbackModal" tabIndex="-1" aria-labelledby="FeedbackModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="FeedbackModalLabel">Submit Feedback</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleFeedbackSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input type="text" className="form-control" id="name" required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea className="form-control" id="message" required></textarea>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary">Submit Feedback</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <div className="modal fade" id="ChangeBackgroundModal" tabIndex="-1" aria-labelledby="ChangeBackgroundModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="ChangeBackgroundModalLabel">Background Image Link</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type='url'
                                    placeholder='Background image link...'
                                    value={backgroundImage}
                                    onChange={(e) => setBackgroundImage(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => saveUserBackground()}>Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Add New Category Modal */}
            <div className="modal fade" id="AddNewCategoryModal" tabIndex="-1" aria-labelledby="AddNewCategoryModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={AddNewCategory}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="AddNewCategoryModalLabel">Add New Category</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input type='text' placeholder='Category Name' onChange={(e) => setCategory({ ...Category, Category: e.target.value })} />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Add Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Add New Site Modal */}
            <div className="modal fade" id="AddNewSiteModal" tabIndex="-1" aria-labelledby="AddNewSiteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={AddNewSite}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="AddNewSiteModalLabel">Add New Site</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input type='text' placeholder='Name' onChange={(e) => setSite({ ...Site, Name: e.target.value })} />
                                <input type='text' placeholder='URL' onChange={(e) => setSite({ ...Site, Url: e.target.value })} />
                                <input type='text' placeholder='Logo' onChange={(e) => setSite({ ...Site, Logo: e.target.value })} />
                                <select value={Site.Category} onChange={(e) => setSite({ ...Site, Category: e.target.value })}>
                                    <option value="" >--Select Category--</option>
                                    {AllCategory.map((category, idx) => (
                                        <option key={idx} value={category.Category}>{category.Category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Add Site</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
