import axios from "axios";
import { useState, useEffect } from "react";
import CurAvail from "../../assets/images/currently_available.svg";
import Upcoming from "../../assets/images/upcoming_booking.svg";
import "./Dashboard.css";
const Card = (props) => {
  return (
    <div className="card-container">
      <div>
        <img src={props.image} className="card-image" />
      </div>
      <div className="card-content">
        <p className="content-title">{props.title}</p>
        <p style={{ fontWeight: 600, fontSize: "30px", color: "#696969" }}>
          {props.number}
        </p>
      </div>
    </div>
  );
};
const Dashboard = () => {
  const [desks, setDesks] = useState({ availDesks: 0, totalDesks: 0 });
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/api/booking/weekbookings").then((res) => setBookings(res.data));
    axios.get("/api/desk/availnow").then((res) => setDesks(res.data));
  }, []);
  return (
    <div className="container">
      <Card
        title="Upcoming bookings"
        number={bookings.length}
        image={Upcoming}
      />
      <Card
        title="Currently Available Desks"
        number={desks.availDesks + "/" + desks.totalDesks}
        image={CurAvail}
      />
    </div>
  );
};
export default Dashboard;
