import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAn2hwFs7g1StFNAGVbiOxTTcLbuNq1le0",
  authDomain: "propclean.firebaseapp.com",
  databaseURL: "https://propclean-default-rtdb.firebaseio.com",
  projectId: "propclean",
  storageBucket: "propclean.appspot.com",
  messagingSenderId: "795234019311",
  appId: "1:795234019311:web:369566b90b91139164781a",
  measurementId: "G-CE3LFP4HSJ"
};

// Initialize Firebase only if it hasn't been initialized already
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

const database = getDatabase();
const auth = getAuth();

const shoppingListEl = document.getElementById("shopping-list");

function showShimmerEffect() {
    const shimmerCount = 5; // Number of shimmer placeholders
    shoppingListEl.innerHTML = "";
    for (let i = 0; i < shimmerCount; i++) {
      const shimmerEl = document.createElement("li");
      shimmerEl.className = "shimmer";
  
      const shimmerImg = document.createElement("div");
      shimmerImg.style.width = "95%";
      shimmerImg.style.height = "160px";
      shimmerImg.style.marginTop = "5px";
  
      const shimmerTextContainer = document.createElement("div");
      shimmerTextContainer.style.width = "95%";
      shimmerTextContainer.style.height = "140px";
      shimmerTextContainer.style.display = "flex";
      shimmerTextContainer.style.flexDirection = "column";
      shimmerTextContainer.style.justifyContent = "center";
      shimmerTextContainer.style.alignItems = "center";
  
      for (let j = 0; j < 3; j++) {
        const shimmerText = document.createElement("span");
        shimmerTextContainer.appendChild(shimmerText);
      }
  
      shimmerEl.appendChild(shimmerImg);
      shimmerEl.appendChild(shimmerTextContainer);
  
      shoppingListEl.appendChild(shimmerEl);
    }
  }
  
  function hideShimmerEffect() {
    const shimmerEls = document.querySelectorAll(".shimmer");
    shimmerEls.forEach(shimmerEl => shimmerEl.remove());
  }

function isAdmin(email) {
  const adminEmails = ["shanvishukla39@gmail.com", "thomas@propques.com", "amdixit1711@gmail.com", "prashant.m@cubispace.com"];
  return adminEmails.includes(email);
}

onAuthStateChanged(auth, user => {
    if (user) {
        const userRef = ref(database, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                const userOffice = userData.office;

                if (isAdmin(user.email)) {
                    document.getElementById("adminDashboardLink").style.display = "block";
                    document.getElementById("adminOfficeSelectionBtn").style.display = "block";
                }

                switch (userOffice) {
                    case 'workvia':
                        tasksRef = ref(database, "Workvia");
                        break;
                    case 'workdesq':
                        tasksRef = ref(database, "Workdesq");
                        break;
                    case 'sso':
                        tasksRef = ref(database, "Sapna Sangeeta");
                        break;
                    case 'karyasthal':
                        tasksRef = ref(database, "Karyasthal");
                        break;
                    case 'cubispace':
                        tasksRef = ref(database, "Cubispace");
                        break;
                    case 'worqspot':
                        tasksRef = ref(database, "Worqspot");
                        break;
                    default:
                        alert('Unknown office');
                        window.location.href = 'index.html';
                        return;
                }
                document.body.classList.add(userOffice);
                fetchAndDisplayTasks(tasksRef);
                setInterval(() => {
                    fetchAndUpdateTaskStatuses(tasksRef);
                }, 3600000); 
            } else {
                alert('User data not found.');
                window.location.href = 'index.html';
            }
        });
    } else {
        window.location.href = 'index.html';
    }
});

function fetchAndDisplayTasks(ref) {
    tasksRef=ref;
    showShimmerEffect(); // Show shimmer effect while data is loading
  
    onValue(tasksRef, function(snapshot) {
      hideShimmerEffect(); // Hide shimmer effect once data is loaded
  
      if (snapshot.exists()) {
        let tasksArray = Object.entries(snapshot.val());
  
        // Sort tasks by time in ascending order
        tasksArray.sort((a, b) => {
          const timeA = parseTime(a[1].time);
          const timeB = parseTime(b[1].time);
          return timeA - timeB;
        });
  
        clearShoppingListEl();
  
        tasksArray.forEach(function(taskItem) {
          let taskData = taskItem[1];
          appendTaskToShoppingListEl(taskItem[0], taskData);
        });
      } else {
        shoppingListEl.innerHTML = "No tasks found";
      }
    });
  }



function parseTime(timeString) {
    if (!timeString) {
        return Infinity; // Set a very high value for missing times to sort them to the end
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}


function appendTaskToShoppingListEl(taskId, taskData) {
    let newEl = document.createElement("li");
    newEl.style.display = "flex";
    newEl.style.flexDirection = "column";
    newEl.style.justifyContent = "center";
    newEl.style.alignItems = "center";
    newEl.style.border = "1px solid #ccc";
    newEl.style.borderRadius = "12px";
    newEl.style.padding = "5px";
    newEl.style.marginBottom = "18px";
    newEl.style.backgroundColor = "#fff";
    newEl.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.35)";
    
    // Create image element for the task
    let imgEl = document.createElement("img");
    imgEl.alt = taskData.task; 
    imgEl.style.width = "95%";
    imgEl.style.height = "160px";
    imgEl.style.borderRadius = "8px";
    imgEl.style.objectFit = "cover";
    imgEl.style.marginTop = "5px";
    imgEl.style.boxShadow = "4px 4px 15px 0px rgb(51,94,247,0.2)";

    // Set image source based on taskData.time
    imgEl.src = "cabin1.webp"; // Replace with the actual image path

    if (taskData.time === "07:00") {
                imgEl.src = "cabin1.webp"; 
            } else if (taskData.time === "9:00") {
                imgEl.src = "water.jpg"; 
            } else if (taskData.time === "9:30") {
                imgEl.src = "reception.avif"; 
            } 
        else if (taskData.time === "10:00") {
            imgEl.src = "glass.jpeg"; 
        }
        else if (taskData.time === "12:00") {
            imgEl.src = "lunch.jpeg"; 
        }
        else if (taskData.time === "13:30") {
            imgEl.src = "break.jpeg"; 
        }
        else if (taskData.time === "14:00") {
            imgEl.src = "washroom.jpeg"; 
        }
        else if (taskData.time === "14:30") {
            imgEl.src = "dustbin.webp"; 
        }
            else {
                imgEl.src = "reception.avif"; 
            }

    // Create a container for the text details
    let textContainerEl = document.createElement("div");
    textContainerEl.style.display = "flex";
    textContainerEl.style.flexDirection = "column";
    textContainerEl.style.justifyContent = "center";
    textContainerEl.style.alignContent = "center";
    textContainerEl.style.height = "180px";
    textContainerEl.style.width = "95%";
    textContainerEl.style.position = "relative";

    // Create task detail elements
    let taskDescE1 = document.createElement("span");
    taskDescE1.textContent = "Task Details";
    taskDescE1.style.fontSize = "20px";
    taskDescE1.style.fontWeight = "800";
    taskDescE1.style.backgroundColor = "#EAEFFE";
    taskDescE1.style.width = "120px";
    taskDescE1.style.padding = "5px";
    taskDescE1.style.textAlign = "center";
    taskDescE1.style.color = "#335EF7";
    taskDescE1.style.borderRadius = "5px";
    taskDescE1.style.margin = "0 auto";


    let taskDetailEl = document.createElement("span");
    taskDetailEl.textContent = taskData.task;
    taskDetailEl.style.fontSize = "18px";
    taskDetailEl.style.fontWeight = "bold";
    taskDetailEl.style.textAlign = "left";
    taskDetailEl.style.margin = "0 auto";
    taskDetailEl.style.marginTop = "12px";
    taskDetailEl.style.width = "80%";
    

    let timeDetailEl = document.createElement("span");
    timeDetailEl.textContent = taskData.time;
    timeDetailEl.style.fontSize = "18px";
    timeDetailEl.style.fontWeight = "bold";
    timeDetailEl.style.color = "#335ef7";
    timeDetailEl.style.margin = "0 auto";
    timeDetailEl.style.marginTop = "8px";
    timeDetailEl.style.width = "80%";

    let statusEl = document.createElement("span");
    statusEl.textContent=taskData.status;
    statusEl.style.display = "inline-block";
    statusEl.style.padding = "5px 8px";
    statusEl.style.borderRadius = "5px";
    statusEl.style.position = "absolute";
    statusEl.style.bottom = "10px";
    statusEl.style.right = "5px";
    statusEl.style.fontSize = "20px";
    statusEl.style.fontWeight = "700";
    statusEl.style.color = "white";
    if (taskData.status.toLowerCase() === "complete") {
        statusEl.style.backgroundColor = "green";
    } else if (taskData.status.toLowerCase() === "incomplete") {
        statusEl.style.backgroundColor = "red";
    } else {
        statusEl.style.backgroundColor = "grey"; // Default color for other statuses
    }
    statusEl.style.margin = "0 auto";
    statusEl.style.marginTop = "8px";


    // Append task details to the container
    textContainerEl.appendChild(taskDescE1);
    textContainerEl.appendChild(taskDetailEl);
    textContainerEl.appendChild(timeDetailEl);
    textContainerEl.appendChild(statusEl);

    // Append image and text container to the list item
    newEl.appendChild(imgEl);
    newEl.appendChild(textContainerEl);

    newEl.addEventListener("click", function() {
        const office = document.body.className; // Get the office class set on the body
        window.location.href = `taskDetails.html?id=${taskId}&office=${office}`;
    });

    shoppingListEl.appendChild(newEl);
}
let tasksRef;
function fetchAndUpdateTaskStatuses() {
    onValue(tasksRef, function(snapshot) {
        if (snapshot.exists()) {
            let tasksArray = Object.entries(snapshot.val());

            tasksArray.forEach(function(taskItem) {
                let taskId = taskItem[0];
                let taskData = taskItem[1];

                // Update task status on the page if it's incomplete
                let taskEl = document.querySelector(`li[data-task-id="${taskId}"]`);
                if (taskEl) {
                    let statusEl = taskEl.querySelector("span:last-child");
                    if (taskData.status.toLowerCase() === "incomplete") {
                        statusEl.textContent = "incomplete";
                        statusEl.style.backgroundColor = "red";
                    } else if (taskData.status.toLowerCase() === "complete") {
                        statusEl.textContent = "complete";
                        statusEl.style.backgroundColor = "green";
                    } else {
                        statusEl.textContent = taskData.status;
                        statusEl.style.backgroundColor = "grey";
                    }
                }
            });
        }
    });
}
setInterval(() => {
    fetchAndUpdateTaskStatuses();
}, 3600000);

// Initial fetch to ensure data is loaded on page load
onAuthStateChanged(auth, user => {
    if (user) {
        const userRef = ref(database, 'users/' + user.uid);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                const userOffice = userData.office;
                if (isAdmin(user.email)) {
                    document.getElementById("adminDashboardLink").style.display = "block";
                    document.getElementById("adminOfficeSelectionBtn").textContent = userOffice;
                }

                switch (userOffice) {
                    case 'workvia':
                        tasksRef = ref(database, "Workvia");
                        break;
                    case 'workdesq':
                        tasksRef = ref(database, "Workdesq");
                        break;
                    case 'sso':
                        tasksRef = ref(database, "Sapna Sangeeta");
                        break;
                    case 'worqspot':
                        tasksRef = ref(database, "Worqspot");
                        break;
                    case 'karyasthal':
                        tasksRef = ref(database, "Karyasthal");
                        break;
                    case 'cubispace':
                        tasksRef = ref(database, "Cubispace");
                        break;
                    default:
                        alert('Unknown office');
                        window.location.href = 'index.html';
                        return;
                }

                document.body.classList.add(userOffice);
                fetchAndDisplayTasks(tasksRef);
            } else {
                alert('User data not found.');
                window.location.href = 'index.html';
            }
        });
    } else {
        window.location.href = 'index.html';
    }
});

