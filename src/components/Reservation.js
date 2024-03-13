import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Reservation = (props) => {
  const navigate = useNavigate();
  
  const [bookedSeats,setBookedSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingDate, setBooingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingDetails, setBookingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(()=>{
    // fetch already booking data according date
    const fetchPessenerBookings = (bookingDate) =>{
      let pessengers = JSON.parse(localStorage.getItem("passengers"))
      if(pessengers) {
        const filterBookingData = pessengers.filter(item=>item.bookingDate === bookingDate)
        if(filterBookingData) {
          const alreadyBookedSeat = filterBookingData.map(data => data.seatNo);
          setBookedSeats(alreadyBookedSeat)
        }
      }
    }
    fetchPessenerBookings(bookingDate)
  },[bookingDate])

  const handleSeatSelection = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      props.showAlert('This seat is already booked','danger')
    } else {
      setSelectedSeat(seatNumber);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedSeat) {
      props.showAlert('Please select a seat','danger')
      return;
    }
    if(bookingDetails.firstName && bookingDetails.lastName && bookingDetails.email && bookingDate) {
      const data = {
        id:Math.floor(1000 + Math.random() * 9000),
        ...bookingDetails,
        bookingDate,
        seatNo:selectedSeat, 
      }
      // add new booking and save to local storage
      let oldData = localStorage.getItem("passengers") ? JSON.parse(localStorage.getItem("passengers")) : [];
      oldData.push(data);
      localStorage.setItem("passengers",JSON.stringify(oldData))
      
      // Reset booking details and selected seat after submission
      setBookingDetails({
        firstName: '',
        lastName: '',
        email: ''
      });
      setSelectedSeat(null);
      props.showAlert('ticket booked successfully','success')
      navigate('dashboard')
    } else {
      props.showAlert('Please fill all required field','danger')
    }
  };

  return (
    <div className='row mt-5'>
      <div className='col-md-8 bg-light'>
        <h4 className="my-3 text-center">Select Your Seat</h4>
        <div className="row">
          <div class="col-sm-12">
            <div class="deck">
              <h5 class="text-center mb-3">Upper Deck</h5>
              <div className="upper-deck">
                <div className='row'>
                {[...Array(20)].map((_, index) => {
                  const seatNumber = index + 1;
                  const isBooked = bookedSeats.includes(seatNumber);
                  return (
                    <>
                    <div className={`col-md-2 ${seatNumber >=13 &&  seatNumber <=18 ? 'mt-5' : ''}`}>
                      <button key={seatNumber} onClick={() => handleSeatSelection(seatNumber)} type="button" 
                      className={`btn btnseat ${isBooked ? ' btn-dark' : 'btnseat'}`}
                      disabled={isBooked}
                      >{seatNumber}</button>
                    </div>
                    </>
                  );
                })}
                </div>
              </div>
            </div> 
          </div>
          <div class="col-sm-12"> 
            <div class="deck">
              <h5 class="text-center mb-3">Lower Deck</h5>  
              <div className="lower-deck">
                <div className='row'> 
                {[...Array(20)].map((_, index) => {
                  const seatNumber = index + 21;
                  const isBooked = bookedSeats.includes(seatNumber);
                  return (
                    <>
                     <div className={`col-md-2 ${seatNumber >=33 &&  seatNumber <=38 ? 'mt-5' : ''}`}>
                        <button key={seatNumber} onClick={() => handleSeatSelection(seatNumber)} type="button" 
                          className={isBooked ? 'btn btnseat btn-danger' : 'btn btnseat'}
                        >{seatNumber}</button>
                      </div>
                    </>  
                  );
                })}
                </div>
              </div>
            </div>  
          </div>
        </div>
      </div>
      <div className='col-md-4'> 
        <div className="mt-2 booking-form">
          <h4>Booking Form</h4>
          {selectedSeat &&<p>Seat No booked {selectedSeat}</p>}
          <form onSubmit={handleBookingSubmit}>
            <div className="mb-3">
              <label htmlFor="bookingDate" className="form-label">Booking Date</label>
              <input type="date" name="bookingDate" className="form-control" value={bookingDate} id="bookingDate" 
                onChange={(e) => setBooingDate(e.target.value)} aria-describedby="bookingDateHelp" required/>
              <span className="error_bookingDate help-block"></span>
            </div>
            
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input type="text" name="firstName" className="form-control" value={bookingDetails.firstName} id="firstName" 
                onChange={(e) => setBookingDetails({ ...bookingDetails, firstName: e.target.value })} aria-describedby="firstNameHelp" required/>
              <span className="error_firstName help-block"></span>
            </div>
            
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input type="text" name="lastName" className="form-control" value={bookingDetails.lastName} id="lastName" 
                onChange={(e) => setBookingDetails({ ...bookingDetails, lastName: e.target.value })} aria-describedby="lastNameHelp" required/>
              <span className="error_lastName help-block"></span>
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={bookingDetails.email} id="email" 
                onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })} aria-describedby="emailHelp" required/>
              <span className="error_email help-block"></span>
            </div>
            
            <div className="mb-2">
              <button type="submit" className="btn btn-primary">Book Ticket</button>
            </div>
            <br/>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
