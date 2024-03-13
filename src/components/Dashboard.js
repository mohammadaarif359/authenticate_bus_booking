// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';

const Dashboard = (props) => {
  const [passengers,setPassengers] = useState([])
  const [action, setAction] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(()=>{
    // get the pessenger booking deatils
    const fetchPessengerBookings = () =>{
      const data = JSON.parse(localStorage.getItem('passengers'))
      if(data) {
        console.log('data',data);
        setPassengers(data);
      }
    }
    fetchPessengerBookings();
  },[action])

  const handleBookingEdit = (id) => {
    const passenger = passengers.find(passenger => passenger.id === id);
    if(passenger) {
        setBookingDetails(passenger)
        setShowModal(true);
    } else {
      props.showAlert('booking deatils by this id does not exist','danger')
    }
  };

  const handleBookingUpdate = (e) =>{
    e.preventDefault();
    if(bookingDetails.bookingDate && bookingDetails.firstName && bookingDetails.lastName && bookingDetails.email) {
      // Check the seat avl for updated booking date
      const seatAlreadyBooked = bookingDetails.seatNo.some(seatNo =>
        passengers.some(passenger =>
          passenger.id !== bookingDetails.id &&
          passenger.bookingDate === bookingDetails.bookingDate &&
          passenger.seatNo.includes(seatNo)
        )
      );
      if(seatAlreadyBooked) {
        props.showAlert(`Seat not avl for ${bookingDetails.bookingDate}`,'danger')
        return;
      }
      // Find the index of the item with the given id
      const indexToUpdate = passengers.findIndex(passenger => passenger.id === bookingDetails.id);
      if (indexToUpdate !== -1) {
        // Update the booking details of the passenger
        const updatedPassengers = [...passengers];
        updatedPassengers[indexToUpdate] = {
          ...updatedPassengers[indexToUpdate],
          bookingDate: bookingDetails.bookingDate,
          firstName: bookingDetails.firstName,
          lastName: bookingDetails.lastName,
          email: bookingDetails.email
        };

        
        // Reset booking details and hide the modal
        setBookingDetails(null);
        setShowModal(false);
        // update the current listing data
        setPassengers(updatedPassengers)
        localStorage.setItem('passengers', JSON.stringify(updatedPassengers));
        
      } else {
        props.showAlert('booking deatils by this id does not exist','danger')
      }  
    } else {
      props.showAlert('pls fill all the details')
    }
  }

  const handleDeleteBooking = (id) => {
    // Find the index of the item with the given id
    const indexToDelete = passengers.findIndex(passenger => passenger.id === id);
    if (indexToDelete !== -1) {
      passengers.splice(indexToDelete, 1);
      // Update the local storage with the modified array
      localStorage.setItem('passengers', JSON.stringify(passengers));
      setAction(true)
      props.showAlert('booking cancelled successfully','success')
    } else {
      props.showAlert('booking deatils by this id does not exist','danger')
    }
  }
  return (
    <div className='container'>
      <h2 className='table-heading text-center mt-5'>Passenger List</h2>
      <table className="table table-hover table-hover table-bordered">
        <thead className='bg-light'>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Seat Number</th>
            <th>Date of Booking</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map(passenger => (
            <tr key={passenger.id}>
              <td>{passenger.firstName} {passenger.lastName}</td>
              <td>{passenger.email}</td>
              <td>{passenger.seatNo.toString()}</td>
              <td>{passenger.bookingDate}</td>
              <td>
                <button className="btn btn-info" onClick={() => handleBookingEdit(passenger.id)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDeleteBooking(passenger.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {bookingDetails &&
      <div className={`modal fade ${showModal ? 'in show' : ''}`} id="myModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Edit Ticket Booking</h4>
            </div>
            <div className="modal-body">
              <form onSubmit={handleBookingUpdate}>
                <input type='hidden' name='id' value={setBookingDetails ? setBookingDetails.id : ''}/>
                <div className="mb-3">
                  <label htmlFor="bookingDate" className="form-label">Booking Date</label>
                  <input type="date" name="bookingDate" className="form-control" value={bookingDetails ? bookingDetails.bookingDate : ''} id="bookingDate" 
                    onChange={(e) => setBookingDetails({ ...bookingDetails, bookingDate: e.target.value })} aria-describedby="bookingDateHelp"/>
                  <span className="error_bookingDate help-block"></span>
                </div>
              
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input type="text" name="firstName" className="form-control" value={bookingDetails ? bookingDetails.firstName : ''} id="firstName" 
                    onChange={(e) => setBookingDetails({ ...bookingDetails, firstName: e.target.value })} aria-describedby="firstNameHelp"/>
                  <span className="error_firstName help-block"></span>
                </div>
              
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input type="text" name="lastName" className="form-control" value={bookingDetails ? bookingDetails.lastName : ''} id="lastName" 
                    onChange={(e) => setBookingDetails({ ...bookingDetails, lastName: e.target.value })} aria-describedby="lastNameHelp"/>
                  <span className="error_lastName help-block"></span>
                </div>
              
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" value={bookingDetails ? bookingDetails.email : ''} id="email" 
                    onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })} aria-describedby="emailHelp"/>
                  <span className="error_email help-block"></span>
                </div>
            </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={handleBookingUpdate}>Update</button>
            </div>
          </div>
        </div>    
      </div>}
  </div>
  );
}

export default Dashboard;
