import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'
import srinivas from './SrinivasRao.png'

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
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({ username: '', password: '', phoneno: '' });
    const token = localStorage.getItem('token');
    const AdminToken = localStorage.getItem('AdminToken');

    const AddNewSite = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://start-site-server.vercel.app/AddNewSite", Site, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllSite([...AllSite, response.data]);
        } catch (error) {
            console.error("Error adding site:", error);
            alert("Failed to add site.");
        }
    };

    const DeleteSite = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this site?");

        if (!isConfirmed) {
            return;
        }

        try {
            await axios.delete(`https://start-site-server.vercel.app/DeleteSite/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllSite(AllSite.filter(site => site._id !== id));
        } catch (error) {
            console.error("Error deleting site:", error);
            alert("Failed to delete site.");
        }
    };


    const AddNewCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://start-site-server.vercel.app/AddNewCategory", Category, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAllCategory([...AllCategory, response.data]);
        } catch (error) {
            console.error("Error adding category:", error);
            alert("Failed to add category.");
        }
    };

    const [userName, setUserName] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://start-site-server.vercel.app/login", loginData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.user?.username || 'user');
            setUserName(response.data.user?.username || 'user');
            const userResponse = await axios.get("https://start-site-server.vercel.app/getUserBackground", {
                headers: { Authorization: `Bearer ${response.data.token}` }
            });

            setBackgroundImage(userResponse.data.backgroundImage || defaultBackgroundColor);
            window.location.reload();
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert(error.response?.data.msg || "Invalid credentials.");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://start-site-server.vercel.app/register", registerData);
            alert("Registration Successful. Please login.");
            window.location.reload();
        } catch (error) {
            console.error("Registration failed", error);
            alert("Registration failed");
        }
    };



    const [searchText, setSearchText] = useState(""); // Track search input
    const [filteredSites, setFilteredSites] = useState([]);




    // Google Search on Enter key press
    const googleSearch = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const text = searchText.trim();
        if (!text) return;

        // Google Search
        const cleanQuery = text.replace(/\s+/g, "+");
        const url = `http://www.google.com/search?q=${cleanQuery}`;
        window.open(url, "_blank");
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
            const updateResponse = await axios.put(`https://start-site-server.vercel.app/sites/${EditSite._id}`, {
                Name: EditSite.Name,
                Url: EditSite.Url,
                Logo: EditSite.Logo,
                Category: EditSite.Category
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = await axios.get('https://start-site-server.vercel.app/GetSite', {
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
            const response = await axios.post("https://start-site-server.vercel.app/admin/login", adminData);
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
            const response = await axios.post("https://start-site-server.vercel.app/admin/register", registerData);
            alert("Admin registration successful!");
        } catch (error) {
            console.error("Admin registration failed:", error.response?.data || error.message);
            alert(error.response?.data.msg || "Registration failed.");
        }
    };

    const [users, setUsers] = useState([]);


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
            const response = await axios.post('https://start-site-server.vercel.app/addSite', commonSite);
            setSites([...sites, response.data]);
            setCommonSite({ Name: '', Url: '', Logo: '', Category: '' });
        } catch (error) {
            console.error('Error adding site:', error);
        }
    };

    const [editCommonSite, setEditCommonSite] = useState({});

    const handleCommonSiteUpdate = async () => {
        try {
            const response = await axios.put(`https://start-site-server.vercel.app/editCommonSite/${editCommonSite._id}`, editCommonSite);
            setSites(prevSites => prevSites.map(site => site._id === editCommonSite._id ? response.data : site));
        } catch (error) {
            console.error('Error updating site:', error);
            alert('Failed to update site. Please try again.');
        }
    };

    const deleteSite = async (siteId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this site?");

        if (!isConfirmed) {
            return;
        }
        try {
            await axios.delete(`https://start-site-server.vercel.app/deletecommonsite/${siteId}`);
            setSites(prevSites => prevSites.filter(site => site._id !== siteId));
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
            const response = await axios.post('https://start-site-server.vercel.app/addCategory', commonCategory);
            setCommonCategories([...commonCategories, response.data]);
            alert('Category added successfully!');
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const [allCommonCategories, setAllCommonCategories] = useState([]);



    const [editMode, setEditMode] = useState(false);
    const [AdmineditMode, setAdminEditMode] = useState(false);

    const deleteCommonCategory = async (categoryId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Category?");

        if (!isConfirmed) {
            return;
        }
        try {
            await axios.delete(`https://start-site-server.vercel.app/deleteCommonCategory/${categoryId}`);
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
            await axios.post('https://start-site-server.vercel.app/feedback', { name, message });
            alert('Thank You for your valuable feedback.');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Error submitting feedback. Please try again.');
        }
    };

    const deleteCategory = async (categoryId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Category?");

        if (!isConfirmed) {
            return; // Exit the function if the user clicks "Cancel"
        }
        try {
            await axios.delete(`https://start-site-server.vercel.app/DeleteCategory/${categoryId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAllCategory(prevCategories => prevCategories.filter(category => category._id !== categoryId));
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        }
    };

    const defaultBackgroundColor = 'https://c4.wallpaperflare.com/wallpaper/379/399/753/rainbow-day-light-wait-wallpaper-preview.jpg';
    const [backgroundImage, setBackgroundImage] = useState(defaultBackgroundColor);
    // eslint-disable-next-line 
    const [commonBackground, setCommonBackground] = useState(defaultBackgroundColor);
    const [newBackgroundImage, setNewBackgroundImage] = useState('');

    const saveUserBackground = async () => {
        try {
            // eslint-disable-next-line
            const response = await axios.post("https://start-site-server.vercel.app/saveUserBackground", { backgroundImage }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Background image saved successfully!");
        } catch (error) {
            console.error("Error saving background image:", error);
            alert("Failed to save background image.");
        }
    };

    const updateCommonBackground = async () => {
        try {
            await axios.post('https://start-site-server.vercel.app/saveCommonBackground', { backgroundImage: newBackgroundImage });
            setCommonBackground(newBackgroundImage);
            alert("Common background updated successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Error saving common background:", error);
            alert("Failed to save common background.");
        }
    };



    const [showHomeSites, setShowHomeSites] = useState(false);

    const [showSubmenu, setShowSubmenu] = useState(false);
    const handleSubmenuClick = (e) => {
        e.stopPropagation(); // Stops Bootstrap from closing the dropdown
        setShowSubmenu(!showSubmenu);


    };

    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleCheckboxChange = (username) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(username)
                ? prevSelected.filter((name) => name !== username)
                : [...prevSelected, username]
        );
    };

    const handleSave = async () => {
        try {
            await axios.post("https://start-site-server.vercel.app/AddNewLockedUser", { names: selectedUsers });
            alert("Locked users updated successfully");
        } catch (error) {
            console.error("Error updating locked users:", error);
            alert("Failed to update locked users");
        }
    };

    useEffect(() => {
        console.log("🔁 useEffect: fetchLockedUsers triggered");
        const fetchLockedUsers = async () => {
            try {
                const response = await axios.get("https://start-site-server.vercel.app/GetLockedUsers");
                const lockedUsernames = response.data.map(user => user.name);
                setSelectedUsers(lockedUsernames);
            } catch (error) {
                console.error("Error fetching locked users:", error);
            }
        };
        fetchLockedUsers();
    }, []);

    useEffect(() => {
        console.log("🔁 useEffect: filterSitesBySearchText triggered");
        if (!searchText) {
            setFilteredSites([]);
            return;
        }

        const matchedSites = [...allSites, ...AllSite].filter((site) =>
            site.Name?.toLowerCase().includes(searchText.toLowerCase())
        );

        setFilteredSites(matchedSites);
    }, [searchText, allSites, AllSite]);

    useEffect(() => {
        console.log("🔁 useEffect: setUserName from localStorage triggered");
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUserName(storedUsername);
        }
    }, []);

    useEffect(() => {
        console.log("🔁 useEffect: fetchUserSites triggered");
        const fetchSites = async () => {
            if (!token) return;
            try {
                const response = await axios.get('https://start-site-server.vercel.app/GetSite', {
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
        console.log("🔁 useEffect: fetchUserCategories triggered");
        const fetchCategories = async () => {
            if (!token) return;
            try {
                const response = await axios.get('https://start-site-server.vercel.app/GetCategory', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllCategory(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [token]);

    useEffect(() => {
        console.log("🔁 useEffect: fetchAllUsers triggered");
        const fetchUsers = async () => {
            if (AdminToken) {
                try {
                    const response = await axios.get('https://start-site-server.vercel.app/getAllUsers', {
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
        console.log("🔁 useEffect: fetchFeedbacks triggered");
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('https://start-site-server.vercel.app/getfeedback');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };
        fetchFeedbacks();
    }, []);

    useEffect(() => {
        console.log("🔁 useEffect: fetchSitesAndCommonCategories triggered");
        const fetchSitesAndCategories = async () => {
            try {
                const sitesResponse = await axios.get('https://start-site-server.vercel.app/getAllSites');
                setAllSites(sitesResponse.data);

                const response = await axios.get('https://start-site-server.vercel.app/getAllCommonCategories');
                setAllCommonCategories(response.data);
            } catch (error) {
                console.error('Error fetching sites or categories', error);
            }
        };
        fetchSitesAndCategories();
    }, []);

    useEffect(() => {
        console.log("🔁 useEffect: fetchBackgroundImage triggered");
        const fetchUserBackground = async () => {
            try {
                const response = await axios.get('https://start-site-server.vercel.app/getUserBackground', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBackgroundImage(response.data.backgroundImage || defaultBackgroundColor);
            } catch (error) {
                console.error("Error fetching user background:", error);
                setBackgroundImage(defaultBackgroundColor);
            }
        };

        const fetchCommonBackground = async () => {
            try {
                const response = await axios.get('https://start-site-server.vercel.app/getCommonBackground');
                setCommonBackground(response.data.backgroundImage || defaultBackgroundColor);
                setBackgroundImage(response.data.backgroundImage || defaultBackgroundColor);
            } catch (error) {
                console.error("Error fetching common background:", error);
                setBackgroundImage(defaultBackgroundColor);
            }
        };

        if (token) {
            fetchUserBackground();
        } else {
            fetchCommonBackground();
        }
    }, [token, AdminToken]);

    return (
        <div className='IndexPage' style={{ backgroundImage: `url(${backgroundImage})` }}>

            <div className='mobile-Navigation'>
                <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#Navigation-Collapse" aria-expanded="false" aria-controls="Navigation-Collapse">
                    <img src='https://www.freeiconspng.com/thumbs/menu-icon/menu-icon-24.png' alt='...' />
                </button>
                <form className='Search' onSubmit={googleSearch}>
                    <input type="text" id="search" placeholder='Search Websit e or Google...' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </form>
                {
                    token ?
                        <span>{userName}</span>
                        : <span>GLANCE</span>
                }
            </div>
            <div className="collapse" id="Navigation-Collapse">
                <div className='options'>
                    {
                        token ?
                            <>
                                {
                                    !selectedUsers.includes(userName) || AdminToken ?
                                        <>
                                            {/* Users Modify */}
                                            <div className="dropend">
                                                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Modify
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li><div className='Checkbox dropdown-item'><input type='checkbox' checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />Edit Site</div></li>
                                                    <li><button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#AddNewSiteModal">Add Website</button></li>
                                                    <li><button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#AddNewCategoryModal">Add Category</button></li>
                                                    <li><button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#ChangeBackgroundModal">Change Background</button></li>
                                                </ul>
                                            </div>
                                        </>
                                        :
                                        null
                                }

                                {/* View Home */}
                                <div className="dropend">
                                    <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        View Home
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <div className="Checkbox dropdown-item">
                                                <input type="checkbox" checked={showHomeSites} onChange={(e) => setShowHomeSites(e.target.checked)} />Websites
                                            </div>
                                        </li>
                                        <li className='dropend'>
                                            <button className="dropdown-item dropdown-toggle" onClick={handleSubmenuClick}>
                                                Categories
                                            </button>
                                            <ul className={`dropdown-menu ${showSubmenu ? "show" : ""}`} style={{ position: "absolute", left: "100%", top: "0" }}>
                                                {allCommonCategories.map((category) => (
                                                    <li key={category._id}>
                                                        <a className="dropdown-item" href={`#${category.Name.replace(/\s+/g, '-').toLowerCase()}`}>
                                                            {category.Name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    </ul>
                                </div>

                                {/* User Sites Category Dropdown */}
                                <div className='dropend'>
                                    <button className='btn dropdown-toggle' type='button' data-bs-toggle='dropdown' aria-expanded='false'>
                                        Show My Categories
                                    </button>
                                    <ul className='dropdown-menu'>
                                        {AllCategory.map((category) => (
                                            <li key={category._id}>
                                                <a className='dropdown-item' href={`#${category.Category.replace(/\s+/g, '-').toLowerCase()}`}>
                                                    {category.Category}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div></>
                            :
                            null
                    }


                    {
                        AdminToken && !token ?
                            <>
                                {/* Admin Modify */}
                                <div className="dropend">
                                    <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Modify
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>  <div className='Checkbox dropdown-item'><input type='checkbox' checked={AdmineditMode} onChange={(e) => setAdminEditMode(e.target.checked)} />Edit Admin Page</div></li>
                                        <li> <button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#AddCommonSiteModal">Add Site</button></li>
                                        <li> <button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#AddCommonCategoryModal">Add Category</button></li>
                                        <li><button type="button" className="btn dropdown-item" data-bs-toggle="modal" data-bs-target="#changecommonbackgroundModal">Change Background</button></li>
                                    </ul>
                                </div>
                                <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#ShowFeedbackModal">Show Feedback</button>
                            </>
                            :
                            null
                    }

                    {
                        !AdminToken && !token ?
                            <>
                                <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#aboutModal">
                                    About
                                </button>
                                <button className='btn' data-bs-toggle="modal" data-bs-target="#FeedbackModal">Feedback</button></>
                            :
                            null
                    }

                    {
                        token ?
                            <>
                                <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                            </>
                            :
                            <>
                                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Categories
                                </button>
                                <ul className="dropdown-menu">
                                    {allCommonCategories.map((category) => (
                                        <li key={category._id}>
                                            <a className="dropdown-item" href={`#${category.Name.replace(/\s+/g, '-').toLowerCase()}`}>
                                                {category.Name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#LoginModal">User Login</button>
                                <button className='btn btn-danger' data-bs-toggle="modal" data-bs-target="#AdminModal">Admin</button>
                            </>
                    }
                </div>
            </div>

            <div className='Navigation'>
                <logo>
                    <img src='https://i.ibb.co/twFfTph6/pngegg.png' alt='...' />
                    {
                        token ?
                            <span>{userName}</span>
                            : <>GLANCE</>
                    }
                </logo>

                <form className='Search' onSubmit={googleSearch}>
                    <input type="text" id=" search" placeholder='Search Websit e or Google...' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </form>

                <div className='options'>
                    {
                        token ?
                            <>
                                {/* Users Modify */}
                                {
                                    !selectedUsers.includes(userName) || AdminToken ?
                                        <div className="dropdown">
                                            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                Modify
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li><div className='Checkbox dropdown-item'><input type='checkbox' checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />Edit Site</div></li>
                                                <li><button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#AddNewSiteModal">Add Website</button></li>
                                                <li><button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#AddNewCategoryModal">Add Category</button></li>
                                                <li><button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#ChangeBackgroundModal">Change Background</button></li>
                                            </ul>
                                        </div>
                                        :
                                        null
                                }


                                {/* View Home */}
                                <div className="dropdown">
                                    <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        View Home
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <div className="Checkbox dropdown-item">
                                                <input type="checkbox" checked={showHomeSites} onChange={(e) => setShowHomeSites(e.target.checked)} />Websites
                                            </div>
                                        </li>
                                        <li className='dropend'>
                                            <button className="dropdown-item dropdown-toggle" onClick={handleSubmenuClick}>
                                                Categories
                                            </button>
                                            <ul className={`dropdown-menu ${showSubmenu ? "show" : ""}`} style={{ position: "absolute", left: "100%", top: "0" }}>
                                                {allCommonCategories.map((category) => (
                                                    <li key={category._id}>
                                                        <a className="dropdown-item" href={`#${category.Name.replace(/\s+/g, '-').toLowerCase()}`}>
                                                            {category.Name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    </ul>
                                </div>

                                {/* User Sites Category Dropdown */}
                                <div className='dropdown'>
                                    <button className='btn btn-primary dropdown-toggle' type='button' data-bs-toggle='dropdown' aria-expanded='false'>
                                        Show My Categories
                                    </button>
                                    <ul className='dropdown-menu'>
                                        {AllCategory.map((category) => (
                                            <li key={category._id}>
                                                <a className='dropdown-item' href={`#${category.Category.replace(/\s+/g, '-').toLowerCase()}`}>
                                                    {category.Category}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div></>
                            :
                            null
                    }


                    {
                        AdminToken && !token ?
                            <>
                                {/* Admin Modify */}
                                <div className="dropdown">
                                    <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Modify
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>  <div className='Checkbox dropdown-item'><input type='checkbox' checked={AdmineditMode} onChange={(e) => setAdminEditMode(e.target.checked)} />Edit Admin Page</div></li>
                                        <li> <button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#AddCommonSiteModal">Add Site</button></li>
                                        <li> <button className='btn dropdown-item' data-bs-toggle="modal" data-bs-target="#AddCommonCategoryModal">Add Category</button></li>
                                        <li><button type="button" className="btn dropdown-item" data-bs-toggle="modal" data-bs-target="#changecommonbackgroundModal">Change Background</button></li>
                                    </ul>
                                </div>
                                <button type="button" className="btn btn-primary desktop" data-bs-toggle="modal" data-bs-target="#ShowFeedbackModal">Show Feedback</button>
                            </>
                            :
                            null
                    }

                    {
                        !AdminToken && !token ?
                            <>
                                <button type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#aboutModal">
                                    About
                                </button>
                                <button className='btn btn-warning' data-bs-toggle="modal" data-bs-target="#FeedbackModal">Feedback</button></>
                            :
                            null
                    }

                    {
                        token ?
                            <>
                                <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
                            </>
                            :
                            <>
                                <button className="btn btn-primary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Categories
                                </button>
                                <ul className="dropdown-menu">
                                    {allCommonCategories.map((category) => (
                                        <li key={category._id}>
                                            <a className="dropdown-item" href={`#${category.Name.replace(/\s+/g, '-').toLowerCase()}`}>
                                                {category.Name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <button className='btn btn-success' data-bs-toggle="modal" data-bs-target="#LoginModal">User Login</button>
                                <button className='btn btn-danger' data-bs-toggle="modal" data-bs-target="#AdminModal">Admin</button>
                            </>
                    }
                </div>
            </div>

            <div className='Site'>

                {/* Search Results */}
                {
                    searchText ?
                        <div className="AllSites row DropDown-Animation" style={{ backgroundColor: 'rgba(255, 255, 255, 0.87)' }}>
                            {
                                filteredSites.length > 0 ? (
                                    filteredSites.map((site, idx) => (
                                        <div key={idx} className="WebSite slideRightAnimation" style={{ animationDelay: `${0.5 + idx * 0.1}s` }}>
                                            <a href={site.Url} target='_blank' rel="noreferrer"><img src={site.Logo} alt='Site Logo' />{site.Name}</a>
                                        </div>
                                    ))
                                ) :
                                    <p>No Websites Found...</p>
                            }
                        </div>
                        :
                        null
                }

                {/* Users Sites */}
                {
                    token ?
                        <>
                            <div className='Categories row'>
                                {AllCategory.map((category, idx) => (
                                    <div key={idx} id={category.Category.replace(/\s+/g, '-').toLowerCase()} className='naming-problem'>
                                        <p>{category.Category}</p>
                                        <div className='Category'>
                                            {AllSite.filter(site => site.Category.trim().toLowerCase() === category.Category.trim().toLowerCase())
                                                .map((site, index) => (
                                                    <div key={index} className='WebSite slideRightAnimation' style={{ animationDelay: `${1 + index * 0.2}s` }}>
                                                        <a href={site.Url} target='_blank' rel="noreferrer"> <img src={site.Logo} alt='...' />{site.Name}</a>
                                                    </div>
                                                ))
                                            }
                                            {
                                                editMode && (
                                                    <button className='btn btn-outline-danger' onClick={() => deleteCategory(category._id)}> Delete Category:  {category.Category}</button>
                                                )
                                            }
                                        </div>

                                    </div>
                                ))}
                            </div>
                            {/* Display All Sites */}
                            <div className='AllSites row'>
                                {AllSite.map((Element, idx) => (
                                    <div key={idx} className='WebSite'>
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

                {/* Common Sites */}
                {
                    (!token || (token && showHomeSites)) && (
                        <>
                            <div className='Categories row'>
                                {allCommonCategories.map((category, idx) => (
                                    <div key={idx} id={category.Name.replace(/\s+/g, '-').toLowerCase()} className='naming-problem'>
                                        <p>{category.Name}</p>
                                        <div className='Category'>
                                            {allSites.filter(site => site.Category.trim().toLowerCase() === category.Name.trim().toLowerCase())
                                                .map((site, index) => (
                                                    <div key={index} className='WebSite slideRightAnimation' style={{ animationDelay: `${1 + index * 0.2}s` }}>
                                                        <a href={site.Url} target='_blank' rel="noreferrer"> <img src={site.Logo} alt='...' />{site.Name}</a>
                                                    </div>
                                                ))
                                            }
                                            {
                                                AdmineditMode && (
                                                    <button className='btn btn-outline-danger m-2' onClick={() => deleteCommonCategory(category._id)}> Delete Category:  {category.Name}</button>
                                                )
                                            }
                                        </div>

                                    </div>
                                ))}
                            </div>

                            <div className='AllSites row'>
                                {allSites.map((site, idx) => (
                                    <div key={idx} className='WebSite'>
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
                    )
                }
            </div>

            {/* MODALS */}

            {/* About Modal */}
            <div className="modal fade" id="aboutModal" tabIndex="-1" aria-labelledby="aboutModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="aboutModalLabel">About</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className='AboutWebsite'>
                                <p>
                                    <strong>W</strong>elcome to our website, designed to enhance your browsing experience and save you time.
                                    With our platform, you can easily search for and save your favorite websites without the hassle of searching each time.
                                    Our user-friendly interface allows you to categorize your saved sites, add unique logos, and customize your experience to suit your needs.
                                    Plus, you can edit all details to keep your information up to date and even change the wallpaper to personalize your space.
                                    This website can be accessed anywhere, on any device—whether it's a mobile phone, tablet, or laptop.
                                    Simplify your online navigation and make the most of your web experience with us!
                                </p>

                                <p>If you don't have an account or prefer not to create one, you can still enjoy quick access to our pre-saved websites directly from the home screen. Simply browse through the curated categories and popular sites we've saved to make it easy for you to find essential websites, no sign-up needed!</p>
                                <br />
                                <h4>Quick Start Guide</h4>
                                <h5>Sign Up:</h5>
                                Go to Login, select New User? Register, and create your account.<br /><br />
                                <h5>Log In:</h5>
                                Use your new credentials to log in.<br /><br />
                                <h5>Add Websites:</h5>
                                On your dashboard, start adding websites to your personal collection.<br /><br />
                                <h5>Organize & Customize:</h5>
                                Add categories, logos, and set a background for easy access.<br />
                                Now, all your favorite sites are saved and easy to find!
                            </div>
                            <div className='AboutAdmin'>
                                <div className='adminDetails'>
                                    <strong>Srinivas Rao</strong>
                                    <strong2>Contact Details</strong2> <a href="tel:9752375075">9752375075</a>
                                    <a href="mailto:cvipsecr@gmail.com">cvipsecr@gmail.com</a>
                                </div>
                                <img src={srinivas} alt='...' />
                            </div>
                        </div>
                        <div className="modal-footer privacy">
                            Your privacy is our top priority. All personal information and account details provided on this website are securely stored and protected against unauthorized access. We adhere to strict privacy standards, ensuring that your data remains safe and is never shared with third parties. Enjoy a secure experience every time you visit.
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
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


            {/* Change User Background Modal */}
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

            {/* Add New User Category Modal */}
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

            {/* Add New User Site Modal */}
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

            {/* Show Feedback Modal */}
            <div className="modal fade" id="ShowFeedbackModal" tabIndex="-1" aria-labelledby="ShowFeedbackModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="ShowFeedbackModalLabel">FeedBacks</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
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
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Common Background Modal */}
            <div className="modal fade" id="changecommonbackgroundModal" tabIndex="-1" aria-labelledby="changecommonbackgroundModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="changecommonbackgroundModalLabel">Change Background</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input
                                type="text"
                                placeholder="Enter background image URL"
                                value={newBackgroundImage}
                                onChange={(e) => setNewBackgroundImage(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={updateCommonBackground}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Common Category Modal */}
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

            {/* Add Common Site Modal */}
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

            {/* Admin Modal */}
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
                                    <button className='btn btn-primary mt-1' type="submit">Admin Login</button>
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
                                                <th>Lock Modify</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user.username}</td>
                                                    <td>{user.password}</td>
                                                    <td>{user.phoneno}</td>
                                                    <th><input type="checkbox" checked={selectedUsers.includes(user.username)} onChange={() => handleCheckboxChange(user.username)} /></th>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button className='btn btn-success' onClick={handleSave}>Save</button>
                                </div>
                            )}
                        </div>
                        {
                            AdminToken ?
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

            {/* Admin Register Modal */}
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

        </div>
    );
}