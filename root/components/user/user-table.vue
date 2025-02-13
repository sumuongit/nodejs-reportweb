<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vitepress';
import { jwtDecode } from 'jwt-decode';
import EditRegisterDialog from '../../components/register/register-form-edit-dialog.vue'

const router = useRouter();

let baseUrl = '';
if (import.meta.env.MODE === 'development') {
  baseUrl = import.meta.env.VITE_DEV_BASE_URL;
} else if (import.meta.env.MODE === 'production') {
  baseUrl = import.meta.env.VITE_PRO_BASE_URL;
} else {
  console.log('Running client in unknown or development mode');
  baseUrl = import.meta.env.VITE_DEV_BASE_URL || '';
}

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

const headers = ref([]);
const mobileHeaders = ref([]);
const items = ref([]);
const search = ref('');

const itemsPerPage = ref(5);
const page = ref(1);

const editDialog = ref(false);
const deleteDialog = ref(false);
//const dialogUserId = ref(null);
const selectedUser = ref(null);

const isTokenExpired = (token) => {
  try {
    const payload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    //console.error('Invalid token format:', error);
    return true;
  }
};

const loadItems = async () => {
  //loading.value = true;
  try {
    const token = localStorage.getItem('authToken');

    if (!token || isTokenExpired(token)) {
      throw new Error('Token expired. Please log in again.');
    }

    const response = await axios.get(`${baseUrl}/api/user/getUsers`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    // Ensure status is added if missing
    items.value = response.data.data.map((user) => ({
      ...user,
      status: user.status === 'active' ? 'active' : 'inactive',
      action: 'actions'
    }));
    items.value.sort((a, b) => a.name.localeCompare(b.name));
    //totalItems.value = response.data.total;
    snackbarMessage.value = 'Registered users fetched successfully';
    snackbarColor.value = 'success';
    snackbar.value = true;
  } catch (error) {
    try {
      const refreshResponse = await axios.post(`${baseUrl}/api/auth/refreshToken`, {}, {
        withCredentials: true
      });

      localStorage.setItem('authToken', refreshResponse.data.token);

      const response = await axios.get(`${baseUrl}/api/user/getUsers`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // Ensure status is added if missing
      items.value = response.data.data.map((user) => ({
        ...user,
        status: user.status === 'active' ? 'active' : 'inactive',
        action: 'actions'
      }));
      items.value.sort((a, b) => a.name.localeCompare(b.name));
      //totalItems.value = response.data.total;
      snackbarMessage.value = 'Registered users fetched successfully';
      snackbarColor.value = 'success';
      snackbar.value = true;
    }
    catch {
      localStorage.removeItem('authToken');
      router.go('/');
    }
    // console.error('Error fetching users:', error.message);
    // localStorage.removeItem('authToken');
    // router.go('/sign-in');
  }
  // finally {
  //   snackbar.value = true;
  // }
};

const onDelete = async (id) => {
  try {
    const token = localStorage.getItem('authToken');
    if (token && isTokenExpired(token)) throw new Error('Token expired. Please log in again.');

    await axios.delete(`${baseUrl}/api/user/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true
    });
    items.value = items.value.filter(item => item._id !== id);
    closeDialog();
  } catch (error) {
    try {
      const refreshResponse = await axios.post(`${baseUrl}/api/auth/refreshToken`, {}, {
        withCredentials: true
      });

      localStorage.setItem('authToken', refreshResponse.data.token);

      await axios.delete(`${baseUrl}/api/user/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${refreshResponse.data.token}`,
        },
        withCredentials: true
      });
      items.value = items.value.filter(item => item._id !== id);
      closeDialog();
    }
    catch {
      localStorage.removeItem('authToken');
      router.go('/');
    }
  }
};

const showEditDialog = (user) => {
  selectedUser.value = { ...user };
  editDialog.value = true;
};

const showDeleteDialog = (user) => {
  //dialogUserId.value = id;
  selectedUser.value = { ...user };
  deleteDialog.value = true;
};

const closeDialog = () => {
  deleteDialog.value = false;
  //dialogUserId.value = null;
};

const handleUserSave = async () => {
  await loadItems();
};

onMounted(async () => {
  headers.value = [
    { key: 'sl', title: 'SL No', align: "center", sortable: false },
    { key: 'name', title: 'Name', minWidth: 200, width: 200, align: 'start', sortable: true, fixed: true },
    { key: 'email', title: 'Email', minWidth: 200, width: 200, align: 'start', sortable: true, fixed: true },
    { key: 'role', title: 'Role', minWidth: 200, width: 200, align: 'start', sortable: true, fixed: true },
    { key: 'status', title: 'Status', minWidth: 200, width: 200, align: 'center', sortable: true, fixed: true },
    { key: 'action', title: '', minWidth: 200, width: 200, align: 'center', sortable: false, fixed: true }
  ],

    mobileHeaders.value = [
      { key: 'name', title: 'Name', align: 'start', sortable: true },
      { key: 'status', title: 'Status', align: 'center', sortable: true },
      { key: 'action', title: '', align: 'center', sortable: false }
    ];

  loadItems();
})

const windowWidth = ref(
  typeof window !== 'undefined' ? window.innerWidth : 0
);
const isMobile = computed(() => windowWidth.value < 768);

// Watch for window resize using a reactive windowWidth
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth;
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
  }
});
</script>

<template>
  <div class="d-flex flex-column justify-center align-center ga-5">
    <div class="d-flex flex-column justify-center align-center mt-10 wrapper">
      <v-card flat>
        <template v-slot:text>
          <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="underlined"
            hide-details single-line></v-text-field>
        </template>
        <v-data-table v-model:page="page" :headers="isMobile ? mobileHeaders : headers" :items="items" :search="search"
          :items-per-page=itemsPerPage :dense="isMobile" class="bg-white">
          <template v-slot:item.sl="{ index }">
            <div class="text-center">
              {{ (page - 1) * itemsPerPage + index + 1 }}
            </div>
          </template>
          <template v-slot:item.name="{ item }">
            <span class="user-name">{{ item.name }}</span>
          </template>
          <template v-slot:item.status="{ item }">
            <div class="text-center">
              <v-chip :color="item.status === 'active' ? 'green' : 'red'"
                :text="item.status === 'active' ? 'Active' : 'Inactive'" class="text-uppercase" size="small"
                label></v-chip>
            </div>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="d-flex ga-2 justify-center">
              <v-btn size="small" color="blue" icon="mdi-pencil" @click="showEditDialog(item)"></v-btn>
              <v-btn size="small" color="red" icon="mdi-delete" @click="showDeleteDialog(item)"></v-btn>
            </div>
            <v-dialog v-model="deleteDialog" max-width="450">
              <v-card class="pa-5 v-card-bg-color">
                <v-card-title class="d-flex justify-center text-h6">Confirm Deletion</v-card-title>
                <v-card-text>Are you sure you want to delete this user <b>{{ selectedUser.name }} - {{
                  selectedUser.email
                    }}</b>?</v-card-text>
                <v-card-actions class="d-flex justify-center ga-1">
                  <!-- <v-spacer></v-spacer> -->
                  <v-btn @click="closeDialog" class="elevation-0 register-btn">
                    <span style="margin-right: 5px">Cancel</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM16.6919 12.2871C16.6539 12.3791 16.599 12.462 16.53 12.531L13.53 15.531C13.384 15.677 13.192 15.751 13 15.751C12.808 15.751 12.616 15.678 12.47 15.531C12.177 15.238 12.177 14.763 12.47 14.47L14.1899 12.75H8C7.586 12.75 7.25 12.414 7.25 12C7.25 11.586 7.586 11.25 8 11.25H14.189L12.469 9.53003C12.176 9.23703 12.176 8.76199 12.469 8.46899C12.762 8.17599 13.237 8.17599 13.53 8.46899L16.53 11.469C16.599 11.538 16.6539 11.6209 16.6919 11.7129C16.7679 11.8969 16.7679 12.1031 16.6919 12.2871Z"
                        fill="url(#paint0_linear_5252_12040)" />
                      <defs>
                        <linearGradient id="paint0_linear_5252_12040" x1="3.30567" y1="-1.97616" x2="27.2872"
                          y2="5.89878" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#F5FDFF" />
                          <stop offset="1" stop-color="#F5FDFF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </v-btn>
                  <v-btn @click="onDelete(selectedUser._id)" class="elevation-0 register-btn">
                    <span style="margin-right: 5px">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM16.6919 12.2871C16.6539 12.3791 16.599 12.462 16.53 12.531L13.53 15.531C13.384 15.677 13.192 15.751 13 15.751C12.808 15.751 12.616 15.678 12.47 15.531C12.177 15.238 12.177 14.763 12.47 14.47L14.1899 12.75H8C7.586 12.75 7.25 12.414 7.25 12C7.25 11.586 7.586 11.25 8 11.25H14.189L12.469 9.53003C12.176 9.23703 12.176 8.76199 12.469 8.46899C12.762 8.17599 13.237 8.17599 13.53 8.46899L16.53 11.469C16.599 11.538 16.6539 11.6209 16.6919 11.7129C16.7679 11.8969 16.7679 12.1031 16.6919 12.2871Z"
                        fill="url(#paint0_linear_5252_12040)" />
                      <defs>
                        <linearGradient id="paint0_linear_5252_12040" x1="3.30567" y1="-1.97616" x2="27.2872"
                          y2="5.89878" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#F5FDFF" />
                          <stop offset="1" stop-color="#F5FDFF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <EditRegisterDialog v-model="editDialog" @update:dialog="editDialog = false" :userData="selectedUser"
              @user-saved="handleUserSave">
            </EditRegisterDialog>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  color: #000;
}

.register-form {
  border: 1px solid #000;
  padding: 50px 75px;

  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 424px;
  margin: auto;
}

.v-text-field {
  width: 100%;
}

.register-btn {
  color: #fff;
  font-family: 'General Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.16px;
  text-transform: unset;
  min-width: 140px;
  height: 52px;
  border-radius: 100px;
  background: #0D0D0D;
}

.register-btn:hover {
  opacity: 0.8;
}

.v-card-bg-color:hover {
  background-color: #FFF !important;
}

.action-btn-cancel {
  /* width: 197px;
  height: 56px; */
  color: #fff;
  font-family: 'General Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.16px;
  border-radius: 6px;
  background: #2196F3;
  text-transform: unset !important;
  text-decoration: none;
}

.action-btn-cancel:hover {
  color: #fff;
  background: #1D87DA;
}

.action-btn-delete {
  /* width: 197px;
  height: 56px; */
  color: #fff;
  font-family: 'General Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.16px;
  border-radius: 6px;
  background: #F44336;
  text-transform: unset !important;
  text-decoration: none;
}

.action-btn-delete:hover {
  color: #fff;
  background: #DB3C30;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .user-name {
        background-color: black;
        color: white;
    }
}

/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {
  .wrapper {
    margin: 20px !important;
  }
}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {
  .register-form {
    padding: 50px 65px;
    max-width: unset;
  }
}

@media screen and (max-width: 480px) {}
</style>
