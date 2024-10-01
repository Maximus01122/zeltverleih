import {HashRouter as Router, Routes, Route} from "react-router-dom";
import DashboardPage from "@/tabs/dashboard/dashboard";
import BookingOverviewPage from "@/tabs/bookings/bookings";
import {BookingSingleView} from "@/tabs/bookings/singleview";
import {Warehouse} from "@/tabs/warehouse/Warehouse";
import {CarouselBooking} from "@/tabs/newOrder/ALLtogether";

function App() {

  return (
      <>
        <Router>
          <Routes>
              <Route path='/' element={<BookingOverviewPage/>}/>
              <Route path='/newbooking' element={<CarouselBooking/>}/>
              <Route path='/dashboard' element={<DashboardPage/>}/>
              <Route path='/warehouse' element={<Warehouse/>}/>

              <Route path='/singleview' element={<BookingSingleView/>}/>
              <Route path='/edit' element={<CarouselBooking/>}/>
          </Routes>
        </Router>
      </>
  );
}

export default App;
