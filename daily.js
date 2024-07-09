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

                let tasksRef;
                switch (userOffice) {
                    case 'workvia':
                        tasksRef = ref(database, "Workvia");
                        break;
                    case 'workdesq':
                        tasksRef = ref(database, "Workdesq");
                        break;
                    case 'sso':
                        tasksRef = ref(database, "sso");
                        break;
                    case 'karyasthal':
                        tasksRef = ref(database, "Karyasthal");
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

function fetchAndDisplayTasks(tasksRef) {
    onValue(tasksRef, function(snapshot) {
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
    newEl.textContent = `${taskData.task} - ${taskData.time || 'No time specified'}`;
    newEl.addEventListener("click", function() {
        window.location.href = `taskDetails.html?id=${taskId}`;
    });
    shoppingListEl.appendChild(newEl);
}

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
                    document.getElementById("adminOfficeSelectionBtn").style.display = "block";
                }

                let tasksRef;
                switch (userOffice) {
                    case 'workvia':
                        tasksRef = ref(database, "Workvia");
                        break;
                    case 'workdesq':
                        tasksRef = ref(database, "Workdesq");
                        break;
                    case 'sso':
                        tasksRef = ref(database, "sso");
                        break;
                    case 'karyasthal':
                        tasksRef = ref(database, "Karyasthal");
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
