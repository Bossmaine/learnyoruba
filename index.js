// function for signup
function signUp(event) {
    // prevents page reload
    event.preventDefault();

    // get spinner
    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    // get values from inputs
    const getName = document.getElementById("name").value;
    const getEmail = document.getElementById("email").value;
    const getPass = document.getElementById("password").value;
    const getConfirmPass = document.getElementById("confirmPassword").value;

    if (getName === "" || getEmail === "" || getPass === "" || getConfirmPass === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
        getSpin.style.display = "none";
    }

    if (getConfirmPass !== getPass) {
        Swal.fire({
            icon: 'info',
            text: 'Password do not match',
            confirmButtonColor: '#2D85DE'
        })
        getSpin.style.display = "none";
    }

    else {
        const signData = new FormData();
        signData.append("name", getName);
        signData.append("email", getEmail);
        signData.append("password", getPass);
        signData.append("password_confirmation", getConfirmPass);

        const signReq = {
            method: 'POST',
            body: signData
        }

        const url = "https://pluralcodesandbox.com/yorubalearning/api/register_admin";

        fetch(url, signReq)
        .then(response => response.json())
        .then(result => {
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })

                setTimeout(() => {
                    location.href = "index.html"
                }, 3000)
            }
            else {
                Swal.fire({
                    Icon: 'info',
                    text: 'Registration Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }

}

document.addEventListener("keyup", function signUp(event) {
    if (event.keyCode === 13) {
      document.getElementById("s-up").click();
    }
  });


function logIn(event) {
    event.preventDefault();

    const getSpin = document.querySelector('.spin');
    getSpin.style.display = 'inline-block';

    const getEmail = document.getElementById('email').value;
    const getPass = document.getElementById('password').value;

    if (getEmail === "" || getPass === "") {

        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
        getSpin.style.display = "none";

    }

    else {
        const logForm = new FormData();

        logForm.append('email', getEmail);
        logForm.append('password', getPass);

        const logReq = {
            method: 'POST',
            body: logForm
        }

        const url = 'https://pluralcodesandbox.com/yorubalearning/api/admin_login';

        fetch(url, logReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            localStorage.setItem('admin', JSON.stringify(result));
            const getItem = localStorage.getItem('admin');
            const theItem = JSON.parse(getItem);
            if (theItem.hasOwnProperty("email")) {
                location.href = "dashboard.html";
            } 
            
            else {
                Swal.fire({
                    icon: 'warning',
                    text: 'Login Unsuccessful',
                    confirmButtonColor: '#2D85DE'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}

document.addEventListener("keyup", function logIn(event) {
    if (event.keyCode === 13) {
      document.getElementById("l-in").click();
    }
  });

function dashBoardApi() {
    const myPageModal = document.querySelector(".pagemodal");
    myPageModal.style.display = "block";

    currentTime = new Date();
    hours = currentTime.getHours();
    
    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;

    const dashHeader = new Headers();
    dashHeader.append("Authorization", `Bearer ${token}`);

    const dashReq = {
        method: "GET",
        headers: dashHeader
    }

    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/admin_dashboardapi";

    fetch(url, dashReq)
    .then(response => response.json())
    .then(result => {
        const getCat = document.getElementById("category");
        const getLearn = document.getElementById("learnmat");
        const getSubCat = document.getElementById("subCat");
        const getQuiz = document.getElementById("quiz");
        const getStudent = document.getElementById("student");
        const adminName = document.getElementById("adminId");
        
        getCat.innerHTML = `${result.total_number_of_categories}`;
        getLearn.innerHTML = `${result.total_number_of_learningmaterial}`;
        getSubCat.innerHTML = `${result.total_number_of_subcategories}`;
        getQuiz.innerHTML = `${result.total_number_of_quize}`;
        getStudent.innerHTML = `${result.total_number_of_students}`;
        

        if(hours > 0 && hours < 12) {
            adminName.innerHTML = ` Good Morning ${result.admin_name}!`;
        } else if (hours >= 12 && hours < 17) {
            adminName.innerHTML = ` Good Afternoon  ${result.admin_name}!`;
        } else {
            adminName.innerHTML = ` Good Evening ${result.admin_name}!`;
        }

        myPageModal.style.display = "none";
    })
    .catch(error => console.log('error', error));
}

dashBoardApi();

function getAllStudent() {
    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;

    const getStudent = new Headers();
    getStudent.append("Authorization", `Bearer ${token}`);

    const dashReq = {
        method: "GET",
        headers: getStudent
    }

    let allStudent = [];

    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/get_all_students";

    fetch(url, dashReq)
    .then(response => response.json())
    .then (result => {
        console.log(result)

        const allStudentDash = document.getElementById("table-id");

        if(result.lenght === 0) {
            allStudentDash.innerHTML = "No Registered Student!"
        }

        else {
            result.map((item) => {
               allStudent += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.phone_number}</td>
                    <td>${item.position}</td>
                    <td>${item.total_score}</td>
                </tr>
                ` 
            })
            
        }
        allStudentDash.innerHTML = allStudent;
    })
    .catch(error => console.log('error', error));
}

getAllStudent();


function studentModal(event) {
    event.preventDefault();
    const myModal = document.querySelector(".mymodal");
    myModal.style.display = "block";

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;

    
    const topThree = new Headers();
    topThree.append("Authorization", `Bearer ${token}`);

    const dashReq = {
        method: "GET",
        headers: topThree
    }

    let resultData = [];

    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/top_three_students";

    fetch(url, dashReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const getStudent = document.querySelector(".allstudent");
        if (result.length === 0) {
            getStudent.innerHTML = "No available categories!"
        }
        else {
            result.map((item) => {
                resultData += `
                <div class="search-card">
                    <div class="theItem">
                        <p>Name:</p>
                        <p>${item.name}</p>
                    </div>
                    <div class="theItem">
                        <p>Email:</p>
                        <p>${item.email}</p>
                    </div>
                    <div class="theItem">
                        <p>Phone:</p>
                        <p>${item.phone_number}</p>
                    </div>
                    <div class="theItem">
                        <p>Position:</p>
                        <p>${item.position}</p>
                    </div>
                    <div class="theItem">
                        <p>Score:</p>
                        <p>${item.total_score}</p>
                    </div>
                </div>
                `
            })
            getStudent.innerHTML = resultData;
        }
    })
    .catch(error => console.log('error', error));
}

function closeDashModal() {
    const closeData = document.getElementById("dash-modal")
    closeData.style.display = "none";
}

function creatCategories(event) {
    event.preventDefault() 

    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    const getCatName = document.getElementById('cat-name').value;
    const getCatImg = document.getElementById('cat-img').files[0];

    if (getCatName === "" || getCatImg === "") {

        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
        getSpin.style.display = "none";

    }

    else {

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;
    
    var category = new Headers();
    category.append("Authorization", `Bearer ${token}`);

    const createCat = new FormData();

        createCat.append('name', getCatName);
        createCat.append('image', getCatImg);


    const requestCat = {
        method: 'POST',
        headers: category,
        body: createCat
    }

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/create_category";

        fetch(url, requestCat) 
        .then(response => response.json())
        .then(result => {
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: 'Category Created Successfully!',
                    confirmButtonColor: '#2D85DE'
            
            })

            setTimeout(() => {
                location.reload() = "index.html"
            }, 3000)
            }

            else {
                Swal.fire({
                    icon: 'error',
                    text: 'Category not created!',
                    confirmButtonColor: '#2D85DE'
                })
            }
            })
        .catch(error => console.log('error', error)); 

        getSpin.style.display = "none";
    }

}

function dispCategory() {
    
    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;

    var category = new Headers();
    category.append("Authorization", `Bearer ${token}`);

    const dashReq = {
        method: "GET",
        headers: category
    }

    let catDash = [];

    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/category_list";

    fetch(url, dashReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const catDisp = document.querySelector(".scroll-div")
        result.map((item) => {
            catDash +=  `
            <div class="student-card">
            <div class="cat-img">
            <a href="details.html?id=${item.id}&name=${item.name}">  <img src="${item.image}"></a>
            </div>
            <p>${item.name}</p>
            <div class="text-right">
                <button class="update-button" onclick="openCategory(${item.id})">Update</button>
                <button class="delete-button" onclick="deleteCategory(${item.id})">Delete</button>
            </div>
            </div>  `
        })
        catDisp.innerHTML = catDash;

    })
    .catch(error => console.log('error', error)); 
}

dispCategory();



let uniqueId;

function openCategory(modalId) {
    localStorage.setItem("id", modalId)

    const myModal = document.getElementById("my-modal3");
    myModal.style.display = "block";

    const getToken = localStorage.getItem('admin');
    const token = JSON.parse(getToken);
    const myToken = token.token;

    const catHeader = new Headers();
    catHeader.append("Authorization", `Bearer ${myToken}`);

    uniqueId = modalId

    const upReq = {
        method: 'GET',
        headers: catHeader
    }

    const url =  `https://pluralcodesandbox.com/yorubalearning/api/admin/get_details?category_id=${uniqueId}`;

    fetch(url, upReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const getUpName = document.getElementById("updateName")
        const getUpImg = document.getElementById("updateNameImage")

        getUpName.setAttribute('value', `${result.name}`);
        getUpImg.setAttribute('value', `${result.image}`)

        })
    .catch(error => console.log('error', error));
 }

 function closeModal3() {
    const myModal = document.getElementById("my-modal3");
    myModal.style.display = "none";
 }

 function chooseImg(event) {
    event.preventDefault();
    
    const div1 = document.querySelector(".getWrapp")
    const div2 = document.querySelector(".wrapper")

    div1.style.display = "none";
    div2.style.display = "block";
 }

 function updateCategory(event) {
    event.preventDefault();

    const getSpin = document.querySelector(".spin2");
    getSpin.style.display = "inline-block";

    const getUpname = document.getElementById("updateName").value;
    const getUimg1 = document.getElementById("updateNameImage").value;
    const getUimg2 = document.getElementById("updateImage").files[0];
    const getId = localStorage.getItem("id");

    if (getUpname === "") {
        Swal.fire({
            icon: 'info',
            text: 'the name field is required!',
            confirmButtonColor: "#2D85DE"
        })
        getSpin.style.display = "none";
    }
    else {
        const getToken = localStorage.getItem('admin');
        const token = JSON.parse(getToken);
        const myToken = token.token;

        const listHeaders = new Headers();
        listHeaders.append("Authorization", `Bearer ${myToken}`);

        const upFormData = new FormData();
        upFormData.append("name", getUpname);
        upFormData.append("image", getUimg1);
        upFormData.append("image", getUimg2);
        upFormData.append("category_id", getId);

        const upReq = {
            method: 'POST',
            headers: listHeaders,
            body: upFormData
        };

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/update_category";

        fetch(url, upReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                setTimeout(() => {
                    location.reload();
                }, 3000)
            }
            else{
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}

 function deleteCategory(myid) {
    const getToken = localStorage.getItem('admin');
    const token = JSON.parse(getToken);
    const myToken = token.token;

    const listHeaders = new Headers();
    listHeaders.append("Authorization", `Bearer ${myToken}`);

    const delReq = {
        method: 'GET',
        headers: listHeaders
    }

    const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/delete_category/${myid}`;

    fetch(url, delReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.status === "success") {
            Swal.fire({
                icon: 'success',
                text: `${result.message}`,
                confirmButtonColor: "#2D85DE"
            })
            setTimeout(() => {
                location.reload();
            }, 3000)
        }
        else {
            Swal.fire({
                icon: 'info',
                text: 'Unsuccessful',
                confirmButtonColor: "#2D85DE"
            })
        }
    })
    .catch(error => console.log('error', error));
}

function getItemUrl() {
    const myParams = new URLSearchParams(window.location.search);
    let catName = myParams.get('name');

    const displayCatName = document.querySelector(".det");
    displayCatName.innerHTML = catName;
}

function subCategory(event) {
    event.preventDefault();

    const params = new URLSearchParams(window.location.search);
    let getId = params.get('id');

    const getSpin2 = document.querySelector(".spin2");
    getSpin2.style.display = "inline-block";

    const subName = document.getElementById("subCatName").value;
    const subImg = document.getElementById("subCatImg").files[0];

    if (subName === "" || subImg === "") {

        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
        getSpin2.style.display = "none";
    } 
    else {
        
        const myToken = localStorage.getItem("admin");
        const theToken = JSON.parse(myToken);
        const token = theToken.token;

        var category = new Headers();
        category.append("Authorization", `Bearer ${token}`);

        const createCat = new FormData();

        createCat.append('name', subName);
        createCat.append('image', subImg);
        createCat.append('category_id', getId);

        const requestCat = {
            method: 'POST',
            headers: category,
            body: createCat
        }
    
        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/create_subcategory";
    
            fetch(url, requestCat) 
            .then(response => response.json())
            .then(result => {
                if (result.status === "success") {
                    Swal.fire({
                        icon: 'success',
                        text: 'Category Created Successfully!',
                        confirmButtonColor: '#2D85DE'
                
                })
    
                setTimeout(() => {
                    location.reload() = "details.html"
                }, 3000)
                }
    
                else {
                    Swal.fire({
                        icon: 'error',
                        text: 'Sub-Category not created!',
                        confirmButtonColor: '#2D85DE'
                    })
                }
                })
            .catch(error => console.log('error', error)); 

            getSpin2.style.display = "none";
    
    }
}

function subCategoryList() {
    const params = new URLSearchParams(window.location.search);
    let getId = params.get('id');

    console.log(getId);

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;

    console.log(token);

    var category = new Headers();
    category.append("Authorization", `Bearer ${token}`);

    const dashReq = {
        method: "GET",
        headers: category
    }

    let items = [];

    const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/category_details/${getId}`;

    fetch(url, dashReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result?.map((item) => {
            items +=`
              <div class="col-sm-12 col-md-12 col-lg-6">
                <div class="box-img2">
                <div class="fl-img">
                  <img src=${item.image}>
                </div>
                    <p class="p-3">${item.name}</p>
                    <div class="text-center">
                        <button class="update-button" onclick="openSubModal(${item.id})">Update</buton>
                    </div>
                </div>
              </div>
            `
            let info = document.querySelector(".row");
            info.innerHTML = items;
        })

    })
    .catch(error => console.log('error', error)); 
}

subCategoryList();

function upDateAdmin(event) {
    event.preventDefault();

    const getSpinner1 = document.querySelector(".spin");
    getSpinner1.style.display = "inline-block";

    const adminName = document.getElementById("updateName").value;
    const adminEmail = document.getElementById("updateEmail").value;

    if (adminName === "" || adminEmail === "") {

        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
        getSpinner1.style.display = "none";
    } 

    else {
        const myToken = localStorage.getItem("admin");
        const theToken = JSON.parse(myToken);
        const token = theToken.token;

        const updateAd = new Headers();
        updateAd.append("Authorization", `Bearer ${token}`);

        const upAd = new FormData();

        upAd.append('name', adminName);
        upAd.append('email', adminEmail);

        const requestUp = {
            method: 'POST',
            headers: updateAd,
            body: upAd
        }

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/admin_update_profile";

        fetch(url, requestUp)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if(result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: result.message,
                    confirmButtonColor: '#2D85DE'
                })
                getSpinner1.style.display = "none";
            }
            else {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to update!',
                    confirmButtonColor: '#2D85DE'
                })

                getSpinner1.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}

function upDatePassword(event) {
    event.preventDefault();

    const getSpinner = document.querySelector(".spin2");
    getSpinner.style.display = "inline-block";

    const adEmail = document.getElementById("updatePassEmail").value;
    const adpass = document.getElementById("updatePassword").value;
    const confirmAdPass = document.getElementById("updatePassword").value;

    if(adEmail === "" || adpass === "" || confirmAdPass === "") {
        Swal.fire({
            icon: 'success',
            text: result.message,
            confirmButtonColor: '#2D85DE'
        })
        getSpinner.style.display = "none";

    }

    if (adpass !== confirmAdPass) {
        Swal.fire({
            icon: 'info',
            text: 'Password do not match',
            confirmButtonColor: '#2D85DE'
        })
        getSpinner.style.display = "none";
    }
    
    else {
        const myToken = localStorage.getItem("admin");
        const theToken = JSON.parse(myToken);
        const token = theToken.token;

        const updateAdPass = new Headers();
        updateAdPass.append("Authorization", `Bearer ${token}`);

        const upAdPass = new FormData();

        upAdPass.append('email', adEmail);
        upAdPass.append('password', adpass);
        upAdPass.append('password_confirmation', confirmAdPass)

        const requestUpAd = {
            method: 'POST',
            headers: updateAdPass,
            body: upAdPass
        }

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/admin_update_password";

        fetch(url, requestUpAd)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if(result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                getSpinner.style.display = "none";
            }

            else {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to update!',
                    confirmButtonColor: '#2D85DE'
                })

                getSpinner.style.display = "none";
            }
            
        })
        .catch(error => console.log('error', error));
    }
}


function logout() {
  
    localStorage.clear();
    location.href = "index.html"
  
}

