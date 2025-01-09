<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vitepress';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const router = useRouter();
const isFetching = ref(false);
const iframeHtmlContent = ref('');

let baseUrl = '';
if (import.meta.env.MODE === 'development') {
    baseUrl = import.meta.env.VITE_DEV_BASE_URL;
} else if (import.meta.env.MODE === 'production') {
    baseUrl = import.meta.env.VITE_PRO_BASE_URL;
} else {
    console.log('Running client in unknown or development mode');
    baseUrl = import.meta.env.VITE_DEV_BASE_URL || '';
}

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

const fetchReportContent = async () => {
    isFetching.value = true;
    try {
        const token = localStorage.getItem('authToken');
        if (token && isTokenExpired(token)) throw new Error('Token expired. Please log in again.');

        const response = await axios.get(`${baseUrl}/api/report/read`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            withCredentials: true
        });
        const reportUrl = jwtDecode(response.data.signedUrl);
        iframeHtmlContent.value = reportUrl.url;
    } catch (error) {
        try {
            //const refreshToken = Cookies.get('refreshToken');
            //const refreshResponse = await axios.post(`${baseUrl}/api/auth/refreshToken`, { refreshToken });
            const refreshResponse = await axios.post(`${baseUrl}/api/auth/refreshToken`, {}, {
                withCredentials: true
            });
            localStorage.setItem('authToken', refreshResponse.data.token);

            const retryResponse = await axios.get(`${baseUrl}/api/report/read`, {
                headers: {
                    'Authorization': `Bearer ${refreshResponse.data.token}`,
                },
                withCredentials: true
            });
            const reportUrl = jwtDecode(retryResponse.data.signedUrl);
            iframeHtmlContent.value = reportUrl.url;
        } catch (error) {            
            localStorage.removeItem('authToken');
            Cookies.remove('refreshToken');
            router.go('/');
        }
    } finally {
        isFetching.value = false;
    }
};
</script>

<template>
    <div class="d-flex flex-column justify-center align-center ga-5 hero-container">
        <v-btn v-if="!iframeHtmlContent" density="default" :loading="isFetching" @click="fetchReportContent"
            class="elevation-0 report-btn">
            <span style="margin-right: 5px">Access Report</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM16.6919 12.2871C16.6539 12.3791 16.599 12.462 16.53 12.531L13.53 15.531C13.384 15.677 13.192 15.751 13 15.751C12.808 15.751 12.616 15.678 12.47 15.531C12.177 15.238 12.177 14.763 12.47 14.47L14.1899 12.75H8C7.586 12.75 7.25 12.414 7.25 12C7.25 11.586 7.586 11.25 8 11.25H14.189L12.469 9.53003C12.176 9.23703 12.176 8.76199 12.469 8.46899C12.762 8.17599 13.237 8.17599 13.53 8.46899L16.53 11.469C16.599 11.538 16.6539 11.6209 16.6919 11.7129C16.7679 11.8969 16.7679 12.1031 16.6919 12.2871Z"
                    fill="url(#paint0_linear_4961_9599)" />
                <defs>
                    <linearGradient id="paint0_linear_4961_9599" x1="3.30567" y1="-1.97616" x2="27.2872" y2="5.89878"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#F5FDFF" />
                        <stop offset="1" stop-color="#F5FDFF" />
                    </linearGradient>
                </defs>
            </svg>
        </v-btn>
        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
            {{ snackbarMessage }}
        </v-snackbar>
    </div>
    <div v-if="iframeHtmlContent">
        <iframe style="width: 100%; height: 500px; min-height: 89vh; margin-top: 5px;" frameborder="0"
            :src="iframeHtmlContent"></iframe>
    </div>
</template>

<style scoped>
.hero {
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.report-btn {
    font-family: 'General Sans';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.16px;
    color: #fff;
    height: 52px;
    border-radius: 100px;
    background-color: #0D0D0D;
    text-transform: unset !important;
    text-decoration: none;
}

.report-btn:hover {
    opacity: 0.8;
}

/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {
    .report-btn {
        height: 42px;
    }

    .click {
        width: 40px;
        margin-top: 5px;
        margin-right: -15px;
    }
}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {
    .hero-container {
        width: 90%;
    }

    .click {
        margin-top: 0;
        margin-right: 70px;
    }
}

@media screen and (max-width: 480px) {}
</style>