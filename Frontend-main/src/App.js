import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import { RecoilRoot, useSetRecoilState, useRecoilValue, useRecoilState } from "recoil"; // Import RecoilRoot
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";
import EventManager from "./Components/EventManager";
import AdoptADay from "./Components/AdoptADay";
import EditableTable from "./Components/ConfigurePrice";
import Bookings from "./Components/Bookings";
import DonorManagementHome from "./Components/DonorManagementHome";
import UpdateDonor from "./Components/UpdateDonor";
import RegisteredUsers from "./Components/RegisteredUsers";
import EditUser from "./Components/EditUser";
import AddUser from "./Components/AddUser";
import { currentUserState } from "./Components/Atoms";
import AuthenticationRoute from "./Components/AuthenticationRoute";
import CommonProtectedRoute from "./Components/CommonProtectedRoute";
import AdminRoute from "./Components/AdminRoute";
import NotFound from "./Components/NotFound";
import Register from "./Components/Register";
import ClientRoute from "./Components/ClientRoute";
import ClientDonation from "./Components/ClientDonation";
import BookingCalendar from "./Components/BookingCalendar";
import MakeBooking from "./Components/MakeBooking";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import Purposes from "./Components/Purposes";
import Relationships from "./Components/Relationships";
import MyBookings from "./Components/MyBookings";
import MyDonorManagementHome from "./Components/MyDonations";
import ContactUs from "./Components/ContactUs";
import About from "./Components/About";
import LandingPage from "./Components/LandingPage";
import Gallery from "./Components/Gallery";

const { persistAtom } = recoilPersist()

export const currentUserAtom = atom({
  key: 'currentUserState',
  default: null,
  effects_UNSTABLE: [persistAtom]
})


const API_URL = "https://https://api.kiruthirupathi.org/user";
const USER_ID = "1";

const App = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);


  useEffect(() => {
    if(currentUser?.auth_token) {
      console.log(currentUser.auth_token)
      const options = {
        method: 'GET',
        url: 'https://api.kiruthirupathi.org/user/me', // Assuming your API endpoint
        headers: { Authorization: currentUser.auth_token }
      };
      axios.request(options)
        .then(function (response) {
          console.log(response)
          console.log("current user: ", currentUser)
          setCurrentUser(currentUser => ({
            ...currentUser,
            data: response.data
          }));
          console.log(currentUserState);
        }).catch(function (error) {
          console.error(error);
        });
    }else{
      console.log("not logged in ", currentUser?.auth_token)
    }
    
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/404" element={<CommonProtectedRoute><NotFound /></CommonProtectedRoute>} />
        <Route path="/login" element={<AuthenticationRoute><Login /></AuthenticationRoute>} />
        <Route path="/register" element={<AuthenticationRoute><Register /></AuthenticationRoute>} />
        <Route path="/dashboard" element={<CommonProtectedRoute><Dashboard /></CommonProtectedRoute>} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<CommonProtectedRoute><About /></CommonProtectedRoute>} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/profile" element={<CommonProtectedRoute><Profile /></CommonProtectedRoute>} />
        <Route path="/profile/mybookings" element={<CommonProtectedRoute><MyBookings /></CommonProtectedRoute>} />
        <Route path="/profile/mydonations" element={<CommonProtectedRoute><MyDonorManagementHome /></CommonProtectedRoute>} />
        <Route path="/events" element={<AdminRoute><EventManager /></AdminRoute>} />
        <Route path="/adopt-a-day" element={<AdminRoute><AdoptADay /></AdminRoute>} />
        <Route path="/adopt-a-day/configure" element={<AdminRoute><EditableTable /></AdminRoute>} />
        <Route path="/adopt-a-day/bookings" element={<AdminRoute><Bookings /></AdminRoute>} />
        <Route path="/donor-management" element={<AdminRoute><DonorManagementHome /></AdminRoute>} />
        <Route path="/donor-management/update-donor" element={<AdminRoute><UpdateDonor /></AdminRoute>} />
        <Route path="/registered-users" element={<AdminRoute><RegisteredUsers /></AdminRoute>} />
        <Route path="/registered-users/edit" element={<AdminRoute><EditUser /></AdminRoute>} />
        <Route path="/registered-users/new" element={<AdminRoute><AddUser /></AdminRoute>} />
        <Route path="/purposes" element={<AdminRoute><Purposes /></AdminRoute>} />
        <Route path="/relationships/:id" element={<CommonProtectedRoute><Relationships /></CommonProtectedRoute>} />
        <Route path="/donor-client" element={<ClientRoute route="Donate"><ClientDonation /></ClientRoute>} />
        <Route path="/adopt-a-day-client" element={<BookingCalendar />} />
        <Route path="/book-adopt-a-day" element={<ClientRoute route="Form"><MakeBooking /></ClientRoute>} />
        <Route path="*" element={<CommonProtectedRoute><NotFound /></CommonProtectedRoute>} />
      </Routes>
    </Router>

  );
};

const Root = () => (
  <RecoilRoot>
    <App />
  </RecoilRoot>
);

export default Root;