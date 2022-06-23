import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Typeahead } from 'react-bootstrap-typeahead'; 
import { connect } from 'react-redux';
import './search-form.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { findFlights } from './../../actions';

const airports = [
  'Pune (PNQ)',
  'Delhi (DEL)',
  'Bengaluru (BLR)',
  'Mumbai (BOM)'
];

const isDate = (date) => {
  return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

const ErrorLabel = (props) => {
  return (<label style={{color: 'red'}}>{props.message}</label>)
}

export const SearchForm = (props) => {
  let origin, destination;
  const [isReturn, setFlightType] = useState(false);
  const [status, setFormValid] = useState({ isValid: false });
  let invalidFields = {};
  //const isReturn = true;
  const handleSubmit = (event) => {
    event.preventDefault();
    const {flights} = props;
    invalidFields = {};
    const criteria = {
      origin: origin.state.text,
      destination: destination.state.text,
      departureDate: event.target.dateOfDep.value,
      numOfPassengers: event.target.numOfPassengers.value
    }

    if (event.target.flightType[1].checked ) {
      criteria.returnDate = event.target.dateOfReturn.value;
      if (!isDate(event.target.dateOfReturn.value)) {
        invalidFields.returnDate = true;
      }
    }

    if (!airports.includes(criteria.origin)) {
      invalidFields.origin = true;
    }
    if (!airports.includes(criteria.destination) || criteria.origin === criteria.destination) {
      invalidFields.destination = true;
    }
    if(!isDate(criteria.departureDate)) {
      invalidFields.departureDate = true;
    }
    if(!isDate(criteria.departureDate)) {
      invalidFields.departureDate = true;
    }
    if(Object.keys(invalidFields).length > 0) {
      setFormValid({isValid: false, ...invalidFields});
      return;
    }
    
    setFormValid({isValid: true});
    props.findFlights({flights, criteria});
  }

  return (
    <Card>
      <Card.Body>
      <Form className="search-form-container" onSubmit={handleSubmit}>
        <Form.Group >
          <Form.Check
            inline
            checked={!isReturn}
            type="radio"
            label="Tek Yön"
            name="flightType"
            id="formHorizontalRadios1"
            onChange={(e)=>setFlightType(false)}
          />
          <Form.Check
            inline
            checked={isReturn}
            type="radio"
            label="Gidiş Dönüş"
            name="flightType"
            id="formHorizontalRadios2"
            onChange={(e)=>setFlightType(true)}
          />
        </Form.Group>

        <Form.Group controlId="formGridOrigin">
          <Typeahead
            labelKey="origin"
            options={airports}
            placeholder="Kalkış Hava Alanı"
            ref={(ref) => origin = ref}
          />
          {status.origin && <ErrorLabel message="Please enter a valid airport"></ErrorLabel>}
        </Form.Group>

        <Form.Group controlId="formGridDestination">
          <Typeahead
            labelKey="destination"
            options={airports}
            placeholder="Hedef Hava Alanı"
            ref={(ref) => destination = ref}
          />
          {status.destination && <ErrorLabel message="Please enter a valid airport but not same as origin"></ErrorLabel>}
        </Form.Group>

        <Form.Group controlId="formGridDateOfDep">
          <Form.Label>Tarih Seçiniz</Form.Label>
          <Form.Control type="date" name="dateOfDep" placeholder="yyyy-mm-dd" required />
          {status.departureDate && <ErrorLabel message="Please enter a valid departure date"></ErrorLabel>}
        </Form.Group>

        {isReturn && <Form.Group controlId="formGridDateOfReturn">
          <Form.Label>Return Date</Form.Label>
          <Form.Control type="date" name="dateOfReturn"  placeholder="yyyy-mm-dd" required />
          {status.returnDate && <ErrorLabel message="Please enter a valid return date"></ErrorLabel>}
        </Form.Group>}

        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Control as="select" name="numOfPassengers" placeholder="Number of Passengers">
            <option>Yolcu Koltuk Numarası</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Ara
        </Button>
        </Form> 
      </Card.Body>
    </Card>
     
  )
}

const mapStateToProps = (state) => ({
  flights: state.flights
})

const mapDispatchToProps = {
  findFlights
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);

