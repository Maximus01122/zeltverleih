import {HashRouter as Router, Routes, Route} from "react-router-dom";
import DashboardPage from "@/tabs/stats/dashboard";
import BookingOverviewPage from "@/tabs/dashboard/bookings";
import {BookingSingleView} from "@/tabs/dashboard/singleview";
import {Warehouse} from "@/tabs/warehouse/Warehouse";
import CarouselBooking from "@/tabs/order/CarouselBooking";
import * as React from "react";
import {MaterialsOverview} from "@/tabs/materials/MaterialsOverview";
import LoginPage from "@/pages/LoginPage";
import {ProtectedRoute} from "@/components/ProtectedRoute";
import AnfragenOverview from "@/tabs/anfragen/AnfragenOverview";

function App() {
  return (
      <>
        <Router>
          <Routes>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/" element={<ProtectedRoute><BookingOverviewPage/></ProtectedRoute>}/>
              <Route path="/newbooking" element={<ProtectedRoute><CarouselBooking/></ProtectedRoute>}/>
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
              <Route path="/warehouse" element={<ProtectedRoute><Warehouse/></ProtectedRoute>}/>
              <Route path="/materials" element={<ProtectedRoute><MaterialsOverview/></ProtectedRoute>}/>
              <Route path="/anfragen" element={<ProtectedRoute><AnfragenOverview/></ProtectedRoute>}/>
              <Route path="/singleview" element={<ProtectedRoute><BookingSingleView/></ProtectedRoute>}/>
              <Route path="/edit" element={<ProtectedRoute><CarouselBooking/></ProtectedRoute>}/>
          </Routes>
        </Router>
      </>
  );
}

export default App;
