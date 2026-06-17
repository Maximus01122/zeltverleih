import {HashRouter as Router, Routes, Route} from "react-router-dom";
import DashboardPage from "@/tabs/stats/dashboard";
import BookingOverviewPage from "@/tabs/dashboard/bookings";
import {BookingSingleView} from "@/tabs/dashboard/singleview";
import {Warehouse} from "@/tabs/warehouse/Warehouse";
import CarouselBooking from "@/tabs/order/CarouselBooking";
import * as React from "react";
import {MaterialsOverview} from "@/tabs/materials/MaterialsOverview";

function App() {
  return (
      <>
        <Router>
          <Routes>
              <Route path='/' element={<BookingOverviewPage/>}/>
              <Route path='/newbooking' element={<CarouselBooking/>}/>
              <Route path='/dashboard' element={<DashboardPage/>}/>
              <Route path='/warehouse' element={<Warehouse/>}/>
              <Route path='/materials' element={<MaterialsOverview/>}/>

              <Route path='/singleview' element={<BookingSingleView/>}/>
              <Route path='/edit' element={<CarouselBooking/>}/>
          </Routes>
        </Router>
      </>
  );
}

export default App;
